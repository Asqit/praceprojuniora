// ──────────────────────────────────────────────────────────┐
// ┌─┐┬─┐┌─┐┌─┐┌─┐┌─┐┬─┐┌─┐ ┬┬ ┬┌┐┌┬┌─┐┬─┐┌─┐
// ├─┘├┬┘├─┤│  ├┤ ├─┘├┬┘│ │ ││ ││││││ │├┬┘├─┤
// ┴  ┴└─┴ ┴└─┘└─┘┴  ┴└─└─┘└┘└─┘┘└┘┴└─┘┴└─┴ ┴
// 14.3.2026, Ondřej Tuček (asqit * ondrejtucek9@gmail.com)
// ──────────────────────────────────────────────────────────┐
import { Application } from "./application";

async function signalInterceptor(callback: Function) {
  const signals = ["SIGINT", "SIGTERM", "SIGUSR2"];
  return new Promise((resolve) => {
    for (const signal of signals) {
      process.on(signal, () => {
        console.log(`received close signal`);
        resolve(callback());
      });
    }
  });
}

async function main() {
  try {
    const app = new Application();
    await app.init();
    app.listen();
    await signalInterceptor(() => app.close());
  } catch (exception) {
    console.error(exception);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
