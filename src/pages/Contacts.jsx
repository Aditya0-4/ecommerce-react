function Contact() {
    return (
        <div className="contact-page">

            <div className="contact-container">

                <p className="contact-small-text">GET IN TOUCH</p>

                <h1>Contact Cosmo Roots</h1>

                <p className="contact-description">
                    Have a question, want to know more about our products,
                    or simply want to connect with us? We'd love to hear from you.
                </p>

                <div className="contact-cards">

                    {/* Email */}
                    <a
                        href="mailto:joshadit6@gmail.com"
                        className="contact-card"
                    >
                        <div className="contact-icon">✉</div>
                        <h3>Email</h3>
                        <p>joshadit6@gmail.com</p>
                    </a>

                    {/* Phone */}
                    <a
                        href="tel:+919634803804"
                        className="contact-card"
                    >
                        <div className="contact-icon">☎</div>
                        <h3>Phone</h3>
                        <p>+91 9634803804</p>
                    </a>

                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/maartulyaenterprises02/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-card"
                    >
                        <div className="contact-icon">◎</div>
                        <h3>Instagram</h3>
                        <p>@maartulyaenterprises02</p>
                    </a>

                </div>

            </div>

        </div>
    );
}

export default Contact;


