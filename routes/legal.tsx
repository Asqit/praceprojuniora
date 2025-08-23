import { Footer } from "../components/footer/footer.tsx";
import { Navbar } from "../components/navbar/navbar.tsx";

export default function LegalPage() {
  return (
    <>
      <head>
        <title>Právní informace - Práce Pro Juniora</title>
        <meta
          name="description"
          content="Ochrana osobních údajů, podmínky použití a právní informace pro Práce Pro Juniora - agregátor juniorních IT pozic."
        />
      </head>
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Právní informace</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Ochrana osobních údajů
          </h2>
          <div className="prose prose-lg">
            <p>
              Naše webová stránka sbírá pouze anonymní statistiky kliknutí na
              pracovní nabídky za účelem měření popularity jednotlivých pozic.
              Nesbíráme ani neukládáme žádné osobní údaje uživatelů.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">Co sbíráme:</h3>
            <ul>
              <li>Počet kliknutí na jednotlivé pracovní nabídky</li>
              <li>Čas posledního kliknutí na nabídku</li>
              <li>Anonymní statistiky návštěvnosti (Umami Analytics)</li>
            </ul>
            <h3 className="text-xl font-medium mt-6 mb-3">Webová analytika:</h3>
            <p>
              Používáme vlastní instanci Umami Analytics pro sběr anonymních
              statistik návštěvnosti. Umami nesbirá osobní údaje, nepoužívá
              cookies a je v souladu s GDPR.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">Lokální úložiště:</h3>
            <p>
              Umožňujeme uživatelům ukládat si pracovní nabídky do localStorage
              jejich prohlížeče pro osobní použití. Tato data zůstávají pouze ve
              vašem zařízení a nejsou nám přístupná.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">Co nesbíráme:</h3>
            <ul>
              <li>IP adresy uživatelů</li>
              <li>Cookies nebo session data</li>
              <li>Osobní identifikační údaje</li>
              <li>Sledování chování napříč relacemi</li>
              <li>Data z localStorage uživatelů</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Podmínky použití</h2>
          <div className="prose prose-lg">
            <p>
              Tato služba agreguje veřejně dostupné pracovní nabídky z jobs.cz a
              dalších zdrojů. Všechny nabídky jsou vlastnictvím původních
              inzerentů.
            </p>
            <p>
              Při implementaci automatického sběru dat jsme zkontrolovali
              robots.txt a podmínky použití zdrojových webů (naposledy ověřeno:
              23.8.2025), kde jsme nezaznamenali explicitní zákaz webového
              scrapingu veřejně dostupných informací.
            </p>
            <h3 className="text-xl font-medium mt-6 mb-3">
              Příspěvky třetích stran
            </h3>
            <p>
              Umožňujeme recruitérům a zaměstnavatelům přidávat vlastní pracovní
              nabídky. Za obsah těchto příspěvků neseme odpovědnost pouze v
              rozsahu stanoveném zákonem. Vyhrazujeme si právo odstranit
              nevhodný obsah.
            </p>
            <p>
              Přidáváním nabídky potvrzujete, že máte právo ji zveřejnit a že
              neobsahuje nepravdivé nebo zavádějící informace.
            </p>
            <p>
              Služba je poskytována "jak je" bez jakýchkoliv záruk. Neneseme
              odpovědnost za přesnost nebo aktuálnost zobrazených informací.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
          <div className="prose prose-lg">
            <p>
              Pro dotazy ohledně těchto právních informací nás kontaktujte na:
            </p>
            <p>
              <a
                href="mailto:ondrejtucek9@gmail.com"
                className="text-gruvbox-aqua underline"
              >
                ondrejtucek9@gmail.com
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
