function cleanInput(input: String) {
  return input
    .replace(/[|&!<>]+/g, '')
    .replace(/ /g, '|')
    .replace("'", "''");
}

export { cleanInput };
