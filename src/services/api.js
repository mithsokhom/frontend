import axios from 'axios';

const api = axios.create({
  baseURL: 'https://first-hosting-website.herokuapp.com'
})

export default api;