/**
 * Parses AI-generated HTML proposal into structured ProposalData.
 * Sanitizes characters and extracts sections, tables, gantt data, etc.
 */
import type {
  ProposalData,
  ProposalMeta,
  ProposalSection,
  ContentBlock,
  GanttData,
  GanttPhase,
  GanttMilestone,
  CostGroup,
  CostItem,
  RiskItem,
  AlternativesTable,
} from "./types";

// ─── Character Sanitization ───────────────────────────────────────
function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    // Remove null bytes and control characters (except newline/tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Replace common mojibake patterns
    .replace(/ã§/g, "ç").replace(/ã£/g, "ã").replace(/ã©/g, "é")
    .replace(/ã¡/g, "á").replace(/ã³/g, "ó").replace(/ãº/g, "ú")
    .replace(/ã­/g, "í").replace(/ãª/g, "ê").replace(/ã´/g, "ô")
    .replace(/ã¢/g, "â").replace(/ã§ã£o/g, "ção")
    // Remove consecutive symbols that break readability
    .replace(/[→✓•◆●▪▸►]{3,}/g, "•")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return sanitizeText(tmp.textContent || "");
}

// ─── DOM Helpers ──────────────────────────────────────────────────
function getTextContent(el: Element): string {
  return sanitizeText(el.textContent || "");
}

function parseTable(table: Element): { headers: string[]; rows: string[][] } {
  const headers: string[] = [];
  const rows: string[][] = [];

  const thElements = table.querySelectorAll("thead th, thead td, tr:first-child th");
  thElements.forEach((th) => headers.push(getTextContent(th)));

  const trElements = table.querySelectorAll("tbody tr, tr");
  trElements.forEach((tr, idx) => {
    // Skip header row if it was in tbody
    if (idx === 0 && headers.length > 0 && tr.querySelector("th")) return;
    const cells: string[] = [];
    tr.querySelectorAll("td, th").forEach((td) => cells.push(getTextContent(td)));
    if (cells.length > 0 && cells.some((c) => c.length > 0)) {
      rows.push(cells);
    }
  });

  // If no headers extracted from thead, use first row
  if (headers.length === 0 && rows.length > 0) {
    const firstRow = rows.shift()!;
    headers.push(...firstRow);
  }

  return { headers, rows };
}

function detectHighlightVariant(el: Element): "info" | "warning" | "success" | "money" {
  const style = (el as HTMLElement).style;
  const text = getTextContent(el).toLowerCase();
  const bgColor = style.backgroundColor || style.background || "";

  if (text.includes("investimento") || text.includes("r$") || text.includes("💰")) return "money";
  if (text.includes("risco") || text.includes("⚠") || text.includes("atenção")) return "warning";
  if (text.includes("benefício") || text.includes("✓") || text.includes("vantag")) return "success";
  if (bgColor.includes("fef") || bgColor.includes("ff9") || bgColor.includes("e67")) return "money";
  if (bgColor.includes("f44") || bgColor.includes("e74")) return "warning";
  if (bgColor.includes("4caf") || bgColor.includes("2ec")) return "success";
  return "info";
}

// ─── Gantt Parser ─────────────────────────────────────────────────
const GANTT_PHASE_COLORS = [
  "#3498db", "#e67e22", "#2ecc71", "#9b59b6",
  "#f1c40f", "#e74c3c", "#1abc9c", "#34495e",
];

function extractGanttFromSections(sections: ProposalSection[]): GanttData | undefined {
  for (const section of sections) {
    const titleLower = section.title.toLowerCase();
    if (!titleLower.includes("cronograma") && !titleLower.includes("implementação")) continue;

    // Look for table with week/semana columns
    for (const block of section.content) {
      if (block.type === "table") {
        const weekCols = block.headers.filter((h) =>
          /^(sem|semana|s\d|wk|week|fase|etapa|mês)\s*/i.test(h)
        );
        if (weekCols.length >= 3) {
          return tableToGantt(block.headers, block.rows);
        }
      }
    }

    // Parse from list items (Semana 1-3: Engenharia...)
    const phases: GanttPhase[] = [];
    for (const block of section.content) {
      if (block.type === "list" || block.type === "paragraph") {
        const items = block.type === "list" ? block.items : [block.text];
        items.forEach((item, i) => {
          const match = item.match(
            /(?:semana|sem\.?|wk)\s*(\d+)\s*[-–a]\s*(\d+)\s*[:\-–]\s*(.+)/i
          );
          if (match) {
            phases.push({
              name: sanitizeText(match[3]),
              start: parseInt(match[1]),
              end: parseInt(match[2]),
              color: GANTT_PHASE_COLORS[i % GANTT_PHASE_COLORS.length],
            });
          }
        });
      }
    }

    if (phases.length > 0) {
      const maxWeek = Math.max(...phases.map((p) => p.end));
      return {
        totalWeeks: maxWeek,
        phases,
        milestones: extractMilestones(phases),
      };
    }
  }
  return undefined;
}

