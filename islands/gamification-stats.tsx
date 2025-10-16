import { useEffect, useState } from "preact/hooks";
import { ChevronDown, ChevronUp, Flame, Target, Trophy } from "lucide-preact";

interface GamificationStats {
  jobsViewed: number;
  jobsBookmarked: number;
  streak: number;
}

export default function GamificationTracker() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [stats, setStats] = useState<GamificationStats>({
    jobsViewed: 0,
    jobsBookmarked: 0,
    streak: 1,
  });

  useEffect(() => {
    const savedStats = localStorage.getItem("gamification-stats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    const savedMinimized = localStorage.getItem("tracker-minimized");
    if (savedMinimized) {
      setIsMinimized(JSON.parse(savedMinimized));
    }

    const handleJobViewed = () => {
      setStats((prev) => {
        const newStats = { ...prev, jobsViewed: prev.jobsViewed + 1 };
        localStorage.setItem("gamification-stats", JSON.stringify(newStats));
        return newStats;
      });
    };

    const handleJobBookmarked = () => {
      setStats((prev) => {
        const newStats = { ...prev, jobsBookmarked: prev.jobsBookmarked + 1 };
        localStorage.setItem("gamification-stats", JSON.stringify(newStats));
        return newStats;
      });
    };

    globalThis.addEventListener("job-viewed", handleJobViewed);
    globalThis.addEventListener("job-bookmarked", handleJobBookmarked);

    return () => {
      globalThis.removeEventListener("job-viewed", handleJobViewed);
      globalThis.removeEventListener("job-bookmarked", handleJobBookmarked);
    };
  }, []);

  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem("tracker-minimized", JSON.stringify(newState));
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg min-w-[200px] transition-all">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={toggleMinimize}
      >
        <h3 className="text-sm font-bold text-foreground">Tvůj pokrok</h3>
        {isMinimized
          ? <ChevronUp className="h-4 w-4" />
          : <ChevronDown className="h-4 w-4" />}
      </div>

      {!isMinimized && (
        <div className="px-4 pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Zobrazeno:</span>
              <span className="font-bold text-foreground ml-auto">
                {stats.jobsViewed}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Uloženo:</span>
              <span className="font-bold text-foreground ml-auto">
                {stats.jobsBookmarked}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Série:</span>
              <span className="font-bold text-foreground ml-auto">
                {stats.streak} dní
              </span>
            </div>
          </div>

          {stats.jobsViewed >= 5 && stats.jobsViewed < 10 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-accent font-semibold">
                Skvělá práce! Pokračuj v hledání.
              </p>
            </div>
          )}

          {stats.jobsViewed >= 10 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-accent font-semibold">
                Wow! Jsi opravdu aktivní hledač!
              </p>
            </div>
          )}

          {stats.jobsBookmarked >= 3 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-accent font-semibold">
                Máš skvělý výběr uložených pozic!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
