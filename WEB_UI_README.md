# 🎵 YouTube Playlist Downloader & Player - Web UI

A modern, beautiful web interface for downloading YouTube playlists and playing music. Built with React and Node.js, featuring real-time updates via WebSocket.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **YouTube Playlist Download**: Download entire playlists or individual videos with a single click
- **Music Library Management**: Organize your downloaded music by playlists
- **Built-in Music Player**: Play your music directly in the browser with full controls
- **Real-time Updates**: Live download progress and player status updates via WebSocket
- **Modern UI**: Beautiful, responsive design that works on desktop and mobile
- **Easy Deployment**: Docker support for one-command deployment

## 🖼️ Screenshots

### Main Interface
The clean, gradient-based UI with downloader, player controls, and playlist management.

### Features at a Glance
- **Left Panel**: YouTube downloader and music player controls
- **Right Panel**: Your playlists with expandable track lists
- **Top Bar**: Refresh library and status updates
- **Notifications**: Real-time download and playback notifications

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The easiest way to get started is using Docker:

```bash
# Make sure Docker and Docker Compose are installed
./start.sh
```

Then open your browser to: **http://localhost:3000**

### Option 2: Development Mode

For development with hot-reload:

```bash
# Install dependencies and start both servers
./start-dev.sh
```

- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:3001**

### Option 3: Manual Setup

#### Prerequisites
- Node.js 16+ and npm
- yt-dlp
- mpv
- socat
- ffmpeg

#### Install Dependencies

**Server:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env if needed
node server.js
```

**Client:**
```bash
cd client
npm install
npm start
```

## 📁 Project Structure

```
YT-Downloader-Player/
├── bin/                    # CLI scripts
│   └── music              # Main music command
├── lib/                    # Core functionality
│   ├── config.sh          # Configuration
│   ├── dl.sh              # Download logic
│   ├── player.sh          # MPV player controls
│   ├── ui.sh              # Terminal UI
│   ├── index.sh           # File indexing
│   └── utils.sh           # Utilities
├── server/                 # Backend API
│   ├── server.js          # Express server
│   ├── utils/
│   │   └── executor.js    # Shell command wrapper
│   ├── package.json
│   └── .env.example
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API & WebSocket
│   │   ├── styles/        # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── Dockerfile.server       # Server container
├── Dockerfile.client       # Client container
├── start.sh               # Docker startup script
└── start-dev.sh           # Development startup script
```

## 🎯 How to Use

### 1. Download a YouTube Playlist

1. Copy a YouTube playlist URL (e.g., `https://www.youtube.com/playlist?list=...`)
2. Paste it into the "YouTube URL" field
3. (Optional) Provide a custom folder name
4. Click "Download"
5. Watch the real-time progress in notifications

### 2. Browse Your Playlists

- All downloaded playlists appear in the right panel
- Click on a playlist to expand and see all tracks
- Click "▶ Play All" to play the entire playlist
- Click the play button next to any track to play it individually

### 3. Control Playback

Use the player controls in the left panel:
- **▶ Play**: Start/resume playback
- **⏸ Pause**: Pause playback
- **⏹ Stop**: Stop playback
- **⏮ Prev**: Previous track
- **⏭ Next**: Next track
- **🔉/🔊**: Volume down/up

### 4. Refresh Library

Click the "🔄 Refresh Library" button to rebuild the music index and update your playlists.

## 🔧 Configuration

### Server Configuration

Edit `server/.env`:

```env
PORT=3001
CLIENT_URL=http://localhost:3000
MUSIC_BASE_DIR=~/Music/Music/
```

### Client Configuration

Edit `client/.env`:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
```

### Music Storage

By default, music is stored in `~/Music/Music/`. Each playlist gets its own folder:

```
~/Music/Music/
├── Playlist Name 1/
│   ├── Song Title [VideoID].mp3
│   └── Another Song [VideoID].mp3
└── Playlist Name 2/
    └── Track [VideoID].mp3
```

## 🌐 API Reference

### REST Endpoints

#### GET `/api/playlists`
Get all playlists with tracks.

**Response:**
```json
{
  "success": true,
  "playlists": [
    {
      "name": "Playlist Name",
      "path": "/path/to/playlist",
      "trackCount": 10,
      "tracks": [...]
    }
  ]
}
```

#### POST `/api/download`
Start downloading a YouTube URL.

**Request:**
```json
{
  "url": "https://youtube.com/playlist?list=...",
  "folder": "Optional Folder Name"
}
```

#### POST `/api/player/:action`
Control the music player.

**Actions:** `play`, `pause`, `stop`, `next`, `prev`, `volup`, `voldown`

**Request (for play with specific track):**
```json
{
  "track": "/path/to/track.mp3"
}
```

#### GET `/api/player/status`
Get current player status.

#### POST `/api/playlist/play`
Play an entire playlist.

**Request:**
```json
{
  "playlistPath": "/path/to/playlist"
}
```

### WebSocket Events

The WebSocket connection provides real-time updates:

#### Download Progress
```json
{
  "type": "download-progress",
  "url": "...",
  "folder": "...",
  "progress": { "type": "stdout", "data": "..." }
}
```

#### Download Complete
```json
{
  "type": "download-complete",
  "url": "...",
  "folder": "...",
  "result": { "stdout": "...", "stderr": "..." }
}
```

#### Player Action
```json
{
  "type": "player-action",
  "action": "play",
  "result": { "stdout": "...", "stderr": "..." }
}
```

## 🐳 Docker Deployment

### Build and Run

```bash
docker-compose up --build
```

### Run in Background

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f
```

### Stop Services

```bash
docker-compose down
```

### Persistent Storage

Music files are stored in a Docker volume named `music_data`. To backup:

```bash
docker run --rm -v yt-downloader-player_music_data:/data -v $(pwd):/backup alpine tar czf /backup/music-backup.tar.gz -C /data .
```

## 🔍 Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use, edit `docker-compose.yml`:

```yaml
services:
  server:
    ports:
      - "YOUR_PORT:3001"  # Change YOUR_PORT
  client:
    ports:
      - "YOUR_PORT:80"    # Change YOUR_PORT
```

### Downloads Failing

1. Check if `yt-dlp` is installed and up to date
2. Try updating: `pip3 install --upgrade yt-dlp`
3. Check the browser cookie setting in `lib/config.sh`

### Player Not Working

1. Check if `mpv` is installed
2. Verify `socat` is available
3. Check player logs in the terminal

### WebSocket Connection Issues

1. Verify the backend is running on port 3001
2. Check firewall settings
3. Ensure `REACT_APP_WS_URL` is correct in `client/.env`

## 🛠️ Development

### Tech Stack

**Frontend:**
- React 18
- Axios for HTTP requests
- WebSocket for real-time updates
- CSS3 with gradients and animations

**Backend:**
- Node.js with Express
- WebSocket (ws package)
- Child processes for shell command execution

**Infrastructure:**
- Docker & Docker Compose
- Nginx for production serving
- Alpine Linux for minimal container size

### Running Tests

```bash
# Client tests
cd client
npm test

# Server tests (if added)
cd server
npm test
```

### Building for Production

**Client:**
```bash
cd client
npm run build
```

The optimized build will be in `client/build/`.

**Server:**
The server doesn't need building, but ensure production dependencies:
```bash
cd server
npm install --production
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🙏 Acknowledgments

- Built on top of the original terminal-based YT-Downloader-Player
- Uses yt-dlp for YouTube downloading
- Uses mpv for music playback
- React for the beautiful UI

## 📧 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review the logs: `docker-compose logs`
3. Open an issue on GitHub

---

**Enjoy your music! 🎵**
