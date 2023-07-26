import os
import json

from flask import Flask, flash, redirect, render_template, request, url_for

import sqlite3
from sqlite3 import Error

DB_PATH = os.getcwd() + "\data.sqlite"

def create_connection(DB_PATH):
    connection = None
    try:
        connection = sqlite3.connect(DB_PATH)
        print("Connection to SQLite DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection

# Configure application
app = Flask(__name__)

setting_values = {"volume": 0, "inputSetting": 0}

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == "POST":
        setting_values["volume"] = int(request.json["volume"])
        setting_values["inputSetting"] = request.json["inputSetting"]
        return "200_OK"
    else:
        return render_template("index.html", path = "/")

@app.route("/exp", methods = ["GET", "POST"])
def exp():
    return render_template("exp.html", path = "/exp")

@app.route("/qns", methods = ["GET", "POST"])
def qns():
    return render_template("qns.html", path = "/qns")

@app.route("/settings", methods = ["GET", "POST"])
def settings():
    set = json.dumps(setting_values)
    return set