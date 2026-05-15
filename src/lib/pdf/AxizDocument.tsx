import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { StructuredProposalData } from "@/types/project";

Font.register({
  family: "IBMPlex",
  fonts: [
    { src: "https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKhdHeFaxOedfTDw.ttf" },
    { src: "https://fonts.gstatic.com/s/ibmplexsans/v19/zYX9KVElMYYaJe8bpLHnCwDKjQ76AIRZ91U.ttf", fontWeight: "bold" },
    { src: "https://fonts.gstatic.com/s/ibmplexsans/v19/zYX9KVElMYYaJe8bpLHnCwDKjW76AIRZ91U.ttf", fontWeight: "semibold" },
  ],
});
Font.register({
  family: "IBMPlexMono",
  fonts: [
    { src: "https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n5igg1l9kn-s.ttf" },
    { src: "https://fonts.gstatic.com/s/ibmplexmono/v19/-F6qfjptAgt5VM-kVkqdyU8n3pAL21thg5xg.ttf", fontWeight: "bold" },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

interface BrandColors {
  primary: string;
  secondary: string;
  accent?: string;
}

const buildStyles = (b: BrandColors) =>
  StyleSheet.create({
    page: {
      paddingTop: 36,
      paddingBottom: 44,
      paddingHorizontal: 32,
      backgroundColor: "#ffffff",
      fontFamily: "IBMPlex",
      fontSize: 9,
      color: "#0f1419",
      lineHeight: 1.45,
    },
    // Header
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      paddingBottom: 6,
      marginBottom: 14,
    },
    brand: { fontFamily: "IBMPlex", fontWeight: "bold", fontSize: 15, color: b.primary },
    tagline: { fontFamily: "IBMPlexMono", fontSize: 7, color: "#666" },
    metaRight: { fontFamily: "IBMPlexMono", fontSize: 7, color: "#444", textAlign: "right" },
    // Section header bar
    sectionBar: {
      backgroundColor: b.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginBottom: 12,
    },
    sectionLabel: { color: "#fff", fontWeight: "bold", fontSize: 11, letterSpacing: 0.5 },
    sectionNum: { color: b.secondary, fontFamily: "IBMPlexMono", fontSize: 9, marginRight: 6 },
    sectionMeta: { fontFamily: "IBMPlexMono", fontSize: 7, color: "#fff" },
    // Cover
    coverFrame: {
      borderWidth: 2,
      borderColor: b.primary,
      padding: 22,
      flexGrow: 1,
    },
    coverDocLine: { fontFamily: "IBMPlexMono", fontSize: 8, color: "#666", marginBottom: 4 },
    coverTitle: { fontWeight: "bold", fontSize: 26, color: b.primary, marginBottom: 6 },
    coverSubtitle: { fontSize: 12, color: "#444", marginBottom: 16 },
    // Specs table
    specsTable: { borderWidth: 1, borderColor: "#e5e7eb", marginVertical: 10 },
    specsRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee" },
    specsLabel: {
      width: "25%", padding: 5, fontWeight: "bold", color: "#555", fontSize: 8,
      backgroundColor: "#f8fafc", borderRightWidth: 1, borderRightColor: "#eee",
    },
    specsValue: { width: "25%", padding: 5, fontSize: 8, borderRightWidth: 1, borderRightColor: "#eee" },
    // Client box
    clientBox: {
      backgroundColor: "#f8fafc",
      borderLeftWidth: 4,
      borderLeftColor: b.primary,
      padding: 12,
      marginTop: 14,
    },
    clientLabel: { fontSize: 7, color: "#666", letterSpacing: 0.5, marginBottom: 3 },
    clientName: { fontWeight: "bold", fontSize: 14, color: b.primary },
    clientLegal: { fontSize: 9, color: "#666", marginTop: 2 },
    confidential: { textAlign: "center", color: "#dc2626", fontWeight: "bold", fontSize: 8, letterSpacing: 1, marginTop: 12 },
    // Headline metrics
    metricsRow: { flexDirection: "row", marginVertical: 10, gap: 6 },
    metricCard: {
      flex: 1,
      padding: 10,
      backgroundColor: "#f8fafc",
      borderLeftWidth: 3,
      borderLeftColor: b.secondary,
    },
    metricLabel: { fontSize: 7, color: "#666", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 3 },
    metricValue: { fontSize: 13, fontWeight: "bold", color: b.primary },
    // Body
    body: { fontSize: 9, lineHeight: 1.55, textAlign: "justify", marginBottom: 10 },
    note: {
      backgroundColor: "#fef9e7", borderLeftWidth: 4, borderLeftColor: "#d97706",
      padding: 10, marginVertical: 8,
    },
    noteTitle: { fontWeight: "bold", fontSize: 9, color: "#92400e", marginBottom: 3 },
    noteText: { fontSize: 8, lineHeight: 1.5 },
    // BOM
    bomCatHeader: {
      backgroundColor: "#eef2f6", padding: 5, fontWeight: "bold", color: b.primary, fontSize: 9,
      borderWidth: 1, borderColor: "#ddd", marginTop: 6,
    },
    bomTable: { borderWidth: 1, borderColor: "#ddd" },
    bomHead: { flexDirection: "row", backgroundColor: b.primary },
    bomHeadCell: {
      color: "#fff", fontWeight: "bold", fontSize: 7, padding: 4,
      borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.2)",
    },
    bomRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", minHeight: 18 },
    bomCell: {
      fontSize: 7, padding: 4, borderRightWidth: 1, borderRightColor: "#eee",
    },
    bomTotalsRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#ddd" },
    bomTotalCell: { padding: 6, fontSize: 8, fontWeight: "bold" },
    // Schedule
    schedTable: { borderWidth: 1, borderColor: "#ddd", marginVertical: 6 },
    schedHead: { flexDirection: "row", backgroundColor: b.primary },
    schedHeadCell: {
      color: "#fff", fontSize: 7, padding: 3, textAlign: "center",
      borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.2)",
      fontWeight: "bold",
    },
    schedRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", minHeight: 24 },
    schedCell: {
      fontSize: 7, padding: 3, borderRightWidth: 1, borderRightColor: "#eee",
      justifyContent: "center",
    },
    // Risks
    riskHead: { flexDirection: "row", backgroundColor: b.primary },
    // Acceptance
    acceptRow: { flexDirection: "row", gap: 16, marginTop: 10 },
    acceptBox: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", padding: 12 },
    acceptLabel: { fontSize: 8, fontWeight: "bold", color: b.primary, marginBottom: 6, letterSpacing: 0.5 },
    acceptLine: { fontSize: 8, marginVertical: 3 },
    sigSpace: { borderBottomWidth: 1, borderBottomColor: "#333", marginTop: 28, height: 1 },
    sigCaption: { fontSize: 7, color: "#666", marginTop: 4 },
    // Footer
    footer: {
      position: "absolute", bottom: 18, left: 32, right: 32,
      flexDirection: "row", justifyContent: "space-between",
      borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 5,
    },
    footerBrand: { fontWeight: "bold", fontSize: 7, color: b.primary },
    footerMeta: { fontFamily: "IBMPlexMono", fontSize: 7, color: "#666" },
    // Subsystem cards
    ssCard: {
      borderWidth: 1,
      borderColor: "#e5e7eb",
      marginBottom: 10,
    },
    ssHeader: {
      backgroundColor: b.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    ssCode: { color: b.secondary, fontFamily: "IBMPlexMono", fontSize: 8 },
    ssName: { color: "#fff", fontWeight: "bold", fontSize: 10, letterSpacing: 0.3 },
    ssDiscipline: { color: "#fff", fontFamily: "IBMPlexMono", fontSize: 7, opacity: 0.85 },
    ssBody: { padding: 10 },
    ssObjective: { fontSize: 8, color: "#444", marginBottom: 5 },
    ssDesc: { fontSize: 8, lineHeight: 1.55, textAlign: "justify", marginBottom: 6, color: "#222" },
    ssSubLabel: { fontSize: 7, fontWeight: "bold", color: b.primary, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4, marginBottom: 3 },
    ssTable: { borderWidth: 1, borderColor: "#eee" },
    ssTableHead: { flexDirection: "row", backgroundColor: "#f8fafc" },
    ssTableHeadCell: { fontSize: 7, fontWeight: "bold", color: "#555", padding: 4, borderRightWidth: 1, borderRightColor: "#eee" },
    ssTableRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#eee" },
    ssTableCell: { fontSize: 7, padding: 4, borderRightWidth: 1, borderRightColor: "#eee" },
    ssParamRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#eee" },
    ssParamLabel: { width: "50%", padding: 4, fontSize: 7, fontWeight: "bold", color: "#555", backgroundColor: "#f8fafc", borderRightWidth: 1, borderRightColor: "#eee" },
    ssParamValue: { width: "50%", padding: 4, fontSize: 7 },
    ssBadge: {
      backgroundColor: "#eef2f6",
      color: b.primary,
      fontSize: 7,
      fontFamily: "IBMPlexMono",
      paddingHorizontal: 5,
      paddingVertical: 1,
      marginRight: 4,
      marginBottom: 3,
      borderWidth: 0.5,
      borderColor: "#d1dce8",
    },
    ssInterfaces: { marginTop: 6, padding: 6, backgroundColor: "#f8fafc", borderLeftWidth: 3, borderLeftColor: b.secondary, fontSize: 7 },
  });

const PageHeader = ({ d, s }: { d: StructuredProposalData; s: any }) => (
  <View style={s.header} fixed>
    <View>
      <Text style={s.brand}>{d.meta.companyName}</Text>
      {d.meta.companyTagline ? <Text style={s.tagline}>// {d.meta.companyTagline}</Text> : null}
    </View>
    <View>
      <Text style={s.metaRight}>DOC: {d.meta.docId} · REV {d.meta.version} · {d.meta.date}</Text>
      <Text style={s.metaRight}>{d.meta.status} · VAL. {d.meta.validity}</Text>
    </View>
  </View>
);

const PageFooter = ({ d, s }: { d: StructuredProposalData; s: any }) => (
  <View style={s.footer} fixed>
    <Text style={s.footerBrand}>{d.meta.companyName}</Text>
    <Text
      style={s.footerMeta}
      render={({ pageNumber, totalPages }) =>
        `DOC: ${d.meta.docId} · REV.${d.meta.version} · ${d.meta.confidential ? "CONFIDENCIAL · " : ""}PÁG. ${pageNumber}/${totalPages}`
      }
    />
  </View>
);

export const AxizProposalDocument = ({
  data,
  brand,
}: {
  data: StructuredProposalData;
  brand: BrandColors;
}) => {
  const s = buildStyles(brand);
  const m = data.meta;
  const specs = data.specs || [];
  const specPairs: Array<[any, any]> = [];
  for (let i = 0; i < specs.length; i += 2) specPairs.push([specs[i], specs[i + 1]]);

  const bom = data.bom || ({ categories: [], totals: [] } as any);
  const subsystems = data.subsystems || [];
  const sched = data.schedule || { totalWeeks: 6, phases: [] };
  const risks = data.risks || [];
  const roi = data.roi || [];
  const acc = data.acceptance || ({ contractor: { label: m.clientName }, contracted: { label: m.companyName } } as any);

  const weekFlex = 1 / sched.totalWeeks;

  const riskBg = (lvl: string) => (lvl === "ALTO" ? "#fee2e2" : lvl === "MEDIO" ? "#fef9e7" : "#eafaf1");
  const riskBadge = (lvl: string) => (lvl === "ALTO" ? "#dc2626" : lvl === "MEDIO" ? "#d97706" : "#16a34a");

  return (
    <Document title={m.title} author={m.companyName} subject={m.status}>
      {/* PÁGINA 1 — CAPA */}
      <Page size="A4" style={s.page}>
        <PageHeader d={data} s={s} />
        <View style={s.coverFrame}>
          <Text style={s.coverDocLine}>// DOC-ID: {m.docId} · PROJETO</Text>
          <Text style={s.coverTitle}>{m.title}</Text>
          {m.subtitle ? <Text style={s.coverSubtitle}>{m.subtitle}</Text> : null}

          <View style={s.specsTable}>
            {specPairs.map(([a, b], i) => (
              <View style={s.specsRow} key={i} wrap={false}>
                <Text style={s.specsLabel}>{a?.label}</Text>
                <Text style={s.specsValue}>{a?.value}</Text>
                <Text style={s.specsLabel}>{b?.label || ""}</Text>
                <Text style={[s.specsValue, { borderRightWidth: 0 }]}>{b?.value || ""}</Text>
              </View>
            ))}
          </View>

          <View style={s.clientBox}>
            <Text style={s.clientLabel}>CLIENTE / CONTRATANTE</Text>
            <Text style={s.clientName}>{m.clientName}</Text>
            {m.clientLegalName ? (
              <Text style={s.clientLegal}>
                {m.clientLegalName}{m.clientCnpj ? ` · CNPJ ${m.clientCnpj}` : ""}
              </Text>
            ) : null}
          </View>

          {m.confidential ? <Text style={s.confidential}>CONFIDENCIAL · USO RESTRITO</Text> : null}
        </View>
        <PageFooter d={data} s={s} />
      </Page>

      {/* PÁGINA 2 — RESUMO + BOM */}
      <Page size="A4" style={s.page}>
        <PageHeader d={data} s={s} />
        <View style={s.sectionBar}>
          <Text>
            <Text style={s.sectionNum}>// 01</Text>
            <Text style={s.sectionLabel}>RESUMO EXECUTIVO + BOM</Text>
          </Text>
          <Text style={s.sectionMeta}>{m.docId} · REV.{m.version}</Text>
        </View>

        <Text style={s.body}>{data.executive?.summary}</Text>

        {data.executive?.note ? (
          <View style={s.note} wrap={false}>
            <Text style={s.noteTitle}>⚠ Nota sobre Investimento</Text>
            <Text style={s.noteText}>{data.executive.note}</Text>
          </View>
        ) : null}

        {data.executive?.headlineMetrics?.length ? (
          <View style={s.metricsRow} wrap={false}>
            {data.executive.headlineMetrics.slice(0, 4).map((h, i) => (
              <View key={i} style={s.metricCard}>
                <Text style={s.metricLabel}>{h.label}</Text>
                <Text style={s.metricValue}>{h.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={[s.sectionBar, { marginTop: 8 }]}>
          <Text>
            <Text style={s.sectionNum}>// 05</Text>
            <Text style={s.sectionLabel}>LISTA DE MATERIAIS — BOM DETALHADA</Text>
          </Text>
          <Text style={s.sectionMeta}>{bom.categories?.length || 0} categorias</Text>
        </View>

        {bom.categories?.map((cat: any, ci: number) => (
          <View key={ci} wrap={true} style={{ marginBottom: 8 }}>
            <Text style={s.bomCatHeader}>
              {cat.code} — {cat.name}{cat.subtotal ? ` · SUBTOTAL: ${cat.subtotal}` : ""}
            </Text>
            <View style={s.bomTable}>
              <View style={s.bomHead} fixed>
                <Text style={[s.bomHeadCell, { flex: 1 }]}>Código</Text>
                <Text style={[s.bomHeadCell, { flex: 4 }]}>Descrição</Text>
                <Text style={[s.bomHeadCell, { flex: 1.2 }]}>Discip.</Text>
                <Text style={[s.bomHeadCell, { flex: 0.7, textAlign: "center" }]}>Qtd</Text>
                <Text style={[s.bomHeadCell, { flex: 0.7, textAlign: "center" }]}>Un.</Text>
                <Text style={[s.bomHeadCell, { flex: 1.3, textAlign: "right" }]}>Unit. R$</Text>
                <Text style={[s.bomHeadCell, { flex: 1.3, textAlign: "right" }]}>Total R$</Text>
              </View>
              {(cat.items || []).map((it: any, ii: number) => (
                <View key={ii} style={[s.bomRow, ii % 2 ? { backgroundColor: "#fafafa" } : {}]} wrap={false}>
                  <Text style={[s.bomCell, { flex: 1, fontFamily: "IBMPlexMono" }]}>{it.code}</Text>
                  <Text style={[s.bomCell, { flex: 4 }]}>{it.description}</Text>
                  <Text style={[s.bomCell, { flex: 1.2 }]}>{it.discipline || "-"}</Text>
                  <Text style={[s.bomCell, { flex: 0.7, textAlign: "center" }]}>{it.quantity}</Text>
                  <Text style={[s.bomCell, { flex: 0.7, textAlign: "center" }]}>{it.unit}</Text>
                  <Text style={[s.bomCell, { flex: 1.3, textAlign: "right" }]}>{it.unitPrice}</Text>
                  <Text style={[s.bomCell, { flex: 1.3, textAlign: "right", fontWeight: "bold" }]}>{it.total}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {bom.totals?.length ? (
          <View style={{ borderWidth: 1, borderColor: "#ddd", marginTop: 4 }} wrap={false}>
            {bom.totals.map((t: any, ti: number) => (
              <View
                key={ti}
                style={[
                  s.bomTotalsRow,
                  t.highlight
                    ? { backgroundColor: brand.primary }
                    : { backgroundColor: "#f9fafb" },
                ]}
              >
                <Text style={[s.bomTotalCell, { flex: 6, color: t.highlight ? "#fff" : "#0f1419" }]}>{t.label}</Text>
                <Text style={[s.bomTotalCell, { flex: 2, textAlign: "right", color: t.highlight ? "#fff" : "#0f1419" }]}>{t.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <PageFooter d={data} s={s} />
      </Page>

      {/* PÁGINA 3 — DESCRIÇÃO TÉCNICA DOS SUBSISTEMAS */}
      {subsystems.length > 0 && (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <View style={s.sectionBar}>
            <Text>
              <Text style={s.sectionNum}>// 04</Text>
              <Text style={s.sectionLabel}>DESCRIÇÃO TÉCNICA DOS SUBSISTEMAS</Text>
            </Text>
            <Text style={s.sectionMeta}>{subsystems.length} subsistemas</Text>
          </View>
          <Text style={[s.body, { marginBottom: 8 }]}>
            A solução é decomposta nos subsistemas técnicos descritos a seguir. Cada subsistema apresenta objetivo funcional, descrição de arquitetura, componentes principais, parâmetros técnicos quantitativos, normas aplicáveis e interfaces — garantindo rastreabilidade de engenharia.
          </Text>

          {subsystems.map((ss, si) => (
            <View key={si} style={s.ssCard} wrap={true}>
              <View style={s.ssHeader} wrap={false}>
                <Text>
                  <Text style={s.ssCode}>{ss.code} </Text>
                  <Text style={s.ssName}>{ss.name}</Text>
                </Text>
                <Text style={s.ssDiscipline}>{ss.discipline}</Text>
              </View>
              <View style={s.ssBody}>
                <Text style={s.ssObjective}>
                  <Text style={{ fontWeight: "bold", color: brand.primary }}>Objetivo: </Text>
                  {ss.objective}
                </Text>
                <Text style={s.ssDesc}>{ss.description}</Text>

                {ss.components?.length ? (
                  <>
                    <Text style={s.ssSubLabel}>Componentes principais</Text>
                    <View style={s.ssTable} wrap={false}>
                      <View style={s.ssTableHead}>
                        <Text style={[s.ssTableHeadCell, { flex: 2.2 }]}>Componente</Text>
                        <Text style={[s.ssTableHeadCell, { flex: 3.5 }]}>Especificação</Text>
                        <Text style={[s.ssTableHeadCell, { flex: 3, borderRightWidth: 0 }]}>Função</Text>
                      </View>
                      {ss.components.map((c, ci) => (
                        <View key={ci} style={s.ssTableRow} wrap={false}>
                          <Text style={[s.ssTableCell, { flex: 2.2, fontWeight: "bold" }]}>{c.name}</Text>
                          <Text style={[s.ssTableCell, { flex: 3.5 }]}>{c.specification}</Text>
                          <Text style={[s.ssTableCell, { flex: 3, color: "#555", borderRightWidth: 0 }]}>{c.function}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}

                {ss.technicalParams?.length ? (
                  <>
                    <Text style={s.ssSubLabel}>Parâmetros técnicos</Text>
                    <View style={{ borderWidth: 1, borderColor: "#eee" }} wrap={false}>
                      {ss.technicalParams.map((p, pi) => (
                        <View key={pi} style={s.ssParamRow} wrap={false}>
                          <Text style={s.ssParamLabel}>{p.label}</Text>
                          <Text style={s.ssParamValue}>{p.value}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}

                {ss.standards?.length ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6, alignItems: "center" }}>
                    <Text style={[s.ssSubLabel, { marginTop: 0, marginRight: 6 }]}>Normas:</Text>
                    {ss.standards.map((std, sti) => (
                      <Text key={sti} style={s.ssBadge}>{std}</Text>
                    ))}
                  </View>
                ) : null}

                {ss.interfaces ? (
                  <Text style={s.ssInterfaces}>
                    <Text style={{ fontWeight: "bold", color: brand.primary }}>Interfaces: </Text>
                    {ss.interfaces}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
          <PageFooter d={data} s={s} />
        </Page>
      )}

      {/* PÁGINA 4 — CRONOGRAMA + RISCOS + ROI + ACEITE */}
      <Page size="A4" style={s.page}>
        <PageHeader d={data} s={s} />
        <View style={s.sectionBar}>
          <Text>
            <Text style={s.sectionNum}>// 06–10</Text>
            <Text style={s.sectionLabel}>CRONOGRAMA · RISCOS · ROI · ACEITE</Text>
          </Text>
          <Text style={s.sectionMeta}>{m.docId} · REV.{m.version}</Text>
        </View>

        <Text style={{ fontSize: 11, fontWeight: "bold", color: brand.primary, marginBottom: 4 }}>
          // 06 · CRONOGRAMA — {sched.totalWeeks} SEMANAS
        </Text>
        <View style={s.schedTable} wrap={false}>
          <View style={s.schedHead}>
            <Text style={[s.schedHeadCell, { flex: 2.5, textAlign: "left" }]}>Fase / Responsável</Text>
            {Array.from({ length: sched.totalWeeks }, (_, i) => (
              <Text key={i} style={[s.schedHeadCell, { flex: weekFlex * 4 }]}>S{i + 1}</Text>
            ))}
            <Text style={[s.schedHeadCell, { flex: 2.5, textAlign: "left", borderRightWidth: 0 }]}>Marcos</Text>
          </View>
          {sched.phases.map((p, pi) => (
            <View key={pi} style={s.schedRow}>
              <View style={[s.schedCell, { flex: 2.5 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 7 }}>{p.name}</Text>
                <Text style={{ fontSize: 6, color: "#666" }}>{p.responsible}</Text>
              </View>
              {Array.from({ length: sched.totalWeeks }, (_, i) => {
                const wk = i + 1;
                const active = wk >= p.startWeek && wk <= p.endWeek;
                return (
                  <View
                    key={i}
                    style={[
                      s.schedCell,
                      { flex: weekFlex * 4, backgroundColor: active ? brand.secondary : "transparent", alignItems: "center" },
                    ]}
                  />
                );
              })}
              <Text style={[s.schedCell, { flex: 2.5, fontSize: 6, borderRightWidth: 0 }]}>{p.milestones}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 11, fontWeight: "bold", color: brand.primary, marginTop: 12, marginBottom: 4 }}>
          // 08 · MATRIZ DE RISCOS
        </Text>
        <View style={{ borderWidth: 1, borderColor: "#ddd" }} wrap={true}>
          <View style={s.riskHead}>
            <Text style={[s.bomHeadCell, { flex: 1 }]}>Nível</Text>
            <Text style={[s.bomHeadCell, { flex: 1.4 }]}>Categoria</Text>
            <Text style={[s.bomHeadCell, { flex: 3 }]}>Descrição</Text>
            <Text style={[s.bomHeadCell, { flex: 0.9, textAlign: "center" }]}>Prob.</Text>
            <Text style={[s.bomHeadCell, { flex: 0.9, textAlign: "center" }]}>Impacto</Text>
            <Text style={[s.bomHeadCell, { flex: 3, borderRightWidth: 0 }]}>Mitigação</Text>
          </View>
          {risks.map((r, ri) => (
            <View key={ri} style={[s.bomRow, { backgroundColor: riskBg(r.level) }]} wrap={false}>
              <View style={[s.bomCell, { flex: 1, justifyContent: "center" }]}>
                <Text
                  style={{
                    backgroundColor: riskBadge(r.level), color: "#fff", fontSize: 6,
                    fontWeight: "bold", paddingHorizontal: 4, paddingVertical: 1, alignSelf: "flex-start",
                  }}
                >
                  {r.level}
                </Text>
              </View>
              <Text style={[s.bomCell, { flex: 1.4 }]}>{r.category}</Text>
              <Text style={[s.bomCell, { flex: 3 }]}>{r.description}</Text>
              <Text style={[s.bomCell, { flex: 0.9, textAlign: "center" }]}>{r.probability}</Text>
              <Text style={[s.bomCell, { flex: 0.9, textAlign: "center" }]}>{r.impact}</Text>
              <Text style={[s.bomCell, { flex: 3, borderRightWidth: 0 }]}>{r.mitigation}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 11, fontWeight: "bold", color: brand.primary, marginTop: 12, marginBottom: 4 }}>
          // 07 · ANÁLISE DE ROI — CENÁRIOS
        </Text>
        <View style={{ borderWidth: 1, borderColor: "#ddd" }} wrap={false}>
          <View style={s.riskHead}>
            <Text style={[s.bomHeadCell, { flex: 1.2 }]}>Cenário</Text>
            <Text style={[s.bomHeadCell, { flex: 1.3 }]}>CAPEX</Text>
            <Text style={[s.bomHeadCell, { flex: 1.5 }]}>Benefício Anual</Text>
            <Text style={[s.bomHeadCell, { flex: 1.2 }]}>Payback</Text>
            <Text style={[s.bomHeadCell, { flex: 3, borderRightWidth: 0 }]}>Premissa</Text>
          </View>
          {roi.map((r, ri) => (
            <View key={ri} style={s.bomRow} wrap={false}>
              <Text style={[s.bomCell, { flex: 1.2, fontWeight: "bold" }]}>
                {r.scenario}{r.scenario === "Base" ? "  ★" : ""}
              </Text>
              <Text style={[s.bomCell, { flex: 1.3 }]}>{r.capex}</Text>
              <Text style={[s.bomCell, { flex: 1.5 }]}>{r.annualBenefit}</Text>
              <Text style={[s.bomCell, { flex: 1.2 }]}>{r.paybackMonths}</Text>
              <Text style={[s.bomCell, { flex: 3, borderRightWidth: 0 }]}>{r.assumption}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 11, fontWeight: "bold", color: brand.primary, marginTop: 16, marginBottom: 4 }}>
          // 10 · ACEITE E ASSINATURAS
        </Text>
        <View style={s.acceptRow} wrap={false}>
          <View style={s.acceptBox}>
            <Text style={s.acceptLabel}>CONTRATANTE — {(acc.contractor?.label || m.clientName).toUpperCase()}</Text>
            <Text style={s.acceptLine}>Nome: {acc.contractor?.name || "_______________________________"}</Text>
            <Text style={s.acceptLine}>Cargo: {acc.contractor?.title || "_______________________________"}</Text>
            <Text style={s.acceptLine}>CPF/CNPJ: {acc.contractor?.cnpj || "_______________________"}</Text>
            <View style={s.sigSpace} />
            <Text style={s.sigCaption}>Assinatura · Data: ___/___/______</Text>
          </View>
          <View style={s.acceptBox}>
            <Text style={s.acceptLabel}>CONTRATADA — {(acc.contracted?.label || m.companyName).toUpperCase()}</Text>
            <Text style={s.acceptLine}>Nome: {acc.contracted?.name || "_______________________________"}</Text>
            <Text style={s.acceptLine}>Cargo: {acc.contracted?.title || "_______________________________"}</Text>
            <Text style={s.acceptLine}>
              CREA/CPF: {acc.contracted?.crea || acc.contracted?.cnpj || "_______________________"}
            </Text>
            <View style={s.sigSpace} />
            <Text style={s.sigCaption}>Assinatura · Data: ___/___/______</Text>
          </View>
        </View>

        <PageFooter d={data} s={s} />
      </Page>
    </Document>
  );
};
