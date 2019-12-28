import React, { useState } from "react"
import dynamic from "next/dynamic"

const Page  = dynamic({
  loader: import("../components/page"),
  ssr: false
})

const Encrypt = dynamic({
  loader: import("../components/encrypt"),
  ssr: false
})

export default function () {
  return (
    <Page title={"Encrypt A Secret"}>
      <Encrypt />
    </Page>
  )
}
