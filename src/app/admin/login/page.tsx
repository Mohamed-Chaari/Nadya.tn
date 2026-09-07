"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase/ssr-browser";
import { Logo } from "@/components/layout/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const supabase = getSupabaseBrowserAuthClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError("Email ou mot de passe incorrect.");
        setSubmitting(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Connexion impossible. Vérifiez votre connexion internet et réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-nadya-cream dark:bg-nadya-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <form
          onSubmit={handleSubmit}
          className="border border-nadya-line dark:border-nadya-gold/15 bg-nadya-cream dark:bg-nadya-black p-6 shadow-sm"
        >
          <h1 className="mb-6 text-center font-display text-xl text-nadya-black dark:text-nadya-cream">
            Espace administration
          </h1>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
              Email
            </label>
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-xs tracking-[0.15em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
              Mot de passe
            </label>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx px-3 py-2.5 text-sm text-nadya-black dark:text-nadya-cream focus:border-nadya-gold focus:outline-none"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-700 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-nadya-black py-3 text-sm font-medium tracking-wide text-nadya-cream transition hover:bg-nadya-ink disabled:cursor-not-allowed disabled:bg-nadya-black/40"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
