export function toFile(id: string, parts: number, quorum: number, encrypted: string[]) {
  return '' +
  `----\n` +
  `Shamir Key File\n` +
  `Id: ${id}\n` +
  `Parts: ${parts}\n` +
  `Quorum: ${quorum}\n` +
  `\n` +
  `${encrypted.map((p, i) => `${i + 1}: ${p}`).join('\n\n')}\n` +
  `----\n`
}

export function fromFile(keyFile: string) {
  const keys = []
  const lines = keyFile.split('\n').map(l => l.trim())
  if (lines[0] !== '----') return {}
  if (lines[1] !== 'Shamir Key File') return {}

  const ln2 = lines[2].split(':')
  const ln3 = lines[3].split(':')
  const ln4 = lines[4].split(':')
  if (ln2.length !== 2 && ln2[0] !== 'Id') throw new Error('Invalid key file: missing Id declaration')
  if (ln3.length !== 2 && ln3[0] !== 'Parts') throw new Error('Invalid key file: missing Parts declaration')
  if (ln4.length !== 2 && ln4[0] !== 'Quorum') throw new Error('Invalid key file: missing Quorum declaration')

  const id = ln2[1]
  const parts = parseInt(ln3[1])
  const quorum = parseInt(ln4[1])
  if (!id) throw new Error('Invalid key file: Id not found')
  if (parts < 1) throw new Error('Invalid key file: Invalid Parts value must be greater than 0')
  if (quorum < 1 || quorum > parts) throw new Error('Invalid key file: Invalid Quorum must be greater than 0 and less than or equal to Parts')
  
  const offset = 5
  for (let i = 0; i < parts; i++) {
    if (lines[(i * 2) + offset] === '----') break
    if (lines[(i * 2) + offset] !== '') throw new Error(`Invalid key file: unexpected key value ${lines[(i * 2) + offset]}`)

    const ln = lines[(i * 2) + offset + 1].split(':')
    if (ln.length !== 2) throw new Error(`Invalid key file: unexpected key value ${lines[(i * 2) + offset + 1]}`)
    
    const p = parseInt(ln[0])
    if (p < 1) throw new Error(`Invalid key file: Invalid part number ${ln[0]}`)
    keys[p - 1] = ln[1]
  }
  return { id, parts, quorum, keys }
}