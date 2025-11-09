import React, { useState } from 'react';
import '../styles/PlaylistList.css';

function PlaylistList({ playlists, onPlayPlaylist, onPlayTrack }) {
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  const togglePlaylist = (playlistName) => {
    setExpandedPlaylist(expandedPlaylist === playlistName ? null : playlistName);
  };

  return (
    <div className="playlist-list">
      <h2>Your Playlists</h2>
      {playlists.length === 0 ? (
        <p className="empty-message">No playlists yet. Download some music to get started!</p>
      ) : (
        <div className="playlists">
          {playlists.map((playlist) => (
            <div key={playlist.name} className="playlist-item">
              <div className="playlist-header">
                <div
                  className="playlist-info"
                  onClick={() => togglePlaylist(playlist.name)}
                >
                  <span className="expand-icon">
                    {expandedPlaylist === playlist.name ? '▼' : '▶'}
                  </span>
                  <h3>{playlist.name}</h3>
                  <span className="track-count">{playlist.trackCount} tracks</span>
                </div>
                <button
                  className="play-all-btn"
                  onClick={() => onPlayPlaylist(playlist.path)}
                >
                  ▶ Play All
                </button>
              </div>
              {expandedPlaylist === playlist.name && (
                <div className="track-list">
                  {playlist.tracks.map((track, index) => (
                    <div key={index} className="track-item">
                      <span className="track-name">{track.name}</span>
                      <button
                        className="play-track-btn"
                        onClick={() => onPlayTrack(track.path)}
                      >
                        ▶
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistList;
