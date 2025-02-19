# servicebuddy_app/utils.py
import jwt
from datetime import datetime, timedelta
from django.conf import settings

def generate_tokens(user):
    """
    Generate access and refresh tokens.
    user: a dict from MongoDB (must contain _id, email, user_type)
    """
    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "user_type": user["user_type"],
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    refresh_payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "user_type": user["user_type"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm="HS256")
    return access_token, refresh_token
