import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/main");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#181818",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "#2e2e2e",
          padding: "40px",
          borderRadius: "12px",
          width: "320px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginBottom: "24px" }}>
          {isLogin ? "Войти в SkyproWallet" : "Регистрация"}
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Имя пользователя"
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #4e4e4e",
                background: "#181818",
                color: "#fff",
              }}
            />
          )}
          <input
            type="email"
            placeholder="Электронная почта"
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #4e4e4e",
              background: "#181818",
              color: "#fff",
            }}
          />
          <input
            type="password"
            placeholder="Пароль"
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #4e4e4e",
              background: "#181818",
              color: "#fff",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "none",
              background: "#565ee7",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {isLogin ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{
            marginTop: "20px",
            fontSize: "14px",
            color: "#a5a5a5",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLogin
            ? "Еще нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </p>
      </div>
    </div>
  );
}
