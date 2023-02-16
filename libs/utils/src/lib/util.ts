export function extractionUniqueConstrainErrorPrismaMessage(message: string) {
  return `Unique constraint failed on the fields: ${message
    .split('Unique constraint failed on the fields')[1]
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()}`;
}

export function removeDuplicate(data, key) {
  return [...new Map(data.map((x) => [key(x), x])).values()];
}

export function removeDuplicateArray(array) {
  return [...new Set(array)];
}

export function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
