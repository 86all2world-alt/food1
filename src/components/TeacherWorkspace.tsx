import { useState, useEffect } from "react";
import { 
  Copy, 
  Check, 
  Wand2, 
  FileText, 
  Sliders, 
  Edit3, 
  AlertCircle, 
  HelpCircle, 
  Plus, 
  Trash2, 
  RefreshCw,
  Clock,
  BookOpen,
  Info
} from "lucide-react";
import { SeasonalData, Ingredient, QuizItem } from "../types";

interface TeacherWorkspaceProps {
  data: SeasonalData;
  onDataChange: (newData: SeasonalData) => void;
}

export default function TeacherWorkspace({ data, onDataChange }: TeacherWorkspaceProps) {
  // Prompt builder options
  const [selectedMonth, setSelectedMonth] = useState(data.month);
  const [gradeLevel, setGradeLevel] = useState("초등학생");
  const [focusTopic, setFocusTopic] = useState("성장기 건강");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);

  // Gemini generator state
  const [sourceText, setSourceText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatusMessage, setGenStatusMessage] = useState("");
  const [generatorError, setGeneratorError] = useState("");

  // Tabs inside workspace
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"prompt" | "generator" | "editor">("prompt");

  // Sample sources for quick copy-pasting
  const sampleSpringSource = `[소스 1] 5월 제철 채소인 쑥갓은 칼슘과 비타민 A가 매우 풍부하여 급성장기 어린이의 골격 형성과 눈 건강에 탁월한 효능이 입증되었습니다. 그러나 쑥갓은 결석을 유발할 수 있는 성분인 옥살산을 소량 함유하고 있으므로, 단체급식에서는 반드시 끓는 물에 살짝 데쳐 옥살산을 수용성 형태로 배출시킨 후 조리하여야 안전성이 극대화됩니다. 특히 식물성 고단백 식품인 두부와 함께 조리할 시 두부의 풍부한 칼슘이 쑥갓의 미량 잔류 옥살산과 결합하여 체외 배출을 돕고 두부 자체의 단백질 흡수율도 상승하는 영양학적 상호 작용(시너지)을 가집니다. 위생 측면에서 쑥갓은 흐르는 물에 최소 3회 이상 전처리 세척을 시행하여 잔류농약과 겉면의 흙먼지를 제거해야 하며, 보관 시에는 건조를 막고 품질을 유지하기 위해 5℃ 이하의 온도조건에서 보관해야 신선함이 오랫동안 보존됩니다.

[소스 2] 양배추의 특이 성분인 비타민 U(S-Methylmethionine)는 위장 점막을 강화하고 손상된 위벽을 보듬어 주어 성장기 위염 예방과 원활한 영양소 소화흡수를 돕는 데 기여합니다. 하지만 비타민 U는 열민감성이 매우 높아, 끓는 온도의 장시간 열처리를 거칠 시 약 90% 이상이 손실됩니다. 따라서 영양소 소실을 막기 위해 양배추는 가급적 생으로 가늘게 채를 썰어 샐러드로 섭취하거나, 스팀 보일러를 사용하더라도 60℃ 이하의 미온 증기로 살짝만 쪄서 세포 조직과 비타민 U를 온전히 유지하도록 설계하는 것이 급식 조리의 핵심 비결입니다. 양배추는 자몽이나 오렌지와 같이 산성이 강하고 비타민 C가 풍부한 과일군과 혼합할 때 영양소 파괴를 막고 철분 및 칼슘의 체내 생체이용률을 극대화할 수 있습니다. 위생 관리법으로 양배추는 잔류 농약 위험이 높은 겉잎을 2~3장 도려낸 뒤 5℃ 이하의 냉장고에 보존하되, 갑상선 질환을 가진 소아 환자의 경우 생 섭취가 갑상선 호르몬 작용을 소폭 저해할 우려가 있으므로 해당 학생은 데치거나 찌는 가공처리를 거친 식재료 제공이 권장됩니다.

[소스 3] 5월의 대표 과실인 매실은 풍부한 유기산과 새콤한 구연산(Citric acid)을 함유하여 성장기 청소년들의 학업 피로를 해소하고 소화액 분비를 원활히 촉진합니다. 하지만 완전히 익지 않은 날 매실 씨앗 내부에는 청색 유독 성분인 아미그달린(Amygdalin)이 존재하므로 소아 섭취 시 아미그달린 중독 우려와 위장 장애를 유발할 위험이 있어 절대 날것으로 원과를 섭취해서는 안 되며, 반드시 설탕과의 가열 절임(매실청 가공)이나 끓여 마시는 등의 탈독 가열 처리를 거쳐야 안전합니다. 매실청은 멸치볶음 등 뼈 강화 영양소인 칼슘이 듬뿍 든 반반찬에 물엿 대신 가미할 때, 매실의 유기산이 멸치의 불용성 칼슘을 수용성으로 전환시켜 성장기 뼈 건강 칼슘 흡수율을 드라마틱하게 극대화합니다. 매실 원액은 산도가 매우 높으므로 위산 과다 질환자나 약한 위장의 아동은 희석 없이 마실 경우 속쓰림을 유발할 수 있어 주의가 요구되며, 보관 시 신선도 하락 및 무름 현상을 방지하기 위해 5℃ 이하 냉장실에 안착시켜야 신선도를 유지할 수 있습니다.`;

  // Fetch customizable prompt template
  const fetchPrompt = async () => {
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: selectedMonth,
          gradeLevel,
          focusTopic
        })
      });
      const data = await res.json();
      setGeneratedPrompt(data.prompt);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, [selectedMonth, gradeLevel, focusTopic]);

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  // Run server-side Gemini Content Generation
  const generateWithGemini = async () => {
    if (!sourceText.trim()) {
      setGeneratorError("분석할 소스 텍스트를 입력해 주세요!");
      return;
    }

    setIsGenerating(true);
    setGeneratorError("");
    
    // Stagger status messages for beautiful loading feel
    const statuses = [
      "영양 교안의 과학적 근거를 수집하는 중...",
      "초등학생 눈높이에 맞춰 전문 의학 용어 필터링 중...",
      "쑥갓, 양배추 등의 영양 조리 과학 비결 추출 중...",
      "출처 인용문([소스 번호]) 검증 및 정합성 체크 중...",
      "O/X 퀴즈 및 정답 해설 생성 마무리 단계..."
    ];
    let statusIdx = 0;
    setGenStatusMessage(statuses[0]);
    const interval = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      setGenStatusMessage(statuses[statusIdx]);
    }, 2500);

    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText,
          month: selectedMonth,
          gradeLevel
        })
      });

      const responseData = await res.json();
      clearInterval(interval);

      if (res.status === 200 && responseData.success) {
        onDataChange(responseData.data);
        setActiveWorkspaceTab("editor");
        // Scroll or alert
      } else {
        setGeneratorError(responseData.error || "콘텐츠 생성을 완료하지 못했습니다.");
        if (responseData.data) {
          // Serve fallback mock
          onDataChange(responseData.data);
        }
      }
    } catch (err: any) {
      clearInterval(interval);
      setGeneratorError(`네트워크 오류가 발생했습니다: ${err.message || err}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Local state helper handlers to update data manually
  const updateIngredientField = (index: number, field: keyof Ingredient, value: any) => {
    const updatedIngredients = [...data.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };
    onDataChange({
      ...data,
      ingredients: updatedIngredients
    });
  };

  const updateCookingTipField = (index: number, field: keyof Ingredient["cookingTip"], value: string) => {
    const updatedIngredients = [...data.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      cookingTip: {
        ...updatedIngredients[index].cookingTip,
        [field]: value
      }
    };
    onDataChange({
      ...data,
      ingredients: updatedIngredients
    });
  };

  const updateSafetyAlert = (ingIndex: number, alertIndex: number, value: string) => {
    const updatedIngredients = [...data.ingredients];
    const newAlerts = [...updatedIngredients[ingIndex].safetyAlerts];
    newAlerts[alertIndex] = value;
    updatedIngredients[ingIndex] = {
      ...updatedIngredients[ingIndex],
      safetyAlerts: newAlerts
    };
    onDataChange({
      ...data,
      ingredients: updatedIngredients
    });
  };

  const updateQuizField = (index: number, field: keyof QuizItem, value: any) => {
    const updatedQuiz = [...data.quiz];
    updatedQuiz[index] = {
      ...updatedQuiz[index],
      [field]: value
    };
    onDataChange({
      ...data,
      quiz: updatedQuiz
    });
  };

  const updateLunchField = (field: "menuName" | "description" | "benefitReason", value: string) => {
    onDataChange({
      ...data,
      lunchChallenge: {
        ...data.lunchChallenge,
        [field]: value
      }
    });
  };

  return (
    <div className="flex flex-col bg-white rounded-3xl border-2 border-slate-200/80 shadow-md h-full overflow-hidden">
      
      {/* WORKSPACE HEADER */}
      <div className="bg-vibrant-bg/80 border-b-2 border-slate-200 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-vibrant-orange text-white font-black px-3 py-1.5 rounded-xl uppercase shadow-xs">
            Nutrition Teacher Studio 👩‍🏫
          </span>
          <h2 className="text-lg font-black text-slate-900 mt-2">
            영양교사 제철 교육용 콘텐츠 설계 허브
          </h2>
        </div>
        
        {/* TAB CHOOSER */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200/60 self-start md:self-auto text-xs font-black">
          <button
            onClick={() => setActiveWorkspaceTab("prompt")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeWorkspaceTab === "prompt" ? "bg-vibrant-orange text-white shadow-xs border-b-2 border-orange-700" : "text-slate-500 hover:text-slate-800"}`}
          >
            1. NotebookLM 프롬프트
          </button>
          <button
            onClick={() => setActiveWorkspaceTab("generator")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeWorkspaceTab === "generator" ? "bg-vibrant-blue text-slate-900 shadow-xs border-b-2 border-blue-400 font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
          >
            2. Gemini AI 실시간 추출
          </button>
          <button
            onClick={() => setActiveWorkspaceTab("editor")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeWorkspaceTab === "editor" ? "bg-vibrant-green text-slate-900 shadow-xs border-b-2 border-emerald-400 font-extrabold" : "text-slate-500 hover:text-slate-800"}`}
          >
            3. 교안 수동 편집기
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ======================= TAB 1: PROMPT BUILDER ======================= */}
        {activeWorkspaceTab === "prompt" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-vibrant-green/10 border-2 border-vibrant-green/25 p-4.5 rounded-3xl flex gap-3">
              <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 space-y-1.5 font-bold">
                <p className="font-black text-emerald-800">NotebookLM과 찰떡궁합인 프롬프트 양식입니다!</p>
                학교 현장에서 배포된 제철 식재료 위생 매뉴얼이나 주간 교육안 PDF를 NotebookLM에 추가하신 뒤, 이 정제된 조리과학 교육용 프롬프트를 입력하면 아이들 모바일에서 쉽게 볼 수 있는 교안이 근거 기반으로 뚝딱 완성됩니다.
              </div>
            </div>

            {/* Prompt Parameter Adjustments */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-3xl border-2 border-slate-200/80">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  교육 타겟 월(Month)
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setSelectedMonth(m);
                    onDataChange({ ...data, month: m });
                  }}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-700 font-bold focus:outline-vibrant-orange focus:border-vibrant-orange transition-all"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{m}월</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-600 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  학생 연령/학교 레벨
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-700 font-bold focus:outline-vibrant-orange focus:border-vibrant-orange transition-all"
                >
                  <option value="초등학생">초등학생 (쉬운 구어체 표현)</option>
                  <option value="중학생">중학생 (직관적 설명)</option>
                  <option value="고등학생">고등학생 (화학식 및 생명과학 중심)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-600 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-slate-400" />
                  주요 건강 주제/타겟
                </label>
                <select
                  value={focusTopic}
                  onChange={(e) => setFocusTopic(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-700 font-bold focus:outline-vibrant-orange focus:border-vibrant-orange transition-all"
                >
                  <option value="성장기 건강 (뼈 & 키성장)">성장기 건강 (뼈 & 키성장)</option>
                  <option value="두뇌 촉진 및 학습력 증진">두뇌 촉진 및 학습력 증진</option>
                  <option value="춘곤증 극복 & 피로 회복">춘곤증 극복 & 피로 회복</option>
                  <option value="식중독 예방 및 장 소화기능 케어">식중독 예방 및 장 소화기능 케어</option>
                </select>
              </div>
            </div>

            {/* Prompt View Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider pl-1">
                  생성된 맞춤형 NotebookLM 프롬프트
                </h3>
                <button
                  onClick={copyPromptToClipboard}
                  className="bg-vibrant-orange hover:bg-orange-500 text-white text-xs font-black px-4.5 py-2.5 rounded-2xl transition-all active:translate-y-[2px] border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  {promptCopied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                      <span>프롬프트 전체 복사</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  value={generatedPrompt}
                  className="w-full h-80 bg-slate-900 text-slate-100 font-mono text-xs p-5 rounded-3xl leading-relaxed focus:outline-none border-2 border-slate-950 shadow-inner"
                />
                <div className="absolute bottom-4 right-4 bg-slate-800 text-slate-400 text-[10px] px-2.5 py-1 rounded font-mono font-bold">
                  Read Only
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: GEMINI LIVE EXTRACTOR ======================= */}
        {activeWorkspaceTab === "generator" && (
          <div className="space-y-5 max-w-4xl">
            <div className="bg-vibrant-bg border-2 border-vibrant-blue/20 p-5 rounded-3xl space-y-2 text-xs font-semibold shadow-sm">
              <p className="font-black text-slate-900 text-[13px] flex items-center gap-1.5 text-vibrant-orange">
                <span>🤖 실시간 Gemini AI 교육 교안 추출 및 생성기</span>
              </p>
              <p className="text-slate-600 leading-relaxed font-bold">
                제철 안내서나 위생 매뉴얼의 텍스트 본문을 아래에 입력하세요. <strong>Gemini 2.5-flash</strong>가 15년 차 노하우를 발휘해 사실에 입각한 인용구([소스 번호]) 삽입, 아동용 단어 필터링, 상호작용 OX 퀴즈를 자동으로 작성하여 실시간으로 모바일 학생 앱을 갱신해 줍니다!
              </p>
            </div>

            {/* Paste Button Helpers */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-slate-500 font-black">빠른 테스트용 샘플 소스 주입:</span>
              <button
                onClick={() => setSourceText(sampleSpringSource)}
                className="bg-vibrant-blue/10 text-blue-900 hover:bg-vibrant-blue/20 border-2 border-vibrant-blue/30 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-xs active:translate-y-[1px]"
              >
                🌱 5월 봄철 소스 (쑥갓, 양배추, 매실) 자동 붙여넣기
              </button>
            </div>

            {/* Input area */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-600 pl-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-vibrant-orange" />
                분석할 가이드 문서 원문 텍스트 (텍스트 파일, 공문, 교본 등에서 복사)
              </label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="[여기에 제철 농산물 성분 가이드, 단체 급식 주간 식재료 안전 위생 매뉴얼 등 원문 텍스트를 기입해 주세요...]"
                className="w-full h-72 bg-white border-2 border-slate-200 rounded-3xl p-4 text-xs font-semibold leading-relaxed focus:outline-vibrant-orange focus:border-vibrant-orange shadow-xs"
              />
            </div>

            {/* Error notifications */}
            {generatorError && (
              <div className="bg-red-50 border-2 border-red-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{generatorError}</p>
              </div>
            )}

            {/* Generate Action Button */}
            <div className="flex items-center gap-3">
              <button
                disabled={isGenerating}
                onClick={generateWithGemini}
                className="bg-vibrant-green hover:bg-emerald-400 disabled:bg-slate-300 text-slate-900 font-black text-xs px-6 py-4.5 rounded-2xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center gap-2 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-slate-900 animate-spin" />
                    <span>AI 영양 분석 교안 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-vibrant-orange" />
                    <span>Gemini AI로 교육자료 자동 생성</span>
                  </>
                )}
              </button>

              {isGenerating && (
                <div className="text-xs text-vibrant-orange font-black flex items-center gap-2 animate-pulse">
                  <span className="w-2.5 h-2.5 bg-vibrant-orange rounded-full animate-ping"></span>
                  <span>{genStatusMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 3: VISUAL EDITOR (MANUAL) ======================= */}
        {activeWorkspaceTab === "editor" && (
          <div className="space-y-6 max-w-5xl">
            <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>실시간 모바일 앱과 연결되어 있습니다. 아래 텍스트를 고치는 순간 좌측 스마트폰 미리보기 화면이 즉각 바뀝니다!</span>
            </div>

            {/* Part A: Seasonal Ingredients List */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[10px] p-1.5 rounded-md">Part A</span>
                3대 식재료 및 똑똑 조리팁 편집
              </h3>

              <div className="grid grid-cols-1 gap-6">
                {data.ingredients.map((ing, ingIdx) => (
                  <div key={ingIdx} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-xs font-black text-emerald-700">식재료 #{ingIdx + 1}</span>
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => updateIngredientField(ingIdx, "name", e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-800 focus:outline-emerald-500"
                        placeholder="재료명 (예: 쑥갓)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: General Info */}
                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">핵심 영양소</label>
                          <input
                            type="text"
                            value={ing.keyNutrients}
                            onChange={(e) => updateIngredientField(ingIdx, "keyNutrients", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">어린이 성장에 주는 효능</label>
                          <textarea
                            value={ing.growthHelp}
                            onChange={(e) => updateIngredientField(ingIdx, "growthHelp", e.target.value)}
                            className="w-full h-20 bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Right: Cooking Science tips */}
                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">영양 흡수 조리 과학 비결 (똑똑 조리팁)</label>
                          <textarea
                            value={ing.cookingTip.scienceSecret}
                            onChange={(e) => updateCookingTipField(ingIdx, "scienceSecret", e.target.value)}
                            className="w-full h-16 bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">최고의 조합 식재료 궁합</label>
                          <input
                            type="text"
                            value={ing.cookingTip.bestPairing}
                            onChange={(e) => updateCookingTipField(ingIdx, "bestPairing", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">영양 교사 쌤의 다정한 한마디</label>
                          <input
                            type="text"
                            value={ing.cookingTip.teacherWord}
                            onChange={(e) => updateCookingTipField(ingIdx, "teacherWord", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Part A-3: Safety Alerts */}
                    <div className="border-t border-slate-200/50 pt-3 space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                        <span>⚠️ 안전 관리 알림톡 (세척, 보관법, 특정 대상 주의사항)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {ing.safetyAlerts.map((alert, alertIdx) => (
                          <div key={alertIdx} className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold">수칙 #{alertIdx + 1}</span>
                            <textarea
                              value={alert}
                              onChange={(e) => updateSafetyAlert(ingIdx, alertIdx, e.target.value)}
                              className="w-full h-16 bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Part B: OX Quiz List */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[10px] p-1.5 rounded-md">Part B</span>
                상호작용 영양 O/X 퀴즈 편집
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">퀴즈 문항 #{qIdx + 1}</span>
                      <div className="flex bg-slate-200 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          onClick={() => updateQuizField(qIdx, "answer", true)}
                          className={`px-2 py-1 rounded-md transition-all ${q.answer ? "bg-emerald-500 text-white" : "text-slate-500"}`}
                        >
                          정답 O
                        </button>
                        <button
                          onClick={() => updateQuizField(qIdx, "answer", false)}
                          className={`px-2 py-1 rounded-md transition-all ${!q.answer ? "bg-red-500 text-white" : "text-slate-500"}`}
                        >
                          정답 X
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500">질문지 내용</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuizField(qIdx, "question", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500">정답 해설 (조리과학 원인 분석)</label>
                      <textarea
                        value={q.explanation}
                        onChange={(e) => updateQuizField(qIdx, "explanation", e.target.value)}
                        className="w-full h-20 bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Part C: Lunch Meal Challenge */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[10px] p-1.5 rounded-md">Part C</span>
                오늘의 급식 챌린지 식단 편집
              </h3>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500">추천 식단 메뉴명</label>
                    <input
                      type="text"
                      value={data.lunchChallenge.menuName}
                      onChange={(e) => updateLunchField("menuName", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500">식단 간략 설명</label>
                    <input
                      type="text"
                      value={data.lunchChallenge.description}
                      onChange={(e) => updateLunchField("description", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500">이달의 영양 우수 식단 선정 사유 및 조리과학 설명</label>
                  <textarea
                    value={data.lunchChallenge.benefitReason}
                    onChange={(e) => updateLunchField("benefitReason", e.target.value)}
                    className="w-full h-24 bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-700 font-medium focus:outline-emerald-500"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