function tableToGantt(headers: string[], rows: string[][]): GanttData {
  const phases: GanttPhase[] = [];
  const weekIndices: number[] = [];

  headers.forEach((h, i) => {
    if (/^(sem|semana|s\d|wk|week|mês)\s*/i.test(h)) weekIndices.push(i);
  });

  rows.forEach((row, ri) => {
    const name = row[0] || `Fase ${ri + 1}`;
    let start = -1, end = -1;
    weekIndices.forEach((wi, weekNum) => {
      const cell = (row[wi] || "").trim();
      if (cell && cell !== "-" && cell !== "") {
        if (start === -1) start = weekNum + 1;
        end = weekNum + 1;
      }
    });
    if (start > 0 && end > 0) {
      phases.push({
        name: sanitizeText(name),
        start, end,
        color: GANTT_PHASE_COLORS[ri % GANTT_PHASE_COLORS.length],
      });
    }
  });

  const maxWeek = weekIndices.length;
  return { totalWeeks: maxWeek, phases, milestones: extractMilestones(phases) };
}

function extractMilestones(phases: GanttPhase[]): GanttMilestone[] {
  const milestones: GanttMilestone[] = [];
  const keywords = ["projeto", "fabricação", "fat", "sat", "entrega", "aceite", "instalação"];
  phases.forEach((p) => {
    const nameLower = p.name.toLowerCase();
    if (keywords.some((k) => nameLower.includes(k))) {
      milestones.push({ week: p.end, label: `Fim: ${p.name.substring(0, 25)}` });
    }
  });
  return milestones;
}

// ─── Cost Parser ──────────────────────────────────────────────────
function extractCosts(sections: ProposalSection[]): CostGroup[] {
  const groups: CostGroup[] = [];
  for (const section of sections) {
    const tl = section.title.toLowerCase();
    if (!tl.includes("custo") && !tl.includes("escopo") && !tl.includes("investimento") && !tl.includes("bom")) continue;

    let currentGroup: CostGroup | null = null;
    for (const block of section.content) {
      if (block.type === "heading") {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { group: block.text, items: [] };
      }
      if (block.type === "table" && block.rows.length > 0) {
        if (!currentGroup) currentGroup = { group: section.title, items: [] };
        block.rows.forEach((row) => {
          const item: CostItem = { description: row[0] || "" };
          if (row.length >= 5) {
            item.quantity = row[1]; item.unit = row[2]; item.unitPrice = row[3]; item.total = row[4];
          } else if (row.length >= 3) {
            item.quantity = row[1]; item.total = row[row.length - 1];
          } else if (row.length >= 2) {
            item.total = row[1];
          }
          currentGroup!.items.push(item);
        });
        // Look for subtotal in last row
        const lastRow = block.rows[block.rows.length - 1];
        if (lastRow[0]?.toLowerCase().includes("total") || lastRow[0]?.toLowerCase().includes("subtotal")) {
          currentGroup.subtotal = lastRow[lastRow.length - 1];
        }
      }
    }
    if (currentGroup) groups.push(currentGroup);
  }
  return groups;
}

// ─── Risk Parser ──────────────────────────────────────────────────
function extractRisks(sections: ProposalSection[]): RiskItem[] {
  const risks: RiskItem[] = [];
  for (const section of sections) {
    if (!section.title.toLowerCase().includes("risco")) continue;
    for (const block of section.content) {
      if (block.type === "table" && block.rows.length > 0) {
        block.rows.forEach((row) => {
          if (row.length >= 4) {
            risks.push({
              risk: row[0],
              probability: (row[1] as "Baixa" | "Média" | "Alta") || "Média",
              impact: (row[2] as "Baixo" | "Médio" | "Alto") || "Médio",
              mitigation: row[3],
            });
          }
        });
      }
    }
  }
  return risks;
}

// ─── Alternatives Parser ──────────────────────────────────────────
function extractAlternatives(sections: ProposalSection[]): AlternativesTable | undefined {
  for (const section of sections) {
    const tl = section.title.toLowerCase();
    if (!tl.includes("alternativa") && !tl.includes("opções") && !tl.includes("opcões")) continue;
    for (const block of section.content) {
      if (block.type === "table" && block.headers.length >= 3) {
        // Transpose: columns are the options
        const options = block.headers.slice(1).map((name, colIdx) => {
          const features = block.rows.map((row) => `${row[0]}: ${row[colIdx + 1] || "-"}`);
          const priceRow = block.rows.find((r) => r[0]?.toLowerCase().includes("investimento") || r[0]?.toLowerCase().includes("preço") || r[0]?.toLowerCase().includes("valor"));
          return {
            name,
            description: name,
            features,
            price: priceRow ? priceRow[colIdx + 1] : undefined,
            recommended: name.toLowerCase().includes("recomend") || name.toLowerCase().includes("normal"),
          };
        });
        return { options };
      }
    }
  }
  return undefined;
}

