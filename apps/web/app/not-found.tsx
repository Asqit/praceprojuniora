import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl font-mono">
        <p className="mb-6 text-8xl font-black text-primary">404</p>

        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-bold text-destructive">
            java.lang.NullPointerException: Tahle URL ukazuje do prázdna
          </p>
          <p className="text-muted-foreground">
            &nbsp;&nbsp;&nbsp;&nbsp;at
            cz.praceprojuniora.router.resolve(Router.java:404)
          </p>
          <p className="text-muted-foreground">
            &nbsp;&nbsp;&nbsp;&nbsp;at
            cz.praceprojuniora.app.handleRequest(Application.java:69)
          </p>
          <p className="text-muted-foreground">
            &nbsp;&nbsp;&nbsp;&nbsp;at
            cz.praceprojuniora.server.dispatch(Server.java:1337)
          </p>
          <p className="text-muted-foreground">
            &nbsp;&nbsp;&nbsp;&nbsp;at cz.praceprojuniora.Main.main(Main.java:1)
          </p>
          <p className="mt-3 text-muted-foreground/60 italic">
            Caused by: ty jsi sem zabloudil, nebo nabídka zmizela.
          </p>
          <p className="mt-3 text-muted-foreground/60 italic">
            PS: Javu nepíšu už od střední ;.;
          </p>
        </div>

        <div className="mt-6">
          <Link href="/">
            <Button size="sm">cd ~</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
