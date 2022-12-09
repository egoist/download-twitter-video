import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import GithubCorner from "react-github-corner"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"

export default function Page() {
  const router = useRouter()
  const { register, handleSubmit, formState, setValue } = useForm({
    defaultValues: {
      url: "",
    },
  })
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{ video?: string } | null>(null)
  const onSubmit = handleSubmit(async (values) => {
    router.push({ query: { ...router.query, url: values.url } })
    const res = await fetch(
      `/api/twitter?${new URLSearchParams({ url: values.url }).toString()}`
    )
    const { error, data } = await res.json()
    setError(error || null)
    setData(data)
  })

  const useSample = () => {
    setValue(
      "url",
      "https://twitter.com/mischiefanimals/status/1600947154193117184"
    )
    onSubmit()
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const url = query.get("url")
    if (url) {
      setValue("url", url)
      onSubmit()
    }
  }, [])

  return (
    <>
      <NextSeo
        title="Download Twitter Video"
        description="The easiest way to download any Twitter video, just enter the Tweet URL!"
        openGraph={{
          images: [
            {
              url: "https://download-twitter-video.egoist.dev/og.png",
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <div className="max-w-xl mx-auto p-5 py-20">
        <header className="text-center">
          <h1 className="text-5xl font-bold">Download Twitter Video</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Enter a Tweet URL to download the video in it.
          </p>
        </header>
        <form onSubmit={onSubmit} className="my-10">
          <div className="flex space-x-2">
            <input
              placeholder="Type URL here..."
              className="w-full outline-none rounded-xl h-12 px-3 bg-zinc-200 focus:ring-2 ring-indigo-400 ring-offset-2"
              {...register("url")}
            />
            <button
              className="shrink-0 px-5 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white focus:ring-2 ring-indigo-400 ring-offset-2 inline-flex items-center disabled:opacity-50"
              type="submit"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? "Loading..." : "Go"}
            </button>
          </div>
          <div className="text-center text-sm mt-2">
            <button
              type="button"
              onClick={useSample}
              className="text-blue-600 hover:underline"
            >
              Sample
            </button>
          </div>
        </form>
        {data && (
          <div>
            {data.video ? (
              <>
                <video controls className="w-full max-h-[500px] bg-black">
                  <source src={data.video}></source>
                </video>
              </>
            ) : (
              <div className="text-orange-500 text-center">
                No video found in this tweet
              </div>
            )}
          </div>
        )}
        {error && <div className="text-red-500 text-center">{error}</div>}
        <footer className="py-20 text-center text-zinc-500 text-sm">
          &copy; 2022{" "}
          <a
            href="https://github.com/sponsors/egoist"
            target="_blank"
            rel="nofollow noopenner"
            className=" text-blue-600 hover:underline"
          >
            EGOIST
          </a>
        </footer>

        <GithubCorner href="https://github.com/egoit/download-twitter-video" />
      </div>
    </>
  )
}
