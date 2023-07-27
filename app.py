import os
import json

from flask import Flask, flash, redirect, render_template, request, url_for, send_file

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

setting_values = {"volume": None, "inputSetting": None}

data_formatted = []
sample_data = [[70, 100, 50, 40, 80], [[125, 289, 470, 659, 819, 1021, 1203, 1379, 1569, 1761, 1959, 2139, 2321, 2518, 2712, 2925, 3119, 3323, 3505, 3693, 3907, 6223, 6421], [152, 328, 518, 706, 896, 1067, 1244, 1429, 1610, 1782, 1960, 2153, 2330, 3258, 3444, 3624, 3804, 3974, 4149, 4331, 4503, 4668, 4866, 5142, 5318, 5474, 5646, 5820, 5992, 6168, 6341, 6518, 6704], [184, 373, 568, 744, 939, 1125, 1308, 1516, 1706, 1892, 2092, 2282, 2470, 2659, 2846, 3035], [181, 357, 543, 937, 1109, 1286, 1483, 1681, 1870, 2055, 2257, 2437, 2623], [202, 390, 572, 778, 974, 1164, 1356, 1558, 1782, 1982, 2180, 2372, 2574, 2758, 2940, 3135, 3334, 3512, 3716, 3915, 4108, 4288, 4712, 4898, 5090, 5268]]]

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
    if request.method == "POST":
        data = request.json
        data_formatted[0] = "|".join(data[0])
        for x in data[1]:
            data_formatted.append("|".join(x))
        return "200_OK"
    else:
        if (setting_values["inputSetting"] == None or setting_values["volume"] == None):
            return redirect("/")
        return render_template("exp.html", path = "/exp")

@app.route("/qns", methods = ["GET", "POST"])
def qns():
    if request.method == "POST":
        return "200_OK"
    else:
        if (setting_values["inputSetting"] == None or setting_values["volume"] == None or len(data_formatted) == 0):
            return redirect("/")
        return render_template("qns.html", path = "/qns")

@app.route("/settings", methods = ["GET", "POST"])
def settings():
    set = json.dumps(setting_values)
    return set

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}