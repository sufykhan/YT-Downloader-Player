# 🎵 YT-Downloader-Player (music\_manager)

A modular terminal-based YouTube playlist **downloader + MP3 player** with fuzzy search, TUI, and `mpv` controls.

---

## 📂 Project Structure

* `bin/music` → single entrypoint script
* `lib/` → supporting modules (`player.sh`, `ui.sh`, etc.)

---

## ⚙️ Installation

1. **Clone repo** (or copy scripts into `~/scripts/music_manager/`).

2. **Make scripts executable**:

   ```bash
   chmod +x ~/scripts/music_manager/bin/music
   chmod +x ~/scripts/music_manager/lib/*.sh
   ```

3. **Add alias** to your `~/.zshrc`:

   ```zsh
   alias music="~/scripts/music_manager/bin/music"
   ```

   Reload shell:

   ```bash
   source ~/.zshrc
   ```

4. **Install requirements** (macOS with Homebrew):

   ```bash
   brew install yt-dlp mpv fzf socat gum jq
   ```

---

##  Usage

### Initialize

```bash
music index             # build the song index
music daemon            # start mpv daemon (needed for controls)
```

### Download

```bash
music dl <URL> [FolderName]   # download mp3(s) from YouTube / YouTube Music
```

### Play

```bash
music play                # fuzzy search tracks
music play <query>        # search + play directly
music random 3            # play 3 random tracks from a folder
music tui                 # interactive menu (gum/fzf)
```

### Controls

```bash
music controls play       # ▶️ play / resume
music controls pause      # ⏸️ pause
music controls stop       # ⏹️ stop
music controls next       # ⏭️ next track
music controls prev       # ⏮️ previous track
music controls volup      # 🔊 volume +5
music controls voldown    # 🔉 volume -5
music controls status     # show play/pause state
```

---

## ✨ Recommended Aliases

Add these to `~/.zshrc` for quick control:

```zsh
alias mplay='music controls play'
alias mpause='music controls pause'
alias mstop='music controls stop'
alias mnext='music controls next'
alias mprev='music controls prev'
alias mvolup='music controls volup'
alias mvoldn='music controls voldown'
alias mstatus='music controls status'
alias mcurrent='printf "{\"command\":[\"get_property\",\"media-title\"]}\n" | socat - \"${XDG_RUNTIME_DIR:-/tmp}/music_manager/mpv.sock\" | jq -r ".data"'
```

Reload your config:

```bash
source ~/.zshrc
```

---

## 🛠️ Troubleshooting

### 1. `Connection refused` when running controls

Cause: **stale socket** — mpv died but socket file still exists.
Fix:

```bash
pkill mpv
rm -f "${XDG_RUNTIME_DIR:-/tmp}/music_manager/mpv.sock"
music daemon
```

---

### 2. Nothing plays when running `music play <query>`

* Run `music index` first (index might be stale).
* If query matches only one file → it should auto-play.
* If multiple matches:

  * With **fzf**: select with `Tab`, confirm with `Enter`.
  * With **gum**: filter list, then press **Ctrl+D** to accept.

To force **fzf only** (ignore gum), temporarily rename gum or patch `ui.sh`.

---

### 3. zsh errors like `no matches found: (TAB to multi-select if using fzf)`

Cause: zsh is expanding parentheses.
Fix: run command with `noglob` or set `setopt nonomatch` in `.zshrc`.

---

### 4. Daemon doesn’t start / socket missing

Check mpv log:

```bash
tail -n 40 /tmp/mpv_music_daemon.log
```

If mpv not running, start manually:

```bash
nohup mpv --idle --no-terminal --input-ipc-server="${XDG_RUNTIME_DIR:-/tmp}/music_manager/mpv.sock" --volume=60 >/tmp/mpv_music_daemon.log 2>&1 & disown
```

---

### 5. Gum vs fzf confusion

* **fzf** → Tab to mark, Enter to confirm.
* **gum** → filter with typing, **Ctrl+D** to finish selection.
  If gum feels awkward, uninstall it or adjust `$PATH` so fzf is used by default.

---

### 6. Check what’s currently playing

```bash
music controls status
music controls next
mcurrent
```

---

✅ With these steps, you should be able to recover from any playback/control issue.
