import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { apiClient } from '@/shared/api/client';
import type { ChatRoom, Message } from '@/shared/types/api';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'wss://api.fee-cha.com';

interface ChatState {
  rooms: ChatRoom[];
  messages: Map<string, Message[]>;
  socket: Socket | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ChatActions {
  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string, page?: number) => Promise<void>;
  sendMessage: (roomId: string, content: string, type?: 'TEXT' | 'IMAGE' | 'FILE') => void;
  markAsRead: (roomId: string, messageId: string) => void;
  connectSocket: (accessToken: string) => void;
  disconnectSocket: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  rooms: [],
  messages: new Map(),
  socket: null,
  isConnected: false,
  isLoading: false,
  error: null,

  fetchRooms: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<{ data: ChatRoom[] }>('/chat/rooms');

      set({ rooms: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '채팅방 목록 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchMessages: async (roomId: string, page = 1) => {
    try {
      set({ isLoading: true, error: null });

      const response = await apiClient.get<{ data: Message[] }>(
        `/chat/rooms/${roomId}/messages`,
        { params: { page, limit: 50 } }
      );

      const messages = get().messages;
      messages.set(roomId, response.data.data);

      set({ messages: new Map(messages), isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || '메시지 조회에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  sendMessage: (roomId: string, content: string, type = 'TEXT') => {
    const socket = get().socket;
    if (!socket) {
      console.error('Socket not connected');
      return;
    }

    socket.emit('send-message', {
      roomId,
      content,
      type,
    });
  },

  markAsRead: (roomId: string, messageId: string) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit('mark-as-read', {
      roomId,
      messageId,
    });
  },

  connectSocket: (accessToken: string) => {
    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    socket.on('new-message', (message: Message) => {
      const messages = get().messages;
      const roomMessages = messages.get(message.roomId) || [];
      roomMessages.push(message);
      messages.set(message.roomId, roomMessages);

      set({ messages: new Map(messages) });
    });

    socket.on('message-read', ({ messageId, readBy }) => {
      // 읽음 처리 로직
      const messages = get().messages;
      messages.forEach((roomMessages, roomId) => {
        const updatedMessages = roomMessages.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        );
        messages.set(roomId, updatedMessages);
      });

      set({ messages: new Map(messages) });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinRoom: (roomId: string) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('join-room', { roomId });
    }
  },

  leaveRoom: (roomId: string) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('leave-room', { roomId });
    }
  },
}));
