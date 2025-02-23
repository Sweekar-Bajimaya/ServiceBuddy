from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, ServiceRequestSerializer
from .db import MONGO_DB
from .utils import generate_tokens, generate_reset_token, verify_reset_token
from datetime import datetime
from django.contrib.auth.hashers import make_password, check_password
from bson.objectid import ObjectId
from rest_framework.permissions import IsAuthenticated
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from .permissions import IsProvider, IsUser  # Import your custom permissions
from django.core.mail import send_mail

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

        # Create user data dictionary
        user = {
            "user_type": data["user_type"],
            "name": data["name"],
            "email": data["email"],
            "password": make_password(data["password"]),  # Hash the password
            "location": data["location"],
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }

        # Only add services_offered if user_type is 'provider'
        if data["user_type"] == "provider":
            user["services_offered"] = data["services_offered"]

        # Insert user into MongoDB
        result = MONGO_DB.users.insert_one(user)
        user["_id"] = str(result.inserted_id)  # Convert ObjectId to string

        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    # Allow unauthenticated access
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = MONGO_DB.users.find_one({"email": data["email"]})
        if not user or not check_password(data["password"], user["password"]):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        access, refresh = generate_tokens(user)
        return Response({
            "access": access,
            "refresh": refresh,
            "user": {
                "user_id": str(user["_id"]),
                "email": user["email"],
                "user_type": user["user_type"],
                "name": user["name"]
            }
        }, status=status.HTTP_200_OK)
               

class AddServiceView(APIView):
    # Only providers are allowed to add services to their list.
    permission_classes = [IsProvider]

    def post(self, request):
        # Expecting a JSON payload with a "service" field.
        new_service = request.data.get('service')
        if not new_service:
            return Response({"error": "Service field is required."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Get provider id from the token (this assumes your JWT authentication sets request.user)
        provider_id = request.user.get("user_id")
        if not provider_id:
            return Response({"error": "Provider identification missing."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Use $addToSet to add the new service (ensures no duplicates)
        result = MONGO_DB.service_providers.update_one(
            {"_id": ObjectId(provider_id)},
            {"$addToSet": {"services_offered": new_service}}
        )

        if result.modified_count:
            return Response({"message": "Service added successfully."},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "Service already exists or no changes made."},
                            status=status.HTTP_200_OK)

class ServiceProviderList(APIView):
    permission_classes = [IsUser]  # Ensure only authenticated users can access

    def get(self, request):
        location = request.query_params.get('location')
        service_type = request.query_params.get('service_type')

        query = {"user_type": "provider"} # Only fetch service providers
        if location:
            query["location"] = location  # Match exact location
        
        if service_type:
            query["services_offered"] = {"$in": [service_type]}  # Check if service exists in the array

        providers = list(MONGO_DB.users.find(query))  # Query from users collection, not service_providers
        
        # Convert ObjectIds to strings
        for provider in providers:
            provider["_id"] = str(provider["_id"])

        return Response(providers, status=status.HTTP_200_OK)
    

class ServiceRequestCreate(APIView):
    permission_classes = [IsUser]
    def post(self, request):
        serializer = ServiceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        
        # Prepare the service request data
        service_request = {
            "user_id": request.user["user_id"],
            "provider_id": validated_data["provider_id"],
            "description": validated_data.get("description", ""),
            "status": "pending",
            "appointment_date": validated_data.get("appointment_date"),  # Can be None if not provided
            "appointment_time": validated_data.get("appointment_time"),  # Can be None if not provided
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }
        result = MONGO_DB.service_requests.insert_one(service_request)
        
        # Create a notification for the provider.
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

# servicebuddy_app/views.py (continued)
class ServiceRequestUpdate(APIView):
    permission_classes = [IsProvider]
    def patch(self, request, request_id):
        action = request.data.get("action")
        if action not in ["accept", "decline"]:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        update_fields = {"status": action, "updated_at": datetime.utcnow() + timedelta(hours=5, minutes=45)}
        MONGO_DB.service_requests.update_one({"_id": ObjectId(request_id)}, {"$set": update_fields})

        # Notify the user who created the request.
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


class BillGeneration(APIView):
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


# servicebuddy_app/views.py (add this)
class RefreshTokenView(APIView):
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

class MyBookings(APIView):
    permission_classes = [IsUser]

    def get(self, request):
        # Get the logged-in user's id (assumed to be stored as a string in the JWT payload)
        user_id = request.user.get("user_id")
        if not user_id:
            return Response({"error": "User not found in token."}, status=status.HTTP_400_BAD_REQUEST)

        # Query service_requests where the user_id matches the logged-in user.
        bookings = list(MONGO_DB.service_requests.find({"user_id": user_id}))

        results = []
        for booking in bookings:
            provider_id = booking.get("provider_id")
            # Convert provider_id to ObjectId if it's not already; handle if conversion fails
            try:
                provider = MONGO_DB.users.find_one({"_id": ObjectId(provider_id)})
            except Exception:
                provider = None
            provider_name = provider["name"] if provider and "name" in provider else "Unknown"

            # Use appointment_date if available; otherwise, fallback to created_at.
            appointment_date = booking.get("appointment_date", booking.get("created_at"))
            
            results.append({
                "request_id": str(booking["_id"]),
                "provider_id": provider_id,
                "provider_name": provider_name,
                "requested_service": booking.get("description", ""),
                "appointment_date": appointment_date,
                "status": booking.get("status", "")
            })

        return Response(results, status=status.HTTP_200_OK)


class RequestPasswordResetView(APIView):
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