import axios, { AxiosInstance } from 'axios';
import { CONFIG } from '../config';

export type UserType = 'student' | 'faculty' | 'admin' | string;

export interface AuthResponse {
  auth_token: string;
  name: string;
  email: string;
  type: UserType;
  id: number;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `${CONFIG.API_BASE_URL}/api`,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Auth
  requestOtp(email: string) {
    return this.client.post('/auth/otp', { email });
  }

  verifyOtp(email: string, otp: string) {
    return this.client.post('/auth/verify-otp', { email, otp });
  }

  signUp(name: string, email: string, password: string, userType: UserType) {
    return this.client.post<AuthResponse>('/auth/signup', {
      name,
      email,
      password,
      userType,
    });
  }

  signIn(email: string, password: string) {
    return this.client.post<AuthResponse>('/auth/signin', { email, password });
  }

  // User
  getUser() {
    return this.client.get('/auth/getusers');
  }

  updateDetails(payload: { name?: string; email?: string }) {
    return this.client.put('/auth/update-details', payload);
  }

  // Videos
  uploadVideo(fileUri: string, fileName?: string) {
    const data = new FormData();
    // @ts-ignore: React Native FormData file
    data.append('video', {
      uri: fileUri,
      name: fileName ?? 'video.mp4',
      type: 'video/mp4',
    });
    return this.client.post<{ success: boolean; filename: string }>(
      '/videos/upload',
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  }

  saveVideoMeta(payload: {
    user_id: number;
    url: string; // filename returned from upload
    category: string;
    title: string;
    description?: string;
  }) {
    return this.client.post('/videos', payload);
  }

  listVideos() {
    return this.client.get('/videos');
  }
}

export const api = new ApiClient();
