from dataclasses import dataclass
import sys
import subprocess
import tempfile
import shutil
import zipfile

import werkzeug
from flask import Flask, request
import xmltodict

from custom_types import EntryRow
from helpers import history_features, spark_init

spark = spark_init()

# Run with gunicorn --reload --timeout 0 'server:app'

app = Flask(__name__, static_url_path='', static_folder='')


@app.route("/")
def index():
    return app.send_static_file('index.html')

# https://flask.palletsprojects.com/en/2.2.x/patterns/fileuploads/
# So how exactly does Flask handle uploads? Well it will store them in the
# webserver’s memory if the files are reasonably small, otherwise in a
# temporary location (as returned by tempfile.gettempdir()). But how do you
# specify the maximum file size after which an upload is aborted? By default
# Flask will happily accept file uploads with an unlimited amount of memory,
# but you can limit that by setting the MAX_CONTENT_LENGTH config key:


@app.route("/upload/zip", methods=["POST"])
def upload_zip():
    print(request.files)
    file = request.files.get("file")
    if not file:
        raise werkzeug.exceptions.BadRequest("You must provide a file param")
    if not file.mimetype == "application/zip":
        raise werkzeug.exceptions.BadRequest(
            "File must be zip"
        )
    data = zipfile.ZipFile(file)
    for entry in data.infolist():
        if entry.filename == "Takeout/My Activity/Search/MyActivity.html":
            break
    else:
        return "could not find your activity"

    infile = tempfile.NamedTemporaryFile(dir="./tmp", delete=False)
    activity_file = data.open(entry)
    shutil.copyfileobj(activity_file, infile)

    # For some reason xidel cannot useas separators, using an unusual string
    separator = "----------------------------"
    try:
        status = subprocess.run(
            [
                "xidel",
                "-s",
                "--input-format=html",
                "--output-format=xml",
                "--printed-node-format=xml",
                "--xpath",
                "//html/body/div/div[contains(@class,\"outer-cell\")]/div/div[2]",
                "--output-separator",
                separator,
                infile.name
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
    except subprocess.CalledProcessError as error:
        print(f"xidel failed with return code: {error.returncode}")
        print(error.stderr)
        raise werkzeug.exceptions.BadRequest(
            "Your takeout file seems to be in the wrong format, "
            "are you sure you followed the steps correctly?"
        )

    data = status.stdout

    # Strip top level xml
    data = data[len('<?xml version="1.0" encoding="UTF-8"?>\n<xml>'):]
    data = data[: len(data) - len("</xml>\n")]

    lines = data.split(separator.encode("utf-8"))

    entries = []
    for i, line in enumerate(lines):
        try:
            entry = parse_entry(xmltodict.parse(line))
        except Exception as exception:
            sys.stderr.write(f"{i} problem {exception}\n{line.__repr__()}\n")
            continue

        entry_row = EntryRow(
            entry.get("kind") or "",
            entry.get("query") or "",
            entry.get("url") or ""
        )
        entries.append(entry_row)

    features = history_features(spark, spark.createDataFrame(entries))

    list_items = [f"<li> {row.text} </li>" for row in features]
    return f"""
    <html>
    <head></head>
    <body>
    <h1>Top Non work</h1>
    <ul>
    {''.join(list_items)}
    </ul>
    </body>
    </html>
    """


def parse_entry(fragment):
    summary_text = fragment["div"]["#text"]
    output = {}
    if summary_text.startswith("Searched"):
        output["kind"] = "Searched"
    elif summary_text.startswith("Visited"):
        output["kind"] = "Visited"
        output["url"] = fragment["div"]["a"]["@href"]
    else:
        return {}
    if not "a" in fragment["div"]:
        # We think cards without a search term are location searches
        # because they all look like "Searched for {query} at {location}"
        return {}
    if not "#text" in fragment["div"]["a"]:
        return {}
    output["query"] = fragment["div"]["a"]["#text"]
    return output
