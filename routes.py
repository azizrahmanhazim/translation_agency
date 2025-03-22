from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from flask_mail import Message
from werkzeug.utils import secure_filename
import os
import re
from app import app, mail

# ✅ Allowed file extensions
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "txt"}

def allowed_file(filename):
    """ ✅ Check if file has a valid extension """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ✅ Email validation function
def is_valid_email(email):
    """ ✅ Checks if an email is in a valid format """
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(email_regex, email)

# ✅ Homepage Route
@app.route('/')
def home():
    return render_template('index.html', active_page="home")

# ✅ Services Page Route
@app.route('/services')
def services():
    return render_template('services.html', active_page="services")

# ✅ Languages Page Route
@app.route('/languages')
def languages():
    return render_template('languages.html', active_page="languages")

# ✅ About Page Route
@app.route('/about')
def about():
    return render_template('about.html', active_page="about")

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/search')
def search():
    query = request.args.get('q', '')  # Get the search query from the URL parameters
    # Add logic to handle the search (e.g., query a database)
    return render_template('search_results.html', query=query)
# ✅ Contact Page Route
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not subject or not message:
            return jsonify({"message": "Please fill out all required fields."}), 400

        if not is_valid_email(email):
            return jsonify({"message": "Invalid email format."}), 400

        email_subject = f"New Contact Inquiry: {subject}"
        email_body = f"""
        Name: {name}
        Email: {email}
        Subject: {subject}
        Message: {message}
        """

        try:
            msg = Message(email_subject, sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[app.config['MAIL_DEFAULT_SENDER']])
            msg.body = email_body
            mail.send(msg)
            return jsonify({"message": "Thank you! Your message has been sent successfully."}), 200
        except Exception as e:
            return jsonify({"message": f"Email sending failed: {str(e)}"}), 500

    return render_template('contact.html', active_page="contact")

# ✅ Quote Request Route
@app.route('/quote', methods=['GET', 'POST'])
def quote():
    errors = {}  # Dictionary to store field-specific errors

    if request.method == 'POST':
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        service = request.form.get('service', '').strip()
        language = request.form.get('language', '').strip()
        message = request.form.get('message', '').strip()
        document = request.files.get('document')

        # Validate form fields
        if not name or len(name) < 2:
            errors['name'] = "Name must be at least 2 characters."
        if not email or not is_valid_email(email):
            errors['email'] = "A valid email is required."
        if not service:
            errors['service'] = "Service type is required."
        if not language:
            errors['language'] = "Target language is required."
        if not message or len(message) < 10:
            errors['message'] = "Message must be at least 10 characters."

        # Validate file upload (if provided)
        if document and document.filename:
            if not allowed_file(document.filename):
                errors['document'] = "Invalid file format. Allowed formats: PDF, DOC, DOCX, TXT."
            if document.content_length > app.config['MAX_CONTENT_LENGTH']:
                errors['document'] = "File size exceeds the 10MB limit."

        # If there are errors, render the form with errors
        if errors:
            return render_template('quote.html', errors=errors)

        # Process the form data (e.g., send email)
        subject = f"New Quote Request from {name}"
        body = f"""
        Name: {name}
        Email: {email}
        Service Requested: {service}
        Target Language: {language}
        Message: {message}
        """

        try:
            msg = Message(subject, sender=app.config['MAIL_DEFAULT_SENDER'], recipients=[app.config['MAIL_DEFAULT_SENDER']])
            msg.body = body

            # Attach the file if provided
            if document and document.filename:
                filename = secure_filename(document.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                document.save(file_path)
                with open(file_path, "rb") as file:
                    msg.attach(filename, "application/octet-stream", file.read())

            mail.send(msg)
            flash("Your quote request has been submitted successfully!", 'success')
        except Exception as e:
            flash("An error occurred while processing your request. Please try again.", 'danger')
            app.logger.error(f"Error processing quote request: {e}")

        return redirect(url_for('quote'))

    # Render the quote form for GET requests
    return render_template('quote.html', errors=errors)