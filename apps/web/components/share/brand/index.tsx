import Link from "next/link"

export function Brand() {
  return (
    <Link href={"/"}>
      <h1 className="text-2xl font-black">
        PRACEPRO
        <span className="relative mr-2 inline-block -skew-2 animate-in bg-primary text-white italic after:absolute after:top-1 after:left-1 after:-z-10 after:h-full after:w-full after:-skew-2 after:ring-1 after:ring-primary dark:text-black">
          JUNIORA
        </span>
        .CZ
      </h1>
    </Link>
  )
}
