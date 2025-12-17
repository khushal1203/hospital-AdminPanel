import DashboardSwitcher from "@/components/Dashboard/DashboardSwitcher";

export default async function Home({ searchParams }) {
  // ✅ UNWRAP PROMISE
  const params = await searchParams;

  return <DashboardSwitcher />;
}
