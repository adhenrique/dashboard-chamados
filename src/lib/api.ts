import axios from 'axios';

// Cria uma instância com as configurações padrão
export const api = axios.create({
    // O Vite carrega a variável de ambiente automaticamente aqui
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000, // 10 segundos para timeout (opcional)
});

// Opcional: Interceptors
// Útil se você precisar mandar Token JWT em todas as requisições futuramente
api.interceptors.request.use((config) => {
    // Exemplo: const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});