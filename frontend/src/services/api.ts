import axios from 'axios';

// USE YOUR EXACT CODESPACES URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout for Codespaces
});

// Add request interceptor
API.interceptors.request.use(
  (config) => {
    console.log(`API Request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Full Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    
    // More specific error handling
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Is backend running?');
    } else if (error.message.includes('Network Error')) {
      console.error('Network error. Check CORS and connection.');
    }
    
    return Promise.reject(error);
  }
);

export default API;

// Class API
export const getClasses = () => API.get('/classes/');
export const createClass = (data: any) => API.post('/classes/', data);

// Task API
export const getClassTasks = (classId: number) => 
  API.get(`/tasks/class/${classId}`);

// Student API  
export const getClassStudents = (classId: number) =>
  API.get(`/students/class/${classId}`);
export const createStudent = (data: any) => API.post('/students/', data);

// Mentor API
export const createMentor = (data: any) => API.post('/mentors/', data);
export const mentorLogin = (email: string) => 
  API.post('/mentors/login', null, { params: { email } });
