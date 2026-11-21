import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <header className="header">
      <div className="header__logo" onClick={() => navigate("/main")}>
        SkyproWallet
      </div>

      <nav className="header__nav">
        <span
          onClick={() => navigate("/main")}
          className={`header__link ${
            location.pathname === "/main" ? "header__link--active" : ""
          }`}
        >
          Главная
        </span>
        <span
          onClick={() => navigate("/analytics")}
          className={`header__link ${
            location.pathname === "/analytics" ? "header__link--active" : ""
          }`}
        >
          Аналитика
        </span>
      </nav>

      <button className="header__logout-btn" onClick={handleLogout}>
        Выйти
      </button>
    </header>
  );
}
