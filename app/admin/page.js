import { redirect } from "next/navigation";
import { isAdmin } from "../../lib/auth";
import { getSettings, getClients, getPhotos, getPricing } from "../../lib/data";
import AdminDashboard from "../../components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/admin/login");

  const [settings, clients, photos, pricing] = await Promise.all([
    getSettings(),
    getClients(),
    getPhotos(),
    getPricing(),
  ]);

  return (
    <AdminDashboard
      initialSettings={settings}
      initialClients={clients}
      initialPhotos={photos}
      initialPricing={pricing}
    />
  );
}
