# config.sh - defaults (can be overridden by ENV vars)
BASE_DIR="${MUSIC_MANAGER_BASE:-$HOME/Music/Music}"
BROWSER="${MUSIC_MANAGER_BROWSER:-safari}"
INDEX_FILE="${MUSIC_MANAGER_INDEX:-$HOME/.local/share/music_manager/index.txt}"
MPV_IPC_DIR="${XDG_RUNTIME_DIR:-/tmp}/music_manager"
MPV_IPC_SOCKET="$MPV_IPC_DIR/mpv.sock"

mkdir -p "$(dirname "$INDEX_FILE")"
mkdir -p "$MPV_IPC_DIR"
