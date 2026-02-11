"use client";

import { create } from "zustand";

interface NotificationModalState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useNotificationModal = create<NotificationModalState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
