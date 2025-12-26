// hooks/useAuth.ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role?: string
  createdAt?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>

  // Add a flag to track if hydration is complete
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },

      // ---------------- LOGIN ----------------
      login: async (email: string, password: string) => {
        set({ loading: true })

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!res.ok) {
            const error = await res.text()
            throw new Error(error || 'Login failed')
          }

          const data = await res.json()

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || email.split('@')[0],
            avatar:
              data.user.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                email
              )}`,
            role: data.user.role,
            createdAt: data.user.createdAt,
          }

          set({
            user,
            isAuthenticated: true,
            loading: false,
          })

          return data
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      // ---------------- LOGOUT ----------------
      logout: async () => {
        set({ loading: true })

        try {
          await fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          })
        }
      },

      // ---------------- REGISTER ----------------
      register: async (email: string, password: string, name: string) => {
        set({ loading: true })

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
          })

          if (!res.ok) {
            const error = await res.text()
            throw new Error(error || 'Registration failed')
          }

          const data = await res.json()

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || name,
            avatar:
              data.user.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                email
              )}`,
            role: data.user.role,
            createdAt: data.user.createdAt,
          }

          set({
            user,
            isAuthenticated: true,
            loading: false,
          })

          return data
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      // ---------------- UPDATE PROFILE ----------------
      updateProfile: async (data: Partial<User>) => {
        const current = get().user
        if (!current) return

        const updated = { ...current, ...data }

        set({ user: updated })
      },
    }),

    // ---------- PERSIST CONFIG ----------
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),

      // Partialize: only persist these fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),

      // Handle hydration
      onRehydrateStorage: () => (state, error) => {
        useAuth.setState({ _hasHydrated: true, loading: false })
      },
    }
  )
)
