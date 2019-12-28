import React, { useState } from "react"
import { randomBytes } from "crypto"
import { split } from "shamir"
import { Input, Textarea, Button, Table, useOperationalContext, Form } from "@operational/components"
import { handle } from "../util/handle"
import { toFile } from "../util/keyFile"

export default function Encrypt() {
  
  const [parts, setParts] = useState(3)
  const [quorum, setQuorum] = useState(2)
  const [value, setValue] = useState('')
  const [encrypted, setEncrypted] = useState(null)
  const { pushMessage } = useOperationalContext()

  function encrypt() {
    try {
      const secretBytes = new Uint8Array(Buffer.from(value))
      const encryptedParts = split(randomBytes, parts, quorum, secretBytes)
      const encodedParts = Object.values(encryptedParts).map((p: Uint8Array) => Buffer.from(p).toString('base64'))
      setEncrypted(encodedParts)
    } catch (err) {
      pushMessage({ type: 'error', body: err.message })
    }
  }

  function download() {
    if (!encrypted) return;
    const content = encrypted.join('\n\n')
    const blob = new Blob([ content ], { type: "octent/stream" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a') as any
    a.style = 'display: none'
    a.href = url
    a.download = `keys.txt`
    document.body.appendChild(a)

    a.click()
    URL.revokeObjectURL(url)
  }

  function copy() {
    const content = toFile(parts, quorum, encrypted)
    navigator.clipboard.writeText(content)
    pushMessage({ type: 'info', body: "Keys copied to clipboard." })
  }

  return (
    <div>
      <Form spellCheck={false} onSubmit={handle}>
        <Input
          label="Parts"
          hint="The total number of keys to generate"
          value={`${parts}`} onChange={val => setParts(parseInt(val) || parts)}
        />
        <Input
          label="Quorum"
          hint="The minimum number of keys needed to decrypt this content"
          value={`${quorum}`} onChange={val => setQuorum(parseInt(val) || quorum)}
        />
        <Textarea
          label={"your secret"}
          code={true}
          value={value}
          onChange={setValue}
          onSubmit={encrypt}
        />
        <Button onClick={encrypt}>Encrypt</Button>
      </Form>
      <br/>
      {encrypted && (
        <div>
          <h2>Keys</h2>
          <p>
            Share each of these keys with different people. Anyone can decrypt this content with {quorum}/{parts} of these keys.
            Make sure you keep the index number with the key, the order of the keys is important. Only ${quorum} keys are needed
            but they must be in the right index to decrypt.
          </p>
          <Textarea disabled value={toFile(parts, quorum, encrypted)} />
          <br/>
          <Button onClick={copy}>Copy</Button>
          <Button onClick={download}>Download</Button>
        </div>
      )}
    </div>
  )
}
