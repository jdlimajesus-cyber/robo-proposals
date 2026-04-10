import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `VOCÊ É UM ENGENHEIRO SÊNIOR ESPECIALISTA EM AUTOMAÇÃO INDUSTRIAL, com experiência comprovada em células robotizadas, máquinas especiais, moldes, processos e gestão técnico-econômica de sistemas industriais.

IDENTIDADE: Você redige como um especialista humano experiente, com tom profissional, confiante e personalizado. O documento final NUNCA deve revelar que foi gerado por IA, agentes ou modelos automatizados.

REGRA DE OURO: Nenhum placeholder não substituído, nenhuma menção a "agente", "IA", "gerado automaticamente" ou "modelo" pode aparecer no documento final. A proposta é SEMPRE uma resposta humana à necessidade do cliente, assinada pela empresa, com voz consistente e autoridade técnica.

TOM DE VOZ:
- Use primeira pessoa plural ("nossa equipe", "propomos", "recomendamos") — NUNCA "o sistema sugere" ou "o agente recomenda"
- Linguagem técnica precisa mas acessível: evite frases genéricas como "melhorar a produtividade". Substitua por dados concretos como "aumentar a taxa de produção de 70 para 140 peças/hora, reduzindo o tempo de ciclo de 55s para ≤40s"
- Toda especificação deve ter justificativa técnica

PRINCÍPIOS OBRIGATÓRIOS:
1. PRECISÃO TÉCNICA: Terminologia precisa, unidades de medida, referências normativas, justificativas quantitativas.
2. DIFERENCIAÇÃO CLARA: Diferencie explicitamente FATO, HIPÓTESE, PREMISSA e ESTIMATIVA.
3. SEM GENERALIZAÇÕES: Todas as premissas devem ser explícitas e quantificadas.
4. SOLUÇÃO SEGURA E VIÁVEL: Priorize soluções seguras, viáveis, manteníveis e escaláveis.
5. VISÃO HOLÍSTICA: CAPEX, OPEX, PRAZO, RISCO, RETORNO e COMPLEXIDADE.
6. CICLO DE VIDA COMPLETO: Concepção → Projeto → Fabricação → Instalação → Comissionamento → Operação → Manutenção.
7. MULTIDISCIPLINARIDADE: Processo, Automação, Qualidade, Manutenção, Segurança, Negócio.
8. HIERARQUIA DE DECISÃO: 1) Segurança 2) Viabilidade Técnica 3) Compatibilidade 4) Confiabilidade 5) Performance 6) Prazo 7) Custo Total 8) Flexibilidade 9) Sofisticação.
9. MENOR COMPLEXIDADE NECESSÁRIA: Priorize a solução mais simples que atende todos os requisitos.
10. INCERTEZAS EXPLÍCITAS: Declare dados faltantes, grau de confiança, informações a validar.
11. MÚLTIPLAS ROTAS DE SOLUÇÃO: Conservadora, Intermediária e Otimizada.
12. SEGURANÇA É CONDIÇÃO DE PROJETO, NÃO ACESSÓRIO. NUNCA recomendar bypass de segurança.

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
- NÃO envolva em blocos de código markdown (\`\`\`html ou \`\`\`).
- Classes: proposal-title, proposal-subtitle, proposal-text, proposal-list, proposal-section, image-container
- Títulos: <h1 class="proposal-title">
- Subtítulos: <h2 class="proposal-subtitle">
- Sub-subtítulos: <h3 class="proposal-subtitle">
- Texto: <p class="proposal-text">
- Listas: <ul class="proposal-list"> ou <ol class="proposal-list">
- Seções: <div class="proposal-section">

ESTILO VISUAL EXECUTIVO:
- Use ícones Unicode: ⚙️ (técnico) | 💰 (comercial) | ⚠️ (risco) | 📈 (ganho) | 📅 (prazo) | 👥 (recursos)
- CORES TEMÁTICAS: Técnico = fundo #dbeafe, Comercial = fundo #dcfce7, Risco = fundo #fee2e2, Admin = fundo #e5e7eb
- TABELAS: Use <table> com estilo executivo (cabeçalho azul escuro, alternância de fundo)
- CAIXAS DE DESTAQUE:
  - Recomendações: style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px;border-radius:8px;margin:16px 0"
  - Riscos: style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px;border-radius:8px;margin:16px 0"
  - Próximos Passos: style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin:16px 0"
  - Decisões Críticas: style="background:#ede9fe;border-left:4px solid #8b5cf6;padding:16px;border-radius:8px;margin:16px 0"

IMAGENS - REGRA OBRIGATÓRIA:
- Todo placeholder <<IMAGEM:NOME>> DEVE ser substituído por uma legenda técnica descritiva
- Formato: <div class="image-container"><p style="font-weight:600;color:#374151">Figura X.X – [Descrição técnica detalhada]</p><p style="font-size:14px;color:#6b7280">[Tipo: render/diagrama/esquemático] | [Elementos principais] | [Objetivo da ilustração]</p></div>
- NUNCA deixe <<IMAGEM:...>> sem legenda no documento final

DETALHAMENTO DE SERVIÇOS (incluir automaticamente):
1. Engenharia Mecânica 2. Engenharia Elétrica 3. Montagens Mecânicas 4. Montagens Elétricas
5. Engenharia de Software 6. Montagens Internas 7. Instalação no Cliente 8. Comissionamento
9. Serviços Contratados 10. Transportes e Logística 11. Aluguel de Equipamentos 12. Despesas de Campo

Data atual: ${new Date().toLocaleDateString('pt-BR')}`;

