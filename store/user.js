import { ToastAndroid } from "react-native";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const showToast = (msg) => {
  ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
};

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  loading: false,

  setLoading: (loading) => set({ loading }),

  getLocalUser: async () => {
    try {
      set({ loading: true });
      const userJSON = await AsyncStorage.getItem("user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      set({ user: userData });
    } catch (error) {
      showToast("Error getting local user");
    } finally {
      set({ loading: false });
    }
  },

  setLocalUser: async (user) => {
    try {
      set({ loading: true });
      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user });
    } catch (error) {
      showToast("Error setting local user");
    } finally {
      set({ loading: false });
    }
  },

  clearLocalUser: async () => {
    try {
      set({ loading: true });
      await AsyncStorage.removeItem("user");
      set({ user: null });
    } catch (error) {
      showToast("Error clearing local user");
    } finally {
      set({ loading: false });
    }
  },
}));
