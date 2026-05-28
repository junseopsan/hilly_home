"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
        router.replace("/admin");
        router.refresh();
      }}
      className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
    >
      <LogOut className="h-4 w-4 mr-1.5" />
      로그아웃
    </Button>
  );
}
