import React from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

const Page  = dynamic({
  loader: import("../components/page"),
  ssr: false
})

const Decrypt  = dynamic({
  loader: import("../components/decrypt"),
  ssr: false
})

export default function () {
  return (
    <Page title="Decrypt">
      <Decrypt />
    </Page>
  )
}
