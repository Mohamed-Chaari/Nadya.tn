import type { Metadata } from "next";
import { getCustomers } from "@/lib/customers/get-customers";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Clients — Admin NADYA",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-nadya-black dark:text-nadya-cream">Clients</h1>
        <p className="text-sm text-nadya-black/60 dark:text-nadya-cream/60">
          {customers.length} client{customers.length > 1 ? "s" : ""}
        </p>
      </div>

      {customers.length === 0 ? (
        <p className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-8 text-center text-sm text-nadya-black/50 dark:text-nadya-cream/50">
          Aucun client pour le moment.
        </p>
      ) : (
        <>
          <div className="space-y-3 sm:hidden">
            {customers.map((customer) => (
              <div key={customer.phone} className="border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-nadya-black dark:text-nadya-cream">{customer.name}</p>
                  <p className="shrink-0 text-sm text-nadya-black dark:text-nadya-cream">
                    {formatPrice(customer.totalSpent)}
                  </p>
                </div>
                <a
                  href={`tel:${customer.phone}`}
                  className="mt-0.5 inline-block text-sm text-nadya-gold-dark hover:underline"
                >
                  {customer.phone}
                </a>
                <div className="mt-2 flex items-center justify-between text-xs text-nadya-black/50 dark:text-nadya-cream/50">
                  <span>
                    {customer.orderCount} commande{customer.orderCount > 1 ? "s" : ""}
                  </span>
                  <span>{formatDate(customer.lastOrderAt)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto border border-nadya-line dark:border-nadya-gold/15 bg-white dark:bg-nadya-onyx sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nadya-line dark:border-nadya-gold/15 text-left text-xs tracking-[0.1em] text-nadya-black/50 dark:text-nadya-cream/50 uppercase">
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Téléphone</th>
                  <th className="px-4 py-3">Commandes</th>
                  <th className="px-4 py-3">Total dépensé</th>
                  <th className="px-4 py-3">Dernière commande</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.phone} className="border-b border-nadya-line dark:border-nadya-gold/15 last:border-0">
                    <td className="px-4 py-3 font-medium text-nadya-black dark:text-nadya-cream">{customer.name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`tel:${customer.phone}`}
                        className="text-nadya-gold-dark hover:underline"
                      >
                        {customer.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-nadya-black/70 dark:text-nadya-cream/70">{customer.orderCount}</td>
                    <td className="px-4 py-3 text-nadya-black dark:text-nadya-cream">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-nadya-black/50 dark:text-nadya-cream/50">
                      {formatDate(customer.lastOrderAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
