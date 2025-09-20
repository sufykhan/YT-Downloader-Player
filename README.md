# 🎵 YT-Downloader-Player (music\_manager)

A modular terminal-based YouTube playlist **downloader + MP3 player** with fuzzy search, TUI, and `mpv` controls.

---

## 📂 Project Structure

* `bin/music` → single entrypoint script
* `lib/` → supporting modules (`player.sh`, `ui.sh`, etc.)

---

## ⚙️ Setup

1. **Alias** in `~/.zshrc`:

   ```zsh
   alias music="~/scripts/music_manager/bin/music"
   ```

2. **Install requirements** (macOS with Homebrew):

   ```bash
   brew install yt-dlp mpv fzf socat gum
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
alias mcurrent='printf "{\"command\":[\"get_property\",\"media-title\"]}\n" | socat - "${XDG_RUNTIME_DIR:-/tmp}/music_manager/mpv.sock" | jq -r ".data"'
```

