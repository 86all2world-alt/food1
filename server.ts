import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Default spring/May data to serve when there's no API key or on initial load
const DEFAULT_SEASONAL_DATA = {
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

// Setup Gemini API Client lazy load
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or holds a placeholder. Falling back to default datasets.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API: Get initial seasonal data
  app.get("/api/seasonal-data", (req, res) => {
    res.json(DEFAULT_SEASONAL_DATA);
  });

  // API: Generate customized prompt for NotebookLM
  app.post("/api/generate-prompt", (req, res) => {
    const { month = 10, gradeLevel = "초등학생", focusTopic = "성장기 건강" } = req.body;
    
    const promptTemplate = `당신은 15년 차 학교 영양교사이자, 학생용 영양 교육 웹앱(App) 기획자입니다. 업로드된 제철 식재료 가이드, 위생 관리 매뉴얼, 영양 분석 자료를 바탕으로 학생들이 모바일에서 쉽고 빠르게 읽을 수 있는 '이달의 제철 보약 창고' 웹앱 콘텐츠를 구성해 주세요.

[배경 및 목적]
이 작업의 목적은 ${gradeLevel}들이 등하교 시간이나 급식 전후에 스마트폰 앱을 통해 오늘 먹는 제철 식재료의 효능을 이해하고, 올바른 손질법과 위생 수칙을 익혀 평생 건강한 식습관을 형성하고 특히 '${focusTopic}'을 스스로 챙기도록 돕는 데 있습니다.

[핵심 지시사항 (Task)]
1. 앱 메인 화면용 요약: 소스에서 확인되는 ${month}월(또는 봄/해당 계절) 대표 식재료 3가지를 선정하여, 각 재료의 핵심 영양소와 학생 성장에 주는 도움(뼈 건강, 두뇌 발달, 피로 회복 등)을 한눈에 보이는 표로 정리하세요.
2. 클릭 시 노출될 '똑똑 조리팁': 영양 흡수율을 극대화하는 조리 과학적 비결(예: 쑥갓의 옥살산 제거법, 양배추 세척 온도 등)과 최고의 음식 궁합을 '영양 쌤의 한마디' 형식으로 추출하세요.
3. 안전 알림톡 콘텐츠: 잔류농약 제거법, 신선도 유지를 위한 적정 보관 온도(5℃ 이하 등), 특정 질환자 주의사항을 번호 매기기 목록으로 작성하세요.
4. 오늘의 급식 챌린지: 소스에 포함된 단체급식 레시피 중 하나를 추천하고, 왜 이 메뉴가 이번 달에 가장 우수한 영양 식단인지 '${focusTopic}'의 측면을 고려하여 이유를 설명하세요.

[필수 제약 조건]
- 철저한 근거 기반: 반드시 업로드된 소스 문서의 내용만 사용하세요. 외부의 의학 상식이나 개인적 의견은 절대 포함하지 마세요.
- 쉬운 언어 사용: 전문 용어는 ${gradeLevel}도 쉽게 이해할 수 있게 반드시 풀어서 설명하세요. (예: '비타민 U' → "위를 튼튼하게 보호하는 성분", '옥살산' → "결석을 만들 수 있는 성분")
- 솔직한 표기: 특정 식재료의 상세 수치나 정보가 소스에 없는 경우, 지어내지 말고 **"문서에서 확인되지 않음"**으로 명확히 표기하세요.
- 근거 인용: 모든 답변의 문장 끝에는 소스 번호를 사용하여 [소스 번호] 형식으로 출처를 반드시 밝히세요.

[출력 형식]
구조: 모바일 화면에서 보기 편하도록 마크다운(Markdown) 형식을 사용하세요.
구성:
- [📱 메인: 이달의 제철 건강 파트너]: 식재료명, 핵심 효능을 포함한 표(Table)
- [💡 상세: 영양 선생님의 조리 과학실]: 영양 흡수 및 궁합 (글머리 기호)
- [⚠️ 알림: 안전한 식탁 수칙]: 세척, 온도, 주의사항 (번호 목록)
- [✅ 퀴즈: 영양 쑥쑥! O/X 퀴즈]: 오늘 배운 내용 중 핵심 정보 2가지를 퀴즈로 출제`;

    res.json({ prompt: promptTemplate });
  });

  // API: Live Content Generation using Gemini API
  app.post("/api/generate-content", async (req, res) => {
    const { sourceText, month = 10, gradeLevel = "초등학생" } = req.body;

    if (!sourceText || sourceText.trim().length === 0) {
      return res.status(400).json({ success: false, error: "소스 텍스트가 입력되지 않았습니다." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        success: false,
        error: "GEMINI_API_KEY가 서버에 올바르게 구성되지 않았습니다. 대시보드에서 예시 데이터 편집기를 사용하시거나, Settings > Secrets에 API Key를 주입해 주세요.",
        data: DEFAULT_SEASONAL_DATA
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `당신은 15년 차 학교 영양교사이자 영양 교육 앱 기획자입니다. 제공된 소스 텍스트를 분석하여 ${gradeLevel}들이 스마트폰에서 읽기 쉬운 제철 식재료 교육 콘텐츠를 JSON 형식으로 구성해 주세요.

[제공된 소스 텍스트]
${sourceText}

[필수 제약 조건]
1. 철저한 근거 기반: 반드시 제공된 [제공된 소스 텍스트]의 내용만 사용하세요. 제공되지 않은 외부 정보, 의학 상식이나 개인적 의견은 절대 포함하지 마세요.
2. 쉬운 언어 사용: 전문 용어는 ${gradeLevel}도 쉽게 이해할 수 있게 풀어서 친절하게 설명하세요. (예: '비타민 U' -> '위를 튼튼하게 보호하는 성분', '옥살산' -> '결석을 만들 수 있는 성분', '아미그달린' -> '결석이나 해로운 중독을 일으키는 성분')
3. 솔직한 표기: 특정 식재료의 상세 수치나 정보가 소스에 없으면 지어내지 말고 반드시 '문서에서 확인되지 않음'으로 표기하세요.
4. 근거 인용: 모든 설명이나 효능 문장의 끝에는 정보의 출처인 소스 번호를 [소스 번호] 형식(예: [소스 1], [소스 2] 등)으로 기입하세요. 소스 텍스트에 구체적인 문서 번호나 출처 표기가 보이지 않는다면, 분석한 단락이나 내용을 기준으로 임의의 [소스 1], [소스 2] 형태로 일관되게 부여해 주세요.
5. 정확한 개수: 식재료는 3가지를 선정해 주세요. 퀴즈 문항은 딱 2가지만 O/X 퀴즈로 준비해 주세요.

[출력 JSON 스키마]
반드시 다음 스키마를 만족하는 유효한 JSON 문자열 하나만 반환하세요. 다른 서론이나 설명 텍스트, 백틱 마크다운(\`\`\`json) 기호 등은 일절 붙이지 마세요.

{
  "month": ${month},
  "ingredients": [
    {
      "name": "식재료명 (예: 쑥갓)",
      "keyNutrients": "핵심 영양소 (예: 칼슘, 비타민 A [소스 1])",
      "growthHelp": "학생 성장에 주는 도움 (예: 뼈 성장, 눈 건강 [소스 1])",
      "cookingTip": {
        "scienceSecret": "영양 흡수를 극대화하는 조리 과학적 비결 설명 (반드시 출처 포함)",
        "bestPairing": "최고의 음식 궁합 설명 (반드시 출처 포함)",
        "teacherWord": "영양 선생님의 다정하고 따뜻한 어투 한마디 (예: '~란다!', '~해볼까?')"
      },
      "safetyAlerts": [
        "1. 잔류농약 세척법 (반드시 출처 포함)",
        "2. 보관 방법과 적정 온도, 예: 5℃ 이하 (반드시 출처 포함)",
        "3. 특정 질환자 주의사항 또는 신선 식별 요령 (반드시 출처 포함)"
      ]
    }
  ],
  "quiz": [
    {
      "question": "O/X 퀴즈 질문 (학생 눈높이에 맞춘 구어체 질문)",
      "answer": true 또는 false,
      "explanation": "정답 상세 설명 및 영양 교사의 한마디 해설 (반드시 출처 포함)"
    },
    {
      "question": "두 번째 O/X 퀴즈 질문",
      "answer": true 또는 false,
      "explanation": "해설 및 영양 교사 한마디 (반드시 출처 포함)"
    }
  ],
  "lunchChallenge": {
    "menuName": "오늘의 추천 단체급식 레시피 이름 (반드시 출처 포함)",
    "description": "식재료의 조리법을 활용한 메뉴 간단 소개 및 설명",
    "benefitReason": "이 식단이 이번 달에 왜 가장 우수한 최적 영양 식단인지에 대한 조리 과학적 및 성장기 관점 설명 (반드시 출처 포함)"
  }
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1, // Low temperature for factual extraction
        }
      });

      const text = response.text?.trim() || "{}";
      const cleanedText = text.replace(/^```json/, "").replace(/```$/, "").trim();
      const parsedData = JSON.parse(cleanedText);

      res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error("Gemini Content Generation Error:", err);
      res.status(500).json({
        success: false,
        error: `콘텐츠 생성 중 오류가 발생했습니다: ${err.message || err}`,
        data: DEFAULT_SEASONAL_DATA
      });
    }
  });

  // Serve static assets and frontend index in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK SERVER] Running on http://localhost:${PORT}`);
  });
}

startServer();
