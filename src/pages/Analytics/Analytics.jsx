import React from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

export default function Analytics() {
  const navigate = useNavigate();

  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const mockDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Аналитика расходов</h1>
        <button className="back-btn" onClick={() => navigate("/main")}>
          Назад на главную
        </button>
      </header>

      <div className="analytics-content">
        <section className="calendar-section">
          <h3>Календарь</h3>
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
        </section>

        <section className="chart-section">
          <h3>Статистика по категориям</h3>
          <div className="mock-chart-container">
            <div className="chart-row">
              <div className="chart-label">
                <span>Продукты</span>
                <strong>12 500 ₽</strong>
              </div>
              <div className="chart-bar-bg">
                <div className="chart-bar-fill" style={{ width: "65%", backgroundColor: "#c62828" }}></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-label">
                <span>Кафе и рестораны</span>
                <strong>4 200 ₽</strong>
              </div>
              <div className="chart-bar-bg">
                <div className="chart-bar-fill" style={{ width: "25%", backgroundColor: "#ff8f00" }}></div>
              </div>
            </div>

            <div className="chart-row">
              <div className="chart-label">
                <span>Транспорт</span>
                <strong>1 800 ₽</strong>
              </div>
              <div className="chart-bar-bg">
                <div className="chart-bar-fill" style={{ width: "10%", backgroundColor: "#0d47a1" }}></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
