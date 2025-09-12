import { asset } from "$fresh/runtime.ts";
import { Footer } from "../components/footer/footer.tsx";
import { Navbar } from "../components/navbar/navbar.tsx";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <img src={asset("banner.webp")} className="mx-auto mb-6" />
            <div className="text-gruvbox-gray text-sm font-mono">
              [ SYSTEM READY ]
            </div>
          </div>

          <div className="space-y-8 text-gruvbox-fg font-mono">
            <section className="border-2 border-gruvbox-yellow bg-gruvbox-bg0 p-8">
              <h2 className="text-2xl font-bold text-gruvbox-yellow mb-6 uppercase tracking-wider">
                {"> CO DĚLÁME_"}
              </h2>
              <div className="space-y-3 text-gruvbox-fg">
                <p>
                  <span className="text-gruvbox-gray">10 PRINT</span>{" "}
                  "Automaticky sbíráme juniorní IT pozice"
                </p>
                <p>
                  <span className="text-gruvbox-gray">20 PRINT</span>{" "}
                  "Filtrujeme duplicity a neaktuální nabídky"
                </p>
                <p>
                  <span className="text-gruvbox-gray">30 PRINT</span>{" "}
                  "Poskytujeme přehled pro začátečníky"
                </p>
                <p className="text-gruvbox-gray">40 RUN</p>
              </div>
            </section>

            <section className="border-2 border-gruvbox-blue bg-gruvbox-bg0 p-8">
              <h2 className="text-2xl font-bold text-gruvbox-blue mb-6 uppercase tracking-wider">
                {"> PROČ VZNIKL PROJEKT_"}
              </h2>
              <div className="space-y-3 text-gruvbox-fg">
                <p>
                  <span className="text-gruvbox-gray">LOAD</span> "PROBLEM",8,1
                </p>
                <p>- Hledání juniorních pozic = frustrující</p>
                <p>- Nabídky rozptýlené po stránkách</p>
                <p>- Začátečníci potřebují pomoc</p>
                <p className="text-gruvbox-gray">READY.</p>
              </div>
            </section>

            <section className="border-2 border-gruvbox-green bg-gruvbox-bg0 p-8">
              <h2 className="text-2xl font-bold text-gruvbox-green mb-6 uppercase tracking-wider">
                {"> TECH STACK_"}
              </h2>
              <div className="space-y-3 text-gruvbox-fg">
                <p>
                  <span className="text-gruvbox-gray">SYS 64738:</span>{" "}
                  Fresh (Deno) framework
                </p>
                <p>
                  <span className="text-gruvbox-gray">SYS 49152:</span>{" "}
                  Deno KV database
                </p>
                <p>
                  <span className="text-gruvbox-gray">SYS 53248:</span>{" "}
                  Tailwind CSS styling
                </p>
                <p>
                  <span className="text-gruvbox-gray">SYS 40960:</span>{" "}
                  Automated daily updates
                </p>
                <p className="text-gruvbox-gray">SYSTEM OPERATIONAL</p>
              </div>
            </section>

            <section className="border-2 border-gruvbox-red bg-gruvbox-bg0 p-8">
              <h2 className="text-2xl font-bold text-gruvbox-red mb-6 uppercase tracking-wider">
                {"> PRIVACY & CONTACT_"}
              </h2>
              <div className="space-y-3 text-gruvbox-fg">
                <p>
                  <span className="text-gruvbox-gray">POKE 53280,0:</span>{" "}
                  Proprietární projekt
                </p>
                <p>
                  <span className="text-gruvbox-gray">POKE 53281,0:</span>{" "}
                  Anonymní statistiky pouze
                </p>
                <p>
                  <span className="text-gruvbox-gray">POKE 646,1:</span>{" "}
                  Oblíbené v localStorage
                </p>
                <p className="text-gruvbox-gray">
                  *** COMMODORE 64 BASIC V2 ***
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
