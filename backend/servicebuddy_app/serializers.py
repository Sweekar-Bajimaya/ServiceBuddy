from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=['user', 'provider'])
    services_offered = serializers.ListField(
        child=serializers.ChoiceField(choices=[
            'Electrician', 'Mechanic', 'Plumber', 'Technician', 'Cleaner'
        ]),
        required=False  # Make it optional by default
    )
    location = serializers.CharField(max_length=100)
    
    def validate(self, data):
        """ Ensure services_offered is required only for providers """
        if data.get("user_type") == "provider" and "services_offered" not in data:
            raise serializers.ValidationError({"services_offered": "This field is required for service providers."})
        
        if data.get("user_type") == "user" and "services_offered" in data:
            raise serializers.ValidationError({"services_offered": "This field is not allowed for regular users."})
        
        
        return data 


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
class AddServiceSerializer(serializers.Serializer):
    service = serializers.CharField(max_length=100)
    
class ServiceRequestSerializer(serializers.Serializer):
    provider_id = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    appointment_date = serializers.DateField(required=False, allow_null=True)
    appointment_time = serializers.TimeField(required=False, allow_null=True)
