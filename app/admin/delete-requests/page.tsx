import { redirect } from "next/navigation";
import Link from "next/link";
import { readAdminSession } from "@/lib/admin-session";
import LogoutButton from "../LogoutButton";
import DeleteRequestsTable, {
  type DeletionRequest,
} from "./DeleteRequestsTable";

export const dynamic = "force-dynamic";

async function fetchRequests(): Promise<DeletionRequest[]> {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/account_deletion_requests?select=id,user_id,phone_number,phone_e164,status,source,note,requested_at,processed_at,processed_by&order=requested_at.desc&limit=200`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  return (await res.json()) as DeletionRequest[];
}

export default async function DeleteRequestsPage() {
  const session = await readAdminSession();
  if (!session) redirect("/admin");

  const requests = await fetchRequests();
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <main className="container mx-auto px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            계정 삭제 요청
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            전체 {requests.length}건 · 대기{" "}
            <span className="text-orange-300 font-medium">{pendingCount}</span>건
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">
            {session.nickname ?? "관리자"}
          </span>
          <Link
            href="/"
            className="text-gray-500 hover:text-white transition-colors"
          >
            홈
          </Link>
          <LogoutButton />
        </div>
      </header>

      <DeleteRequestsTable requests={requests} />
    </main>
  );
}
