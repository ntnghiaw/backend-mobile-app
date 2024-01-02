from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request, jsonify
import torch
import os
import requests

# Predict detect bằng Python API
from ultralytics import YOLO
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
model = YOLO("best.pt")

def download_image(url, save_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, 'wb') as file:
            file.write(response.content)
        print(f"Image downloaded successfully and saved at: {save_path}")
    else:
        print(f"Failed to download image. Status code: {response.status_code}")

@app.route("/detect", methods=['GET'])
@cross_origin(origins='*')
def add_process():
    try:
        image_url = request.args['image_url']
        source = "pic.jpg"
        download_image(image_url, source)
        if not source:
            raise ValueError("No image URL provided")

        results = model(source, show=False)

        boxes = results[0].boxes  # Assuming there is only one result in the list

        names = ['-', 'apple', 'asparagus', 'avocado', 'banana', 'bell pepper', 'bitter gourd', 'bok choy', 'broccoli', 'cabbage', 'carrot', 'cashew', 'cauliflower', 'chayote', 'chicken breast', 'chicken thigh', 'chicken wing', 'chilli', 'coconut', 'coconuts', 'corn', 'crab', 'cucumber', 'egg', 'egg_', 'eggplant', 'garlic', 'ginger', 'grapes', 'lemon', 'lettuce', 'lobster tails', 'mango', 'melon', 'milk', 'onion', 'orange', 'oysters', 'pawpaw', 'peanuts', 'peas', 'peper', 'pepper', 'pineapple', 'pork belly', 'potato', 'pumpkin', 'radishes', 'red rice', 'salmon', 'sea scallops', 'shrimp', 'spinach', 'strawberry', 'sweet potato', 'tempeh', 'tofu', 'tomato', 'tuna', 'undefined', 'white rice']  # Your list of class names

        index = [int(i - 1) for i in boxes.cls]
        ingredients = {"ingredients": list(dict.fromkeys([names[i] for i in index]))}
        
        return jsonify({"success": True, "data": ingredients})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400
    

@app.route("/", methods=['POST', 'GET'])
@cross_origin(origins='*')
def home():
    return "Hello world"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='9999')
    for file in os.listdir("./"):
        if file.endswith('.png') or file.endswith('.jpg'):
            os.remove(file)
