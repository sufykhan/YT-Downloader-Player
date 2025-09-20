# index.sh - build and query index

index_cmd() {
  _require find sort
  log "Rebuilding index at $INDEX_FILE ..."
  tmp="$(mktemp)"
  find "$BASE_DIR" -type f -iname '*.mp3' -print0 |
    while IFS= read -r -d '' f; do printf '%s\n' "$f"; done | LC_ALL=C sort > "$tmp" || true
  mv "$tmp" "$INDEX_FILE"
  log "Indexed $(wc -l < "$INDEX_FILE" 2>/dev/null || echo 0) tracks."
}

# helper: ensure index exists
ensure_index() {
  [ -f "$INDEX_FILE" ] || index_cmd
}
