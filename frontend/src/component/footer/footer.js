import React from "react";
import "./footer.css";
import Typewriter from "typewriter-effect";

const footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-1">
          <h3>About</h3>
          <p>Contact Us</p>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>SignIn</p>
          <p>SignUp</p>
          <p>Help</p>
          <p>FAQ</p>
        </div>

        <div className="footer-1 footer-2">
          <h3>Buy</h3>
          <p>Home & Garden </p>
          <p>Clothing & Accessories </p>
          <p>Entertainment </p>
        </div>

        <div className="footer-1 footer-2">
          <h3>Community</h3>
          <p>Answer Center</p>
          <p>Groups </p>
          <p>News </p>
        </div>
        <div className="footer-1 footer-2">
          <h3>Account</h3>
        </div>
      </div>
      <div>
      <div className="typewriter-container">
          <Typewriter
            options={{
              strings: [
                "....100% Money Guarantee",
                "....100% Authentic Products",
                "......Quality Products",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>

        <p>copyright 2025 </p>
      </div>
    </footer>
  );
};

export default footer;
