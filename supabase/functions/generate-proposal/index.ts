import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um ENGENHEIRO SÊNIOR MULTIDISCIPLINAR de engenharia industrial (automação, robótica, máquinas especiais, processos), redigindo uma proposta técnica e comercial para um cliente executivo.

VOZ E TOM:
- Primeira pessoa plural ("nossa equipe", "propomos", "recomendamos").
- NUNCA mencione IA, agentes, modelos, "gerado automaticamente".
- Linguagem técnica precisa, executiva, confiante. NUNCA use placeholders como "A CONFIRMAR" exceto na seção apropriada.
- Diferencie FATO / HIPÓTESE / PREMISSA / ESTIMATIVA quando relevante.

PRIORIDADES INQUEBRANTÁVEIS (em ordem):
1) Segurança (NR-12, NR-10, ISO 12100, ISO 13849-1, IEC 60204-1)
2) Conformidade legal e elétrica
3) Cibersegurança (ISA/IEC 62443) e LGPD
4) Viabilidade técnica e compatibilidade
5) Confiabilidade (MTBF/MTTR), performance, prazo, custo total

CÁLCULOS A APLICAR:
- Tempo de ciclo = (3600/produção_pç_h) × 0.85 (eficiência)
- Carga útil mínima = (peso_peça + 0.5 kg ferramental) × 1.1
- OEE alvo ≥ 75%
- Use benchmarks reais do mercado brasileiro (R$) para BOM

