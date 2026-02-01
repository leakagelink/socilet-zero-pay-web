import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, type, projectContext } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing AI request:", { type, messagesCount: messages?.length });

    let systemPrompt = "";

    if (type === "analyze") {
      systemPrompt = `You are an expert web development project analyst and consultant for Socilet, a professional web development agency. Your role is to analyze client project requirements and provide detailed, actionable insights.

When analyzing a project, provide:
1. **Project Overview**: Brief summary of what the client needs
2. **Technology Stack Recommendation**: 
   - Frontend technologies (React, Next.js, Vue, etc.)
   - Backend technologies (Node.js, Python, PHP, etc.)
   - Database (PostgreSQL, MongoDB, MySQL, etc.)
   - Hosting (Vercel, AWS, DigitalOcean, etc.)
   - Additional tools and services
3. **Key Features List**: Break down all required features
4. **Implementation Approach**: How we'll build this
5. **Timeline Estimation**: 
   - Phase-wise breakdown with estimated days/weeks
   - Total project duration
6. **Cost Estimation (in INR)**:
   - Development cost breakdown
   - Design cost if applicable
   - Total estimated cost range
   - Payment milestones suggestion
7. **Potential Challenges**: Technical challenges and how to address them
8. **Maintenance Considerations**: Post-launch support needs

Be professional, detailed, and use proper formatting with markdown headings and bullet points.`;
    } else if (type === "generate_document") {
      systemPrompt = `You are a professional document generator for Socilet web development agency. Based on the project analysis conversation, generate a comprehensive project proposal document.

The document should include:
# PROJECT PROPOSAL

## Company Information
- **Company Name**: Socilet
- **Website**: socilet.in
- **Contact**: team@socilet.in

## Client Information
(Fill based on context)

## Project Summary
(Detailed overview)

## Scope of Work
(All features and deliverables)

## Technology Stack
(Complete tech stack with justification)

## Project Timeline
| Phase | Description | Duration | Deliverables |
|-------|-------------|----------|--------------|
(Timeline table)

## Pricing & Payment Terms
| Description | Amount (INR) |
|-------------|--------------|
(Cost breakdown)

**Total Cost**: ₹XX,XXX - ₹XX,XXX

**Payment Terms**:
- 30% Advance
- 40% on Development Completion
- 30% on Final Delivery

## Terms & Conditions
(Standard terms)

## Why Choose Socilet?
(Our advantages)

Make it professional and complete. Format in proper markdown.`;
    } else {
      systemPrompt = `You are a helpful AI assistant for Socilet, a web development agency. Help the admin analyze and plan client projects. Be concise yet thorough in your responses. Use markdown formatting for better readability.`;
    }

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...(projectContext ? [{ role: "user", content: `Project Context: ${projectContext}` }] : []),
      ...messages,
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: allMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI analyzer error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
