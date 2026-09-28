/* =========================================
   AI RESUME CREATOR
   RESUME BUILDER JAVASCRIPT
========================================= */

console.log("RESUME BUILDER JS LOADED");


/* =========================================
   COMMON FUNCTION
========================================= */

function getValue(id) {

    const element = document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value.trim();
}


/* =========================================
   GENERATE RESUME
========================================= */

const generateButton =
    document.getElementById("generateResume");

if (generateButton) {

    generateButton.addEventListener(
        "click",
        function () {

            console.log(
                "Generate Resume button clicked"
            );


            /* -----------------------------
               BASIC VALIDATION
            ----------------------------- */

            const fullName =
                getValue("fullName");

            const email =
                getValue("email");


            if (fullName === "") {

                alert(
                    "Please enter your full name."
                );

                document
                    .getElementById("fullName")
                    .focus();

                return;
            }


            if (email === "") {

                alert(
                    "Please enter your email address."
                );

                document
                    .getElementById("email")
                    .focus();

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                document
                    .getElementById("email")
                    .focus();

                return;
            }


            /* -----------------------------
               TEMPLATE
            ----------------------------- */

            const selectedTemplate =
                document.querySelector(
                    'input[name="resumeTemplate"]:checked'
                );


            const template =
                selectedTemplate
                    ? selectedTemplate.value
                    : "classic";


            /* -----------------------------
               LANGUAGES
            ----------------------------- */

            const languageCheckboxes =
                document.querySelectorAll(
                    '.language-options input[type="checkbox"]'
                );


            const selectedLanguages = [];


            languageCheckboxes.forEach(
                function (checkbox) {

                    if (checkbox.checked) {

                        selectedLanguages.push(
                            checkbox.value
                        );

                    }

                }
            );


            /* -----------------------------
               RESUME DATA
            ----------------------------- */

            const resumeData = {

                fullName:
                    getValue("fullName"),

                jobTitle:
                    getValue("jobTitle"),

                email:
                    getValue("email"),

                phone:
                    getValue("phone"),

                location:
                    getValue("location"),

                summary:
                    getValue("summary"),

                degree:
                    getValue("degree"),

                department:
                    getValue("department"),

                college:
                    getValue("college"),

                cgpa:
                    getValue("cgpa"),

                startYear:
                    getValue("startYear"),

                endYear:
                    getValue("endYear"),

                skills:
                    getValue("skills"),

                projectName:
                    getValue("projectName"),

                projectTech:
                    getValue("projectTech"),

                projectDescription:
                    getValue("projectDescription"),

                certification:
                    getValue("certification"),

                certOrganization:
                    getValue("certOrganization"),

                achievements:
                    getValue("achievements"),

                linkedin:
                    getValue("linkedin"),

                github:
                    getValue("github"),

                portfolio:
                    getValue("portfolio"),

                resumeLanguage:
                    document.getElementById(
                        "resumeLanguage"
                    )
                        ? document.getElementById(
                            "resumeLanguage"
                        ).value
                        : "English",

                languages:
                    selectedLanguages,

                template:
                    template,

                profilePhoto:
                    ""

            };


            /* -----------------------------
               PROFILE PHOTO
            ----------------------------- */

            const photoInput =
                document.getElementById(
                    "profilePhoto"
                );


            if (
                photoInput &&
                photoInput.files &&
                photoInput.files.length > 0
            ) {

                const file =
                    photoInput.files[0];


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    alert(
                        "Please select a valid image file."
                    );

                    return;
                }


                compressImage(
                    file,
                    function (compressedImage) {

                        resumeData.profilePhoto =
                            compressedImage;

                        saveAndOpenPreview(
                            resumeData
                        );

                    }
                );

            }

            else {

                saveAndOpenPreview(
                    resumeData
                );

            }

        }
    );

}


/* =========================================
   IMAGE COMPRESSION
========================================= */

function compressImage(
    file,
    callback
) {

    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            const image =
                new Image();


            image.onload =
                function () {

                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    const context =
                        canvas.getContext(
                            "2d"
                        );


                    const maxWidth =
                        500;

                    const maxHeight =
                        500;


                    let width =
                        image.width;

                    let height =
                        image.height;


                    if (
                        width > maxWidth
                    ) {

                        height =
                            height *
                            (
                                maxWidth /
                                width
                            );

                        width =
                            maxWidth;

                    }


                    if (
                        height > maxHeight
                    ) {

                        width =
                            width *
                            (
                                maxHeight /
                                height
                            );

                        height =
                            maxHeight;

                    }


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    context.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );


                    const compressedImage =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.7
                        );


                    callback(
                        compressedImage
                    );

                };


            image.src =
                event.target.result;

        };


    reader.readAsDataURL(file);

}


