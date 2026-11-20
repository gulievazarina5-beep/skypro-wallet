import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, getTransactionsByPeriod } from "../../api/index";
import "./Analytics.css";

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#000000" />
    <path
      d="M7 9.5C7 8.67157 7.67157 8 8.5 8H15.5C16.3284 8 17 8.67157 17 9.5V14.5C17 15.3284 16.3284 16 15.5 16H8.5C7.67157 16 7 15.3284 7 14.5V9.5Z"
      stroke="white"
      strokeWidth="1.5"
    />
    <circle cx="14.5" cy="12" r="1" fill="white" />
  </svg>
);

const CATEGORIES_MAP = {
  food: { label: "Еда", color: "#D9B6FF" },
  transport: { label: "Транспорт", color: "#FFB53D" },
  housing: { label: "Жилье", color: "#6EE4FE" },
  joy: { label: "Развлечения", color: "#B0AEFF" },
  education: { label: "Образование", color: "#BCEC30" },
  others: { label: "Другое", color: "#FFB9B8" },
};

const MONTHS_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const DAYS_OF_WEEK = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

const formatDateForApi = (dateObj) => {
  return `${dateObj.getMonth() + 1}-${dateObj.getDate()}-${dateObj.getFullYear()}`;
};

const formatDateForDisplay = (dateObj) => {
  if (!dateObj) return "";
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const generateMonthsList = () => {
  const result = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return result;
};
export default function Analytics() {
  const navigate = useNavigate();
  const [monthsList] = useState(generateMonthsList);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const loadAllTransactions = async () => {
    try {
      setError(null);
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : data.transactions || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAllTransactions();
  }, []);

  const handleDayClick = async (year, month, day) => {
    const clickedDate = new Date(year, month, day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      try {
        setError(null);
        const formatted = formatDateForApi(clickedDate);
        const data = await getTransactionsByPeriod(formatted, formatted);
        setTransactions(Array.isArray(data) ? data : data.transactions || []);
      } catch (err) {
        setError(err.message);
      }
    } else {
      let start = startDate;
      let end = clickedDate;
      if (clickedDate < startDate) {
        start = clickedDate;
        end = startDate;
      }
      setStartDate(start);
      setEndDate(end);

      try {
        setError(null);
        const data = await getTransactionsByPeriod(
          formatDateForApi(start),
          formatDateForApi(end)
        );
        setTransactions(Array.isArray(data) ? data : data.transactions || []);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleResetPeriod = () => {
    setStartDate(null);
    setEndDate(null);
    loadAllTransactions();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isInRange = (year, month, day) => {
    if (!startDate || !endDate) return false;
    const current = new Date(year, month, day);
    return current > startDate && current < endDate;
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
    const heightPercentage =
      maxCategoryAmount > 0 ? Math.round((amount / maxCategoryAmount) * 100) : 0;
    return {
      category: CATEGORIES_MAP[key].label,
      amount,
      color: CATEGORIES_MAP[key].color,
      height: amount > 0 ? `${Math.max(heightPercentage, 6)}%` : "4px",
    };
  });

  const periodSubtitle = startDate
    ? endDate
      ? `Расходы за ${formatDateForDisplay(startDate)} — ${formatDateForDisplay(endDate)}`
      : `Расходы за ${formatDateForDisplay(startDate)}`
    : "Расходы за весь период";
  return (
    <div className="analytics-page">
      <header className="main-header">
        <div className="header-inner">
          <div className="header-left">
            <h1 className="logo-title" onClick={() => navigate("/main")}>
              <LogoIcon /> Skypro.Wallet
            </h1>
          </div>

          <nav className="header-center">
            <span className="nav-link" onClick={() => navigate("/main")}>
              Мои расходы
            </span>
            <span className="nav-link active" onClick={() => navigate("/analytics")}>
              Анализ расходов
            </span>
          </nav>

          <div className="header-right">
            <span className="nav-link logout" onClick={handleLogout}>
              Выйти
            </span>
          </div>
        </div>
      </header>

      <main className="analytics-container">
        <h2 className="page-title">Анализ расходов</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="analytics-grid">
          <section className="filter-card">
            <div className="filter-card-header">
              <h3>Период</h3>
              {startDate && (
                <button type="button" className="reset-period-btn" onClick={handleResetPeriod}>
                  Сбросить
                </button>
              )}
            </div>

            <div className="calendar-weekdays-sticky">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="calendar-day-head">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-scroll-area">
              {monthsList.map(({ year, month }) => {
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const firstDayIndex = new Date(year, month, 1).getDay();
                const emptyCellsCount = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
                const emptyCells = Array.from({ length: emptyCellsCount }, (_, i) => i);
                const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                return (
                  <div key={`${year}-${month}`} className="calendar-month-block">
                    <div className="calendar-month-title">
                      {MONTHS_NAMES[month]} {year}
                    </div>
                    <div className="calendar-grid">
                      {emptyCells.map((i) => (
                        <div key={`empty-${i}`} className="calendar-empty" />
                      ))}
                      {monthDays.map((day) => {
                        const cellDate = new Date(year, month, day);
                        const selected =
                          isSameDay(cellDate, startDate) || isSameDay(cellDate, endDate);
                        const inRange = isInRange(year, month, day);

                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => handleDayClick(year, month, day)}
                            className={`calendar-day ${selected ? "selected" : ""} ${
                              inRange ? "in-range" : ""
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>{totalAmount.toLocaleString("ru-RU")} ₽</h3>
              <p className="chart-subtitle">{periodSubtitle}</p>
            </div>

            <div className="chart-wrapper">
              <div className="bars-container">
                {chartData.map((item, index) => (
                  <div className="chart-column" key={index}>
                    <div className="bar-wrapper">
                      <span className="bar-tooltip">{item.amount.toLocaleString("ru-RU")} ₽</span>
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
