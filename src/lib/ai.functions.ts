import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Definimos el esquema de entrada
const GenerateArticleSchema = z.object({
  topic: z.string().min(3).max(200),
  category: z.string().optional(),
});

export const generateArticleDraft = createServerFn({ method: "POST" })
  .inputValidator((d: any) => GenerateArticleSchema.parse(d))
  .handler(async ({ data }) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    // Construimos el prompt para la IA
    const prompt = `
      Escribe un artículo SEO optimizado para un sitio web de finanzas en inglés.
      El tema es: "${data.topic}".
      ${data.category ? `La categoría sugerida es: ${data.category}.` : ''}
      
      El artículo debe tener:
      - Un título atractivo (máximo 60 caracteres).
      - Un excerpt (resumen) de máximo 160 caracteres.
      - Estructura con introducción, 3-4 secciones con subtítulos (h2), y una conclusión.
      - Usa un tono profesional, claro y accesible para un público general.
      - Incluye 2-3 preguntas frecuentes (FAQ) al final.
      
      Devuelve el resultado en el siguiente formato JSON:
      {
        "title": "Título del artículo",
        "excerpt": "Resumen del artículo",
        "content": "<h2>Sección 1</h2><p>Contenido...</p><h2>Sección 2</h2><p>Contenido...</p>",
        "faq": [
          { "question": "Pregunta 1", "answer": "Respuesta 1" },
          { "question": "Pregunta 2", "answer": "Respuesta 2" }
        ]
      }
    `;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Usa el modelo que prefieras
          messages: [
            { role: "system", content: "Eres un experto redactor de contenido financiero." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No se recibió contenido de OpenAI");
      }

      // Parseamos el JSON que devuelve la IA
      const parsed = JSON.parse(content);

      // Validamos que tenga los campos necesarios
      if (!parsed.title || !parsed.content) {
        throw new Error("La IA no devolvió un formato válido");
      }

      return {
        title: parsed.title,
        excerpt: parsed.excerpt || "",
        content: parsed.content,
        faq: parsed.faq || [],
      };
    } catch (error: any) {
      console.error("Error generating article:", error);
      throw new Error(`Error al generar el artículo: ${error.message}`);
    }
  });