/* =========================================
   SAVE RESUME
========================================= */

function saveAndOpenPreview(
    resumeData
) {

    try {

        resumeData.updatedAt =
            new Date().toISOString();


        /* -----------------------------
           CREATE UNIQUE RESUME ID
        ----------------------------- */

        resumeData.resumeId =
            Date.now().toString();


        /* -----------------------------
           SAVE CURRENT RESUME
        ----------------------------- */

        localStorage.setItem(
            "resumeData",
            JSON.stringify(
                resumeData
            )
        );


        /* -----------------------------
           SAVE MULTIPLE RESUMES
        ----------------------------- */

        let savedResumes = [];


        const existingResumes =
            localStorage.getItem(
                "savedResumes"
            );


        if (existingResumes) {

            try {

                savedResumes =
                    JSON.parse(
                        existingResumes
                    );

                if (
                    !Array.isArray(
                        savedResumes
                    )
                ) {

                    savedResumes = [];

                }

            }
            catch (error) {

                savedResumes = [];

            }

        }


        /* -----------------------------
           ADD NEW RESUME
        ----------------------------- */

        savedResumes.push(
            resumeData
        );


        /* -----------------------------
           SAVE RESUME LIST
        ----------------------------- */

        localStorage.setItem(
            "savedResumes",
            JSON.stringify(
                savedResumes
            )
        );


        console.log(
            "Resume Data Saved:",
            resumeData
        );


        console.log(
            "All Saved Resumes:",
            savedResumes
        );


        alert(
            "Resume information saved successfully!"
        );


        window.location.href =
            "resume-preview.html";

    }

    catch (error) {

        console.error(
            "Error while saving resume:",
            error
        );


        if (
            error.name ===
            "QuotaExceededError"
        ) {

            alert(
                "Storage is full. Old resume data will be cleared. Please click Create Resume again."
            );


            localStorage.removeItem(
                "resumeData"
            );

            localStorage.removeItem(
                "savedResumes"
            );

        }

        else {

            alert(
                "Something went wrong while saving your resume."
            );

        }

    }

}


/* =========================================
   AI PROFESSIONAL SUMMARY
========================================= */

const aiSummaryButton =
    document.getElementById(
        "generateSummaryAI"
    );