// ─── Main Parser ──────────────────────────────────────────────────
function parseChildToBlocks(child: Element): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const tag = child.tagName?.toLowerCase();

  if (tag === "table") {
    const { headers, rows } = parseTable(child);
    if (headers.length > 0 || rows.length > 0) {
      blocks.push({ type: "table", headers, rows, highlightHeader: true });
    }
  } else if (tag === "ul" || tag === "ol") {
    const items: string[] = [];
    child.querySelectorAll("li").forEach((li) => items.push(getTextContent(li)));
    if (items.length > 0) {
      blocks.push({ type: "list", ordered: tag === "ol", items });
    }
  } else if (tag === "h2") {
    blocks.push({ type: "heading", level: 2, text: getTextContent(child) });
  } else if (tag === "h3") {
    blocks.push({ type: "heading", level: 3, text: getTextContent(child) });
  } else if (tag === "h4") {
    blocks.push({ type: "heading", level: 4, text: getTextContent(child) });
  } else if (tag === "div" || tag === "section") {
    const style = (child as HTMLElement).getAttribute("style") || "";
    // Check if it's a highlight box
    if (style.includes("border-left") && (style.includes("4px") || style.includes("3px"))) {
      blocks.push({
        type: "highlight",
        text: getTextContent(child),
        variant: detectHighlightVariant(child),
      });
    } else {
      // Recursively parse children
      Array.from(child.children).forEach((grandchild) => {
        blocks.push(...parseChildToBlocks(grandchild));
      });
      // If no children but has text
      if (child.children.length === 0 && getTextContent(child)) {
        blocks.push({ type: "paragraph", text: getTextContent(child) });
      }
    }
  } else if (tag === "p" || tag === "span") {
    const text = getTextContent(child);
    if (text) blocks.push({ type: "paragraph", text });
  } else if (tag === "img") {
    const alt = child.getAttribute("alt") || "Imagem";
    blocks.push({ type: "image-placeholder", description: `[${alt}]` });
  } else if (tag === "hr") {
    blocks.push({ type: "gap" });
  } else {
    // Fallback: extract text
    const text = getTextContent(child);
    if (text && text.length > 2) {
      blocks.push({ type: "paragraph", text });
    }
  }
  return blocks;
}

export function parseHtmlToProposalData(html: string, meta?: Partial<ProposalMeta>): ProposalData {
  const container = document.createElement("div");
  container.innerHTML = html;

  // Extract meta from cover page
  const coverDiv = container.querySelector('div[style*="min-height"]');
  const title = coverDiv?.querySelector("h1")?.textContent || meta?.title || "Proposta Técnica e Comercial";
  const subtitle = coverDiv?.querySelector("h2, p")?.textContent || meta?.subtitle || "";

  const proposalMeta: ProposalMeta = {
    title: sanitizeText(title),
    subtitle: sanitizeText(subtitle),
    clientName: meta?.clientName || "Cliente",
    companyName: meta?.companyName || "Empresa",
    companyLogo: meta?.companyLogo,
    clientLogo: meta?.clientLogo,
    date: meta?.date || new Date().toLocaleDateString("pt-BR"),
    version: meta?.version || "1.0",
    validity: meta?.validity || "30 dias",
    proposalId: meta?.proposalId,
    confidential: true,
  };

  // Parse sections by looking for section headers (h1, h2 with numbers, or styled divs)
  const sections: ProposalSection[] = [];
  let currentSection: ProposalSection | null = null;
  let sectionCounter = 0;

  const topChildren = Array.from(container.children);
  for (const child of topChildren) {
    const el = child as HTMLElement;
    const tag = el.tagName?.toLowerCase();
    const style = el.getAttribute("style") || "";
    const text = getTextContent(el);

    // Skip cover page div
    if (style.includes("min-height") && (style.includes("80vh") || style.includes("100vh"))) continue;

    // Detect section header
    const isSectionHeader =
      (tag === "h1") ||
      (tag === "div" && style.includes("background") && (style.includes("#1a237e") || style.includes("#1a3a5c"))) ||
      (tag === "h2" && /^\d+\./.test(text));

    if (isSectionHeader) {
      if (currentSection) sections.push(currentSection);
      sectionCounter++;
      const sectionTitle = text.replace(/^\d+\.\s*/, "");
      currentSection = {
        number: `${sectionCounter}`,
        title: sanitizeText(sectionTitle),
        content: [],
      };
      continue;
    }

    if (!currentSection) {
      // Content before first section header → put in intro section
      currentSection = { number: "0", title: "Introdução", content: [] };
    }

    currentSection.content.push(...parseChildToBlocks(el));
  }

  if (currentSection && currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  // Filter out empty intro
  const filteredSections = sections.filter(
    (s) => s.number !== "0" || s.content.length > 0
  );

  // Extract special data
  const gantt = extractGanttFromSections(filteredSections);
  const costBreakdown = extractCosts(filteredSections);
  const riskMatrix = extractRisks(filteredSections);
  const alternatives = extractAlternatives(filteredSections);

  return {
    meta: proposalMeta,
    sections: filteredSections,
    gantt,
    costBreakdown: costBreakdown.length > 0 ? costBreakdown : undefined,
    riskMatrix: riskMatrix.length > 0 ? riskMatrix : undefined,
    alternatives,
  };
}
