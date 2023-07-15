import os

from flask import Flask, flash, redirect, render_template, request

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

@app.route("/", methods = ["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/exp", methods = ["GET", "POST"])
def exp():
    return render_template("exp.html")

@app.route("/qns", methods = ["GET", "POST"])
def qns():
    return render_template("qns.html")