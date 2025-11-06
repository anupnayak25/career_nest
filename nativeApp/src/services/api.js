import axios from 'axios';
import { CONFIG } from '../config';

class ApiClient {
  constructor() {
    this.token = null;
    this.client = axios.create({
      baseURL: `${CONFIG.API_BASE_URL}/api`,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setToken(token) {
    this.token = token;
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Auth
  requestOtp(email) {
    return this.client.post('/auth/otp', { email });
  }

  verifyOtp(email, otp) {
    return this.client.post('/auth/verify-otp', { email, otp });
  }

  signUp(name, email, password, userType) {
    return this.client.post('/auth/signup', {
      name,
      email,
      password,
      userType,
    });
  }

  signIn(email, password) {
    return this.client.post('/auth/signin', { email, password });
  }

  // User
  getUser() {
    return this.client.get('/auth/getusers');
  }

  updateDetails(payload) {
    return this.client.put('/auth/update-details', payload);
  }

  // Videos
  uploadVideo(fileUri, fileName) {
    const data = new FormData();
    data.append('video', {
      uri: fileUri,
      name: fileName || 'video.mp4',
      type: 'video/mp4',
    });
    return this.client.post('/videos/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  saveVideoMeta(payload) {
    return this.client.post('/videos', payload);
  }

  listVideos() {
    return this.client.get('/videos');
  }

  deleteVideo(id) {
    return this.client.delete(`/videos/${id}`);
  }

  updateVideo(id, payload) {
    return this.client.put(`/videos/${id}`, payload);
  }

  getVideosByCategory(category) {
    return this.client.get(`/videos/category/${encodeURIComponent(category)}`);
  }
}

export const api = new ApiClient();
