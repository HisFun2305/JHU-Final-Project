import os

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

# fetch settings data with each save

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == "POST":
        return "200_OK"
    else:
        return render_template("index.html", path = "/")

@app.route("/exp", methods = ["GET", "POST"])
def exp():
    return render_template("exp.html", path = "/exp")

@app.route("/qns", methods = ["GET", "POST"])
def qns():
    return render_template("qns.html", path = "/qns")