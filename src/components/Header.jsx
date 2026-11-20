import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "between",
        alignItems: "center",
        padding: "16px 40px",
        background: "#2e2e2e",
        borderBottom: "1px solid #4e4e4e",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        onClick={() => navigate("/main")}
        style={{ fontWeight: "bold", fontSize: "20px", cursor: "pointer" }}
      >
        SkyproWallet
      </div>
      <nav style={{ display: "flex", gap: "24px" }}>
        <span
          onClick={() => navigate("/main")}
          style={{ cursor: "pointer", color: "#a5a5a5" }}
        >
          Главная
        </span>
        <span
          onClick={() => navigate("/analytics")}
          style={{ cursor: "pointer", color: "#a5a5a5" }}
        >
          Анализы
        </span>
      </nav>
      <button
        onClick={() => navigate("/auth")}
        style={{
          padding: "8px 16px",
          background: "transparent",
          border: "1px solid #565ee7",
          borderRadius: "6px",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Выйти
      </button>
    </header>
  );
}