if (aiSummaryButton) {

    aiSummaryButton.addEventListener(
        "click",
        function () {

            const jobTitle =
                getValue("jobTitle");

            const skills =
                getValue("skills");

            const projectName =
                getValue("projectName");


            if (
                jobTitle === "" &&
                skills === "" &&
                projectName === ""
            ) {

                alert(
                    "Please enter Job Title, Skills or Project first."
                );

                return;
            }


            aiSummaryButton.disabled =
                true;


            aiSummaryButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';


            setTimeout(
                function () {

                    let summary = "";


                    /* -----------------------------------------
                       JOB TITLE + SKILLS + PROJECT
                    ----------------------------------------- */

                    if (
                        jobTitle &&
                        skills &&
                        projectName
                    ) {

                        summary =
                            "Motivated and enthusiastic " +
                            jobTitle +
                            " with a strong interest in technology and professional development. " +
                            "Skilled in " +
                            skills +
                            ", with experience in developing academic projects such as " +
                            projectName +
                            ". " +
                            "Passionate about learning new technologies, solving real-world problems, " +
                            "and continuously improving technical and problem-solving skills.";

                    }


                    /* -----------------------------------------
                       JOB TITLE + SKILLS
                    ----------------------------------------- */

                    else if (
                        jobTitle &&
                        skills
                    ) {

                        summary =
                            "Motivated and enthusiastic " +
                            jobTitle +
                            " with a strong interest in technology and continuous learning. " +
                            "Skilled in " +
                            skills +
                            ". " +
                            "Passionate about learning new technologies, solving real-world problems, " +
                            "and developing strong technical and problem-solving skills.";

                    }


                    /* -----------------------------------------
                       JOB TITLE + PROJECT
                    ----------------------------------------- */

                    else if (
                        jobTitle &&
                        projectName
                    ) {

                        summary =
                            "Motivated and enthusiastic " +
                            jobTitle +
                            " with a strong interest in developing practical technology solutions. " +
                            "Experienced in working on projects such as " +
                            projectName +
                            ". " +
                            "Passionate about learning new technologies, solving real-world problems, " +
                            "and improving technical and problem-solving skills.";

                    }


                    /* -----------------------------------------
                       ONLY SKILLS
                    ----------------------------------------- */

                    else if (skills) {

                        summary =
                            "Motivated and enthusiastic student with a strong interest in technology " +
                            "and continuous learning. " +
                            "Skilled in " +
                            skills +
                            ". " +
                            "Passionate about developing practical skills, solving real-world problems, " +
                            "and improving technical and problem-solving abilities.";

                    }


                    /* -----------------------------------------
                       ONLY PROJECT
                    ----------------------------------------- */

                    else if (projectName) {

                        summary =
                            "Motivated and enthusiastic student with a strong interest in technology " +
                            "and practical project development. " +
                            "Experienced in working on projects such as " +
                            projectName +
                            ". " +
                            "Passionate about learning new technologies, solving real-world problems, " +
                            "and continuously improving technical skills.";

                    }


                    /* -----------------------------------------
                       DEFAULT
                    ----------------------------------------- */

                    else {

                        summary =
                            "Motivated and enthusiastic student with a strong interest in technology " +
                            "and continuous learning. Passionate about developing practical skills, " +
                            "working on real-world projects, solving problems, and improving technical " +
                            "and professional abilities.";

                    }


                    const summaryBox =
                        document.getElementById(
                            "summary"
                        );


                    if (summaryBox) {

                        summaryBox.value =
                            summary;

                    }


                    aiSummaryButton.disabled =
                        false;


                    aiSummaryButton.innerHTML =
                        '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate with AI';

                },
                1000
            );

        }
    );

}


/* =========================================
   AI PROJECT DESCRIPTION
========================================= */

const aiProjectButton =
    document.getElementById(
        "generateProjectAI"
    );


if (aiProjectButton) {

    aiProjectButton.addEventListener(
        "click",
        function () {

            const projectName =
                getValue("projectName");

            const projectTech =
                getValue("projectTech");


            if (
                projectName === "" &&
                projectTech === ""
            ) {

                alert(
                    "Please enter Project Name or Technologies first."
                );

                return;
            }


            aiProjectButton.disabled =
                true;


            aiProjectButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';


            setTimeout(
                function () {

                    let description = "";


                    if (
                        projectName &&
                        projectTech
                    ) {

                        description =
                            projectName +
                            " is a web-based application developed using " +
                            projectTech +
                            ". The project is designed to provide a simple, user-friendly solution for creating and managing professional digital content. It demonstrates practical knowledge of software development, user interface design, and problem-solving skills.";

                    }

                    else if (
                        projectName
                    ) {

                        description =
                            projectName +
                            " is a practical technology project designed to provide a simple and user-friendly solution to a real-world problem. The project demonstrates technical knowledge, problem-solving ability, and practical development skills.";

                    }

                    else {

                        description =
                            "This project demonstrates practical knowledge of " +
                            projectTech +
                            " and focuses on developing a useful, user-friendly technology solution.";

                    }


                    const descriptionBox =
                        document.getElementById(
                            "projectDescription"
                        );


                    if (descriptionBox) {

                        descriptionBox.value =
                            description;

                    }


                    aiProjectButton.disabled =
                        false;


                    aiProjectButton.innerHTML =
                        '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate with AI';

                },
                1000
            );

        }
    );

}


/* =========================================
   AI RESUME SUGGESTIONS
========================================= */

const generateSuggestionsButton =
    document.getElementById(
        "generateSuggestionsAI"
    );


