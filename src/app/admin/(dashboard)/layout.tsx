import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getCurrentAdmin } from "@/lib/admin/get-current-admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { ToastProvider } from "@/components/admin/toast-provider";
import adminMessages from "../../../../messages/fr.json";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <NextIntlClientProvider locale="fr" messages={adminMessages}>
      <ToastProvider>
        <div className="min-h-screen bg-nadya-pearl dark:bg-nadya-black">
          <AdminNav displayName={admin.displayName} role={admin.role} />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
        </div>
      </ToastProvider>
    </NextIntlClientProvider>
  );
}
