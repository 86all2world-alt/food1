import { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Sparkles, 
  Leaf, 
  Apple, 
  ShieldCheck, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  Flame, 
  CheckCircle, 
  Volume2, 
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  UtensilsCrossed,
  Heart
} from "lucide-react";
import { SeasonalData, Ingredient } from "../types";

interface StudentPreviewProps {
  data: SeasonalData;
}

export default function StudentPreview({ data }: StudentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "alerts" | "quiz" | "lunch">("ingredients");
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  
  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean | null>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Lunch Challenge State
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showChallengeCelebration, setShowChallengeCelebration] = useState(false);

  // Reset quiz when data changes
  useEffect(() => {
    setCurrentQuizIdx(0);
    setUserAnswers({});
    setQuizFinished(false);
    setScore(0);
  }, [data]);

  const handleQuizAnswer = (answer: boolean) => {
    const isCorrect = answer === data.quiz[currentQuizIdx].answer;
    const nextAnswers = { ...userAnswers, [currentQuizIdx]: answer };
    setUserAnswers(nextAnswers);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuizIdx < data.quiz.length - 1) {
        setCurrentQuizIdx(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1800);
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setUserAnswers({});
    setQuizFinished(false);
    setScore(0);
  };

  const handleLunchChallenge = () => {
    setChallengeCompleted(true);
    setShowChallengeCelebration(true);
    setTimeout(() => {
      setShowChallengeCelebration(false);
    }, 3500);
  };

  return (
    <div className="relative mx-auto max-w-[370px] w-full min-h-[700px] h-[760px] bg-slate-950 rounded-[48px] border-[12px] border-slate-900 shadow-2xl overflow-hidden flex flex-col font-sans select-none">
      
      {/* PHONE STATUS BAR */}
      <div className="absolute top-0 inset-x-0 h-10 bg-slate-900 z-30 flex items-center justify-between px-6 select-none">
        <div className="text-xs font-semibold text-slate-300">12:30</div>
        {/* Dynamic Speaker Notch */}
        <div className="w-24 h-5 bg-slate-950 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-2 bg-emerald-500 rounded-xs"></div>
          <div className="text-[10px] text-slate-400">98%</div>
        </div>
      </div>

      {/* APP HEADER */}
      <div className="pt-12 pb-3.5 bg-vibrant-orange px-4 text-white flex items-center justify-between shadow-md z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-white/25 p-1.5 rounded-xl">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight">이달의 보약창고</h1>
            <p className="text-[9px] text-orange-50 font-medium">영양 쌤의 스마트 밥상</p>
          </div>
        </div>
        <div className="bg-vibrant-yellow text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
          {data.month}월 제철
        </div>
      </div>

      {/* PHONE INNER BODY CONTAINER */}
      <div className="flex-1 bg-vibrant-bg overflow-y-auto px-4 py-4 pb-20 relative text-slate-800">
        
        {/* TAB 1: INGREDIENTS */}
        {activeTab === "ingredients" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-white border-2 border-vibrant-green p-3.5 rounded-3xl flex items-start gap-2.5 shadow-sm">
              <Sparkles className="w-5 h-5 text-vibrant-orange shrink-0 mt-0.5 animate-pulse" />
              <p className="text-xs text-slate-700 leading-relaxed font-bold">
                우와! 계절이 바뀌면서 보물 상자처럼 우리 몸에 좋은 제철 음식이 듬뿍 열렸어요! 오늘 식탁의 비밀을 알아볼까요?
              </p>
            </div>

            <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1">
              🌿 {data.month}월의 3대 건강 파트너
            </h2>

            <div className="space-y-3">
              {data.ingredients.map((ing, i) => (
                <motion.div
                  key={ing.name}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIngredient(ing)}
                  className="bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm hover:border-vibrant-green/35 hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black shadow-xs"
                         style={{ 
                           backgroundColor: i === 0 ? "#4ADE80" : i === 1 ? "#FB923C" : "#60A5FA",
                           color: "#ffffff"
                         }}>
                      {ing.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800">{ing.name}</h3>
                      <p className="text-[11px] text-slate-500 font-semibold truncate max-w-[160px]">
                        {ing.keyNutrients.split('[')[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl">
                    <span className="text-[10px] text-vibrant-orange font-extrabold">비결보기</span>
                    <ChevronRight className="w-3.5 h-3.5 text-vibrant-orange" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick growth benefit card */}
            <div className="bg-white rounded-3xl p-4 border-2 border-vibrant-blue/20 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-vibrant-blue font-black text-xs">
                <Heart className="w-4 h-4 text-vibrant-orange fill-vibrant-orange" />
                <span>성장기 보약 요약 한눈에 보기</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-[10px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-black">
                      <th className="p-2.5 border-b border-slate-100">재료</th>
                      <th className="p-2.5 border-b border-slate-100">영양 효능</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ingredients.map((ing) => (
                      <tr key={ing.name} className="hover:bg-slate-50/50">
                        <td className="p-2.5 border-b border-slate-100 font-extrabold text-slate-850">{ing.name}</td>
                        <td className="p-2.5 border-b border-slate-100 text-slate-650 leading-normal font-medium">
                          {ing.growthHelp.split('[')[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: ALERTS (KAKAO TALK NOTIFICATION STYLE) */}
        {activeTab === "alerts" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="text-center py-1">
              <span className="bg-vibrant-orange/15 text-vibrant-orange text-[10px] px-3.5 py-1 rounded-full font-extrabold border border-vibrant-orange/20">
                안전 영양 알림톡 🔔
              </span>
            </div>

            {/* Teacher Message Header */}
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-full bg-vibrant-orange border-2 border-white shadow-md flex items-center justify-center text-white text-base shrink-0">
                👩‍🏫
              </div>
              <div className="space-y-1.5 max-w-[80%]">
                <div className="text-[11px] font-black text-slate-500">영양 쌤의 밥상 안전 도우미</div>
                <div className="bg-white p-3.5 rounded-3xl rounded-tl-xs shadow-sm border-2 border-slate-100 text-xs text-slate-800 leading-relaxed font-semibold">
                  <p className="font-extrabold text-vibrant-orange mb-1">📢 친구들, 건강한 섭취 수칙을 약속해요!</p>
                  아무리 뛰어난 보약 식재료도 올바른 손질법과 세척법을 지키지 않으면 탈이 날 수 있답니다. 영양 쌤이 정리한 수칙을 꼭 기억하세요!
                </div>
              </div>
            </div>

            {/* Ingredient specific alert cards */}
            <div className="space-y-3 pl-11">
              {data.ingredients.map((ing, i) => (
                <div key={ing.name} className="bg-white border-2 p-3.5 rounded-3xl shadow-sm space-y-2"
                     style={{ 
                       borderColor: i === 0 ? "#4ADE80" : i === 1 ? "#FB923C" : "#60A5FA"
                     }}>
                  <div className="flex items-center gap-1.5 text-xs font-black"
                       style={{ 
                         color: i === 0 ? "#16a34a" : i === 1 ? "#ea580c" : "#2563eb"
                       }}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{ing.name} 먹을 때 안전 규칙</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-700 leading-relaxed font-medium">
                    {ing.safetyAlerts.map((alert, idx) => (
                      <p key={idx} className="pl-1">
                        {alert}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: OX QUIZ GAME */}
        {activeTab === "quiz" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-vibrant-blue p-4 rounded-3xl text-white shadow-sm space-y-1 text-center">
              <h2 className="text-sm font-black tracking-tight">❓ 영양 쑥쑥! O/X 퀴즈 게임</h2>
              <p className="text-[10px] text-blue-50 font-bold">오늘 배운 내용으로 건강 지식을 레벨업 해봐요!</p>
            </div>

            <AnimatePresence mode="wait">
              {!quizFinished ? (
                <motion.div 
                  key={currentQuizIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border-2 border-vibrant-yellow/40 shadow-sm rounded-3xl p-5 space-y-5"
                >
                  <div className="flex justify-between items-center text-xs font-black text-slate-400">
                    <span>문제 {currentQuizIdx + 1} / {data.quiz.length}</span>
                    <span className="bg-vibrant-blue/10 text-vibrant-blue px-2.5 py-0.5 rounded-full">
                      점수: {score}점
                    </span>
                  </div>

                  {/* Question Bubble */}
                  <div className="text-center py-4 px-2 min-h-[90px] flex items-center justify-center">
                    <p className="text-sm font-black text-slate-800 leading-relaxed">
                      " {data.quiz[currentQuizIdx].question} "
                    </p>
                  </div>

                  {/* Answer Response Overlay */}
                  {userAnswers[currentQuizIdx] !== undefined && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-2xl text-center text-xs font-bold leading-relaxed shadow-inner border"
                      style={{
                        backgroundColor: (userAnswers[currentQuizIdx] === data.quiz[currentQuizIdx].answer) ? "#f0fdf4" : "#fef2f2",
                        borderColor: (userAnswers[currentQuizIdx] === data.quiz[currentQuizIdx].answer) ? "#bbf7d0" : "#fca5a5",
                        color: (userAnswers[currentQuizIdx] === data.quiz[currentQuizIdx].answer) ? "#166534" : "#991b1b"
                      }}
                    >
                      <div className="text-sm font-black mb-1">
                        {userAnswers[currentQuizIdx] === data.quiz[currentQuizIdx].answer ? "🎉 정답이에요! 참 잘했어요!" : "🥲 아쉬워요! 틀렸어요!"}
                      </div>
                      <p className="font-semibold text-[10.5px]">
                        {data.quiz[currentQuizIdx].explanation}
                      </p>
                    </motion.div>
                  )}

                  {/* Input Buttons */}
                  {userAnswers[currentQuizIdx] === undefined && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <button
                        onClick={() => handleQuizAnswer(true)}
                        className="bg-vibrant-green hover:bg-green-500 text-white font-black text-3xl py-5 rounded-2xl shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-1 border-b-4 border-green-600"
                      >
                        O
                        <span className="text-xs font-bold">그렇다</span>
                      </button>
                      <button
                        onClick={() => handleQuizAnswer(false)}
                        className="bg-vibrant-orange hover:bg-orange-500 text-white font-black text-3xl py-5 rounded-2xl shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-1 border-b-4 border-orange-600"
                      >
                        X
                        <span className="text-xs font-bold">아니다</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-2 border-vibrant-blue/30 shadow-md rounded-3xl p-6 text-center space-y-5"
                >
                  <div className="w-16 h-16 bg-vibrant-yellow text-slate-900 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm border border-vibrant-yellow/40">
                    🏆
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800">퀴즈 완주 성공!</h3>
                    <p className="text-xs text-slate-500 font-bold">지식을 한 단계 끌어올린 제철 영양 탐험가!</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                    <div className="text-[11px] text-slate-400 font-extrabold uppercase">최종 성적</div>
                    <div className="text-2xl font-black text-slate-800 my-1">{score} / {data.quiz.length} 맞춤</div>
                    <div className="text-[10px] text-vibrant-orange font-black">
                      {score === data.quiz.length ? "💯 완벽해요! 제철 영양 박사 학위 수여!" : "👍 훌륭해요! 조금 더 공부하면 박사님이 될 수 있어요!"}
                    </div>
                  </div>

                  <button
                    onClick={resetQuiz}
                    className="w-full bg-vibrant-blue hover:bg-blue-600 text-white text-xs font-black py-3.5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-1.5 border-b-4 border-blue-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    다시 풀어보기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB 4: LUNCH CHALLENGE */}
        {activeTab === "lunch" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-white border-2 border-vibrant-yellow p-4.5 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-vibrant-orange font-black text-xs">
                <UtensilsCrossed className="w-4.5 h-4.5" />
                <span>오늘의 급식 챌린지 🍱</span>
              </div>
              <h3 className="text-sm font-black text-slate-800 leading-normal bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {data.lunchChallenge.menuName}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {data.lunchChallenge.description}
              </p>
            </div>

            {/* Why is this diet the best? */}
            <div className="bg-white rounded-3xl p-4 border-2 border-vibrant-green/20 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-vibrant-green font-black text-xs">
                <Volume2 className="w-4 h-4 text-vibrant-green" />
                <span>영양교사 쌤의 식단 조리 과학 해설</span>
              </div>
              <div className="p-3 bg-vibrant-bg/60 rounded-2xl border border-vibrant-yellow/15 text-[11px] text-slate-700 leading-relaxed font-semibold">
                {data.lunchChallenge.benefitReason}
              </div>
            </div>

            {/* Interactive Challenge Button */}
            {!challengeCompleted ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLunchChallenge}
                className="w-full bg-vibrant-orange hover:bg-orange-500 text-white font-black text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-orange-600"
              >
                <Flame className="w-4 h-4 text-vibrant-yellow animate-pulse" />
                <span>오늘 급식 남기지 않고 다 먹기 약속! 🤙</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-vibrant-green text-slate-900 text-center p-4 rounded-3xl border-2 border-green-500 shadow-md space-y-1.5"
              >
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mx-auto text-slate-900 shadow-xs">
                  <CheckCircle className="w-5 h-5 text-slate-900" />
                </div>
                <div className="text-xs font-black">약속 완료! 싹싹 먹기 성공 도장 쾅!</div>
                <p className="text-[10px] text-emerald-950 font-bold">급식을 남기지 않고 건강도 지켰으니, 참 영양가 있는 날이에요! 😊</p>
              </motion.div>
            )}

            {/* Confetti celebration */}
            {showChallengeCelebration && (
              <div className="absolute inset-0 bg-slate-950/70 z-50 flex flex-col items-center justify-center text-center p-6 text-white overflow-hidden pointer-events-none">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-3"
                >
                  <div className="text-5xl">🎉👏</div>
                  <h4 className="text-lg font-black text-vibrant-yellow">급식 싹싹 비우기 달인!</h4>
                  <p className="text-xs text-slate-200 font-bold">성장기 건강 보약을 완벽하게 보충했습니다!</p>
                  <div className="text-[10px] text-yellow-100 font-black">뼈 건강 +10 | 소화 촉진 +10 | 피로 회복 +10</div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

      </div>

      {/* INGREDIENT DETAIL MODAL/DRAWER */}
      <AnimatePresence>
        {selectedIngredient && (
          <>
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIngredient(null)}
              className="absolute inset-0 bg-black z-40"
            />
            {/* Modal Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-x-0 bottom-0 max-h-[82%] bg-white rounded-t-[36px] border-t-4 border-vibrant-yellow z-50 flex flex-col text-slate-800 shadow-xl"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 shrink-0"></div>
              
              <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-vibrant-orange bg-vibrant-orange/10 px-2.5 py-1 rounded-full">
                      제철 보약
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1.5">{selectedIngredient.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedIngredient(null)}
                    className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Growth Benefit Row */}
                <div className="bg-vibrant-green/10 p-3.5 rounded-2xl border-2 border-vibrant-green/20 space-y-1">
                  <div className="text-[10px] font-black text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-vibrant-orange" />
                    <span>성장기 어린이 영양 보충</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-bold">
                    {selectedIngredient.growthHelp}
                  </p>
                </div>

                {/* Science Cooking Tip Box */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-slate-600 border-l-4 border-vibrant-blue pl-2">
                    💡 똑똑 조리 과학 비결 (영양 효율 극대화)
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-[11px] text-slate-600 leading-relaxed space-y-2 font-medium">
                    <div>
                      <span className="font-bold text-slate-800 text-xs">조리 과학 비결:</span>
                      <p className="mt-0.5 font-semibold text-slate-700">{selectedIngredient.cookingTip.scienceSecret}</p>
                    </div>
                    <div className="border-t border-slate-200/60 pt-2">
                      <span className="font-bold text-slate-800 text-xs">최고의 조합 음식:</span>
                      <p className="mt-0.5 text-slate-800 font-extrabold">
                        🌟 {selectedIngredient.cookingTip.bestPairing}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Teacher's Word Bubble */}
                <div className="bg-vibrant-yellow/15 border-2 border-vibrant-yellow/35 p-3.5 rounded-3xl rounded-tr-xs relative shadow-xs">
                  <div className="text-[10px] font-black text-amber-800 mb-1">
                    👩‍🏫 영양 선생님의 건강 한마디!
                  </div>
                  <p className="text-[11px] text-slate-800 leading-relaxed italic font-bold">
                    "{selectedIngredient.cookingTip.teacherWord}"
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PHONE NAVIGATION BAR (FIXED BOTTOM) */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-100 z-30 flex items-center justify-around px-2 py-1 shrink-0">
        <button 
          onClick={() => { setActiveTab("ingredients"); setSelectedIngredient(null); }}
          className="flex flex-col items-center gap-1 text-slate-400 font-extrabold transition-colors cursor-pointer"
          style={{ color: activeTab === "ingredients" ? "#FB923C" : undefined }}
        >
          <Leaf className="w-5 h-5" />
          <span className="text-[9px]">보약창고</span>
        </button>

        <button 
          onClick={() => { setActiveTab("alerts"); setSelectedIngredient(null); }}
          className="flex flex-col items-center gap-1 text-slate-400 font-extrabold transition-colors cursor-pointer relative"
          style={{ color: activeTab === "alerts" ? "#FB923C" : undefined }}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[9px]">안전알림</span>
          <span className="absolute top-0 right-1 w-2 h-2 bg-vibrant-orange rounded-full animate-ping"></span>
        </button>

        <button 
          onClick={() => { setActiveTab("quiz"); setSelectedIngredient(null); }}
          className="flex flex-col items-center gap-1 text-slate-400 font-extrabold transition-colors cursor-pointer"
          style={{ color: activeTab === "quiz" ? "#FB923C" : undefined }}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[9px]">O/X퀴즈</span>
        </button>

        <button 
          onClick={() => { setActiveTab("lunch"); setSelectedIngredient(null); }}
          className="flex flex-col items-center gap-1 text-slate-400 font-extrabold transition-colors cursor-pointer"
          style={{ color: activeTab === "lunch" ? "#FB923C" : undefined }}
        >
          <Award className="w-5 h-5" />
          <span className="text-[9px]">급식미션</span>
        </button>
      </div>

    </div>
  );
}
