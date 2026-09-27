from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid

app = Flask(__name__)

CORS(app)

# Temporary resume storage
resumes = {}


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

    # Create unique resume ID
    resume_id = str(uuid.uuid4())

    # Store resume
    resumes[resume_id] = data

    # Create share link
    share_link = (
        "http://127.0.0.1:5000/resume/"
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

    if resume_id not in resumes:

        return jsonify({
            "success": False,
            "message": "Resume not found"
        }), 404

    return jsonify({
        "success": True,
        "resume": resumes[resume_id]
    })


# RUN SERVER
if __name__ == "__main__":

    app.run(debug=True)