export function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`using delay of ${delay}`);
  return new Promise((resolve) => setTimeout(resolve, delay));
}
