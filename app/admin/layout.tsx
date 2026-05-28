import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 | Hilly Heally",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08),transparent_65%)]"></div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
