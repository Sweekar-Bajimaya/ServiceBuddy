from django.urls import path
from .views import *

urlpatterns = [
    #-------------------Authentication and Registration--------------------
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    
    # --------------------User Views--------------------
    path('service-providers/', ServiceProviderList.as_view(), name='providers'),
    path('service-requests/', ServiceRequestCreate.as_view(), name='create_request'),
    path('bills/', BillGeneration.as_view(), name='bill_generation'),
    path('add-provider/', AddServiceProviderView.as_view(), name='add-service-provider'),
    path('my-bookings/', MyBookings.as_view(), name='my_bookings'),
    path('contact/submit/', SubmitContactQuery.as_view(), name='submit_contact_query'),
    path('admin/contact-queries/', AdminGetAllContactQueries.as_view(), name='admin_get_contact_queries'),
    path("booked_shifts/", BookedShiftsView.as_view(), name="booked-shifts"),

    #--------------------Provider Views--------------------
    path('provider-requests/', ProviderRequestView.as_view(), name = 'provider-requests'),
    path('admin/providers/', AdminProviderView.as_view(), name='admin-providers'),
    path('service-requests/<str:request_id>/', ServiceRequestUpdate.as_view(), name='update_request'),
    path('provider/schedule/', ProviderScheduleView.as_view(), name='provider-schedule'),
    path('provider/update-status/<str:request_id>/', UpdateBookingStatusView.as_view(), name='update-booking-status'),
    path("provider/dashboard-summary/", ProviderDashboardSummaryView.as_view(), name="provider-dashboard-summary"),
    
    #--------------------Admin Views--------------------
    path('admin/providers/<str:provider_id>', AdminProviderView.as_view(), name='admin_update_provider'),
    path('admin/requestview/', AdminRequestsView.as_view(), name='admin_requestsView'),
    path('admin/providerslist/', AdminProvidersListView.as_view(), name = 'admin_providers' ),
    path('delete-provider/<str:provider_id>/', DeleteProviderView.as_view(), name='delete_provider'),
    path("admin/dashboard-summary/", AdminDashboardSummaryView.as_view(), name="admin-dashboard-summary"),
    path("admin/chart-data", AdminChartDataView.as_view(), name="Admin-chart-data"),
    
    #--------------------Profile Views--------------------
    path("profile/", ProfileView.as_view(), name="profile"),
    
    #--------------------Review Views--------------------
    path('reviews/', ReviewCreateView.as_view(), name='reviews'),
    path('reviews/<str:provider_id>/', ProviderReviewListView.as_view(), name='review_detail'),
    path('reviewlist/', ReviewListView.as_view(), name='review_list'),
]
