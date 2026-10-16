import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <header className="main-header">
        <h1 onClick={() => navigate("/main")} style={{ cursor: "pointer" }}>SkyproWallet</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button 
            onClick={() => navigate("/analytics")}
            style={{
              padding: "10px 16px",
              background: "#565ee7",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Аналитика
          </button>
          <div className="balance-card">
            <span>Баланс</span>
            <strong>0 ₽</strong>
          </div>
        </div>
      </header>

      <div className="main-content">
        <section className="form-section">
          <h3>Добавить операцию</h3>
          <form className="transaction-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>Тип операции</label>
              <select>
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>
            <div className="input-group">
              <label>Категория</label>
              <input type="text" placeholder="Например, Продукты" />
            </div>
            <div className="input-group">
              <label>Сумма</label>
              <input type="number" placeholder="0" />
            </div>
            <button type="submit" className="add-btn">
              Добавить
            </button>
          </form>
        </section>

        <section className="table-section">
          <h3>История операций</h3>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Категория</th>
                <th>Тип</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Зарплата</td>
                <td className="amount-income">Доход</td>
                <td className="amount-income">+50 000 ₽</td>
              </tr>
              <tr>
                <td>Супермаркет</td>
                <td className="amount-expense">Расход</td>
                <td className="amount-expense">-3 200 ₽</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
