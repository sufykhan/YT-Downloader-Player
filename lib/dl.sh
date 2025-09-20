# dl.sh - download command using yt-dlp

dl_cmd() {
  _require yt-dlp
  if [ -z "${1:-}" ]; then echo "Usage: music dl <URL> [FolderName]"; return 1; fi
  URL="$1"
  CUSTOM="${2:-}"
  if [ -n "$CUSTOM" ]; then FOLDER="$CUSTOM"; else
    FOLDER=$(yt-dlp --flat-playlist --print "%(playlist_title)s" "$URL" 2>/dev/null | head -n1 || true)
    [ -z "$FOLDER" ] && FOLDER=$(date +"%Y-%m-%d")
  fi
  DOWNLOAD_DIR="$BASE_DIR/$FOLDER"
  mkdir -p "$DOWNLOAD_DIR"; cd "$DOWNLOAD_DIR" || return 1
  log "Downloading into $DOWNLOAD_DIR ..."
  yt-dlp -x --audio-format mp3 --cookies-from-browser "$BROWSER" -o "%(title).80s [%(id)s].%(ext)s" "$URL"
  log "Download complete."
  # update index after download
  index_cmd
}
