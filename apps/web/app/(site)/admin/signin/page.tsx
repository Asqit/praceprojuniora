import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { signIn } from "../actions"

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  // Already logged in → go to dashboard
  const cookieStore = await cookies()
  if (cookieStore.get("admin_session")) redirect("/admin")

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Přihlaste se pro přístup k dashboardu.
          </p>
        </div>

        {error && (
          <p className="rounded border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            Nesprávný e-mail nebo heslo.
          </p>
        )}

        <form action={signIn} className="space-y-4">
          <div className="hidden space-y-1">
            <label
              htmlFor="username"
              className="text-sm font-medium text-foreground"
            >
              Uživatelské Jméno
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              tabIndex={-1}
              className="w-full rounded border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Heslo
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Přihlásit se
          </button>
        </form>
      </div>
    </div>
  )
}
