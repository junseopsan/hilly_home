import { NextResponse } from "next/server";
import { isValidKoreanMobile, normalizePhone, toE164 } from "@/lib/phone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ANON_KEY) {
    return NextResponse.json(
      { error: "서버 설정 오류가 발생했어요. 관리자에게 문의해주세요." },
      { status: 500 }
    );
  }

  let phoneInput: string;
  let code: string;
  try {
    const body = await req.json();
    phoneInput = String(body?.phone ?? "");
    code = String(body?.code ?? "").trim();
  } catch {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const digits = normalizePhone(phoneInput);
  if (!isValidKoreanMobile(digits)) {
    return NextResponse.json(
      { error: "올바른 휴대폰 번호를 입력해주세요." },
      { status: 400 }
    );
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: "인증번호 6자리를 입력해주세요." },
      { status: 400 }
    );
  }

  const phoneE164 = toE164(digits);

  // 1) Supabase Auth verify — 성공 시 access_token 반환
  const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phoneE164,
      token: code,
      type: "sms",
    }),
  });

  if (!verifyRes.ok) {
    return NextResponse.json(
      { error: "인증번호가 일치하지 않거나 만료됐어요." },
      { status: 401 }
    );
  }

  const verifyData = (await verifyRes.json()) as {
    user?: { id?: string };
    access_token?: string;
    refresh_token?: string;
  };
  const userId = verifyData.user?.id ?? null;

  // 2) 세션 즉시 폐기 — 웹에선 로그인 유지 불필요
  if (verifyData.access_token) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${verifyData.access_token}`,
        },
      });
    } catch {
      // 무시 — 토큰은 짧은 수명이고 이미 verify에서 1회용으로 소비됨
    }
  }

  // 3) 동일 번호의 pending 요청이 있으면 중복 생성 방지
  const existingRes = await fetch(
    `${SUPABASE_URL}/rest/v1/account_deletion_requests?phone_e164=eq.${encodeURIComponent(
      phoneE164
    )}&status=eq.pending&select=id&limit=1`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      cache: "no-store",
    }
  );
  const existing = existingRes.ok
    ? ((await existingRes.json()) as Array<{ id: string }>)
    : [];
  if (existing.length > 0) {
    return NextResponse.json({
      success: true,
      alreadyRequested: true,
      requestId: existing[0].id,
    });
  }

  // 4) 삭제 요청 row 삽입
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const insertRes = await fetch(
    `${SUPABASE_URL}/rest/v1/account_deletion_requests`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: userId,
        phone_number: digits,
        phone_e164: phoneE164,
        status: "pending",
        source: "web",
        ip_address: ip,
        user_agent: userAgent,
      }),
    }
  );

  if (!insertRes.ok) {
    const text = await insertRes.text().catch(() => "");
    console.error("[delete-account] insert failed:", insertRes.status, text);
    return NextResponse.json(
      { error: "요청을 저장하지 못했어요. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  const rows = (await insertRes.json()) as Array<{ id: string }>;
  return NextResponse.json({
    success: true,
    requestId: rows[0]?.id ?? null,
  });
}
