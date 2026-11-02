import axios from 'axios';

const PART1 = 'https://web';
const PART2 = 'dev-hw-api.sky.pro/api/transactions';
const BASE_URL = PART1 + PART2;

export const getTransactions = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Ошибка при получении транзакций';
    throw new Error(errorMessage);
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(BASE_URL, transactionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Ошибка при добавлении транзакции';
    throw new Error(errorMessage);
  }
};
