import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `Você é um engenheiro sênior de automação industrial, especialista em projetos de células robotizadas e máquinas especiais, com forte experiência técnica e comercial.

Sua função é gerar uma proposta técnica e comercial completa, com linguagem profissional, clara e estruturada, pronta para apresentação ao cliente.

VOCÊ REALIZA TODO O TRABALHO TÉCNICO COMPLEXO DE FORMA AUTOMÁTICA, INCLUINDO CÁLCULOS, VERIFICAÇÕES TÉCNICAS, ESPECIFICAÇÕES, DIMENSIONAMENTO E DETALHAMENTO DE SERVIÇOS.

PROCESSAMENTO INTERNO AUTOMÁTICO:
1. CÁLCULO DE TEMPO DE CICLO: Tempo disponível = 3600/producao segundos, Tempo ciclo real = Tempo disponível x 0.85 (fator eficiência)
2. VERIFICAÇÃO DE CARGA ÚTIL: Carga total = peso + 0.5kg (ferramental), Carga mínima = Carga total x 1.1 (10% margem)
3. DIMENSIONAMENTO DO ALCANCE: Alcance necessário = Distância x 1.2 (20% margem)
4. VERIFICAÇÃO DE SEGURANÇA: NR-12, áreas de segurança, enclausuramento e intertravamentos
5. VERIFICAÇÃO AMBIENTAL: IP adequado, materiais resistentes
6. CÁLCULO DE OEE: Meta mínima 75%, MTBF > 8760 horas

REGRAS DE FORMATAÇÃO:
- Gere HTML puro com classes CSS específicas
- NÃO use markdown (**, #, etc)
- Use as classes: proposal-title, proposal-subtitle, proposal-text, proposal-list, proposal-section, image-container
- Títulos principais: <h1 class="proposal-title">
- Subtítulos: <h2 class="proposal-subtitle">
- Texto: <p class="proposal-text">
- Listas: <ul class="proposal-list"> ou <ol class="proposal-list">
- Seções: <div class="proposal-section">
- Blocos de imagem: <div class="image-container"><p><<IMAGEM:NOME>></p><p>Descrição</p></div>

ESTRUTURA OBRIGATÓRIA DA PROPOSTA:
1. APRESENTAÇÃO - Apresentar contexto profissional
2. CONTEXTO DO PROJETO - Cenário atual, necessidade, cálculos técnicos
3. SOLUÇÃO PROPOSTA - Solução técnica detalhada com dimensionamento
4. OPÇÕES DE INVESTIMENTO - Essencial, Recomendada (destacada), Premium - com faixas de investimento reais
5. DIFERENCIAIS DA SOLUÇÃO
6. ESCOPO DO FORNECIMENTO - Engenharia, Materiais, Serviços Técnicos, Documentação
7. PRAZO DE ENTREGA - Cronograma detalhado por fase
8. PREMISSAS
9. EXCLUSÕES
10. VISÃO CONCEITUAL DA SOLUÇÃO
11. FECHAMENTO COMERCIAL

REGRAS:
- Linguagem técnica + comercial equilibrada
- Não inventar marcas ou fabricantes específicos
- Não usar textos genéricos
- Todos os cálculos devem estar implícitos na proposta
- Incluir todos os 12 tipos de serviços (engenharia mecânica, elétrica, software, montagens, instalação, comissionamento, etc)
- Gerar documento pronto para uso profissional
- Data atual: ${new Date().toLocaleDateString('pt-BR')}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Gere a proposta técnica e comercial completa em HTML para o seguinte projeto:

Tipo de aplicação: ${projectData.tipo_aplicacao}
Produção desejada: ${projectData.producao} peças/hora
Descrição da peça: ${projectData.peca}
Peso da peça: ${projectData.peso} kg
Dimensões: ${projectData.dimensoes || "Não informado"}
Ambiente: ${projectData.ambiente}
Nível de automação: ${projectData.automacao}
Processo atual: ${projectData.processo_atual || "Não informado"}
Objetivo do projeto: ${projectData.objetivo}
Observações: ${projectData.observacoes || "Nenhuma"}

Gere a proposta COMPLETA em HTML com todas as 11 seções, cálculos automáticos e detalhamento de serviços.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos em Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-proposal error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
