import { useState } from 'react';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Войти в SkyproWallet' : 'Регистрация'}</h2>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="form-group">
              <label>Имя пользователя</label>
              <input type="text" placeholder="Введите имя" required />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="example@mail.com" required />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'} {' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </span>
        </p>
      </div>
    </div>
  );
}
