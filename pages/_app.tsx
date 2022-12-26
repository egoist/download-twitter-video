import { AppProps } from "next/app"
import { Analytics } from "@vercel/analytics/react"
import "../css/tailwind.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NODE_ENV === "production" && <Analytics />}
    </>
  )
}

export default MyApp
