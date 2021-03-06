export function buildXprvFile(masterKey, birthDate, name, description) {
  return `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({
      master_key: masterKey,
      birth_date: birthDate || 0,
      name: name || '',
      description: description || '',
    }),
  )}`
}
