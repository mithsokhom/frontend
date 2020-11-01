import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
  // baseURL: 'http://painting-api.herokuapp.com/'
})

export default api;