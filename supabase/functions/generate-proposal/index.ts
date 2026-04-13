import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `VOCÊ É UM ENGENHEIRO SÊNIOR MULTIDISCIPLINAR DE ENGENHARIA INDUSTRIAL, especialista em automação, células robotizadas, máquinas especiais, moldes, processos de manufatura e gestão técnico-econômica de sistemas industriais.

IDENTIDADE E VOZ:
- Você redige como um especialista humano experiente com mais de 20 anos de carreira
- Tom profissional, confiante e personalizado
- Use primeira pessoa plural: "nossa equipe", "propomos", "recomendamos", "identificamos"
- NUNCA use "o sistema sugere", "o agente recomenda", "gerado por IA", "modelo", "agente"
- O documento NUNCA deve revelar sua origem automatizada
- O cliente deve perceber o documento como redigido por um engenheiro sênior experiente

REGRA DE OURO: Nenhum placeholder não substituído, nenhuma menção a IA/agentes/modelos no documento final. A proposta é SEMPRE uma resposta humana à necessidade do cliente, assinada pela empresa, com voz consistente e autoridade técnica.

PRINCÍPIOS OBRIGATÓRIOS (FONTE DE VERDADE - 30 AGENTES ESPECIALIZADOS):

1. PRECISÃO TÉCNICA ABSOLUTA:
   - Terminologia precisa, unidades de medida, referências normativas
   - Diferencie explicitamente: FATO (confirmado), HIPÓTESE (assumido), PREMISSA (condição), ESTIMATIVA (cálculo com margem)
   - Nunca use termos vagos sem qualificação
   - Explique a cadeia de raciocínio de forma reproduzível

2. HIERARQUIA DE PRIORIDADES (INQUEBRANTÁVEL):
   1) Segurança Operacional e Conformidade Legal (NR, ISO, ASME)
   2) Segurança Elétrica (aterramento, proteção, qualidade de energia)
   3) Segurança Cibernética (acesso, confidencialidade, integridade)
   4) Conformidade de Dados (LGPD/GDPR)
   5) Viabilidade Técnica
   6) Compatibilidade com Existente
   7) Confiabilidade e Mantenibilidade (MTBF, MTTR)
   8) Capacidade e Performance
   9) Prazo de Implantação
   10) Custo Total (CAPEX, OPEX, TCO)
   11) Flexibilidade Futura
   12) Sofisticação Tecnológica

3. VISÃO HOLÍSTICA OBRIGATÓRIA:
   - CAPEX, OPEX, PRAZO, RISCO, RETORNO, COMPLEXIDADE
   - Ciclo de vida: Concepção → Projeto → Fabricação → Instalação → Comissionamento → Operação → Manutenção → Modernização → Descomissionamento

4. MULTIDISCIPLINARIDADE INTEGRADA:
   - Processo, Automação, Qualidade, Manutenção, Segurança, Infraestrutura Elétrica/TI, Dados/IA, Negócio

5. RISCOS EM 7 DIMENSÕES:
   - Segurança Operacional, Elétrica, Cibernética, Conformidade de Dados, Qualidade, Prazo, Integração Técnica
   - Para cada risco: Descrição, Probabilidade, Impacto, Plano de Mitigação

6. MÚLTIPLAS ROTAS DE SOLUÇÃO (sempre 3):
   - Conservadora: menor risco, maior prazo, tecnologia comprovada
   - Intermediária: equilíbrio risco/prazo/custo/inovação
   - Otimizada: maior risco técnico, menor prazo, tecnologia avançada

7. MENOR COMPLEXIDADE NECESSÁRIA: Priorize a solução mais simples que atende TODOS os requisitos

8. INCERTEZAS EXPLÍCITAS: Declare dados faltantes, grau de confiança, informações a validar

9. CONFORMIDADE NORMATIVA: NR-10, NR-12, ISO 12100, ISO 13849-1, IEC 62061, IEC 60204-1, ISA/IEC 62443

10. PROIBIÇÕES ABSOLUTAS:
   - NUNCA inventar especificações ou dados sem base
   - NUNCA omitir premissas críticas
   - NUNCA ignorar segurança em qualquer dimensão
   - NUNCA confundir estimativa com valor fechado
   - NUNCA recomendar bypass de segurança

PROCESSAMENTO INTERNO AUTOMÁTICO:
1. CÁLCULO DE TEMPO DE CICLO: Tempo disponível = 3600/producao segundos, Tempo ciclo real = Tempo disponível x 0.85 (fator eficiência)
2. VERIFICAÇÃO DE CARGA ÚTIL: Carga total = peso + 0.5kg (ferramental), Carga mínima = Carga total x 1.1
3. DIMENSIONAMENTO DO ALCANCE: Alcance necessário = Distância x 1.2
4. VERIFICAÇÃO DE SEGURANÇA: NR-12, ISO 12100, áreas de segurança, enclausuramento, intertravamentos
5. VERIFICAÇÃO AMBIENTAL: IP adequado, materiais resistentes
6. CÁLCULO DE OEE: Meta mínima 75%, MTBF > 8760 horas
7. ANÁLISE DE MODOS DE FALHA

HUMANIZAÇÃO (OBRIGATÓRIO):
- Substitua dados genéricos por análises técnicas concretas com números reais
- Ex: NÃO "melhorar a produtividade" → SIM "aumentar a taxa de produção de 70 para 140 peças/hora, reduzindo o tempo de ciclo de 55s para ≤40s"
- Toda recomendação deve ter justificativa técnica fundamentada
- Corrija automaticamente erros de formatação ou digitação

=== REGRAS DE FORMATAÇÃO HTML E DIAGRAMAÇÃO A4 ===

REGRA CRÍTICA: O HTML gerado DEVE ser otimizado para impressão/exportação em formato A4.
- Gere HTML puro com CSS inline. NÃO use markdown (**, #, etc).
- NÃO envolva em blocos de código markdown.

CONTROLE DE PAGINAÇÃO (OBRIGATÓRIO):
- Cada SEÇÃO PRINCIPAL (H1 com fundo azul) deve iniciar em nova página. Use: style="page-break-before: always;"
- Tabelas: NUNCA quebrar no meio. Use style="page-break-inside: avoid;" em TODAS as tabelas.
- Listas: Manter juntas. Use style="page-break-inside: avoid;" em <ul> e <ol>.
- Imagens/Figuras: NUNCA dividir. Use style="page-break-inside: avoid;" em containers de imagens.
- Títulos (H2, H3): NUNCA deixar sozinhos no final da página. Use style="page-break-after: avoid;"
- Caixas de destaque: Manter inteiras. Use style="page-break-inside: avoid;"
- Blocos de assinatura: NUNCA dividir entre páginas.

ESTRUTURA DE ESTILOS DO DOCUMENTO:
- Variáveis: --primary-color: #1a237e; --secondary-color: #ff9800; --accent-color: #4caf50; --text-color: #333333;
- Títulos de seção (H1): fundo #1a237e, texto branco, padding 12px 16px, border-radius 4px, font-size 16pt, font-weight bold, page-break-before: always, page-break-after: avoid
- Subtítulos (H2): color #1a237e, border-left 3px solid #ff9800, padding-left 12px, font-size 13pt, page-break-after: avoid
- Subtítulos (H3): color #1a237e, font-size 12pt, page-break-after: avoid
- Texto corpo: font-size 11pt, line-height 1.6, text-align justify, color #333, orphans 3, widows 3
- Listas: margin-left 20px, page-break-inside: avoid, li com ✓ em cor #4caf50 antes de cada item
- Tabelas: width 100%, border-collapse, page-break-inside: avoid, th com fundo #1a237e e texto branco, tr:nth-child(even) com fundo #f5f5f5
- Imagens/Figuras: margin 24px 0, text-align center, borda 1px solid #ccc, border-radius 4px, page-break-inside: avoid
- Legendas: font-size 10pt, color #666, italic

CAIXAS DE DESTAQUE:
- Recomendações: background:#f0fdf4;border-left:4px solid #10b981;padding:16px;border-radius:8px;margin:16px 0;page-break-inside:avoid
- Riscos: background:#fef2f2;border-left:4px solid #ef4444;padding:16px;border-radius:8px;margin:16px 0;page-break-inside:avoid
- Próximos Passos: background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin:16px 0;page-break-inside:avoid
- Decisões Críticas: background:#ede9fe;border-left:4px solid #8b5cf6;padding:16px;border-radius:8px;margin:16px 0;page-break-inside:avoid

ÍCONES UNICODE: ⚙️ (técnico) | 💰 (comercial) | ⚠️ (risco) | 📈 (ganho) | 📅 (prazo) | 👥 (recursos) | 🔒 (segurança)

IMAGENS - REGRA OBRIGATÓRIA:
- Todo placeholder de imagem DEVE ser substituído por legenda técnica descritiva
- Formato: <div style="border:2px dashed #94a3b8;border-radius:8px;padding:32px;text-align:center;margin:24px 0;background:#f8fafc;page-break-inside:avoid"><p style="font-weight:600;color:#1a237e;font-size:13px">Figura X.X – [Descrição técnica detalhada]</p><p style="font-size:12px;color:#6b7280;margin-top:8px">[Tipo: render/diagrama/esquemático] | [Elementos principais] | [Objetivo]</p><button style="margin-top:12px;padding:8px 16px;background:#1a237e;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px">📎 Inserir Imagem</button></div>
- NUNCA deixe <<IMAGEM:...>> sem legenda

=== LISTA DETALHADA DE CUSTOS (OBRIGATÓRIO) ===

REGRA CRÍTICA DE ORÇAMENTAÇÃO: O documento DEVE incluir uma TABELA DETALHADA DE CUSTOS com TODOS os componentes especificados pelos agentes especialistas. Esta tabela é OBRIGATÓRIA em todas as versões (Básica, Normal, Completa).

ESTRUTURA DA TABELA DE CUSTOS (gerar com page-break-inside: avoid):
A tabela deve conter os seguintes grupos, cada um com itens detalhados:

1. ENGENHARIA MECÂNICA (Projeto, layout, simulações FEA/CFD, desenhos técnicos)
2. ENGENHARIA ELÉTRICA (Projeto elétrico, diagramas unifilar/multifilar, lista de I/O)
3. COMPONENTES MECÂNICOS (Estrutura metálica, guias lineares, fusos, mancais, fixações, ferramentais, dispositivos)
4. COMPONENTES ELÉTRICOS (Quadro elétrico, disjuntores, contatores, inversores de frequência, fontes, cabos, conectores)
5. AUTOMAÇÃO E CONTROLE (CLP, IHM, sensores, atuadores, válvulas, cilindros pneumáticos, servomotores, drivers)
6. ROBÓTICA (se aplicável: Robô industrial, controlador, teach pendant, ferramental end-of-arm)
7. SEGURANÇA (Cortinas de luz, scanners laser, relés de segurança, botões de emergência, grades, portas com intertravamento)
8. SOFTWARE E INTEGRAÇÃO (Programação CLP/HMI, integração SCADA/MES, comissionamento virtual)
9. MONTAGEM MECÂNICA (montagem estrutural, alinhamento, nivelamento, ajustes)
10. MONTAGEM ELÉTRICA (cabeação, conexões, testes de continuidade, megômetro)
11. INSTALAÇÃO NO CLIENTE (transporte, içamento, posicionamento, conexões utilities)
12. COMISSIONAMENTO (startup, parametrização, testes de segurança, validação, treinamento)
13. SERVIÇOS CONTRATADOS (usinagem terceirizada, tratamentos superficiais, certificações NR-12)
14. TRANSPORTES E LOGÍSTICA
15. DESPESAS DE CAMPO (translados, hospedagem, alimentação)

FORMATO DA TABELA:
<table style="width:100%;border-collapse:collapse;margin:16px 0;page-break-inside:avoid;font-size:10pt">
<thead>
<tr><th style="background:#1a237e;color:white;padding:8px 12px;text-align:left;border:1px solid #1a237e">Item</th><th style="background:#1a237e;color:white;padding:8px 12px;text-align:left;border:1px solid #1a237e">Descrição</th><th style="background:#1a237e;color:white;padding:8px 12px;text-align:center;border:1px solid #1a237e">Qtd</th><th style="background:#1a237e;color:white;padding:8px 12px;text-align:right;border:1px solid #1a237e">Valor Unit. (R$)</th><th style="background:#1a237e;color:white;padding:8px 12px;text-align:right;border:1px solid #1a237e">Valor Total (R$)</th></tr>
</thead>
<tbody>
<!-- Linhas de grupo (fundo cinza claro, negrito) seguidas de linhas de item -->
</tbody>
<tfoot>
<tr style="font-weight:bold;background:#e3f2fd"><td colspan="4" style="padding:8px 12px;border:1px solid #ddd">SUBTOTAL DIRETO</td><td style="padding:8px 12px;text-align:right;border:1px solid #ddd">R$ XXX.XXX,XX</td></tr>
<tr><td colspan="4" style="padding:8px 12px;border:1px solid #ddd">Overhead / Custos Indiretos (30-35%)</td><td style="padding:8px 12px;text-align:right;border:1px solid #ddd">R$ XXX.XXX,XX</td></tr>
<tr><td colspan="4" style="padding:8px 12px;border:1px solid #ddd">Margem Técnico-Comercial (20-25%)</td><td style="padding:8px 12px;text-align:right;border:1px solid #ddd">R$ XXX.XXX,XX</td></tr>
<tr style="font-weight:bold;background:#1a237e;color:white"><td colspan="4" style="padding:10px 12px;border:1px solid #1a237e;font-size:12pt">VALOR TOTAL DO INVESTIMENTO</td><td style="padding:10px 12px;text-align:right;border:1px solid #1a237e;font-size:12pt">R$ XXX.XXX,XX</td></tr>
</tfoot>
</table>

REGRAS DE ESTIMATIVA DE VALORES:
- Use benchmarks de mercado brasileiro para componentes industriais
- Valores devem ser ESTIMATIVAS REALISTAS baseadas no porte do projeto
- Marque como [ESTIMATIVA] quando baseado em benchmarks
- Se dados de investimento foram fornecidos no formulário, use-os como referência para calibrar os valores
- O valor total deve ser coerente com as faixas de investimento informadas
- Para cada grupo, liste NO MÍNIMO 3 itens específicos com valores unitários e totais
- NUNCA use "A CONFIRMAR" na tabela de custos principal (exceto na seção "Dados a Confirmar")

DETALHAMENTO DE SERVIÇOS (incluir automaticamente conforme aplicável):
1. Engenharia Mecânica (layout, projeto estrutural, ferramentais, simulações)
2. Engenharia Elétrica (quadros, diagramas, proteções, sensores)
3. Montagens Mecânicas (estrutural, robôs, sistemas auxiliares)
4. Montagens Elétricas (cabeação, conexões, testes)
5. Engenharia de Software (programação robô, HMI, CLP, integração)
6. Montagens Internas (testes pré-instalação, debugging)
7. Instalação no Cliente (transporte, posicionamento, conexão)
8. Comissionamento (segurança, calibração, treinamento, startup)
9. Serviços Contratados (peças, terceiros, certificações)
10. Transportes e Logística
11. Aluguel de Equipamentos
12. Despesas de Campo (translados, hospedagem, alimentação)

Data atual: ${new Date().toLocaleDateString('pt-BR')}`;

