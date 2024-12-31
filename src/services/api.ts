// @ts-ignore
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = 'https://backendbooktrack-production.up.railway.app/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getAuthToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data as { token: string };
  } catch (error) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const register = async (username: string, password: string, email: string) => {
  try {
    const response = await api.post('/auth/register', { username, password, email });
    return response.data as { token: string };
  } catch (error) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    // @ts-ignore
    return (response.data as { data: any }).data;
  } catch (error) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const fetchBooks = async (params?: { genre?: string; author?: string; limit?: number; page?: number }) => {
  try {
    const response = await api.get('/books', { params });
    return (response.data as { data: { _id: string; title: string; author: string; genre: string; description: string; userId: string; createdAt: string; updatedAt: string; totalPages: number }[] }).data.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      userId: book.userId,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      totalPages: book.totalPages
    }));
  } catch (error) {
    const apiError = error as any;
    console.error('Error fetching books:', apiError.response?.data);
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const fetchBook = async (id: string) => {
  try {
    const response = await api.get(`/books/${id}`);
    return (response.data as { data: any }).data;
  } catch (error) {
    const apiError = error as any;
    console.error(`Error fetching book with id ${id}:`, apiError.response?.data);
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const createBook = async (book: { title: string; author: string; genre: string; description: string; totalPages: number }) => {
  try {
    const response = await api.post('/books', book);
    return (response.data as { data: { _id: string; title: string; author: string; genre: string; userId: string; createdAt: string; updatedAt: string; totalPages: number } }).data;
  } catch (error) {
    const apiError = error as any;
    console.error('Error creating book:', apiError.response?.data);
    console.error('Request data:', book);
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const updateBook = async (id: string, book: { title: string; author: string; genre: string; description: string; totalPages: number }) => {
  try {
    const response = await api.put(`/books/${id}`, {
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      totalPages: book.totalPages
    });
    return (response.data as { data: { _id: string; title: string; author: string; genre: string; userId: string; createdAt: string; updatedAt: string; totalPages: number } }).data;
  } catch (error) {
    const apiError = error as any;
    console.error(`Error updating book with id ${id}:`, apiError.response?.data);
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const deleteBook = async (id: string) => {
  try {
    await api.delete(`/books/${id}`);
  } catch (error) {
    const apiError = error as any;
    console.error(`Error deleting book with id ${id}:`, apiError.response?.data);
    throw apiError.response?.data || { message: 'Network error' };
  }
};


export const editProfile = async (id: string, profileData: { username: string; email: string }) => {
  try {
    const response = await api.put(`/profile`, {
      username: profileData.username,
      email: profileData.email
    });

    return response.data; // Return the updated profile data
  } catch (error) {
    const apiError = error as any;
    console.error(`Error updating profile:`, apiError);
    throw apiError;
  }
};