if (generateSuggestionsButton) {

    generateSuggestionsButton.addEventListener(
        "click",
        function () {

            const jobTitle =
                getValue("jobTitle");

            const skills =
                getValue("skills");

            const summary =
                getValue("summary");

            const projectName =
                getValue("projectName");

            const projectDescription =
                getValue(
                    "projectDescription"
                );

            const certification =
                getValue("certification");

            const achievements =
                getValue("achievements");

            const linkedin =
                getValue("linkedin");

            const github =
                getValue("github");

            const portfolio =
                getValue("portfolio");


            /* -----------------------------
               BUTTON LOADING
            ----------------------------- */

            generateSuggestionsButton.disabled =
                true;


            generateSuggestionsButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';


            setTimeout(
                function () {

                    const suggestions = [];


                    /* -----------------------------
                       JOB TITLE
                    ----------------------------- */

                    if (!jobTitle) {

                        suggestions.push(
                            "Add a clear job title or career role."
                        );

                    }


                    /* -----------------------------
                       SUMMARY
                    ----------------------------- */

                    if (!summary) {

                        suggestions.push(
                            "Add a professional summary to introduce your skills and career interests."
                        );

                    }

                    else if (
                        summary.length < 80
                    ) {

                        suggestions.push(
                            "Your professional summary is short. Add your key skills, interests and project experience."
                        );

                    }


                    /* -----------------------------
                       SKILLS
                    ----------------------------- */

                    if (!skills) {

                        suggestions.push(
                            "Add relevant technical skills such as programming languages, tools or technologies."
                        );

                    }

                    else {

                        const skillList =
                            skills
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
                            skillList.length < 5
                        ) {

                            suggestions.push(
                                "Consider adding more relevant technical skills to strengthen your skills section."
                            );

                        }

                    }


                    /* -----------------------------
                       PROJECT
                    ----------------------------- */

                    if (!projectName) {

                        suggestions.push(
                            "Add at least one academic or personal project."
                        );

                    }


                    if (
                        projectName &&
                        !projectDescription
                    ) {

                        suggestions.push(
                            "Add a clear project description explaining what you built and which technologies you used."
                        );

                    }


                    /* -----------------------------
                       CERTIFICATION
                    ----------------------------- */

                    if (!certification) {

                        suggestions.push(
                            "Add relevant certifications if you have completed any."
                        );

                    }


                    /* -----------------------------
                       ACHIEVEMENTS
                    ----------------------------- */

                    if (!achievements) {

                        suggestions.push(
                            "Add academic achievements, hackathons, workshops or other relevant accomplishments."
                        );

                    }


                    /* -----------------------------
                       SOCIAL LINKS
                    ----------------------------- */

                    if (!linkedin) {

                        suggestions.push(
                            "Add your LinkedIn profile to make your professional profile easier to explore."
                        );

                    }


                    if (!github) {

                        suggestions.push(
                            "Add your GitHub profile if you have coding or development projects."
                        );

                    }


                    if (!portfolio) {

                        suggestions.push(
                            "Add a portfolio link to showcase your projects and work."
                        );

                    }


                    /* -----------------------------
                       DEFAULT
                    ----------------------------- */

                    if (
                        suggestions.length === 0
                    ) {

                        suggestions.push(
                            "Your resume has the main sections filled. Review the content for grammar, clarity and consistency before generating the final resume."
                        );

                    }


                    /* -----------------------------
                       DISPLAY
                    ----------------------------- */

                    const resultBox =
                        document.getElementById(
                            "aiSuggestionsResult"
                        );


                    if (resultBox) {

                        resultBox.innerHTML =
                            '<div class="ai-suggestion-title">' +
                            '<i class="fa-solid fa-lightbulb"></i> Resume Improvement Suggestions' +
                            '</div>';


                        suggestions.forEach(
                            function (suggestion) {

                                const item =
                                    document.createElement(
                                        "div"
                                    );


                                item.className =
                                    "ai-suggestion-item";


                                item.innerHTML =
                                    '<i class="fa-solid fa-check"></i>' +
                                    '<span>' +
                                    suggestion +
                                    '</span>';


                                resultBox.appendChild(
                                    item
                                );

                            }
                        );


                        resultBox.classList.add(
                            "show"
                        );

                    }


                    /* -----------------------------
                       BUTTON RESET
                    ----------------------------- */

                    generateSuggestionsButton.disabled =
                        false;


                    generateSuggestionsButton.innerHTML =
                        '<i class="fa-solid fa-wand-magic-sparkles"></i> Get AI Suggestions';

                },
                1000
            );

        }
    );

}


/* =========================================
   FINAL MESSAGE
========================================= */

console.log(
    "AI Resume Builder Loaded Successfully"
);
/* =========================================
   SAVE BUTTON
========================================= */

const saveButton =
    document.getElementById("saveResume");

if (saveButton) {

    saveButton.addEventListener(
        "click",
        function () {

            /* Use existing Generate Resume logic */

            if (generateButton) {

                generateButton.click();

            }

        }
    );

}