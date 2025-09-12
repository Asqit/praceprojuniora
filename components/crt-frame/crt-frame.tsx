import { asset } from "$fresh/runtime.ts";

export function CRTFrame() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[1001] pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
        <defs>
          <filter id="crtWarp">
            <feTurbulence baseFrequency="0.05" numOctaves="3" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="60" />
          </filter>
        </defs>
      </svg>

      <div class="crt-frame w-full h-screen relative inline-block rounded-[40px] border-[6px] border-[#111] overflow-scroll shadow-[0_0_30px_rgba(0,0,0,0.6),inset_0_0_40px_rgba(0,0,0,0.8)]">
        <img
          src={asset("scanlines.webp")}
          className="absolute top-0 left-0 w-full h-full z-[1000] opacity-20  pointer-events-none"
        />
        <div class="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
      </div>
    </div>
  );
}
