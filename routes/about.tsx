export default function About() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-balance">
              O nás
            </h1>
            <div className="h-1 w-20 bg-green-500 mb-6"></div>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">Naše mise</h2>
            <p className="text-foreground leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-foreground leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">Co děláme</h2>
            <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
              <p className="text-foreground">
                • Propojujeme juniory s jejich prvními pracovními příležitostmi
              </p>
              <p className="text-foreground">
                • Sbíráme kvalitní pracovní nabídky z ověřených zdrojů
              </p>
              <p className="text-foreground">
                • Poskytujeme zdroje a rady pro rozvoj kariéry
              </p>
              <p className="text-foreground">
                • Budujeme podporující komunitu pro začínající profesionály
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">
              Proč si vybrat nás
            </h2>
            <p className="text-foreground leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
            <p className="text-foreground leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-green-500">
              Kontaktujte nás
            </h2>
            <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
              <p className="text-foreground mb-2">
                Email: kontakt@praceprojuniora.cz
              </p>
              <p className="text-foreground mb-2">Twitter: @praceprojuniora</p>
              <p className="text-foreground">
                LinkedIn: linkedin.com/company/praceprojuniora
              </p>
            </div>
          </section>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              Poslední aktualizace: 8. ledna 2025
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
