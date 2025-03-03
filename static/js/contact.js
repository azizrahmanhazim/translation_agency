document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();  // ✅ Prevent page reload

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var subject = document.getElementById("subject").value.trim();
    var message = document.getElementById("message").value.trim();

    // ✅ Error message containers
    var errorName = document.getElementById("error-name");
    var errorEmail = document.getElementById("error-email");
    var errorSubject = document.getElementById("error-subject");
    var errorMessage = document.getElementById("error-message");
    var successMessage = document.getElementById("success-message");

    // ✅ Reset previous error messages
    errorName.style.display = "none";
    errorEmail.style.display = "none";
    errorSubject.style.display = "none";
    errorMessage.style.display = "none";
    successMessage.style.display = "none"; // ✅ Hide success message initially

    var isValid = true;

    // ✅ Check required fields
    if (name === "") {
        errorName.style.display = "block";
        isValid = false;
    }
    if (email === "") {
        errorEmail.style.display = "block";
        isValid = false;
    }
    if (subject === "") {
        errorSubject.style.display = "block";
        isValid = false;
    }
    if (message === "") {
        errorMessage.style.display = "block";
        isValid = false;
    }

    if (!isValid) {
        return; // ❌ Stop form submission if there are errors
    }

    var formData = new FormData(document.getElementById("contact-form"));

    var submitButton = document.getElementById("submit-btn");
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/contact", true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest"); // ✅ Prevents redirect

    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);

        if (xhr.status == 200) {
            // ✅ Show success message inside the page
            successMessage.style.display = "flex";
            successMessage.classList.add("fade-in");
            successMessage.innerHTML = `<i class="fas fa-check-circle me-2"></i> ${response.message}`;

            // ✅ Reset form fields after successful submission
            document.getElementById("contact-form").reset();

            // ✅ Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // ✅ Hide success message after 7 seconds
            setTimeout(() => {
                successMessage.style.display = "none";
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }, 7000);
        } else {
            // ✅ Show error message inside the page instead of JSON
            successMessage.classList.replace("alert-success", "alert-danger");
            successMessage.style.display = "flex";
            successMessage.innerHTML = `<i class="fas fa-times-circle me-2"></i> ${response.message}`;

            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
        }
    };

    xhr.send(formData);
});
