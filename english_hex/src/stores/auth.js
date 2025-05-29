import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const token = ref(localStorage.getItem("access_token") || null);
  const isAuthenticated = ref(!!localStorage.getItem("access_token"));

  const getCurrentUser = () => {
    return user.value;
  };

  async function register(name, email, password, confirm_agreement) {
    const response = await apiClient.post("/registration", {
      email: email,
      password: password,
      name: name,
      confirm_agreement: confirm_agreement,
    });
    return response.data;
  }

  async function login(email, password) {
    try {
      const response = await apiClient.post("/login", {
        email: email,
        password: password,
      });
      const { access_token: newToken } = response.data;
      token.value = newToken;
      isAuthenticated.value = true;
      localStorage.setItem("access_token", newToken);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }

  async function recoverPassword(email) {
    const response = await apiClient.patch("/send-restore-code", {
      email: email,
    });
    return response.data;
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await apiClient.get("/profile/get");
      user.value = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));
      isAuthenticated.value = true;
    } catch (error) {
      console.error("Fetch user error:", error);
      logout();
    }
  }

  async function getRaiting() {
    if (!token.value) return;
    try {
      const response = await apiClient.get("/rating/get");
      return response.data;
    } catch (error) {
      console.error("Get rating error:", error);
      throw error;
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    getCurrentUser,
    recoverPassword,
    fetchUser,
    getRaiting,
  };
});
