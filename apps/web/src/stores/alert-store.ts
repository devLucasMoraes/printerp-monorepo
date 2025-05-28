import { AlertColor } from '@mui/material'
import { create } from 'zustand'

interface AlertOptions {
  variant?: AlertColor
  autoHideDuration?: number
}

interface AlertItem {
  id: string
  message: string
  variant: AlertColor
  autoHideDuration: number
}

interface AlertState {
  alerts: AlertItem[]
  enqueueSnackbar: (message: string, options?: AlertOptions) => string
  closeSnackbar: (id: string) => void
  clearAll: () => void
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],

  enqueueSnackbar: (message: string, options: AlertOptions = {}) => {
    const id = Math.random().toString(36).substr(2, 9)
    const { variant = 'info', autoHideDuration = 6000 } = options

    const newAlert: AlertItem = {
      id,
      message,
      variant,
      autoHideDuration,
    }

    set((state) => ({
      alerts: [...state.alerts, newAlert],
    }))

    // Auto close after specified duration
    if (autoHideDuration > 0) {
      setTimeout(() => {
        get().closeSnackbar(id)
      }, autoHideDuration)
    }

    return id
  },

  closeSnackbar: (id: string) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    }))
  },

  clearAll: () => {
    set({ alerts: [] })
  },
}))
