from rest_framework import serializers
from django.core.validators import RegexValidator
from .db import MONGO_DB
from django.contrib.auth.hashers import make_password
from datetime import datetime
from django.core.exceptions import ValidationError

phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)

class TimeShiftSerializer(serializers.Serializer):
    """"
    Serializer for time shifts.
    """
    start_time = serializers.TimeField(required=True)
    end_time = serializers.TimeField(required=True)

class RegisterSerializer(serializers.Serializer):
    """
    Serializer for user registration.
    """
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    location = serializers.CharField(max_length=100)
    phone_num = serializers.CharField(validators=[phone_regex], required=True)
    user_type = serializers.CharField(default="user")  # Defaults to "user" if not provided
    services_offered = serializers.ListField(child=serializers.CharField(max_length=100), required=False)
    available_time = serializers.ListField(child=TimeShiftSerializer(), required=False)
    profile_picture = serializers.ImageField(required=False)  # Add profile picture field

    def validate(self, data):
        """
        Validate and ensure proper user type.
        """
        # Default user_type to "user" if missing
        if "user_type" not in data or not data["user_type"]:
            data["user_type"] = "user"

        # Ensure only valid user types are used
        if data["user_type"] not in ["user", "provider"]:
            raise serializers.ValidationError({"user_type": "Invalid user type."})

        # Ensure available_time is in the correct format (string instead of datetime.time)
        if data.get("available_time"):
            for shift in data["available_time"]:
                shift["start_time"] = shift["start_time"].strftime("%H:%M")
                shift["end_time"] = shift["end_time"].strftime("%H:%M")

        if data.get("user_type") == "provider" and "available_time" not in data:
            data["available_time"] = []  # default to empty list

        return data

    def create(self, validated_data):
        """
        Save user to the correct MongoDB collection.
        """
        validated_data["password"] = make_password(validated_data["password"])  # Hash password

        # Determine the correct MongoDB collection
        if validated_data["user_type"] == "provider":
            collection = MONGO_DB.providers
        else:
            collection = MONGO_DB.users

        # Insert user into MongoDB
        result = collection.insert_one(validated_data)

        # Convert `_id` to string for better compatibility with frontend
        validated_data["_id"] = str(result.inserted_id)

        return validated_data


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(
        choices=['user', 'provider'],
        required=False  # ✅ Make `user_type` optional
    )

    def validate(self, data):
        email = data.get("email")
        user_type = data.get("user_type")

        # If user is NOT an admin, `user_type` is required
        if email != "admin@servicebuddy.com" and not user_type:
            raise serializers.ValidationError({"user_type": "This field is required for non-admin users."})
        return data
    
class AddServiceSerializer(serializers.Serializer):
    """
    Serializer for adding a service to a provider's profile.
    """
    service = serializers.CharField(max_length=100)
    
class ServiceRequestSerializer(serializers.Serializer):
    """
    Serializer for service requests.
    """
    provider_id = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    appointment_date = serializers.DateField(required=True, allow_null=True)
    shift_start_time = serializers.CharField()
    shift_end_time = serializers.CharField()
    location = serializers.CharField(required = True)
    payment_method = serializers.ChoiceField(choices=['Cash', 'Online'], required = True)
    
class ReviewSerializer(serializers.Serializer):
    """
    Serializer for adding a review to a provider's profile.
    """
    provider_id = serializers.CharField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    review = serializers.CharField(allow_blank=True, required=False)  # Optional comment field
    user_id = serializers.CharField(required=True)  # User ID of the user giving the review
    user_name = serializers.CharField(required=True)  # Name of the user giving the review
    profile_picture = serializers.ImageField(required=False)  # Profile picture of the user giving the review