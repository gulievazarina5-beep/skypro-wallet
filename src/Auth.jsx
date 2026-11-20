import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./api/index";
import "./pages/Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!login.trim() || !password.trim() || (!isLogin && !name.trim())) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать не менее 6 символов");
      return;
    }

    try {
      if (isLogin) {
        const data = await loginUser(login.trim(), password);
        const token = data.user?.token || data.token || data.access_token;
        
        if (token) {
          localStorage.setItem("token", token);
          navigate("/main");
        } else {
          setError("Не удалось получить токен авторизации");
        }
      } else {
        await registerUser(login.trim(), password, name.trim());
        setIsLogin(true);
        setSuccessMessage("Регистрация успешна! Теперь вы можете войти");
        setLogin("");
        setPassword("");
        setName("");
      }
    } catch (err) {
      setError(err.message || "Ошибка запроса");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccessMessage(null);
    setLogin("");
    setPassword("");
    setName("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "Войти в Skypro.Wallet" : "Регистрация"}
        </h2>

        {error && <p className="error-message">{error}</p>}
        {successMessage && (
          <p className="error-message" style={{ color: "green" }}>
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="ui-input-group">
              <input
                type="text"
                className="ui-input"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="ui-input-group">
            <input
              type="text"
              className="ui-input"
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="ui-input-group">
            <input
              type="password"
              className="ui-input"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="ui-btn primary">
            {isLogin ? "Войти" : "Создать аккаунт"}
          </button>
        </form>

        <p onClick={toggleMode} className="auth-toggle-link">
          {isLogin
            ? "Еще нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </p>
      </div>
    </div>
  );
}
