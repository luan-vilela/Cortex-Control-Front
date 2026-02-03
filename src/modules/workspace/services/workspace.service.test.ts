import axios from "axios";
import { workspaceService } from "./workspace.service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("workspaceService", () => {
  const API_URL = "http://localhost:3000";
  const mockToken = "mock-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWorkspaces", () => {
    it("deve buscar workspaces do usuário", async () => {
      const mockResponse = {
        data: [
          {
            id: "ws-1",
            name: "Workspace 1",
            role: "owner",
            isOwner: true,
          },
          {
            id: "ws-2",
            name: "Workspace 2",
            role: "member",
            isOwner: false,
          },
        ],
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await workspaceService.getWorkspaces(mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/workspaces`, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getWorkspaceById", () => {
    it("deve buscar detalhes de um workspace específico", async () => {
      const workspaceId = "ws-123";
      const mockResponse = {
        data: {
          workspace: {
            id: workspaceId,
            name: "Test Workspace",
            active: true,
          },
          userRole: "owner",
          members: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await workspaceService.getWorkspaceById(
        workspaceId,
        mockToken,
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_URL}/workspaces/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("createWorkspace", () => {
    it("deve criar um novo workspace", async () => {
      const workspaceData = { name: "New Workspace" };
      const mockResponse = {
        data: {
          id: "ws-new",
          name: "New Workspace",
          active: true,
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await workspaceService.createWorkspace(
        workspaceData,
        mockToken,
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/workspaces`,
        workspaceData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("updateWorkspace", () => {
    it("deve atualizar um workspace existente", async () => {
      const workspaceId = "ws-123";
      const updateData = { name: "Updated Workspace" };
      const mockResponse = {
        data: {
          id: workspaceId,
          name: "Updated Workspace",
          active: true,
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await workspaceService.updateWorkspace(
        workspaceId,
        updateData,
        mockToken,
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${API_URL}/workspaces/${workspaceId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("inviteMember", () => {
    it("deve enviar convite para novo membro", async () => {
      const workspaceId = "ws-123";
      const inviteData = {
        email: "newuser@test.com",
        role: "member",
      };
      const mockResponse = {
        data: {
          id: "invite-123",
          email: "newuser@test.com",
          role: "member",
          token: "invite-token",
          status: "pending",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await workspaceService.inviteMember(
        workspaceId,
        inviteData,
        mockToken,
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/workspaces/${workspaceId}/invite`,
        inviteData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getInvites", () => {
    it("deve buscar convites pendentes", async () => {
      const mockResponse = {
        data: [
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
        ],
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await workspaceService.getInvites(mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_URL}/workspaces/invites`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("acceptInvite", () => {
    it("deve aceitar um convite", async () => {
      const inviteToken = "invite-token-123";
      const mockResponse = {
        data: {
          message: "Convite aceito com sucesso",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await workspaceService.acceptInvite(
        inviteToken,
        mockToken,
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/workspaces/invites/${inviteToken}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("rejectInvite", () => {
    it("deve rejeitar um convite", async () => {
      const inviteToken = "invite-token-123";
      const mockResponse = {
        data: {
          message: "Convite rejeitado",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await workspaceService.rejectInvite(
        inviteToken,
        mockToken,
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/workspaces/invites/${inviteToken}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("removeMember", () => {
    it("deve remover um membro do workspace", async () => {
      const workspaceId = "ws-123";
      const userId = "user-456";
      const mockResponse = {
        data: {
          message: "Membro removido com sucesso",
        },
      };

      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await workspaceService.removeMember(
        workspaceId,
        userId,
        mockToken,
      );

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${API_URL}/workspaces/${workspaceId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("updateMemberRole", () => {
    it("deve atualizar o papel de um membro", async () => {
      const workspaceId = "ws-123";
      const userId = "user-456";
      const roleData = { role: "admin" };
      const mockResponse = {
        data: {
          message: "Papel atualizado com sucesso",
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await workspaceService.updateMemberRole(
        workspaceId,
        userId,
        roleData,
        mockToken,
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${API_URL}/workspaces/${workspaceId}/members/${userId}/role`,
        roleData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
