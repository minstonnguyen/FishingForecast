from django.urls import path
from . import views

urlpatterns = [
    path('conditions/', views.conditions, name='conditions'),
    path('getSwellData/', views.getSwellData, name='getSwellData')
]