import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="main-content">
      <div className="page-banner">
        <div className="breadcrumb">
          <Link to="/welcome">Home</Link> / Contact & Hours
        </div>
        <h1 className="page-title">Contact & Reading Room Hours</h1>
      </div>

      <div className="auth-split-container">
        <div className="auth-text-panel">
          <div className="hero-eyebrow">Visit Us</div>
          <h2 className="auth-text-title">The Main Reading Room</h2>
          <p className="auth-text-desc">
            Our archives and physical stacks are open to registered researchers, students, and institutional visitors during the hours listed below.
          </p>
          <div style={{ marginTop: "1.5rem", fontSize: "0.95rem" }}>
            <p style={{ marginBottom: "0.5rem" }}><strong>Monday — Thursday:</strong> 09:00 AM – 07:00 PM</p>
            <p style={{ marginBottom: "0.5rem" }}><strong>Friday:</strong> 09:00 AM – 01:00 PM, 03:00 PM – 07:00 PM</p>
            <p style={{ marginBottom: "0.5rem" }}><strong>Saturday:</strong> 10:00 AM – 04:00 PM</p>
            <p><strong>Sunday:</strong> Closed</p>
          </div>
        </div>

        <div className="auth-panel">
          <h3 className="form-heading">Send an Inquiry</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <label>Your Name</label>
              <input type="text" className="input" placeholder="e.g. Al-Biruni" required />
            </div>
            <div className="field">
              <label>Email Address</label>
              <input type="email" className="input" placeholder="name@domain.com" required />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea className="input" rows="4" placeholder="Inquire about collections or system access..." required style={{ resize: "vertical" }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-full">Submit Inquiry</button>
          </form>
        </div>
      </div>
    </div>
  );
}