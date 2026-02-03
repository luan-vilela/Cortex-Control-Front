import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Workspace, WorkspaceInvite } from "../types/workspace.types";
import { workspaceService } from "../services/workspace.service";

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  invites: WorkspaceInvite[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  setInvites: (invites: WorkspaceInvite[]) => void;
  fetchWorkspaces: () => Promise<void>;
  fetchInvites: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspaceId: string, data: Partial<Workspace>) => void;
  removeWorkspace: (workspaceId: string) => void;
  clear: () => void;
}

const initialState = {
  workspaces: [],
  activeWorkspace: null,
  invites: [],
  _hasHydrated: false,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      setWorkspaces: (workspaces) => {
        set({ workspaces });
        // Se não há workspace ativo, selecionar o primeiro
        if (!get().activeWorkspace && workspaces.length > 0) {
          set({ activeWorkspace: workspaces[0] });
        }
      },

      setActiveWorkspace: (workspace) => {
        set({ activeWorkspace: workspace });
      },

      setInvites: (invites) => {
        set({ invites });
      },

      fetchWorkspaces: async () => {
        try {
          const workspaces = await workspaceService.getUserWorkspaces();
          get().setWorkspaces(workspaces);
        } catch (error) {
          console.error("Erro ao buscar workspaces:", error);
        }
      },

      fetchInvites: async () => {
        try {
          const invites = await workspaceService.getPendingInvites();
          set({ invites });
        } catch (error) {
          console.error("Erro ao buscar convites:", error);
        }
      },

      switchWorkspace: async (workspaceId: string) => {
        try {
          await workspaceService.switchWorkspace(workspaceId);
          const workspace = get().workspaces.find((w) => w.id === workspaceId);
          if (workspace) {
            set({ activeWorkspace: workspace });
          }
        } catch (error) {
          console.error("Erro ao trocar workspace:", error);
          throw error;
        }
      },

      addWorkspace: (workspace) => {
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
        }));
      },

      updateWorkspace: (workspaceId, data) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId ? { ...w, ...data } : w,
          ),
          activeWorkspace:
            state.activeWorkspace?.id === workspaceId
              ? { ...state.activeWorkspace, ...data }
              : state.activeWorkspace,
        }));
      },

      removeWorkspace: (workspaceId) => {
        set((state) => {
          const newWorkspaces = state.workspaces.filter(
            (w) => w.id !== workspaceId,
          );
          return {
            workspaces: newWorkspaces,
            activeWorkspace:
              state.activeWorkspace?.id === workspaceId
                ? newWorkspaces[0] || null
                : state.activeWorkspace,
          };
        });
      },

      clear: () => {
        set(initialState);
      },
    }),
    {
      name: "workspace-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
