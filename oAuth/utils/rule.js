exports.wordRule = (word) => {
  const patt = /^[a-z0-9İÖöşŞğĞıüÜçÇ\s]+$/i;
  const result = word.match(patt)
  return result
}