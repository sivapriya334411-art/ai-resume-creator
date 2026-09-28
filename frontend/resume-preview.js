console.log("RESUME PREVIEW JS LOADED");

document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // LOAD RESUME DATA
    // ==============================

    const savedData = localStorage.getItem("resumeData");

    if (!savedData) {
        alert("No resume data found. Please create your resume first.");
        window.location.href = "resume-builder.html";
        return;
    }

    let resumeData;

    try {
        resumeData = JSON.parse(savedData);
    } catch (error) {
        console.error("Invalid resume data:", error);

        alert("Resume data is invalid. Please create your resume again.");

        localStorage.removeItem("resumeData");

        window.location.href = "resume-builder.html";
        return;
    }

    console.log("Resume Data Loaded:", resumeData);


    // ==============================
    // BASIC TEXT FUNCTION
    // ==============================

    function setText(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value || "";
        }
    }


    // ==============================
    // CONTACT TEXT
    // Keeps Font Awesome Icons
    // ==============================

    function setContactText(id, value) {

        const element = document.getElementById(id);

        if (!element) return;

        const icon = element.querySelector("i");

        element.textContent = "";

        if (icon) {
            element.appendChild(icon);
        }

        if (value) {
            element.appendChild(
                document.createTextNode(" " + value)
            );
        }
    }


    // ==============================
    // TEMPLATE
    // ==============================

    const resumePaper =
        document.getElementById("resumePaper");

    if (resumePaper) {

        resumePaper.classList.remove(
            "template-classic",
            "template-modern",
            "template-elegant"
        );

        const selectedTemplate =
            resumeData.template || "classic";

        resumePaper.classList.add(
            "template-" + selectedTemplate
        );

        console.log(
            "Selected Template:",
            selectedTemplate
        );
    }


    // ==============================
    // PERSONAL INFORMATION
    // ==============================

    setText(
        "previewName",
        resumeData.fullName
    );

    setText(
        "previewJobTitle",
        resumeData.jobTitle
    );

    setContactText(
        "previewEmail",
        resumeData.email
    );

    setContactText(
        "previewPhone",
        resumeData.phone
    );

    setContactText(
        "previewLocation",
        resumeData.location
    );


    // ==============================
    // PROFESSIONAL SUMMARY
    // ==============================

    setText(
        "previewSummary",
        resumeData.summary
    );


    // ==============================
    // EDUCATION
    // ==============================

    setText(
        "previewDegree",
        resumeData.degree
    );

    setText(
        "previewDepartment",
        resumeData.department
    );

    setText(
        "previewCollege",
        resumeData.college
    );

    setText(
        "previewCGPA",
        resumeData.cgpa
            ? "CGPA: " + resumeData.cgpa
            : ""
    );


    // Education Years

    let educationYears = "";

    if (
        resumeData.startYear ||
        resumeData.endYear
    ) {

        educationYears =
            (resumeData.startYear || "") +
            " - " +
            (resumeData.endYear || "");
    }

    setText(
        "previewEducationYears",
        educationYears
    );


    // ==============================
    // SKILLS
    // ==============================

    const skillsContainer =
        document.getElementById("previewSkills");

    if (skillsContainer) {

        skillsContainer.innerHTML = "";

        const skills =
            resumeData.skills
                ? resumeData.skills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "")
                : [];

        skills.forEach(function (skill) {

            const skillElement =
                document.createElement("span");

            skillElement.textContent = skill;

            skillsContainer.appendChild(
                skillElement
            );
        });
    }


    // ==============================
    // PROJECT
    // ==============================

    setText(
        "previewProjectName",
        resumeData.projectName
    );

    setText(
        "previewProjectTech",
        resumeData.projectTech
    );

    setText(
        "previewProjectDescription",
        resumeData.projectDescription
    );


    // ==============================
    // CERTIFICATION
    // ==============================

    let certificationText = "";

    if (resumeData.certification) {

        certificationText =
            resumeData.certification;

        if (resumeData.certOrganization) {

            certificationText +=
                " - " +
                resumeData.certOrganization;
        }
    }

    setText(
        "previewCertification",
        certificationText
    );


    // ==============================
    // ACHIEVEMENTS
    // ==============================

    const achievementsContainer =
        document.getElementById(
            "previewAchievements"
        );

    if (achievementsContainer) {

        achievementsContainer.innerHTML = "";

        const achievements =
            resumeData.achievements
                ? resumeData.achievements
                    .split("\n")
                    .map(item => item.trim())
                    .filter(item => item !== "")
                : [];

        achievements.forEach(function (achievement) {

            const li =
                document.createElement("li");

            li.textContent = achievement;

            achievementsContainer.appendChild(li);
        });
    }


    // ==============================
    // LANGUAGES
    // ==============================

    const languagesContainer =
        document.getElementById(
            "previewLanguages"
        );

    if (languagesContainer) {

        languagesContainer.innerHTML = "";

        const languages =
            Array.isArray(resumeData.languages)
                ? resumeData.languages
                : [];

        languages.forEach(function (language) {

            const span =
                document.createElement("span");

            span.textContent = language;

            languagesContainer.appendChild(
                span
            );
        });
    }


    // ==============================
    // SOCIAL LINKS
    // ==============================

    function setSocialLink(
        id,
        url
    ) {

        const element =
            document.getElementById(id);

        if (!element) return;

        if (url) {

            let finalUrl =
                url.trim();

            // Add https:// if user didn't type it

            if (
                !finalUrl.startsWith("http://") &&
                !finalUrl.startsWith("https://")
            ) {

                finalUrl =
                    "https://" + finalUrl;
            }

            element.href = finalUrl;

            element.target = "_blank";

            element.rel =
                "noopener noreferrer";

            element.style.display = "flex";

        } else {

            element.style.display = "none";
        }
    }


    setSocialLink(
        "previewLinkedIn",
        resumeData.linkedin
    );

    setSocialLink(
        "previewGithub",
        resumeData.github
    );

    setSocialLink(
        "previewPortfolio",
        resumeData.portfolio
    );


    // ==============================
    // PROFILE PHOTO
    // ==============================

    const previewPhoto =
        document.getElementById(
            "previewPhoto"
        );

    const photoPlaceholder =
        document.getElementById(
            "photoPlaceholder"
        );

    if (
        resumeData.profilePhoto &&
        previewPhoto
    ) {

        previewPhoto.src =
            resumeData.profilePhoto;

        previewPhoto.style.display =
            "block";

        if (photoPlaceholder) {

            photoPlaceholder.style.display =
                "none";
        }

    } else {

        if (previewPhoto) {

            previewPhoto.style.display =
                "none";
        }

        if (photoPlaceholder) {

            photoPlaceholder.style.display =
                "flex";
        }
    }


    // ==============================
    // QR CODE
    // ==============================

    const qrContainer =
        document.getElementById("qrCode");

    if (qrContainer) {

        qrContainer.innerHTML = "";

        if (
            resumeData.portfolio &&
            typeof QRCode !== "undefined"
        ) {

            new QRCode(
                qrContainer,
                {
                    text: resumeData.portfolio,

                    width: 80,

                    height: 80,

                    colorDark: "#1455A0",

                    colorLight: "#ffffff",

                    correctLevel:
                        QRCode.CorrectLevel.H
                }
            );

        } else {

            qrContainer.textContent =
                "No Portfolio";
        }
    }


    // ==============================
    // EDIT RESUME BUTTON
    // ==============================

    const editButton =
        document.getElementById(
            "editResumeBtn"
        );

    if (editButton) {

        editButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "resume-builder.html";
            }
        );
    }


    // ==============================
    // DOWNLOAD / PRINT
    // ==============================

    const downloadButton =
        document.getElementById(
            "downloadResumeBtn"
        );

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            function () {

                window.print();
            }
        );
    }

     // =========================================
