import React, { useState, useEffect, useCallback } from 'react';
import Downloader from './components/Downloader';
import PlaylistList from './components/PlaylistList';
import Player from './components/Player';
import Notifications from './components/Notifications';
import apiService from './services/api';
import wsService from './services/websocket';
import './App.css';

function App() {
  const [playlists, setPlaylists] = useState([]);
  const [playerStatus, setPlayerStatus] = useState({ playing: false, status: '' });
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const addNotification = useCallback((type, message, details = null) => {
    setNotifications((prev) => [
      ...prev,
      { type, message, details, timestamp: Date.now() }
    ]);
  }, []);

  const dismissNotification = useCallback((index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const loadPlaylists = useCallback(async () => {
    try {
      const response = await apiService.getPlaylists();
      if (response.success) {
        setPlaylists(response.playlists);
      }
    } catch (error) {
      console.error('Error loading playlists:', error);
      addNotification('error', 'Failed to load playlists');
    }
  }, [addNotification]);

  const loadPlayerStatus = useCallback(async () => {
    try {
      const response = await apiService.getPlayerStatus();
      if (response.success) {
        setPlayerStatus(response.status);
      }
    } catch (error) {
      console.error('Error loading player status:', error);
    }
  }, []);

  const handleDownload = useCallback(async (url, folder) => {
    try {
      const response = await apiService.downloadYouTube(url, folder);
      if (response.success) {
        addNotification('success', 'Download started', `URL: ${url}`);
      }
    } catch (error) {
      console.error('Error starting download:', error);
      addNotification('error', 'Failed to start download', error.message);
    }
  }, [addNotification]);

  const handlePlayPlaylist = useCallback(async (playlistPath) => {
    try {
      const response = await apiService.playPlaylist(playlistPath);
      if (response.success) {
        addNotification('success', 'Playing playlist');
        await loadPlayerStatus();
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
      addNotification('error', 'Failed to play playlist', error.message);
    }
  }, [addNotification, loadPlayerStatus]);

  const handlePlayTrack = useCallback(async (trackPath) => {
    try {
      const response = await apiService.playerAction('play', trackPath);
      if (response.success) {
        addNotification('success', 'Playing track');
        await loadPlayerStatus();
      }
    } catch (error) {
      console.error('Error playing track:', error);
      addNotification('error', 'Failed to play track', error.message);
    }
  }, [addNotification, loadPlayerStatus]);

  const handlePlayerControl = useCallback(async (action) => {
    try {
      const response = await apiService.playerAction(action);
      if (response.success) {
        await loadPlayerStatus();
      }
    } catch (error) {
      console.error('Error controlling player:', error);
      addNotification('error', `Failed to ${action}`, error.message);
    }
  }, [addNotification, loadPlayerStatus]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiService.rebuildIndex();
      await loadPlaylists();
      addNotification('success', 'Library refreshed');
    } catch (error) {
      console.error('Error refreshing library:', error);
      addNotification('error', 'Failed to refresh library', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadPlaylists, addNotification]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadPlaylists();
        await loadPlayerStatus();
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Connect WebSocket
    wsService.connect();
    wsService.subscribe('app', (data) => {
      switch (data.type) {
        case 'download-progress':
          console.log('Download progress:', data.progress);
          break;
        case 'download-complete':
          addNotification('success', 'Download completed', `Folder: ${data.folder || 'Auto-detected'}`);
          loadPlaylists();
          break;
        case 'download-error':
          addNotification('error', 'Download failed', data.error);
          break;
        case 'player-action':
          loadPlayerStatus();
          break;
        case 'playlist-playing':
          addNotification('info', 'Playlist started');
          break;
        default:
          console.log('Unknown WebSocket message:', data);
      }
    });

    // Cleanup
    return () => {
      wsService.unsubscribe('app');
      wsService.disconnect();
    };
  }, [loadPlaylists, loadPlayerStatus, addNotification]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎵 YouTube Playlist Downloader & Player</h1>
        <button className="refresh-btn" onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? 'Loading...' : '🔄 Refresh Library'}
        </button>
      </header>

      <Notifications notifications={notifications} onDismiss={dismissNotification} />

      <div className="app-content">
        <div className="left-panel">
          <Downloader onDownload={handleDownload} />
          <Player status={playerStatus} onControl={handlePlayerControl} />
        </div>

        <div className="right-panel">
          <PlaylistList
            playlists={playlists}
            onPlayPlaylist={handlePlayPlaylist}
            onPlayTrack={handlePlayTrack}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
