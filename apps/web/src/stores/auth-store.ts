import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { api } from '../http/api/axios'
import { SignUpFormData } from '../schemas/auth'

type User = {
  id: number
  name: string
  email: string
  avatar_url: string
}

type AuthState = {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthActions = {
  login: (email: string, password: string) => Promise<void>
  signUp: (data: SignUpFormData) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })

        try {
          const {
            data: { accessToken },
          } = await api.post<{ accessToken: string }>('/sessions/password', {
            email,
            password,
          })

          set({
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          })

          await get().checkAuth()
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Erro ao fazer login'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            accessToken: null,
            user: null,
          })
          throw error
        }
      },

      signUp: async ({ name, email, password }: SignUpFormData) => {
        set({ isLoading: true, error: null })

        try {
          await api.post('/sign-up', {
            name,
            email,
            password,
          })

          set({
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Erro ao criar usuário'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            accessToken: null,
            user: null,
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })

        try {
          await api.post('/sessions/logout')
        } catch (error) {
          console.error('Erro durante logout:', error)
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      checkAuth: async () => {
        const { accessToken } = get()
        if (!accessToken) return

        set({ isLoading: true })

        try {
          const { data } = await api.get<{ user: User }>('/profile')
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          if (error.response?.status === 401) {
            try {
              await get().refreshToken()
              await get().checkAuth()
            } catch {
              await get().logout()
            }
          } else {
            set({ error: 'Erro ao verificar autenticação', isLoading: false })
          }
        }
      },

      refreshToken: async () => {
        const { accessToken } = get()
        if (!accessToken) return

        try {
          const { data } = await api.post<{ token: string }>(
            '/sessions/refresh',
          )

          set({
            accessToken: data.token,
            isAuthenticated: true,
          })
        } catch (error) {
          await get().logout()
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
