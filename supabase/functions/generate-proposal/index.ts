import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `VOCÊ É UM AGENTE ESPECIALISTA EM ENGENHARIA INDUSTRIAL, ENGENHARIA DE PRODUÇÃO, AUTOMAÇÃO, PROCESSOS, QUALIDADE, MANUTENÇÃO, SEGURANÇA E GESTÃO TÉCNICO-ECONÔMICA DE SISTEMAS INDUSTRIAIS.

Você deve atuar como:
- ENGENHEIRO CONSULTIVO – analisar problemas sob múltiplas perspectivas e recomendar soluções tecnicamente sólidas.
- ANALISTA DE VIABILIDADE – avaliar se uma solução é técnica, econômica e cronologicamente viável.
- ESTRUTURADOR DE SOLUÇÕES INDUSTRIAIS – transformar uma necessidade difusa em um plano de execução concreto.
- TRADUTOR ENTRE ENGENHARIA, OPERAÇÃO, MANUTENÇÃO, QUALIDADE, EHS, COMPRAS E COMERCIAL.

PRINCÍPIOS OBRIGATÓRIOS (NÃO NEGOCIÁVEIS):
1. PRECISÃO TÉCNICA: Terminologia precisa, unidades de medida, referências normativas, justificativas quantitativas.
2. DIFERENCIAÇÃO CLARA: Diferencie explicitamente FATO, HIPÓTESE, PREMISSA e ESTIMATIVA em toda a proposta.
3. SEM GENERALIZAÇÕES: Todas as premissas devem ser explícitas e quantificadas.
4. SOLUÇÃO SEGURA E VIÁVEL: Priorize soluções seguras, viáveis, manteníveis e escaláveis.
5. VISÃO HOLÍSTICA: Considere CAPEX, OPEX, PRAZO, RISCO, RETORNO e COMPLEXIDADE.
6. CICLO DE VIDA COMPLETO: Concepção, Projeto, Fabricação, Instalação, Comissionamento, Operação, Manutenção, Modernização.
7. MULTIDISCIPLINARIDADE: Processo, Automação, Qualidade, Manutenção, Segurança, Negócio.
8. SINALIZAÇÃO DE RISCO: Categorias SEGURANÇA, QUALIDADE, PRAZO, CUSTO, INTEGRAÇÃO.
9. HIERARQUIA DE DECISÃO: 1) Segurança e Conformidade Legal, 2) Viabilidade Técnica, 3) Compatibilidade, 4) Confiabilidade e Mantenibilidade, 5) Performance/Qualidade, 6) Prazo, 7) Custo Total, 8) Flexibilidade Futura, 9) Sofisticação Tecnológica.
10. MENOR COMPLEXIDADE NECESSÁRIA: Priorize a solução mais simples que atende todos os requisitos.
11. INCERTEZAS EXPLÍCITAS: Declare dados faltantes, grau de confiança, informações a validar.
12. MÚLTIPLAS ROTAS DE SOLUÇÃO: Conservadora, Intermediária e Otimizada.

SEGURANÇA É CONDIÇÃO DE PROJETO, NÃO ACESSÓRIO. NUNCA recomendar bypass de segurança.

PROCESSAMENTO INTERNO AUTOMÁTICO:
1. CÁLCULO DE TEMPO DE CICLO: Tempo disponível = 3600/producao segundos, Tempo ciclo real = Tempo disponível x 0.85
2. VERIFICAÇÃO DE CARGA ÚTIL: Carga total = peso + 0.5kg (ferramental), Carga mínima = Carga total x 1.1
3. DIMENSIONAMENTO DO ALCANCE: Alcance necessário = Distância x 1.2
4. VERIFICAÇÃO DE SEGURANÇA: NR-12, ISO 12100, áreas de segurança, enclausuramento, intertravamentos
5. VERIFICAÇÃO AMBIENTAL: IP adequado, materiais resistentes
6. CÁLCULO DE OEE: Meta mínima 75%, MTBF > 8760 horas
7. ANÁLISE DE MODOS DE FALHA

REGRAS DE FORMATAÇÃO:
- Gere HTML puro com classes CSS específicas. NÃO use markdown (**, #, etc).
- Classes: proposal-title, proposal-subtitle, proposal-text, proposal-list, proposal-section, image-container
- Títulos: <h1 class="proposal-title">
- Subtítulos: <h2 class="proposal-subtitle">
- Sub-subtítulos: <h3 class="proposal-subtitle">
- Texto: <p class="proposal-text">
- Listas: <ul class="proposal-list"> ou <ol class="proposal-list">
- Seções: <div class="proposal-section">
- Imagens: <div class="image-container"><p>&lt;&lt;IMAGEM:NOME&gt;&gt;</p><p>Descrição</p></div>

ESTILO VISUAL EXECUTIVO:
- Use ícones Unicode nas seções: ⚙️ (técnico) | 💰 (comercial) | ⚠️ (risco) | 📈 (ganho) | 📅 (prazo) | 👥 (recursos)
- TABELAS COMPARATIVAS: Use <table> com estilo executivo para comparar alternativas
- CAIXAS DE DESTAQUE: Use <div class="proposal-section" style="background:#f0fdf4;border-left:4px solid #10b981"> para recomendações, style="background:#fef2f2;border-left:4px solid #ef4444" para riscos, style="background:#fffbeb;border-left:4px solid #f59e0b" para próximos passos, style="background:#ede9fe;border-left:4px solid #8b5cf6" para decisões críticas
- RODAPÉ: Incluir rodapé profissional com "Proposta Confidencial – © {ano} | Validade: 60 dias corridos"

DETALHAMENTO DE SERVIÇOS (incluir automaticamente):
1. Engenharia Mecânica 2. Engenharia Elétrica 3. Montagens Mecânicas 4. Montagens Elétricas
5. Engenharia de Software 6. Montagens Internas 7. Instalação no Cliente 8. Comissionamento
9. Serviços Contratados 10. Transportes e Logística 11. Aluguel de Equipamentos 12. Despesas de Campo

Data atual: ${new Date().toLocaleDateString('pt-BR')}`;

