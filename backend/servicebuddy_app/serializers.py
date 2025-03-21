from rest_framework import serializers
from django.core.validators import RegexValidator
from .db import MONGO_DB
from django.contrib.auth.hashers import make_password

phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)
class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    location = serializers.CharField(max_length=100)
    phone_num = serializers.CharField(validators=[phone_regex], required=True)
    user_type = serializers.CharField(default="user")  # Defaults to "user" if not provided

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
    service = serializers.CharField(max_length=100)
    
class ServiceRequestSerializer(serializers.Serializer):
    provider_id = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    appointment_date = serializers.DateField(required=True, allow_null=True)
    appointment_time = serializers.TimeField(required=True, allow_null=True)
    location = serializers.CharField(required = True)
    payment_method = serializers.ChoiceField(choices=['Cash', 'Online'], required = True)