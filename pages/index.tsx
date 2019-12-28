import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"

const Page  = dynamic({
  loader: import("../components/page"),
  ssr: false
})

export default function Index() {
  return (
    <Page title={"Welcome"}>
      Create and use <a href="https://en.wikipedia.org/wiki/Shamir's_Secret_Sharing">Shamir's secret keys</a> to {' '}
      <Link href="/encrypt"><a>encrypt</a></Link> and {' '} 
      <Link href="/decrypt"><a>decrypt</a></Link> {' '}
      files.
    </Page>
  )
}
