export function toFile(parts: number, quorum: number, encrypted: string[]) {
  return '' +
  `----\n` +
  `Shamir Key File\n` +
  `Parts: ${parts}\n` +
  `Quorum: ${quorum}\n` +
  `\n` +
  `${encrypted.map((p, i) => `${i + 1}: ${p}`).join('\n\n')}\n` +
  `----\n`
}

export function fromFile(keyFile: string): string[] {
  const keys = []
  const lines = keyFile.split('\n').map(l => l.trim())
  if (lines[0] !== '----') return undefined
  if (lines[1] !== 'Shamir Key File') return undefined

  const ln2 = lines[2].split(':')
  const ln3 = lines[3].split(':')
  if (ln2.length !== 2 && ln2[0] !== 'Parts') throw new Error('Invalid key file: missing Parts declaration')
  if (ln3.length !== 2 && ln3[0] !== 'Quorum') throw new Error('Invalid key file: missing Quorum declaration')

  const parts = parseInt(ln2[1])
  const quorum = parseInt(ln2[1])
  if (parts < 1) throw new Error('Invalid key file: Invalid Parts value must be greater than 0')
  if (quorum < 1 || quorum > parts) throw new Error('Invalid key file: Invalid Quorum must be greater than 0 and less than or equal to Parts')
  
  for (let i = 0; i < parts; i++) {
    if (lines[(i * 2) + 4] === '----') break
    if (lines[(i * 2) + 4] !== '') throw new Error(`Invalid key file: unexpected key value ${lines[(i * 2) + 4]}`)

    const ln = lines[(i * 2) + 5].split(':')
    if (ln.length !== 2) throw new Error(`Invalid key file: unexpected key value ${lines[(i * 2) + 5]}`)
    
    const p = parseInt(ln[0])
    if (p < 1) throw new Error(`Invalid key file: Invalid part number ${ln[0]}`)
    keys[p - 1] = ln[1]
  }
  return keys
}