import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../../api/index";
import "./Analytics.css";

const CATEGORIES_MAP = {
  food: { label: "Еда", color: "#6332FA" },
  transport: { label: "Транспорт", color: "#FF9F43" },
  housing: { label: "Жилье", color: "#1DD1A1" },
  joy: { label: "Развлечения", color: "#54A0FF" },
  education: { label: "Образование", color: "#10AC84" },
  others: { label: "Другое", color: "#FF6B6B" }
};

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
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const mockDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const fetchAnalyticsData = async () => {
    try {
      setError(null);
      const data = await getTransactions();
      const list = Array.isArray(data) ? data : data.transactions || [];
      
      const filtered = list.filter((t) => {
        if (!t.date) return true;
        const tDate = new Date(t.date).getTime();
        if (dateFrom && tDate < new Date(dateFrom).getTime()) return false;
        if (dateTo && tDate > new Date(dateTo).getTime()) return false;
        return true;
      });

      setTransactions(filtered);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAnalyticsData();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const totalsByCategory = transactions.reduce((acc, curr) => {
    const cat = curr.category || "others";
    const sum = Number(curr.sum) || 0;
    acc[cat] = (acc[cat] || 0) + sum;
    return acc;
  }, {});

  const totalAmount = Object.values(totalsByCategory).reduce((a, b) => a + b, 0);

  const maxCategoryAmount = Math.max(...Object.values(totalsByCategory), 0);

  const chartData = Object.keys(CATEGORIES_MAP).map((key) => {
    const amount = totalsByCategory[key] || 0;
    const heightPercentage = maxCategoryAmount > 0 ? (amount / maxCategoryAmount) * 100 : 5;
    return {
      category: CATEGORIES_MAP[key].label,
      amount: amount,
      color: CATEGORIES_MAP[key].color,
      height: `${Math.max(heightPercentage, 5)}%`
    };
  });

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <div className="header-left">
          <h1 className="logo-title" onClick={() => navigate("/main")}>Skypro.Wallet</h1>
        </div>
        <div className="header-right">
          <span className="nav-link" onClick={() => navigate("/main")}>Мои расходы</span>
          <span className="nav-link active" onClick={() => navigate("/analytics")}>Анализ расходов</span>
          <span className="nav-link logout" onClick={handleLogout}>Выйти</span>
        </div>
      </header>

      <main className="analytics-content">
        <h2 className="page-title">Анализ расходов</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="analytics-grid">
          <section className="filter-card">
            <h3>Период</h3>
            <form className="filter-form" onSubmit={handleFilterSubmit}>
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
                {chartData.map((item, index) => (
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
