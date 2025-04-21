from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, ServiceRequestSerializer
from .db import MONGO_DB
from .utils import generate_tokens, generate_reset_token, verify_reset_token
from datetime import datetime
from django.contrib.auth.hashers import make_password, check_password
from bson.objectid import ObjectId
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from .permissions import IsProvider, IsUser, IsAdmin  # Import your custom permissions
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from rest_framework.parsers import MultiPartParser, FormParser
import os
from django.core.files.storage import FileSystemStorage
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json

# -------------------------Register, Login, Verify Email-------------------------
class RegisterView(APIView):
    # Allow unauthenticated access
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Validate input data
        data = serializer.validated_data

        # Check if the user already exists
        if MONGO_DB.users.find_one({"email": data["email"]}):
            return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

        verification_token = get_random_string(length=32)  # Generate a random verification token
        # Create user data dictionary with 'is_verified' set to False initially
        user = {
            "user_type": data["user_type"],
            "name": data["name"],
            "email": data["email"],
            "password": make_password(data["password"]),  # Hash the password
            "location": data["location"],
            "phone_num": data["phone_num"],
            "is_verified": False,  # Default to False
            "verification_token": verification_token,  # Store the verification token
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }

        # Insert user into MongoDB with 'is_verified = False'
        result = MONGO_DB.users.insert_one(user)
        user["_id"] = str(result.inserted_id)  # Convert ObjectId to string

        # Send verification email with the token
        verification_link = f"http://localhost:3000/verify-email?token={verification_token}"
        try:
            send_mail(
                subject="Email Verification for ServiceBuddy",
                message=f"Hi {user['name']},\n\nClick the link below to verify your email:\n{verification_link}\n\nIf you did not register, please ignore this email.", 
                from_email=settings.EMAIL_HOST_USER,  # Use default email settings
                recipient_list=[user["email"]]
            )
            return Response({"message": "User registered successfully. Please check your email for verification."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Error sending verification email.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyEmailView(APIView):
    """
    Verify the user's email using the verification token.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        # Try getting verification_token from query parameters or from the body
        verification_token = request.data.get("token") or request.query_params.get("token")
        
        if not verification_token:
            return Response({"error": "Verification token is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Find user by verification token
        user = MONGO_DB.users.find_one({"verification_token": verification_token})
        if not user:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        # Update user's verification status (only if they haven't already been verified)
        if user.get("is_verified"):
            return Response({"message": "Email is already verified."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's status to verified
        MONGO_DB.users.update_one({"_id": user["_id"]}, {"$set": {"is_verified": True}})

        return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)

class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        email = data["email"]
        password = data["password"]
        user_type = data.get("user_type", "user")  # Default to user if not provided

        # Debugging: Print request data
        print(f"DEBUG: Login Attempt -> Email: {email}, UserType: {user_type}")

        # Admin login
        if email == "admin@servicebuddy.com":
            user = MONGO_DB.users.find_one({"email": email})
        # Provider login
        elif user_type == "provider":
            user = MONGO_DB.providers.find_one({"email": email})
        # Normal user login
        else:
            user = MONGO_DB.users.find_one({"email": email, "user_type": user_type})

        # Check if user exists
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check password validity
        if not check_password(password, user["password"]):
            return Response({"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate authentication tokens
        access, refresh = generate_tokens(user)

        # Retrieve the profile picture if it exists
        profile_picture_url = None
        if user.get("profile_picture"):
            profile_picture_url = user["profile_picture"]

        # Redirect based on user type
        redirect_url = "/homepage"
        if user_type == "provider":
            redirect_url = "/provider-dashboard"

        return Response({
            "access": access,
            "refresh": refresh,
            "user": {
                "user_id": str(user["_id"]),
                "email": user["email"],
                "user_type": user["user_type"],
                "name": user["name"],
                "profile_picture": profile_picture_url,
            },
            "redirect_url": redirect_url  # Send redirection URL to frontend
        }, status=status.HTTP_200_OK)

# -------------------------Service Provider Management-------------------------       
class AddServiceProviderView(APIView):
    """
    Allows Admin to register new service providers.
    """
    permission_classes = [IsAdmin]  # Ensure only admin can register providers

    def post(self, request):
        data = request.data.copy()  # Ensure data is mutable
        data["user_type"] = "provider"  # Explicitly set user type as 'provider'

        print("DEBUG: Data before serializer:", data)  # Debugging

        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            print("DEBUG: Validated data:", serializer.validated_data)  # Debugging

            provider = serializer.create(serializer.validated_data)  # Save provider

            return Response(
                {"message": "Service provider added successfully."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminProvidersListView(APIView):
    """
    API endpoint for admin to view all service providers.
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        try:
            # Verify if querying the correct collection
            # Providers should be in users collection with role='provider'
            providers_cursor = MONGO_DB.providers.find(
                {"user_type": "provider"}, 
                {"password": 0}
            )
            
            providers = []
            for provider in providers_cursor:
                # Convert ObjectId and datetime objects
                provider["_id"] = str(provider["_id"])
                if 'date_joined' in provider:
                    provider['date_joined'] = provider['date_joined'].isoformat()
                providers.append(provider)
                
            return Response(providers, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )   

class DeleteProviderView(APIView):
    """
    API endpoint for admin to delete a service provider.
    """
    permission_classes = [IsAdmin]

    def delete(self, request, provider_id):  # FIXED: "delete" instead of "DELETE"
        try:
            # Ensure the provider exists
            if not ObjectId.is_valid(provider_id):  # Validate ObjectId
                return Response({"error": "Invalid provider ID."}, status=status.HTTP_400_BAD_REQUEST)

            provider = MONGO_DB.providers.find_one({"_id": ObjectId(provider_id)})
            if not provider:
                return Response({"error": "Provider not found."}, status=status.HTTP_404_NOT_FOUND)

            # Delete the provider
            MONGO_DB.providers.delete_one({"_id": ObjectId(provider_id)})

            return Response({"message": "Provider deleted successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# -------------------------Service Request Management-------------------------
class ServiceProviderList(APIView):
    """
    API endpoint to fetch service providers based on location and service type.
    """
    permission_classes = [IsUser]  # Ensure only authenticated users can access

    def get(self, request):
        location = request.query_params.get('location')
        service_type = request.query_params.get('service_type')

        query = {"user_type": "provider"} # Only fetch service providers
        if location:
            query["location"] = location  # Match exact location
        
        if service_type:
            query["services_offered"] = {"$in": [service_type]}  # Check if service exists in the array

        service_providers = list(MONGO_DB.providers.find(query))  # Query from users collection, not service_providers
        
        # Convert ObjectIds to strings
        for provider in service_providers:
            provider["_id"] = str(provider["_id"])
            provider["available_time"] = provider.get("available_time", [])

        return Response(service_providers, status=status.HTTP_200_OK)
    
class ServiceRequestCreate(APIView):
    """
    API endpoint to create a service request.
    """
    permission_classes = [IsUser]

    def post(self, request):
        serializer = ServiceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # Convert appointment_date to ISO string
        appointment_date = validated_data.get("appointment_date")
        if appointment_date:
            appointment_date = appointment_date.isoformat()  # e.g., "2025-03-05"

        # Prepare the service request data
        service_request = {
            "user_id": request.user["user_id"],
            "user_name": request.user["name"],
            "provider_id": validated_data["provider_id"],
            "description": validated_data.get("description", ""),
            "location": validated_data["location"],
            "appointment_date": appointment_date,
            "shift_start_time": validated_data["shift_start_time"],  # e.g., "08:00"
            "shift_end_time": validated_data["shift_end_time"],      # e.g., "10:00"
            "payment_method": validated_data.get("payment_method"),
            "status": "pending",
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }

        result = MONGO_DB.service_requests.insert_one(service_request)

        # Create a notification for the provider
        notification = {
            "to": validated_data["provider_id"],
            "type": "service_request",
            "service_request_id": str(result.inserted_id),
            "message": "New service request received.",
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }
        MONGO_DB.notifications.insert_one(notification)

        return Response(
            {
                "request_id": str(result.inserted_id),
                "message": "Service request sent."
            },
            status=status.HTTP_201_CREATED
        )

class ServiceRequestUpdate(APIView):
    """
    API endpoint to update a service request (accept/decline).
    """
    permission_classes = [IsProvider]
    def patch(self, request, request_id):
        action = request.data.get("action")
        if action not in ["accept", "decline"]:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        update_fields = {"status": action, "updated_at": datetime.utcnow() + timedelta(hours=5, minutes=45)}
        MONGO_DB.service_requests.update_one({"_id": ObjectId(request_id)}, {"$set": update_fields})

        # Fetch the updated request
        service_request = MONGO_DB.service_requests.find_one({"_id": ObjectId(request_id)})
        notification = {
            "to": service_request["user_id"],
            "type": "service_request_update",
            "service_request_id": request_id,
            "message": f"Your service request has been {action}ed.",
            "created_at": datetime.utcnow()+ timedelta(hours=5, minutes=45)
        }
        MONGO_DB.notifications.insert_one(notification)
        return Response({"message": f"Service request {action}ed."}, status=status.HTTP_200_OK)

# -------------------------Provider Management-------------------------
class ProviderRequestView(APIView):
    """
    API endpoint for providers to view their service requests.
    """
    permission_classes = [IsProvider]
    
    def get(self, request):
        provider_id = request.user.get("user_id")
        if not provider_id:
            return Response({"error": "Provider ID not found in token."}, status=status.HTTP_400_BAD_REQUEST)

        requests = list(MONGO_DB.service_requests.find({"provider_id": provider_id}).sort("created_at", -1))

        for req in requests:
            req["_id"] = str(req["_id"])
            req["username"] = req.get("user_name", "Unknown")

        return Response(requests, status=status.HTTP_200_OK)
    
class ProviderScheduleView(APIView):
    """
    API endpoint for providers to view their schedule.
    """
    permission_classes = [IsProvider]

    def get(self, request):
        provider_id = request.user.get("user_id")

        bookings = list(MONGO_DB.service_requests.find({
            "provider_id": provider_id,
            "status": { "$regex": "^(accept|Not Started|In Progress|Complete)$", "$options": "i" }
        }).sort("created_at", -1))

        for booking in bookings:
            booking["_id"] = str(booking["_id"])
            booking["user_name"] = booking.get("user_name", "Unknown User")
            booking["appointment_date"] = booking.get("appointment_date", "")
            booking["shift_start_time"] = booking.get("shift_start_time", "")
            booking["shift_end_time"] = booking.get("shift_end_time", "")
            booking["description"] = booking.get("description", "")
            booking["location"] = booking.get("location", "")
            booking["status"] = booking.get("status", "Accepted")

        return Response(bookings)

class UpdateBookingStatusView(APIView):
    """
    API endpoint for providers to update the status of a booking.
    """
    permission_classes = [IsProvider]
    def patch(self, request, request_id):
        new_status = request.data.get("status")
        if new_status not in ["In Progress", "Completed", "Not Completed"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        result = MONGO_DB.service_requests.update_one(
            {"_id": ObjectId(request_id), "status": {"$in": ["accept", "In Progress"]}},
            {"$set": {"status": new_status}}
        )

        if result.matched_count == 0:
            return Response({"error": "Booking not found or not eligible for update"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Status updated successfully"}, status=status.HTTP_200_OK)

class ProviderDashboardSummaryView(APIView):
    """
    API endpoint for providers to view their dashboard summary.
    """
    permission_classes = [IsProvider]

    def get(self, request):
        provider_id = request.user.get("user_id")
        if not provider_id:
            return Response({"error": "Provider not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        total_requests = MONGO_DB.service_requests.count_documents({"provider_id": provider_id})
        jobs_completed = MONGO_DB.service_requests.count_documents({"provider_id": provider_id, "status": "Completed"})
        jobs_in_progress = MONGO_DB.service_requests.count_documents({"provider_id": provider_id, "status": "In Progress"})
        jobs_not_completed = MONGO_DB.service_requests.count_documents({"provider_id": provider_id, "status": "Not Completed"})

        return Response({
            "total_requests": total_requests,
            "jobs_completed": jobs_completed,
            "jobs_in_progress": jobs_in_progress,
            "jobs_not_completed": jobs_not_completed
        }, status=status.HTTP_200_OK)

class MyBookings(APIView):
    """
    API endpoint for users to view their service requests.
    """
    permission_classes = [IsUser]

    def get(self, request):
        user_id = request.user.get("user_id")
        if not user_id:
            return Response({"error": "User not found in token."}, status=status.HTTP_400_BAD_REQUEST)

        bookings = list(MONGO_DB.service_requests.find({"user_id": user_id}).sort("created_at", -1))
        results = []

        for booking in bookings:
            provider_id = booking.get("provider_id")
            try:
                provider = MONGO_DB.providers.find_one({"_id": ObjectId(provider_id)})
            except Exception:
                provider = None
            provider_name = provider["name"] if provider and "name" in provider else "Unknown"

            # Format appointment date
            appointment_date = booking.get("appointment_date")
            appointment_date_str = ""
            if isinstance(appointment_date, datetime):
                appointment_date_str = appointment_date.strftime("%Y-%m-%d")
            elif isinstance(appointment_date, str):
                appointment_date_str = appointment_date

            # Handle shift times
            shift_start = booking.get("shift_start_time", "")
            shift_end = booking.get("shift_end_time", "")
            time_shift = f"{shift_start} - {shift_end}" if shift_start and shift_end else "N/A"

            payment_method = booking.get("payment_method", "Not Provided")

            results.append({
                "request_id": str(booking["_id"]),
                "provider_id": provider_id,
                "provider_name": provider_name,
                "requested_service": booking.get("description", ""),
                "appointment_date": appointment_date_str,
                "time_shift": time_shift,
                "payment_method": payment_method,
                "status": booking.get("status", "")
            })

        return Response(results, status=status.HTTP_200_OK)

# -------------------------Admin Management-------------------------
class AdminProviderView(APIView):
    """
    API endpoint for admin to manage service providers.
    """
    permission_classes = [IsAdmin];
    
    def post(self, request):
        data = request.data
        #Validate Data fields 
        for field in ["name", "email", "password", "location", "services_offered"]:
            if field not in data:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        #Force user_type as provider and mark as handpicked
        provider = {
            "name": data["name"],
            "email": data["email"],
            "password": data["password"],
            "user_type": "provider",
            "location": data["location"],
            "services_offered": data["services_offered"],
            "handpicked": True,
        }
        result = MONGO_DB.users.insert_one(provider)
        provider["_id"] = str(result.inserted_id)
        return Response({"message": "Provider Added Successfully!", "provider": provider}, status=status.HTTP_201_CREATED)
    
    def put(self, request, provider_id):
        """
        Update an Existing Provider.
        """
        data = request.data
        update_fields = {key: data[key] for key in data}
        result = MONGO_DB.users.update_one({"_id": ObjectId(provider_id)}, {"$set": update_fields})
        
        if result.modified_count:
            return Response({"message": "Provider updated Successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Provider not found! or no changes were made!"}, status=status.HTTP_400_BAD_REQUEST)

class AdminRequestsView(APIView):
    """
    API endpoint for admin to view all service requests.
    """
    permission_classes = [IsAdmin]
    
    def get(self, request):
        request_cursor = MONGO_DB.service_requests.find({})
        request_list = []
        for req in request_cursor:
            req["_id"] = str(req["_id"])
            request_list.append(req)
        return Response(request_list, status=status.HTTP_200_OK)
        
# -------------------------Bill Generation-------------------------
class BillGeneration(APIView):
    """
    API endpoint for generating bills for service requests.
    """
    permission_classes = []

    def post(self, request):
        data = request.data

        # Ensure request_id exists
        if "request_id" not in data:
            return Response({"error": "request_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            request_id = ObjectId(data["request_id"])  # Convert request_id to ObjectId
        except:
            return Response({"error": "Invalid request_id format."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the service request details
        service_request = MONGO_DB.service_requests.find_one({"_id": request_id})
        if not service_request:
            return Response({"error": "No matching service request found."}, status=status.HTTP_400_BAD_REQUEST)

        # Get user details
        user = MONGO_DB.users.find_one({"_id": ObjectId(service_request["user_id"])})
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure required fields exist
        required_fields = ["charges", "total", "payment_method"]
        for field in required_fields:
            if field not in data:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create bill data
        bill = {
            "request_id": request_id,
            "user_id": service_request["user_id"],
            "name": user["name"],  # Fetch the user's name
            "provider_id": service_request["provider_id"],
            "charges": data["charges"],
            "supplements": data.get("supplements", []),
            "total": data["total"],
            "payment_method": data["payment_method"],
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }

        # Insert bill into MongoDB
        result = MONGO_DB.bills.insert_one(bill)

        return Response({
            "message": "Bill generated successfully.",
            "bill_id": str(result.inserted_id)
        }, status=status.HTTP_201_CREATED)

# -------------------------Token Management-------------------------
class RefreshTokenView(APIView):
    """
    API endpoint to refresh access tokens using refresh tokens.
    """
    authentication_classes = []  # No authentication required for this endpoint.
    permission_classes = []

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response({"error": "Refresh token expired."}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate a new access token (you may want to update the expiration time)
        new_payload = {
            "user_id": payload["user_id"],
            "email": payload["email"],
            "user_type": payload["user_type"],
            "exp": datetime.utcnow() + timedelta(minutes=30)
        }
        new_access_token = jwt.encode(new_payload, settings.SECRET_KEY, algorithm="HS256")
        return Response({"access": new_access_token}, status=status.HTTP_200_OK)

# -------------------------Password Management-------------------------
class RequestPasswordResetView(APIView):
    """
    API endpoint to request a password reset link.
    """   
    # Allow unauthenticated access
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Find user by email (assuming they are stored in the "users" collection)
        user = MONGO_DB.users.find_one({"email": email})
        if not user:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Generate reset token
        token = generate_reset_token(user)

        # Construct password reset link (adjust the frontend URL accordingly)
        reset_link = f"http://localhost:3000/reset-password?token={token}"

        # Send email
        subject = "Password Reset Request for ServiceBuddy"
        message = f"Hi {user['name']},\n\nClick the link below to reset your password:\n{reset_link}\n\nThis link expires in 30 minutes.\n\nIf you did not request a password reset, please ignore this email."
        send_mail(subject, message, None, [email])

        return Response({"message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)
    
class PasswordResetConfirmView(APIView):
    """
    API endpoint to confirm password reset using the token.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("new_password")
        if not token or not new_password:
            return Response({"error": "Token and new_password are required."}, status=status.HTTP_400_BAD_REQUEST)

        payload = verify_reset_token(token)
        if not payload:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user_id = payload.get("user_id")
        # Update the user's password in MongoDB (ensure to hash it)
        result = MONGO_DB.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": make_password(new_password)}}
        )

        if result.modified_count:
            return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to reset password."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# -------------------------Profile Management-------------------------

# This is working for user only.
# class ProfileView(APIView):
#     """
#     API endpoint for users and providers to view and update their profiles.
#     """
#     permission_classes = [IsAdmin | IsUser | IsProvider]
#     parser_classes = [MultiPartParser, FormParser]  # ✅ Add this to support file uploads
    
#     def get(self, request):
#         user_id = request.user.get("user_id")
#         if not user_id:
#             return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

#         user = MONGO_DB.users.find_one({"_id": ObjectId(user_id)})
#         if not user:
#             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#         user["_id"] = str(user["_id"])
#         return Response(user, status=status.HTTP_200_OK)

#     def post(self, request):
#         user = request.user
#         data = request.data

#         print("FILES:", request.FILES)
#         print("DATA:", request.data)

#         if isinstance(user, dict):
#             user_id = user.get("_id") or user.get("id") or user.get("user_id")
#         else:
#             user_id = getattr(user, "id", None)

#         try:
#             user_obj_id = ObjectId(user_id)
#         except Exception as e:
#             print("Invalid ObjectId:", e)
#             return Response({"error": "Invalid user ID"}, status=400)

#         update_fields = {
#             "name": data.get("name"),
#             "email": data.get("email"),
#             "phone_num": data.get("phone_num"),
#             "location": data.get("location"),
#         }

#         profile_picture = request.FILES.get("profile_picture")
#         if profile_picture:
#             file_name = f"profile_pics/{profile_picture.name}"
#             fs = FileSystemStorage()
#             file_path = fs.save(file_name, ContentFile(profile_picture.read()))
            
#             # Generate full URL including hostname
#             image_url = request.build_absolute_uri(settings.MEDIA_URL + file_path)
#             update_fields["profile_picture"] = image_url
#             print("Set profile picture URL:", image_url)

#         update_fields = {k: v for k, v in update_fields.items() if v is not None}

#         print("User Object ID:", user_obj_id)
#         print("User Type:", user.get("user_type"))
#         print("Update Fields:", update_fields)

#         if update_fields:
#             if user.get("user_type") == "provider":
#                 collection = MONGO_DB.providers
#             else:
#                 collection = MONGO_DB.users

#             collection.update_one({"_id": user_obj_id}, {"$set": update_fields})
            
#             # Get updated user to verify changes
#             updated_user = collection.find_one({"_id": user_obj_id})
#             print("Updated user document:", updated_user)
            
#             # Clean up _id for response
#             if updated_user:
#                 updated_user["_id"] = str(updated_user["_id"])
#                 # Return the full updated user object
#                 return Response(updated_user, status=status.HTTP_200_OK)
            
#             return Response({"message": "Profile updated"}, status=status.HTTP_200_OK)

#         print("FAILED TO UPDATE PROFILE")
#         return Response({"error": "Invalid update"}, status=status.HTTP_400_BAD_REQUEST)

#for both users and providers
class ProfileView(APIView):
    permission_classes = [IsAdmin | IsUser | IsProvider]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        user_id = request.user.get("user_id")
        if not user_id:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        # Determine collection based on user type
        if request.user.get("user_type") == "provider":
            collection = MONGO_DB.providers
        else:
            collection = MONGO_DB.users

        user = collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user["_id"] = str(user["_id"])
        return Response(user, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        data = request.data

        print("FILES:", request.FILES)
        print("DATA:", request.data)

        if isinstance(user, dict):
            user_id = user.get("_id") or user.get("id") or user.get("user_id")
        else:
            user_id = getattr(user, "id", None)

        try:
            user_obj_id = ObjectId(user_id)
        except Exception as e:
            print("Invalid ObjectId:", e)
            return Response({"error": "Invalid user ID"}, status=400)

        # Basic fields common to both users and providers
        update_fields = {
            "name": data.get("name"),
            "email": data.get("email"),
            "phone_num": data.get("phone_num"),
            "location": data.get("location"),
        }

        # Handle profile picture
        profile_picture = request.FILES.get("profile_picture")
        if profile_picture:
            file_name = f"profile_pics/{profile_picture.name}"
            fs = FileSystemStorage()
            file_path = fs.save(file_name, ContentFile(profile_picture.read()))
            image_url = request.build_absolute_uri(settings.MEDIA_URL + file_path)
            update_fields["profile_picture"] = image_url
            print("Set profile picture URL:", image_url)

        # Provider-specific fields
        if user.get("user_type") == "provider":
            # Handle available_time if provided
            available_time = data.get("available_time")
            if available_time:
                try:
                    # If available_time is a string (JSON), parse it
                    if isinstance(available_time, str):
                        available_time = json.loads(available_time)
                    update_fields["available_time"] = available_time
                except Exception as e:
                    print("Error parsing available time:", e)
                    return Response({"error": "Invalid available time format"}, status=400)

            # Handle services_offered if provided
            services_offered = data.get("services_offered")
            if services_offered:
                try:
                    # Debug log
                    print("Services offered received:", services_offered, type(services_offered))
                    # If services_offered is a string (JSON), parse it
                    if isinstance(services_offered, str):
                        services_offered = json.loads(services_offered)
                    update_fields["services_offered"] = services_offered
                    
                    # Debug log
                    print("Processed services_offered:", update_fields["services_offered"])     
                               
                except Exception as e:
                    print("Error parsing services offered:", e)
                    return Response({"error": "Invalid services offered format"}, status=400)
                
            # Handle experience if provided
            experience = data.get("experience")
            if experience:
                update_fields["experience"] = experience
                
            # Handle rate_per_hour if provided
            rate_per_hour = data.get("rate_per_hour")
            if rate_per_hour:
                update_fields["rate_per_hour"] = rate_per_hour

        # Remove None values
        update_fields = {k: v for k, v in update_fields.items() if v is not None}

        print("User Object ID:", user_obj_id)
        print("User Type:", user.get("user_type"))
        print("Update Fields:", update_fields)

        if update_fields:
            if user.get("user_type") == "provider":
                collection = MONGO_DB.providers
            else:
                collection = MONGO_DB.users

            collection.update_one({"_id": user_obj_id}, {"$set": update_fields})
            
            # Get updated user to verify changes
            updated_user = collection.find_one({"_id": user_obj_id})
            print("Updated user document:", updated_user)
            
            if updated_user:
                updated_user["_id"] = str(updated_user["_id"])
                return Response(updated_user, status=status.HTTP_200_OK)
            
            return Response({"message": "Profile updated"}, status=status.HTTP_200_OK)

        print("FAILED TO UPDATE PROFILE")
        return Response({"error": "Invalid update"}, status=status.HTTP_400_BAD_REQUEST)