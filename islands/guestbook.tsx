import { useEffect, useState } from "preact/hooks";
import { MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-preact";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  email?: string;
  timestamp: number;
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    email: "",
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async (reset = false) => {
    setIsLoading(true);
    try {
      const offset = reset ? 0 : entries.length;
      const response = await fetch(`/api/guestbook?limit=5&offset=${offset}`);
      const data = await response.json();

      if (reset) {
        setEntries(data.entries);
      } else {
        setEntries((prev) => [...prev, ...data.entries]);
      }

      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", message: "", email: "" });
        await fetchEntries(true); // Reset and refresh entries
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-8">
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 text-2xl font-bold hover:text-green-600 transition-colors w-full justify-between text-zinc-900 dark:text-zinc-100"
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-green-600" />
            <span>Kniha návštěv</span>
            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
              ({total})
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </button>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Zanechte nám vzkaz a sdílejte své myšlenky o našem portálu
        </p>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Submission Form */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Napsat vzkaz
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-zinc-100">
                  Jméno
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onInput={(e) =>
                    setFormData({
                      ...formData,
                      name: (e.target as HTMLInputElement).value,
                    })
                  }
                  placeholder="Vaše jméno"
                  maxLength={50}
                  className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-zinc-100">
                  Zpráva
                </label>
                <textarea
                  value={formData.message}
                  onInput={(e) =>
                    setFormData({
                      ...formData,
                      message: (e.target as HTMLTextAreaElement).value,
                    })
                  }
                  placeholder="Váš vzkaz..."
                  rows={4}
                  maxLength={500}
                  className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition text-sm resize-none"
                  required
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {formData.message.length}/500 znaků
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.name.trim() ||
                  !formData.message.trim()
                }
                className="bg-green-600 hover:bg-green-700 disabled:bg-zinc-400 text-white px-4 py-2 rounded text-sm transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Odesílám..." : "Odeslat vzkaz"}
              </button>
            </form>
          </div>

          {/* Entries List */}
          <div className="space-y-4">
            {total === 0 ? (
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 text-center rounded-lg">
                <MessageCircle className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <p className="text-zinc-500 dark:text-zinc-400">
                  Zatím zde nejsou žádné vzkazy. Buďte první!
                </p>
              </div>
            ) : (
              <>
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 hover:border-green-400 transition-colors rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                          {entry.name}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {entry.message}
                    </p>
                  </div>
                ))}
                {hasMore && (
                  <button
                    onClick={() => fetchEntries()}
                    disabled={isLoading}
                    className="w-full text-center py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors border border-dashed border-zinc-300 dark:border-zinc-700 rounded hover:border-zinc-400 dark:hover:border-zinc-600 disabled:opacity-50"
                  >
                    {isLoading
                      ? "Načítám..."
                      : `Zobrazit další (${total - entries.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
