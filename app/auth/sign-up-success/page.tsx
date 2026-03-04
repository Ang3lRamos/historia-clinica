import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MailCheck } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
            <MailCheck className="h-7 w-7 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Revise su correo</CardTitle>
          <CardDescription className="text-muted-foreground">
            Hemos enviado un enlace de confirmacion a su correo electronico. Por favor, confirme su cuenta para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Volver al inicio de sesion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
