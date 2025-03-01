from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('service-providers/', ServiceProviderList.as_view(), name='providers'),
    path('service-requests/', ServiceRequestCreate.as_view(), name='create_request'),
    path('service-requests/<str:request_id>/', ServiceRequestUpdate.as_view(), name='update_request'),
    path('bills/', BillGeneration.as_view(), name='bill_generation'),
    path('add-service/', AddServiceView.as_view(), name='add_service'),
    path('my-bookings/', MyBookings.as_view(), name='my_bookings'),
    path('password-reset/', RequestPasswordResetView.as_view(), name='password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(),name='password_reset_confirm'),
    path('provider-requests/', ProviderRequestView.as_view(), name = 'provider-requests'),
]
