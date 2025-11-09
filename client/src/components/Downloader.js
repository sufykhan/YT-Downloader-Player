import React, { useState } from 'react';
import '../styles/Downloader.css';

function Downloader({ onDownload }) {
  const [url, setUrl] = useState('');
  const [folder, setFolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      await onDownload(url, folder);
      setUrl('');
      setFolder('');
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="downloader">
      <h2>Download YouTube Playlist</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">YouTube URL</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=..."
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="folder">Folder Name (optional)</label>
          <input
            type="text"
            id="folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="Leave empty to auto-detect"
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Starting Download...' : 'Download'}
        </button>
      </form>
    </div>
  );
}

export default Downloader;
