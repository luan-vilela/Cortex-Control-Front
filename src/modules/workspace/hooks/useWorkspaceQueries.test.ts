import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWorkspaceQueries } from "./useWorkspaceQueries";
import { workspaceService } from "../services/workspace.service";
import { useAuthStore } from "@/modules/auth/store/auth.store";

jest.mock("../services/workspace.service");
jest.mock("@/modules/auth/store/auth.store");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useWorkspaceQueries", () => {
  const mockToken = "mock-token";

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore.getState as jest.Mock) = jest.fn(() => ({
      token: mockToken,
    }));
  });

  describe("useWorkspaces", () => {
    it("deve buscar workspaces com sucesso", async () => {
      const mockWorkspaces = [
        { id: "ws-1", name: "Workspace 1", role: "owner" },
        { id: "ws-2", name: "Workspace 2", role: "member" },
      ];

      (workspaceService.getWorkspaces as jest.Mock).mockResolvedValue(
        mockWorkspaces,
      );

      const { result } = renderHook(() => useWorkspaceQueries.useWorkspaces(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockWorkspaces);
      expect(workspaceService.getWorkspaces).toHaveBeenCalledWith(mockToken);
    });

    it("deve lidar com erro ao buscar workspaces", async () => {
      const mockError = new Error("Failed to fetch workspaces");

      (workspaceService.getWorkspaces as jest.Mock).mockRejectedValue(
        mockError,
      );

      const { result } = renderHook(() => useWorkspaceQueries.useWorkspaces(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe("useWorkspaceById", () => {
    it("deve buscar workspace específico com sucesso", async () => {
      const workspaceId = "ws-123";
      const mockWorkspace = {
        workspace: {
          id: workspaceId,
          name: "Test Workspace",
        },
        userRole: "owner",
        members: [],
      };

      (workspaceService.getWorkspaceById as jest.Mock).mockResolvedValue(
        mockWorkspace,
      );

      const { result } = renderHook(
        () => useWorkspaceQueries.useWorkspaceById(workspaceId),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockWorkspace);
      expect(workspaceService.getWorkspaceById).toHaveBeenCalledWith(
        workspaceId,
        mockToken,
      );
    });

    it("não deve buscar quando workspaceId não é fornecido", () => {
      const { result } = renderHook(
        () => useWorkspaceQueries.useWorkspaceById(undefined as any),
        {
          wrapper: createWrapper(),
        },
      );

      expect(result.current.data).toBeUndefined();
      expect(workspaceService.getWorkspaceById).not.toHaveBeenCalled();
    });
  });

  describe("useWorkspaceInvites", () => {
    it("deve buscar convites pendentes com sucesso", async () => {
      const mockInvites = [
        {
          id: "invite-1",
          email: "user1@test.com",
          workspaceName: "Workspace 1",
          status: "pending",
        },
        {
          id: "invite-2",
          email: "user2@test.com",
          workspaceName: "Workspace 2",
          status: "pending",
        },
      ];

      (workspaceService.getInvites as jest.Mock).mockResolvedValue(mockInvites);

      const { result } = renderHook(
        () => useWorkspaceQueries.useWorkspaceInvites(),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockInvites);
      expect(workspaceService.getInvites).toHaveBeenCalledWith(mockToken);
    });
  });
});
