import React from "react";
import Logo from "../img/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <img src={Logo} alt="" />
      <span className="footer-text">
        2TL team <b>🖤</b>.
      </span>
    </footer>
  );
};

export default Footer;