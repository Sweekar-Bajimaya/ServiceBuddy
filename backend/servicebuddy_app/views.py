from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, ServiceRequestSerializer, ReviewSerializer, ContactQuerySerializer
from .db import MONGO_DB
from .utils import generate_tokens, generate_reset_token, verify_reset_token
from datetime import datetime
from django.contrib.auth.hashers import make_password, check_password
from bson.objectid import ObjectId
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from .permissions import IsProvider, IsUser, IsAdmin  # Import your custom permissions
from django.core.mail import send_mail, EmailMessage
from django.utils.crypto import get_random_string
from rest_framework.parsers import MultiPartParser, FormParser
# import os
from django.core.files.storage import FileSystemStorage
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
import random
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from io import BytesIO
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from collections import Counter
from pymongo import ASCENDING

# -------------------------Register, Login, Verify Email-------------------------
class RegisterView(APIView):
    """
    API endpoint for user registration.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if MONGO_DB.users.find_one({"email": data["email"]}):
            return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

        user_type = data["user_type"]
        email = data["email"]

        # Admin and Provider: Auto-verified, no OTP
        if user_type == "provider" or email == "admin@servicebuddy.com":
            user = {
                "user_type": user_type,
                "name": data["name"],
                "email": email,
                "password": make_password(data["password"]),
                "location": data["location"],
                "phone_num": data["phone_num"],
                "is_verified": True,
                "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
            }

            MONGO_DB.users.insert_one(user)
            return Response({"message": f"{user_type.capitalize()} registered successfully without email verification."}, status=status.HTTP_201_CREATED)

        # Normal User: OTP verification required
        otp = str(random.randint(100000, 999999))

        user = {
            "user_type": user_type,
            "name": data["name"],
            "email": email,
            "password": make_password(data["password"]),
            "location": data["location"],
            "phone_num": data["phone_num"],
            "is_verified": False,
            "otp": otp,
            "otp_expiry": datetime.utcnow() + timedelta(minutes=5),
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }

        result = MONGO_DB.users.insert_one(user)
        user["_id"] = str(result.inserted_id)

        try:
            send_mail(
                subject="Your ServiceBuddy OTP Code",
                message=f"Hi {user['name']},\n\nYour OTP code is: {otp}\nIt is valid for 5 minutes.\n\nIf you did not register, please ignore this email.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )
            return Response({"message": "User registered successfully. Please check your email for the OTP code."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Error sending OTP email.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    """
    API endpoint to verify OTP for email verification.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        record = MONGO_DB.users.find_one({"otp": otp, "email": email})

        if not record:
            return Response({"error": "OTP not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Ensure otp_expiry is a datetime object
        otp_expiry = record.get("otp_expiry")
        if isinstance(otp_expiry, str):
            otp_expiry = datetime.fromisoformat(otp_expiry)

        if record["otp"] != otp:
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        if datetime.utcnow() > otp_expiry:
            return Response({"error": "OTP expired."}, status=status.HTTP_400_BAD_REQUEST)

        # Mark both OTP and user as verified
        MONGO_DB.users.update_one({"email": email}, {"$set": {"is_verified": True}})
        MONGO_DB.users.update_one({"email": email}, {"$set": {"is_verified": True}})

        return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)

class LoginView(APIView):
    """
    API endpoint for user login.
    """
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

        # Require email verification only for normal users
        if user_type not in ["provider"] and email != "admin@servicebuddy.com":
            if not user.get("is_verified", False):
                return Response({"error": "Please verify your email before logging in."}, status=status.HTTP_403_FORBIDDEN)

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

        # Check if the email already exists
        if MONGO_DB.providers.find_one({"email": data["email"]}):
            return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)
            
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

# version 1.0
# class ServiceRequestCreate(APIView):
#     """
#     API endpoint to create a service request.
#     """
#     permission_classes = [IsUser]

#     def post(self, request):
#         serializer = ServiceRequestSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         validated_data = serializer.validated_data

