import React from 'react'
import { useState } from 'react'
import { Page, Button, Textarea, Form, useOperationalContext, DeleteIcon, Input } from '@operational/components'
import { join } from 'shamir'
import { handle } from '../util/handle'
import { fromFile } from '../util/keyFile'

export default function Decrypt() {

  const [parts, setParts] = useState(['', ''])
  const [decrypted, setDecrypted] = useState('')
  const { pushMessage } = useOperationalContext()

  function decrypt() {
    try {
      const cleanedParts = parts.map(p => p?.trim())

      if (cleanedParts.length) {
        const decodedParts = cleanedParts.reduce((acc, p, i) => p ? ({ ...acc, [i + 1]: Buffer.from(p, 'base64') }) : acc, {})
        const recovered = join(decodedParts)
        setDecrypted(Buffer.from(recovered).toString('utf8'))
      }
    } catch (err) {
      pushMessage({ type: 'error', body: err.message })
    }
  }

  function download() {
    if (!decrypted) return;
    const blob = new Blob([ decrypted ], { type: "octent/stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a') as any
    a.style = 'display: none'
    a.href = url
    a.download = `secret.txt`
    document.body.appendChild(a)

    a.click()
    URL.revokeObjectURL(url)
  }

  function copy() {
    navigator.clipboard.writeText(decrypted)
    pushMessage({ type: 'info', body: "Secret copied to clipboard." })
  }

  function paste(event: any, offset: number) {
    try {
      const pasted = event.clipboardData.getData('Text') || ''
      const { parts: parsedParts, keys: parsedKeys } = fromFile(pasted.trim())
      if (parsedParts && parsedKeys) {
        for (let i = 0; i < parsedParts; i++) {
          const p = parsedKeys[i]
          if (p) parts[i] = p
          if (!parts[i]) parts[i] = ''
        }
        setParts([...parts])
      } else {
        const pastedParts = pasted
          .split('\n')
          .map(p => (p || '').trim())
        parts.splice(offset, pastedParts.length, ...pastedParts)
        setParts([...parts])
      }
    } catch (err) {
      pushMessage({ type: 'error', body: err.message })
    }
  }

  function add() {
    setParts([...parts, ''])
  }

  return (
    <div>
      <Form onSubmit={handle}>
        {parts.map((p, i) => (
          <>
            <Input
              key={`part-${i}`}
              label={`Part ${i + 1}`}
              value={p}
              placeholder={`paste key ${i + 1} here...`}
              clear={() => {
                parts[i] = ''
                setParts([...parts])
              }}
              onPaste={(event: any) => {
                handle(event)
                paste(event, i)
              }}
              onChange={val => {
                parts[i] = val.trim()
                setParts([...parts])
              }}
              statusIcon={parts.length > 1 ? (
                <DeleteIcon
                  size={24}
                  onClick={() => {
                    parts.splice(i, 1)
                    setParts([...parts])
                  }}
                />
              ) : undefined}
            />
          </>
        ))}
        <Button onClick={decrypt}>Decrypt</Button>
        <Button onClick={add}>Add Key</Button>
      </Form>
      <br/>
      {decrypted && (
        <div>
          <h2>Decrypted</h2>
          <p>This is the content derived from the parts available</p>
          <Textarea disabled value={decrypted} />
          <br/>
          <Button onClick={copy}>Copy Secret</Button>
          <Button onClick={download}>Download Secret</Button>
        </div>
      )}
    </div>
  )
}
