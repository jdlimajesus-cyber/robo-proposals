import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um ENGENHEIRO SÊNIOR MULTIDISCIPLINAR (automação, robótica, máquinas especiais, processos, segurança industrial, elétrica de potência) redigindo uma PROPOSTA TÉCNICA E COMERCIAL EXECUTIVA DE GRANDE PORTE para a diretoria do cliente.

DIRETRIZ MESTRA: MÁXIMA DENSIDADE TÉCNICA, ZERO DADOS MOCK, ZERO PLACEHOLDERS GENÉRICOS. Cada campo deve refletir engenharia real e cálculos coerentes com o input do usuário. O documento final deve ter ~25-30 páginas A4 quando renderizado.

VOZ E TOM:
- 1ª pessoa plural ("nossa equipe", "propomos", "recomendamos").
- NUNCA mencione IA, modelos, agentes ou "gerado automaticamente".
- Linguagem técnica precisa, executiva, confiante. Diferencie FATO / PREMISSA / HIPÓTESE / ESTIMATIVA.
- Use unidades SI e formato monetário brasileiro (R$ 0.000.000,00).

PRIORIDADES INQUEBRANTÁVEIS:
1) Segurança (NR-12, NR-10, ISO 12100, ISO 13849-1, IEC 60204-1, NFPA 33)
2) Conformidade legal/elétrica (NBR 5410, NBR IEC 61439, IEEE 519)
3) Cibersegurança (ISA/IEC 62443) e LGPD
4) Viabilidade técnica
5) Confiabilidade (MTBF/MTTR), performance, prazo, custo

CÁLCULOS OBRIGATÓRIOS:
- Tempo de ciclo = (3600/produção_pç_h) × 0.85
- Carga útil mínima = (peso_peça + 0.5 kg ferramental) × 1.1
- OEE alvo ≥ 75% — explicitar Disponibilidade × Performance × Qualidade
- Vazão de exaustão = área_cabine × velocidade_ar (m³/s → m³/h)
- ROI: VPL à TMA 12%, TIR, Payback Descontado
- Use benchmarks reais do mercado brasileiro

