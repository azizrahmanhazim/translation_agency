// Real-time Validation
document.getElementById('quote-form').addEventListener('input', function(e) {
    const field = e.target;
    const errorElement = document.getElementById(`error-${field.id}`);

    if (field.validity.valid) {
        errorElement.style.display = 'none';
    } else {
        errorElement.style.display = 'block';
    }
});

// File Upload Progress
document.getElementById('document').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    if (file) {
        progressContainer.style.display = 'block';
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                progressBar.classList.remove('progress-bar-animated');
                progressBar.classList.add('bg-success');
            } else {
                width += 10;
                progressBar.style.width = width + '%';
            }
        }, 200);
    }
});