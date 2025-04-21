import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f"notifications_user_{self.user_id}"
        
        print(f"🔌 Connecting WebSocket for user: {self.user_id}")

        try:
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            print(f"WebSocket connection accepted for user {self.user_id}")
        except Exception as e:
            print(f"Error connecting WebSocket for user {self.user_id}: {str(e)}")
            raise


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        notification = event.get("notification", {})
        await self.send(text_data=json.dumps({
            "type": notification.get("type", "info"),
            "message": notification.get("message", ""),
            "service_request_id": notification.get("service_request_id"),
            "created_at": notification.get("created_at"),
        }))


    async def booking_status_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "booking_status_update",
            "message": event["message"]
        }))


class ShiftConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "shifts_updates"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def shift_booked(self, event):
        await self.send(text_data=json.dumps({
            "type": "shift_booked",
            "message": event.get("message", {})
        }))