#         # Convert appointment_date to ISO string
#         appointment_date = validated_data.get("appointment_date")
#         if appointment_date:
#             appointment_date_str = appointment_date.isoformat()  # e.g., "2025-03-05"
#         else:
#             return Response({"error": "Appointment date is required."}, status=400)

#         provider_id = validated_data["provider_id"]
#         shift_start = validated_data["shift_start_time"]
#         shift_end = validated_data["shift_end_time"]

#         # # ✅ Check if the provider already has a booking for the same date and shift
#         # conflict = MONGO_DB.service_requests.find_one({
#         #     "provider_id": provider_id,
#         #     "appointment_date": appointment_date_str,
#         #     "shift_start_time": shift_start,
#         #     "shift_end_time": shift_end,
#         #     "status": {"$in": ["pending", "accept"]},
#         # })

#         # if conflict:
#         #     return Response(
#         #         {"error": "This shift is already booked for the selected date."},
#         #         status=status.HTTP_409_CONFLICT
#         #     )

#         # Prepare the service request data
#         service_request = {
#             "user_id": request.user["user_id"],
#             "user_name": request.user["name"],
#             "provider_id": provider_id,
#             "description": validated_data.get("description", ""),
#             "location": validated_data["location"],
#             "appointment_date": appointment_date_str,
#             "shift_start_time": shift_start,  # e.g., "08:00"
#             "shift_end_time": shift_end,      # e.g., "10:00"
#             "payment_method": validated_data.get("payment_method"),
#             "status": "pending",
#             "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
#         }

#         result = MONGO_DB.service_requests.insert_one(service_request)

#         # Create a notification for the provider
#         notification = {
#             "to": provider_id,
#             "type": "service_request",
#             "service_request_id": str(result.inserted_id),
#             "message": "New service request received.",
#             "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
#         }
#         MONGO_DB.notifications.insert_one(notification)

#         return Response(
#             {
#                 "request_id": str(result.inserted_id),
#                 "message": "Service request sent."
#             },
#             status=status.HTTP_201_CREATED
#         )

# Version 2.0
# class ServiceRequestCreate(APIView):
#     """
#     API endpoint to create a service request.
#     Prevents double bookings by checking if the provider already has a booking for the same date and shift.
#     """
#     permission_classes = [IsUser]

#     def post(self, request):
#         serializer = ServiceRequestSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         validated_data = serializer.validated_data

#         # Format appointment date
#         appointment_date = validated_data.get("appointment_date")
#         if not appointment_date:
#             return Response({"error": "Appointment date is required."}, status=400)
#         appointment_date_str = appointment_date.isoformat()

#         provider_id = validated_data["provider_id"]
#         shift_start = validated_data["shift_start_time"]
#         shift_end = validated_data["shift_end_time"]

#         # ✅ Prevent double-booking: check for existing request
#         conflict = MONGO_DB.service_requests.find_one({
#             "provider_id": provider_id,
#             "appointment_date": appointment_date_str,
#             "shift_start_time": shift_start,
#             "shift_end_time": shift_end,
#             "status": {"$in": ["pending", "accepted"]}  # block unconfirmed or active bookings
#         })

#         if conflict:
#             return Response(
#                 {"error": "This shift is already booked for the selected date."},
#                 status=status.HTTP_409_CONFLICT
#             )

#         # Proceed to insert new service request
#         service_request = {
#             "user_id": request.user["user_id"],
#             "user_name": request.user["name"],
#             "provider_id": provider_id,
#             "description": validated_data.get("description", ""),
#             "location": validated_data["location"],
#             "appointment_date": appointment_date_str,
#             "shift_start_time": shift_start,
#             "shift_end_time": shift_end,
#             "payment_method": validated_data.get("payment_method"),
#             "status": "pending",
#             "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
#         }

#         result = MONGO_DB.service_requests.insert_one(service_request)

#         # Notify provider
#         notification = {
#             "to": provider_id,
#             "type": "service_request",
#             "service_request_id": str(result.inserted_id),
#             "message": "New service request received.",
#             "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
#         }
#         MONGO_DB.notifications.insert_one(notification)

