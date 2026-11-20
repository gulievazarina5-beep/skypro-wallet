import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, addTransaction, deleteTransaction } from "../../api/index";
import "./Main.css";

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

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2.5 4H11.5M5.5 4V2.5C5.5 2.22386 5.72386 2 6 2H8C8.27614 2 8.5 2.22386 8.5 2.5V4M10.5 4V11.5C10.5 11.7761 10.2761 12 10 12H4C3.72386 12 3.5 11.7761 3.5 11.5V4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CATEGORIES_LIST = [
  {
    key: "food",
    label: "Еда",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7H12M3 7C3 4.5 5 3 7 3C9 3 11 4.5 11 7M3 9.5H11C11 10.5 10 11 9 11H5C4 11 3 10.5 3 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "transport",
    label: "Транспорт",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 8.5L3.5 4.5H10.5L11.5 8.5M2.5 8.5H11.5V10.5H10V9.5H4V10.5H2.5V8.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "housing",
    label: "Жилье",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 6.5L7 2.5L12 6.5M3.5 5.5V11.5H10.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "joy",
    label: "Развлечения",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.5 6H5.51M8.5 6H8.51M5.2 8.2C5.7 8.8 6.3 9 7 9C7.7 9 8.3 8.8 8.8 8.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "education",
    label: "Образование",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1.5 5.5L7 3L12.5 5.5L7 8L1.5 5.5ZM3.5 6.5V9.5C3.5 9.5 5 10.8 7 10.8C9 10.8 10.5 9.5 10.5 9.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "others",
    label: "Другое",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2.5" y="2.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 7H9M7 5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const CATEGORIES_MAP = {
  food: "Еда",
  transport: "Транспорт",
  housing: "Жилье",
  joy: "Развлечения",
  education: "Образование",
  others: "Другое",
};
const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "—";
  const dateObj = new Date(dateStr);
  if (!isNaN(dateObj.getTime())) {
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }
  return dateStr;
};

const formatDateForApi = (inputDate) => {
  if (!inputDate) {
    const now = new Date();
    return `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
  }
  if (inputDate.includes(".")) {
    const parts = inputDate.split(".");
    if (parts.length === 3) {
      return `${Number(parts[1])}-${Number(parts[0])}-${parts[2]}`;
    }
  }
  if (inputDate.includes("-")) {
    const parts = inputDate.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      return `${Number(parts[1])}-${Number(parts[2])}-${parts[0]}`;
    }
  }
  return inputDate;
};


export default function Main() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState("food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [sum, setSum] = useState("");
  const [error, setError] = useState(null);

  const fetchTransactionsList = async () => {
    try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : data.transactions || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTransactionsList();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleDelete = async (id) => {
    try {
      const updated = await deleteTransaction(id);
      if (Array.isArray(updated)) {
        setTransactions(updated);
      } else {
        setTransactions((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (description.trim().length < 4) {
      setError("Описание должно быть не менее 4 символов");
      return;
    }

    if (!date.trim()) {
      setError("Пожалуйста, введите дату");
      return;
    }

    const numericSum = Number(sum);
    if (!sum || numericSum <= 0) {
      setError("Пожалуйста, введите положительную сумму");
      return;
    }

    try {
      const updated = await addTransaction({
        description: description.trim(),
        sum: numericSum,
        category,
        date: formatDateForApi(date.trim()),
      });
      setDescription("");
      setDate("");
      setSum("");
      if (Array.isArray(updated)) {
        setTransactions(updated);
      } else {
        fetchTransactionsList();
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="main-page">
      <header className="main-header">
        <div className="header-inner">
          <div className="header-left">
            <h1 className="logo-title" onClick={() => navigate("/main")}>
              <LogoIcon /> Skypro.Wallet
            </h1>
          </div>

          <nav className="header-center">
            <span className="nav-link active" onClick={() => navigate("/main")}>
              Мои расходы
            </span>
            <span className="nav-link" onClick={() => navigate("/analytics")}>
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

      <div className="main-container">
        <h2 className="section-title">Мои расходы</h2>

        <div className="main-content">
          <section className="table-section">
            <div className="card-wrapper">
              <h3>Таблица расходов</h3>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Описание</th>
                    <th>Категория</th>
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        Расходов пока нет
                      </td>
                    </tr>
                  ) : (
                    transactions.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{item.description}</td>
                        <td>{CATEGORIES_MAP[item.category] || "Другое"}</td>
                        <td>{formatDateForDisplay(item.date)}</td>
                        <td className="amount-cell">{item.sum} ₽</td>
                        <td className="action-cell">
                          {item._id && (
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleDelete(item._id)}
                              title="Удалить"
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="form-section">
            <div className="card-wrapper form-card">
              <h3>Новый расход</h3>
              {error && <p className="error-message">{error}</p>}
              <form className="transaction-form" onSubmit={handleSubmit}>
                <div className="ui-input-group">
                  <label className="ui-label">Описание</label>
                  <input
                    className="ui-input"
                    type="text"
                    placeholder="Введите описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="ui-input-group">
                  <label className="ui-label">Категория</label>
                  <div className="categories-pills">
                    {CATEGORIES_LIST.map((cat) => (
                      <button
                        type="button"
                        key={cat.key}
                        className={`category-pill ${category === cat.key ? "active" : ""}`}
                        onClick={() => setCategory(cat.key)}
                      >
                        <span className="pill-icon">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ui-input-group">
                  <label className="ui-label">Дата</label>
                  <input
                    className="ui-input"
                    type="text"
                    placeholder="ДД.ММ.ГГГГ (например, 03.07.2026)"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="ui-input-group">
                  <label className="ui-label">Сумма</label>
                  <input
                    className="ui-input"
                    type="number"
                    placeholder="Введите сумму"
                    value={sum}
                    onChange={(e) => setSum(e.target.value)}
                  />
                </div>

                <button type="submit" className="ui-btn primary">
                  Добавить новый расход
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
