import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-black text-gruvbox-purple">404</h1>
          <h2>Asi tu fakt nic není {":-("}</h2>
          <a href="/" className="text-gruvbox-aqua">Domů PLS</a>
        </div>
      </div>
    </>
  );
}
