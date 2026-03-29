import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getProfile,
  createRequest,
  getRequests,
  createBid,
  createOrder,
  getOrders,
  sendMessage,
} from '../lib/supabase';
import { supabase } from '../lib/supabase';

describe('Supabase API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should sign up a new user', async () => {
      const mockUser = { id: '123', email: 'test@test.com' };
      (supabase.auth.signUp as any).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signUp('test@test.com', 'password123', 'Test User');

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User' },
        },
      });
      expect(result.data?.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should sign in an existing user', async () => {
      const mockUser = { id: '123', email: 'test@test.com' };
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'token' } },
        error: null,
      });

      const result = await signIn('test@test.com', 'password123');

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result.data?.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should handle sign in errors', async () => {
      (supabase.auth.signInWithPassword as any).mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      });

      const result = await signIn('test@test.com', 'wrongpassword');

      expect(result.data).toBeNull();
      expect(result.error?.message).toBe('Invalid login credentials');
    });

    it('should sign out user', async () => {
      (supabase.auth.signOut as any).mockResolvedValue({ error: null });

      const result = await signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it('should get current user', async () => {
      const mockUser = { id: '123', email: 'test@test.com' };
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
    });

    it('should get user profile', async () => {
      const mockProfile = {
        id: '123',
        email: 'test@test.com',
        full_name: 'Test User',
        role: 'user',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      const result = await getProfile('123');

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', '123');
      expect(result.data).toEqual(mockProfile);
    });
  });

  describe('Requests', () => {
    it('should create a new request', async () => {
      const mockRequest = {
        id: 'req-123',
        title: 'Test Request',
        description: 'Test Description',
        tags: ['React', 'Next.js'],
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockRequest,
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as any).mockReturnValue({ insert: mockInsert });

      const result = await createRequest({
        title: 'Test Request',
        description: 'Test Description',
        tags: ['React', 'Next.js'],
      });

      expect(supabase.from).toHaveBeenCalledWith('requests');
      expect(mockInsert).toHaveBeenCalledWith({
        title: 'Test Request',
        description: 'Test Description',
        tags: ['React', 'Next.js'],
      });
      expect(result.data).toEqual(mockRequest);
    });

    it('should get all requests', async () => {
      const mockRequests = [
        { id: '1', title: 'Request 1' },
        { id: '2', title: 'Request 2' },
      ];

      const mockOrder = vi.fn().mockResolvedValue({
        data: mockRequests,
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      const result = await getRequests();

      expect(supabase.from).toHaveBeenCalledWith('requests');
      expect(result.data).toEqual(mockRequests);
    });
  });

  describe('Bids', () => {
    it('should create a new bid', async () => {
      const mockBid = {
        id: 'bid-123',
        request_id: 'req-123',
        price: 500,
        analysis: 'Test analysis',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockBid,
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as any).mockReturnValue({ insert: mockInsert });

      const result = await createBid({
        request_id: 'req-123',
        price: 500,
        analysis: 'Test analysis',
        solution: 'Test solution',
        delivery_hours: 24,
      });

      expect(supabase.from).toHaveBeenCalledWith('bids');
      expect(result.data).toEqual(mockBid);
    });
  });

  describe('Orders', () => {
    it('should create a new order', async () => {
      const mockOrder = {
        id: 'order-123',
        request_id: 'req-123',
        price: 500,
        status: 'pending_payment',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockOrder,
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as any).mockReturnValue({ insert: mockInsert });

      const result = await createOrder({
        request_id: 'req-123',
        bid_id: 'bid-123',
        expert_id: 'expert-123',
        price: 500,
        platform_fee: 50,
        total_amount: 550,
      });

      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(result.data).toEqual(mockOrder);
    });

    it('should get all orders', async () => {
      const mockOrders = [
        { id: '1', status: 'in_progress' },
        { id: '2', status: 'completed' },
      ];

      const mockOrder = vi.fn().mockResolvedValue({
        data: mockOrders,
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      (supabase.from as any).mockReturnValue({ select: mockSelect });

      const result = await getOrders();

      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(result.data).toEqual(mockOrders);
    });
  });

  describe('Chat', () => {
    it('should send a message', async () => {
      const mockMessage = {
        id: 'msg-123',
        room_id: 'room-123',
        content: 'Hello',
        message_type: 'text',
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: mockMessage,
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      (supabase.from as any).mockReturnValue({ insert: mockInsert });

      const result = await sendMessage({
        room_id: 'room-123',
        content: 'Hello',
        message_type: 'text',
      });

      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(result.data).toEqual(mockMessage);
    });
  });
});
