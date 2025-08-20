import { useState } from "preact/hooks";
import { Listing } from "../../../lib/types.ts";
import ky from "ky";
import clsx from "clsx";

type Props = Listing;
const colors = [
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "aqua",
  "orange",
];

export function ListItem(props: Props) {
  const {
    title,
    id,
    link,
    expiredAt,
    location,
    createdAt,
    source,
    statusMeta,
    company,
    status,
    ...rest
  } = props;
  const [clicks, setClicks] = useState<number>(rest?.clicks);
  const hash = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = colors[hash % colors.length];

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Dnes";
    if (diffDays === 1) return "Zítra";
    return `${diffDays} dní`;
  };

  const timeTo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Dnes";
    if (diffDays === 1) return "Zítra";
    return `${diffDays} dní`;
  };

  const handleClick = async () => {
    await ky.put(`/api/listings/click`, {
      json: { id },
    });
    setClicks(clicks + 1);
  };

  return (
    <a
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      onClick={handleClick}
      className={clsx(
        "relative block w-full h-full p-2 border bg-gruvbox-bg",
        "before:content-[''] before:transition-all before:border before:absolute before:top-0 before:left-0 before:-z-10 before:w-full before:h-full",
        `before:border-gruvbox-${color}`,
        "hover:before:h-[105%] hover:before:w-[105%] hover:before:-top-[2.5%] hover:before:-left-[2.5%]",
        `border-gruvbox-${color}`,
      )}
    >
      <div className="absolute -top-6 -left-4 flex items-center gap-2">
        <div
          className="bg-gruvbox-bg1 p-1"
          title={`${clicks} people have clicked here`}
        >
          {clicks}x
        </div>
        {new Date(createdAt) > new Date(Date.now() - 1000 * 60 * 60 * 48) && (
          <span className="text-gruvbox-fg font-black bg-gruvbox-bg1 p-1">
            !!NOVÝ!!
          </span>
        )}
      </div>
      <ul>
        <li className="text-xl font-black">
          ┌ <span className={`text-gruvbox-${color}`}>{title}</span>
        </li>
        <li>
          ├ <span className="font-bold text-lg">{company}</span>
        </li>
        <li>├ {location}</li>
        <li>├ expiruje: {timeTo(expiredAt)}</li>
        <li>└ {source === "jobs.cz" ? source : "Recruiter"}</li>
        <li className="my-2">
          <hr className="bg-gruvbox-fg" />
        </li>
        <li>┌ OUR Data</li>
        <li>├ Dostupné od: {timeAgo(createdAt)}</li>
        <li>├ kliků: {clicks}x</li>
        <li>└ meta-state: {statusMeta}</li>
      </ul>
      <p className="text-xs italic text-gruvbox-gray text-right">
        {id}
      </p>
    </a>
  );
}
