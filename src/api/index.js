const URL_AUTH = 'https://wedev-api.sky.pro/api/user';
const URL_TRANSACTIONS = 'https://wedev-api.sky.pro/api/transactions';

export const registerUser = async (login, password, name) => {
  const response = await fetch(URL_AUTH, {
    method: 'POST',
    body: JSON.stringify({ login, password, name }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Ошибка регистрации');
  }
  return data;
};

export const loginUser = async (login, password) => {
  const response = await fetch(URL_AUTH + '/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Ошибка входа');
  }
  return data;
};

export const getTransactions = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(URL_TRANSACTIONS, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Ошибка получения транзакций');
  }
  return data;
};

export const getTransactionsByPeriod = async (start, end) => {
  const token = localStorage.getItem('token');
  const response = await fetch(URL_TRANSACTIONS + '/period', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ start, end }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Ошибка получения транзакций за период');
  }
  return data;
};

export const addTransaction = async (transactionData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(URL_TRANSACTIONS, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(transactionData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Ошибка добавления транзакции');
  }
  return data;
};

export const deleteTransaction = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(URL_TRANSACTIONS + '/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Ошибка удаления транзакции');
  }
  return data;
};