import axios from 'axios';

const PART1 = 'https://web';
const PART2 = 'dev-hw-api.sky.pro/api/user';
const BASE_URL = PART1 + PART2;

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Ошибка при регистрации';
    throw new Error(errorMessage);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Неверный логин или пароль';
    throw new Error(errorMessage);
  }
};
