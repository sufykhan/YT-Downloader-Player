const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
require('dotenv').config();

const {
  executeMusic,
  downloadYouTube,
  getMusicIndex,
  getPlaylists,
  getPlayerStatus
} = require('./utils/executor');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WebSocket connections
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// API Routes

// Get all playlists
app.get('/api/playlists', async (req, res) => {
  try {
    const playlists = await getPlaylists();
    res.json({ success: true, playlists });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get music index
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await getMusicIndex();
    res.json({ success: true, tracks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download YouTube video/playlist
app.post('/api/download', async (req, res) => {
  try {
    const { url, folder } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    // Start download in background
    downloadYouTube(url, folder, (progress) => {
      // Broadcast progress to all connected clients
      broadcast({
        type: 'download-progress',
        url,
        folder,
        progress
      });
    })
      .then((result) => {
        broadcast({
          type: 'download-complete',
          url,
          folder,
          result
        });
      })
      .catch((error) => {
        broadcast({
          type: 'download-error',
          url,
          folder,
          error: error.error || error.message
        });
      });

    res.json({ success: true, message: 'Download started' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Player controls
app.post('/api/player/:action', async (req, res) => {
  try {
    const { action } = req.params;
    const { track } = req.body;

    let result;
    switch (action) {
      case 'play':
        if (track) {
          result = await executeMusic('play', [track]);
        } else {
          result = await executeMusic('play');
        }
        break;
      case 'pause':
        result = await executeMusic('pause');
        break;
      case 'stop':
        result = await executeMusic('stop');
        break;
      case 'next':
        result = await executeMusic('next');
        break;
      case 'prev':
        result = await executeMusic('prev');
        break;
      case 'volup':
        result = await executeMusic('volup');
        break;
      case 'voldown':
        result = await executeMusic('voldown');
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid action' });
    }

    // Broadcast player state change
    broadcast({
      type: 'player-action',
      action,
      result
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get player status
app.get('/api/player/status', async (req, res) => {
  try {
    const status = await getPlayerStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Play playlist
app.post('/api/playlist/play', async (req, res) => {
  try {
    const { playlistPath } = req.body;

    if (!playlistPath) {
      return res.status(400).json({ success: false, error: 'Playlist path is required' });
    }

    const result = await executeMusic('playdir', [playlistPath]);

    broadcast({
      type: 'playlist-playing',
      playlist: playlistPath
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rebuild index
app.post('/api/index/rebuild', async (req, res) => {
  try {
    await executeMusic('index');
    res.json({ success: true, message: 'Index rebuilt successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running`);
});
