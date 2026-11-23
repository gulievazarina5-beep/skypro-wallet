import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, addTransaction, deleteTransaction } from "../../api/index";
import { CATEGORIES, CATEGORIES_LIST } from "../../constants/categories";
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
    const [day, month, year] = inputDate.split(".");
    if (day && month && year) {
      return `${Number(month)}-${Number(day)}-${year}`;
    }
  }
  if (inputDate.includes("-")) {
    const [year, month, day] = inputDate.split("-");
    if (year && month && day && year.length === 4) {
      return `${Number(month)}-${Number(day)}-${year}`;
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
  const [isLoading, setIsLoading] = useState(false);

  const applyTransactionsData = (data) => {
    if (Array.isArray(data)) {
      setTransactions(data);
    } else if (data?.transactions) {
      setTransactions(data.transactions);
    }
  };

  const fetchTransactionsList = async () => {
    try {
      const data = await getTransactions();
      applyTransactionsData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTransactionsList();
  }, []);

    const handleLogout = () => {
    if (!window.confirm("Вы уверены, что хотите выйти из аккаунта?")) return;
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот расход?")) return;
    setError(null);
    try {
      const updated = await deleteTransaction(id);
      if (Array.isArray(updated) || updated?.transactions) {
        applyTransactionsData(updated);
      } else {
        setTransactions((prev) => prev.filter((item) => (item._id || item.id) !== id));
      }
    } catch (err) {
      setError(err.message || "Ошибка при удалении расхода");
    }
  };


    const validateForm = () => {
    if (description.trim().length < 4) {
      return "Описание должно быть не менее 4 символов";
    }
    if (!date.trim()) {
      return "Пожалуйста, введите дату";
    }
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(date.trim())) {
      return "Введите дату в формате ДД.ММ.ГГГГ";
    }
    if (!sum || Number(sum) <= 0) {
      return "Пожалуйста, введите положительную сумму";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const updated = await addTransaction({
        description: description.trim(),
        sum: Number(sum),
        category,
        date: formatDateForApi(date.trim()),
      });
      setDescription("");
      setDate("");
      setSum("");
      if (Array.isArray(updated) || updated?.transactions) {
        applyTransactionsData(updated);
      } else {
        await fetchTransactionsList();
      }
    } catch (err) {
      setError(err.message || "Ошибка при добавлении расхода");
    } finally {
      setIsLoading(false);
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
              <div className="table-responsive">
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
                      transactions.map((item, index) => {
                        const transactionId = item._id || item.id;
                        return (
                          <tr key={transactionId || index}>
                            <td>{item.description}</td>
                            <td>{CATEGORIES[item.category]?.label || "Другое"}</td>
                            <td>{formatDateForDisplay(item.date)}</td>
                            <td className="amount-cell">{item.sum} ₽</td>
                            <td className="action-cell">
                              {transactionId && (
                                <button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() => handleDelete(transactionId)}
                                  title="Удалить"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
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
                    disabled={isLoading}
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
                        disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>

                <button type="submit" className="ui-btn primary" disabled={isLoading}>
                  {isLoading ? "Добавление..." : "Добавить новый расход"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
