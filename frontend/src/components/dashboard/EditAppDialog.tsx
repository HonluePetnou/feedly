"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { appService } from "@/services/appService";
import { Pencil } from "lucide-react";

interface EditAppDialogProps {
  app: {
    id: number;
    name: string | null;
    icon_url: string | null;
  };
  onUpdate: () => void;
}

export function EditAppDialog({ app, onUpdate }: EditAppDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(app.name || "");
  const [iconUrl, setIconUrl] = useState(app.icon_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appService.updateApp(app.id, {
        name,
        icon_url: iconUrl,
      });
      onUpdate();
      setOpen(false);
    } catch (error) {
      console.error("Failed to update app:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-4" />
        Modifier
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Modifier l'application"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Modifiez les détails de l'application ici.
          </p>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nom
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="icon" className="text-sm font-medium">
              Icon URL
            </label>
            <Input
              id="icon"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