#         return Response(
#             {
#                 "request_id": str(result.inserted_id),
#                 "message": "Service request sent."
#             },
#             status=status.HTTP_201_CREATED
#         )

class ServiceRequestCreate(APIView):
    """
    API endpoint to create a service request.
    Prevents double bookings by checking if the provider already has a booking for the same date and shift,
    regardless of which user made the booking.
    """
    permission_classes = [IsUser]

    def post(self, request):
        serializer = ServiceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # Format appointment date
        appointment_date = validated_data.get("appointment_date")
        if not appointment_date:
            return Response({"error": "Appointment date is required."}, status=400)
        appointment_date_str = appointment_date.isoformat()

        provider_id = validated_data["provider_id"]
        shift_start = validated_data["shift_start_time"]
        shift_end = validated_data["shift_end_time"]

        # ✅ Enhanced conflict check: Look for ANY booking with this provider, date, and time
        # This will prevent multiple users from booking the same slot
        conflict = MONGO_DB.service_requests.find_one({
            "provider_id": provider_id,
            "appointment_date": appointment_date_str,
            "shift_start_time": shift_start,
            "shift_end_time": shift_end,
            "status": {"$in": ["pending", "accept"]}  # block unconfirmed or active bookings
        })

        if conflict:
            # Check if this is the same user trying to book again
            if conflict["user_id"] == request.user["user_id"]:
                return Response(
                    {"error": "You have already booked this shift for the selected date."},
                    status=status.HTTP_409_CONFLICT
                )
            else:
                return Response(
                    {"error": "This shift is already booked for the selected date by another user."},
                    status=status.HTTP_409_CONFLICT
                )

        # Proceed to insert new service request
        service_request = {
            "user_id": request.user["user_id"],
            "user_name": request.user["name"],
            "provider_id": provider_id,
            "description": validated_data.get("description", ""),
            "location": validated_data["location"],
            "appointment_date": appointment_date_str,
            "shift_start_time": shift_start,
            "shift_end_time": shift_end,
            "payment_method": validated_data.get("payment_method"),
            "status": "pending",
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }

        result = MONGO_DB.service_requests.insert_one(service_request)

        # Notify provider
        notification = {
            "to": provider_id,
            "type": "service_request",
            "service_request_id": str(result.inserted_id),
            "message": "New service request received.",
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }
        MONGO_DB.notifications.insert_one(notification)
        
        # ✅ Real-time WebSocket push to provider
        send_notification_to_user(
            user_id=provider_id,
            message="You have a new service request.",
            request_id=str(result.inserted_id),
            notif_type="info",
            created_at=notification["created_at"].isoformat()
        )

        return Response(
            {
                "request_id": str(result.inserted_id),
                "message": "Service request sent."
            },
            status=status.HTTP_201_CREATED
        )
        
