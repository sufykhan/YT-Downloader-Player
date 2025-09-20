# music_manager - modular script
bin/music is the single executable. Source files live in lib/.
Add alias in ~/.zshrc:
  alias music="~/scripts/music_manager/bin/music"
Install requirements:
  brew install yt-dlp mpv fzf socat gum
Init index:
  music index
Start daemon (optional for controls):
  music daemon
Usage:
  music dl <URL> [FolderName]
  music play
  music random 3
  music tui
# YT-Downloader-Player
# YT-Downloader-Player
# YT-Downloader-Player
