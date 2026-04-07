import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function revertTranslations(text: string): string {
  const mapping: Record<string, string> = {
    "Даунтаун Дубай": "Downtown Dubai",
    "Даунтауна Дубай": "Downtown Dubai",
    "Даунтаун": "Downtown Dubai",
    "Бизнес Бэй": "Business Bay",
    "Бизнес Бей": "Business Bay",
    "Бизнес-Бэй": "Business Bay",
    "Бизнес-район": "Business Bay",
    "Дубай Марина": "Dubai Marina",
    "Бурдж-Халифа": "Burj Khalifa",
    "Бурдж Халифа": "Burj Khalifa",
    "Пальма Джумейра": "Palm Jumeirah",
    "Дубай Опера": "Dubai Opera",
    "Мейдан": "Meydan",
    "Эмаар": "EMAAR",
    "Дамак": "DAMAC",
    "Собха": "Sobha",
    "Нахиль": "Nakheel"
  };

  let cleanText = text;
  for (const [wrong, right] of Object.entries(mapping)) {
    const regex = new RegExp(wrong, 'gi');
    cleanText = cleanText.replace(regex, right);
  }
  return cleanText;
}

function deepStripQuotes(obj: any): any {
  if (typeof obj === 'string') {
    return revertTranslations(obj.trim().replace(/^["']|["']$/g, ''));
  }
  if (Array.isArray(obj)) {
    return obj.map(deepStripQuotes);
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = deepStripQuotes(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, manualData, prompt, state, targetLang } = body;
    const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

    console.log('--- AI Request Start ---');
    console.log('Mode:', mode || 'standard');

    // CONSOLIDATED SYSTEM PROMPT
    const SYSTEM_PROMPT = `You are a Professional Luxury Real Estate Consultant.
    
    CORE RULES:
    1. JSON ONLY: Return only a valid JSON object.
    2. NO FRAGMENTS: Every field must be a complete, finished sentence or phrase.
    3. NO FILLERS/WATER: Strictly ban 'expansive', 'abundance of', 'unique experience', 'unparalleled', 'breath-taking', 'amazing', 'stunning', 'incredible'. Use high-density, factual luxury copy.
    4. HIGH DENSITY: Every word must earn its place. Focus on specific benefits, not generic adjectives.
    5. NO PROPER NOUN TRANSLATION: Do NOT translate, transliterate, or gramatically modify district/developer/building names (e.g., 'Downtown Dubai', 'Business Bay', 'Burj Khalifa', 'EMAAR'). They must stay in ORIGINAL ENGLISH exactly as provided.
    6. NO WRAPPERS: Do NOT wrap any string values in quotes or brackets. Return plain text only.
    7. STRICT LENGTH: Fill at least 85% of the character limit for every field.
    8. HUMAN-LIKE COPY: Avoid 'иконический', 'уникальный'. Translate concepts naturally, not words literally.
    9. BOUTIQUE VOCABULARY: 
       - 'Iconic Landmarks' -> 'World-class attractions' / 'Знаковые локации'.
       - 'Perfect combination' -> 'Harmonious balance' / 'Безупречный баланс'.
       - 'Luxury lifestyle' -> 'Sophisticated living' / 'Престижный образ жизни'.
       - 'Access to' -> 'Direct connectivity' / 'Удобная транспортная развязка'.

    SLIDE 2 (AREA DETAILS) RULES - MANDATORY THEMES:
    - areaName: Use the exact district/area name (e.g. 'DUBAI MARINA', 'JVC', 'DOWNTOWN').
    - Point 1: Principal Landmark (Benefit: Prestige and local status - pick the most iconic place within 5-10 mins).
    - Point 2: Greenery/Leisure (Benefit: Tranquil paths and community walks).
    - Point 3: Active Lifestyle (Benefit: Sports, parks, and health-focused environment).
    - Point 4: Exclusivity (Benefit: Premium living and status).
    * Target length for each point: 40-48 characters.
    * EVERY field must be a complete thought.

    STRUCTURE (JSON ONLY):
    {
      "offerData": {
        "projectName": "Short name",
        "tagline": "Developer slogan (max 20 chars)",
        "feature1": "Primary hook (max 62)",
        "feature2": "Value proposition (max 120)",
        "view": "Sea/Skyline View",
        "unitType": "Premium Apartment",
        "initialPayment": "TBD",
        "roi": "TBD"
      },
      "areaData": {
        "areaName": "Area Name",
        "description": "Area vibe (max 74)",
        "points": ["Point 1 (Meydan)", "Point 2 (Leisure)", "Point 3 (Sports)", "Point 4 (Exclusivity)"],
        "distances": [
          {"label": "Downtown Dubai / Burj Khalifa", "time": "15"},
          {"label": "DXB", "time": "20"},
          {"label": "Dubai Marina", "time": "25"}
        ]
      },
      "advantagesData": { "advantages": [{"title": "Max 40", "description": "Max 120"}] },
      "advantages2Data": { "advantages": [{"title": "Max 40", "description": "Max 120"}] },
      "unitData": { "title": "Unit Type" },
      "galleryImages": ["title"],
      "contactData": { "title": "Contact Title" }
    }`;

    if (mode === 'translate') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `${SYSTEM_PROMPT}\n\nTask: Perform professional boutique real estate localization into ${targetLang}.
              
              STYLE RULES FOR RUSSIAN:
              - DO NOT use typical AI words: 'иконический', 'уникальное сочетание', 'роскошный образ жизни'.
              - INSTEAD USE: 'знаковый', 'безупречный баланс', 'престижное жилье', 'статусная локация'.
              - 'Iconic Landmarks' -> 'Достопримечательности мирового уровня'.
              - 'Access to roads' -> 'Удобная транспортная развязка'.
              
              CRITICAL BRAND PRESERVATION:
              - DO NOT translate PROJECT NAMES, DEVELOPER NAMES (tagline), or DISTRICT NAMES. Keep them in ORIGINAL ENGLISH.
              
              INSTRUCTION: Translate only the text content. Do not modify URLs or numbers. Return the full JSON structure with keys: offerData, areaData, advantagesData, advantages2Data, unitData, contactData.`
            },
            {
              role: 'user',
              content: `Translate this JSON object into ${targetLang}: \n\n${JSON.stringify(state)}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Groq Error');
      
      const translatedJson = JSON.parse(data.choices[0]?.message?.content || "{}");
      
      // DEEP MERGE: Take original state, apply only translated strings, preserve everything else (images, etc)
      function deepMerge(target: any, source: any) {
        if (!source || typeof source !== 'object') return target;
        const result = Array.isArray(target) ? [...target] : { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && target[key]) {
                result[key] = deepMerge(target[key], source[key]);
            } else if (typeof source[key] === 'string' && source[key].trim() !== "") {
                let val = source[key];
                // RU Styles: ОБОРУДОВАНИЕ -> Меблировка
                if (targetLang?.toLowerCase().includes('ru')) {
                  if (val.toUpperCase() === 'ОБОРУДОВАНИЕ') val = 'Меблировка';
                  if (val.toUpperCase() === 'МЕБЕЛЬ') val = 'Меблировка';
                }
                result[key] = val;
            }
        }
        return result;
      }

      const finalJson = deepMerge(state, translatedJson);
      
      // FINAL ENFORCEMENT: Re-ensure brand fields are original (EXCEPT title/developer if specifically asked? No, user said DON'T translate them)
      if (finalJson.offerData && state.offerData) {
        finalJson.offerData.projectName = state.offerData.projectName; // DON'T TRANSLATE MAIN TITLE
        finalJson.offerData.tagline = state.offerData.tagline;         // DON'T TRANSLATE DEVELOPER
      }
      if (finalJson.areaData && state.areaData) {
        finalJson.areaData.areaName = state.areaData.areaName;
      }

      return NextResponse.json({ result: deepStripQuotes(finalJson) });
    }

    if (mode === 'magic-fill' || body.action === 'enrich') {
      const sourceText = body.text || body.data?.sourceText || "No description provided.";
      const promptText = `TASK: Refine real estate marketing text for a premium luxury presentation.
           SOURCE DESCRIPTION: ${sourceText}
           PROJECT AREA: ${manualData?.location || "Dubai"}
           
           STRICT QUALITY RULES:
           1. MINIMUM IS NON-NEGOTIABLE: Every field MUST reach at least 85% of its limit. 
           2. PRECISION HARD CAP: Do not exceed 100%.
           3. LUXURY ELABORATION: Focus on specific high-end amenities and investment perks.
           4. DENSE STYLE: Use professional, persuasive luxury copy. Strictly ban adjectives like 'unparalleled', 'breath-taking', 'amazing', 'stunning'.
           5. LOGISTICAL ACCURACY: Generate realistic driving times (in minutes).
           6. PROPER NOUNS: Keep 'Business Bay', 'EMAAR', 'Project Names' etc. in original English.

           REQUIRED JSON OUTPUT:
           {
             "offerData": {
               "projectName": "Project Name",
               "tagline": "Developer name (max 20 chars)",
               "feature1": "Primary hook (max 62)",
               "feature2": "Value proposition (max 120)",
               "view": "Sea/Skyline View",
               "unitType": "Premium Apartment",
               "initialPayment": "TBD",
               "roi": "TBD"
             },
             "areaData": {
               "areaName": "${manualData?.location || "DUBAI"}",
               "description": "Area vibes (max 74)",
               "points": [
                 "Point 1 (41-48 chars)",
                 "Point 2 (81-95 chars)",
                 "Point 3 (41-48 chars)",
                 "Point 4 (41-48 chars)"
               ],
               "distances": [
                 {"label": "DUBAI MALL / BURJ KHALIFA", "time": "12 MINS"},
                 {"label": "DXB INTERNATIONAL AIRPORT", "time": "15 MINS"},
                 {"label": "PALM JUMEIRAH", "time": "20 MINS"},
                 {"label": "BURJ AL ARAB", "time": "18 MINS"},
                 {"label": "DOWNTOWN DUBAI", "time": "10 MINS"},
                 {"label": "DUBAI MARINA", "time": "25 MINS"}
               ]
             },
             "slide3_advantages": [
               {"title": "AMENITY NAME", "description": "Desc (100-120 chars)"},
               {"title": "AMENITY NAME", "description": "Desc (100-120 chars)"},
               {"title": "AMENITY NAME", "description": "Desc (100-120 chars)"}
             ],
             "slide4_advantages": [
               {"title": "AMENITY NAME", "description": "Desc (100-120 chars)"},
               {"title": "AMENITY NAME", "description": "Desc (100-120 chars)"}
             ],
             "slide5_unit": { "title": "Unit Type" }
           }`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: promptText
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Groq Error');
      
      const resultJson = JSON.parse(data.choices[0]?.message?.content || "{}");
      console.log('AI Logic Success:', JSON.stringify(resultJson).substring(0, 500));
      return NextResponse.json({ result: deepStripQuotes(resultJson) });
    }

    if (mode === 'enhance') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a Luxury Real Estate Copywriter. 
              TASK: Expand and refine the provided text into a professional, high-density marketing description. 
              STRICT LIMIT: Maximum ${body.maxLength || 120} characters. 
              MINIMUM: You MUST write at least ${Math.floor((body.maxLength || 120) * 0.85)} characters.
              NO WRAPPERS: Do not use quotes or brackets around the text. Return only the plain string.`
            },
            {
              role: 'user',
              content: `Enhance this text (target ${Math.floor((body.maxLength || 120) * 0.85)}-${body.maxLength || 120} chars): "${body.text}"`
            }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Groq Error');
      
      const content = data.choices[0]?.message?.content?.trim() || "";
      const cleanResult = revertTranslations(content.replace(/^["']|["']$/g, ''));
      
      return NextResponse.json({ result: cleanResult });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });

  } catch (error: any) {
    console.error('[AI_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
