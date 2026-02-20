import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptom, answers } = await req.json();
    if (!symptom || !answers) throw new Error("Missing symptom or answers");

    const AI_GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL");
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Determine gateway and auth. Priority:
    // 1) AI_GATEWAY_URL + AI_API_KEY
    // 2) AI_GATEWAY_URL without key
    // 3) Lovable gateway via LOVABLE_API_KEY (backwards compatible)
    let gatewayUrl = AI_GATEWAY_URL;
    let authHeader: string | undefined = AI_API_KEY ? `Bearer ${AI_API_KEY}` : undefined;
    if (!gatewayUrl && LOVABLE_API_KEY) {
      gatewayUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
      authHeader = `Bearer ${LOVABLE_API_KEY}`;
    }
    if (!gatewayUrl) throw new Error("AI_GATEWAY_URL or LOVABLE_API_KEY must be configured");

    const answersText = answers.map((a: any) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a medical diagnostic assistant. Based on a patient's initial symptom and their survey answers, provide:
1. Possible conditions with likelihood (High/Moderate/Low) and descriptions
2. Recommended procedures — explain what each is, who needs it, and how well it aligns with the patient's situation
3. Specialists to visit

You MUST respond by calling the provide_diagnosis tool.`,
          },
          {
            role: "user",
            content: `Initial symptom: "${symptom}"\n\nSurvey responses:\n${answersText}\n\nProvide a diagnosis.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_diagnosis",
              description: "Provide diagnostic results including conditions, procedures, and specialists.",
              parameters: {
                type: "object",
                properties: {
                  conditions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        likelihood: { type: "string", enum: ["High", "Moderate", "Low"] },
                        description: { type: "string" },
                      },
                      required: ["name", "likelihood", "description"],
                      additionalProperties: false,
                    },
                  },
                  procedures: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string", description: "What the procedure is and what it involves" },
                        alignment: { type: "string", description: "How well this procedure aligns with the patient's specific issue" },
                        whoNeedsIt: { type: "string", description: "Who typically needs this procedure" },
                      },
                      required: ["name", "description", "alignment", "whoNeedsIt"],
                      additionalProperties: false,
                    },
                  },
                  specialists: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of specialist types to visit",
                  },
                },
                required: ["conditions", "procedures", "specialists"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_diagnosis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("diagnose-results error:", e);
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
