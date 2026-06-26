import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaLinkedin, FaInstagram, FaDiscord } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-toastify/dist/ReactToastify.css';
import '../css/style1.css';
import { useNavigate } from 'react-router-dom';
import signup from './signup.jsx';
import login from './login.jsx';

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
      sessionStorage.clear();
      navigate('/login'); 
  };

  const handleButtonClick = () => {
    console.log("Button clicked!"); 
    sessionStorage.clear();
    navigate('/signup');
  };

  return (
    <>
      <header>
        <div className="logo">
          <h1 
          className="logo-text" 
          style={{ cursor: "pointer" }} 
          onClick={() => navigate("/")}
        >
          ClickMart
        </h1>
        </div>
        <button className="signin-button" onClick={handleSignIn}>
          Or Sign In
        </button>
      </header>

      <div className="main-page">
        <div className="main-background-image">
          <div className="main-content">
            <h1>Welcome to ClickMart!</h1>
            <h5 className="start-text">Smart solutions, one click away.</h5>
            <button className="start-button" onClick={handleButtonClick}>
              Get Started
            </button>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <h1 className="logo-text"><span>Click</span>Mart</h1>
            <p className="site-description">
              At ClickMart, we provide the fastest and most reliable solutions for your needs.
              Whether it’s products or professional services, our platform ensures convenience and trust. 
            </p>
            <p className="site-description-2">Your success is just one click away!</p>
            <div className="contact">
              <span><FaPhone /> &nbsp; +90 539 782 6654 </span>
              <span><FaEnvelope /> &nbsp; support@clickmart.com</span>
            </div>
            <div className="socials">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaDiscord /></a>
            </div>
          </div>

          <div className="footer-section testimonials">
            <h2>Customer Feedback</h2>
            <br />
            <div className="testimonial">
              <p className="testimonial-text">"ClickMart made our business workflow so much easier. Quick and professional!" – Aylin K.</p>
            </div>
            <div className="testimonial">
              <p className="testimonial-text">"The service quality is top-notch. Everything I needed was just a click away." – Murat B.</p>
            </div>
            <div className="testimonial">
              <p className="testimonial-text">"Reliable, efficient, and affordable. Highly recommended!" – Selin Y.</p>
            </div>
          </div>

          <div className="footer-section contact-form">
            <h2>Contact Us</h2>
            <br />
            <form>
              <input 
                type="email" 
                name="email" 
                className="text-input contact-input" 
                placeholder="Your email address..." 
              />
              <textarea 
                rows="4" 
                name="message" 
                className="text-input contact-input" 
                placeholder="Your message...">
              </textarea>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2025 ClickMart | Designed by Bilge Acartürk
      </div>
    </>
  );
}
