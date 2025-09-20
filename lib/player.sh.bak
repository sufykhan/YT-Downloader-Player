# player.sh - mpv daemon, play functions, and controls (patched)
# Backup before replacing:
# cp ~/scripts/music_manager/lib/player.sh ~/scripts/music_manager/lib/player.sh.bak

daemon_cmd() {
  # require mpv + socat for IPC mode
  _require mpv socat
  mkdir -p "$MPV_IPC_DIR"

  # If socket exists but mpv isn't running, remove stale socket
  if [ -S "$MPV_IPC_SOCKET" ] && ! pgrep -a mpv >/dev/null 2>&1; then
    echo "⚠️  Found stale mpv socket; removing."
    rm -f "$MPV_IPC_SOCKET" || true
  fi

  if [ -S "$MPV_IPC_SOCKET" ]; then
    log "mpv daemon already running (socket present)."
    return
  fi

  log "Starting mpv daemon..."
  # start mpv detached so it lives beyond your terminal
  nohup mpv --idle --no-terminal --input-ipc-server="$MPV_IPC_SOCKET" --volume=60 >/tmp/mpv_music_daemon.log 2>&1 & disown
  # wait briefly for socket to appear
  for i in $(seq 1 40); do
    [ -S "$MPV_IPC_SOCKET" ] && break
    sleep 0.05
  done

  if [ -S "$MPV_IPC_SOCKET" ]; then
    log "mpv daemon started (socket: $MPV_IPC_SOCKET)."
  else
    echo "❌ Failed to start mpv daemon; check /tmp/mpv_music_daemon.log"
  fi
}

_play_with_mpv() {
  # internal: play list of files (args)
  _require mpv socat
  local files=("$@")
  if [ ${#files[@]} -eq 0 ]; then log "No files to play."; return 1; fi

  if [ -S "$MPV_IPC_SOCKET" ]; then
    # try to load files via IPC; if any append fails, fallback to direct spawn
    if ! printf '{"command":["playlist-clear"]}\n' | socat - "$MPV_IPC_SOCKET" >/dev/null 2>&1; then
      log "⚠️  IPC playlist-clear failed; falling back to direct mpv."
      nohup mpv --no-video --audio-display=no --player-operation-mode=pseudo-gui --shuffle -- "${files[@]}" >/dev/null 2>&1 & disown
      return 0
    fi

    for f in "${files[@]}"; do
      local esc
      esc=$(printf '%s' "$f" | sed 's/\\/\\\\/g; s/"/\\"/g')
      if ! printf '{"command":["loadfile","%s","append-play"]}\n' "$esc" | socat - "$MPV_IPC_SOCKET" >/dev/null 2>&1; then
        log "⚠️  IPC loadfile failed for $f; falling back to direct mpv."
        nohup mpv --no-video --audio-display=no --player-operation-mode=pseudo-gui --shuffle -- "${files[@]}" >/dev/null 2>&1 & disown
        return 0
      fi
    done

    # unpause playback (safe)
    printf '{"command":["set_property","pause",false]}\n' | socat - "$MPV_IPC_SOCKET" >/dev/null 2>&1 || true
    log "Playing ${#files[@]} tracks via mpv daemon."
  else
    # fallback: spawn mpv in background with no video so audio reliably plays on macOS
    log "Playing ${#files[@]} tracks (mpv spawned in background)..."
    nohup mpv --no-video --audio-display=no --player-operation-mode=pseudo-gui --shuffle -- "${files[@]}" >/dev/null 2>&1 & disown
  fi
}

controls_cmd() {
  _require socat
  local cmd="${1:-}"
  [ -n "$cmd" ] || { echo "Usage: music controls <play|pause|stop|next|prev|volup|voldown|status>"; return 1; }

  if [ ! -S "$MPV_IPC_SOCKET" ]; then
    echo "❌ mpv IPC socket not found. Start daemon with: music daemon"
    return 1
  fi

  case "$cmd" in
    play) printf '{"command":["set_property","pause",false]}\n' | socat - "$MPV_IPC_SOCKET" ;;
    pause) printf '{"command":["set_property","pause",true]}\n' | socat - "$MPV_IPC_SOCKET" ;;
    stop) printf '{"command":["stop"]}\n' | socat - "$MPV_IPC_SOCKET" ;;
    next) printf '{"command":["playlist-next"]}\n' | socat - "$MPV_IPC_SOCKET" ;;
    prev) printf '{"command":["playlist-prev"]}\n' | socat - "$MPV_IPC_SOCKET" ;;
    volup) printf '{"command":["osd-msg","add","volume",5]}\n' | socat - "$MPV_IPC_SOCKET" ;;
    voldown) printf '{"command":["osd-msg","add","volume",-5]}\n' | socat - "$MPV_IPC_SOCKET" ;;
    status) printf '{"command":["get_property","pause"]}\n' | socat - "$MPV_IPC_SOCKET" ;;
    *) echo "Unknown control: $cmd"; return 2 ;;
  esac
}

