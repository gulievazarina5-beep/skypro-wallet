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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const resetForm = (clearMessages = true) => {
    setLogin("");
    setPassword("");
    setName("");
    if (clearMessages) {
      setError(null);
      setSuccessMessage(null);
    }
  };

  const validateForm = () => {
    if (!login.trim() || !password.trim() || (!isLogin && !name.trim())) {
      return "Пожалуйста, заполните все поля";
    }
    if (password.length < 6) {
      return "Пароль должен содержать не менее 6 символов";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const data = await loginUser(login.trim(), password);
        const token = data.user?.token || data.token || data.access_token;

        if (!token) {
          throw new Error("Не удалось получить токен авторизации");
        }

        localStorage.setItem("token", token);
        navigate("/main");
      } else {
        await registerUser(login.trim(), password, name.trim());
        setIsLogin(true);
        resetForm(false);
        setSuccessMessage("Регистрация успешна! Теперь вы можете войти");
      }
    } catch (err) {
      setError(err.message || "Ошибка запроса");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    resetForm(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "Войти в Skypro.Wallet" : "Регистрация"}
        </h2>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="ui-input-group">
              <input
                type="text"
                className="ui-input"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div className="ui-input-group">
            <input
              type="password"
              className="ui-input"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="ui-btn primary" disabled={isLoading}>
            {isLoading
              ? "Загрузка..."
              : isLogin
              ? "Войти"
              : "Создать аккаунт"}
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
