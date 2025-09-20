#!/usr/bin/env bash
# play_helper.sh: send files to mpv daemon or spawn mpv directly
SOCK="${XDG_RUNTIME_DIR:-/tmp}/music_manager/mpv.sock"

play_files() {
  local files=("$@")
  if [ ${#files[@]} -eq 0 ]; then
    echo "No files passed"
    return 1
  fi

  # Try IPC if socket exists and is connectable
  if [ -S "$SOCK" ]; then
    for f in "${files[@]}"; do
      # attempt to append via socat
      if ! printf '{"command":["loadfile","%s","append-play"]}\n' "$(printf '%s' "$f" | sed 's/["\\]/\\&/g')" | socat - "$SOCK" >/dev/null 2>&1; then
        # IPC failed: fallback to direct spawn
        nohup mpv --no-video --audio-display=no --player-operation-mode=pseudo-gui --shuffle -- "${files[@]}" >/dev/null 2>&1 & disown
        return 0
      fi
    done
    # unpause
    printf '{"command":["set_property","pause",false]}\n' | socat - "$SOCK" >/dev/null 2>&1 || true
    echo "Sent ${#files[@]} files to mpv daemon."
    return 0
  fi

  # No socket: spawn mpv directly
  nohup mpv --no-video --audio-display=no --player-operation-mode=pseudo-gui --shuffle -- "${files[@]}" >/dev/null 2>&1 & disown
  echo "Spawned mpv directly for ${#files[@]} files."
  return 0
}
# If script executed directly: play arguments
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  play_files "$@"
fi
