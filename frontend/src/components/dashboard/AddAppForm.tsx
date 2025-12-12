"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Search, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { appService } from "@/services/appService";

export function AddAppForm() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [country, setCountry] = useState("fr");
  const [count, setCount] = useState("200");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await appService.addApp(
        input.trim(),
        country,
        parseInt(count)
      );
      setSuccess(`✅ Application ajoutée : ${result.resolved_id}`);
      setTimeout(() => {
        router.push("/apps");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Link href="/apps">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <CardTitle>Ajouter une application</CardTitle>
            <CardDescription>
              Entrez l'URL Google Play, le nom de l'app ou l'ID du package.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-950/50 rounded-md">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Search className="size-4" />
              Application
            </label>
            <Input
              placeholder="Ex: WhatsApp, com.whatsapp, ou URL Play Store..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Vous pouvez entrer le nom de l'app, son package ID, ou l'URL
              complète du Play Store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pays</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isLoading}
              >
                <option value="fr">France</option>
                <option value="us">États-Unis</option>
                <option value="gb">Royaume-Uni</option>
                <option value="de">Allemagne</option>
                <option value="es">Espagne</option>
                <option value="it">Italie</option>
                <option value="jp">Japon</option>
                <option value="br">Brésil</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre d'avis</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                disabled={isLoading}
              >
                <option value="100">100 avis</option>
                <option value="200">200 avis</option>
                <option value="500">500 avis</option>
                <option value="1000">1000 avis</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              "Ajouter l'application"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
