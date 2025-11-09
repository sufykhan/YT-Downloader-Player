import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Playlists
  getPlaylists: async () => {
    const response = await api.get('/playlists');
    return response.data;
  },

  getTracks: async () => {
    const response = await api.get('/tracks');
    return response.data;
  },

  // Download
  downloadYouTube: async (url, folder = '') => {
    const response = await api.post('/download', { url, folder });
    return response.data;
  },

  // Player controls
  playerAction: async (action, track = null) => {
    const response = await api.post(`/player/${action}`, { track });
    return response.data;
  },

  getPlayerStatus: async () => {
    const response = await api.get('/player/status');
    return response.data;
  },

  playPlaylist: async (playlistPath) => {
    const response = await api.post('/playlist/play', { playlistPath });
    return response.data;
  },

  rebuildIndex: async () => {
    const response = await api.post('/index/rebuild');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default apiService;
