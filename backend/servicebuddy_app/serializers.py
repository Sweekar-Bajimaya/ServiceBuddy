from rest_framework import serializers
from django.core.validators import RegexValidator

phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    location = serializers.CharField(max_length=100)
    phone_num = serializers.CharField(validators=[phone_regex], required = True)
    
    def validate(self, data):
        # Align default user type as User 
        data['user_type'] = 'user'
        return data

    

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

        # ✅ If user is NOT an admin, `user_type` is required
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