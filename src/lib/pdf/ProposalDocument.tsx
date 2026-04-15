import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  Image,
} from "@react-pdf/renderer";
import { styles, COLORS } from "./styles";
import type {
  ProposalData,
  ProposalSection,
  ContentBlock,
  GanttData,
  RiskItem,
  AlternativesTable,
  CostGroup,
} from "./types";

// ─── Font Registration ────────────────────────────────────────────
Font.register({
  family: "Montserrat",
  src: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.ttf",
});
Font.register({
  family: "MontserratBold",
  src: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-.ttf",
  fontWeight: "bold",
});
Font.register({
  family: "MontserratSemiBold",
  src: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170w-.ttf",
  fontWeight: "semibold",
});
Font.register({
  family: "OpenSans",
  src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.ttf",
});
Font.register({
  family: "OpenSansBold",
  src: "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVI.ttf",
  fontWeight: "bold",
});

// Hyphenation callback to avoid word breaks
Font.registerHyphenationCallback((word) => [word]);

// ─── Sub-Components ───────────────────────────────────────────────

const Header = ({ meta }: { meta: ProposalData["meta"] }) => (
  <View style={styles.header} fixed>
    {meta.companyLogo ? (
      <Image style={styles.headerLogo} src={meta.companyLogo} />
    ) : (
      <Text style={{ fontFamily: "MontserratBold", fontSize: 9, color: COLORS.primary }}>
        {meta.companyName}
      </Text>
    )}
    <View>
      <Text style={styles.headerText}>{meta.title}</Text>
      <Text style={styles.headerText}>
        {meta.proposalId ? `${meta.proposalId} | ` : ""}v{meta.version} | {meta.date}
      </Text>
    </View>
  </View>
);

const Footer = ({ meta }: { meta: ProposalData["meta"] }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerConfidential}>
      {meta.confidential ? "CONFIDENCIAL" : ""}
    </Text>
    <Text style={styles.footerText}>{meta.companyName} - {meta.date}</Text>
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
    />
  </View>
);

// ─── Cover Page ───────────────────────────────────────────────────
const CoverPage = ({ meta }: { meta: ProposalData["meta"] }) => (
  <Page size="A4" style={styles.coverPage}>
    <View style={styles.coverAccentBar} />
    <View style={styles.coverTopBar} />
    <View style={styles.coverContainer}>
      {meta.companyLogo ? (
        <Image style={styles.coverLogo} src={meta.companyLogo} />
      ) : (
        <Text style={{ fontFamily: "MontserratBold", fontSize: 20, color: COLORS.primary, marginBottom: 40 }}>
          {meta.companyName}
        </Text>
      )}

      <Text style={styles.coverTitle}>{meta.title}</Text>
      {meta.subtitle && <Text style={styles.coverSubtitle}>{meta.subtitle}</Text>}
      <View style={styles.coverDivider} />

      <View style={styles.coverInfoBox}>
        <View style={styles.coverInfoRow}>
          <Text style={styles.coverInfoLabel}>CLIENTE:</Text>
          <Text style={styles.coverInfoValue}>{meta.clientName}</Text>
        </View>
        <View style={styles.coverInfoRow}>
          <Text style={styles.coverInfoLabel}>DATA:</Text>
          <Text style={styles.coverInfoValue}>{meta.date}</Text>
        </View>
        <View style={styles.coverInfoRow}>
          <Text style={styles.coverInfoLabel}>VERSÃO:</Text>
          <Text style={styles.coverInfoValue}>{meta.version}</Text>
        </View>
        {meta.validity && (
          <View style={styles.coverInfoRow}>
            <Text style={styles.coverInfoLabel}>VALIDADE:</Text>
            <Text style={styles.coverInfoValue}>{meta.validity}</Text>
          </View>
        )}
        {meta.proposalId && (
          <View style={styles.coverInfoRow}>
            <Text style={styles.coverInfoLabel}>PROPOSTA Nº:</Text>
            <Text style={styles.coverInfoValue}>{meta.proposalId}</Text>
          </View>
        )}
      </View>
    </View>
  </Page>
);

// ─── Content Block Renderers ──────────────────────────────────────
const RenderParagraph = ({ text }: { text: string }) => (
  <Text style={styles.bodyText}>{text}</Text>
);

const RenderHeading = ({ level, text }: { level: number; text: string }) => {
  const style = level === 2 ? styles.h2 : level === 3 ? styles.h3 : styles.h3;
  return <Text style={style}>{text}</Text>;
};

const RenderList = ({ items, ordered }: { items: string[]; ordered: boolean }) => (
  <View style={{ marginBottom: 8 }}>
    {items.map((item, i) => (
      <View key={i} style={styles.listItem} wrap={false}>
        <Text style={styles.listBullet}>{ordered ? `${i + 1}.` : "•"}</Text>
        <Text style={styles.listText}>{item}</Text>
      </View>
    ))}
  </View>
);

const RenderTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => {
  const colCount = headers.length || (rows[0]?.length || 1);
  const needsLandscape = colCount > 6;
  const fontSize = needsLandscape ? 7 : 8;

  return (
    <View style={styles.table} wrap={false}>
      {headers.length > 0 && (
        <View style={styles.tableHeaderRow}>
          {headers.map((h, i) => (
            <Text key={i} style={[styles.tableHeaderCell, { fontSize }]}>{h}</Text>
          ))}
        </View>
      )}
      {rows.map((row, ri) => (
        <View key={ri} style={ri % 2 === 0 ? styles.tableRow : styles.tableRowEven}>
          {row.map((cell, ci) => (
            <Text key={ci} style={[styles.tableCell, { fontSize }]}>{cell}</Text>
          ))}
          {/* Pad if fewer cells than headers */}
          {Array.from({ length: Math.max(0, colCount - row.length) }).map((_, pi) => (
            <Text key={`pad-${pi}`} style={[styles.tableCell, { fontSize }]}>{""}</Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const RenderHighlight = ({ text, variant }: { text: string; variant: string }) => {
  const variantStyle =
    variant === "warning" ? styles.highlightWarning :
    variant === "success" ? styles.highlightSuccess :
    variant === "money" ? styles.highlightMoney :
    styles.highlightInfo;

  const icon = variant === "warning" ? "⚠ " : variant === "success" ? "✓ " : variant === "money" ? "💰 " : "ℹ ";

  return (
    <View style={[styles.highlightBox, variantStyle]} wrap={false}>
      <Text style={styles.highlightText}>{icon}{text}</Text>
    </View>
  );
};

const RenderImagePlaceholder = ({ description }: { description: string }) => (
  <View style={styles.imagePlaceholder} wrap={false}>
    <Text style={styles.imagePlaceholderText}>{description}</Text>
  </View>
);

const RenderBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case "paragraph": return <RenderParagraph text={block.text} />;
    case "heading": return <RenderHeading level={block.level} text={block.text} />;
    case "list": return <RenderList items={block.items} ordered={block.ordered} />;
    case "table": return <RenderTable headers={block.headers} rows={block.rows} />;
    case "highlight": return <RenderHighlight text={block.text} variant={block.variant} />;
    case "image-placeholder": return <RenderImagePlaceholder description={block.description} />;
    case "gap": return <View style={{ marginVertical: 10 }} />;
    default: return null;
  }
};

// ─── Gantt Chart ──────────────────────────────────────────────────
const GanttChart = ({ data }: { data: GanttData }) => {
  const weeks = Array.from({ length: data.totalWeeks }, (_, i) => i + 1);

  return (
    <View style={styles.ganttContainer} wrap={false}>
      <Text style={styles.ganttTitle}>Cronograma de Implementação</Text>

      {/* Week headers */}
      <View style={styles.ganttWeekHeader}>
        {weeks.map((w) => (
          <View key={w} style={styles.ganttWeekCell}>
            <Text style={styles.ganttWeekText}>S{w}</Text>
          </View>
        ))}
      </View>

      {/* Phase bars */}
      {data.phases.map((phase, i) => {
        const startPct = ((phase.start - 1) / data.totalWeeks) * 100;
        const widthPct = ((phase.end - phase.start + 1) / data.totalWeeks) * 100;

        return (
          <View key={i} style={styles.ganttRow}>
            <Text style={styles.ganttLabel}>{phase.name}</Text>
            <View style={styles.ganttBarArea}>
              <View
                style={[
                  styles.ganttBar,
                  {
                    backgroundColor: phase.color,
                    left: `${startPct}%`,
                    width: `${widthPct}%`,
                  } as any,
                ]}
              />
            </View>
          </View>
        );
      })}

      {/* Milestones */}
      {data.milestones.length > 0 && (
        <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {data.milestones.map((m, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
              <View style={{ width: 6, height: 6, backgroundColor: COLORS.danger, marginRight: 3, transform: "rotate(45deg)" }} />
              <Text style={{ fontFamily: "OpenSans", fontSize: 6, color: COLORS.text }}>
                S{m.week}: {m.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Legend */}
      <View style={styles.ganttLegend}>
        {data.phases.map((phase, i) => (
          <View key={i} style={styles.ganttLegendItem}>
            <View style={[styles.ganttLegendColor, { backgroundColor: phase.color }]} />
            <Text style={styles.ganttLegendText}>{phase.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Alternatives ─────────────────────────────────────────────────
const AlternativesView = ({ data }: { data: AlternativesTable }) => (
  <View style={styles.altContainer} wrap={false}>
    {data.options.map((opt, i) => (
      <View key={i} style={opt.recommended ? styles.altCardRecommended : styles.altCard}>
        {opt.recommended && (
          <View style={styles.altBadge}>
            <Text style={styles.altBadgeText}>RECOMENDADA</Text>
          </View>
        )}
        <Text style={styles.altCardTitle}>{opt.name}</Text>
        {opt.features.map((f, fi) => (
          <Text key={fi} style={styles.altFeature}>• {f}</Text>
        ))}
        {opt.price && <Text style={styles.altPrice}>{opt.price}</Text>}
      </View>
    ))}
  </View>
);

// ─── Risk Matrix ──────────────────────────────────────────────────
const RiskMatrix = ({ risks }: { risks: RiskItem[] }) => {
  const getRiskColor = (prob: string, imp: string) => {
    const score = (prob === "Alta" ? 3 : prob === "Média" ? 2 : 1) *
                  (imp === "Alto" ? 3 : imp === "Médio" ? 2 : 1);
    if (score >= 6) return { backgroundColor: "#fadbd8" };
    if (score >= 3) return { backgroundColor: "#fef9e7" };
    return { backgroundColor: "#eafaf1" };
  };

  return (
    <View style={styles.table} wrap={false}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Risco</Text>
        <Text style={styles.tableHeaderCell}>Probabilidade</Text>
        <Text style={styles.tableHeaderCell}>Impacto</Text>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Mitigação</Text>
      </View>
      {risks.map((risk, i) => (
        <View key={i} style={[styles.tableRow, getRiskColor(risk.probability, risk.impact)]}>
          <Text style={[styles.tableCell, { flex: 2 }]}>{risk.risk}</Text>
          <Text style={styles.tableCell}>{risk.probability}</Text>
          <Text style={styles.tableCell}>{risk.impact}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>{risk.mitigation}</Text>
        </View>
      ))}
    </View>
  );
};

// ─── Section Renderer ─────────────────────────────────────────────
const SectionPage = ({
  section,
  meta,
  gantt,
  alternatives,
  riskMatrix,
  costBreakdown,
}: {
  section: ProposalSection;
  meta: ProposalData["meta"];
  gantt?: GanttData;
  alternatives?: AlternativesTable;
  riskMatrix?: RiskItem[];
  costBreakdown?: CostGroup[];
}) => {
  const titleLower = section.title.toLowerCase();
  const isGanttSection = titleLower.includes("cronograma") || titleLower.includes("implementação");
  const isAltSection = titleLower.includes("alternativa") || titleLower.includes("opções");
  const isRiskSection = titleLower.includes("risco");
  const isCostSection = titleLower.includes("custo") || titleLower.includes("escopo técnico");

  // Determine if landscape is needed
  const hasWideTable = section.content.some(
    (b) => b.type === "table" && b.headers.length > 6
  );
  const needsLandscape = hasWideTable || (isGanttSection && gantt && gantt.totalWeeks > 8);
  const orientation = needsLandscape ? "landscape" : "portrait";

  return (
    <Page
      size="A4"
      orientation={orientation}
      style={orientation === "landscape" ? styles.pageLandscape : styles.page}
    >
      <Header meta={meta} />

      {/* Section header bar */}
      <View style={styles.sectionHeaderBar}>
        {section.number !== "0" && (
          <Text style={styles.sectionHeaderNumber}>{section.number}.</Text>
        )}
        <Text style={styles.sectionHeaderTitle}>{section.title.toUpperCase()}</Text>
      </View>

      {/* Content blocks */}
      {section.content.map((block, i) => (
        <RenderBlock key={i} block={block} />
      ))}

      {/* Special components */}
      {isGanttSection && gantt && <GanttChart data={gantt} />}
      {isAltSection && alternatives && <AlternativesView data={alternatives} />}
      {isRiskSection && riskMatrix && riskMatrix.length > 0 && <RiskMatrix risks={riskMatrix} />}
      {isCostSection && costBreakdown && costBreakdown.map((group, gi) => (
        <View key={gi} style={{ marginVertical: 6 }}>
          <Text style={styles.h3}>{group.group}</Text>
          <RenderTable
            headers={["Descrição", "Qtd", "Unid", "Preço Unit.", "Total"]}
            rows={group.items.map((item) => [
              item.description,
              item.quantity || "-",
              item.unit || "-",
              item.unitPrice || "-",
              item.total || "-",
            ])}
          />
          {group.subtotal && (
            <View style={[styles.highlightBox, styles.highlightMoney]} wrap={false}>
              <Text style={styles.highlightText}>Subtotal: {group.subtotal}</Text>
            </View>
          )}
        </View>
      ))}

      <Footer meta={meta} />
    </Page>
  );
};

// ─── Main Document ────────────────────────────────────────────────
export const ProposalDocument = ({ data }: { data: ProposalData }) => (
  <Document
    title={data.meta.title}
    author={data.meta.companyName}
    subject="Proposta Técnica e Comercial"
    creator="Sistema de Propostas"
  >
    {/* Cover Page */}
    <CoverPage meta={data.meta} />

    {/* Content Sections */}
    {data.sections.map((section, i) => (
      <SectionPage
        key={i}
        section={section}
        meta={data.meta}
        gantt={data.gantt}
        alternatives={data.alternatives}
        riskMatrix={data.riskMatrix}
        costBreakdown={data.costBreakdown}
      />
    ))}
  </Document>
);
