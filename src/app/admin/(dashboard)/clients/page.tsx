import type { Metadata } from "next";
import { getCustomers } from "@/lib/customers/get-customers";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Clients — Admin NADYA",
};

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-nadya-black">Clients</h1>
        <p className="text-sm text-nadya-black/60">
          {customers.length} client{customers.length > 1 ? "s" : ""}
        </p>
      </div>

      {customers.length === 0 ? (
        <p className="border border-nadya-line bg-white p-8 text-center text-sm text-nadya-black/50">
          Aucun client pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto border border-nadya-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nadya-line text-left text-xs tracking-[0.1em] text-nadya-black/50 uppercase">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Commandes</th>
                <th className="px-4 py-3">Total dépensé</th>
                <th className="px-4 py-3">Dernière commande</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.phone} className="border-b border-nadya-line last:border-0">
                  <td className="px-4 py-3 font-medium text-nadya-black">{customer.name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-nadya-gold-dark hover:underline"
                    >
                      {customer.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-nadya-black/70">{customer.orderCount}</td>
                  <td className="px-4 py-3 text-nadya-black">
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-nadya-black/50">
                    {new Date(customer.lastOrderAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
