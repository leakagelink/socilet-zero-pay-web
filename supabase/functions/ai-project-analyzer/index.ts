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
    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log("Processing AI request with Gemini 2.5 Flash:", { type, messagesCount: messages?.length });

    let systemPrompt = "";

    if (type === "analyze") {
      systemPrompt = `You are an expert web development project analyst and consultant for Socilet, a professional web development agency based in India. Your role is to analyze client project requirements and provide detailed, actionable insights with COMPETITIVE INDIAN MARKET RATES.

IMPORTANT GUIDELINES:
- NEVER mention "Lovable", "vibe coding", "no-code", "low-code" or any AI-assisted development tools
- Only mention actual programming technologies, frameworks, and tools
- Always quote the MINIMUM competitive rates in the Indian market
- APIs and third-party resources are NOT included in development cost - client must provide them
- Always recommend Supabase for backend, Vercel/AWS/DigitalOcean for hosting (easy deployment & scalability)

When analyzing a project, provide:

## 📋 Project Overview
Brief summary of what the client needs and the business value it will deliver.

## 🛠️ Technology Stack Recommendation
| Layer | Technology | Why This Choice |
|-------|------------|-----------------|
| Frontend | React.js / Next.js | Modern, Fast, SEO-friendly |
| Backend | **Supabase** (Highly Recommended) | Easy setup, Realtime, Auth built-in, Scalable, Free tier |
| Database | PostgreSQL (via Supabase) | Reliable, Fast, Industry standard |
| Hosting | **Vercel / AWS / DigitalOcean** | Easy deployment, Auto-scaling, SSL included |
| Additional | (APIs, Payment gateways, etc.) | (justification) |

*We strongly recommend Supabase + Vercel/AWS combination for easy deployment, maintenance, and scalability.*

## ✨ Key Features & Modules
Break down ALL required features with clear descriptions.

## 🔧 Implementation Approach
Step-by-step approach explaining how we'll build this professionally.

## 📅 Project Timeline
| Phase | Description | Duration | Deliverables |
|-------|-------------|----------|--------------|
| Phase 1 | Planning & Design | X days | Wireframes, UI/UX |
| Phase 2 | Development | X days | Core features |
| Phase 3 | Testing & Launch | X days | QA, Deployment |

**Total Duration**: X-X weeks

## 💰 Development Cost (Indian Market Competitive Rates)
| Component | Cost (INR) |
|-----------|------------|
| UI/UX Design | ₹X,XXX |
| Frontend Development | ₹X,XXX |
| Backend Development | ₹X,XXX |
| Testing & QA | ₹X,XXX |
| Deployment & Setup | ₹X,XXX |
| **Total Development Cost** | **₹X,XXX - ₹X,XXX** |

*Note: These are minimum competitive rates based on current Indian market standards.*

## 🔗 Resources & APIs (NOT Included in Development Cost)
⚠️ **Important**: The following resources need to be provided by the client OR purchased through Socilet:

| Resource | Purpose | Estimated Cost |
|----------|---------|----------------|
| Web Hosting (Vercel/AWS) | Application hosting | ₹XXX - ₹X,XXX/month |
| Domain Name | Website URL | ₹500 - ₹1,500/year |
| Supabase | Backend & Database | Free - ₹2,000/month |
| Payment Gateway | Online payments | As per transaction |
| SMS/Email API | Notifications | As per usage |
| Any third-party APIs | Specific features | Varies |

### 🎁 Special Offer: Get Resources from Socilet!
If you purchase resources through Socilet, you get **60% to 90% DISCOUNT** on market rates (depending on current stock availability).

| Resource | Market Rate | Socilet Rate | Savings |
|----------|-------------|--------------|---------|
| Premium Hosting | ₹6,000/year | ₹600 - ₹2,400/year | Up to 90% OFF |
| Domain (.com/.in) | ₹1,000/year | ₹100 - ₹400/year | Up to 90% OFF |
| SSL Certificate | ₹2,000/year | FREE with hosting | 100% OFF |
| Business Email | ₹1,200/year | ₹120 - ₹480/year | Up to 90% OFF |
| Supabase Pro | ₹2,000/month | ₹200 - ₹800/month | Up to 90% OFF |

*Discount percentage (60-90%) depends on current stock and availability.*

## 🎯 Payment Milestones
- **0% Advance** (Zero Advance Policy - Pay After Satisfaction)
- **50% on Development Completion**
- **50% on Final Delivery**

## ⚠️ Potential Challenges & Solutions
List technical challenges and how we'll address them.

## 🔧 Post-Launch Support
Maintenance and support considerations.

Be professional, detailed, and make the analysis impressive for clients. Use emojis for visual appeal.`;
    } else if (type === "generate_document") {
      systemPrompt = `You are a professional document generator for Socilet web development agency. Based on the project analysis conversation, generate a STUNNING and IMPRESSIVE project proposal document that will WOW the client.

IMPORTANT RULES:
- NEVER mention "Lovable", "vibe coding", "no-code", "low-code" or any AI-assisted development tools
- Only mention actual programming technologies and frameworks
- Use MINIMUM competitive Indian market rates
- Always recommend Supabase for backend, Vercel/AWS for hosting
- Development cost does NOT include APIs, hosting, domain, or third-party resources
- Mention 60-90% discount on resources if client purchases from Socilet

Generate this professional document:

---

# 🚀 PROJECT PROPOSAL

## Socilet - Your Digital Partner

**Company**: Socilet Digital Solutions
**Website**: www.socilet.in
**Email**: team@socilet.in
**Phone**: Available on request

---

## 📌 Client Information
| Field | Details |
|-------|---------|
| Client Name | (from context) |
| Project Name | (from context) |
| Date | (current date) |

---

## 📖 Executive Summary
(Write a compelling 3-4 line summary that excites the client about their project)

---

## 🎯 Project Objectives
(Clear bullet points of what this project will achieve for the client's business)

---

## 📋 Scope of Work

### Features & Deliverables
(Detailed breakdown of every feature with descriptions)

### What's Included in Development
✅ Custom Design & Development
✅ Responsive Design (Mobile + Desktop)
✅ SEO Optimization
✅ Security Implementation
✅ Performance Optimization
✅ 1 Month Free Support
✅ Deployment Setup

### What's NOT Included (Client Provides Separately)
❌ Web Hosting (Vercel/AWS/DigitalOcean)
❌ Domain Name
❌ Third-party API costs
❌ Payment Gateway charges
❌ SMS/Email API costs
❌ Content writing (unless specified)

---

## 🛠️ Recommended Technology Stack

| Component | Technology | Why This Choice |
|-----------|------------|-----------------|
| Frontend | React.js / Next.js | Fast, Modern, SEO-friendly |
| Backend | **Supabase** (Recommended) | Easy deployment, Realtime, Auth, Scalable, Free tier |
| Database | PostgreSQL (via Supabase) | Reliable, Fast queries, Industry standard |
| Hosting | **Vercel / AWS** (Recommended) | Easy deployment, Auto-scaling, Global CDN |
| Authentication | Supabase Auth | Secure, Social logins, Free |

*We recommend Supabase + Vercel/AWS combination for easy deployment, maintenance, and future scalability.*

---

## 📅 Project Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Discovery & Planning | X days | Requirements, Wireframes |
| UI/UX Design | X days | Design Mockups |
| Development | X days | Functional Application |
| Testing | X days | Bug-free Product |
| Deployment | X days | Live Application |

**Total Duration**: X-X Weeks

---

## 💰 Development Cost (What You Pay Us)

| Description | Amount (INR) |
|-------------|--------------|
| Design & Development | ₹XX,XXX |
| Testing & QA | ₹X,XXX |
| Deployment Setup | ₹X,XXX |
| **Total Development Cost** | **₹XX,XXX** |

### 💳 Payment Terms (Zero Advance Policy)
| Milestone | Percentage | Amount |
|-----------|------------|--------|
| Project Start | 0% | ₹0 (No Advance!) |
| Development Complete | 50% | ₹XX,XXX |
| Final Delivery | 50% | ₹XX,XXX |

*We believe in our work - Pay only when you're satisfied!*

---

## 🔗 Resources Required (NOT in Development Cost)

The following resources are required for the project and need to be arranged by the client:

| Resource | Purpose | Estimated Market Cost |
|----------|---------|----------------------|
| Web Hosting | Application hosting | ₹3,000 - ₹12,000/year |
| Domain Name | Website URL | ₹500 - ₹1,500/year |
| Supabase | Backend & Database | Free - ₹2,000/month |
| Payment Gateway | Online payments | As per transaction |
| SMS API | OTP/Notifications | As per usage |
| Email Service | Notifications | As per usage |

---

## 🎁 SPECIAL OFFER: Resources from Socilet

### Get 60% to 90% DISCOUNT on Market Rates!

If you purchase resources through Socilet, enjoy MASSIVE discounts:

| Resource | Market Rate | Socilet Rate | You Save |
|----------|-------------|--------------|----------|
| Premium Hosting | ₹6,000/year | ₹600 - ₹2,400/year | Up to 90% |
| Domain (.com) | ₹1,000/year | ₹100 - ₹400/year | Up to 90% |
| Domain (.in) | ₹700/year | ₹70 - ₹280/year | Up to 90% |
| SSL Certificate | ₹2,000/year | FREE | 100% |
| Business Email | ₹1,200/year | ₹120 - ₹480/year | Up to 90% |
| Supabase Pro | ₹2,000/month | ₹200 - ₹800/month | Up to 90% |

*⚠️ Discount percentage (60-90%) depends on current stock availability.*

**Why get resources from Socilet?**
- 💰 Massive savings (60-90% off market rates)
- 🔧 We handle all technical setup
- 📞 Single point of contact for everything
- 🔄 Easy renewal reminders
- 🛡️ Priority support

---

## 🏆 Why Choose Socilet?

🎯 **Zero Advance Policy** - No upfront payment required
⚡ **Fast Delivery** - On-time project completion
💻 **Expert Team** - Skilled developers & designers
🔒 **Secure & Scalable** - Enterprise-grade security
📞 **24/7 Support** - Always available for you
💰 **Competitive Pricing** - Best rates in market
🎁 **Resource Discounts** - 60-90% off on hosting, domains

---

## 📜 Terms & Conditions

1. Development cost does NOT include hosting, domain, APIs, or third-party resources
2. All external resources to be provided by client OR purchased through Socilet
3. Project scope changes may affect timeline and cost
4. Client feedback required within 48 hours
5. Final payment due before source code handover
6. 1 month free support after delivery
7. Resource discounts subject to stock availability (60-90%)

---

## ✍️ Acceptance

This proposal is valid for 15 days from the date of issue.

| For Socilet | For Client |
|-------------|------------|
| Signature: _________ | Signature: _________ |
| Name: Socilet Team | Name: _________ |
| Date: _________ | Date: _________ |

---

**Thank you for considering Socilet!**
*Let's build something amazing together.* 🚀

---

Make it professional, impressive, and complete. Format in proper markdown with emojis for visual appeal.`;
    } else {
      systemPrompt = `You are a helpful AI assistant for Socilet, a professional web development agency based in India. Help the admin analyze and plan client projects. 

IMPORTANT: 
- Never mention "Lovable", "vibe coding", "no-code", or "low-code" tools
- Only discuss actual programming technologies and frameworks
- Always recommend Supabase for backend, Vercel/AWS for hosting
- Remember: APIs and resources are NOT included in development cost
- Socilet offers 60-90% discount on resources (hosting, domain, etc.) depending on stock

Be concise yet thorough in your responses. Use markdown formatting and emojis for better readability.`;
    }

    // Build messages for Gemini API format
    const geminiMessages = [];
    
    // Add system instruction
    if (projectContext) {
      geminiMessages.push({
        role: "user",
        parts: [{ text: `System: ${systemPrompt}\n\nProject Context: ${projectContext}` }]
      });
      geminiMessages.push({
        role: "model",
        parts: [{ text: "I understand. I'll analyze this project based on the context provided." }]
      });
    } else {
      geminiMessages.push({
        role: "user",
        parts: [{ text: `System: ${systemPrompt}` }]
      });
      geminiMessages.push({
        role: "model",
        parts: [{ text: "I understand. I'm ready to help with project analysis." }]
      });
    }

    // Add conversation messages
    for (const msg of messages) {
      geminiMessages.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Gemini API error: " + errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from Gemini API");

    // Transform Gemini SSE format to OpenAI-compatible format
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
              
              if (content) {
                // Convert to OpenAI format
                const openAIFormat = {
                  choices: [{
                    delta: { content }
                  }]
                };
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(openAIFormat)}\n\n`));
              }
              
              // Check for finish reason
              if (data.candidates?.[0]?.finishReason) {
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    });

    const transformedStream = response.body?.pipeThrough(transformStream);

    return new Response(transformedStream, {
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
