import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Map,
  MapPin,
  Users,
  Shield,
  CheckCircle,
  Menu,
  MessageCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HillyheallyHomepage() {
  return (
    <div className="min-h-screen bg-[#08080f]">
      {/* Header */}
      <header className="sticky top-0 py-2 z-50 bg-[#08080f]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-fade-in-up">
            <Image
              src="/images/home_logo.png"
              alt="Hillyheally 로고"
              width={72}
              height={40}
              className="h-14 w-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-8 animate-fade-in-up delay-200">
            <Link
              href="#home"
              className="text-gray-400 hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 text-sm tracking-wide"
            >
              홈
            </Link>
            <Link
              href="#flow"
              className="text-gray-400 hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 text-sm tracking-wide"
            >
              서비스 흐름
            </Link>
            <Link
              href="#features"
              className="text-gray-400 hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 text-sm tracking-wide"
            >
              핵심 기능
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden text-gray-400">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-32 lg:py-44 overflow-hidden">
        {/* Aurora background */}
        <div className="absolute inset-0 bg-[#08080f]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.12),transparent_65%)]"></div>
          <div className="absolute top-10 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.1),transparent_60%)]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.08),transparent_60%)]"></div>
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                  나만의 지도를 만들고,
                </span>
                <br />
                <span className="text-white">
                  함께 걷는 경험을 만드세요.
                </span>
              </h1>
            </div>
            <div className="animate-fade-in-up delay-500">
              <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
                코스를 찾고, 모험을 만들고, 같이 걸을 사람을 모집하고, 산행 후 기록과 후기를
                <br />
                남기는 아웃도어 소셜 플랫폼
              </p>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#08080f]"></div>
      </section>

      {/* Service Flow Section */}
      <section id="flow" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#08080f]">
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.06),transparent_65%)]"></div>
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_right,rgba(236,72,153,0.06),transparent_65%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              함께 걷는 경험,{" "}
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                이렇게 만들어집니다
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              발견부터 기록까지, 힐리힐리가 모든 흐름을 함께합니다
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                step: "01",
                icon: <Map className="h-5 w-5 text-orange-400" />,
                title: "트레일 발견",
                desc: "산 이름, 코스, 지역으로 검색하거나 지도에서 원하는 트레일을 찾아보세요.",
                accent: "border-l-orange-500/60",
              },
              {
                step: "02",
                icon: <MapPin className="h-5 w-5 text-pink-400" />,
                title: "나만의 지도 만들기",
                desc: "마음에 드는 트레일을 저장해 내 지도로 관리하세요.",
                accent: "border-l-pink-500/60",
              },
              {
                step: "03",
                icon: <Users className="h-5 w-5 text-orange-300" />,
                title: "모험 만들기",
                desc: "일정·장소·정원을 설정하고 같이 걸을 참가자를 모집하세요.",
                accent: "border-l-orange-400/60",
              },
              {
                step: "04",
                icon: <CheckCircle className="h-5 w-5 text-pink-300" />,
                title: "참가 신청 & 운영",
                desc: "참가 신청을 받고 승인·거절을 관리하세요. 공지사항 작성, 유저 초대, 링크 공유까지 모험 운영에 필요한 모든 것을 제공합니다.",
                accent: "border-l-pink-400/60",
              },
              {
                step: "05",
                icon: <Star className="h-5 w-5 text-orange-400" />,
                title: "기록 & 후기",
                desc: "산행을 마치면 별점과 후기를 남겨 경험을 기록하세요.",
                accent: "border-l-orange-500/60",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-5 items-start px-6 py-5 rounded-xl bg-white/[0.03] border border-white/[0.06] border-l-2 ${item.accent} hover:bg-white/[0.05] transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-0.5">
                  <span className="text-[10px] font-bold text-gray-600 tracking-widest">
                    {item.step}
                  </span>
                  <div className="w-9 h-9 bg-white/[0.04] rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#08080f]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.07),transparent_65%)]"></div>
        </div>

        {/* Top divider glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              핵심 기능
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: <Map className="h-6 w-6 text-orange-400" />,
                iconBg: "bg-orange-400/10",
                title: "지도 기반 트레일 탐색",
                desc: "전국 트레일을 지도에서 탐색하고, GPX 업로드와 체크포인트 관리로 나만의 코스를 만들어 저장하세요.",
                hover: "hover:border-orange-500/30",
              },
              {
                icon: <Users className="h-6 w-6 text-pink-400" />,
                iconBg: "bg-pink-400/10",
                title: "모험 생성 & 참가자 관리",
                desc: "모험을 열고 참가 신청을 받아보세요. 승인·거절·강제 퇴출과 유저 초대, 공지사항까지 호스트가 필요한 모든 기능을 제공합니다.",
                hover: "hover:border-pink-500/30",
              },
              {
                icon: <Star className="h-6 w-6 text-orange-300" />,
                iconBg: "bg-orange-300/10",
                title: "후기 & 평점",
                desc: "산행을 마친 승인 참가자만 후기를 남길 수 있어요. 0.5 단위 별점 슬라이더로 솔직한 경험을 기록하세요.",
                hover: "hover:border-orange-400/30",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] ${item.hover} transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-11 h-11 ${item.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#08080f]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(236,72,153,0.07),transparent_60%)]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight flex flex-col items-center gap-3 lg:gap-4">
              <span>어떤 길을 함께하고 싶나요?</span>
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                힐리힐리에서 새로운 모험을 시작해보세요.
              </span>
            </h2>
          </div>
          <div className="animate-fade-in-up delay-300">
            <p className="text-gray-500 mb-4 max-w-xl mx-auto text-sm leading-relaxed">
              코스를 발견하고, 사람을 만나고, 경험을 기록으로 남겨보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#08080f] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/images/logo.png"
                  alt="Hillyheally 로고"
                  width={40}
                  height={40}
                />
                <span className="text-xl font-bold text-white">Hilly Heally</span>
              </div>
              <p className="text-gray-600 text-sm">상호명: 주식회사 힐리힐리</p>
              <p className="text-gray-600 text-sm">대표자: 정영교</p>
              <p className="text-gray-600 text-sm">
                주소: 서울시 서초구 서초중앙로 123, 지하 1층 1003호
              </p>
              <p className="text-gray-600 text-sm">사업자번호: 720-86-03798</p>
              <p className="text-gray-600 text-sm">Tel: 1800-5191 FAX: 02-6455-6023</p>
              <p className="text-gray-600 text-sm">Mail: service@hillyheally.com</p>
            </div>
          </div>
          <div className="border-t border-white/[0.05] mt-8 pt-8 text-center text-gray-600">
            <p className="text-sm">&copy; 2025 Hilly Heally. All rights reserved.</p>
            <div className="mt-3 flex items-center justify-center gap-6 text-sm">
              <Link href="/terms" className="hover:text-white transition-colors">
                서비스 이용약관
              </Link>
              <span className="text-gray-700">|</span>
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
