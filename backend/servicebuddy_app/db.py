from pymongo import MongoClient
import os
from urllib.parse import quote_plus

username = quote_plus('ServiceBuddyDB')  # encode your username
password = quote_plus('service@123')  # encode your password

MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.uilvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MONGO_CLIENT = MongoClient(MONGO_URI)
MONGO_DB = MONGO_CLIENT["servicebuddy"]