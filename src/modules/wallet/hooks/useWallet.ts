import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "../services/wallet.service";
import type { RechargeWalletDto } from "../types/wallet.types";

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () => walletService.getWallet(),
    staleTime: 30000, // 30 segundos
  });
}

export function useWalletTransactions(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["wallet-transactions", page, limit],
    queryFn: () => walletService.getTransactions(page, limit),
    staleTime: 60000, // 1 minuto
  });
}

export function useRechargeWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RechargeWalletDto) => walletService.rechargeWallet(data),
    onSuccess: () => {
      // Invalida o cache da wallet e das transações
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
}
