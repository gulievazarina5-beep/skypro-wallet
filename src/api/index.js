const URL_AUTH = 'https://wedev-api.sky.pro/api/user';
const URL_TRANSACTIONS = 'https://wedev-api.sky.pro/api/transactions';

const request = async (url, options = {}, defaultError = 'Ошибка запроса') => {
  const token = localStorage.getItem('token');
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || defaultError);
  }

  return data;
};

export const registerUser = (login, password, name) =>
  request(
    URL_AUTH,
    { method: 'POST', body: JSON.stringify({ login, password, name }) },
    'Ошибка регистрации'
  );

export const loginUser = (login, password) =>
  request(
    `${URL_AUTH}/login`,
    { method: 'POST', body: JSON.stringify({ login, password }) },
    'Ошибка входа'
  );

export const getTransactions = () =>
  request(URL_TRANSACTIONS, { method: 'GET' }, 'Ошибка получения транзакций');

export const getTransactionsByPeriod = (start, end) =>
  request(
    `${URL_TRANSACTIONS}/period`,
    { method: 'POST', body: JSON.stringify({ start, end }) },
    'Ошибка получения транзакций за период'
  );

export const addTransaction = (transactionData) =>
  request(
    URL_TRANSACTIONS,
    { method: 'POST', body: JSON.stringify(transactionData) },
    'Ошибка добавления транзакции'
  );

export const deleteTransaction = (id) =>
  request(
    `${URL_TRANSACTIONS}/${id}`,
    { method: 'DELETE' },
    'Ошибка удаления транзакции'
  );