PROIBIÇÕES:
- Inventar marcas/modelos sem base
- Bypass de segurança
- Confundir estimativa com valor fechado
- Mencionar IA ou origem automatizada`;

function buildVersionGuidance(version: string): string {
  if (version === "Basica") {
    return `VERSÃO BÁSICA: foco em sumário, BOM resumida (10-15 itens), 1 cenário de ROI, riscos principais (3-5), cronograma simplificado (4-6 semanas).`;
  }
  if (version === "Normal") {
    return `VERSÃO NORMAL: BOM detalhada (20-30 itens em 4-6 categorias), 3 cenários ROI, matriz de risco com 5-7 itens, cronograma com 5-8 fases.`;
  }
  return `VERSÃO COMPLETA: BOM completa (30+ itens em até 6 categorias visíveis ao cliente — Engenharia, Matérias-primas, Componentes, Automação, Segurança, Serviços), 3 cenários ROI com sensibilidade, matriz de risco completa (7+ itens em 7 dimensões), cronograma 6-12 semanas com responsáveis e marcos.`;
}

const JSON_SCHEMA = {
  type: "object",
  required: ["meta", "executive", "specs", "bom", "schedule", "risks", "roi", "acceptance"],
  properties: {
    meta: {
      type: "object",
      required: ["title", "docId", "version", "date", "validity", "status", "clientName", "companyName", "confidential"],
      properties: {
        title: { type: "string" },
        subtitle: { type: "string" },
        docId: { type: "string", description: "Ex: AXZ-XXXXXXXX" },
        version: { type: "string", description: "Ex: 1.0" },
        date: { type: "string", description: "DD/MM/AAAA" },
        validity: { type: "string", description: "Ex: 15 DIAS CORRIDOS" },
        status: { type: "string", description: "Ex: PROPOSTA TÉCNICA" },
        clientName: { type: "string" },
        clientLegalName: { type: "string" },
        clientCnpj: { type: "string" },
        companyName: { type: "string" },
        companyLegalName: { type: "string" },
        companyCnpj: { type: "string" },
        companyTagline: { type: "string" },
        confidential: { type: "boolean" },
      },
    },
    executive: {
      type: "object",
      required: ["summary", "headlineMetrics"],
      properties: {
        summary: { type: "string", description: "2-4 parágrafos executivos descrevendo escopo, abordagem e valor entregue" },
        note: { type: "string", description: "Nota crítica sobre investimento, premissas ou alertas comerciais" },
        headlineMetrics: {
          type: "array",
          items: {
            type: "object",
            required: ["label", "value"],
            properties: { label: { type: "string" }, value: { type: "string" } },
          },
          description: "4 métricas-chave para destaque visual",
        },
      },
    },
    specs: {
      type: "array",
      description: "Especificações técnicas principais (pares label/valor) — 8 a 12 itens",
      items: {
        type: "object",
        required: ["label", "value"],
        properties: { label: { type: "string" }, value: { type: "string" } },
      },
    },
    bom: {
      type: "object",
      required: ["categories", "totals"],
      properties: {
        categories: {
          type: "array",
          items: {
            type: "object",
            required: ["code", "name", "items"],
            properties: {
              code: { type: "string", description: "Ex: C2, C3" },
              name: { type: "string", description: "Ex: MATÉRIA-PRIMA E MATERIAIS" },
              subtotal: { type: "string", description: "Ex: R$ 1.594,00" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["code", "description", "quantity", "unit", "unitPrice", "total"],
                  properties: {
                    code: { type: "string" },
                    description: { type: "string" },
                    discipline: { type: "string", description: "Mecânica, Elétrica, Controle, Segurança, Serviços" },
                    quantity: { type: "string" },
                    unit: { type: "string", description: "un, m, kg, lote, etc" },
                    unitPrice: { type: "string", description: "Formato R$ 0,00" },
                    total: { type: "string" },
                    status: { type: "string", description: "OK, OPC., A CONFIRMAR" },
                  },
                },
              },
            },
          },
        },
        totals: {
          type: "array",
          items: {
            type: "object",
            required: ["label", "value"],
            properties: {
              label: { type: "string" },
              value: { type: "string" },
              highlight: { type: "boolean" },
            },
          },
        },
      },
    },
    schedule: {
      type: "object",
      required: ["totalWeeks", "phases"],
      properties: {
        totalWeeks: { type: "integer" },
        phases: {
          type: "array",
          items: {
            type: "object",
            required: ["name", "responsible", "startWeek", "endWeek", "milestones"],
            properties: {
              name: { type: "string" },
              responsible: { type: "string" },
              startWeek: { type: "integer" },
              endWeek: { type: "integer" },
              milestones: { type: "string" },
            },
          },
        },
      },
    },
    risks: {
      type: "array",
      items: {
        type: "object",
        required: ["level", "category", "description", "probability", "impact", "mitigation"],
        properties: {
          level: { type: "string", enum: ["ALTO", "MEDIO", "BAIXO"] },
          category: { type: "string", description: "Humano, Regulatório, Técnico, Operacional, Prazo, Cibernético, Financeiro" },
          description: { type: "string" },
          probability: { type: "string", enum: ["Baixa", "Média", "Alta"] },
          impact: { type: "string", enum: ["Baixo", "Médio", "Alto"] },
          mitigation: { type: "string" },
        },
      },
    },
    roi: {
      type: "array",
      items: {
        type: "object",
        required: ["scenario", "capex", "annualBenefit", "paybackMonths", "assumption"],
        properties: {
          scenario: { type: "string", enum: ["Conservador", "Base", "Otimista"] },
          capex: { type: "string" },
          annualBenefit: { type: "string" },
          paybackMonths: { type: "string" },
          assumption: { type: "string" },
        },
      },
    },
    acceptance: {
      type: "object",
      required: ["contractor", "contracted"],
      properties: {
        contractor: {
          type: "object",
          properties: {
            label: { type: "string" },
            name: { type: "string" },
            title: { type: "string" },
            cnpj: { type: "string" },
          },
        },
        contracted: {
          type: "object",
          properties: {
            label: { type: "string" },
            name: { type: "string" },
            title: { type: "string" },
            crea: { type: "string" },
            cnpj: { type: "string" },
          },
        },
      },
    },
  },
};

function buildHtmlFromStructured(d: any, brandPrimary: string, brandSecondary: string): string {
  const m = d.meta || {};
  const exec = d.executive || {};
  const specs: any[] = d.specs || [];
  const bom = d.bom || { categories: [], totals: [] };
  const schedule = d.schedule || { totalWeeks: 6, phases: [] };
  const risks: any[] = d.risks || [];
  const roi: any[] = d.roi || [];
  const acc = d.acceptance || {};

  const esc = (s: any) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

  const specsRows = [];
  for (let i = 0; i < specs.length; i += 2) {
    const a = specs[i], b = specs[i + 1];
    specsRows.push(
      `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:600;color:#666;font-size:10px">${esc(a?.label)}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;font-size:10px">${esc(a?.value)}</td>` +
      (b ? `<td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:600;color:#666;font-size:10px">${esc(b.label)}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;font-size:10px">${esc(b.value)}</td>` : `<td colspan="2" style="border:1px solid #e5e7eb"></td>`) +
      `</tr>`
    );
  }

  const bomRows = bom.categories.map((cat: any) => {
    const header = `<tr style="background:#eef2f6"><td colspan="7" style="padding:6px 10px;font-weight:700;color:${brandPrimary};font-size:10px;border:1px solid #ddd">${esc(cat.code)} — ${esc(cat.name)}${cat.subtotal ? ` · SUBTOTAL: ${esc(cat.subtotal)}` : ""}</td></tr>`;
    const items = (cat.items || []).map((it: any) =>
      `<tr><td style="padding:5px 8px;border:1px solid #eee;font-family:monospace;font-size:9px">${esc(it.code)}</td><td style="padding:5px 8px;border:1px solid #eee;font-size:10px">${esc(it.description)}</td><td style="padding:5px 8px;border:1px solid #eee;font-size:9px">${esc(it.discipline || "-")}</td><td style="padding:5px 8px;border:1px solid #eee;text-align:center;font-size:10px">${esc(it.quantity)}</td><td style="padding:5px 8px;border:1px solid #eee;text-align:center;font-size:10px">${esc(it.unit)}</td><td style="padding:5px 8px;border:1px solid #eee;text-align:right;font-size:10px">${esc(it.unitPrice)}</td><td style="padding:5px 8px;border:1px solid #eee;text-align:right;font-weight:600;font-size:10px">${esc(it.total)}</td></tr>`
    ).join("");
    return header + items;
  }).join("");

  const totalsRows = bom.totals.map((t: any) =>
    `<tr style="${t.highlight ? `background:${brandPrimary};color:white;font-weight:700` : "background:#f9fafb"}"><td colspan="6" style="padding:7px 10px;border:1px solid #ddd">${esc(t.label)}</td><td style="padding:7px 10px;border:1px solid #ddd;text-align:right">${esc(t.value)}</td></tr>`
  ).join("");

  const weekHeaders = Array.from({ length: schedule.totalWeeks }, (_, i) =>
    `<th style="padding:4px 6px;background:${brandPrimary};color:white;font-size:9px;border:1px solid ${brandPrimary};text-align:center">S${i + 1}</th>`
  ).join("");

  const phaseRows = schedule.phases.map((p: any, idx: number) => {
    const cells = Array.from({ length: schedule.totalWeeks }, (_, i) => {
      const wk = i + 1;
      const active = wk >= p.startWeek && wk <= p.endWeek;
      return `<td style="padding:4px 6px;border:1px solid #eee;background:${active ? brandSecondary : "transparent"};text-align:center;font-size:9px;color:white">${active ? "■" : ""}</td>`;
    }).join("");
    return `<tr><td style="padding:5px 8px;border:1px solid #eee;font-size:10px"><strong>${esc(p.name)}</strong><br><span style="font-size:9px;color:#666">${esc(p.responsible)}</span></td>${cells}<td style="padding:5px 8px;border:1px solid #eee;font-size:9px">${esc(p.milestones)}</td></tr>`;
  }).join("");

  const riskColor = (lvl: string) => lvl === "ALTO" ? "#fee2e2" : lvl === "MEDIO" ? "#fef9e7" : "#eafaf1";
  const riskBadge = (lvl: string) => lvl === "ALTO" ? "#dc2626" : lvl === "MEDIO" ? "#d97706" : "#16a34a";
  const riskRows = risks.map((r: any) =>
    `<tr style="background:${riskColor(r.level)}"><td style="padding:6px 8px;border:1px solid #eee;font-size:9px"><span style="background:${riskBadge(r.level)};color:white;padding:2px 6px;border-radius:3px;font-weight:700">${esc(r.level)}</span></td><td style="padding:6px 8px;border:1px solid #eee;font-size:10px">${esc(r.category)}</td><td style="padding:6px 8px;border:1px solid #eee;font-size:10px">${esc(r.description)}</td><td style="padding:6px 8px;border:1px solid #eee;font-size:10px;text-align:center">${esc(r.probability)}</td><td style="padding:6px 8px;border:1px solid #eee;font-size:10px;text-align:center">${esc(r.impact)}</td><td style="padding:6px 8px;border:1px solid #eee;font-size:10px">${esc(r.mitigation)}</td></tr>`
  ).join("");

  const roiRows = roi.map((r: any) =>
    `<tr><td style="padding:6px 10px;border:1px solid #eee;font-weight:600;font-size:10px">${esc(r.scenario)}${r.scenario === "Base" ? ' <span style="background:'+brandSecondary+';color:white;padding:1px 6px;border-radius:3px;font-size:9px;margin-left:6px">RECOMENDADO</span>' : ""}</td><td style="padding:6px 10px;border:1px solid #eee;font-size:10px">${esc(r.capex)}</td><td style="padding:6px 10px;border:1px solid #eee;font-size:10px">${esc(r.annualBenefit)}</td><td style="padding:6px 10px;border:1px solid #eee;font-size:10px">${esc(r.paybackMonths)}</td><td style="padding:6px 10px;border:1px solid #eee;font-size:10px">${esc(r.assumption)}</td></tr>`
  ).join("");

  const headlineCards = (exec.headlineMetrics || []).map((h: any) =>
    `<div style="flex:1;padding:14px;background:#f8fafc;border-left:4px solid ${brandSecondary};border-radius:4px"><div style="font-size:9px;color:#666;text-transform:uppercase;letter-spacing:0.5px">${esc(h.label)}</div><div style="font-size:16px;font-weight:700;color:${brandPrimary};margin-top:4px">${esc(h.value)}</div></div>`
  ).join("");

  return `<div style="font-family:'IBM Plex Sans',Arial,sans-serif;color:#0f1419;line-height:1.5">

<!-- PÁGINA 1: CAPA + ESPECIFICAÇÕES + RESUMO -->
<div style="page-break-after:always;border:2px solid ${brandPrimary};padding:32px;margin-bottom:24px">
  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e7eb;padding-bottom:12px;margin-bottom:20px">
    <div>
      <div style="font-size:18px;font-weight:700;color:${brandPrimary}">${esc(m.companyName)}</div>
      ${m.companyTagline ? `<div style="font-size:10px;color:#666;font-family:monospace">${esc(m.companyTagline)}</div>` : ""}
    </div>
    <div style="text-align:right;font-size:9px;color:#666;font-family:monospace">
      <div>DOC: ${esc(m.docId)} | REV: ${esc(m.version)} | DATA: ${esc(m.date)}</div>
      <div>STATUS: ${esc(m.status)} | VALIDADE: ${esc(m.validity)}</div>
    </div>
  </div>

  <div style="margin:24px 0">
    <div style="font-size:10px;color:#666;font-family:monospace">// DOC-ID: ${esc(m.docId)} · PROJETO</div>
    <h1 style="font-size:32px;color:${brandPrimary};margin:8px 0;font-weight:700">${esc(m.title)}</h1>
    ${m.subtitle ? `<p style="font-size:14px;color:#666;margin:0">${esc(m.subtitle)}</p>` : ""}
  </div>

  <table style="width:100%;border-collapse:collapse;margin:20px 0;page-break-inside:avoid">
    <tbody>${specsRows.join("")}</tbody>
  </table>

  <div style="margin-top:24px;padding:16px;background:#f8fafc;border-left:4px solid ${brandPrimary}">
    <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Cliente / Contratante</div>
    <div style="font-size:18px;font-weight:700;color:${brandPrimary}">${esc(m.clientName)}</div>
    ${m.clientLegalName ? `<div style="font-size:11px;color:#666">${esc(m.clientLegalName)}${m.clientCnpj ? ` · CNPJ ${esc(m.clientCnpj)}` : ""}</div>` : ""}
  </div>

  ${m.confidential ? `<div style="margin-top:16px;text-align:center;font-size:9px;color:#dc2626;font-weight:700;letter-spacing:1px">CONFIDENCIAL · USO RESTRITO</div>` : ""}
</div>

<!-- PÁGINA 2: RESUMO EXECUTIVO + BOM -->
<div style="page-break-after:always">
  <div style="background:${brandPrimary};color:white;padding:10px 16px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
    <div><span style="color:${brandSecondary};font-family:monospace;font-size:10px">// 01</span> <strong style="font-size:14px;letter-spacing:0.5px">RESUMO EXECUTIVO + BOM</strong></div>
    <div style="font-family:monospace;font-size:9px">${esc(m.docId)} · REV.${esc(m.version)} · ${esc(m.date)}</div>
  </div>

  <div style="font-size:11px;line-height:1.6;text-align:justify;margin-bottom:16px">${esc(exec.summary).replace(/\n/g, "<br>")}</div>

  ${exec.note ? `<div style="display:flex;gap:12px;padding:14px;background:#fef9e7;border-left:4px solid #d97706;border-radius:4px;margin-bottom:16px;page-break-inside:avoid"><div style="font-size:18px">⚠</div><div><div style="font-weight:700;color:#92400e;margin-bottom:4px;font-size:11px">Nota sobre Investimento</div><div style="font-size:10px;line-height:1.5">${esc(exec.note)}</div></div></div>` : ""}

  <div style="display:flex;gap:10px;margin:16px 0;page-break-inside:avoid">${headlineCards}</div>

  <div style="background:${brandPrimary};color:white;padding:6px 12px;margin:20px 0 8px;display:inline-block">
    <span style="color:${brandSecondary};font-family:monospace;font-size:9px">// 05</span> <strong style="font-size:11px">LISTA DE MATERIAIS — BOM DETALHADA</strong>
  </div>

  <table style="width:100%;border-collapse:collapse;page-break-inside:auto">
    <thead style="display:table-header-group">
      <tr style="background:${brandPrimary};color:white">
        <th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px;text-align:left">Código</th>
        <th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px;text-align:left">Item / Descrição</th>
        <th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px">Discip.</th>
        <th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px">Qtd</th>
        <th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px">Un.</th>
        <th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px;text-align:right">Unit. R$</th>
        <th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px;text-align:right">Total R$</th>
      </tr>
    </thead>
    <tbody>${bomRows}${totalsRows}</tbody>
  </table>
</div>

<!-- PÁGINA 3: CRONOGRAMA + RISCOS + ROI + ACEITE -->
<div>
  <div style="background:${brandPrimary};color:white;padding:10px 16px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
    <div><span style="color:${brandSecondary};font-family:monospace;font-size:10px">// 06–10</span> <strong style="font-size:14px;letter-spacing:0.5px">CRONOGRAMA · RISCOS · ROI · ACEITE</strong></div>
    <div style="font-family:monospace;font-size:9px">${esc(m.docId)} · REV.${esc(m.version)} · ${esc(m.date)}</div>
  </div>

  <h3 style="color:${brandPrimary};margin:8px 0;font-size:13px"><span style="color:${brandSecondary};font-family:monospace">// 06</span> CRONOGRAMA — ${schedule.totalWeeks} SEMANAS</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;page-break-inside:avoid;font-size:10px">
    <thead><tr><th style="padding:6px 8px;background:${brandPrimary};color:white;border:1px solid ${brandPrimary};text-align:left;font-size:9px">Fase</th>${weekHeaders}<th style="padding:6px 8px;background:${brandPrimary};color:white;border:1px solid ${brandPrimary};font-size:9px">Marcos</th></tr></thead>
    <tbody>${phaseRows}</tbody>
  </table>

  <h3 style="color:${brandPrimary};margin:16px 0 8px;font-size:13px;page-break-after:avoid"><span style="color:${brandSecondary};font-family:monospace">// 08</span> MATRIZ DE RISCOS</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;page-break-inside:avoid">
    <thead><tr style="background:${brandPrimary};color:white"><th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px">Nível</th><th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px">Categoria</th><th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px;text-align:left">Descrição</th><th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px">Prob.</th><th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px">Impacto</th><th style="padding:6px 8px;border:1px solid ${brandPrimary};font-size:9px;text-align:left">Mitigação</th></tr></thead>
    <tbody>${riskRows}</tbody>
  </table>

  <h3 style="color:${brandPrimary};margin:16px 0 8px;font-size:13px;page-break-after:avoid"><span style="color:${brandSecondary};font-family:monospace">// 07</span> ANÁLISE DE ROI — CENÁRIOS</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;page-break-inside:avoid">
    <thead><tr style="background:${brandPrimary};color:white"><th style="padding:6px 10px;border:1px solid ${brandPrimary};text-align:left;font-size:9px">Cenário</th><th style="padding:6px 10px;border:1px solid ${brandPrimary};text-align:left;font-size:9px">CAPEX</th><th style="padding:6px 10px;border:1px solid ${brandPrimary};text-align:left;font-size:9px">Benefício Anual</th><th style="padding:6px 10px;border:1px solid ${brandPrimary};text-align:left;font-size:9px">Payback (meses)</th><th style="padding:6px 10px;border:1px solid ${brandPrimary};text-align:left;font-size:9px">Premissa</th></tr></thead>
    <tbody>${roiRows}</tbody>
  </table>

  <h3 style="color:${brandPrimary};margin:24px 0 8px;font-size:13px;page-break-after:avoid"><span style="color:${brandSecondary};font-family:monospace">// 10</span> ACEITE E ASSINATURAS</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;page-break-inside:avoid">
    <div style="border:1px solid #e5e7eb;padding:18px;border-radius:4px">
      <div style="font-size:10px;font-weight:700;color:${brandPrimary};text-transform:uppercase;margin-bottom:12px">Contratante — ${esc(acc.contractor?.label || m.clientName)}</div>
      <p style="font-size:10px;margin:6px 0">Nome: ${esc(acc.contractor?.name || "_________________________________")}</p>
      <p style="font-size:10px;margin:6px 0">Cargo: ${esc(acc.contractor?.title || "_________________________________")}</p>
      <p style="font-size:10px;margin:6px 0">CPF / CNPJ: ${esc(acc.contractor?.cnpj || "____________________________")}</p>
      <div style="margin-top:30px;border-bottom:1px solid #333;height:40px"></div>
      <p style="font-size:9px;color:#666;margin-top:6px">Assinatura · Data: ___/___/______</p>
    </div>
    <div style="border:1px solid #e5e7eb;padding:18px;border-radius:4px">
      <div style="font-size:10px;font-weight:700;color:${brandPrimary};text-transform:uppercase;margin-bottom:12px">Contratada — ${esc(acc.contracted?.label || m.companyName)}</div>
      <p style="font-size:10px;margin:6px 0">Nome: ${esc(acc.contracted?.name || "_________________________________")}</p>
      <p style="font-size:10px;margin:6px 0">Cargo: ${esc(acc.contracted?.title || "_________________________________")}</p>
      <p style="font-size:10px;margin:6px 0">CREA / CPF: ${esc(acc.contracted?.crea || acc.contracted?.cnpj || "____________________________")}</p>
      <div style="margin-top:30px;border-bottom:1px solid #333;height:40px"></div>
      <p style="font-size:9px;color:#666;margin-top:6px">Assinatura · Data: ___/___/______</p>
    </div>
  </div>

  <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:9px;color:#666">
    <span style="font-weight:700;color:${brandPrimary}">${esc(m.companyName)}</span>
    <span>DOC: ${esc(m.docId)} · REV.${esc(m.version)} · CONFIDENCIAL</span>
  </div>
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

    const userPrompt = `Gere o documento ${docLabel} no formato JSON estruturado conforme o schema fornecido.

