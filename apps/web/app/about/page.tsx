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
              Projekt běží kompletně na <strong>Deno suite</strong>, což nám
              umožňuje psát čistý, bezpečný a výkonný kód bez závislosti na
              externích build nástrojích. Frontend i API jsou postavené na{" "}
              <strong>Fresh.js</strong>, což zaručuje rychlé načítání a moderní
              vývojový přístup založený na ostrovní architektuře.
            </p>
            <p className="leading-relaxed text-foreground">
              O plánované úlohy se stará <strong>Deno.cron</strong> a ukládání
              dat řešíme pomocí <strong>Deno.KV</strong>, které nám poskytuje
              spolehlivý a jednoduchý key–value storage. Pro scraping pracovních
              nabídek využíváme kombinaci knihoven <strong>KY</strong> a{" "}
              <strong>Cheerio</strong>, které nám pomáhají efektivně a šetrně
              zpracovávat veřejně dostupné informace.
            </p>
            <p className="leading-relaxed text-foreground">
              Celý ekosystém běží bez tradičního backend serveru – plně využívá
              sílu Deno runtime a jeho nativní bezpečnostní sandbox, což znamená
              minimální údržbu a maximální stabilitu. Zdrojový kód:{" "}
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
                  href={`mailto:${"badvar"}`}
                  className="text-primary underline"
                >
                  {"badvar"}
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
