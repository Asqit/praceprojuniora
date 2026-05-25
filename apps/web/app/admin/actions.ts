"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BASE_URL } from "@/lib/http"

const COOKIE_NAME = "admin_session"

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string | null
  if (username) return

  let token: string | undefined
  let failed = false

  try {
    const res = await fetch(new URL("auth", BASE_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      const data = await res.json()
      token = data.token as string | undefined
    } else {
      failed = true
    }
  } catch {
    failed = true
  }

  if (failed || !token) redirect("/admin/signin?error=1")

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 24 * 60 * 60,
  })

  redirect("/admin")
}

export async function signOut() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (token) {
    // Best-effort revoke on the API
    await fetch(new URL("auth/revoke", BASE_URL), {
      method: "POST",
      headers: authHeader(token),
    }).catch(() => {})

    cookieStore.delete(COOKIE_NAME)
  }

  redirect("/admin/signin")
}

export async function triggerScrape(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) redirect("/admin/signin")

  const selected = formData.getAll("providers") as string[]
  const providers = selected.length > 0 ? selected : "all"

  let jobId: string | undefined

  try {
    const res = await fetch(new URL("scraper/scrape", BASE_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token!),
      },
      body: JSON.stringify({ providers }),
    })

    if (res.ok) {
      const data = await res.json()
      jobId = data.jobId as string | undefined
    }
  } catch {
    // Scrape may still have started — fall through to redirect
  }

  redirect(jobId ? `/admin?jobId=${jobId}` : "/admin")
}
