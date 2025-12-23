import DashboardSwitcher from "@/components/Dashboard/DashboardSwitcher";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  // ✅ UNWRAP PROMISE
  const params = await searchParams;

  return <DashboardSwitcher />;
}
