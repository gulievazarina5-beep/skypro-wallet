import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, addTransaction } from "../../api/index";
import "./Main.css";

const CATEGORIES_MAP = {
  food: "Еда",
  transport: "Транспорт",
  housing: "Жилье",
  joy: "Развлечения",
  education: "Образование",
  others: "Другое"
};

function Input({ label, id, ...props }) {
  return (
    <div className="ui-input-group">
      {label && <label htmlFor={id} className="ui-label">{label}</label>}
      <input id={id} className="ui-input" {...props} />
    </div>
  );
}

function Select({ label, id, children, ...props }) {
  return (
    <div className="ui-input-group">
      {label && <label htmlFor={id} className="ui-label">{label}</label>}
      <select id={id} className="ui-select" {...props}>
        {children}
      </select>
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

export default function Main() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("others");
  const [description, setDescription] = useState("");
  const [sum, setSum] = useState("");
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalBalance = transactions.reduce((acc, curr) => {
    const value = Number(curr.sum) || 0;
    return acc + value;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (description.length < 4) {
      setError("Описание должно быть не менее 4 символов");
      return;
    }

    const numericSum = Number(sum);
    if (!sum || numericSum <= 0) {
      setError("Пожалуйста, введите положительную сумму");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;

    try {
      const updatedList = await addTransaction({
        description,
        sum: numericSum,
        category,
        date: formattedDate,
      });
      setTransactions(Array.isArray(updatedList) ? updatedList : [updatedList, ...transactions]);
      setDescription("");
      setSum("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-left">
          <h1 className="logo-title" onClick={() => navigate("/main")}>Skypro.Wallet</h1>
        </div>
        <div className="header-right">
          <span className="nav-link" onClick={() => navigate("/main")}>Мои расходы</span>
          <span className="nav-link" onClick={() => navigate("/analytics")}>Анализ расходов</span>
          <span className="nav-link logout" onClick={() => navigate("/auth")}>Выйти</span>
        </div>
      </header>

      <div className="main-content">
        <section className="table-section">
          <h2 className="section-title">Мои расходы</h2>
          <div className="card-wrapper">
            <h3>Таблица расходов</h3>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Описание</th>
                  <th>Категория</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{item.description}</td>
                    <td>{CATEGORIES_MAP[item.category] || "Другое"}</td>
                    <td>{item.date || "—"}</td>
                    <td className="amount-cell">
                      {item.sum} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="form-section">
          <div className="card-wrapper form-card">
            <h3>Новый расход</h3>
            {error && <p className="error-message">{error}</p>}
            <form className="transaction-form" onSubmit={handleSubmit}>
              <Input 
                label="Описание" 
                type="text" 
                placeholder="Например, продукты" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Select 
                label="Категория" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.entries(CATEGORIES_MAP).map(([key, val]) => (
                  <option key={key} value={key}>{val}</option>
                ))}
              </Select>
              <Input 
                label="Дата" 
                type="text" 
                placeholder="ММ-ДД-ГГГГ" 
                disabled 
                value={new Date().toLocaleDateString()}
              />
              <Input 
                label="Сумма" 
                type="number" 
                placeholder="0" 
                value={sum}
                onChange={(e) => setSum(e.target.value)}
              />
              <Button type="submit" variant="primary">
                Добавить новый расход
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
