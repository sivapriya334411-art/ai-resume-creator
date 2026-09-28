document.addEventListener("DOMContentLoaded", function () {

    const resumeData = localStorage.getItem("resumeData");

    const emptyCard = document.querySelector(".empty-card");

    if (!emptyCard) {
        return;
    }

    // No resume created yet
    if (!resumeData) {
        return;
    }

    try {

        const data = JSON.parse(resumeData);

        const fullName = data.fullName || "Untitled Resume";
        const jobTitle = data.jobTitle || "Professional Resume";

        emptyCard.innerHTML = `
            <div class="resume-item">

                <div class="resume-item-icon">
                    <i class="fa-solid fa-file-lines"></i>
                </div>

                <div class="resume-item-info">

                    <h3>${fullName}</h3>

                    <p>${jobTitle}</p>

                    <span>
                        Recently created
                    </span>

                </div>

                <div class="resume-item-actions">

                    <a href="resume-preview.html"
                       class="resume-view-btn">
                        <i class="fa-solid fa-eye"></i>
                        View
                    </a>

                    <a href="resume-builder.html"
                       class="resume-edit-btn">
                        <i class="fa-solid fa-pen"></i>
                        Edit
                    </a>

                </div>

            </div>
        `;

    } catch (error) {

        console.error(
            "Unable to load resume data:",
            error
        );

    }

});