class ServiceRequestUpdate(APIView):
    permission_classes = [IsProvider]

    def patch(self, request, request_id):
        action = request.data.get("action")
        if action not in ["accept", "decline"]:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        update_fields = {
            "status": action,
            "updated_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }
        MONGO_DB.service_requests.update_one({"_id": ObjectId(request_id)}, {"$set": update_fields})

        # Fetch the updated request
        service_request = MONGO_DB.service_requests.find_one({"_id": ObjectId(request_id)})
        user_id = service_request["user_id"]

        # Build message
        action_message = f"Your service request has been {action}ed."
        timestamp = datetime.utcnow() + timedelta(hours=5, minutes=45)

        # Save to DB
        MONGO_DB.notifications.insert_one({
            "to": user_id,
            "type": "service_request_update",
            "service_request_id": request_id,
            "message": action_message,
            "created_at": timestamp
        })

        # Send real-time WebSocket notification
        send_notification_to_user(
            user_id=user_id,
            message=action_message,
            request_id=request_id,
            notif_type="success" if action == "accept" else "info",
            created_at=timestamp.isoformat()
        )

        return Response({"message": f"Service request {action}ed."}, status=status.HTTP_200_OK)

    

def send_notification_to_user(user_id, message, request_id, notif_type="info", created_at=None):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_user_{user_id}",
        {
            "type": "send_notification",
            "notification": {
                "type": notif_type,
                "message": message,
                "service_request_id": str(request_id),
                "created_at": created_at
            }
        }
    )

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

        service_request = MONGO_DB.service_requests.find_one({"_id": ObjectId(request_id)})
        if not service_request:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        result = MONGO_DB.service_requests.update_one(
            {"_id": ObjectId(request_id), "status": {"$in": ["accept", "In Progress"]}},
            {"$set": {"status": new_status}}
        )

        if result.matched_count == 0:
            return Response({"error": "Booking not eligible for update"}, status=status.HTTP_404_NOT_FOUND)

        user_id = service_request["user_id"]
        timestamp = datetime.utcnow() + timedelta(hours=5, minutes=45)

        # Send notification to user
        notif_type = "info"
        message = ""
        
        if new_status == "In Progress":
            message = "Your service request is now in progress."
        elif new_status == "Completed":
            message = "Your service has been completed. A bill has been generated and sent to your email."
            notif_type = "success"
        else:
            message = "Your service request has not been completed."
            notif_type = "warning"

        # Save notification in DB
        MONGO_DB.notifications.insert_one({
            "to": user_id,
            "type": "service_status_update",
            "service_request_id": str(request_id),
            "message": message,
            "created_at": timestamp
        })

        # Send WebSocket notification
        send_notification_to_user(
            user_id=user_id,
            message=message,
            request_id=request_id,
            notif_type=notif_type,
            created_at=timestamp.isoformat()
        )

        if new_status == "Completed":
            try:
                user = MONGO_DB.users.find_one({"_id": ObjectId(service_request["user_id"])})
                provider = MONGO_DB.providers.find_one({"_id": ObjectId(service_request["provider_id"])})
                
                if not user or not provider:
                    return Response({"error": "User or Provider not found."}, status=status.HTTP_400_BAD_REQUEST)

                from django.utils.crypto import get_random_string
                bill_id = f"BILL-{timezone.now().strftime('%Y%m%d')}-{get_random_string(6).upper()}"
                service_charge = 1000

                bill = {
                    "bill_id": bill_id,
                    "request_id": str(request_id),
                    "user_id": service_request["user_id"],
                    "user_name": user["name"],
                    "user_email": user["email"],
                    "provider_id": service_request["provider_id"],
                    "provider_name": provider["name"],
                    "provider_email": provider["email"],
                    "services_performed": service_request.get("description", ""),
                    "service_charge": service_charge,
                    "total": service_charge,
                    "payment_method": service_request.get("payment_method", "Cash"),
                    "created_at": timestamp
                }

                MONGO_DB.bills.insert_one(bill)

                pdf_file = self.generate_bill_pdf(bill)
                if pdf_file:
                    self.send_bill_email(bill, pdf_file)

            except Exception as e:
                print(f"Error generating bill: {str(e)}")

        return Response({"message": "Status updated successfully"}, status=status.HTTP_200_OK)
    
    def generate_bill_pdf(self, bill_data):
        """
        Generate PDF for the bill.
        """
        from django.template.loader import render_to_string
        from io import BytesIO
        from xhtml2pdf import pisa
        
        template_path = 'invoice_template.html'
        context = {'bill': bill_data}
        
        try:
            html = render_to_string(template_path, context)
            result = BytesIO()
            pisa_status = pisa.CreatePDF(html, dest=result)
            if pisa_status.err:
                print(f"PDF generation error: {pisa_status.err}")
                return None
            return result
        except Exception as e:
            print(f"Error in generate_bill_pdf: {str(e)}")
            return None

    def send_bill_email(self, bill, pdf_data):
        """
        Send the bill PDF to user and provider via email.
        """
        from django.core.mail import EmailMessage
        from django.conf import settings
        
        try:
            subject = f"ServiceBuddy Bill - {bill['bill_id']}"
            body = f"""
            Dear {bill['user_name']},
            
            Thank you for using ServiceBuddy. Your service request has been completed.
            
            Please find attached the bill for the services performed. 
            
            Bill ID: {bill['bill_id']}
            Service: {bill['services_performed']}
            Total Amount: NPR {bill['total']}
            
            If you have any questions about this bill, please contact us.
            
            Regards,
            ServiceBuddy Team
            """
            
            email = EmailMessage(
                subject,
                body,
                settings.EMAIL_HOST_USER,
                [bill["user_email"], bill["provider_email"]]
            )
            
            email.attach(f"bill_{bill['bill_id']}.pdf", pdf_data.getvalue(), 'application/pdf')
            email.send()
            return True
        except Exception as e:
            print(f"Error in send_bill_email: {str(e)}")
            return False

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

