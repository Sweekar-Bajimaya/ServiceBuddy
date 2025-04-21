from django.urls import path
from servicebuddy_app.consumers import NotificationConsumer, ShiftConsumer

websocket_urlpatterns = [
    path("ws/notifications/<str:user_id>/", NotificationConsumer.as_asgi()),
    path("ws/shifts/", ShiftConsumer.as_asgi()),
]
