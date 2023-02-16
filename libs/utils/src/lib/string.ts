import * as generatePassword from 'generate-password';

export function randomString(length: number) {
  return generatePassword.generate({
    length: length,
    numbers: true,
    excludeSimilarCharacters: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
    strict: true
  });
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUrl(url: string, data: Record<string, string> = {}): URL {
  const finalUrl = new URL(url);
  for (const property in data) {
    finalUrl.searchParams.append(property, data[property]);
  }
  return finalUrl;
}
