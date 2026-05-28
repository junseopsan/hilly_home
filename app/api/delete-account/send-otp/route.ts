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
  try {
    const body = await req.json();
    phoneInput = String(body?.phone ?? "");
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

  // 가입된 번호인지 profiles에서 확인 — 없는 번호는 OTP 전송 거부
  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?phone_number=eq.${digits}&select=id&limit=1`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      cache: "no-store",
    }
  );
  if (!profileRes.ok) {
    return NextResponse.json(
      { error: "사용자 조회 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
  const profiles = (await profileRes.json()) as Array<{ id: string }>;
  if (profiles.length === 0) {
    return NextResponse.json(
      { error: "가입된 휴대폰 번호를 찾을 수 없어요." },
      { status: 404 }
    );
  }

  const phoneE164 = toE164(digits);

  const otpRes = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phoneE164,
      create_user: false,
      channel: "sms",
    }),
  });

  if (!otpRes.ok) {
    const text = await otpRes.text().catch(() => "");
    if (otpRes.status === 429 || /security purposes|after/i.test(text)) {
      return NextResponse.json(
        { error: "잠시 후 다시 시도해주세요. (1분 제한)" },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "인증번호 전송에 실패했어요. 잠시 후 다시 시도해주세요." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
