import fs from "fs"
import fetch from "node-fetch"

fetch(
  process.platform === "darwin"
    ? "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos"
    : "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux"
).then((res) => {
  fs.mkdirSync("bin", { recursive: true })
  res.body.pipe(
    fs.createWriteStream("bin/yt-dlp", {
      // make this file executable
      mode: 0o755,
    })
  )
})
