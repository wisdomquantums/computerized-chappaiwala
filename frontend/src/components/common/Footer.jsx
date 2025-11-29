import { Link } from "react-router-dom";
import "./Footer.css";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Contact", to: "/contact" },
  { label: "Order Online", to: "/order" },
];

const serviceLinks = [
  "Visiting Card Printing",
  "Wedding Card Printing",
  "Bill Books",
  "Flex and Banner Printing",
  "Calendar Printing",
  "Pamphlet / Flyer Printing",
];

const policyLinks = [
  { label: "Terms and Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Refund Policy", to: "/refund" },
  { label: "Shipping Policy", to: "/shipping" },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo-wrapper">
              <img
                src="/logo.png"
                alt="Computerized Chhappaiwala"
                className="footer-logo"
              />
            </div>
            <p className="footer-address">
              Hospital Road, Sitamarhi, Bihar 843302
            </p>
            <p className="footer-timing">Mon – Sun · 9:00 AM – 9:00 PM</p>

            {/* Social Icons */}
            <div className="footer-socials">
              <a
                href="https://instagram.com/computerizedchhappaiwala"
                target="_blank"
                rel="noreferrer"
                className="footer-icon instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>

              <a
                href="https://linkedin.com/company/computerized-chhappaiwala"
                target="_blank"
                rel="noreferrer"
                className="footer-icon linkedin"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>

              <a
                href="https://wa.me/917004400011"
                target="_blank"
                rel="noreferrer"
                className="footer-icon whatsapp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              {quickLinks.map((link) => (
                <li key={link.label} className="footer-list-item">
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-list">
              {serviceLinks.map((service) => (
                <li key={service} className="footer-list-item">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Policies */}
          <div className="footer-section footer-contact-policy">
            <div className="footer-contact">
              <h4 className="footer-heading">Contact</h4>

              <p className="footer-text">
                Phone:
                <a href="tel:+917488986015" className="footer-link-strong">
                  +91 7488986015
                </a>
              </p>

              <p className="footer-text">
                WhatsApp:
                <a
                  href="https://wa.me/916203504230"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link-strong"
                >
                  +91 6203504230
                </a>
              </p>

              <p className="footer-text footer-email">
                Email:
                <a
                  href="mailto:mukulbabagraphics@gmail.com"
                  className="footer-link-strong"
                >
                  mukulbabagraphics@gmail.com
                </a>
              </p>
            </div>

            <div className="footer-policies">
              <h4 className="footer-heading">Policies</h4>
              <ul className="footer-list">
                {policyLinks.map((link) => (
                  <li key={link.label} className="footer-list-item">
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Wave */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 130" preserveAspectRatio="none">
          <path
            d="M0,80 C360,130 720,0 1440,60 L1440,130 L0,130 Z"
            fill="#020617"
          />
        </svg>
      </div>

      {/* Divider */}
      <div className="footer-divider-space"></div>
      <div className="footer-divider"></div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} Computerized Chhappaiwala. All rights
            reserved.
          </p>
          <p className="footer-credit">
            Website Designed By
            <a
              href="https://www.wisdomquantums.com"
              target="_blank"
              rel="noreferrer"
              className="footer-credit-link"
            >
              WisdomQuantums Solution
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
