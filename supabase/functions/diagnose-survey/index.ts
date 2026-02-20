import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptom } = await req.json();
    if (!symptom) throw new Error("No symptom provided");

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
            content: `You are a medical assessment assistant. Given a patient's initial symptom description, generate a focused diagnostic survey of 5-8 multiple-choice questions. Each question should help narrow down the possible condition.

You MUST respond by calling the generate_survey tool with the questions array.`,
          },
          {
            role: "user",
            content: `Patient symptom: "${symptom}". Generate a diagnostic survey.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_survey",
              description: "Generate a set of diagnostic survey questions with multiple-choice options.",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Unique question identifier like q1, q2, etc." },
                        question: { type: "string", description: "The question text" },
                        options: {
                          type: "array",
                          items: { type: "string" },
                          description: "3-5 multiple choice options",
                        },
                      },
                      required: ["id", "question", "options"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_survey" } },
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

    return new Response(JSON.stringify({ questions: parsed.questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("diagnose-survey error:", e);
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
