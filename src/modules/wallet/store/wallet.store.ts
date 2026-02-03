import { create } from "zustand";
import type { Wallet } from "../types/wallet.types";

interface WalletState {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet) => void;
  updateBalance: (balance: number) => void;
  clear: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  setWallet: (wallet) => set({ wallet }),
  updateBalance: (balance) =>
    set((state) =>
      state.wallet ? { wallet: { ...state.wallet, balance } } : state,
    ),
  clear: () => set({ wallet: null }),
}));