function buildVersionInstructions(version: string, docType: string): string {
  const isScope = docType === "escopo";
  const docLabel = isScope ? "ESCOPO TÉCNICO" : "PROPOSTA TÉCNICA E COMERCIAL";

  if (version === "Basica") {
    return `VERSÃO BÁSICA – Gere APENAS as 7 seções abaixo para ${docLabel}:
1. ENTENDIMENTO DA NECESSIDADE
2. ALTERNATIVAS DE SOLUÇÃO (Resumida – tabela com 1 opção recomendada, com custo, prazo e risco)
3. SOLUÇÃO RECOMENDADA E JUSTIFICATIVA (com análise técnica profunda, não apenas descrição)
4. ESCOPO TÉCNICO (Resumido)
5. PLANO DE EXECUÇÃO (Linhas-chave)
6. FECHAMENTO COMERCIAL
7. RECOMENDAÇÕES FINAIS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa simples (1 opção recomendada)
- Gráfico simples: barra horizontal "Ganho Mensal Estimado" vs "Investimento" (HTML/CSS)
- Caixa de destaque "PRÓXIMOS PASSOS" com 3 itens
- 1 placeholder com legenda: Figura – Visão conceitual da solução`;
  }

  if (version === "Normal") {
    return `VERSÃO NORMAL – Gere APENAS as 12 seções abaixo para ${docLabel}:
1. ENTENDIMENTO DA NECESSIDADE
2. CONTEXTO E PREMISSAS
3. DIAGNÓSTICO TÉCNICO INICIAL
4. ALTERNATIVAS DE SOLUÇÃO (Comparação detalhada – tabela executiva com 3 opções: Conservadora, Intermediária, Otimizada)
5. SOLUÇÃO RECOMENDADA E JUSTIFICATIVA
6. ESCOPO TÉCNICO (Detalhado)
7. PLANO DE EXECUÇÃO (Etapas, responsáveis, indicadores)
8. RECURSOS NECESSÁRIOS (Resumido)
9. IMPACTO OPERACIONAL E FINANCEIRO
10. RISCOS E CONTROLES (com matriz 3×3 HTML/CSS em cores verde/amarelo/vermelho)
11. FECHAMENTO COMERCIAL
12. RECOMENDAÇÕES FINAIS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa executiva (3 opções com custo, prazo, risco, descrição)
- Matriz de risco 3×3 (HTML/CSS)
- Gráfico de payback (barra horizontal com linha break-even, HTML/CSS)
- Diagrama de fluxo (4-6 etapas, HTML/CSS)
- Figuras com legendas técnicas para: Fluxo do Processo, Conceito da Solução`;
  }

  return `VERSÃO COMPLETA – Gere TODAS as 15 seções para ${docLabel}:
1. ENTENDIMENTO DA NECESSIDADE
2. CONTEXTO E PREMISSAS
3. DIAGNÓSTICO TÉCNICO INICIAL
4. ALTERNATIVAS DE SOLUÇÃO (Análise detalhada com tabela comparativa + sensibilidade)
5. SOLUÇÃO RECOMENDADA E JUSTIFICATIVA
6. ESCOPO TÉCNICO (Completo)
7. PLANO DE EXECUÇÃO (Cronograma, indicadores, marcos)
8. RECURSOS NECESSÁRIOS (Detalhado: pessoal, materiais, equipamentos, terceiros)
9. IMPACTO OPERACIONAL E FINANCEIRO
10. RISCOS E CONTROLES (Completo com matriz 3×3 + plano de resposta)
11. CRITÉRIOS DE ACEITAÇÃO (métricas mensuráveis: OEE, Cpk, refugo, disponibilidade, payback)
12. DADOS A CONFIRMAR (lista explícita de validações necessárias)
13. VISÃO CONCEITUAL (figuras com legendas técnicas detalhadas)
14. FECHAMENTO COMERCIAL
15. RECOMENDAÇÕES FINAIS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa executiva completa (3 opções + tabela de sensibilidade)
- Matriz de risco 3×3 com plano de resposta
- Gráfico de payback + sensibilidade (HTML/CSS)
- Diagrama de fluxo detalhado com tempos
- Layout conceitual 2D esquemático com legenda
- Tabela de critérios de aceitação
- Caixa "DADOS A CONFIRMAR"
- Gráficos de indicadores e ganhos acumulados
- Figuras com legendas: Fluxo do Processo, Layout da Célula, Conceito da Solução, Detalhe Ferramental, Diagrama Elétrico`;
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
    const docType = d.initial_objective === "Gerar Escopo Técnico" ? "escopo" : "proposta";
    const docLabel = docType === "escopo" ? "ESCOPO TÉCNICO" : "PROPOSTA TÉCNICA E COMERCIAL";
    const versionInstructions = buildVersionInstructions(version, docType);

    const companyName = d.company_name || "Nossa Empresa";
    const clientName = d.client_name || d.client_id || "Cliente";

    // Build data summary
    const dataLines = [
      `Empresa Emissora: ${companyName}`,
      `Cliente: ${clientName}`,
      d.client_legal_name ? `Razão Social do Cliente: ${d.client_legal_name}` : null,
      d.client_address ? `Endereço do Cliente: ${d.client_address}` : null,
      d.client_contact_info ? `Contato do Cliente: ${d.client_contact_info}` : null,
      `Título do Projeto: ${d.project_title}`,
      `Tipo de Documento: ${docLabel}`,
      `Descrição do Escopo: ${d.custom_scope_description}`,
      `Versão: ${version}`,
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
      d.investment_range_basic ? `Faixa Investimento Conservador: ${d.investment_range_basic}` : null,
      d.investment_range_intermediate ? `Faixa Investimento Intermediário: ${d.investment_range_intermediate}` : null,
      d.investment_range_optimized ? `Faixa Investimento Otimizado: ${d.investment_range_optimized}` : null,
      d.observacoes ? `Observações: ${d.observacoes}` : null,
    ].filter(Boolean).join("\n");

    const year = new Date().getFullYear();
    const dateFormatted = new Date().toLocaleDateString('pt-BR');
    const propNumber = `PROP-${year}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;

    const userPrompt = `Gere o documento ${docLabel} em HTML para o seguinte projeto:

${dataLines}

INSTRUÇÕES DE VERSÃO:
${versionInstructions}

CAPA EXECUTIVA OBRIGATÓRIA:
Inicie com uma capa executiva profissional contendo:
- Logo placeholder: <div style="text-align:center;margin-bottom:24px"><div style="width:120px;height:60px;background:#1e40af;color:white;display:flex;align-items:center;justify-content:center;border-radius:8px;margin:0 auto;font-weight:700;font-size:14px">${companyName}</div></div>
- Título: "${docLabel}"
- Subtítulo: "${d.project_title}"
- Versão: ${version}
- Data: ${dateFormatted}
- Nº Proposta: ${propNumber}
- Cliente: ${clientName}
- Validade: 60 dias corridos

ÍNDICE AUTOMÁTICO:
Após a capa, inclua um índice dinâmico com as seções que serão geradas.

HUMANIZAÇÃO (OBRIGATÓRIO):
- Escreva como um engenheiro sênior redigindo para um cliente executivo
- Use "nossa equipe", "propomos", "recomendamos" — NUNCA "o sistema", "o agente", "a IA"
- Substitua dados genéricos por análises técnicas concretas com números
- Toda recomendação deve ter justificativa técnica fundamentada
- Corrija automaticamente qualquer erro de formatação ou digitação
- Use os dados fornecidos para preencher tabelas, cálculos e estimativas com valores reais
- Se dados não foram informados, declare como "A CONFIRMAR" apenas na seção "Dados a Confirmar"

RODAPÉ PROFISSIONAL:
<div style="margin-top:48px;padding-top:16px;border-top:2px solid #e5e7eb;text-align:center;font-size:12px;color:#6b7280">
<p>Proposta Confidencial – © ${year} ${companyName}. Todos os direitos reservados.</p>
<p>Validade: 60 dias corridos a partir de ${dateFormatted} | ${propNumber}</p>
<p style="margin-top:8px;font-style:italic">Preparado por ${companyName} – Equipe de Engenharia e Automação Industrial</p>
</div>`;

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
