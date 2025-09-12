import { useEffect, useState } from "preact/hooks";
import type { Listing } from "../lib/types.ts";
import { getFavorites, removeFavorite } from "../lib/favorites.ts";
import ky from "ky";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoriteIds = getFavorites();

      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const response = await ky.post("/api/listings/bulk", {
        json: { ids: favoriteIds },
      });

      const { data } = await response.json<{ data: Listing[] }>();
      setFavorites(data);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (listingId: string) => {
    removeFavorite(listingId);
    setFavorites((prev) => prev.filter((listing) => listing.id !== listingId));
  };

  if (loading) {
    return <div className="text-gruvbox-fg">Načítám oblíbené...</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="text-gruvbox-fg">
        Zatím žádné oblíbené. Jděte na{" "}
        <a href="/" className="text-gruvbox-yellow hover:underline">
          práce
        </a>{" "}
        a označte si nějaké nabídky!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((listing) => (
        <div
          key={listing.id}
          className="border border-gruvbox-bg1 bg-gruvbox-bg0 p-6 transition-all hover:shadow-lg"
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-bold text-gruvbox-yellow">
              {listing.title}
            </h2>
            <button
              onClick={() => handleRemoveFavorite(listing.id)}
              className="text-gruvbox-red hover:text-gruvbox-bright_red transition-colors"
              title="Odebrat z oblíbených"
            >
              [x]
            </button>
          </div>

          <div className="space-y-1 mb-4">
            <p className="text-gruvbox-fg">{listing.company}</p>
            <p className="text-gruvbox-gray">{listing.location}</p>
          </div>

          <a
            href={listing.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gruvbox-blue hover:text-gruvbox-bright_blue hover:underline"
          >
            Zobrazit práci →
          </a>
        </div>
      ))}
    </div>
  );
}
