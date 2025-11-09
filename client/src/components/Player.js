import React from 'react';
import '../styles/Player.css';

function Player({ status, onControl }) {
  return (
    <div className="player">
      <h2>Music Player</h2>
      <div className="player-status">
        <p>{status.status || 'No track playing'}</p>
      </div>
      <div className="player-controls">
        <button onClick={() => onControl('prev')} title="Previous">
          ⏮
        </button>
        <button onClick={() => onControl('play')} title="Play">
          ▶
        </button>
        <button onClick={() => onControl('pause')} title="Pause">
          ⏸
        </button>
        <button onClick={() => onControl('stop')} title="Stop">
          ⏹
        </button>
        <button onClick={() => onControl('next')} title="Next">
          ⏭
        </button>
      </div>
      <div className="volume-controls">
        <button onClick={() => onControl('voldown')} title="Volume Down">
          🔉
        </button>
        <button onClick={() => onControl('volup')} title="Volume Up">
          🔊
        </button>
      </div>
    </div>
  );
}

export default Player;
