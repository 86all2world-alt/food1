import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Default spring/May data to serve when there's no API key or on initial load
const DEFAULT_SEASONAL_DATA = {
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
        "1. 씨앗 위생관리: 날개 씨앗 속 아미그달린 독성을 없애기 위해 풋매실을 꼭지로 가볍게 따고 깨끗이 세척 후 씨를 발라내거나 100일 이상 발효시켜 숙성해서 드세요! [소스 3]",
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
    const { month = 5, gradeLevel = "초등학생", focusTopic = "성장기 건강" } = req.body;
    
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
    const { sourceText, month = 5, gradeLevel = "초등학생" } = req.body;

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
