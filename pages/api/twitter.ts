import { NextApiHandler, NextApiResponse } from "next"
import { load } from "cheerio"

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

  if (parsedUrl.hostname !== "twitter.com") {
    return sendError(res, "not a twitter url")
  }

  parsedUrl.hostname = "vxtwitter.com"
  const response = await fetch(parsedUrl, {
    headers: {
      "User-Agent": "TelegramBot (like TwitterBot)",
    },
  })
  if (!response.ok) {
    return sendError(res, `failed to fetch tweet: ${response.status}`)
  }

  const html = await response.text()
  const $ = load(html)

  const getMetaContent = (name: string) => {
    const value =
      $(`meta[name="twitter:${name}"]`).attr("content") ||
      $(`meta[property="og:${name}"]`).attr("content")
    return value
  }

  const video = getMetaContent("video")

  res.json({
    data: {
      video,
    },
  })
}

export default handler
