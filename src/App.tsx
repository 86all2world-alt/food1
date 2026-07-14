import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Leaf, 
  Sparkles, 
  GraduationCap, 
  Utensils, 
  CheckCircle,
  HelpCircle,
  BookOpen
} from "lucide-react";
import StudentPreview from "./components/StudentPreview";
import TeacherWorkspace from "./components/TeacherWorkspace";
import { SeasonalData } from "./types";

// Initial Spring/May seasonal data in case backend fetch is delayed
const INITIAL_DATA: SeasonalData = {
  month: 5,
  ingredients: [
    {
      name: "쑥갓",
      keyNutrients: "칼슘, 비타민 A, 철분, 비타민 C [소스 1]",
      growthHelp: "어린이와 청소년의 뼈 건강을 지키고, 빈혈을 예방해 주며, 피로 회복을 도와 쑥쑥 자라게 해줘요! [소스 1]",
      cookingTip: {
        scienceSecret: "쑥갓은 너무 오래 삶으면 비타민이 파괴되므로 끓는 물에 '살짝만 데치는 것'이 비결이에요. 또한, 쑥갓에 들어있는 결석을 만들 수 있는 성분(옥살산)은 끓는 물에 살짝 데치면 대부분 물로 녹아 나온답니다! [소스 1]",
        bestPairing: "두부와의 궁합이 최고예요! 두부의 풍부한 칼슘이 쑥갓의 남아있는 결석 유발 성분(옥살산)을 몸 밖으로 안전하게 배출하고, 서로 부족한 단백질과 비타민을 완벽하게 채워줘요! [소스 1]",
        teacherWord: "쑥갓은 향긋하고 건강에 정말 좋지만, 결석을 만들 수 있는 성분이 들어있어서 끓는 물에 3초만 살짝 데쳐서 먹어야 안전하단다! 단백질이 가득한 고소한 두부와 함께 조물조물 무쳐서 먹어볼까? [소스 1]"
      },
      safetyAlerts: [
        "1. 잔류농약 제거: 흐르는 물에 3회 이상 깨끗하게 씻어 미세 먼지와 남아있는 농약을 완전히 없애야 해요. [소스 1]",
        "2. 보관 온도: 신선함을 유지하기 위해 5℃ 이하의 냉장실 신선칸에 세워서 보관하는 것이 좋답니다. [소스 1]",
        "3. 주의사항: 평소 결석(돌이 생기는 질환)이 있거나 신장이 약한 친구들은 한 번에 너무 많은 양을 먹지 않도록 주의하세요! [소스 1]"
      ]
    },
    {
      name: "양배추",
      keyNutrients: "위를 보호하는 성분(비타민 U), 비타민 K, 식이섬유, 칼슘 [소스 2]",
      growthHelp: "위벽을 튼튼하게 감싸주어 영양 흡수율을 높이고, 뼈를 단단하게 만들며, 장운동을 활발하게 해 배를 편안하게 해줘요! [소스 2]",
      cookingTip: {
        scienceSecret: "양배추에 들어있는 위를 튼튼하게 보호하는 성분(비타민 U)은 열에 무척 약하답니다. 뜨겁게 오랫동안 끓이면 모두 파괴되기 때문에 생으로 얇게 썰어 샐러드로 먹거나, 60℃ 이하에서 아주 살짝만 찌는 것이 영양 흡수를 극대화하는 비결이에요! [소스 2]",
        bestPairing: "새콤달콤한 레몬이나 자몽과 아주 잘 맞아요! 비타민 C가 양배추의 칼슘과 철분 흡수율을 엄청나게 높여주고 특유의 풋내도 향긋하게 잡아줘요! [소스 2]",
        teacherWord: "양배추는 튼튼한 방패처럼 너희의 위를 보호해주는 멋진 채소란다! 다만 뜨거운 불에 오래 익히면 영양소가 도망가 버리니, 아삭아삭하게 생으로 먹거나 살짝만 스팀으로 익혀서 먹는 습관을 들여봐! [소스 2]"
      },
      safetyAlerts: [
        "1. 잔류농약 세척법: 양배추는 겉잎에 농약이 많이 묻으므로 겉잎을 2~3장 떼어내고, 얇게 채 썬 후 식초를 한 방울 떨어뜨린 물에 5분간 담갔다가 흐르는 물에 헹구어 내세요! [소스 2]",
        "2. 보관 방법: 심지를 칼로 도려낸 뒤 물에 적신 키친타월을 채워 넣고 랩으로 싸서 5℃ 이하 냉장실에 심지 부분이 아래로 가도록 보관하세요. [소스 2]",
        "3. 주의사항: 갑상선 질환이 있는 친구들은 양배추를 과도하게 생으로 섭취할 경우 호르몬 생성에 방해를 받을 수 있으니 익혀서 적당량만 먹는 것이 건강에 이롭습니다. [소스 2]"
      ]
    },
    {
      name: "매실",
      keyNutrients: "피로를 풀어주는 새콤한 구연산, 유기산, 칼슘, 비타민 [소스 3]",
      growthHelp: "공부하느라 지친 피로를 한방에 풀어주고, 새콤한 맛으로 입맛을 돋우며, 배탈이 나거나 소화가 안 될 때 천연 소화제 역할을 톡톡히 해줘요! [소스 3]",
      cookingTip: {
        scienceSecret: "생매실의 씨앗에는 '아미그달린'이라는 결석이나 해로운 중독을 일으킬 수 있는 성분이 들어있어요. 그렇기 때문에 절대 날것으로 먹으면 안 되고, 설탕에 푹 절여서 매실청으로 만들거나 끓여서 가열해 먹어야 안전하게 영양을 흡수할 수 있답니다! [소스 3]",
        bestPairing: "칼슘 왕 멸치볶음과 최고의 궁합을 자랑해요! 매실의 구연산 성분이 멸치의 단단한 칼슘을 살짝 녹여 우리 몸에 흡수가 엄청 잘 되게 도와줘요! [소스 3]",
        teacherWord: "배가 사르르 아플 때 엄마가 주시던 따뜻한 매실차 기억나니? 매실 속 유기산이 장 속의 나쁜 세균들을 물리쳐 주어 배탈을 막아준단다! 멸치볶음 같은 뼈 튼튼 반찬에 매실청을 한 숟가락 넣으면 뼈가 더 튼튼해져요! [소스 3]"
      },
      safetyAlerts: [
        "1. 씨앗 위생관리: 날개 씨앗 속 아미그달린 독성을 없애기 위해 풋매실을 다룰 때는 꼭 이쑤시개 등으로 꼭지를 따고 깨끗이 세척 후 씨를 발라내거나 100일 이상 발효시켜 숙성해서 드세요! [소스 3]",
        "2. 적정 보관 온도: 신선한 매실은 상온에 두면 금방 말라버리거나 무르므로 신문지에 싸서 5℃ 이하의 냉장실에 보관하는 것이 맞습니다. [소스 3]",
        "3. 주의사항: 위가 예민하거나 위산과다가 있는 친구들은 매실의 강한 산성 때문에 속이 쓰릴 수 있으니 빈 속에 원액을 마시지 말고 물에 충분히 희석해서 마시도록 하세요. [소스 3]"
      ]
    }
  ],
  quiz: [
    {
      question: "양배추에 가득 들어있는 위장 보호 성분(비타민 U)은 펄펄 끓는 국에 넣어서 푹 익혀 먹을 때 가장 효과적으로 흡수된다.",
      answer: false,
      explanation: "양배추의 대표 영양소인 비타민 U는 열에 무척 약해서, 펄펄 끓여 오랫동안 익히면 거의 다 파괴돼요! 생으로 얇게 채 썰어 샐러드로 먹거나, 아주 살짝 찌는 것이 영양 흡수에 최고랍니다! [소스 2]"
    },
    {
      question: "쑥갓에 들어있는 결석을 유발할 수 있는 성분(옥살산)은 끓는 물에 살짝 데치면 줄어들고, 두부와 함께 먹으면 더 안전해진다.",
      answer: true,
      explanation: "맞아요! 쑥갓을 끓는 물에 데치면 옥살산이 물로 녹아 나와 안전해져요. 또한, 두부의 칼슘이 남은 옥살산과 결합하여 몸 밖으로 내보내 주므로 두부와 함께 무쳐 먹는 것은 과학적이고 훌륭한 조리법이랍니다! [소스 1]"
    }
  ],
  lunchChallenge: {
    menuName: "5월의 뼈성장 쑥갓 두부 무침 & 아삭 양배추 쌈밥 [소스 1, 소스 2]",
    description: "싱싱한 제철 쑥갓을 끓는 물에 살짝 데쳐 부드러운 두부와 함께 고소하게 무쳐내고, 비타민 보호를 위해 가볍게 스팀 샤워한 양배추에 영양 쌈장을 곁들인 든든한 쌈밥 급식이에요!",
    benefitReason: "이 챌린지 급식 식단은 5월 쑥갓과 양배추의 생리활성 성분을 파괴 없이 흡수하는 완벽한 조리법을 구현했어요! 쑥갓의 칼슘과 두부의 식물성 단백질이 시너지를 내어 학생들의 성장기 골격을 튼튼하게 해주고 [소스 1], 60℃ 이하 스팀 조리로 양배추의 비타민 U를 지켜내 위를 편안하고 튼튼하게 보듬어 봄철 나른함을 깨우는 5월 최고의 영양 밥상이기 때문입니다 [소스 1, 소스 2]."
  }
};

export default function App() {
  const [seasonalData, setSeasonalData] = useState<SeasonalData>(INITIAL_DATA);

  // Fetch initial data from server on mount to ensure server-client synchronization
  useEffect(() => {
    fetch("/api/seasonal-data")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("API Connection fallback");
      })
      .then((data) => {
        if (data && data.ingredients) {
          setSeasonalData(data);
        }
      })
      .catch((err) => {
        console.log("Using local initial data state:", err);
      });
  }, []);

  const handleDataChange = (newData: SeasonalData) => {
    setSeasonalData(newData);
  };

  return (
    <div className="min-h-screen bg-vibrant-bg text-slate-800 font-sans">
      
      {/* GLOBAL LOGO HEADER */}
      <header className="bg-white border-b-4 border-vibrant-yellow sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-vibrant-orange text-white p-2.5 rounded-2xl shadow-sm">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black text-slate-950 tracking-tight">이달의 제철 보약 창고</h1>
                <span className="text-[10px] bg-vibrant-yellow text-slate-900 font-bold px-2 py-0.5 rounded-full shadow-xs">V1.5 베테랑</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">영양교사의 똑똑한 조리과학 및 모바일 스마트 교육 대시보드</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200">
              {seasonalData.month}월의 식단
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-200 uppercase tracking-wider">
              Nutrition App
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* APP INFO JUMBOTRON */}
        <div className="bg-white border-2 border-vibrant-green text-slate-850 p-6 md:p-8 rounded-3xl shadow-sm mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>15년 차 학교 영양교사 설계 교안 프로젝트</span>
            </div>
            <h2 className="text-xl md:text-2.5xl font-black tracking-tight leading-tight text-slate-900">
              학생들의 주머니 속 스마트폰에 <br className="sm:hidden" />
              오늘 급식의 '제철 보약 영양학'을 주입하세요!
            </h2>
            <p className="text-slate-650 text-xs md:text-sm leading-relaxed font-medium">
              이 웹앱은 학생들이 등하교 시간이나 급식 대기 시간 중에 스마트폰으로 쉽고 재미있게 먹거리의 조리 과학을 깨달을 수 있도록 돕는 실시간 모바일 체험 교육 시스템입니다. <strong>1. NotebookLM 전용 프롬프트 설계</strong>, <strong>2. Gemini AI를 활용한 실시간 교안 추출</strong>, 그리고 <strong>3. 즉시 갱신되는 퀴즈 및 미션</strong>을 한눈에 설계해 보세요.
            </p>
          </div>
          
          {/* Decorative glowing backdrops */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-vibrant-yellow/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-vibrant-green/10 rounded-full blur-2xl"></div>
        </div>

        {/* WORKSPACE & PHONE SCREEN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Nutrition Teacher Studio Workspace (cols 1 to 8) */}
          <div className="lg:col-span-8 h-[760px] flex flex-col">
            <TeacherWorkspace 
              data={seasonalData} 
              onDataChange={handleDataChange} 
            />
          </div>

          {/* RIGHT COLUMN: Live Interactive Student Mobile Phone Simulator (cols 9 to 12) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4">
            
            <div className="text-center">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-center">
                <span>📱 실시간 모바일 학생용 화면 미리보기</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                교사의 수정 및 AI 생성이 여기에 실시간 반영됩니다.
              </p>
            </div>

            <StudentPreview data={seasonalData} />

            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-500 max-w-[340px] text-center justify-center">
              <span className="text-emerald-600">Tip:</span>
              <span>모바일 네비게이션 버튼을 누르면 알림톡, 퀴즈, 급식챌린지로 이동합니다.</span>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <p>© 2026 이달의 제철 보약 창고. 영양교사용 콘텐츠 & 프롬프트 제작소.</p>
          <div className="flex gap-4">
            <span>위생 관리 매뉴얼 준수</span>
            <span>•</span>
            <span>조리 과학적 영양 보증</span>
            <span>•</span>
            <span>Gemini AI powered</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
