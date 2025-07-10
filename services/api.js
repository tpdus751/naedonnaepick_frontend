// services/api.js
import axios from 'axios';
import { API_BASE_URL } from './config'; // ✅ 주소 import

const instance = axios.create({
  baseURL: API_BASE_URL
});

export default instance;