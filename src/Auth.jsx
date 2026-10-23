import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./api/index";
import "./pages/Auth.css";

function Input({ id, className = "", ...props }) {
  return (
    <div className="ui-input-group">
      <input id={id} className={`ui-input ${className}`} {...props} />
    </div>
  );
}

function Button({ children, variant = "primary", ...props }) {
  return (
    <button className={`ui-btn ${variant}`} {...props}>
      {children}
    </button>
  );
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (!isLogin && !username)) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    try {
      if (isLogin) {
        const data = await loginUser(email, password);
        localStorage.setItem("token", data.access_token);
        navigate("/main");
      } else {
        await registerUser(email, password);
        setIsLogin(true);
        setError("Регистрация успешна! Теперь вы можете войти");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "Войти в Skypro.Wallet" : "Регистрация"}
        </h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <Input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <Input
            type="email"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary">
            {isLogin ? "Войти" : "Создать аккаунт"}
          </Button>
        </form>
        
        <p
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          className="auth-toggle-link"
        >
          {isLogin
            ? "Еще нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </p>
      </div>
    </div>
  );
}
