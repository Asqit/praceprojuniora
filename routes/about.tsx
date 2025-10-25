import { Handlers, PageProps } from "$fresh/server.ts";
import { CONTACT_EMAIL } from "../lib/server-variables.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render({ contactEmail: CONTACT_EMAIL });
  },
};

export default function About({ data }: PageProps<{ contactEmail: string }>) {
  const email = data.contactEmail && data.contactEmail !== "contact@example.com"
    ? data.contactEmail
    : "BADVAR";
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-balance">O nás</h1>
            <div className="h-1 w-20 bg-green-500 mb-6"></div>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">Naše mise</h2>
            <p className="text-foreground leading-relaxed">
              Věříme, že začátky v IT nemusí být těžké. Cílem projektu{" "}
              <strong>Práce pro Juniora</strong>{" "}
              je usnadnit vstup do světa technologií všem, kteří právě dokončili
              studium, mění kariéru nebo se prostě chtějí posunout dál.
            </p>
            <p className="text-foreground leading-relaxed">
              Naše platforma pomáhá juniorním vývojářům, testerům, designérům a
              dalším IT talentům najít první pracovní příležitost. Agregujeme
              veřejně dostupné nabídky z ověřených zdrojů a přehledně je
              zobrazujeme na jednom místě – bez reklam, registrace nebo
              zbytečných cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">Co děláme</h2>
            <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
              <p className="text-foreground">
                • Propojujeme juniory s jejich prvními pracovními příležitostmi
              </p>
              <p className="text-foreground">
                • Sbíráme kvalitní pracovní nabídky z ověřených zdrojů (např.
                jobs.cz)
              </p>
              <p className="text-foreground">
                • Zobrazujeme nabídky přehledně a bez sledování uživatelů
              </p>
              <p className="text-foreground">
                • Nabízíme jednoduché nástroje pro ukládání oblíbených nabídek a
                sledování pokroku
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">Na čem stavíme</h2>
            <p className="text-foreground leading-relaxed">
              Projekt běží kompletně na{" "}
              <strong>Deno suite</strong>, což nám umožňuje psát čistý, bezpečný
              a výkonný kód bez závislosti na externích build nástrojích.
              Frontend i API jsou postavené na{" "}
              <strong>Fresh.js</strong>, což zaručuje rychlé načítání a moderní
              vývojový přístup založený na ostrovní architektuře.
            </p>
            <p className="text-foreground leading-relaxed">
              O plánované úlohy se stará <strong>Deno.cron</strong>{" "}
              a ukládání dat řešíme pomocí{" "}
              <strong>Deno.KV</strong>, které nám poskytuje spolehlivý a
              jednoduchý key–value storage. Pro scraping pracovních nabídek
              využíváme kombinaci knihoven <strong>KY</strong> a{" "}
              <strong>Cheerio</strong>, které nám pomáhají efektivně a šetrně
              zpracovávat veřejně dostupné informace.
            </p>
            <p className="text-foreground leading-relaxed">
              Celý ekosystém běží bez tradičního backend serveru – plně využívá
              sílu Deno runtime a jeho nativní bezpečnostní sandbox, což znamená
              minimální údržbu a maximální stabilitu. Zdrojový kód:{" "}
              <a
                href="https://github.com/asqit/praceprojuniora"
                class="text-green-500 hover:underline"
                target="_blank"
              >
                github.com/asqit/praceprojuniora
              </a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">
              Proč si vybrat nás
            </h2>
            <p className="text-foreground leading-relaxed">
              Na rozdíl od velkých pracovních portálů jsme zaměření čistě na
              {" "}
              <strong>juniorní IT pozice</strong>. Nepotřebujeme vaše osobní
              údaje, neukládáme cookies a všechna data zůstávají pouze ve vašem
              prohlížeči. Váš komfort a soukromí jsou pro nás prioritou.
            </p>
            <p className="text-foreground leading-relaxed">
              Platforma je tvořena nezávislým vývojářem a postupně se vyvíjí s
              cílem přinášet přehledné, rychlé a přístupné prostředí pro všechny
              začínající profesionály. Jsme otevření zpětné vazbě a návrhům na
              vylepšení.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">
              Kontaktujte nás
            </h2>
            <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
              <p className="text-foreground mb-2">
                Email:{" "}
                <a
                  href={`mailto:${email}`}
                  className="underline text-green-500"
                >
                  {email}
                </a>
              </p>
            </div>
          </section>

          {
            /*
            <div className="pt-8">
              <p className="text-sm text-muted-foreground">
                Poslední aktualizace: 8. ledna 2025
              </p>
            </div>
            */
          }
        </div>
      </main>
    </div>
  );
}
