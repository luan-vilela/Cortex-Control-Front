import api from "@/lib/api";
import type {
  Wallet,
  Transaction,
  RechargeWalletDto,
} from "../types/wallet.types";

class WalletService {
  async getWallet(): Promise<Wallet> {
    const response = await api.get<Wallet>("/wallet");
    return response.data;
  }

  async rechargeWallet(
    data: RechargeWalletDto,
  ): Promise<{ wallet: Wallet; transaction: Transaction }> {
    const response = await api.post<{
      wallet: Wallet;
      transaction: Transaction;
    }>("/wallet/recharge", data);
    return response.data;
  }

  async getTransactions(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await api.get<{
      transactions: Transaction[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/wallet/transactions?page=${page}&limit=${limit}`);
    return response.data;
  }
}

export const walletService = new WalletService();
