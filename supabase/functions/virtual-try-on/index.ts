import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface VirtualTryOnRequest {
  personImage: string;
  clothingDescription: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const { personImage, clothingDescription }: VirtualTryOnRequest = await req.json();

    if (!personImage) {
      return new Response(
        JSON.stringify({ error: "请上传人物照片" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!clothingDescription) {
      return new Response(
        JSON.stringify({ error: "请选择服装风格" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing virtual try-on request...");

    const prompt = `You are a virtual fashion stylist AI. I'm giving you an image of a person.

Your task: Generate a new image showing this same person wearing ${clothingDescription}.

Requirements:
- Keep the person's face, body shape, pose, skin tone, and hair exactly the same
- Replace their current clothing with ${clothingDescription}
- The clothing should fit naturally on the person's body
- Maintain realistic lighting and shadows
- Keep a similar background or use a clean studio background
- The result should look like a professional fashion photo
- Output only the final edited image, no text explanation needed`;

    // Call AI Gateway API with image generation
    const response = await fetch("https://www.needware.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        modalities: ["text", "image"],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: personImage
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI service error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "请求过于频繁，请稍后再试" }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI服务配额已用完" }),
          { status: 402, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      throw new Error(`AI处理失败: ${errorText}`);
    }

    const result = await response.json();

    // Parse response to extract generated image
    let generatedImageUrl: string | null = null;
    let textContent: string | null = null;

    const messageContent = result.choices?.[0]?.message?.content;

    if (Array.isArray(messageContent)) {
      for (const part of messageContent) {
        if (part.type === 'image_url' && part.image_url?.url) {
          generatedImageUrl = part.image_url.url;
        } else if (part.type === 'text') {
          textContent = part.text;
        }
      }
    } else if (typeof messageContent === 'string') {
      const base64Match = messageContent.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      const urlMatch = messageContent.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp)/i);

      if (base64Match) {
        generatedImageUrl = base64Match[0];
      } else if (urlMatch) {
        generatedImageUrl = urlMatch[0];
      }
      textContent = messageContent;
    }

    console.log("Virtual try-on completed");

    return new Response(
      JSON.stringify({
        success: true,
        image: generatedImageUrl,
        text: textContent,
        model: "google/gemini-3-pro-image-preview"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error("Virtual try-on error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "换装失败，请重试" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
