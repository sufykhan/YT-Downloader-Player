# utils.sh - small helpers

_require() {
  local miss=()
  for cmd in "$@"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      miss+=("$cmd")
    fi
  done
  if [ ${#miss[@]} -ne 0 ]; then
    echo "❌ Missing commands: ${miss[*]}"
    echo "Install: brew install ${miss[*]} (macOS) or apt/pacman on Linux"
    return 1
  fi
  return 0
}

log() { printf '» %s\n' "$*"; }

# portable read-null-to-array
_read_null_array() {
  local __arr="$1"; shift
  local -a tmp=()
  while IFS= read -r -d '' f; do tmp+=("$f"); done
  # export to caller-named variable
  eval "$__arr=(\"\${tmp[@]}\")"
}