CONTEXTO DO PROJETO:
Empresa Fornecedora: ${d.company_name || "Nossa Empresa"} (${d.company_legal_name || ""}${d.company_cnpj ? ", CNPJ " + d.company_cnpj : ""})
Tagline da empresa: ${d.company_brand_tagline || "Proposal Engine"}
Responsável Técnico: ${d.company_authorized_person_name || ""}${d.company_authorized_person_title ? " — " + d.company_authorized_person_title : ""}${d.company_authorized_person_crea ? " · CREA " + d.company_authorized_person_crea : ""}

Cliente: ${d.client_name || "Cliente"} (${d.client_legal_name || ""}${d.client_cnpj ? ", CNPJ " + d.client_cnpj : ""})

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
${d.available_power_supply ? `Energia: ${d.available_power_supply}` : ""}
${d.investment_range_basic ? `Faixa investimento conservador: ${d.investment_range_basic}` : ""}
${d.investment_range_intermediate ? `Faixa investimento base: ${d.investment_range_intermediate}` : ""}
${d.investment_range_optimized ? `Faixa investimento otimizado: ${d.investment_range_optimized}` : ""}
${d.observacoes ? `Observações: ${d.observacoes}` : ""}

INSTRUÇÕES OBRIGATÓRIAS:
- DOC-ID a usar: "${docId}"
- Versão: "1.0"
- Data: "${dateBR}"
- Validade: "15 DIAS CORRIDOS"
- Status: "${docLabel}"
- confidential: true
- companyName: "${d.company_name || "Nossa Empresa"}"
- companyTagline: "${d.company_brand_tagline || "Proposal Engine"}"
- clientName: "${d.client_name || "Cliente"}"
${d.client_legal_name ? `- clientLegalName: "${d.client_legal_name}"` : ""}
${d.client_cnpj ? `- clientCnpj: "${d.client_cnpj}"` : ""}
${d.company_legal_name ? `- companyLegalName: "${d.company_legal_name}"` : ""}
${d.company_cnpj ? `- companyCnpj: "${d.company_cnpj}"` : ""}

