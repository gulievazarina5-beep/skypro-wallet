import axios from 'axios';

const URL_AUTH = 'https://webdev-hw-api.sky.pro/api/user';
const URL_TRANSACTIONS = 'https://webdev-hw-api.sky.pro/api/transactions';

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${URL_AUTH}/signup`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при регистрации');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${URL_AUTH}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Неверный логин или пароль');
  }
};

export const getTransactions = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(URL_TRANSACTIONS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при получении транзакций');
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(URL_TRANSACTIONS, transactionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при добавлении транзакции');
  }
};
