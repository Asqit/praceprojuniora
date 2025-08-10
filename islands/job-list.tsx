import type { JSX } from "preact";
import type { Listing } from "../lib/types.ts";
import { useCallback, useEffect, useState } from "preact/hooks";
import ky from "ky";
import clsx from "clsx";

const colors = [
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "aqua",
  "orange",
];

export default function JobList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Listing[]>([]);
  const [viewData, setViewData] = useState<Listing[]>(data);
  const handleFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ky.post("/api/listings");
      const jobs = await response.json();
      setData((jobs as any)?.data);
      setViewData((jobs as any)?.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((e: JSX.TargetedEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toLowerCase();
    if (!value.trim()) {
      setViewData(data);
      return;
    }

    setViewData(
      data.filter((j) =>
        j.title.toLowerCase().includes(value) ||
        (j.location && j.location.toLowerCase().includes(value)) ||
        (j.status && j.status.toLowerCase().includes(value))
      ),
    );
  }, [data]);

  useEffect(() => {
    if (data.length === 0) {
      handleFetch();
    }
  }, []);

  return (
    <div className="p-8">
      {isLoading && (
        <div className="animate-spin text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-loader-icon lucide-loader"
          >
            <path d="M12 2v4" />
            <path d="m16.2 7.8 2.9-2.9" />
            <path d="M18 12h4" />
            <path d="m16.2 16.2 2.9 2.9" />
            <path d="M12 18v4" />
            <path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" />
            <path d="m4.9 4.9 2.9 2.9" />
          </svg>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 order-1">
        {viewData.length > 0
          ? (
            <ul className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-8">
              {viewData.map((job) => (
                <li key={job.link}>
                  <a
                    href={job.link}
                    title={job.title}
                    className="flex gap-2 items-center flex-nowrap border border-gruvbox-bg1 p-2 h-full hover:bg-gruvbox-bg1"
                  >
                    <div
                      className={clsx(
                        "hidden md:block w-4 h-4 flex-shrink-0 border",
                        `border-gruvbox-${
                          colors[Math.floor(Math.random() * colors.length)]
                        }`,
                      )}
                    />
                    <ul>
                      <li className="font-black">
                        ┌ {job.title.trimEnd().slice(0, 36)}..
                      </li>
                      <li>├ {job.status}</li>
                      <li>└ {job.location}</li>
                    </ul>
                  </a>
                </li>
              ))}
            </ul>
          )
          : null}
        <div className="-order-1">
          <input
            onChange={handleSearch}
            type="text"
            placeholder="type to filter.."
            className="border px-2 py-1 border-gruvbox-bg1 focus:outline-gruvbox-green w-full sticky top-40 bg-gruvbox-bg"
          />
          <div className="border border-gruvbox-bg1 p-2 my-3">
            <h3 className="text-lg font-bold mb-3">O Stránce</h3>
            <p>
              V dnešní době je těžké najít práci v oboru IT, zvlášť na juniorní
              pozici. Proto jsem vytvořil tento malý web, kde lze snadno
              sledovat aktuální nabídky práce. Momentálně je zobrazeno{" "}
              <span className="text-gruvbox-aqua font-black">1114</span>{" "}
              nabídek. Pro kontakt s administrátorem webu můžete využít{" "}
              <a
                href="mailto:ondrejtucek9@gmail.com"
                className="text-gruvbox-aqua"
              >
                e-mail
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