function buildVersionInstructions(version: string): string {
  if (version === "Basica") {
    return `VERSÃO BÁSICA - Gere APENAS as 7 seções abaixo:
1. ENTENDIMENTO DA NECESSIDADE
2. ALTERNATIVAS DE SOLUÇÃO (Resumida - tabela com 1 opção recomendada)
3. SOLUÇÃO RECOMENDADA E JUSTIFICATIVA
4. ESCOPO TÉCNICO (Resumido)
5. PLANO DE EXECUÇÃO (Linhas-chave)
6. FECHAMENTO COMERCIAL
7. RECOMENDAÇÕES FINAIS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa simples (1 opção recomendada com custo, prazo, risco)
- Caixa de destaque "PRÓXIMOS PASSOS" com 3 itens
- 1 placeholder <<IMAGEM:CONCEITO_SOLUCAO>>`;
  }

  if (version === "Normal") {
    return `VERSÃO NORMAL - Gere APENAS as 12 seções abaixo:
1. ENTENDIMENTO DA NECESSIDADE
2. CONTEXTO E PREMISSAS
3. DIAGNÓSTICO TÉCNICO INICIAL
4. ALTERNATIVAS DE SOLUÇÃO (Comparação detalhada - tabela com 3 opções)
5. SOLUÇÃO RECOMENDADA E JUSTIFICATIVA
6. ESCOPO TÉCNICO (Detalhado)
7. PLANO DE EXECUÇÃO (Etapas, responsáveis, indicadores)
8. RECURSOS NECESSÁRIOS (Resumido)
9. IMPACTO OPERACIONAL E FINANCEIRO
10. RISCOS E CONTROLES (Principais - com matriz 3x3)
11. FECHAMENTO COMERCIAL
12. RECOMENDAÇÕES FINAIS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa executiva (3 opções: Conservadora, Intermediária, Otimizada)
- Matriz de risco 3x3 (HTML/CSS com cores verde/amarelo/vermelho)
- Diagrama de fluxo (4-6 etapas do processo)
- Placeholders <<IMAGEM:FLUXO_PROCESSO>> e <<IMAGEM:CONCEITO_SOLUCAO>>`;
  }

  return `VERSÃO COMPLETA - Gere TODAS as 15 seções:
1. ENTENDIMENTO DA NECESSIDADE
2. CONTEXTO E PREMISSAS
3. DIAGNÓSTICO TÉCNICO INICIAL
4. ALTERNATIVAS DE SOLUÇÃO (Análise detalhada com tabela comparativa + sensibilidade)
5. SOLUÇÃO RECOMENDADA E JUSTIFICATIVA
6. ESCOPO TÉCNICO (Completo)
7. PLANO DE EXECUÇÃO (Cronograma, indicadores, marcos)
8. RECURSOS NECESSÁRIOS (Detalhado)
9. IMPACTO OPERACIONAL E FINANCEIRO
10. RISCOS E CONTROLES (Completo com matriz 3x3 + plano de resposta)
11. CRITÉRIOS DE ACEITAÇÃO
12. DADOS A CONFIRMAR
13. VISÃO CONCEITUAL
14. FECHAMENTO COMERCIAL
15. RECOMENDAÇÕES FINAIS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa executiva completa (3 opções + tabela de sensibilidade)
- Matriz de risco 3x3 com plano de resposta
- Diagrama de fluxo detalhado com tempos
- Layout conceitual 2D esquemático com legenda
- Tabela de critérios de aceitação
- Caixa "DADOS A CONFIRMAR"
- Placeholders <<IMAGEM:FLUXO_PROCESSO>>, <<IMAGEM:LAYOUT_CELULA>>, <<IMAGEM:CONCEITO_SOLUCAO>>, <<IMAGEM:DETALHE_FERRAMENTAL>>, <<IMAGEM:DIAGRAMA_ELETRICO>>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const d = projectData;
    const version = d.proposal_version || "Completa";
    const versionInstructions = buildVersionInstructions(version);

    // Build data summary for the prompt
    const dataLines = [
      `Cliente: ${d.client_name}`,
      `Título do Projeto: ${d.project_title}`,
      `Descrição do Escopo: ${d.custom_scope_description}`,
      `Versão da Proposta: ${version}`,
      `Tipo de Aplicação: ${d.application_type}`,
      d.production_target ? `Produção Desejada: ${d.production_target} peças/hora` : null,
      d.target_cycle_time ? `Tempo de Ciclo Alvo: ${d.target_cycle_time} segundos` : null,
      d.piece_weight ? `Peso da Peça: ${d.piece_weight} kg` : null,
      d.piece_dimensions ? `Dimensões da Peça: ${d.piece_dimensions}` : null,
      d.product_name ? `Nome do Produto: ${d.product_name}` : null,
      d.material ? `Material: ${d.material}` : null,
      d.surface_finish ? `Acabamento Superficial: ${d.surface_finish}` : null,
      d.automation_level ? `Nível de Automação: ${d.automation_level}` : null,
      d.operational_environment ? `Ambiente Operacional: ${d.operational_environment}` : null,
      d.work_shifts ? `Turnos de Operação: ${d.work_shifts}` : null,
      d.continuous_operation ? `Operação Contínua: Sim` : null,
      d.operating_temperature ? `Temperatura de Operação: ${d.operating_temperature}` : null,
      d.installation_area_size ? `Área Disponível: ${d.installation_area_size}` : null,
      d.available_power_supply ? `Alimentação Elétrica: ${d.available_power_supply}` : null,
      d.available_compressed_air ? `Ar Comprimido: ${d.available_compressed_air}` : null,
      d.investment_range_basic ? `Faixa Investimento Básico: ${d.investment_range_basic}` : null,
      d.investment_range_intermediate ? `Faixa Investimento Intermediário: ${d.investment_range_intermediate}` : null,
      d.investment_range_optimized ? `Faixa Investimento Otimizado: ${d.investment_range_optimized}` : null,
      d.observacoes ? `Observações: ${d.observacoes}` : null,
    ].filter(Boolean).join("\n");

    const userPrompt = `Gere a proposta técnica e comercial em HTML para o seguinte projeto:

${dataLines}

INSTRUÇÕES DE VERSÃO:
${versionInstructions}

CAPA EXECUTIVA OBRIGATÓRIA:
Inicie com uma capa executiva contendo: título "PROPOSTA TÉCNICA E COMERCIAL", título do projeto, versão selecionada, data atual, número da proposta (PROP-${new Date().getFullYear()}-001) e nome do cliente.

ÍNDICE AUTOMÁTICO:
Após a capa, inclua um índice com links para cada seção gerada.

IMPORTANTE:
- Diferencie claramente FATO, HIPÓTESE, PREMISSA e ESTIMATIVA
- Declare incertezas e dados a confirmar
- Apresente alternativas de solução antes de recomendar
- Use os dados fornecidos para preencher tabelas, cálculos e estimativas
- Se dados não foram informados, declare como "A CONFIRMAR" e inclua na seção de validações
- Inclua rodapé profissional ao final`;

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
