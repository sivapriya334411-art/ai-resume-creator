from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
import psycopg2
from psycopg2.extras import Json
import uuid
import os

app = Flask(__name__)

CORS(app)

DATABASE_URL = os.environ.get("DATABASE_URL")


# DATABASE SETUP
def init_db():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS resumes (
            id TEXT PRIMARY KEY,
            data JSONB NOT NULL
        )
    """)

    conn.commit()
    cursor.close()
    conn.close()


init_db()


# HOME
@app.route("/")
def home():
    return jsonify({
        "message": "AI Resume Creator Backend is Running!"
    })


# SAVE RESUME
@app.route("/save-resume", methods=["POST"])
def save_resume():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No resume data received"
        }), 400

    # Create unique ID
    resume_id = str(uuid.uuid4())

    # Save resume in PostgreSQL
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO resumes (id, data) VALUES (%s, %s)",
        (resume_id, Json(data))
    )

    conn.commit()
    cursor.close()
    conn.close()

    # Public share link
    share_link = (
        "https://ai-resume-creator-production-b802.up.railway.app/resume/"
        + resume_id
    )

    return jsonify({
        "success": True,
        "message": "Resume saved successfully!",
        "resumeId": resume_id,
        "shareLink": share_link
    })


# VIEW SHARED RESUME
@app.route("/resume/<resume_id>")
def view_resume(resume_id):

    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT data FROM resumes WHERE id = %s",
        (resume_id,)
    )

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        return jsonify({
            "success": False,
            "message": "Resume not found"
        }), 404

    data = row[0]

    name = data.get("name", "Your Name")
    email = data.get("email", "")
    phone = data.get("phone", "")
    summary = data.get("summary", "")
    skills = data.get("skills", "")
    education = data.get("education", "")
    projects = data.get("projects", "")
    achievements = data.get("achievements", "")

    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{{ name }} - Resume</title>

        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f2f4f7;
                margin: 0;
                padding: 40px;
            }

            .resume {
                max-width: 850px;
                margin: auto;
                background: white;
                padding: 45px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.12);
            }

            h1 {
                margin-bottom: 8px;
                color: #222;
            }

            h2 {
                color: #2f7fc4;
                border-bottom: 2px solid #2f7fc4;
                padding-bottom: 6px;
                margin-top: 30px;
            }

            .contact {
                color: #555;
                margin-bottom: 25px;
            }

            p {
                line-height: 1.6;
                white-space: pre-line;
            }
        </style>
    </head>

    <body>

        <div class="resume">

            <h1>{{ name }}</h1>

            <div class="contact">
                {{ email }}
                {% if phone %} | {{ phone }}{% endif %}
            </div>

            {% if summary %}
            <h2>Professional Summary</h2>
            <p>{{ summary }}</p>
            {% endif %}

            {% if skills %}
            <h2>Skills</h2>
            <p>{{ skills }}</p>
            {% endif %}

            {% if education %}
            <h2>Education</h2>
            <p>{{ education }}</p>
            {% endif %}

            {% if projects %}
            <h2>Projects</h2>
            <p>{{ projects }}</p>
            {% endif %}

            {% if achievements %}
            <h2>Achievements</h2>
            <p>{{ achievements }}</p>
            {% endif %}

        </div>

    </body>
    </html>
    """,
    name=name,
    email=email,
    phone=phone,
    summary=summary,
    skills=skills,
    education=education,
    projects=projects,
    achievements=achievements
    )


# RUN SERVER
if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )