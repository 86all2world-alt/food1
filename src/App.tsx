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
  month: 10,
  ingredients: [
    {
      name: "토란",
      keyNutrients: "칼륨, 갈락탄, 비타민 C [소스 1]",
      growthHelp: "노화 방지와 신장 강화: 갈락탄이라는 끈적한 성분이 간과 신장을 튼튼하게 하고 세포를 젊고 건강하게 지켜줘요! [소스 1]",
      cookingTip: {
        scienceSecret: "토란의 아린 맛과 독성은 쌀뜨물에 담가두면 깨끗이 사라져서 더욱 안전하고 맛있게 먹을 수 있습니다. [소스 1]",
        bestPairing: "고소한 들깨와의 조합이 최고예요! 들깨의 필수지방산이 토란의 영양소 흡수를 돕고 깊은 고소함을 한껏 더해준답니다! [소스 1]",
        teacherWord: "토란의 아린 맛과 독성은 쌀뜨물에 담가두면 신기하게 사라진단다! 손질할 땐 가려울 수 있으니 꼭 장갑을 껴야 해요. 고소한 들깨탕으로 만나볼까? [소스 1]"
      },
      safetyAlerts: [
        "1. 독성 제거: 아린 맛과 독성을 없애기 위해 꼭 쌀뜨물에 담가두거나 살짝 데친 후 요리하세요! [소스 1]",
        "2. 손질법 주의: 토란의 뮤신 성분은 피부 가려움증을 유발하니 맨손으로 만지지 말고 장갑을 끼거나 손에 소금을 묻히고 손질하세요! [소스 1]",
        "3. 보관법: 흙이 묻은 채로 신문지에 싸서 서늘하고 그늘진 상온에 보관해야 싱싱하게 오래 먹을 수 있어요. 물기가 닿으면 쉽게 썩는답니다! [소스 1]"
      ]
    },
    {
      name: "밤",
      keyNutrients: "비타민 A, B1, C, 철분 [소스 4]",
      growthHelp: "에너지 팍팍! 피로 회복: 공부하느라 지친 피로를 풀어주고 면역력을 높여 감기를 예방하는 데 최고의 천연 피로회복제예요! [소스 4]",
      cookingTip: {
        scienceSecret: "밤은 생으로 먹으면 전분이 소화되기 어려워 배가 아플 수 있어요! 삶거나 구워 먹으면 전분이 부드러운 당분으로 변해 맛도 좋고 소화 흡수율도 극대화된답니다! [소스 4]",
        bestPairing: "비타민 C가 풍부해 닭고기나 소고기 같은 육류 요리에 넣으면 철분 흡수율을 엄청나게 높이고 고기를 부드럽게 만들어줘요! [소스 4]",
        teacherWord: "알이 도톰하고 반짝반짝 윤기가 흐르는 가을 밤은 공부에 지친 친구들에게 에너지를 가득 불어넣어 준단다! 영양 만점 달콤한 밤을 삶거나 맛있게 구워 먹어보자! [소스 4]"
      },
      safetyAlerts: [
        "1. 신선 보관: 상온에 두면 금방 마르고 벌레가 생기니, 옅은 소금물에 한번 씻은 후 물기를 빼고 5℃ 이하 냉장실에 보관해 주세요! [소스 4]",
        "2. 조리 주의: 군밤을 집에서 구워 먹을 때는 밤껍질에 꼭 칼집을 내야 폭발하지 않고 안전하게 구울 수 있습니다. [소스 4]",
        "3. 적당량 섭취: 영양이 가득한 만큼 전분 함량이 높아 과식하면 소화가 더딜 수 있으니 하루 5~8알 정도 알맞게 먹는 것이 좋습니다."
      ]
    },
    {
      name: "청경채",
      keyNutrients: "베타카로틴, 칼슘, 비타민 C [소스 2]",
      growthHelp: "눈 건강과 키 성장: 눈을 건강하고 맑게 보호하는 베타카로틴 성분과 뼈를 단단하게 세워주는 칼슘이 아주 풍부해 성장을 힘차게 도와줘요! [소스 2]",
      cookingTip: {
        scienceSecret: "청경채 속 눈 건강 성분(베타카로틴)은 기름에 잘 녹는 지용성이랍니다! 그래서 식용유를 한 방울 두르고 볶거나 데쳐 먹어야 몸속 흡수율이 엄청나게 껑충 뛰어올라요! [소스 2]",
        bestPairing: "단백질이 듬뿍 든 소고기나 두부 요리와 찰떡궁합이에요! 청경채의 비타민 C가 소고기의 식물성/동물성 단백질과 철분 흡수를 완벽하게 도와주기 때문이지요! [소스 2]",
        teacherWord: "초록빛 아삭아삭한 청경채는 눈을 아주 맑고 튼튼하게 해준단다! 기름을 아주 살짝만 넣고 빠르게 볶아서 먹으면 소중한 영양소가 온전히 흡수돼요! [소스 2]"
      },
      safetyAlerts: [
        "1. 농약 세척법: 청경채는 잎과 줄기가 겹치는 안쪽에 미세먼지와 농약이 잘 낍니다. 흐르는 물에 밑동을 깨끗이 씻고 잎을 떼어 3회 이상 헹구어 내세요! [소스 88, 89]",
        "2. 보관 온도: 수분이 쉽게 건조해지므로 씻지 않은 상태로 키친타월에 감싸 5℃ 이하 냉장고 야채칸에 세워서 안전하게 보관하세요. [소스 12, 102]",
        "3. 주의사항: 성질이 조금 찬 채소이므로 평소에 아랫배가 차거나 소화가 예민한 친구들은 생으로 많이 먹기보다는 따뜻하게 익혀 먹는 것을 권장합니다."
      ]
    }
  ],
  quiz: [
    {
      question: "토란을 손질할 때 생기는 피부 가려움을 예방하려면 맨손보다는 장갑을 끼거나 손에 소금을 묻히는 것이 좋다.",
      answer: true,
      explanation: "정답이에요! ⭕ 토란의 뮤신 성분은 피부 가려움증을 유발할 수 있기 때문에, 맨손 대신 장갑을 끼거나 손에 소금을 묻혀서 손질해야 안전하고 편안하게 요리할 수 있어요! [소스 1]"
    },
    {
      question: "채소와 과일 등 신선 식품의 나쁜 세균 증식을 막기 위해 보관하는 최적의 냉장 보관 온도는 10℃ 이상이 바람직하다.",
      answer: false,
      explanation: "틀렸어요! ❌ 채소나 과일 같은 신선식품은 식중독 세균 번식을 강력하게 예방하기 위해 반드시 5℃ 이하의 냉장 온도에서 신선하게 보관해야 가장 안전하답니다! [소스 102]"
    }
  ],
  lunchChallenge: {
    menuName: "10월의 두뇌활력 토란 들깨탕 & 청경채 소고기 볶음 [소스 1, 소스 2]",
    description: "아린 맛과 독성을 쌀뜨물로 완벽하게 제거해 부드러워진 토란에 고소하고 필수지방산이 풍부한 들깨 가루를 가득 풀어 끓여낸 영양 만점 들깨탕과, 눈 건강 베타카로틴 흡수를 돕기 위해 단시간에 기름 한 방울로 볶아낸 청경채 소고기 볶음 급식이에요!",
    benefitReason: "이 챌린지 급식 식단은 10월 제철 토란의 독성을 조리 과학적으로 해결하고 영양을 200% 흡수하는 환상적인 구성을 가졌어요! 토란의 신장 건강 성분과 들깨의 두뇌 필수지방산이 만나 환절기 학생들의 체력을 보강하고 [소스 1], 기름에 볶아 청경채의 지용성 베타카로틴 흡수율을 극대화해 성장기 학생들의 눈과 뼈 성장을 힘차게 돕는 10월 최고의 건강 약속 밥상이기 때문입니다 [소스 1, 소스 2]."
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
