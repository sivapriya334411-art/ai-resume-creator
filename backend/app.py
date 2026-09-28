from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
import psycopg2
from psycopg2.extras import Json
import uuid
import os

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.environ.get("DATABASE_URL")


# =========================
# DATABASE SETUP
# =========================
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


# =========================
# HOME
# =========================
@app.route("/")
def home():
    return jsonify({
        "message": "AI Resume Creator Backend is Running!"
    })


# =========================
# SAVE RESUME
# =========================
@app.route("/save-resume", methods=["POST"])
def save_resume():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No resume data received"
        }), 400

    resume_id = str(uuid.uuid4())

    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO resumes (id, data) VALUES (%s, %s)",
        (resume_id, Json(data))
    )

    conn.commit()
    cursor.close()
    conn.close()

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


# =========================
# VIEW SHARED RESUME
# =========================
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

    # Actual resume fields
    full_name = data.get("fullName", "Your Name")
    job_title = data.get("jobTitle", "")
    email = data.get("email", "")
    phone = data.get("phone", "")
    location = data.get("location", "")
    summary = data.get("summary", "")
    skills = data.get("skills", "")
    department = data.get("department", "")
    college = data.get("college", "")
    degree = data.get("degree", "")
    start_year = data.get("startYear", "")
    end_year = data.get("endYear", "")
    project_name = data.get("projectName", "")
    project_tech = data.get("projectTech", "")
    project_description = data.get("projectDescription", "")
    achievements = data.get("achievements", "")
    certification = data.get("certification", "")
    cert_organization = data.get("certOrganization", "")
    languages = data.get("languages", [])
    linkedin = data.get("linkedin", "")
    github = data.get("github", "")
    portfolio = data.get("portfolio", "")
    profile_photo = data.get("profilePhoto", "")

    if isinstance(languages, list):
        languages_text = ", ".join(languages)
    else:
        languages_text = str(languages)

    return render_template_string("""
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>{{ full_name }} - Resume</title>

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 35px 15px;
    background: #eef2f6;
    font-family: Arial, Helvetica, sans-serif;
    color: #222;
}

.resume {
    width: 100%;
    max-width: 900px;
    margin: auto;
    background: white;
    box-shadow: 0 5px 25px rgba(0,0,0,0.12);
}

.header {
    background: #2f7fc4;
    color: white;
    padding: 35px;
    display: flex;
    align-items: center;
    gap: 25px;
}

.profile-photo {
    width: 115px;
    height: 115px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
}

.header-content {
    flex: 1;
}

.header h1 {
    margin: 0 0 8px;
    font-size: 34px;
}

.header h3 {
    margin: 0 0 15px;
    font-size: 18px;
    font-weight: normal;
}

.contact {
    font-size: 14px;
    line-height: 1.8;
}

.content {
    padding: 35px 45px;
}

.section {
    margin-bottom: 28px;
}

.section-title {
    color: #2f7fc4;
    font-size: 19px;
    font-weight: bold;
    border-bottom: 2px solid #2f7fc4;
    padding-bottom: 7px;
    margin-bottom: 13px;
}

.text {
    font-size: 14px;
    line-height: 1.7;
    white-space: pre-line;
}

.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.skill {
    background: #eaf3fb;
    color: #246da9;
    padding: 7px 12px;
    border-radius: 5px;
    font-size: 13px;
}

.links a {
    display: block;
    color: #2f7fc4;
    text-decoration: none;
    margin: 6px 0;
    word-break: break-all;
}

.education-title {
    font-weight: bold;
    font-size: 16px;
}

.project-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 5px;
}

.tech {
    color: #555;
    font-size: 13px;
    margin-bottom: 8px;
}

@media (max-width: 600px) {

    body {
        padding: 0;
    }

    .header {
        padding: 25px;
        flex-direction: column;
        text-align: center;
    }

    .content {
        padding: 25px;
    }

    .header h1 {
        font-size: 27px;
    }
}

</style>

</head>

<body>

<div class="resume">

    <!-- HEADER -->

    <div class="header">

        {% if profile_photo %}
        <img src="{{ profile_photo }}"
             class="profile-photo">
        {% endif %}

        <div class="header-content">

            <h1>{{ full_name }}</h1>

            {% if job_title %}
            <h3>{{ job_title }}</h3>
            {% endif %}

            <div class="contact">

                {% if email %}
                📧 {{ email }}
                {% endif %}

                {% if phone %}
                &nbsp; | &nbsp; 📱 {{ phone }}
                {% endif %}

                {% if location %}
                <br>📍 {{ location }}
                {% endif %}

            </div>

        </div>

    </div>


    <div class="content">


        <!-- SUMMARY -->

        {% if summary %}
        <div class="section">

            <div class="section-title">
                Professional Summary
            </div>

            <div class="text">
                {{ summary }}
            </div>

        </div>
        {% endif %}


        <!-- SKILLS -->

        {% if skills %}

        <div class="section">

            <div class="section-title">
                Skills
            </div>

            <div class="skills">

                {% for skill in skills.split(',') %}

                <span class="skill">
                    {{ skill.strip() }}
                </span>

                {% endfor %}

            </div>

        </div>

        {% endif %}


        <!-- EDUCATION -->

        {% if degree or college %}

        <div class="section">

            <div class="section-title">
                Education
            </div>

            <div class="education-title">
                {{ degree }}
            </div>

            {% if department %}
            <div class="text">
                {{ department }}
            </div>
            {% endif %}

            {% if college %}
            <div class="text">
                {{ college }}
            </div>
            {% endif %}

            {% if start_year or end_year %}
            <div class="text">
                {{ start_year }} - {{ end_year }}
            </div>
            {% endif %}

        </div>

        {% endif %}


        <!-- PROJECTS -->

        {% if project_name %}

        <div class="section">

            <div class="section-title">
                Projects
            </div>

            <div class="project-title">
                {{ project_name }}
            </div>

            {% if project_tech %}
            <div class="tech">
                Technologies: {{ project_tech }}
            </div>
            {% endif %}

            {% if project_description %}
            <div class="text">
                {{ project_description }}
            </div>
            {% endif %}

        </div>

        {% endif %}


        <!-- CERTIFICATION -->

        {% if certification %}

        <div class="section">

            <div class="section-title">
                Certifications
            </div>

            <div class="text">

                <strong>{{ certification }}</strong>

                {% if cert_organization %}
                <br>
                {{ cert_organization }}
                {% endif %}

            </div>

        </div>

        {% endif %}


        <!-- ACHIEVEMENTS -->

        {% if achievements %}

        <div class="section">

            <div class="section-title">
                Achievements
            </div>

            <div class="text">
                {{ achievements }}
            </div>

        </div>

        {% endif %}


        <!-- LANGUAGES -->

        {% if languages_text %}

        <div class="section">

            <div class="section-title">
                Languages
            </div>

            <div class="text">
                {{ languages_text }}
            </div>

        </div>

        {% endif %}


        <!-- LINKS -->

        {% if linkedin or github or portfolio %}

        <div class="section">

            <div class="section-title">
                Professional Links
            </div>

            <div class="links">

                {% if linkedin %}
                <a href="{{ linkedin }}"
                   target="_blank">
                    LinkedIn
                </a>
                {% endif %}

                {% if github %}
                <a href="{{ github }}"
                   target="_blank">
                    GitHub
                </a>
                {% endif %}

                {% if portfolio %}
                <a href="{{ portfolio }}"
                   target="_blank">
                    Portfolio
                </a>
                {% endif %}

            </div>

        </div>

        {% endif %}


    </div>

</div>

</body>

</html>
""",
    full_name=full_name,
    job_title=job_title,
    email=email,
    phone=phone,
    location=location,
    summary=summary,
    skills=skills,
    department=department,
    college=college,
    degree=degree,
    start_year=start_year,
    end_year=end_year,
    project_name=project_name,
    project_tech=project_tech,
    project_description=project_description,
    achievements=achievements,
    certification=certification,
    cert_organization=cert_organization,
    languages_text=languages_text,
    linkedin=linkedin,
    github=github,
    portfolio=portfolio,
    profile_photo=profile_photo
    )


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )