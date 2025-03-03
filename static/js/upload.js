document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("quote-form");
    const fileInput = document.getElementById("document");
    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const submitButton = document.getElementById("submit-btn");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");
    const messageField = document.getElementById("message");
    const messageError = document.getElementById("error-message-field");

    let fileUploaded = false;
    let uploadedFilename = "";

    // ✅ Validate Email Format
    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // ✅ Validate Message Field (Min 10 Characters)
    messageField.addEventListener("input", function () {
        if (messageField.value.trim().length < 10) {
            messageError.style.display = "block";
            messageError.innerText = "Message must be at least 10 characters.";
        } else {
            messageError.style.display = "none";
        }
    });

    // ✅ Handle File Upload Progress
    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            let file = fileInput.files[0];

            progressContainer.style.display = "block";
            progressBar.style.width = "0%";
            progressBar.classList.remove("bg-success");

            let formData = new FormData();
            formData.append("document", file);

            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/upload_file", true);

            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    let percentComplete = Math.round((event.loaded / event.total) * 100);
                    progressBar.style.width = percentComplete + "%";
                    progressBar.innerText = percentComplete + "%";
                }
            };

            xhr.onload = function () {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    uploadedFilename = response.filename;
                    fileUploaded = true;

                    progressBar.style.width = "100%";
                    progressBar.innerText = "Upload Complete!";
                    progressBar.classList.add("bg-success");

                    // Hide progress bar after 3 seconds
                    setTimeout(() => {
                        progressContainer.style.display = "none";
                    }, 3000);
                } else {
                    errorMessage.style.display = "block";
                    errorMessage.innerText = "File upload failed. Please try again.";
                    progressContainer.style.display = "none";
                    fileUploaded = false;
                }
            };

            xhr.onerror = function () {
                errorMessage.style.display = "block";
                errorMessage.innerText = "Error occurred while uploading. Please try again.";
                progressContainer.style.display = "none";
                fileUploaded = false;
            };

            xhr.send(formData);
        }
    });

    // ✅ Handle Form Submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;
        let firstInvalidField = null;

        const requiredFields = ["name", "email", "service", "language", "message"];

        requiredFields.forEach((fieldId) => {
            let field = document.getElementById(fieldId);
            let errorDiv = document.getElementById(`error-${fieldId}`);

            if (!field.value.trim()) {
                errorDiv.style.display = "block";
                errorDiv.innerText = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required.`;
                isValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            } else {
                errorDiv.style.display = "none";
            }
        });

        // ✅ Email Validation
        let emailField = document.getElementById("email");
        let emailErrorDiv = document.getElementById("error-email");
        if (!isValidEmail(emailField.value)) {
            emailErrorDiv.style.display = "block";
            emailErrorDiv.innerText = "Please enter a valid email address.";
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = emailField;
            }
        } else {
            emailErrorDiv.style.display = "none";
        }

        // ✅ Message Validation (Ensure at least 10 characters)
        if (messageField.value.trim().length < 10) {
            messageError.style.display = "block";
            messageError.innerText = "Message must be at least 10 characters.";
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = messageField;
            }
        } else {
            messageError.style.display = "none";
        }

        if (!isValid) {
            firstInvalidField.focus();
            errorMessage.style.display = "block";
            errorMessage.innerText = "Please fill out all required fields correctly.";
            return;
        } else {
            errorMessage.style.display = "none";
        }

        // ✅ Disable Submit Button & Show Sending Text
        submitButton.disabled = true;
        submitButton.innerText = "Sending...";

        let formData = new FormData(form);
        formData.append("uploaded_filename", uploadedFilename);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/quote", true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onload = function () {
            let response = JSON.parse(xhr.responseText);

            if (xhr.status === 200) {
                successMessage.style.display = "block";
                successMessage.innerText = response.message;

                // ✅ Reset Form
                form.reset();
                fileUploaded = false;
                uploadedFilename = "";
                fileInput.value = "";

                progressContainer.style.display = "none";
                progressBar.style.width = "0%";
                progressBar.innerText = "";
                progressBar.classList.remove("bg-success");

                submitButton.disabled = false;
                submitButton.innerText = "Submit Request";

                // ✅ Scroll to Top After Success
                window.scrollTo({ top: 0, behavior: "smooth" });

                // ✅ Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = "none";
                }, 5000);
            } else {
                errorMessage.style.display = "block";
                errorMessage.innerText = response.message;
                submitButton.disabled = false;
                submitButton.innerText = "Submit Request";
            }
        };

        xhr.onerror = function () {
            errorMessage.style.display = "block";
            errorMessage.innerText = "Error occurred. Please try again.";
            submitButton.disabled = false;
            submitButton.innerText = "Submit Request";
        };

        xhr.send(formData);
    });
});
