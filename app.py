import os
import json
from pathlib import Path

from flask import Flask, flash, redirect, render_template, request, url_for, send_file

import sqlite3
from sqlite3 import Error

THIS_FOLDER = Path(__file__).parent.resolve()
DB_PATH = THIS_FOLDER / "\data.sqlite"

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
    global data_formatted 
    data_formatted = []
    global setting_values 
    setting_values = {"volume": None, "inputSetting": None}
    if request.method == "POST":
        setting_values["volume"] = int(request.json["volume"])
        setting_values["inputSetting"] = request.json["inputSetting"]
        return "200_OK"
    else:
        if request.args.get("error") == "vol":
            return render_template("index.html", path = "/", err = "Please input an audible volume")
        if request.args.get("error") == "?":
            return render_template("index.html", path = "/", err = "The server is experiencing some technical difficulties. Please try again later.")
        return render_template("index.html", path = "/")

@app.route("/exp", methods = ["GET", "POST"])
def exp():
    global setting_values
    global data_formatted
    if request.method == "POST":
        data = request.json
        try: 
            data_formatted.append("|".join(data[0]))
        except Exception as e: 
            print(e)
            return redirect("/")
        for x in data[1]:
            try: 
                data_formatted.append("|".join(x))
            except: 
                return redirect("/")
        return "200_OK"
    else:
        if (setting_values["inputSetting"] == None or setting_values["volume"] == None):
            return redirect("/")
        if(setting_values["volume"] == 0):
            return redirect(url_for(".index", error = "vol"))
        return render_template("exp.html", path = "/exp")

@app.route("/qns", methods = ["GET", "POST"])
def qns():
    global setting_values
    global data_formatted
    err = ""
    if request.method == "POST":
        age = request.form.get("ageGrp")
        exp = request.form.get("prevExp")
        if (not age):
            err = "No age group selected. Please try again"
            return render_template("qns.html", path = "/qns", err = err)
        elif (int(age) < 0 or int(age) > 4):
            err = "Bro you're funny"
            return render_template("qns.html", path = "/qns", err = err)
        if (not exp):
            err = "No rhymic experience selected. Please try again"
            return render_template("qns.html", path = "/qns", err = err)
        elif (0 > int(exp) or int(exp) > 1):
            err = "Bro you're funny"
            return render_template("qns.html", path = "/qns", err = err)
        conn = create_connection(DB_PATH)
        db = conn.cursor()
        data_formatted.extend([int(age), int(exp), request.form.get("med")])
        try: 
            db.execute("INSERT INTO data (freq, calib, a, b, c, d, e, ageGrp, exp, med) VALUES (?,?,?,?,?,?,?,?,?,?)", data_formatted)
            conn.commit();
        except Exception as e: 
            print(e)
            return redirect(url_for(".index", error = "?"))
        return redirect("/thanks")
    else:
        if (setting_values == None or setting_values["inputSetting"] == None or setting_values["volume"] == None or len(data_formatted) == 0):
            return redirect("/")
        return render_template("qns.html", path = "/qns", err = err)

@app.route("/settings", methods = ["GET"])
def settings():
    global setting_values
    set = json.dumps(setting_values)
    return set

@app.route("/thanks", methods = ["GET"])
def thanks():
    return render_template("thanks.html")