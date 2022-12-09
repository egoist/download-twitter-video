import { AppProps } from "next/app"
import "../css/tailwind.css"

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
