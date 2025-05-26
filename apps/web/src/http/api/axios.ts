import { env } from '@printerp/env'
import axios from 'axios'

import { useAuthStore } from '../../stores/auth-store'

export const api = axios.create({
  baseURL: env.VITE_URL_BASE_API,
  withCredentials: true,
})

// Configuração global do Axios para interceptar requisições
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await useAuthStore.getState().refreshToken()
        return api(originalRequest)
      } catch (refreshError) {
        await useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
