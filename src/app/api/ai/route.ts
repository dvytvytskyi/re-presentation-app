import { NextResponse } from 'next/server';

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
    3. NO FILLERS: Strictly ban 'expansive', 'abundance of', 'unique experience', 'unparalleled', 'breath-taking'.
    4. HIGH DENSITY: Every word must earn its place. Focus on specific benefits, not generic adjectives.
    5. NO NOTES: Do not explain your output.

    SLIDE 2 (AREA DETAILS) RULES - MANDATORY THEMES:
    - areaName: Use the exact district/area name (e.g. 'DUBAI MARINA', 'JVC', 'DOWNTOWN').
    - Point 1: Principal Landmark (Benefit: Prestige and local status - pick the most iconic place within 5-10 mins).
    - Point 2: Greenery/Leisure (Benefit: Tranquil paths and community walks).
    - Point 3: Active Lifestyle (Benefit: Sports, parks, and health-focused environment).
    - Point 4: Exclusivity (Benefit: Premium living and status).
    * Target length for each point: 40-48 characters.
    * EVERY field must be a complete thought.

    STRUCTURE:
    {
      "slide1_offer": {
        "projectName": "Short name",
        "tagline": "Developer slogan (max 20 chars)",
        "feature1": "Primary hook (max 62)",
        "feature2": "Value proposition (max 120)"
      },
      "slide2_area": {
        "areaName": "Area Name",
        "description": "Area vibe (max 74)",
        "points": ["Point 1 (Meydan)", "Point 2 (Leisure)", "Point 3 (Sports)", "Point 4 (Exclusivity)"],
        "distances": [
          {"place": "Downtown Dubai / Burj Khalifa", "time": "15"},
          {"place": "Dubai International Airport (DXB)", "time": "20"},
          {"place": "Dubai Creek Harbour", "time": "12"},
          {"place": "DIFC", "time": "15"},
          {"place": "Palm Jumeirah", "time": "25"},
          {"place": "Jumeirah Beach", "time": "22"}
        ]
      },
      "slide3_advantages": { "advantages": [{"title": "Max 40", "description": "Max 120"}] },
      "slide4_advantages2": { "advantages": [{"title": "Max 40", "description": "Max 120"}] },
      "slide5_unit": { "title": "Unit Type" },
      "slide6_images": { "title": "Gallery Title" },
      "slide7_contact": { "title": "Contact Title" }
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
              content: `${SYSTEM_PROMPT}\n\nTask: Translate the entire provided state into ${targetLang}. Maintain the high-density, no-filler style.`
            },
            {
              role: 'user',
              content: `Translate this JSON to ${targetLang}. Return JSON only: \n\n${JSON.stringify(state)}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Groq Error');
      
      return NextResponse.json({ result: JSON.parse(data.choices[0]?.message?.content || "{}") });
    }

    if (mode === 'magic-fill') {
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
              content: `Project Info: ${JSON.stringify(manualData)}\n\nPrompt: ${prompt}\n\nGenerate the complete JSON structure.`
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
      return NextResponse.json({ result: resultJson });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });

  } catch (error: any) {
    console.error('AI Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
