import Link from "next/link"
import { Check } from "lucide-react"

export default function CvIntroPage() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              Před prvním CV
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Recruiter se dívá
              <br />
              na tvoje CV{" "}
              <span className="text-primary underline decoration-secondary decoration-4 underline-offset-4">
                6 sekund
              </span>
              .
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Ukážeme ti přesně, co si v těch 6 sekundách přečte — a jak to
              udělat tak, aby tě to nestálo pozvánku na pohovor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cv/builder"
                className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Vytvořit CV zadarmo
              </Link>
              <a
                href="#proc"
                className="rounded-full border border-border px-6 py-3 font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                Proč vlastně CV?
              </a>
            </div>
          </div>

          {/* Signature element: scanning CV mockup */}
          <ScanMock />
        </div>
      </section>

      {/* WHAT IS A CV / WHY IT MATTERS */}
      <section id="proc" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black sm:text-3xl">
            CV není formalita. Je to tvoje vizitka, filtr a otvírák dveří.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <InfoCard
              title="Vizitka"
              text="První dojem dřív, než tě kdokoliv potká. Řekne, kdo jsi a co umíš, aniž bys byl v místnosti."
            />
            <InfoCard
              title="Filtr"
              text="Firmy dostávají desítky CV na jednu juniorskou pozici. CV rozhoduje, jestli postoupíš dál, nebo skončíš v koši."
            />
            <InfoCard
              title="Otvírák dveří"
              text="Dobré CV neukazuje roky praxe, které nemáš — ukazuje, že víš, co dělat s tím, co už umíš."
            />
          </div>
        </div>
      </section>

      {/* WHAT COMPANIES SCAN FOR */}
      <section className="bg-muted/40 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black sm:text-3xl">
            Co si firmy hlídají jako první
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Recruiter neanalyzuje CV, on ho skenuje. Tohle jsou body, kterých se
            dotkne oko jako první — a kde se nejčastěji rozhoduje.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Jméno a kontakt hned nahoře, ne schované v patičce",
              "Tech stack viditelný do 5 sekund, ne v souvislé větě",
              "Datumy praxe a školy (od–do), i u brigád a projektů",
              "Žádné překlepy a divné e-maily typu xxx_gamer99",
              "PDF, ne screenshot z Wordu nebo foto z mobilu",
              "Jedna stránka — juniorům nikdo nevěří dvoustránkový životopis",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground">
          <h2 className="text-2xl font-black sm:text-3xl">
            Layout vyřešíme my. Ty jen vyplň, co umíš.
          </h2>
          <p className="max-w-md text-primary-foreground/80">
            Zdarma, bez registrace, hotové CV ke stažení během pár minut.
          </p>
          <Link
            href="/cv/builder"
            className="rounded-full bg-background px-6 py-3 font-semibold text-primary transition hover:bg-background/90"
          >
            Vytvořit si CV
          </Link>
        </div>
      </section>
    </div>
  )
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border p-6 transition hover:border-primary/40">
      <h3 className="font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

/**
 * Signature element: a mock CV card with a scan-beam sweeping down it,
 * lighting up each region (contact / stack / experience / education)
 * with a checkmark as it passes — visualizing the "6 second scan".
 * Pure CSS animation, no JS/client component needed.
 */
function ScanMock() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-xl">
        <ScanRow label="Jan Novák · jan@email.cz" delay="0s" />
        <ScanRow label="React · TypeScript · Node.js" delay="0.9s" />
        <ScanRow label="Junior Developer · 2023–2024" delay="1.8s" />
        <ScanRow label="Bc. ČVUT · Informatika" delay="2.7s" />
        <div className="scan-beam absolute inset-x-0 h-16 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0" />
      </div>
      <style>{`
        .scan-beam {
          top: -4rem;
          animation: sweep 3.6s ease-in-out infinite;
        }
        @keyframes sweep {
          0% { transform: translateY(0); }
          100% { transform: translateY(280px); }
        }
        .scan-check {
          opacity: 0;
          animation: pop 3.6s ease-in-out infinite;
        }
        @keyframes pop {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          8%, 18% { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .scan-beam, .scan-check { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function ScanRow({ label, delay }: { label: string; delay: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground">
      <span>{label}</span>
      <span
        className="scan-check flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"
        style={{ animationDelay: delay }}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    </div>
  )
}