Em "acceptance":
- contractor.label = "${d.client_name || "Cliente"}"
- contracted.label = "${d.company_name || "Nossa Empresa"}"
${d.company_authorized_person_name ? `- contracted.name = "${d.company_authorized_person_name}"` : ""}
${d.company_authorized_person_title ? `- contracted.title = "${d.company_authorized_person_title}"` : ""}
${d.company_authorized_person_crea ? `- contracted.crea = "${d.company_authorized_person_crea}"` : ""}
${d.company_cnpj ? `- contracted.cnpj = "${d.company_cnpj}"` : ""}

${buildVersionGuidance(version)}

Use valores realistas em R$ (mercado brasileiro). Detalhe a BOM com itens, disciplina, quantidade, valores. Sem placeholders fictícios. Linguagem executiva.

RETORNE EXCLUSIVAMENTE O JSON conforme a tool fornecida — nada mais.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_proposal",
              description: "Emite a proposta estruturada no schema definido",
              parameters: JSON_SCHEMA,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_proposal" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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

    // Override meta fields with deterministic values
    structured.meta = {
      ...structured.meta,
      docId,
      version: structured.meta?.version || "1.0",
      date: dateBR,
      confidential: true,
    };

    const brandPrimary = d.company_brand_primary_color || "#1a3a5c";
    const brandSecondary = d.company_brand_secondary_color || "#e67e22";
    const html = buildHtmlFromStructured(structured, brandPrimary, brandSecondary);

    return new Response(JSON.stringify({ structured, html, docId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-proposal error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
