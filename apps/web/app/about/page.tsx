export default function About() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="mb-4 text-3xl font-bold text-balance">O nás</h1>
            <div className="mb-6 h-1 w-20 bg-primary"></div>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Naše mise</h2>
            <p className="leading-relaxed text-foreground">
              Věříme, že začátky v IT nemusí být těžké. Cílem projektu{" "}
              <strong>Práce pro Juniora</strong> je usnadnit vstup do světa
              technologií všem, kteří právě dokončili studium, mění kariéru nebo
              se prostě chtějí posunout dál.
            </p>
            <p className="leading-relaxed text-foreground">
              Naše platforma pomáhá juniorním vývojářům, testerům, designérům a
              dalším IT talentům najít první pracovní příležitost. Agregujeme
              veřejně dostupné nabídky z ověřených zdrojů a přehledně je
              zobrazujeme na jednom místě – bez reklam, registrace nebo
              zbytečných cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Co děláme</h2>
            <div className="space-y-3 bg-card p-6">
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
            <h2 className="text-xl font-bold text-primary">Na čem stavíme</h2>
            <p className="leading-relaxed text-foreground">
              Projekt využívá <strong>Bun</strong> jako runtime pro API i
              scraper, což nám umožňuje psát výkonný TypeScript kód s nativní
              podporou bez složité konfigurace. API je postavené na{" "}
              <strong>Hono</strong> – minimalistickém a rychlém HTTP frameworku
              s validací přes <strong>Zod</strong>. Frontend využívá{" "}
              <strong>Next.js</strong> s Turbopackem a <strong>React 19</strong>
              , přičemž UI komponenty jsou postavené na{" "}
              <strong>shadcn/ui</strong> a stylované pomocí{" "}
              <strong>Tailwind CSS v4</strong>.
            </p>
            <p className="leading-relaxed text-foreground">
              O plánované úlohy se stará <strong>node-cron</strong> a ukládání
              dat řešíme pomocí <strong>DrizzleORM</strong> s{" "}
              <strong>libsql</strong> (Turso), které nám poskytuje spolehlivý
              SQLite-compatible storage. Pro scraping pracovních nabídek
              využíváme <strong>Cheerio</strong>, která nám pomáhá efektivně a
              šetrně zpracovávat veřejně dostupné informace.
            </p>
            <p className="leading-relaxed text-foreground">
              Na frontendu spravujeme stav a cachování dat pomocí{" "}
              <strong>TanStack Query</strong>, což zajišťuje plynulé načítání a
              aktualizaci dat. Zdrojový kód:{" "}
              <a
                href="https://github.com/asqit/praceprojuniora"
                className="text-primary hover:underline"
                target="_blank"
              >
                github.com/asqit/praceprojuniora
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary">
              Proč si vybrat nás
            </h2>
            <p className="leading-relaxed text-foreground">
              Na rozdíl od velkých pracovních portálů jsme zaměření čistě na{" "}
              <strong>juniorní IT pozice</strong>. Nepotřebujeme vaše osobní
              údaje, neukládáme cookies a všechna data zůstávají pouze ve vašem
              prohlížeči. Váš komfort a soukromí jsou pro nás prioritou.
            </p>
            <p className="leading-relaxed text-foreground">
              Platforma je tvořena nezávislým vývojářem a postupně se vyvíjí s
              cílem přinášet přehledné, rychlé a přístupné prostředí pro všechny
              začínající profesionály. Jsme otevření zpětné vazbě a návrhům na
              vylepšení.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Kontaktujte nás</h2>
            <div className="space-y-3 bg-card p-6">
              <p className="mb-2 text-foreground">
                Email:{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                  className="text-primary underline"
                >
                  {process.env.NEXT_PUBLIC_EMAIL ?? "N/A - Chyba"}
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