class AdminDashboardSummaryView(APIView):
    """
    API endpoint for Admin to view their dashboard summary.
    """
    permission_classes = [IsAdmin]  # Add your IsAdmin permission here if needed

    def get(self, request):
        try:
            total_users = MONGO_DB.users.count_documents({"user_type": "user"})
            total_providers = MONGO_DB.providers.count_documents({"user_type": "provider"})
            total_service_requests = MONGO_DB.service_requests.count_documents({})
            total_bills = MONGO_DB.bills.count_documents({})

            data = {
                "total_users": total_users,
                "total_providers": total_providers,
                "total_service_requests": total_service_requests,
                "total_bills": total_bills
            }
            
            # Use direct HTTP status code instead of status object
            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AdminChartDataView(APIView):
    """
    API endpoint for admin to get chart data for service requests.
    """
    permission_classes = [IsAdmin]  # Add your IsAdmin permission here if needed

    def get(self, request):
        try:
            # Get the last 7 days
            today = datetime.utcnow() + timedelta(hours=5, minutes=45)
            last_7_days = [today - timedelta(days=i) for i in range(6, -1, -1)]

            # Initialize data structures
            requests_per_day = []
            status_over_time = []
            payment_distribution = {}

            for day in last_7_days:
                date_str = day.strftime("%Y-%m-%d")
                start_of_day = day.replace(hour=0, minute=0, second=0, microsecond=0)
                end_of_day = day.replace(hour=23, minute=59, second=59, microsecond=999999)

                # Count total requests for the day
                total_count = MONGO_DB.service_requests.count_documents({
                    "created_at": {
                        "$gte": start_of_day,
                        "$lte": end_of_day
                    }
                })
                requests_per_day.append({"date": date_str, "count": total_count})

                # Count requests by status for the day
                statuses = ["Completed", "Pending"]
                status_counts = {"date": date_str}
                for status_name in statuses:
                    count = MONGO_DB.service_requests.count_documents({
                        "created_at": {
                            "$gte": start_of_day,
                            "$lte": end_of_day
                        },
                        "status": status_name
                    })
                    status_counts[status_name] = count
                status_over_time.append(status_counts)

            # Aggregate payment methods
            payment_cursor = MONGO_DB.service_requests.aggregate([
                {"$group": {"_id": "$payment_method", "count": {"$sum": 1}}}
            ])
            for doc in payment_cursor:
                payment_method = doc["_id"] if doc["_id"] is not None else "Unknown"
                payment_distribution[payment_method] = doc["count"]

            # Normalize location to title case and aggregate
            location_cursor = MONGO_DB.service_requests.aggregate([
                {
                    "$project": {
                        "location": {
                            "$cond": {
                                "if": {"$ne": ["$location", None]},
                                "then": {
                                    "$concat": [
                                        { "$toUpper": { "$substrCP": ["$location", 0, 1] } },
                                        { "$toLower": { "$substrCP": ["$location", 1, { "$strLenCP": "$location" }] } }
                                    ]
                                },
                                "else": "Unknown"
                            }
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$location",
                        "count": { "$sum": 1 }
                    }
                },
                {
                    "$sort": { "count": -1 }
                }
            ])

            location_distribution = []
            for doc in location_cursor:
                location_distribution.append({
                    "location": doc["_id"],
                    "count": doc["count"]
                })

            data = {
                "requests_per_day": requests_per_day,
                "status_over_time": status_over_time,
                "payment_distribution": payment_distribution,
                "location_distribution": location_distribution
            }

            return Response(data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        


# -------------------------Bill Generation-------------------------
class BillGeneration(APIView):
    """
    API endpoint for generating bills for service requests and emailing them.
    """
    permission_classes = [IsProvider]

    def post(self, request):
        data = request.data

        if "request_id" not in data:
            return Response({"error": "request_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            request_id = ObjectId(data["request_id"])
        except:
            return Response({"error": "Invalid request_id format."}, status=status.HTTP_400_BAD_REQUEST)

        service_request = MONGO_DB.service_requests.find_one({"_id": request_id})
        if not service_request:
            return Response({"error": "No matching service request found."}, status=status.HTTP_400_BAD_REQUEST)

        user = MONGO_DB.users.find_one({"_id": ObjectId(service_request["user_id"])})
        provider = MONGO_DB.providers.find_one({"_id": ObjectId(service_request["provider_id"])})
        if not user or not provider:
            return Response({"error": "User or Provider not found."}, status=status.HTTP_400_BAD_REQUEST)

        required_fields = ["charges", "total", "payment_method"]
        for field in required_fields:
            if field not in data:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create bill ID
        bill_id = f"BILL-{timezone.now().strftime('%Y%m%d')}-{get_random_string(6).upper()}"

        bill = {
            "bill_id": bill_id,
            "request_id": str(request_id),
            "user_id": service_request["user_id"],
            "user_name": user["name"],
            "user_email": user["email"],
            "provider_id": service_request["provider_id"],
            "provider_name": provider["name"],
            "provider_email": provider["email"],
            "services_performed": service_request.get("description", ""),
            "service_charge": data["charges"],
            "total": data["total"],
            "payment_method": data["payment_method"],
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45)
        }

        # Save bill in database
        MONGO_DB.bills.insert_one(bill)

        # Generate PDF
        pdf_file = self.generate_bill_pdf(bill)
        if not pdf_file:
            return Response({"error": "Failed to generate PDF."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Send Email
        self.send_bill_email(bill, pdf_file)

        return Response({
            "message": "Bill generated and emailed successfully.",
            "bill_id": bill_id
        }, status=status.HTTP_201_CREATED)

    def generate_bill_pdf(self, bill_data):
        """
        Generate PDF for the bill.
        """
        template_path = 'invoice_template.html'  # Create this template
        context = {'bill': bill_data}
        html = render_to_string(template_path, context)
        result = BytesIO()
        pisa_status = pisa.CreatePDF(html, dest=result)
        if pisa_status.err:
            return None
        return result

    def send_bill_email(self, bill, pdf_data):
        """
        Send the bill PDF to user and provider via email.
        """
        subject = f"ServiceBuddy Bill - {bill['bill_id']}"
        body = "Attached is the service bill for your recent service."
        email = EmailMessage(
            subject,
            body,
            settings.EMAIL_HOST_USER,  # change to your sender email
            [bill["user_email"], bill["provider_email"]]
        )
        email.attach(f"bill_{bill['bill_id']}.pdf", pdf_data.getvalue(), 'application/pdf')
        email.send()

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
class PasswordResetRequestView(APIView):
    """
    API endpoint to request a password reset using OTP.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        user_type = request.data.get("user_type", "user")

        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        if user_type == "provider":
            user = MONGO_DB.providers.find_one({"email": email})
        else:
            user = MONGO_DB.users.find_one({"email": email})

        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        otp = str(random.randint(100000, 999999))
        expiry = datetime.utcnow() + timedelta(minutes=5)

        MONGO_DB.password_resets.update_one(
            {"email": email},
            {"$set": {"otp": otp, "expires_at": expiry, "user_type": user_type}},
            upsert=True
        )

        try:
            send_mail(
                subject="ServiceBuddy Password Reset Code",
                message=f"Hi {user['name']},\n\nYour OTP for password reset is: {otp}\nIt will expire in 5 minutes.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
            )
            return Response({"message": "Password reset OTP sent to email."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Failed to send OTP email.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
class PasswordResetConfirmView(APIView):
    """
    API endpoint to confirm password reset using OTP.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not all([email, otp, new_password]):
            return Response({"error": "Email, OTP, and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        record = MONGO_DB.password_resets.find_one({"email": email})

        if not record:
            return Response({"error": "No reset request found."}, status=status.HTTP_404_NOT_FOUND)

        if record["otp"] != otp:
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        if datetime.utcnow() > record["expires_at"]:
            return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the password
        collection = MONGO_DB.providers if record["user_type"] == "provider" else MONGO_DB.users
        collection.update_one(
            {"email": email},
            {"$set": {"password": make_password(new_password)}}
        )

        # Optionally delete used reset record
        MONGO_DB.password_resets.delete_one({"email": email})

        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)


# -------------------------Profile Management-------------------------
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
    
class ReviewCreateView(APIView):
    """
    API endpoint for users to create reviews for service providers.
    """
    permission_classes = [IsUser]

    def post(self, request):
        data = request.data
        user_id = request.user.get("user_id")
        if not user_id:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        # Ensure required fields are present
        required_fields = ["provider_id", "rating", "review"]
        for field in required_fields:
            if field not in data:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Get the latest user data to ensure we have the most recent profile picture
        user_collection = MONGO_DB.users
        user_data = user_collection.find_one({"_id": ObjectId(user_id)})
        
        # Create review document
        review = {
            "user_id": user_id,
            "user_name": request.user.get("name", "Unknown"),
            "provider_id": data["provider_id"],
            "rating": data["rating"],
            "review": data["review"],
            "profile_picture": user_data.get("profile_picture") if user_data else request.user.get("profile_picture", None),
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45),
        }

        # Insert review into MongoDB
        result = MONGO_DB.reviews.insert_one(review)

        return Response({
            "message": "Review submitted successfully.",
            "review_id": str(result.inserted_id)
        }, status=status.HTTP_201_CREATED)
        
    def get(self, request):
        # Fetch all reviews for the logged-in user
        user_id = request.user.get("user_id")
        if not user_id:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        reviews = list(MONGO_DB.reviews.find({"user_id": user_id}).sort("created_at", -1))

        # Convert ObjectId to string for better compatibility with frontend
        for review in reviews:
            review["_id"] = str(review["_id"])
            review["provider_id"] = str(review["provider_id"])

        return Response(reviews, status=status.HTTP_200_OK)
    
class ProviderReviewListView(APIView):
    """
    API endpoint for users to view reviews for a specific service provider.
    """
    permission_classes = [IsUser]

    def get(self, request, provider_id):
        if not provider_id:
            return Response({"error": "Provider ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch reviews for the specified provider
        reviews = list(MONGO_DB.reviews.find({"provider_id": provider_id}).sort("created_at", -1))

        # Convert ObjectId to string for better compatibility with frontend
        for review in reviews:
            review["_id"] = str(review["_id"])
            review["user_id"] = str(review["user_id"])
            
            # Make sure profile_picture is included in the response
            if "profile_picture" not in review or not review["profile_picture"]:
                # If no profile picture in review, try to fetch from user
                user_data = MONGO_DB.users.find_one({"_id": ObjectId(review["user_id"])})
                if user_data and "profile_picture" in user_data:
                    review["profile_picture"] = user_data["profile_picture"]

        return Response(reviews, status=status.HTTP_200_OK)

class ReviewListView(APIView):
    """
    API endpoint for provider to view all reviews.
    """
    permission_classes = [IsProvider]
    
    def get(self, request):
        provider_id = request.user.get("user_id")
        if not provider_id:
            return Response({"error": "Provider not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Fetch reviews for the specified provider
        reviews = list(MONGO_DB.reviews.find({"provider_id": provider_id}).sort("created_at", -1))
        
        # Convert ObjectId to string for better compatibility with frontend
        for review in reviews:
            review["_id"] = str(review["_id"])
            review["user_id"] = str(review["user_id"])
            
            # Make sure profile_picture is included in the response
            if "profile_picture" not in review or not review["profile_picture"]:
                # If no profile picture in review, try to fetch from user
                try:
                    user_data = MONGO_DB.users.find_one({"_id": ObjectId(review["user_id"])})
                    if user_data and "profile_picture" in user_data:
                        review["profile_picture"] = user_data["profile_picture"]
                except Exception as e:
                    print(f"Error fetching user profile: {e}")
        
        return Response(reviews, status=status.HTTP_200_OK)
    
class SubmitContactQuery(APIView):
    """
    API endpoint for users to submit a contact query.
    """
    permission_classes = [IsUser]
    
    def post(self, request):
        data = request.data
        user_id = request.user.get("user_id")
        if not user_id:
            return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        # Ensure required fields are present
        required_fields = ["subject", "message"]
        for field in required_fields:
            if field not in data:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the latest user data to ensure we have the most recent profile picture
        user_collection = MONGO_DB.users
        user_data = user_collection.find_one({"_id": ObjectId(user_id)})
        
        # Create contact query document
        contact_query = {
            "user_id": user_id,
            "user_name": request.user.get("name", "Unknown"),
            "user_email": request.user.get("email", "Unknown"),
            "subject": data["subject"],
            "message": data["message"],
            "profile_picture": user_data.get("profile_picture") if user_data else request.user.get("profile_picture", None),
            "created_at": datetime.utcnow() + timedelta(hours=5, minutes=45),
        }

        # Insert contact query into MongoDB
        result = MONGO_DB.contact_queries.insert_one(contact_query)

        return Response({
            "message": "Contact query submitted successfully.",
            "query_id": str(result.inserted_id)
        }, status=status.HTTP_201_CREATED)
        
class AdminGetAllContactQueries(APIView):
    """
    API endpoint for admin to get all contact queries.
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        queries = list(MONGO_DB.contact_queries.find({}).sort("created_at", -1))

        # Convert ObjectId to string for better compatibility with frontend
        for query in queries:
            query["_id"] = str(query["_id"])
            query["user_id"] = str(query["user_id"])
            
            # Make sure profile_picture is included in the response 
            if "profile_picture" not in query or not query["profile_picture"]:
                # If no profile picture in query, try to fetch from user
                try:
                    user_data = MONGO_DB.users.find_one({"_id": ObjectId(query["user_id"])})
                    if user_data and "profile_picture" in user_data:
                        query["profile_picture"] = user_data["profile_picture"]
                except Exception as e:
                    print(f"Error fetching user profile: {e}")

        return Response(queries, status=status.HTTP_200_OK)
    
class BookedShiftsView(APIView):
    """
    API endpoint to fetch already booked shifts for a provider on a specific date.
    """
    permission_classes = []

    def get(self, request):
        provider_id = request.query_params.get("provider_id")
        appointment_date = request.query_params.get("date")

        if not provider_id or not appointment_date:
            return Response({"error": "Missing provider_id or date."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Find bookings that are still active (pending or accepted)
            bookings = MONGO_DB.service_requests.find({
                "provider_id": provider_id,
                "appointment_date": appointment_date,
                "status": {"$in": ["pending", "accepted"]},
            })

            booked_shifts = []
            for booking in bookings:
                shift_start = booking.get("shift_start_time")
                shift_end = booking.get("shift_end_time")
                if shift_start and shift_end:
                    booked_shifts.append(f"{shift_start} - {shift_end}")

            return Response({"booked_shifts": booked_shifts}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"[BookedShiftsView] Error: {str(e)}")
            return Response({"error": "Failed to fetch booked shifts."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    