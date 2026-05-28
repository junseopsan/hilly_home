"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTimer, maskPhone, normalizePhone } from "@/lib/phone";

type Step = "phone" | "code" | "done";

const OTP_TTL = 300; // 5분
const RESEND_COOLDOWN = 60; // 1분

function formatPhoneDisplay(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export default function DeleteAccountForm() {
  const [step, setStep] = useState<Step>("phone");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendError, setResendError] = useState("");
  const [timer, setTimer] = useState(OTP_TTL);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  const codeInputRef = useRef<HTMLInputElement>(null);

  // OTP 유효시간 카운트다운
  useEffect(() => {
    if (step !== "code") return;
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((n) => (n <= 1 ? 0 : n - 1)), 1000);
    return () => clearInterval(t);
  }, [step, timer]);

  // 재전송 쿨다운
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(
      () => setResendCooldown((n) => (n <= 1 ? 0 : n - 1)),
      1000
    );
    return () => clearInterval(t);
  }, [resendCooldown]);

  const sendOtp = async (resending = false) => {
    if (resending) setResendError("");
    else setErrorMsg("");
    setIsSending(true);
    try {
      const res = await fetch("/api/delete-account/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneDigits }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        const msg = data.error ?? "인증번호 전송에 실패했어요.";
        if (resending) setResendError(msg);
        else setErrorMsg(msg);
        return;
      }
      setStep("code");
      setCode("");
      setTimer(OTP_TTL);
      setResendCooldown(RESEND_COOLDOWN);
      setTimeout(() => codeInputRef.current?.focus(), 100);
    } catch {
      const msg = "네트워크 오류가 발생했어요. 다시 시도해주세요.";
      if (resending) setResendError(msg);
      else setErrorMsg(msg);
    } finally {
      setIsSending(false);
    }
  };

  const verify = async () => {
    setErrorMsg("");
    setIsVerifying(true);
    try {
      const res = await fetch("/api/delete-account/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneDigits, code }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        alreadyRequested?: boolean;
      };
      if (!res.ok) {
        setErrorMsg(data.error ?? "인증에 실패했어요.");
        return;
      }
      setAlreadyRequested(Boolean(data.alreadyRequested));
      setStep("done");
    } catch {
      setErrorMsg("네트워크 오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 신청 완료 화면
  if (step === "done") {
    return (
      <div className="rounded-2xl p-8 border border-emerald-500/30 bg-emerald-500/[0.04] text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-7 w-7 text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          {alreadyRequested
            ? "이미 접수된 요청이 있어요"
            : "삭제 요청이 접수됐어요"}
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-1">
          인증된 번호:{" "}
          <span className="text-white font-medium">
            {maskPhone(phoneDigits)}
          </span>
        </p>
        <p className="text-sm text-gray-400 leading-relaxed">
          영업일 기준 7일 이내 본인 확인 후 계정 및 관련 데이터가 영구
          삭제됩니다.
          <br />
          처리 결과는 별도 안내드리지 않으며, 진행 상황 문의는{" "}
          <a
            href="mailto:service@hillyheally.com"
            className="text-orange-300 hover:text-orange-200 underline underline-offset-2"
          >
            service@hillyheally.com
          </a>
          으로 부탁드려요.
        </p>
      </div>
    );
  }

  // 전화번호 입력 단계
  if (step === "phone") {
    return (
      <div className="rounded-2xl p-6 lg:p-7 bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-orange-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            본인 확인 후 삭제 신청
          </h2>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          힐리힐리 가입 시 인증한 휴대폰 번호로 인증번호를 전송해드려요. 본인
          확인 후 삭제 요청이 접수됩니다.
        </p>

        <label
          htmlFor="phone"
          className="block text-xs font-medium text-gray-400 mb-2"
        >
          휴대폰 번호
        </label>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-0000-0000"
          value={formatPhoneDisplay(phoneDigits)}
          onChange={(e) => {
            setPhoneDigits(normalizePhone(e.target.value).slice(0, 11));
            setErrorMsg("");
          }}
          className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 h-12 text-base"
        />
        {errorMsg ? (
          <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
        ) : null}

        <Button
          onClick={() => sendOtp(false)}
          disabled={phoneDigits.length < 10 || isSending}
          className="mt-5 w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-medium disabled:opacity-40"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 전송 중...
            </>
          ) : (
            "인증번호 받기"
          )}
        </Button>

        <p className="mt-4 text-[11px] text-gray-500 leading-relaxed">
          입력하신 번호는 본인 확인 용도로만 사용되며, 인증 요청 기록은
          개인정보처리방침에 따라 안전하게 관리됩니다.
        </p>
      </div>
    );
  }

  // OTP 입력 단계
  const expired = timer === 0;
  return (
    <div className="rounded-2xl p-6 lg:p-7 bg-white/[0.03] border border-white/[0.06]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-orange-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">인증번호 입력</h2>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed mb-6">
        <span className="text-white font-medium">{maskPhone(phoneDigits)}</span>
        으로 전송된 6자리 인증번호를 입력해주세요.
      </p>

      <label
        htmlFor="code"
        className="block text-xs font-medium text-gray-400 mb-2"
      >
        인증번호
      </label>
      <div className="relative">
        <Input
          ref={codeInputRef}
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="6자리"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setErrorMsg("");
          }}
          className="bg-white/[0.04] border-white/10 text-white placeholder:text-gray-600 h-12 text-base pr-16 tracking-[0.3em]"
        />
        {!expired && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-orange-300">
            {formatTimer(timer)}
          </span>
        )}
      </div>
      {errorMsg ? (
        <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
      ) : expired ? (
        <p className="mt-2 text-xs text-red-400">
          인증번호가 만료됐어요. 다시 받아주세요.
        </p>
      ) : null}

      <Button
        onClick={verify}
        disabled={code.length !== 6 || isVerifying || expired}
        className="mt-5 w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-medium disabled:opacity-40"
      >
        {isVerifying ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 확인 중...
          </>
        ) : (
          "삭제 신청하기"
        )}
      </Button>

      <div className="mt-4 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setErrorMsg("");
            setResendError("");
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← 번호 다시 입력
        </button>
        <button
          type="button"
          disabled={resendCooldown > 0 || isSending}
          onClick={() => sendOtp(true)}
          className="text-orange-300 hover:text-orange-200 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isSending
            ? "전송 중..."
            : resendCooldown > 0
              ? `${resendCooldown}초 후 재전송`
              : "인증번호 다시 받기"}
        </button>
      </div>
      {resendError ? (
        <p className="mt-2 text-xs text-red-400 text-right">{resendError}</p>
      ) : null}
    </div>
  );
}
