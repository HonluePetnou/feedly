"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ModeToggle } from "@/components/mode-toggle";
import { User, Key, LogOut, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function SettingsPage() {
  const router = useRouter();

  // Profile state
  const [profile, setProfile] = useState({ fullname: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // Password state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  // Delete account state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await authService.getMe();
        setProfile({ fullname: user.fullname, email: user.email });
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    loadProfile();
  }, []);

  // Update profile
  const handleProfileUpdate = async () => {
    setProfileLoading(true);
    setProfileMessage("");
    try {
      await authService.updateProfile(profile);
      setProfileMessage("✅ Profil mis à jour !");
    } catch (error: any) {
      setProfileMessage(`❌ ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  // Update password
  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      setPasswordMessage("❌ Les mots de passe ne correspondent pas");
      return;
    }
    setPasswordLoading(true);
    setPasswordMessage("");
    try {
      await authService.updatePassword({
        current_password: passwords.current,
        new_password: passwords.new,
      });
      setPasswordMessage("✅ Mot de passe mis à jour !");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      setPasswordMessage(`❌ ${error.message}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await authService.deleteAccount();
      router.push("/login");
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Informations du profil
            </CardTitle>
            <CardDescription>
              Modifiez vos informations personnelles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom complet</label>
                <Input
                  value={profile.fullname}
                  onChange={(e) =>
                    setProfile({ ...profile, fullname: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Adresse email</label>
                <Input
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
            </div>
            {profileMessage && (
              <p
                className={`text-sm ${
                  profileMessage.startsWith("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {profileMessage}
              </p>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <Button onClick={handleProfileUpdate} disabled={profileLoading}>
              {profileLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="size-5" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Mettez à jour votre mot de passe pour sécuriser votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe actuel</label>
              <Input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmer</label>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>
            </div>
            {passwordMessage && (
              <p
                className={`text-sm ${
                  passwordMessage.startsWith("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passwordMessage}
              </p>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <Button onClick={handlePasswordUpdate} disabled={passwordLoading}>
              {passwordLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </CardFooter>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="size-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence du tableau de bord.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Thème</p>
              <p className="text-sm text-muted-foreground">
                Basculer entre le mode clair et sombre.
              </p>
            </div>
            <ModeToggle />
          </CardContent>
        </Card>

        {/* Session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="size-5" />
              Session
            </CardTitle>
            <CardDescription>Gérez votre session active.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Déconnexion</p>
                <p className="text-sm text-muted-foreground">
                  Terminer votre session sur cet appareil.
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="size-5" />
              Zone de danger
            </CardTitle>
            <CardDescription>
              Actions irréversibles pour votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">
                    Supprimer le compte
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supprime définitivement votre compte et toutes vos données.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Supprimer
                </Button>
              </div>
            ) : (
              <div className="space-y-4 p-4 border border-destructive rounded-lg bg-destructive/5">
                <p className="text-destructive font-medium">
                  ⚠️ Êtes-vous sûr de vouloir supprimer votre compte ?
                </p>
                <p className="text-sm text-muted-foreground">
                  Cette action est irréversible. Toutes vos données seront
                  perdues.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading
                      ? "Suppression..."
                      : "Confirmer la suppression"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
