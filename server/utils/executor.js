const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const MUSIC_BIN = path.join(__dirname, '../../bin/music');

/**
 * Execute music command
 * @param {string} command - Command to execute (dl, play, pause, etc.)
 * @param {Array} args - Command arguments
 * @returns {Promise} Command output
 */
function executeMusic(command, args = []) {
  return new Promise((resolve, reject) => {
    const cmdArgs = [command, ...args];
    const fullCommand = `${MUSIC_BIN} ${cmdArgs.join(' ')}`;

    exec(fullCommand, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr });
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

/**
 * Download YouTube playlist/video
 * @param {string} url - YouTube URL
 * @param {string} folder - Optional folder name
 * @param {Function} progressCallback - Callback for progress updates
 * @returns {Promise}
 */
function downloadYouTube(url, folder = '', progressCallback = null) {
  return new Promise((resolve, reject) => {
    const args = ['dl', url];
    if (folder) args.push(folder);

    const child = spawn(MUSIC_BIN, args);
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      if (progressCallback) {
        progressCallback({ type: 'stdout', data: data.toString() });
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      if (progressCallback) {
        progressCallback({ type: 'stderr', data: data.toString() });
      }
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject({ error: `Process exited with code ${code}`, stdout, stderr });
      }
    });

    child.on('error', (error) => {
      reject({ error: error.message, stdout, stderr });
    });
  });
}

/**
 * Get music library index
 * @returns {Promise<Array>} List of music files
 */
async function getMusicIndex() {
  try {
    await executeMusic('index');

    const indexFile = path.join(
      process.env.HOME,
      '.local/share/music_manager/index.txt'
    );

    if (!fs.existsSync(indexFile)) {
      return [];
    }

    const content = fs.readFileSync(indexFile, 'utf8');
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(filePath => {
        const fileName = path.basename(filePath);
        const dirName = path.basename(path.dirname(filePath));
        return {
          path: filePath,
          name: fileName,
          playlist: dirName
        };
      });
  } catch (error) {
    console.error('Error getting music index:', error);
    return [];
  }
}

/**
 * Get playlists (folders in music directory)
 * @returns {Promise<Array>} List of playlists
 */
async function getPlaylists() {
  const baseDir = process.env.MUSIC_BASE_DIR || path.join(process.env.HOME, 'Music/Music');
  const expandedDir = baseDir.replace(/^~/, process.env.HOME);

  try {
    if (!fs.existsSync(expandedDir)) {
      return [];
    }

    const entries = fs.readdirSync(expandedDir, { withFileTypes: true });
    const playlists = entries
      .filter(entry => entry.isDirectory())
      .map(dir => {
        const dirPath = path.join(expandedDir, dir.name);
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mp3'));

        return {
          name: dir.name,
          path: dirPath,
          trackCount: files.length,
          tracks: files.map(f => ({
            name: f,
            path: path.join(dirPath, f)
          }))
        };
      });

    return playlists;
  } catch (error) {
    console.error('Error getting playlists:', error);
    return [];
  }
}

/**
 * Get player status
 * @returns {Promise<Object>} Player status
 */
async function getPlayerStatus() {
  try {
    const result = await executeMusic('controls', ['status']);
    // Parse the output to get structured data
    return {
      playing: result.stdout.includes('Playing') || result.stdout.includes('▶'),
      status: result.stdout.trim()
    };
  } catch (error) {
    return {
      playing: false,
      status: 'stopped'
    };
  }
}

/**
 * Start MPV daemon
 * @returns {Promise}
 */
async function startDaemon() {
  try {
    const result = await executeMusic('daemon');
    return { success: true, result };
  } catch (error) {
    console.error('Error starting daemon:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  executeMusic,
  downloadYouTube,
  getMusicIndex,
  getPlaylists,
  getPlayerStatus,
  startDaemon
};