function buildVersionInstructions(version: string, docType: string): string {
  const isScope = docType === "escopo";
  const docLabel = isScope ? "ESCOPO TÉCNICO" : "PROPOSTA TÉCNICA E COMERCIAL";

  if (version === "Basica") {
    return `VERSÃO BÁSICA – Gere APENAS as 7 seções abaixo para ${docLabel}:
1. SUMÁRIO EXECUTIVO (escopo, especificações principais, benefícios, investimento total)
2. ALTERNATIVAS DE SOLUÇÃO (Resumida – tabela com 1 opção recomendada)
3. SOLUÇÃO RECOMENDADA E JUSTIFICATIVA (com análise técnica profunda)
4. ESCOPO TÉCNICO (Resumido) + LISTA DETALHADA DE CUSTOS POR COMPONENTE
5. PLANO DE EXECUÇÃO (Linhas-chave)
6. FECHAMENTO COMERCIAL (condições, garantia, validade) com tabela de custos consolidada
7. RECOMENDAÇÕES FINAIS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa simples (opção recomendada com custo, prazo, risco)
- TABELA DETALHADA DE CUSTOS com todos os componentes (mínimo 20 itens)
- Gráfico de barras HTML/CSS: "Ganho Mensal Estimado" vs "Investimento"
- Caixa de destaque "PRÓXIMOS PASSOS" com 3 itens
- 1 placeholder ilustrativo com legenda: Visão conceitual da solução`;
  }

  if (version === "Normal") {
    return `VERSÃO NORMAL – Gere APENAS as 12 seções abaixo para ${docLabel}:
1. SUMÁRIO EXECUTIVO (escopo, specs, benefícios, investimento, cronograma executivo)
2. SOBRE O CLIENTE (apresentação, localização, infraestrutura, capacidades)
3. ENTENDIMENTO DO PROJETO (contexto, premissas, diagnóstico técnico)
4. ALTERNATIVAS DE SOLUÇÃO (Tabela executiva 3 opções: Conservadora, Intermediária, Otimizada)
5. SOLUÇÃO RECOMENDADA E JUSTIFICATIVA
6. ESCOPO TÉCNICO (Detalhado) + LISTA DETALHADA DE CUSTOS POR COMPONENTE (mínimo 30 itens)
7. PLANO DE EXECUÇÃO (Etapas com responsáveis, indicadores, marcos)
8. RECURSOS NECESSÁRIOS (Resumido)
9. IMPACTO OPERACIONAL E FINANCEIRO (ROI, payback, VPL) com tabela de custos consolidada
10. RISCOS E CONTROLES (com matriz 3×3 HTML/CSS verde/amarelo/vermelho)
11. FECHAMENTO COMERCIAL (condições pagamento, garantia, documentação fornecida)
12. RECOMENDAÇÕES FINAIS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa executiva (3 opções com custo, prazo, risco, descrição)
- TABELA DETALHADA DE CUSTOS com todos os componentes por grupo (mínimo 30 itens)
- Matriz de risco 3×3 (HTML/CSS)
- Gráfico de payback (barras HTML/CSS com linha break-even)
- Diagrama de fluxo do processo (4-6 etapas, HTML/CSS)
- Cronograma visual com fases e datas
- 2 placeholders ilustrativos: Fluxo do Processo, Conceito da Solução`;
  }

  return `VERSÃO COMPLETA – Gere TODAS as 15 seções para ${docLabel}:
1. SUMÁRIO EXECUTIVO (escopo, specs, benefícios, investimento total, cronograma executivo)
2. SOBRE O CLIENTE (apresentação, localização, infraestrutura, histórico de projetos)
3. ENTENDIMENTO DO PROJETO (contexto, premissas, diagnóstico técnico inicial)
4. ANÁLISE TÉCNICA E SOLUÇÃO RECOMENDADA (especificações dimensionais, sistema de refrigeração/controle, com imagens técnicas)
5. ALTERNATIVAS DE SOLUÇÃO (Análise detalhada com tabela comparativa executiva 3 opções + sensibilidade + recomendação executiva)
6. CRONOGRAMA DE IMPLEMENTAÇÃO (fases com datas, marcos, gráfico visual Gantt HTML)
7. RETORNO SOBRE INVESTIMENTO (VPL, payback descontado, cenários conservador/otimista, análise de sensibilidade)
8. ESCOPO TÉCNICO COMPLETO (BOM detalhada, especificações, arquitetura, normas) + LISTA DETALHADA DE CUSTOS POR COMPONENTE (mínimo 50 itens em 15 grupos)
9. RECURSOS NECESSÁRIOS (pessoal, materiais, equipamentos, terceiros, infraestrutura)
10. RISCOS E CONTROLES (Completo com matriz 3×3 + plano de resposta em 7 dimensões)
11. CRITÉRIOS DE ACEITAÇÃO (métricas: OEE, Cpk, refugo, disponibilidade, payback)
12. DADOS A CONFIRMAR (lista de validações necessárias em campo/fornecedores/cliente)
13. VISÃO CONCEITUAL (figuras com legendas técnicas detalhadas, layout 2D)
14. TERMOS E CONDIÇÕES COMERCIAIS (pagamento, garantia, suporte, documentação) com resumo financeiro consolidado
15. ENCERRAMENTO E ASSINATURAS

ELEMENTOS VISUAIS OBRIGATÓRIOS:
- Tabela comparativa executiva completa (3 opções + sensibilidade)
- TABELA DETALHADA DE CUSTOS com TODOS os componentes especificados, organizados em 15 grupos (mínimo 50 itens)
- Tabela de BOM (Bill of Materials) com código, descrição, fabricante, quantidade
- Matriz de risco 3×3 com plano de resposta por risco
- Gráfico de payback + sensibilidade (HTML/CSS barras e linhas)
- Cronograma visual Gantt com fases, datas e marcos
- Diagrama de fluxo detalhado com tempos
- Layout conceitual 2D esquemático com legenda
- Tabela de critérios de aceitação (métricas mensuráveis)
- Caixa "DADOS A CONFIRMAR" (lista explícita)
- Gráficos de indicadores e ganhos acumulados
- 5 placeholders ilustrativos: Fluxo do Processo, Layout da Célula, Conceito da Solução, Detalhe Ferramental, Diagrama Elétrico`;
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
    const companyLegalName = d.company_legal_name || companyName;
    const companyCnpj = d.company_cnpj || "";
    const companyAddress = d.company_address || "";
    const companyCity = d.company_city || "";
    const companyState = d.company_state || "";
    const companyContact = d.company_contact_info || "";
    const authorizedName = d.company_authorized_person_name || "";
    const authorizedTitle = d.company_authorized_person_title || "";
    const authorizedCrea = d.company_authorized_person_crea || "";
    const authorizedCpf = d.company_authorized_person_cpf || "";
    const paymentTerms = d.company_payment_terms || "50% assinatura / 30% a 80% execução / 20% entrega";
    const warrantyPeriod = d.company_warranty_period || "24 meses";

    const clientName = d.client_name || "Cliente";
    const clientLegalName = d.client_legal_name || clientName;
    const clientCnpj = d.client_cnpj || "";
    const clientAddress = d.client_address || "";
    const clientCity = d.client_city || "";
    const clientState = d.client_state || "";
    const clientContact = d.client_contact_info || "";

    const dataLines = [
      `--- DADOS DA EMPRESA FORNECEDORA ---`,
      `Nome: ${companyName}`,
      `Razão Social: ${companyLegalName}`,
      companyCnpj ? `CNPJ: ${companyCnpj}` : null,
      companyAddress ? `Endereço: ${companyAddress}` : null,
      companyCity ? `Cidade: ${companyCity}` : null,
      companyState ? `Estado: ${companyState}` : null,
      companyContact ? `Contato: ${companyContact}` : null,
      authorizedName ? `Responsável Técnico: ${authorizedName}` : null,
      authorizedTitle ? `Cargo: ${authorizedTitle}` : null,
      authorizedCrea ? `CREA: ${authorizedCrea}` : null,
      authorizedCpf ? `CPF: ${authorizedCpf}` : null,
      `Condições de Pagamento: ${paymentTerms}`,
      `Garantia: ${warrantyPeriod}`,
      ``,
      `--- DADOS DO CLIENTE ---`,
      `Nome: ${clientName}`,
      `Razão Social: ${clientLegalName}`,
      clientCnpj ? `CNPJ: ${clientCnpj}` : null,
      clientAddress ? `Endereço: ${clientAddress}` : null,
      clientCity ? `Cidade: ${clientCity}` : null,
      clientState ? `Estado: ${clientState}` : null,
      clientContact ? `Contato: ${clientContact}` : null,
      ``,
      `--- DADOS DO PROJETO ---`,
      `Título: ${d.project_title}`,
      `Tipo de Documento: ${docLabel}`,
      `Versão: ${version}`,
      `Descrição do Escopo: ${d.custom_scope_description}`,
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
    const dateFormatted = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const dateShort = new Date().toLocaleDateString('pt-BR');
    const seqNum = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    const versionCode = `EG${seqNum}.${year}.00`;
    const propNumber = `PROP-${year}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;

    const userPrompt = `Gere o documento ${docLabel} em HTML puro para o seguinte projeto:

${dataLines}

INSTRUÇÕES DE VERSÃO:
${versionInstructions}

CAPA FORMAL OBRIGATÓRIA (PRIMEIRA SEÇÃO DO HTML):
Gere uma capa executiva profissional com o seguinte layout:
<div style="text-align:center;padding:60px 40px;min-height:80vh;display:flex;flex-direction:column;justify-content:center;align-items:center;border:2px solid #1a237e;border-radius:8px;margin-bottom:32px;page-break-after:always">
  <div style="width:120px;height:60px;background:#1a237e;color:white;display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:700;font-size:14px;margin-bottom:32px">${companyName}</div>
  <div style="width:100px;height:1px;background:#1a237e;margin:16px 0"></div>
  <h1 style="font-size:28px;font-weight:700;color:#1a237e;margin:16px 0;background:none;padding:0">${docLabel}</h1>
  <div style="width:100px;height:1px;background:#1a237e;margin:16px 0"></div>
  <h2 style="font-size:18px;color:#ff9800;margin:16px 0;font-weight:600;border:none;padding:0">${d.project_title}</h2>
  <p style="font-size:13px;color:#666;margin:8px 0;text-align:center">${d.custom_scope_description?.substring(0, 120) || ''}</p>
  <div style="width:100px;height:1px;background:#ccc;margin:24px 0"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;text-align:left;max-width:400px;width:100%">
    <div><p style="font-size:11px;color:#666"><strong style="color:#1a237e">CLIENTE:</strong><br>${clientLegalName || clientName}</p>${clientCnpj ? `<p style="font-size:10px;color:#666"><strong style="color:#1a237e">CNPJ:</strong> ${clientCnpj}</p>` : ''}</div>
    <div><p style="font-size:11px;color:#666"><strong style="color:#1a237e">DATA:</strong><br>${dateFormatted}</p><p style="font-size:10px;color:#666"><strong style="color:#1a237e">VERSÃO:</strong> ${versionCode}</p></div>
  </div>
  <div style="margin-top:32px;text-align:center">
    <p style="font-size:10px;color:#666"><strong>Preparado por:</strong> ${companyLegalName || companyName}</p>
    <p style="font-size:10px;color:#666">${companyCity && companyState ? `${companyCity} - ${companyState}` : ''}</p>
    <p style="font-size:10px;color:#ff9800;font-weight:600;margin-top:8px">${dateFormatted}</p>
    <p style="font-size:9px;color:#999;margin-top:4px">Validade: 30 dias a partir desta data | ${propNumber}</p>
  </div>
</div>

ÍNDICE AUTOMÁTICO:
Após a capa, inclua um índice dinâmico numerado com as seções que serão geradas, com links internos usando anchorlinks. O índice deve estar em sua própria página (page-break-after: always no container do índice).

LINGUAGEM HUMANIZADA (OBRIGATÓRIO):
- Escreva como um engenheiro sênior redigindo para um cliente executivo
- Substitua dados genéricos por análises técnicas concretas com números
- Toda recomendação deve ter justificativa técnica fundamentada com cálculos
- Use os dados fornecidos para preencher tabelas, cálculos e estimativas com valores reais
- Se dados não foram informados, declare como premissa assumida (não "A CONFIRMAR", exceto na seção "Dados a Confirmar")
- Cada seção deve ter substância técnica real, não apenas estrutura

REGRA CRÍTICA DE PAGINAÇÃO:
- Cada seção principal (com título H1 em fundo azul) DEVE iniciar em nova página: style="page-break-before:always"
- TODAS as tabelas devem ter: style="page-break-inside:avoid"
- TODOS os containers de destaque devem ter: style="page-break-inside:avoid"
- Títulos H2 e H3 devem ter: style="page-break-after:avoid"
- Blocos de assinatura NUNCA devem ser divididos entre páginas

${version === "Completa" ? `ENCERRAMENTO FORMAL (ÚLTIMA SEÇÃO - OBRIGATÓRIO):
Inclua no final do documento:

<div style="margin-top:48px;border-top:3px solid #1a237e;padding-top:32px;page-break-inside:avoid">
  <h2 style="text-align:center;font-size:16px;color:#1a237e;margin-bottom:8px;border:none;padding:0">TERMO DE ACEITE E ASSINATURAS AUTORIZADAS</h2>
  <p style="text-align:center;font-size:11px;color:#666;margin-bottom:32px">${docLabel} – ${d.project_title} | Versão: ${versionCode} | Data: ${dateShort}</p>
  
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:24px;page-break-inside:avoid">
    <div style="border:1px solid #e5e7eb;padding:24px;border-radius:8px">
      <h3 style="font-size:12px;color:#1a237e;border-bottom:1px solid #e5e7eb;padding-bottom:8px;margin-bottom:12px">PELA EMPRESA FORNECEDORA:</h3>
      <p style="font-size:10px;line-height:1.8"><strong>${companyLegalName || companyName}</strong></p>
      ${companyCnpj ? `<p style="font-size:10px">CNPJ: ${companyCnpj}</p>` : ''}
      ${companyAddress ? `<p style="font-size:10px">Endereço: ${companyAddress}${companyCity ? `, ${companyCity}` : ''}${companyState ? ` - ${companyState}` : ''}</p>` : ''}
      <div style="margin-top:20px;border-bottom:1px solid #333;width:200px;height:40px"></div>
      ${authorizedName ? `<p style="font-size:10px;font-weight:600;margin-top:4px">${authorizedName}</p>` : '<p style="font-size:10px;margin-top:4px">Nome: _________________________</p>'}
      ${authorizedTitle ? `<p style="font-size:9px;color:#666">${authorizedTitle}${authorizedCrea ? ` | CREA: ${authorizedCrea}` : ''}</p>` : ''}
      ${authorizedCpf ? `<p style="font-size:9px;color:#666">CPF: ${authorizedCpf}</p>` : ''}
      <p style="font-size:9px;color:#666;margin-top:8px">Data: ${dateShort}</p>
    </div>
    
    <div style="border:1px solid #e5e7eb;padding:24px;border-radius:8px">
      <h3 style="font-size:12px;color:#1a237e;border-bottom:1px solid #e5e7eb;padding-bottom:8px;margin-bottom:12px">PELA EMPRESA CLIENTE:</h3>
      <p style="font-size:10px;line-height:1.8"><strong>${clientLegalName || clientName}</strong></p>
      ${clientCnpj ? `<p style="font-size:10px">CNPJ: ${clientCnpj}</p>` : ''}
      ${clientAddress ? `<p style="font-size:10px">Endereço: ${clientAddress}${clientCity ? `, ${clientCity}` : ''}${clientState ? ` - ${clientState}` : ''}</p>` : ''}
      <div style="margin-top:20px;border-bottom:1px solid #333;width:200px;height:40px"></div>
      <p style="font-size:10px;margin-top:4px">Nome: _________________________</p>
      <p style="font-size:9px;color:#666">Cargo: _________________________</p>
      <p style="font-size:9px;color:#666">CPF: _________________________</p>
      <p style="font-size:9px;color:#666;margin-top:8px">Data: _____ / _____ / _____</p>
    </div>
  </div>
  
  <div style="margin-top:24px;padding:12px;background:#f5f5f5;border-radius:4px;font-size:9px;color:#666">
    <p>• Esta proposta é válida por 30 dias a contar desta data</p>
    <p>• O aceite acontece mediante assinatura deste termo</p>
    <p>• Todas as cláusulas técnicas e comerciais são consideradas compreendidas e aceitas pelas partes</p>
  </div>
</div>` : ''}

RODAPÉ PROFISSIONAL (ao final do documento):
<div style="margin-top:48px;padding-top:16px;border-top:2px solid #e5e7eb;text-align:center;font-size:11px;color:#6b7280">
  <p>Proposta Confidencial – © ${year} ${companyLegalName || companyName}. Todos os direitos reservados.</p>
  <p>Validade: 30 dias corridos a partir de ${dateShort} | ${propNumber} | Versão: ${versionCode}</p>
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
