import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="w-full px-2 py-1 bg-gruvbox-bg1 hover:bg-gruvbox-gray relative before:content-['['] after:content-[']']"
    />
  );
}