PROIBIÇÕES:
- Inventar marcas comerciais (use "robô antropomórfico de 6 eixos, payload ≥ 20 kg, alcance 1.800 mm")
- Bypass de segurança
- Confundir estimativa com valor fechado
- Repetir frases vazias ou texto de preenchimento`;

function buildVersionGuidance(version: string): string {
  if (version === "Basica") {
    return `VERSÃO BÁSICA (máx 12 páginas): contexto resumido, 1 alternativa, 4-5 subsistemas, BOM 15-20 itens, 1 cenário ROI, 4-5 riscos, 4-6 fases, 8-10 critérios de aceitação.`;
  }
  if (version === "Normal") {
    return `VERSÃO NORMAL (máx 20 páginas): contexto completo, 2-3 alternativas com recomendação, 5-7 subsistemas detalhados, BOM 25-35 itens em 5 categorias, 3 cenários ROI, 6-8 riscos, 6-8 fases, critérios de aceitação completos, cibersegurança resumida.`;
  }
  return `VERSÃO COMPLETA (25-30 páginas): TODAS AS 16 SEÇÕES preenchidas com máxima densidade — contexto+fluxo, 3 alternativas com recomendação justificada, 7-10 subsistemas exaustivos, solução técnica detalhada com cálculos numéricos em caixas (vazão, ciclo, OEE, tempo residência), especificação de equipamentos em bullets densos, escopo de fornecimento + serviços inclusos + itens não inclusos + cibersegurança OT/IT, BOM 30-40 itens em 6 categorias, recursos humanos por área, composição de custos por categoria, cronograma 50+ semanas em até 8 fases, matriz de risco com 8-10 itens, 10-12 critérios de aceitação mensuráveis, dados a confirmar agrupados, visualização conceitual, análise ROI completa (premissas + benefícios + OPEX + VPL/TIR/Payback + sensibilidade), análise de segurança NR-12/ISO12100 com perigos+controles engenharia/administrativos+EPIs, especificações elétricas (distribuição + proteção + qualidade) e controle executivo do documento (próximos passos + 4 assinaturas).`;
}

const JSON_SCHEMA = {
  type: "object",
  required: ["meta", "executive", "specs", "subsystems", "bom", "schedule", "risks", "roi", "acceptance", "context", "alternatives", "solution", "scopeDetail", "resources", "costSummary", "acceptanceCriteria", "dataToConfirm", "roiAnalysis", "safetyAnalysis", "electricalSpecs", "executiveControl"],
  properties: {
    meta: {
      type: "object",
      required: ["title", "docId", "version", "date", "validity", "status", "clientName", "companyName", "confidential"],
      properties: {
        title: { type: "string" }, subtitle: { type: "string" },
        docId: { type: "string" }, version: { type: "string" }, date: { type: "string" },
        validity: { type: "string" }, status: { type: "string" },
        clientName: { type: "string" }, clientLegalName: { type: "string" }, clientCnpj: { type: "string" },
        companyName: { type: "string" }, companyLegalName: { type: "string" }, companyCnpj: { type: "string" },
        companyTagline: { type: "string" }, confidential: { type: "boolean" },
      },
    },
    executive: {
      type: "object", required: ["summary", "headlineMetrics"],
      properties: {
        summary: { type: "string", description: "3-4 parágrafos executivos densos" },
        note: { type: "string" },
        headlineMetrics: { type: "array", items: { type: "object", required: ["label", "value"], properties: { label: { type: "string" }, value: { type: "string" } } } },
      },
    },
    specs: { type: "array", items: { type: "object", required: ["label", "value"], properties: { label: { type: "string" }, value: { type: "string" } } } },
    context: {
      type: "object",
      required: ["needAnalysis", "fato", "premissa", "hipotese", "premisesList", "processFlow", "flowDescription"],
      properties: {
        needAnalysis: { type: "string", description: "2-3 parágrafos sobre necessidade real do cliente" },
        fato: { type: "string" }, premissa: { type: "string" }, hipotese: { type: "string" },
        premisesList: { type: "array", items: { type: "string" }, description: "8-10 premissas quantitativas (Disponibilidade, Tempo Ciclo, OEE, etc)" },
        processFlow: { type: "array", items: { type: "object", required: ["step", "label"], properties: { step: { type: "integer" }, label: { type: "string" } } }, description: "6-10 etapas do fluxo de processo" },
        flowDescription: { type: "string", description: "Descrição do fluxo em 1 parágrafo denso" },
      },
    },
    alternatives: {
      type: "array",
      description: "EXATAMENTE 3 alternativas tecnológicas: Conservadora, Intermediária, Otimizada (recomendada)",
      items: {
        type: "object",
        required: ["code", "name", "description", "advantages", "disadvantages", "operationalRisk", "recommended"],
        properties: {
          code: { type: "string" }, name: { type: "string" }, description: { type: "string" },
          advantages: { type: "array", items: { type: "string" } },
          disadvantages: { type: "array", items: { type: "string" } },
          operationalRisk: { type: "string" }, qualityRisk: { type: "string" },
          recommended: { type: "boolean" },
        },
      },
    },
    solution: {
      type: "object", required: ["architectureDescription", "technicalDetails", "equipmentSpecs"],
      properties: {
        architectureDescription: { type: "string" },
        technicalDetails: {
          type: "array",
          description: "5-8 subseções técnicas detalhadas (ex: 4.2.1 Cabines, 4.2.2 Transportador, 4.2.3 Estufas, etc)",
          items: {
            type: "object", required: ["title", "paragraphs"],
            properties: {
              title: { type: "string" },
              paragraphs: { type: "array", items: { type: "string" } },
              calculations: { type: "array", items: { type: "object", required: ["label", "lines"], properties: { label: { type: "string" }, lines: { type: "array", items: { type: "string" } } } } },
              bullets: { type: "array", items: { type: "string" } },
            },
          },
        },
        equipmentSpecs: {
          type: "array",
          description: "4-6 equipamentos principais com bullets densos",
          items: { type: "object", required: ["name", "bullets"], properties: { name: { type: "string" }, bullets: { type: "array", items: { type: "string" } } } },
        },
      },
    },
    subsystems: {
      type: "array",
      items: {
        type: "object", required: ["code", "name", "discipline", "objective", "description", "components", "technicalParams", "standards"],
        properties: {
          code: { type: "string" }, name: { type: "string" }, discipline: { type: "string" },
          objective: { type: "string" }, description: { type: "string" },
          components: { type: "array", items: { type: "object", required: ["name", "specification", "function"], properties: { name: { type: "string" }, specification: { type: "string" }, function: { type: "string" } } } },
          technicalParams: { type: "array", items: { type: "object", required: ["label", "value"], properties: { label: { type: "string" }, value: { type: "string" } } } },
          standards: { type: "array", items: { type: "string" } },
          interfaces: { type: "string" },
        },
      },
    },
    scopeDetail: {
      type: "object", required: ["suppliedEquipment", "servicesIncluded", "itemsNotIncluded"],
      properties: {
        suppliedEquipment: { type: "array", items: { type: "object", required: ["name", "bullets"], properties: { name: { type: "string" }, bullets: { type: "array", items: { type: "string" } } } } },
        servicesIncluded: { type: "array", items: { type: "string" } },
        itemsNotIncluded: { type: "array", items: { type: "string" } },
        automationDiagramNote: { type: "string" },
        cybersecurity: {
          type: "object",
          properties: {
            otNetwork: { type: "array", items: { type: "string" } },
            itNetwork: { type: "array", items: { type: "string" } },
            measures: { type: "array", items: { type: "string" } },
            riskNote: { type: "string" },
          },
        },
      },
    },
    resources: {
      type: "array",
      description: "6-8 áreas técnicas com recursos alocados",
      items: { type: "object", required: ["area", "allocated", "profile"], properties: { area: { type: "string" }, allocated: { type: "string" }, profile: { type: "string" } } },
    },
    bom: {
      type: "object", required: ["categories", "totals"],
      properties: {
        categories: { type: "array", items: { type: "object", required: ["code", "name", "items"], properties: { code: { type: "string" }, name: { type: "string" }, subtotal: { type: "string" }, items: { type: "array", items: { type: "object", required: ["code", "description", "quantity", "unit", "unitPrice", "total"], properties: { code: { type: "string" }, description: { type: "string" }, discipline: { type: "string" }, quantity: { type: "string" }, unit: { type: "string" }, unitPrice: { type: "string" }, total: { type: "string" }, status: { type: "string" } } } } } } },
        totals: { type: "array", items: { type: "object", required: ["label", "value"], properties: { label: { type: "string" }, value: { type: "string" }, highlight: { type: "boolean" } } } },
      },
    },
    costSummary: {
      type: "object", required: ["items", "total", "composition", "categoryDistribution"],
      properties: {
        items: { type: "array", description: "Tabela de 12-14 grupos de custo (Engenharia, Equipamentos, Transporte, Montagem, Comissionamento, Treinamento, Documentação, Contingência, Impostos, etc)", items: { type: "object", required: ["code", "description", "value", "observations"], properties: { code: { type: "string" }, description: { type: "string" }, value: { type: "string" }, observations: { type: "string" } } } },
        total: { type: "string" },
        composition: { type: "array", items: { type: "object", required: ["label", "percentage", "description"], properties: { label: { type: "string" }, percentage: { type: "string" }, description: { type: "string" } } } },
        categoryDistribution: { type: "array", items: { type: "object", required: ["label", "percentage"], properties: { label: { type: "string" }, percentage: { type: "string" } } } },
      },
    },
    schedule: {
      type: "object", required: ["totalWeeks", "phases"],
      properties: {
        totalWeeks: { type: "integer" },
        phases: { type: "array", items: { type: "object", required: ["name", "responsible", "startWeek", "endWeek", "milestones"], properties: { name: { type: "string" }, responsible: { type: "string" }, startWeek: { type: "integer" }, endWeek: { type: "integer" }, milestones: { type: "string" } } } },
      },
    },
    risks: {
      type: "array",
      items: { type: "object", required: ["level", "category", "description", "probability", "impact", "mitigation"], properties: { level: { type: "string", enum: ["ALTO", "MEDIO", "BAIXO"] }, category: { type: "string" }, description: { type: "string" }, probability: { type: "string", enum: ["Baixa", "Média", "Alta"] }, impact: { type: "string", enum: ["Baixo", "Médio", "Alto"] }, mitigation: { type: "string" } } },
    },
    acceptanceCriteria: {
      type: "array",
      description: "10-14 critérios mensuráveis (Produtividade, Tempo Ciclo, OEE, qualidade, segurança, rastreabilidade, etc)",
      items: { type: "object", required: ["criterion", "target", "validationMethod"], properties: { criterion: { type: "string" }, target: { type: "string" }, validationMethod: { type: "string" } } },
    },
    dataToConfirm: {
      type: "array",
      description: "4-6 grupos de dados (Peças, Tinta/Processo, Layout Fábrica, Integração MES, Padrões Internos)",
      items: { type: "object", required: ["group", "items"], properties: { group: { type: "string" }, items: { type: "array", items: { type: "string" } } } },
    },
    conceptualVisualization: {
      type: "array",
      items: { type: "object", required: ["label", "description"], properties: { label: { type: "string" }, description: { type: "string" } } },
    },
    roi: {
      type: "array",
      items: { type: "object", required: ["scenario", "capex", "annualBenefit", "paybackMonths", "assumption"], properties: { scenario: { type: "string", enum: ["Conservador", "Base", "Otimista"] }, capex: { type: "string" }, annualBenefit: { type: "string" }, paybackMonths: { type: "string" }, assumption: { type: "string" } } },
    },
    roiAnalysis: {
      type: "object", required: ["premises", "benefits", "benefitsTotal", "opex", "opexTotal", "netCashFlow", "results", "sensitivity", "conclusion"],
      properties: {
        premises: { type: "array", items: { type: "string" } },
        benefits: { type: "array", items: { type: "object", required: ["label", "annual"], properties: { label: { type: "string" }, annual: { type: "string" } } } },
        benefitsTotal: { type: "string" },
        opex: { type: "array", items: { type: "object", required: ["label", "annual"], properties: { label: { type: "string" }, annual: { type: "string" } } } },
        opexTotal: { type: "string" },
        netCashFlow: { type: "string" },
        results: { type: "object", required: ["vpl", "tir", "payback"], properties: { vpl: { type: "string" }, tir: { type: "string" }, payback: { type: "string" } } },
        sensitivity: { type: "array", items: { type: "object", required: ["scenario", "capex", "vpl", "tir", "payback"], properties: { scenario: { type: "string" }, capex: { type: "string" }, vpl: { type: "string" }, tir: { type: "string" }, payback: { type: "string" } } } },
        conclusion: { type: "string" },
      },
    },
    safetyAnalysis: {
      type: "object", required: ["hazards", "engineeringControls", "administrativeControls", "ppe", "complianceNote"],
      properties: {
        hazards: { type: "array", items: { type: "object", required: ["hazard", "source", "analysis"], properties: { hazard: { type: "string" }, source: { type: "string" }, analysis: { type: "string" } } } },
        engineeringControls: { type: "array", items: { type: "string" } },
        administrativeControls: { type: "array", items: { type: "string" } },
        ppe: { type: "array", items: { type: "string" } },
        complianceNote: { type: "string" },
      },
    },
    electricalSpecs: {
      type: "object", required: ["distribution", "protection", "powerQuality", "complianceNote"],
      properties: {
        distribution: { type: "array", items: { type: "string" } },
        protection: { type: "array", items: { type: "string" } },
        powerQuality: { type: "array", items: { type: "string" } },
        complianceNote: { type: "string" },
      },
    },
    acceptance: {
      type: "object", required: ["contractor", "contracted"],
      properties: {
        contractor: { type: "object", properties: { label: { type: "string" }, name: { type: "string" }, title: { type: "string" }, cnpj: { type: "string" } } },
        contracted: { type: "object", properties: { label: { type: "string" }, name: { type: "string" }, title: { type: "string" }, crea: { type: "string" }, cnpj: { type: "string" } } },
      },
    },
    executiveControl: {
      type: "object", required: ["elaboratedBy", "emissionDate", "versionNote", "confidentialityNote", "nextSteps", "signatures"],
      properties: {
        elaboratedBy: { type: "string" },
        emissionDate: { type: "string" },
        versionNote: { type: "string" },
        confidentialityNote: { type: "string" },
        nextSteps: { type: "array", items: { type: "string" } },
        signatures: { type: "array", description: "4 signatários (2 contratada + 2 contratante)", items: { type: "object", required: ["name", "role"], properties: { name: { type: "string" }, role: { type: "string" } } } },
      },
    },
  },
};

const esc = (s: any) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const nl2br = (s: any) => esc(s).replace(/\n/g, "<br>");

function buildHtmlFromStructured(d: any, brandPrimary: string, brandSecondary: string): string {
  const m = d.meta || {};
  const exec = d.executive || {};
  const specs: any[] = d.specs || [];
  const ctx = d.context;
  const alts: any[] = d.alternatives || [];
  const sol = d.solution;
  const subs: any[] = d.subsystems || [];
  const scope = d.scopeDetail;
  const res: any[] = d.resources || [];
  const bom = d.bom || { categories: [], totals: [] };
  const cs = d.costSummary;
  const sched = d.schedule || { totalWeeks: 6, phases: [] };
  const risks: any[] = d.risks || [];
  const ac: any[] = d.acceptanceCriteria || [];
  const dtc: any[] = d.dataToConfirm || [];
  const cv: any[] = d.conceptualVisualization || [];
  const roiA = d.roiAnalysis;
  const roi: any[] = d.roi || [];
  const safety = d.safetyAnalysis;
  const elec = d.electricalSpecs;
  const ec = d.executiveControl;
  const acc = d.acceptance || {};

  const sectionBar = (n: string, title: string) =>
    `<div style="background:${brandPrimary};color:#fff;padding:10px 16px;margin:24px 0 14px;display:flex;justify-content:space-between"><div><span style="color:${brandSecondary};font-family:monospace;font-size:10px">// ${n}</span> <strong style="font-size:13px;letter-spacing:0.5px">${esc(title)}</strong></div><div style="font-family:monospace;font-size:9px">${esc(m.docId)} · REV.${esc(m.version)}</div></div>`;

  const h3 = (t: string) => `<h3 style="color:${brandPrimary};font-size:12px;margin:14px 0 6px;letter-spacing:0.3px">${esc(t)}</h3>`;
  const h4 = (t: string) => `<h4 style="color:${brandPrimary};font-size:11px;margin:10px 0 4px">${esc(t)}</h4>`;
  const p = (t: string) => `<p style="font-size:10px;line-height:1.55;text-align:justify;margin:4px 0">${nl2br(t)}</p>`;
  const ul = (items: string[]) => items?.length ? `<ul style="font-size:10px;margin:4px 0 8px 18px;line-height:1.5">${items.map((i) => `<li style="margin:2px 0">${nl2br(i)}</li>`).join("")}</ul>` : "";
  const infoBox = (label: string, body: string, kind: "" | "warn" | "danger" = "") => {
    const c = kind === "danger" ? { bg: "#fee2e2", bd: "#dc2626" } : kind === "warn" ? { bg: "#fef9e7", bd: "#d97706" } : { bg: "#f8fafc", bd: brandPrimary };
    return `<div style="background:${c.bg};border-left:4px solid ${c.bd};padding:10px 12px;margin:8px 0;font-size:10px;page-break-inside:avoid"><div style="font-weight:700;color:${c.bd};font-size:9px;letter-spacing:0.5px;margin-bottom:4px">${esc(label)}</div><div style="line-height:1.55">${body}</div></div>`;
  };

  const specsRows = [];
  for (let i = 0; i < specs.length; i += 2) {
    const a = specs[i], b = specs[i + 1];
    specsRows.push(`<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:600;color:#666;font-size:10px;width:25%">${esc(a?.label)}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;font-size:10px;width:25%">${esc(a?.value)}</td>${b ? `<td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:600;color:#666;font-size:10px;width:25%">${esc(b.label)}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;font-size:10px;width:25%">${esc(b.value)}</td>` : `<td colspan="2" style="border:1px solid #e5e7eb"></td>`}</tr>`);
  }

  const processFlowHtml = ctx?.processFlow?.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:10px 0;padding:12px;background:#f8fafc;border-radius:4px">${ctx.processFlow.map((s: any, i: number) => `<div style="display:flex;align-items:center;gap:4px"><div style="background:${brandPrimary};color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">${s.step}</div><div style="font-size:9px;font-weight:600;color:${brandPrimary}">${esc(s.label)}</div>${i < ctx.processFlow.length - 1 ? `<span style="color:${brandSecondary};font-size:14px;margin:0 2px">→</span>` : ""}</div>`).join("")}</div>`
    : "";

  const altsHtml = alts.map((a) => `<div style="margin:10px 0;padding:12px;border:1px solid #e5e7eb;border-left:4px solid ${a.recommended ? brandSecondary : "#cbd5e1"};border-radius:4px;page-break-inside:avoid">${h4(`${a.code} — ${a.name}${a.recommended ? " · RECOMENDADA" : ""}`)}${p(a.description)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px"><div><div style="font-size:9px;font-weight:700;color:#16a34a">Vantagens</div>${ul(a.advantages || [])}</div><div><div style="font-size:9px;font-weight:700;color:#dc2626">Desvantagens</div>${ul(a.disadvantages || [])}</div></div><div style="font-size:9px;color:#555;margin-top:4px"><strong>Risco operacional:</strong> ${esc(a.operationalRisk)}${a.qualityRisk ? ` · <strong>Risco qualidade:</strong> ${esc(a.qualityRisk)}` : ""}</div></div>`).join("");

  const solutionHtml = sol ? `${p(sol.architectureDescription)}${(sol.technicalDetails || []).map((td: any) => `<div style="page-break-inside:avoid;margin:10px 0">${h4(td.title)}${(td.paragraphs || []).map(p).join("")}${(td.calculations || []).map((c: any) => infoBox(c.label, c.lines.map((l: string) => nl2br(l)).join("<br>"))).join("")}${ul(td.bullets || [])}</div>`).join("")}${h3("Especificações dos Equipamentos")}${(sol.equipmentSpecs || []).map((e: any) => `<div style="page-break-inside:avoid;margin:8px 0">${h4(e.name)}${ul(e.bullets || [])}</div>`).join("")}` : "";

  const subsBlocks = subs.map((ss: any) => `<div style="page-break-inside:avoid;margin-bottom:14px;border:1px solid #e5e7eb;border-radius:4px;overflow:hidden"><div style="background:${brandPrimary};color:#fff;padding:6px 12px;display:flex;justify-content:space-between"><div><span style="font-family:monospace;font-size:9px;color:${brandSecondary}">${esc(ss.code)}</span> <strong style="font-size:11px">${esc(ss.name)}</strong></div><span style="font-size:9px;font-family:monospace;opacity:0.85">${esc(ss.discipline)}</span></div><div style="padding:10px"><div style="font-size:9px;color:#444;margin-bottom:6px"><strong style="color:${brandPrimary}">Objetivo:</strong> ${esc(ss.objective)}</div><div style="font-size:10px;line-height:1.55;text-align:justify;margin-bottom:8px">${nl2br(ss.description)}</div>${(ss.components || []).length ? `<div style="font-size:9px;font-weight:700;color:${brandPrimary};margin:6px 0 4px;text-transform:uppercase">Componentes</div><table style="width:100%;border-collapse:collapse;margin-bottom:6px"><thead><tr style="background:#f8fafc"><th style="padding:4px 6px;border:1px solid #eee;font-size:9px;text-align:left">Componente</th><th style="padding:4px 6px;border:1px solid #eee;font-size:9px;text-align:left">Especificação</th><th style="padding:4px 6px;border:1px solid #eee;font-size:9px;text-align:left">Função</th></tr></thead><tbody>${(ss.components || []).map((c: any) => `<tr><td style="padding:4px 6px;border:1px solid #eee;font-size:9px;font-weight:600">${esc(c.name)}</td><td style="padding:4px 6px;border:1px solid #eee;font-size:9px">${esc(c.specification)}</td><td style="padding:4px 6px;border:1px solid #eee;font-size:9px;color:#555">${esc(c.function)}</td></tr>`).join("")}</tbody></table>` : ""}${(ss.technicalParams || []).length ? `<div style="font-size:9px;font-weight:700;color:${brandPrimary};margin:6px 0 4px;text-transform:uppercase">Parâmetros</div><table style="width:100%;border-collapse:collapse"><tbody>${(ss.technicalParams || []).map((pp: any) => `<tr><td style="padding:3px 6px;border:1px solid #eee;font-size:9px;background:#f8fafc;font-weight:600;color:#555;width:50%">${esc(pp.label)}</td><td style="padding:3px 6px;border:1px solid #eee;font-size:9px">${esc(pp.value)}</td></tr>`).join("")}</tbody></table>` : ""}${(ss.standards || []).length ? `<div style="margin-top:6px"><span style="font-size:9px;font-weight:700;color:${brandPrimary};margin-right:6px">Normas:</span>${(ss.standards || []).map((s: string) => `<span style="display:inline-block;background:#eef2f6;color:${brandPrimary};padding:1px 6px;font-size:9px;font-family:monospace;margin:2px;border:1px solid #d1dce8">${esc(s)}</span>`).join("")}</div>` : ""}${ss.interfaces ? `<div style="margin-top:6px;padding:6px;background:#f8fafc;border-left:3px solid ${brandSecondary};font-size:9px"><strong style="color:${brandPrimary}">Interfaces:</strong> ${esc(ss.interfaces)}</div>` : ""}</div></div>`).join("");

  const scopeHtml = scope ? `${h3("5.1 Fornecimento de Equipamentos")}${(scope.suppliedEquipment || []).map((e: any) => `<div style="page-break-inside:avoid">${h4(e.name)}${ul(e.bullets || [])}</div>`).join("")}${h3("5.2 Serviços Inclusos")}${ul(scope.servicesIncluded || [])}${h3("5.3 Itens Não Inclusos")}${ul(scope.itemsNotIncluded || [])}${scope.cybersecurity ? `${h3("5.4 Cibersegurança (OT/IT)")}${h4("Rede OT")}${ul(scope.cybersecurity.otNetwork || [])}${h4("Rede IT")}${ul(scope.cybersecurity.itNetwork || [])}${h4("Medidas")}${ul(scope.cybersecurity.measures || [])}${scope.cybersecurity.riskNote ? infoBox("RISCO CIBERNÉTICO", scope.cybersecurity.riskNote, "warn") : ""}` : ""}` : "";

  const resHtml = res.length ? `<table style="width:100%;border-collapse:collapse;margin:8px 0;font-size:10px"><thead><tr style="background:${brandPrimary};color:#fff"><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Área</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Recursos Alocados</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Perfil</th></tr></thead><tbody>${res.map((r: any) => `<tr><td style="padding:5px 6px;border:1px solid #eee;font-weight:600">${esc(r.area)}</td><td style="padding:5px 6px;border:1px solid #eee">${esc(r.allocated)}</td><td style="padding:5px 6px;border:1px solid #eee">${esc(r.profile)}</td></tr>`).join("")}</tbody></table>` : "";

  const bomRows = (bom.categories || []).map((cat: any) => {
    const header = `<tr style="background:#eef2f6"><td colspan="7" style="padding:6px 10px;font-weight:700;color:${brandPrimary};font-size:10px;border:1px solid #ddd">${esc(cat.code)} — ${esc(cat.name)}${cat.subtotal ? ` · SUBTOTAL: ${esc(cat.subtotal)}` : ""}</td></tr>`;
    const items = (cat.items || []).map((it: any) => `<tr><td style="padding:4px 6px;border:1px solid #eee;font-family:monospace;font-size:9px">${esc(it.code)}</td><td style="padding:4px 6px;border:1px solid #eee;font-size:9px">${esc(it.description)}</td><td style="padding:4px 6px;border:1px solid #eee;font-size:9px">${esc(it.discipline || "-")}</td><td style="padding:4px 6px;border:1px solid #eee;text-align:center;font-size:9px">${esc(it.quantity)}</td><td style="padding:4px 6px;border:1px solid #eee;text-align:center;font-size:9px">${esc(it.unit)}</td><td style="padding:4px 6px;border:1px solid #eee;text-align:right;font-size:9px">${esc(it.unitPrice)}</td><td style="padding:4px 6px;border:1px solid #eee;text-align:right;font-weight:600;font-size:9px">${esc(it.total)}</td></tr>`).join("");
    return header + items;
  }).join("");
  const totalsRows = (bom.totals || []).map((t: any) => `<tr style="${t.highlight ? `background:${brandPrimary};color:#fff;font-weight:700` : "background:#f9fafb"}"><td colspan="6" style="padding:6px 10px;border:1px solid #ddd">${esc(t.label)}</td><td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${esc(t.value)}</td></tr>`).join("");

  const costSummaryHtml = cs ? `<table style="width:100%;border-collapse:collapse;font-size:10px;margin:8px 0"><thead><tr style="background:${brandPrimary};color:#fff"><th style="padding:6px;border:1px solid ${brandPrimary}">Item</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Descrição</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:right">Valor (R$)</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Observações</th></tr></thead><tbody>${cs.items.map((i: any) => `<tr><td style="padding:5px 6px;border:1px solid #eee;font-weight:700">${esc(i.code)}</td><td style="padding:5px 6px;border:1px solid #eee">${esc(i.description)}</td><td style="padding:5px 6px;border:1px solid #eee;text-align:right;font-weight:600">${esc(i.value)}</td><td style="padding:5px 6px;border:1px solid #eee;color:#555;font-size:9px">${esc(i.observations)}</td></tr>`).join("")}<tr style="background:${brandPrimary};color:#fff;font-weight:700"><td colspan="2" style="padding:7px;border:1px solid ${brandPrimary}">TOTAL GERAL ESTIMADO</td><td style="padding:7px;border:1px solid ${brandPrimary};text-align:right">${esc(cs.total)}</td><td style="padding:7px;border:1px solid ${brandPrimary}">Base de engenharia básica</td></tr></tbody></table>${cs.composition?.length ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">${cs.composition.map((c: any) => `<div style="padding:8px;border:1px solid #e5e7eb;border-left:3px solid ${brandSecondary}"><div style="font-size:11px;font-weight:700;color:${brandPrimary}">${esc(c.label)} <span style="color:${brandSecondary}">${esc(c.percentage)}</span></div><div style="font-size:9px;color:#555;margin-top:3px">${esc(c.description)}</div></div>`).join("")}</div>` : ""}${cs.categoryDistribution?.length ? `<div style="margin-top:10px;padding:10px;background:#f8fafc"><div style="font-size:10px;font-weight:700;color:${brandPrimary};margin-bottom:6px">Distribuição por Categoria</div>${cs.categoryDistribution.map((c: any) => `<div style="display:flex;align-items:center;gap:8px;margin:3px 0;font-size:9px"><div style="width:140px">${esc(c.label)}</div><div style="flex:1;background:#e5e7eb;height:10px;border-radius:2px;overflow:hidden"><div style="width:${esc(c.percentage)};height:100%;background:${brandSecondary}"></div></div><div style="width:50px;text-align:right;font-weight:600">${esc(c.percentage)}</div></div>`).join("")}</div>` : ""}` : "";

  const weekHeaders = Array.from({ length: sched.totalWeeks }, (_, i) => `<th style="padding:3px 4px;background:${brandPrimary};color:#fff;font-size:8px;border:1px solid ${brandPrimary};text-align:center">S${i + 1}</th>`).join("");
  const phaseRows = (sched.phases || []).map((p: any) => {
    const cells = Array.from({ length: sched.totalWeeks }, (_, i) => {
      const wk = i + 1;
      const active = wk >= p.startWeek && wk <= p.endWeek;
      return `<td style="padding:3px;border:1px solid #eee;background:${active ? brandSecondary : "transparent"};text-align:center;font-size:8px;color:#fff">${active ? "■" : ""}</td>`;
    }).join("");
    return `<tr><td style="padding:5px 8px;border:1px solid #eee;font-size:9px"><strong>${esc(p.name)}</strong><br><span style="font-size:8px;color:#666">${esc(p.responsible)}</span></td>${cells}<td style="padding:5px 8px;border:1px solid #eee;font-size:8px">${esc(p.milestones)}</td></tr>`;
  }).join("");

  const riskColor = (lvl: string) => lvl === "ALTO" ? "#fee2e2" : lvl === "MEDIO" ? "#fef9e7" : "#eafaf1";
  const riskBadge = (lvl: string) => lvl === "ALTO" ? "#dc2626" : lvl === "MEDIO" ? "#d97706" : "#16a34a";
  const riskRows = risks.map((r: any) => `<tr style="background:${riskColor(r.level)}"><td style="padding:5px 6px;border:1px solid #eee;font-size:9px"><span style="background:${riskBadge(r.level)};color:#fff;padding:2px 6px;font-weight:700">${esc(r.level)}</span></td><td style="padding:5px 6px;border:1px solid #eee;font-size:9px">${esc(r.category)}</td><td style="padding:5px 6px;border:1px solid #eee;font-size:9px">${esc(r.description)}</td><td style="padding:5px 6px;border:1px solid #eee;font-size:9px;text-align:center">${esc(r.probability)}</td><td style="padding:5px 6px;border:1px solid #eee;font-size:9px;text-align:center">${esc(r.impact)}</td><td style="padding:5px 6px;border:1px solid #eee;font-size:9px">${esc(r.mitigation)}</td></tr>`).join("");

  const acHtml = ac.length ? `<table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr style="background:${brandPrimary};color:#fff"><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Critério</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Meta</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Método de Validação</th></tr></thead><tbody>${ac.map((c: any) => `<tr><td style="padding:5px 6px;border:1px solid #eee;font-weight:600">${esc(c.criterion)}</td><td style="padding:5px 6px;border:1px solid #eee;color:${brandPrimary};font-weight:600">${esc(c.target)}</td><td style="padding:5px 6px;border:1px solid #eee;color:#555">${esc(c.validationMethod)}</td></tr>`).join("")}</tbody></table>` : "";

  const dtcHtml = dtc.map((g: any) => `${h4(g.group)}${ul(g.items || [])}`).join("");

  const cvHtml = cv.map((v: any) => infoBox(v.label, esc(v.description))).join("");

  const roiAnalysisHtml = roiA ? `${h3("14.1 Premissas Financeiras")}${ul(roiA.premises || [])}${h4("Benefícios Anuais Estimados")}<table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr style="background:#f8fafc"><th style="padding:5px;border:1px solid #eee;text-align:left">Benefício</th><th style="padding:5px;border:1px solid #eee;text-align:right">Valor Anual (R$)</th></tr></thead><tbody>${roiA.benefits.map((b: any) => `<tr><td style="padding:4px 6px;border:1px solid #eee">${esc(b.label)}</td><td style="padding:4px 6px;border:1px solid #eee;text-align:right;font-weight:600">${esc(b.annual)}</td></tr>`).join("")}<tr style="background:${brandPrimary};color:#fff;font-weight:700"><td style="padding:5px;border:1px solid ${brandPrimary}">Benefícios Totais</td><td style="padding:5px;border:1px solid ${brandPrimary};text-align:right">${esc(roiA.benefitsTotal)}</td></tr></tbody></table>${h4("Custos Operacionais Adicionais (OPEX)")}<table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr style="background:#f8fafc"><th style="padding:5px;border:1px solid #eee;text-align:left">Custo</th><th style="padding:5px;border:1px solid #eee;text-align:right">Valor Anual (R$)</th></tr></thead><tbody>${roiA.opex.map((o: any) => `<tr><td style="padding:4px 6px;border:1px solid #eee">${esc(o.label)}</td><td style="padding:4px 6px;border:1px solid #eee;text-align:right;font-weight:600">${esc(o.annual)}</td></tr>`).join("")}<tr style="background:${brandPrimary};color:#fff;font-weight:700"><td style="padding:5px;border:1px solid ${brandPrimary}">OPEX Total</td><td style="padding:5px;border:1px solid ${brandPrimary};text-align:right">${esc(roiA.opexTotal)}</td></tr></tbody></table>${infoBox("Fluxo de Caixa Operacional Líquido", `<strong>${esc(roiA.netCashFlow)}</strong>`)}${h3("14.2 Resultados (VPL / TIR / Payback)")}<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:10px 0">${[{ l: "VPL", v: roiA.results.vpl }, { l: "TIR", v: roiA.results.tir }, { l: "Payback", v: roiA.results.payback }].map((x) => `<div style="padding:14px;background:#f8fafc;border-top:3px solid ${brandSecondary};text-align:center"><div style="font-size:9px;color:#666;text-transform:uppercase">${x.l}</div><div style="font-size:18px;font-weight:700;color:${brandPrimary};margin-top:4px">${esc(x.v)}</div></div>`).join("")}</div>${h3("14.3 Análise de Sensibilidade")}<table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr style="background:${brandPrimary};color:#fff"><th style="padding:5px;border:1px solid ${brandPrimary}">Cenário</th><th style="padding:5px;border:1px solid ${brandPrimary}">CAPEX</th><th style="padding:5px;border:1px solid ${brandPrimary}">VPL</th><th style="padding:5px;border:1px solid ${brandPrimary}">TIR</th><th style="padding:5px;border:1px solid ${brandPrimary}">Payback</th></tr></thead><tbody>${roiA.sensitivity.map((s: any) => `<tr><td style="padding:4px 6px;border:1px solid #eee;font-weight:600">${esc(s.scenario)}</td><td style="padding:4px 6px;border:1px solid #eee">${esc(s.capex)}</td><td style="padding:4px 6px;border:1px solid #eee">${esc(s.vpl)}</td><td style="padding:4px 6px;border:1px solid #eee">${esc(s.tir)}</td><td style="padding:4px 6px;border:1px solid #eee">${esc(s.payback)}</td></tr>`).join("")}</tbody></table>${infoBox("Conclusão da Análise Financeira", esc(roiA.conclusion))}` : "";

  const roiScenariosHtml = roi.length ? `<table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr style="background:${brandPrimary};color:#fff"><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Cenário</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">CAPEX</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Benefício Anual</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Payback (meses)</th><th style="padding:6px;border:1px solid ${brandPrimary};text-align:left">Premissa</th></tr></thead><tbody>${roi.map((r: any) => `<tr><td style="padding:5px 6px;border:1px solid #eee;font-weight:600">${esc(r.scenario)}${r.scenario === "Base" ? ` <span style="background:${brandSecondary};color:#fff;padding:1px 5px;font-size:8px;margin-left:4px">RECOMENDADO</span>` : ""}</td><td style="padding:5px 6px;border:1px solid #eee">${esc(r.capex)}</td><td style="padding:5px 6px;border:1px solid #eee">${esc(r.annualBenefit)}</td><td style="padding:5px 6px;border:1px solid #eee">${esc(r.paybackMonths)}</td><td style="padding:5px 6px;border:1px solid #eee">${esc(r.assumption)}</td></tr>`).join("")}</tbody></table>` : "";

  const safetyHtml = safety ? `${h3("15.1 Perigos Identificados")}<table style="width:100%;border-collapse:collapse;font-size:10px"><thead><tr style="background:${brandPrimary};color:#fff"><th style="padding:5px;border:1px solid ${brandPrimary};text-align:left">Perigo</th><th style="padding:5px;border:1px solid ${brandPrimary};text-align:left">Fonte</th><th style="padding:5px;border:1px solid ${brandPrimary};text-align:left">Análise</th></tr></thead><tbody>${safety.hazards.map((h: any) => `<tr><td style="padding:4px 6px;border:1px solid #eee;font-weight:600">${esc(h.hazard)}</td><td style="padding:4px 6px;border:1px solid #eee">${esc(h.source)}</td><td style="padding:4px 6px;border:1px solid #eee;color:#555">${esc(h.analysis)}</td></tr>`).join("")}</tbody></table>${h3("15.2 Medidas de Proteção")}${h4("Controles de Engenharia (prioridade máxima)")}${ul(safety.engineeringControls)}${h4("Controles Administrativos")}${ul(safety.administrativeControls)}${h4("EPIs Obrigatórios")}${ul(safety.ppe)}${infoBox("CONFORMIDADE NORMATIVA", esc(safety.complianceNote))}` : "";

  const elecHtml = elec ? `${h3("16.1 Distribuição de Energia")}${ul(elec.distribution)}${h3("16.2 Proteção Elétrica")}${ul(elec.protection)}${h3("16.3 Qualidade de Energia")}${ul(elec.powerQuality)}${infoBox("CONFORMIDADE", esc(elec.complianceNote))}` : "";

  const sigsHtml = ec?.signatures?.length ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px">${ec.signatures.map((s: any) => `<div style="padding:14px;border:1px solid #e5e7eb;border-radius:4px"><div style="border-bottom:1px solid #333;height:36px;margin-bottom:6px"></div><div style="font-size:10px;font-weight:700;color:${brandPrimary}">${esc(s.name)}</div><div style="font-size:9px;color:#666">${esc(s.role)}</div></div>`).join("")}</div>` : "";

  const headlineCards = (exec.headlineMetrics || []).map((h: any) => `<div style="flex:1;padding:12px;background:#f8fafc;border-left:3px solid ${brandSecondary}"><div style="font-size:9px;color:#666;text-transform:uppercase">${esc(h.label)}</div><div style="font-size:15px;font-weight:700;color:${brandPrimary};margin-top:3px">${esc(h.value)}</div></div>`).join("");

  return `<div style="font-family:'IBM Plex Sans',Arial,sans-serif;color:#0f1419;line-height:1.5">

<!-- CAPA -->
<div style="page-break-after:always;border:2px solid ${brandPrimary};padding:28px">
  <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:10px;margin-bottom:16px">
    <div><div style="font-size:18px;font-weight:700;color:${brandPrimary}">${esc(m.companyName)}</div>${m.companyTagline ? `<div style="font-size:10px;color:#666;font-family:monospace">// ${esc(m.companyTagline)}</div>` : ""}</div>
    <div style="text-align:right;font-size:9px;color:#666;font-family:monospace"><div>DOC: ${esc(m.docId)} | REV: ${esc(m.version)} | DATA: ${esc(m.date)}</div><div>STATUS: ${esc(m.status)} | VALIDADE: ${esc(m.validity)}</div></div>
  </div>
  <div style="margin:20px 0"><div style="font-size:10px;color:#666;font-family:monospace">// DOC-ID: ${esc(m.docId)} · PROJETO</div><h1 style="font-size:30px;color:${brandPrimary};margin:6px 0;font-weight:700">${esc(m.title)}</h1>${m.subtitle ? `<p style="font-size:13px;color:#666">${esc(m.subtitle)}</p>` : ""}</div>
  <table style="width:100%;border-collapse:collapse;margin:18px 0"><tbody>${specsRows.join("")}</tbody></table>
  <div style="margin-top:18px;padding:14px;background:#f8fafc;border-left:4px solid ${brandPrimary}"><div style="font-size:10px;color:#666;text-transform:uppercase;margin-bottom:3px">Cliente / Contratante</div><div style="font-size:17px;font-weight:700;color:${brandPrimary}">${esc(m.clientName)}</div>${m.clientLegalName ? `<div style="font-size:10px;color:#666">${esc(m.clientLegalName)}${m.clientCnpj ? ` · CNPJ ${esc(m.clientCnpj)}` : ""}</div>` : ""}</div>
  ${m.confidential ? `<div style="margin-top:14px;text-align:center;font-size:9px;color:#dc2626;font-weight:700;letter-spacing:1px">CONFIDENCIAL · USO RESTRITO</div>` : ""}
</div>

<!-- 1. Apresentação Executiva -->
<div style="page-break-after:always">
  ${sectionBar("01", "APRESENTAÇÃO EXECUTIVA")}
  ${p(exec.summary || "")}
  ${exec.note ? infoBox("Destaque da Proposta", esc(exec.note)) : ""}
  <div style="display:flex;gap:8px;margin:14px 0">${headlineCards}</div>
</div>

<!-- 2. Contexto e Premissas -->
${ctx ? `<div style="page-break-after:always">
  ${sectionBar("02", "CONTEXTO E PREMISSAS DO PROJETO")}
  ${h3("2.1 Análise da Necessidade do Cliente")}
  ${p(ctx.needAnalysis)}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0">
    <div style="padding:10px;background:#f8fafc;border-left:3px solid ${brandPrimary}"><div style="font-size:10px;font-weight:700;color:${brandPrimary}">FATO</div><div style="font-size:10px;margin-top:3px">${nl2br(ctx.fato)}</div></div>
    <div style="padding:10px;background:#f8fafc;border-left:3px solid ${brandSecondary}"><div style="font-size:10px;font-weight:700;color:${brandSecondary}">PREMISSA</div><div style="font-size:10px;margin-top:3px">${nl2br(ctx.premissa)}</div></div>
  </div>
  ${infoBox("Hipótese de Negócio", esc(ctx.hipotese))}
  ${h3("2.2 Premissas de Projeto")}
  ${ul(ctx.premisesList || [])}
  ${h3("2.3 Fluxo de Processo Conceitual")}
  ${processFlowHtml}
  ${p(ctx.flowDescription)}
</div>` : ""}

<!-- 3. Análise de Alternativas -->
${alts.length ? `<div style="page-break-after:always">
  ${sectionBar("03", "ANÁLISE DE ALTERNATIVAS TECNOLÓGICAS")}
  ${altsHtml}
  ${alts.find((a) => a.recommended) ? infoBox("RECOMENDAÇÃO ESTRATÉGICA", `A alternativa <strong>${esc(alts.find((a) => a.recommended).name)}</strong> é a mais indicada para o projeto, atendendo plenamente aos requisitos técnicos e estratégicos do cliente.`, "warn") : ""}
</div>` : ""}

<!-- 4. Solução Recomendada -->
${sol ? `<div style="page-break-after:always">
  ${sectionBar("04", "SOLUÇÃO RECOMENDADA")}
  ${solutionHtml}
</div>` : ""}

<!-- 5. Subsistemas Técnicos -->
${subs.length ? `<div style="page-break-after:always">
  ${sectionBar("04.A", "DESCRIÇÃO TÉCNICA DOS SUBSISTEMAS")}
  ${subsBlocks}
</div>` : ""}

<!-- 5. Escopo Técnico -->
${scope ? `<div style="page-break-after:always">
  ${sectionBar("05", "ESCOPO TÉCNICO DETALHADO")}
  ${scopeHtml}
</div>` : ""}

<!-- 6. Etapas e Cronograma -->
<div style="page-break-after:always">
  ${sectionBar("06", `ETAPAS DO PROJETO — ${sched.totalWeeks} SEMANAS`)}
  <table style="width:100%;border-collapse:collapse;font-size:9px"><thead><tr><th style="padding:5px;background:${brandPrimary};color:#fff;border:1px solid ${brandPrimary};text-align:left">Fase</th>${weekHeaders}<th style="padding:5px;background:${brandPrimary};color:#fff;border:1px solid ${brandPrimary}">Marcos</th></tr></thead><tbody>${phaseRows}</tbody></table>
</div>

<!-- 7. Recursos -->
${res.length ? `<div style="page-break-after:always">
  ${sectionBar("07", "RECURSOS NECESSÁRIOS")}
  ${resHtml}
</div>` : ""}

<!-- 8. Estimativa de Custos -->
${cs ? `<div style="page-break-after:always">
  ${sectionBar("08", "ESTIMATIVA DE CUSTOS")}
  ${costSummaryHtml}
  ${infoBox("INFORMAÇÃO CRÍTICA", "Esta estimativa de custos é baseada nas premissas e escopo definidos. Análise de engenharia de detalhe será necessária para precisão de ±5%.", "danger")}
</div>` : ""}

<!-- BOM Detalhada -->
${(bom.categories || []).length ? `<div style="page-break-after:always">
  ${sectionBar("08.A", "LISTA DE MATERIAIS — BOM DETALHADA")}
  <table style="width:100%;border-collapse:collapse"><thead><tr style="background:${brandPrimary};color:#fff"><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px">Código</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px;text-align:left">Descrição</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px">Disc.</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px">Qtd</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px">Un.</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px;text-align:right">Unit.</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px;text-align:right">Total</th></tr></thead><tbody>${bomRows}${totalsRows}</tbody></table>
</div>` : ""}

<!-- 10. Riscos -->
${risks.length ? `<div style="page-break-after:always">
  ${sectionBar("10", "GESTÃO DE RISCOS")}
  <table style="width:100%;border-collapse:collapse"><thead><tr style="background:${brandPrimary};color:#fff"><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px">Nível</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px">Categoria</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px;text-align:left">Descrição</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px">Prob.</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px">Impacto</th><th style="padding:5px;border:1px solid ${brandPrimary};font-size:9px;text-align:left">Mitigação</th></tr></thead><tbody>${riskRows}</tbody></table>
</div>` : ""}

<!-- 11. Critérios de Aceitação -->
${ac.length ? `<div style="page-break-after:always">
  ${sectionBar("11", "CRITÉRIOS DE ACEITAÇÃO")}
  ${acHtml}
</div>` : ""}

<!-- 12. Dados a Confirmar -->
${dtc.length ? `<div style="page-break-after:always">
  ${sectionBar("12", "DADOS A CONFIRMAR")}
  ${dtcHtml}
  ${infoBox("IMPACTO DA CONFIRMAÇÃO", "A falta de confirmação ou alterações significativas nestes dados podem impactar escopo, custo e prazo.", "warn")}
</div>` : ""}

<!-- 13. Visão Conceitual -->
${cv.length ? `<div style="page-break-after:always">
  ${sectionBar("13", "VISÃO CONCEITUAL")}
  ${cvHtml}
</div>` : ""}

<!-- 14. ROI -->
${(roiA || roi.length) ? `<div style="page-break-after:always">
  ${sectionBar("14", "ANÁLISE DE RETORNO DE INVESTIMENTO")}
  ${roiAnalysisHtml}
  ${roi.length ? `${h3("Cenários Resumidos")}${roiScenariosHtml}` : ""}
</div>` : ""}

<!-- 15. Segurança -->
${safety ? `<div style="page-break-after:always">
  ${sectionBar("15", "PERIGOS E MEDIDAS DE PROTEÇÃO (ISO 12100, NR-12)")}
  ${safetyHtml}
</div>` : ""}

<!-- 16. Elétrico -->
${elec ? `<div style="page-break-after:always">
  ${sectionBar("16", "ESPECIFICAÇÕES ELÉTRICAS E PROTEÇÕES")}
  ${elecHtml}
</div>` : ""}

<!-- Controle Executivo + Aceite -->
<div>
  ${sectionBar("17", "CONTROLE EXECUTIVO E ACEITE")}
  ${ec ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px"><div><p style="font-size:10px"><strong>Elaborado por:</strong> ${esc(ec.elaboratedBy)}<br><strong>Data:</strong> ${esc(ec.emissionDate)}<br><strong>Versão:</strong> ${esc(ec.versionNote)}<br><strong>Confidencialidade:</strong> ${esc(ec.confidentialityNote)}</p></div><div><p style="font-size:10px"><strong>Próximos Passos:</strong></p><ol style="font-size:10px;margin-left:18px">${(ec.nextSteps || []).map((s: string) => `<li>${esc(s)}</li>`).join("")}</ol></div></div>${sigsHtml}` : ""}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px">
    <div style="border:1px solid #e5e7eb;padding:14px"><div style="font-size:10px;font-weight:700;color:${brandPrimary};text-transform:uppercase;margin-bottom:8px">Contratante — ${esc(acc.contractor?.label || m.clientName)}</div><p style="font-size:10px;margin:4px 0">Nome: ${esc(acc.contractor?.name || "_______________________________")}</p><p style="font-size:10px;margin:4px 0">Cargo: ${esc(acc.contractor?.title || "_______________________________")}</p><p style="font-size:10px;margin:4px 0">CPF/CNPJ: ${esc(acc.contractor?.cnpj || "_______________________")}</p><div style="margin-top:24px;border-bottom:1px solid #333;height:36px"></div><p style="font-size:9px;color:#666;margin-top:4px">Assinatura · Data: ___/___/______</p></div>
    <div style="border:1px solid #e5e7eb;padding:14px"><div style="font-size:10px;font-weight:700;color:${brandPrimary};text-transform:uppercase;margin-bottom:8px">Contratada — ${esc(acc.contracted?.label || m.companyName)}</div><p style="font-size:10px;margin:4px 0">Nome: ${esc(acc.contracted?.name || "_______________________________")}</p><p style="font-size:10px;margin:4px 0">Cargo: ${esc(acc.contracted?.title || "_______________________________")}</p><p style="font-size:10px;margin:4px 0">CREA/CPF: ${esc(acc.contracted?.crea || acc.contracted?.cnpj || "_______________________")}</p><div style="margin-top:24px;border-bottom:1px solid #333;height:36px"></div><p style="font-size:9px;color:#666;margin-top:4px">Assinatura · Data: ___/___/______</p></div>
  </div>
  <div style="margin-top:18px;padding-top:10px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:9px;color:#666"><span style="font-weight:700;color:${brandPrimary}">${esc(m.companyName)}</span><span>DOC: ${esc(m.docId)} · REV.${esc(m.version)} · CONFIDENCIAL</span></div>
</div>

</div>`;
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

    const docPrefix = (d.company_doc_id_prefix || "DOC").toUpperCase();
    const seqNum = Math.random().toString(16).slice(2, 10).toUpperCase();
    const docId = `${docPrefix}-${seqNum}`;
    const dateBR = new Date().toLocaleDateString("pt-BR");

    const userPrompt = `Gere o documento ${docLabel} no formato JSON estruturado conforme o schema fornecido, com MÁXIMA DENSIDADE TÉCNICA, ZERO MOCK, ZERO PLACEHOLDERS GENÉRICOS.

CONTEXTO DO PROJETO:
Empresa Fornecedora: ${d.company_name || "Nossa Empresa"}${d.company_legal_name ? " (" + d.company_legal_name + ")" : ""}${d.company_cnpj ? " · CNPJ " + d.company_cnpj : ""}
Tagline: ${d.company_brand_tagline || "Proposal Engine"}
Responsável Técnico: ${d.company_authorized_person_name || ""}${d.company_authorized_person_title ? " — " + d.company_authorized_person_title : ""}${d.company_authorized_person_crea ? " · CREA " + d.company_authorized_person_crea : ""}

Cliente: ${d.client_name || "Cliente"}${d.client_legal_name ? " (" + d.client_legal_name + ")" : ""}${d.client_cnpj ? " · CNPJ " + d.client_cnpj : ""}

Projeto: ${d.project_title}
Aplicação: ${d.application_type}
Descrição/Escopo: ${d.custom_scope_description}
${d.production_target ? `Produção alvo: ${d.production_target} pç/h` : ""}
${d.target_cycle_time ? `Tempo de ciclo alvo: ${d.target_cycle_time} s` : ""}
${d.piece_weight ? `Peso da peça: ${d.piece_weight} kg` : ""}
${d.piece_dimensions ? `Dimensões: ${d.piece_dimensions}` : ""}
${d.material ? `Material: ${d.material}` : ""}
${d.automation_level ? `Nível de automação: ${d.automation_level}` : ""}
${d.work_shifts ? `Turnos: ${d.work_shifts}` : ""}
${d.installation_area_size ? `Área disponível: ${d.installation_area_size}` : ""}
${d.available_power_supply ? `Energia disponível: ${d.available_power_supply}` : ""}
${d.available_compressed_air ? `Ar comprimido: ${d.available_compressed_air}` : ""}
${d.operating_temperature ? `Temperatura operacional: ${d.operating_temperature}` : ""}
${d.operational_environment ? `Ambiente: ${d.operational_environment}` : ""}
${d.investment_range_basic ? `Faixa investimento conservador: ${d.investment_range_basic}` : ""}
${d.investment_range_intermediate ? `Faixa investimento base: ${d.investment_range_intermediate}` : ""}
${d.investment_range_optimized ? `Faixa investimento otimizado: ${d.investment_range_optimized}` : ""}
${d.observacoes ? `Observações: ${d.observacoes}` : ""}

INSTRUÇÕES OBRIGATÓRIAS DE METADADOS:
- meta.docId = "${docId}"
- meta.version = "1.0"
- meta.date = "${dateBR}"
- meta.validity = "15 DIAS CORRIDOS"
- meta.status = "${docLabel}"
- meta.confidential = true
- meta.companyName = "${d.company_name || "Nossa Empresa"}"
- meta.companyTagline = "${d.company_brand_tagline || "Proposal Engine"}"
- meta.clientName = "${d.client_name || "Cliente"}"
${d.client_legal_name ? `- meta.clientLegalName = "${d.client_legal_name}"` : ""}
${d.client_cnpj ? `- meta.clientCnpj = "${d.client_cnpj}"` : ""}
${d.company_legal_name ? `- meta.companyLegalName = "${d.company_legal_name}"` : ""}
${d.company_cnpj ? `- meta.companyCnpj = "${d.company_cnpj}"` : ""}
- acceptance.contractor.label = "${d.client_name || "Cliente"}"
- acceptance.contracted.label = "${d.company_name || "Nossa Empresa"}"
${d.company_authorized_person_name ? `- acceptance.contracted.name = "${d.company_authorized_person_name}"` : ""}
${d.company_authorized_person_title ? `- acceptance.contracted.title = "${d.company_authorized_person_title}"` : ""}
${d.company_authorized_person_crea ? `- acceptance.contracted.crea = "${d.company_authorized_person_crea}"` : ""}
${d.company_cnpj ? `- acceptance.contracted.cnpj = "${d.company_cnpj}"` : ""}

${buildVersionGuidance(version)}

REGRAS DE DENSIDADE:
1. context.needAnalysis: 2-3 parágrafos completos sobre necessidade real do cliente, gargalos e motivação do investimento.
2. alternatives: SEMPRE 3 alternativas (Conservadora semi-automatizada, Intermediária com automação parcial, Otimizada totalmente automatizada). A última deve ter recommended=true.
3. solution.technicalDetails: 5-8 subseções com 2-3 parágrafos + caixas de cálculo numéricas (vazão, ciclo, OEE, residência, etc).
4. solution.equipmentSpecs: 4-6 equipamentos com bullets exaustivos (dimensões, materiais, capacidades, sensores).
5. subsystems: 7-10 subsistemas SE versão Completa, com 3-8 componentes, 4-8 parâmetros e normas.
6. scopeDetail: todos os equipamentos fornecidos com bullets densos, 6-10 serviços inclusos, 8-10 itens não inclusos.
7. costSummary.items: 12-14 grupos de custo (Engenharia, cada equipamento principal, Montagem, Comissionamento, Treinamento, Documentação, Contingência 10%, Impostos e Frete).
8. costSummary.composition: 4 grupos (Equipamentos, Serviços/Engenharia, Contingência/Impostos, Distribuição) com percentuais.
9. costSummary.categoryDistribution: 5-6 categorias com percentuais somando ~100%.
10. schedule.totalWeeks: 40-60 semanas (versão completa) com 6-8 fases reais.
11. risks: 8-10 riscos cobrindo Operacional, Qualidade, Elétrico, Cibernético, Dados, Segurança (crítico), Prazo, Integração.
12. acceptanceCriteria: 10-14 critérios MENSURÁVEIS com método de validação.
13. dataToConfirm: 4-6 grupos (Peças, Tinta/Processo, Layout, Integração MES, Padrões Internos).
14. conceptualVisualization: 3-4 vistas conceituais com descrição textual rica.
15. roiAnalysis: premissas (CAPEX, vida útil, TMA), 4-6 benefícios anuais, 3-4 OPEX, resultados VPL/TIR/Payback, 3-4 cenários de sensibilidade, conclusão.
16. safetyAnalysis: 5-7 perigos categorizados, 6-8 controles engenharia, 4-5 administrativos, 4-6 EPIs.
17. electricalSpecs: 4-5 itens distribuição, 5-6 proteção, 2-3 qualidade.
18. executiveControl.signatures: 4 signatários (2 contratada + 2 contratante).
19. JAMAIS use texto genérico tipo "a ser definido" — se faltar dado, calcule com base nas premissas declaradas.
20. Use valores em R$ realistas (mercado brasileiro) coerentes com o porte do projeto.

RETORNE EXCLUSIVAMENTE O JSON conforme a tool fornecida.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [{ type: "function", function: { name: "emit_proposal", description: "Emite a proposta estruturada no schema definido", parameters: JSON_SCHEMA } }],
        tool_choice: { type: "function", function: { name: "emit_proposal" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit excedido. Tente novamente em alguns instantes." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Créditos insuficientes." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const result = await response.json();
    const toolCall = result?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool_call in response:", JSON.stringify(result).slice(0, 1000));
      throw new Error("Modelo não retornou dados estruturados");
    }

    let structured: any;
    try {
      structured = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse tool args:", toolCall.function.arguments?.slice(0, 500));
      throw new Error("JSON inválido retornado pelo modelo");
    }

    structured.meta = { ...structured.meta, docId, version: structured.meta?.version || "1.0", date: dateBR, confidential: true };

    const brandPrimary = d.company_brand_primary_color || "#1a3a5c";
    const brandSecondary = d.company_brand_secondary_color || "#e67e22";
    const html = buildHtmlFromStructured(structured, brandPrimary, brandSecondary);

    return new Response(JSON.stringify({ structured, html, docId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("generate-proposal error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
