import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

function Input({ label, id, ...props }) {
  return (
    <div className="ui-input-group">
      {label && <label htmlFor={id} className="ui-label">{label}</label>}
      <input id={id} className="ui-input" {...props} />
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

export default function Analytics() {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const mockDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const mockData = [
    { category: "Супермаркет", amount: 3590, color: "#6332FA", height: "80%" },
    { category: "Транспорт", amount: 1020, color: "#FF9F43", height: "30%" },
    { category: "Жилье", amount: 0, color: "#1DD1A1", height: "5%" },
    { category: "Развлечения", amount: 1250, color: "#54A0FF", height: "35%" },
    { category: "Образование", amount: 600, color: "#10AC84", height: "18%" },
    { category: "Другое", amount: 2321, color: "#FF6B6B", height: "60%" },
  ];

  const totalAmount = mockData.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <div className="header-left">
          <h1 className="logo-title" onClick={() => navigate("/main")}>Skypro.Wallet</h1>
        </div>
        <div className="header-right">
          <span className="nav-link" onClick={() => navigate("/main")}>Мои расходы</span>
          <span className="nav-link active" onClick={() => navigate("/analytics")}>Анализ расходов</span>
          <span className="nav-link logout" onClick={() => navigate("/auth")}>Выйти</span>
        </div>
      </header>

      <main className="analytics-content">
        <h2 className="page-title">Анализ расходов</h2>

        <div className="analytics-grid">
          <section className="filter-card">
            <h3>Период</h3>
            <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
              <Input
                label="С"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <Input
                label="По"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
              <Button type="submit" variant="primary">
                Показать
              </Button>

              <div className="mock-calendar">
                {daysOfWeek.map((day) => (
                  <div key={day} className="calendar-day-head">{day}</div>
                ))}
                {mockDays.map((day) => (
                  <div key={day} className={`calendar-day ${day === 15 ? "active" : ""}`}>
                    {day}
                  </div>
                ))}
              </div>
            </form>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>{totalAmount.toLocaleString()} ₽</h3>
            </div>

            <div className="chart-wrapper">
              <div className="bars-container">
                {mockData.map((item, index) => (
                  <div className="chart-column" key={index}>
                    <div className="bar-wrapper">
                      <span className="bar-tooltip">{item.amount} ₽</span>
                      <div
                        className="chart-bar"
                        style={{
                          height: item.height,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="bar-label">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
