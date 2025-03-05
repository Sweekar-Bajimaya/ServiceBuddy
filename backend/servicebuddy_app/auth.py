from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
import jwt
from django.conf import settings

# class JWTAuthentication(BaseAuthentication):
#     def authenticate(self, request):
#         auth_header = request.headers.get('Authorization')
#         if not auth_header:
#             return None

#         try:
#             prefix, token = auth_header.split(' ')
#             if prefix.lower() != "bearer":
#                 return None
#             payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
#         except jwt.ExpiredSignatureError:
#             raise exceptions.AuthenticationFailed("Token expired")
#         except jwt.InvalidTokenError:
#             raise exceptions.AuthenticationFailed("Invalid token")

#         # For our purposes, we are simply attaching a dict to request.user.
#         user = {
#             "user_id": payload["user_id"],
#             "name": payload["name"],
#             "email": payload["email"],
#             "user_type": payload["user_type"]
#         }
#         return (user, token)

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        # Return the full payload as the user object
        return (payload, token)