// PROFESSIONAL ATS SCORE
// =========================================

const calculateATSButton =
    document.getElementById("calculateATSBtn");

const atsSection =
    document.getElementById("atsSection");

const atsScore =
    document.getElementById("atsScore");

const atsProgress =
    document.getElementById("atsProgress");

const atsMessage =
    document.getElementById("atsMessage");

const atsBreakdown =
    document.getElementById("atsBreakdown");


if (calculateATSButton) {

    calculateATSButton.addEventListener("click", function () {

        calculateATSButton.disabled = true;

        calculateATSButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';


        setTimeout(function () {

            let score = 0;

            const checks = [];
            const strengths = [];
            const weaknesses = [];
            const suggestions = [];


            // =========================================
            // 1. PROFESSIONAL SUMMARY - 15 MARKS
            // =========================================

            if (resumeData.summary && resumeData.summary.length >= 120) {

                score += 15;

                checks.push({
                    name: "Professional Summary",
                    status: "good",
                    points: "+15"
                });

                strengths.push(
                    "Professional Summary is detailed and well developed."
                );

            } else if (resumeData.summary && resumeData.summary.length >= 60) {

                score += 8;

                checks.push({
                    name: "Professional Summary",
                    status: "partial",
                    points: "+8"
                });

                weaknesses.push(
                    "Professional Summary is a little short."
                );

                suggestions.push(
                    "Expand your summary with your career interest, key skills and project experience."
                );

            } else {

                checks.push({
                    name: "Professional Summary",
                    status: "missing",
                    points: "0"
                });

                weaknesses.push(
                    "Professional Summary is missing or too short."
                );

                suggestions.push(
                    "Add a professional summary with your career goal, key skills and strengths."
                );
            }


            // =========================================
            // 2. TARGET JOB TITLE - 10 MARKS
            // =========================================

            if (resumeData.jobTitle) {

                score += 10;

                checks.push({
                    name: "Target Job Title",
                    status: "good",
                    points: "+10"
                });

                strengths.push(
                    "Target Job Title is clearly mentioned."
                );

            } else {

                checks.push({
                    name: "Target Job Title",
                    status: "missing",
                    points: "0"
                });

                weaknesses.push(
                    "Target Job Title is missing."
                );

                suggestions.push(
                    "Add a clear target role related to the job you want."
                );
            }


            // =========================================
            // 3. TECHNICAL SKILLS - 20 MARKS
            // =========================================

            const skillList = resumeData.skills
                ? resumeData.skills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "")
                : [];


            if (skillList.length >= 8) {

                score += 20;

                checks.push({
                    name: "Technical Skills & Keywords",
                    status: "good",
                    points: "+20"
                });

                strengths.push(
                    "Good number of technical skills and keywords are included."
                );

            } else if (skillList.length >= 5) {

                score += 15;

                checks.push({
                    name: "Technical Skills & Keywords",
                    status: "good",
                    points: "+15"
                });

                strengths.push(
                    "Relevant technical skills are included."
                );

                weaknesses.push(
                    "Technical skills section could include a few more relevant keywords."
                );

                suggestions.push(
                    "Add more relevant technical skills related to your target role."
                );

            } else if (skillList.length > 0) {

                score += 8;

                checks.push({
                    name: "Technical Skills & Keywords",
                    status: "partial",
                    points: "+8"
                });

                weaknesses.push(
                    "Only a few technical skills are listed."
                );

                suggestions.push(
                    "Add more relevant technical skills and tools used in your projects."
                );

            } else {

                checks.push({
                    name: "Technical Skills & Keywords",
                    status: "missing",
                    points: "0"
                });

                weaknesses.push(
                    "Technical Skills section is missing."
                );

                suggestions.push(
                    "Add programming languages, tools and technologies you know."
                );
            }


            // =========================================
            // 4. PROJECT - 20 MARKS
            // =========================================

            if (
                resumeData.projectName &&
                resumeData.projectTech &&
                resumeData.projectDescription &&
                resumeData.projectDescription.length >= 100
            ) {

                score += 20;

                checks.push({
                    name: "Project Experience",
                    status: "good",
                    points: "+20"
                });

                strengths.push(
                    "Project name, technologies and detailed description are provided."
                );

            } else if (
                resumeData.projectName &&
                resumeData.projectTech
            ) {

                score += 12;

                checks.push({
                    name: "Project Experience",
                    status: "partial",
                    points: "+12"
                });

                weaknesses.push(
                    "Project description needs more detail."
                );

                suggestions.push(
                    "Explain what you developed, technologies used and your contribution."
                );

            } else if (resumeData.projectName) {

                score += 7;

                checks.push({
                    name: "Project Experience",
                    status: "partial",
                    points: "+7"
                });

                weaknesses.push(
                    "Project technologies or detailed description are missing."
                );

                suggestions.push(
                    "Add the technologies used and explain the project clearly."
                );

            } else {

                checks.push({
                    name: "Project Experience",
                    status: "missing",
                    points: "0"
                });

                weaknesses.push(
                    "Project Experience is missing."
                );

                suggestions.push(
                    "Add at least one academic or personal project."
                );
            }


            // =========================================
            // 5. EDUCATION - 10 MARKS
            // =========================================

            if (
                resumeData.degree &&
                resumeData.department &&
                resumeData.college
            ) {

                score += 10;

                checks.push({
                    name: "Education",
                    status: "good",
                    points: "+10"
                });

                strengths.push(
                    "Education details are complete."
                );

            } else if (
                resumeData.degree ||
                resumeData.college
            ) {

                score += 5;

                checks.push({
                    name: "Education",
                    status: "partial",
                    points: "+5"
                });

                weaknesses.push(
                    "Some education details are missing."
                );

                suggestions.push(
                    "Complete your degree, department and college details."
                );

            } else {

                checks.push({
                    name: "Education",
                    status: "missing",
                    points: "0"
                });

                weaknesses.push(
                    "Education details are missing."
                );

                suggestions.push(
                    "Add your degree, department and college information."
                );
            }


            // =========================================
            // 6. ACHIEVEMENTS - 10 MARKS
            // =========================================

            if (resumeData.achievements) {

                const achievementList =
                    resumeData.achievements
                        .split("\n")
                        .map(item => item.trim())
                        .filter(item => item !== "");


                if (achievementList.length >= 2) {

                    score += 10;

                    checks.push({
                        name: "Achievements",
                        status: "good",
                        points: "+10"
                    });

                    strengths.push(
                        "Relevant achievements are included."
                    );

                } else {

                    score += 5;

                    checks.push({
                        name: "Achievements",
                        status: "partial",
                        points: "+5"
                    });

                    weaknesses.push(
                        "Only one achievement is listed."
                    );

                    suggestions.push(
                        "Add more genuine achievements if you have them."
                    );
                }

            } else {

                checks.push({
                    name: "Achievements",
                    status: "optional",
                    points: "0"
                });

                weaknesses.push(
                    "Achievements section is empty."
                );

                suggestions.push(
                    "Add relevant achievements if you have any."
                );
            }


            // =========================================
            // 7. CERTIFICATION - 5 MARKS
            // =========================================

            if (
                resumeData.certification &&
                resumeData.certOrganization
            ) {

                score += 5;

                checks.push({
                    name: "Certifications",
                    status: "good",
                    points: "+5"
                });

                strengths.push(
                    "Certification and organization details are included."
                );

            } else if (resumeData.certification) {

                score += 3;

                checks.push({
                    name: "Certifications",
                    status: "partial",
                    points: "+3"
                });

                weaknesses.push(
                    "Certification organization/provider is missing."
                );

                suggestions.push(
                    "Add the certification organization or issuing platform."
                );

            } else {

                checks.push({
                    name: "Certifications",
                    status: "optional",
                    points: "0"
                });

                weaknesses.push(
                    "No certification is listed."
                );

                suggestions.push(
                    "Add relevant certifications if you have completed any."
                );
            }


            // =========================================
            // 8. PROFESSIONAL LINKS - 5 MARKS
            // =========================================

            let linkCount = 0;

            if (resumeData.linkedin) linkCount++;
            if (resumeData.github) linkCount++;
            if (resumeData.portfolio) linkCount++;


            if (linkCount >= 2) {

                score += 5;

                checks.push({
                    name: "Professional Links",
                    status: "good",
                    points: "+5"
                });

                strengths.push(
                    "Professional links are available."
                );

            } else if (linkCount === 1) {

                score += 3;

                checks.push({
                    name: "Professional Links",
                    status: "partial",
                    points: "+3"
                });

                weaknesses.push(
                    "Only one professional link is provided."
                );

                suggestions.push(
                    "Consider adding LinkedIn, GitHub or a portfolio link."
                );

            } else {

                checks.push({
                    name: "Professional Links",
                    status: "optional",
                    points: "0"
                });

                weaknesses.push(
                    "Professional links are missing."
                );

                suggestions.push(
                    "Add LinkedIn, GitHub or a portfolio link if available."
                );
            }


            // =========================================
            // 9. RESUME STRUCTURE - 5 MARKS
            // =========================================

            let structurePoints = 0;

            if (resumeData.fullName) structurePoints += 1;
            if (resumeData.email) structurePoints += 1;
            if (resumeData.phone) structurePoints += 1;
            if (resumeData.languages && resumeData.languages.length > 0) structurePoints += 1;
            if (resumeData.location) structurePoints += 1;


            score += structurePoints;


            checks.push({
                name: "Resume Structure",
                status:
                    structurePoints >= 4
                        ? "good"
                        : structurePoints >= 2
                            ? "partial"
                            : "missing",
                points: "+" + structurePoints
            });


            if (structurePoints >= 4) {

                strengths.push(
                    "Basic resume structure and contact details are well provided."
                );

            } else {

                weaknesses.push(
                    "Some basic resume/contact details are missing."
                );

                suggestions.push(
                    "Complete your name, email, phone, location and language details."
                );
            }


            // =========================================
            // DISPLAY SCORE
            // =========================================

            if (atsScore) {
                atsScore.textContent = score;
            }
            localStorage.setItem("atsScore", score);


            if (atsProgress) {
                atsProgress.style.width = score + "%";
            }


            // =========================================
            // ATS MESSAGE
            // =========================================

            if (atsMessage) {

                let message = "";


                if (score >= 90) {

                    message =
                        "Excellent resume structure. Your resume contains strong content and important ATS-friendly sections.";

                } else if (score >= 80) {

                    message =
                        "Strong resume. A few improvements can make your resume more complete and ATS-friendly.";

                } else if (score >= 70) {

                    message =
                        "Good resume foundation. Strengthen the highlighted sections to improve your ATS score.";

                } else if (score >= 50) {

                    message =
                        "Your resume has useful information, but several sections need improvement.";

                } else {

                    message =
                        "Your resume needs more relevant content. Complete the important sections to improve ATS compatibility.";
                }


                atsMessage.textContent = message;
            }


            // =========================================
            // DISPLAY RESULTS
            // =========================================

            if (atsBreakdown) {

                atsBreakdown.innerHTML = "";


                // SCORE BREAKDOWN

                const breakdownTitle =
                    document.createElement("div");

                breakdownTitle.className =
                    "ats-result-title";

                breakdownTitle.innerHTML =
                    '<i class="fa-solid fa-chart-pie"></i> Score Breakdown';

                atsBreakdown.appendChild(
                    breakdownTitle
                );


                checks.forEach(function (check) {

                    const item =
                        document.createElement("div");

                    item.className =
                        "ats-check-item " +
                        check.status;


                    const name =
                        document.createElement("span");

                    name.className =
                        "ats-check-name";

                    name.textContent =
                        check.name;


                    const points =
                        document.createElement("span");

                    points.className =
                        "ats-check-points";

                    points.textContent =
                        check.points;


                    item.appendChild(name);
                    item.appendChild(points);

                    atsBreakdown.appendChild(item);

                });


                // =========================================
                // STRENGTHS
                // =========================================

                const strengthsBox =
                    document.createElement("div");

                strengthsBox.className =
                    "ats-feedback-box ats-strengths";


                const strengthsTitle =
                    document.createElement("div");

                strengthsTitle.className =
                    "ats-feedback-title";

                strengthsTitle.innerHTML =
                    '<i class="fa-solid fa-circle-check"></i> Strengths';


                strengthsBox.appendChild(
                    strengthsTitle
                );


                if (strengths.length === 0) {

                    strengths.push(
                        "Your resume has some useful information. Continue improving the missing sections."
                    );
                }


                strengths.forEach(function (text) {

                    const item =
                        document.createElement("div");

                    item.className =
                        "ats-feedback-item";

                    item.innerHTML =
                        '<i class="fa-solid fa-check"></i><span>' +
                        text +
                        '</span>';

                    strengthsBox.appendChild(item);

                });


                atsBreakdown.appendChild(
                    strengthsBox
                );


                // =========================================
                // WEAKNESSES
                // =========================================

                const weaknessesBox =
                    document.createElement("div");

                weaknessesBox.className =
                    "ats-feedback-box ats-weaknesses";


                const weaknessesTitle =
                    document.createElement("div");

                weaknessesTitle.className =
                    "ats-feedback-title";

                weaknessesTitle.innerHTML =
                    '<i class="fa-solid fa-triangle-exclamation"></i> Weaknesses / Areas to Improve';


                weaknessesBox.appendChild(
                    weaknessesTitle
                );


                if (weaknesses.length === 0) {

                    const item =
                        document.createElement("div");

                    item.className =
                        "ats-feedback-item";

                    item.innerHTML =
                        '<i class="fa-solid fa-check"></i><span>No major weaknesses were detected in the current resume content.</span>';

                    weaknessesBox.appendChild(item);

                } else {

                    weaknesses.forEach(function (text) {

                        const item =
                            document.createElement("div");

                        item.className =
                            "ats-feedback-item";

                        item.innerHTML =
                            '<i class="fa-solid fa-exclamation"></i><span>' +
                            text +
                            '</span>';

                        weaknessesBox.appendChild(item);

                    });
                }


                atsBreakdown.appendChild(
                    weaknessesBox
                );


                // =========================================
                // HOW TO IMPROVE
                // =========================================

                const suggestionsBox =
                    document.createElement("div");

                suggestionsBox.className =
                    "ats-feedback-box ats-suggestions";


                const suggestionsTitle =
                    document.createElement("div");

                suggestionsTitle.className =
                    "ats-feedback-title";

                suggestionsTitle.innerHTML =
                    '<i class="fa-solid fa-lightbulb"></i> How to Improve';


                suggestionsBox.appendChild(
                    suggestionsTitle
                );


                if (suggestions.length === 0) {

                    const item =
                        document.createElement("div");

                    item.className =
                        "ats-feedback-item";

                    item.innerHTML =
                        '<i class="fa-solid fa-check"></i><span>Your resume already contains the main ATS-friendly sections. Review grammar, clarity and role-specific keywords.</span>';

                    suggestionsBox.appendChild(item);

                } else {

                    suggestions.forEach(function (text) {

                        const item =
                            document.createElement("div");

                        item.className =
                            "ats-feedback-item";

                        item.innerHTML =
                            '<i class="fa-solid fa-arrow-right"></i><span>' +
                            text +
                            '</span>';

                        suggestionsBox.appendChild(item);

                    });
                }


                atsBreakdown.appendChild(
                    suggestionsBox
                );

            }


            // =========================================
            // SHOW ATS SECTION
            // =========================================

            if (atsSection) {

                atsSection.classList.add("show");

                atsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }


            // =========================================
            // RESET BUTTON
            // =========================================

            calculateATSButton.disabled = false;

            calculateATSButton.innerHTML =
                '<i class="fa-solid fa-chart-line"></i> Recheck ATS Score';


        }, 1000);

    });

}
    // ==============================
    // INTERVIEW QUESTIONS
    // ==============================

    const interviewButton =
        document.getElementById(
            "generateInterviewBtn"
        );

    const interviewSection =
        document.getElementById(
            "interviewSection"
        );

    const interviewQuestions =
        document.getElementById(
            "interviewQuestions"
        );


    if (
        interviewButton &&
        interviewQuestions
    ) {

        interviewButton.addEventListener(
            "click",
            function () {

                interviewButton.disabled =
                    true;

                interviewButton.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

                interviewQuestions.innerHTML =
                    "";

                if (interviewSection) {

                    interviewSection.classList.add(
                        "show"
                    );
                }


                // Small delay for AI-like effect

                setTimeout(
                    function () {

                        const questions = [];


                        // --------------------------
                        // GENERAL QUESTION
                        // --------------------------

                        questions.push({

                            question:
                                "Tell me about yourself and your academic background.",

                            answer:
                                "I am an enthusiastic student with a strong interest in technology and continuous learning. I am developing my technical skills through academic projects and practical experience. I enjoy learning new technologies, solving problems and improving my professional skills."
                        });


                        // --------------------------
                        // JOB TITLE
                        // --------------------------

                        if (
                            resumeData.jobTitle
                        ) {

                            questions.push({

                                question:
                                    "Why are you interested in becoming a " +
                                    resumeData.jobTitle +
                                    "?",

                                answer:
                                    "I am interested in this field because it allows me to use my technical knowledge, learn new technologies and solve real-world problems. I am also interested in continuously improving my skills in this area."
                            });
                        }


                        // --------------------------
                        // PROJECT
                        // --------------------------

                        if (
                            resumeData.projectName
                        ) {

                            questions.push({

                                question:
                                    'Can you explain your project "' +
                                    resumeData.projectName +
                                    '"?',

                                answer:
                                    resumeData.projectDescription ||
                                    "My project is designed to provide a practical and user-friendly solution to a real-world problem. I worked on the project to gain practical development experience and improve my technical and problem-solving skills."
                            });


                            questions.push({

                                question:
                                    "What technologies did you use in your project?",

                                answer:
                                    resumeData.projectTech
                                        ? "I used " +
                                          resumeData.projectTech +
                                          " to develop my project. These technologies helped me build the required features and create a user-friendly application."
                                        : "I used suitable web and programming technologies to develop my project and implement its main features."
                            });


                            questions.push({

                                question:
                                    "What challenges did you face while developing your project?",

                                answer:
                                    "During development, I faced some technical and implementation challenges. I solved them by researching the problem, testing different solutions and improving the implementation step by step."
                            });
                        }


                        // --------------------------
                        // SKILLS
                        // --------------------------

                        if (
                            resumeData.skills
                        ) {

                            const skills =
                                resumeData.skills
                                    .split(",")
                                    .map(
                                        skill =>
                                            skill.trim()
                                    )
                                    .filter(
                                        skill =>
                                            skill !== ""
                                    );

                            if (
                                skills.length > 0
                            ) {

                                questions.push({

                                    question:
                                        "Which technical skill are you most confident in?",

                                    answer:
                                        "I am continuously improving my technical skills through academic learning and practical projects. I am most confident in applying the skills mentioned in my resume while working on projects and solving practical problems."
                                });
                            }
                        }


                        // --------------------------
                        // EDUCATION
                        // --------------------------

                        if (
                            resumeData.degree ||
                            resumeData.department
                        ) {

                            questions.push({

                                question:
                                    "How does your academic background prepare you for your career?",

                                answer:
                                    "My academic studies have helped me develop technical knowledge, problem-solving ability and teamwork skills. Through assignments and projects, I have also gained practical experience that supports my career goals."
                            });
                        }


                        // --------------------------
                        // CERTIFICATION
                        // --------------------------

                        if (
                            resumeData.certification
                        ) {

                            questions.push({

                                question:
                                    "What did you learn from your certification?",

                                answer:
                                    "The certification helped me strengthen my knowledge in the subject and gave me an opportunity to understand concepts through practical learning."
                            });
                        }


                        // --------------------------
                        // ACHIEVEMENTS
                        // --------------------------

                        if (
                            resumeData.achievements
                        ) {

                            questions.push({

                                question:
                                    "Which achievement are you most proud of?",

                                answer:
                                    "I am proud of the achievements mentioned in my resume because they helped me improve my technical knowledge, confidence, teamwork and problem-solving skills."
                            });
                        }


                        // --------------------------
                        // CAREER GOAL
                        // --------------------------

                        questions.push({

                            question:
                                "What are your career goals?",

                            answer:
                                "My goal is to continuously improve my technical and professional skills, gain practical experience and build a successful career in the technology field."
                        });


                        // --------------------------
                        // FINAL QUESTION
                        // --------------------------

                        questions.push({

                            question:
                                "Why should we consider you for this opportunity?",

                            answer:
                                "I am a motivated learner who is willing to learn new technologies, work as part of a team and take responsibility for my work. I am also interested in applying my knowledge to practical problems and continuously improving myself."
                        });


                        // ==========================
                        // DISPLAY QUESTIONS
                        // ==========================

                        questions.forEach(
                            function (
                                item,
                                index
                            ) {

                                const questionCard =
                                    document.createElement(
                                        "div"
                                    );

                                questionCard.className =
                                    "interview-question-card";


                                // Question number

                                const number =
                                    document.createElement(
                                        "div"
                                    );

                                number.className =
                                    "question-number";

                                number.textContent =
                                    index + 1;


                                // Content

                                const content =
                                    document.createElement(
                                        "div"
                                    );

                                content.className =
                                    "question-content";


                                // Question

                                const questionTitle =
                                    document.createElement(
                                        "h3"
                                    );

                                questionTitle.textContent =
                                    item.question;


                                // Sample answer box

                                const answerBox =
                                    document.createElement(
                                        "div"
                                    );

                                answerBox.className =
                                    "sample-answer";


                                // Answer title

                                const answerTitle =
                                    document.createElement(
                                        "div"
                                    );

                                answerTitle.className =
                                    "sample-answer-title";

                                answerTitle.innerHTML =
                                    '<i class="fa-solid fa-lightbulb"></i> Sample Answer';


                                // Answer text

                                const answerText =
                                    document.createElement(
                                        "p"
                                    );

                                answerText.textContent =
                                    item.answer;


                                // Build answer

                                answerBox.appendChild(
                                    answerTitle
                                );

                                answerBox.appendChild(
                                    answerText
                                );


                                // Build content

                                content.appendChild(
                                    questionTitle
                                );

                                content.appendChild(
                                    answerBox
                                );


                                // Build card

                                questionCard.appendChild(
                                    number
                                );

                                questionCard.appendChild(
                                    content
                                );


                                // Add to page

                                interviewQuestions.appendChild(
                                    questionCard
                                );
                            }
                        );


                        // ==========================
                        // RESET BUTTON
                        // ==========================

                        interviewButton.disabled =
                            false;

                        interviewButton.innerHTML =
                            '<i class="fa-solid fa-comments"></i> Generate Interview Questions';


                    },
                    1000
                );
            }
        );
    }


    // ==============================
    // FINISHED
    // ==============================

    console.log(
        "Resume Preview Loaded Successfully"
    );

});
/* =========================================
   SHARE RESUME
========================================= */

const shareResumeBtn =
    document.getElementById("shareResumeBtn");

if (shareResumeBtn) {

    shareResumeBtn.addEventListener(
        "click",
        async function () {

            const resumeData =
                localStorage.getItem("resumeData");

            if (!resumeData) {

                alert("Resume data not found.");
                return;
            }

            try {

                const response = await fetch(
    "https://ai-resume-creator-production-b802.up.railway.app/save-resume",
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: resumeData
    }
);

                const result =
                    await response.json();

                if (result.success) {

                    const shareLink =
                        result.shareLink;

                    await navigator.clipboard.writeText(
                        shareLink
                    );

                    alert(
                        "Resume link copied!\n\n" +
                        shareLink
                    );

                } else {

                    alert(
                        "Unable to create share link."
                    );
                }

            } catch (error) {

                console.error(error);

                alert(
                    "Backend connection failed."
                );
            }

        }
    );

}