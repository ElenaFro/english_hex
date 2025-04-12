import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from 'src/boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = ref(!!localStorage.getItem('token'))

  async function register({ email, password, name }) {
    const response = await apiClient.post('/register', {
      email,
      password,
      name,
    })
    const { token: newToken, user: newUser } = response.data
    token.value = newToken
    user.value = newUser
    isAuthenticated.value = true
    localStorage.setItem('token', newToken)
    return response.data
  }

  async function login({ email, password }) {
    const response = await apiClient.post('/login', {
      email,
      password,
    })
    const { token: newToken, user: newUser } = response.data
    token.value = newToken
    user.value = newUser
    isAuthenticated.value = true
    localStorage.setItem('token', newToken)
    return response.data
  }

  async function logout() {
    try {
      await apiClient.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const response = await apiClient.get('/user')
      user.value = response.data
      isAuthenticated.value = true
    } catch (error) {
      console.error('Fetch user error:', error)
      logout()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    fetchUser,
  }
})
