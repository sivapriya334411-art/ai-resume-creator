document.addEventListener("DOMContentLoaded", function () {

    const resumeList =
        document.getElementById("resumeList");

    /* -----------------------------
       GET ALL SAVED RESUMES
    ----------------------------- */

    let savedResumes = [];

    const savedData =
        localStorage.getItem("savedResumes");

    if (savedData) {

        try {

            savedResumes =
                JSON.parse(savedData);

            if (!Array.isArray(savedResumes)) {
                savedResumes = [];
            }

        } catch (error) {

            console.error(
                "Unable to read saved resumes:",
                error
            );

            savedResumes = [];
        }
    }

    /* -----------------------------
       OLD RESUME DATA FALLBACK
    ----------------------------- */

    if (savedResumes.length === 0) {

        const oldResume =
            localStorage.getItem("resumeData");

        if (oldResume) {

            try {

                const data =
                    JSON.parse(oldResume);

                savedResumes = [data];

            } catch (error) {

                console.error(
                    "Unable to read resume data:",
                    error
                );
            }
        }
    }

    /* -----------------------------
       NO RESUMES
    ----------------------------- */

    if (savedResumes.length === 0) {

        return;
    }

    /* -----------------------------
       SHOW ALL RESUMES
    ----------------------------- */

    resumeList.innerHTML = "";

    savedResumes.forEach(function (data, index) {

        const fullName =
            data.fullName ||
            "Untitled Resume";

        const jobTitle =
            data.jobTitle ||
            "Professional Resume";

        const templateName =
            data.template
                ? data.template.charAt(0).toUpperCase() +
                  data.template.slice(1) +
                  " Template"
                : "Classic Template";

        /* -----------------------------
           COMPLETION
        ----------------------------- */

        const importantFields = [

            data.fullName,
            data.email,
            data.jobTitle,
            data.summary,
            data.skills,
            data.projectName,
            data.degree

        ];

        const completedFields =
            importantFields.filter(function (field) {

                return field &&
                       field.trim() !== "";

            }).length;

        const completion =
            Math.round(
                (completedFields /
                 importantFields.length) * 100
            );

        const status =
            completion >= 80
                ? "Complete"
                : "In Progress";

        const statusClass =
            completion >= 80
                ? "status-complete"
                : "status-progress";

        /* -----------------------------
           ATS SCORE
        ----------------------------- */

        const savedATSScore =
            localStorage.getItem("atsScore");

        const atsScore =
            savedATSScore
                ? savedATSScore + "%"
                : "Not Checked";

        /* -----------------------------
           UPDATED DATE
        ----------------------------- */

        let updatedDate =
            "Recently";

        if (data.updatedAt) {

            const date =
                new Date(data.updatedAt);

            updatedDate =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );
        }

        /* -----------------------------
           CREATE CARD
        ----------------------------- */

        const card =
            document.createElement("div");

        card.className =
            "resume-card";

        card.innerHTML = `

            <div class="resume-card-icon">

                <div class="mini-resume">

                    <div class="mini-top">

                        <div class="mini-photo"></div>

                        <div class="mini-name">

                            <strong>
                                ${fullName}
                            </strong>

                            <small>
                                ${jobTitle}
                            </small>

                        </div>

                    </div>

                    <div class="mini-line"></div>

                    <div class="mini-line short"></div>

                    <div class="mini-title"></div>

                    <div class="mini-line"></div>

                    <div class="mini-line"></div>

                    <div class="mini-title"></div>

                    <div class="mini-line"></div>

                    <div class="mini-line short"></div>

                </div>

            </div>


            <div class="resume-card-info">

                <h3>
                    ${fullName}
                </h3>

                <p class="resume-job-title">
                    ${jobTitle}
                </p>

                <div class="resume-meta">

                    <span>

                        <i class="fa-solid fa-layer-group"></i>

                        ${templateName}

                    </span>

                    <span class="${statusClass}">

                        <i class="fa-solid fa-circle"></i>

                        ${status}

                    </span>

                </div>

                <div class="resume-updated">

                    <i class="fa-regular fa-calendar"></i>

                    Updated ${updatedDate}

                </div>

            </div>


            <div class="resume-stats">

                <div class="stat-box">

                    <span class="stat-label">
                        ATS Score
                    </span>

                    <strong>
                        ${atsScore}
                    </strong>

                </div>

            </div>


            <div class="resume-card-actions">

                <button
                    class="view-btn"
                    data-id="${data.resumeId || index}"
                >

                    <i class="fa-solid fa-eye"></i>

                    View

                </button>


                <button
                    class="edit-btn"
                    data-id="${data.resumeId || index}"
                >

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>


                <button
                    class="delete-btn"
                    data-id="${data.resumeId || index}"
                >

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        `;

        resumeList.appendChild(card);

    });


    /* -----------------------------
       VIEW / EDIT BUTTONS
    ----------------------------- */

    document
        .querySelectorAll(
            ".view-btn, .edit-btn"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        this.getAttribute(
                            "data-id"
                        );

                    const selectedResume =
                        savedResumes.find(
                            function (resume, index) {

                                return String(
                                    resume.resumeId || index
                                ) === String(id);

                            }
                        );

                    if (!selectedResume) {
                        return;
                    }

                    /* -----------------------------
                       SET SELECTED RESUME
                    ----------------------------- */

                    localStorage.setItem(
                        "resumeData",
                        JSON.stringify(
                            selectedResume
                        )
                    );

                    /* -----------------------------
                       OPEN PAGE
                    ----------------------------- */

                    if (
                        this.classList.contains(
                            "view-btn"
                        )
                    ) {

                        window.location.href =
                            "resume-preview.html";

                    } else {

                        window.location.href =
                            "resume-builder.html";

                    }

                }
            );

        });


    /* -----------------------------
       DELETE RESUME
    ----------------------------- */

    document
        .querySelectorAll(".delete-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        this.getAttribute(
                            "data-id"
                        );

                    const selectedResume =
                        savedResumes.find(
                            function (resume, index) {

                                return String(
                                    resume.resumeId || index
                                ) === String(id);

                            }
                        );

                    if (!selectedResume) {
                        return;
                    }

                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete this resume?"
                        );

                    if (!confirmDelete) {
                        return;
                    }

                    /* -----------------------------
                       REMOVE SELECTED RESUME
                    ----------------------------- */

                    savedResumes =
                        savedResumes.filter(
                            function (resume, index) {

                                return String(
                                    resume.resumeId || index
                                ) !== String(id);

                            }
                        );

                    /* -----------------------------
                       SAVE UPDATED LIST
                    ----------------------------- */

                    localStorage.setItem(
                        "savedResumes",
                        JSON.stringify(
                            savedResumes
                        )
                    );

                    /* -----------------------------
                       REMOVE CURRENT RESUME
                    ----------------------------- */

                    if (
                        selectedResume.resumeId
                    ) {

                        const currentResume =
                            localStorage.getItem(
                                "resumeData"
                            );

                        if (currentResume) {

                            try {

                                const currentData =
                                    JSON.parse(
                                        currentResume
                                    );

                                if (
                                    currentData.resumeId ===
                                    selectedResume.resumeId
                                ) {

                                    localStorage.removeItem(
                                        "resumeData"
                                    );

                                }

                            } catch (error) {

                                console.error(error);

                            }

                        }

                    }

                    /* -----------------------------
                       REFRESH PAGE
                    ----------------------------- */

                    window.location.reload();

                }
            );

        });

});