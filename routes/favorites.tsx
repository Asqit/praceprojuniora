import { Footer } from "../components/footer/footer.tsx";
import { Navbar } from "../components/navbar/navbar.tsx";
import Favorites from "../islands/favorites.tsx";

export default function FavoritesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gruvbox-yellow mb-8">
            [ oblíbené ]
          </h1>
          <Favorites />
        </div>
      </main>
      <Footer />
    </>
  );
}