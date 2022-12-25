import fs from "fs"
import { NextApiHandler, NextApiResponse } from "next"
import { execa } from "execa"
import path from "path"

if (!fs.existsSync(path.resolve("bin/yt-dlp"))) {
  throw new Error("yt-dlp not found")
}

const sendError = (res: NextApiResponse, msg: string) => {
  res.status(500).send({
    error: msg,
  })
}

const handler: NextApiHandler = async (req, res) => {
  const url = req.query.url as string | undefined

  if (!url) {
    return sendError(res, "missing url")
  }

  const parsedUrl = new URL(url)

  const ps = await execa(path.resolve("bin/yt-dlp"), [
    parsedUrl.href,
    "--dump-json",
    "--no-check-certificates",
    "--no-warnings",
  ])

  if (ps.failed) {
    return sendError(res, ps.stderr || "error")
  }

  res.json({
    data: {
      videos: ps.stdout.split("\n").map((str: string) => JSON.parse(str).url),
    },
  })
}

export default handler
