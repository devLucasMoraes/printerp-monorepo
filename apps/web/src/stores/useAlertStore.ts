import { AlertColor } from '@mui/material'
import { create } from 'zustand'

interface AlertState {
  open: boolean
  message: string
  severity: AlertColor
  showAlert: {
    (message: string, severity?: AlertColor): void
    success: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
    error: (message: string) => void
  }
  closeAlert: () => void
}

export const useAlertStore = create<AlertState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  showAlert: Object.assign(
    (message: string, severity: AlertColor = 'info') => {
      set({ open: true, message, severity })
    },
    {
      success: (message: string) =>
        set({ open: true, message, severity: 'success' }),
      info: (message: string) => set({ open: true, message, severity: 'info' }),
      warning: (message: string) =>
        set({ open: true, message, severity: 'warning' }),
      error: (message: string) =>
        set({ open: true, message, severity: 'error' }),
    },
  ),
  closeAlert: () => set({ open: false }),
}))
