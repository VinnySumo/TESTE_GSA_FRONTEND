import axios from 'axios';

// Cria uma conexão padrão com o seu Backend
const api = axios.create({
    baseURL: 'http://localhost:3333',
});

export default api;