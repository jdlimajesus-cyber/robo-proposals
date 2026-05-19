import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { StructuredProposalData } from "@/types/project";

Font.register({
  family: "IBMPlex",
  fonts: [
    { src: "https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKhdHeFaxOedfTDw.ttf" },
    { src: "https://fonts.gstatic.com/s/ibmplexsans/v19/zYX9KVElMYYaJe8bpLHnCwDKjQ76AIRZ91U.ttf", fontWeight: "bold" },
  ],
});
Font.register({
  family: "IBMPlexMono",
  fonts: [
    { src: "https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n5igg1l9kn-s.ttf" },
    { src: "https://fonts.gstatic.com/s/ibmplexmono/v19/-F6qfjptAgt5VM-kVkqdyU8n3pAL21thg5xg.ttf", fontWeight: "bold" },
  ],
});
Font.registerHyphenationCallback((w) => [w]);

interface BrandColors { primary: string; secondary: string; accent?: string }

const build = (b: BrandColors) =>
  StyleSheet.create({
    page: { paddingTop: 36, paddingBottom: 44, paddingHorizontal: 32, backgroundColor: "#fff", fontFamily: "IBMPlex", fontSize: 9, color: "#0f1419", lineHeight: 1.45 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingBottom: 6, marginBottom: 12 },
    brand: { fontWeight: "bold", fontSize: 14, color: b.primary },
    tagline: { fontFamily: "IBMPlexMono", fontSize: 7, color: "#666" },
    metaRight: { fontFamily: "IBMPlexMono", fontSize: 7, color: "#444", textAlign: "right" },
    sectionBar: { backgroundColor: b.primary, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, paddingHorizontal: 12, marginBottom: 10 },
    sectionLabel: { color: "#fff", fontWeight: "bold", fontSize: 11, letterSpacing: 0.5 },
    sectionNum: { color: b.secondary, fontFamily: "IBMPlexMono", fontSize: 9, marginRight: 6 },
    sectionMeta: { fontFamily: "IBMPlexMono", fontSize: 7, color: "#fff" },
    h3: { color: b.primary, fontWeight: "bold", fontSize: 11, marginTop: 10, marginBottom: 4 },
    h4: { color: b.primary, fontWeight: "bold", fontSize: 9, marginTop: 8, marginBottom: 3 },
    body: { fontSize: 9, lineHeight: 1.55, textAlign: "justify", marginBottom: 6 },
    li: { fontSize: 8.5, marginBottom: 2, paddingLeft: 8 },
    infoBox: { backgroundColor: "#f8fafc", borderLeftWidth: 3, borderLeftColor: b.primary, padding: 8, marginVertical: 6 },
    infoLabel: { fontWeight: "bold", fontSize: 8, color: b.primary, marginBottom: 3, letterSpacing: 0.4 },
    infoText: { fontSize: 8.5, lineHeight: 1.5 },
    warn: { backgroundColor: "#fef9e7", borderLeftColor: "#d97706" },
    warnLabel: { color: "#92400e" },
    danger: { backgroundColor: "#fee2e2", borderLeftColor: "#dc2626" },
    dangerLabel: { color: "#dc2626" },
    coverFrame: { borderWidth: 2, borderColor: b.primary, padding: 22, flexGrow: 1 },
    coverDocLine: { fontFamily: "IBMPlexMono", fontSize: 8, color: "#666", marginBottom: 4 },
    coverTitle: { fontWeight: "bold", fontSize: 24, color: b.primary, marginBottom: 6 },
    coverSubtitle: { fontSize: 11, color: "#444", marginBottom: 16 },
    specsTable: { borderWidth: 1, borderColor: "#e5e7eb", marginVertical: 10 },
    specsRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee" },
    specsLabel: { width: "25%", padding: 5, fontWeight: "bold", color: "#555", fontSize: 8, backgroundColor: "#f8fafc", borderRightWidth: 1, borderRightColor: "#eee" },
    specsValue: { width: "25%", padding: 5, fontSize: 8, borderRightWidth: 1, borderRightColor: "#eee" },
    clientBox: { backgroundColor: "#f8fafc", borderLeftWidth: 4, borderLeftColor: b.primary, padding: 12, marginTop: 14 },
    clientLabel: { fontSize: 7, color: "#666", letterSpacing: 0.5, marginBottom: 3 },
    clientName: { fontWeight: "bold", fontSize: 13, color: b.primary },
    confidential: { textAlign: "center", color: "#dc2626", fontWeight: "bold", fontSize: 8, letterSpacing: 1, marginTop: 12 },
    metricsRow: { flexDirection: "row", marginVertical: 8, gap: 6 },
    metricCard: { flex: 1, padding: 8, backgroundColor: "#f8fafc", borderLeftWidth: 3, borderLeftColor: b.secondary },
    metricLabel: { fontSize: 6.5, color: "#666", textTransform: "uppercase", marginBottom: 2 },
    metricValue: { fontSize: 12, fontWeight: "bold", color: b.primary },
    twoCol: { flexDirection: "row", gap: 8, marginVertical: 6 },
    twoColBox: { flex: 1, padding: 8, backgroundColor: "#f8fafc", borderLeftWidth: 3 },
    twoColLabel: { fontSize: 8, fontWeight: "bold", marginBottom: 3 },
    flowRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", padding: 8, backgroundColor: "#f8fafc", marginVertical: 6, gap: 3 },
    flowStep: { flexDirection: "row", alignItems: "center", marginRight: 4, marginBottom: 4 },
    flowCircle: { backgroundColor: b.primary, color: "#fff", width: 20, height: 20, borderRadius: 10, textAlign: "center", fontSize: 9, fontWeight: "bold", paddingTop: 4 },
    flowLabel: { fontSize: 8, fontWeight: "bold", color: b.primary, marginLeft: 3, marginRight: 3 },
    flowArrow: { color: b.secondary, fontSize: 11 },
    altCard: { marginVertical: 6, padding: 10, borderWidth: 1, borderColor: "#e5e7eb", borderLeftWidth: 4 },
    altRecommended: { borderLeftColor: b.secondary, backgroundColor: "#fef9e7" },
    table: { borderWidth: 1, borderColor: "#ddd", marginVertical: 6 },
    thead: { flexDirection: "row", backgroundColor: b.primary },
    th: { color: "#fff", fontWeight: "bold", fontSize: 7.5, padding: 4, borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.2)" },
    tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", minHeight: 16 },
    td: { fontSize: 7.5, padding: 4, borderRightWidth: 1, borderRightColor: "#eee" },
    bomCatHeader: { backgroundColor: "#eef2f6", padding: 5, fontWeight: "bold", color: b.primary, fontSize: 9, borderWidth: 1, borderColor: "#ddd", marginTop: 6 },
    badge: { backgroundColor: "#eef2f6", color: b.primary, fontSize: 7, fontFamily: "IBMPlexMono", paddingHorizontal: 5, paddingVertical: 1, marginRight: 4, marginBottom: 3, borderWidth: 0.5, borderColor: "#d1dce8" },
    ssCard: { borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 8 },
    ssHeader: { backgroundColor: b.primary, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5, paddingHorizontal: 10 },
    ssCode: { color: b.secondary, fontFamily: "IBMPlexMono", fontSize: 8 },
    ssName: { color: "#fff", fontWeight: "bold", fontSize: 10 },
    ssDiscipline: { color: "#fff", fontFamily: "IBMPlexMono", fontSize: 7 },
    ssBody: { padding: 8 },
    sigBox: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", padding: 10 },
    sigLabel: { fontSize: 8, fontWeight: "bold", color: b.primary, marginBottom: 6 },
    sigLine: { fontSize: 8, marginVertical: 2 },
    sigSpace: { borderBottomWidth: 1, borderBottomColor: "#333", marginTop: 24, height: 1 },
    footer: { position: "absolute", bottom: 18, left: 32, right: 32, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 5 },
    footerBrand: { fontWeight: "bold", fontSize: 7, color: b.primary },
    footerMeta: { fontFamily: "IBMPlexMono", fontSize: 7, color: "#666" },
    metricBig: { padding: 12, backgroundColor: "#f8fafc", borderTopWidth: 3, borderTopColor: b.secondary, alignItems: "center", flex: 1 },
    metricBigLabel: { fontSize: 8, color: "#666", textTransform: "uppercase" },
    metricBigValue: { fontSize: 18, fontWeight: "bold", color: b.primary, marginTop: 4 },
  });

const Bul = ({ items, s }: { items?: string[]; s: any }) =>
  items?.length ? (
    <View style={{ marginVertical: 3 }}>
      {items.map((it, i) => (
        <Text key={i} style={s.li}>• {it}</Text>
      ))}
    </View>
  ) : null;

const InfoBox = ({ label, children, s, kind }: any) => (
  <View style={[s.infoBox, kind === "warn" ? s.warn : kind === "danger" ? s.danger : null]} wrap={false}>
    <Text style={[s.infoLabel, kind === "warn" ? s.warnLabel : kind === "danger" ? s.dangerLabel : null]}>{label}</Text>
    <Text style={s.infoText}>{children}</Text>
  </View>
);

const SectionBar = ({ num, title, meta, s }: any) => (
  <View style={s.sectionBar}>
    <Text>
      <Text style={s.sectionNum}>// {num}</Text>
      <Text style={s.sectionLabel}>{title}</Text>
    </Text>
    <Text style={s.sectionMeta}>{meta}</Text>
  </View>
);

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
    <Text style={s.footerMeta} render={({ pageNumber, totalPages }: any) => `DOC: ${d.meta.docId} · REV.${d.meta.version} · ${d.meta.confidential ? "CONFIDENCIAL · " : ""}PÁG. ${pageNumber}/${totalPages}`} />
  </View>
);

export const AxizProposalDocument = ({ data, brand }: { data: StructuredProposalData; brand: BrandColors }) => {
  const s = build(brand);
  const m = data.meta;
  const specs = data.specs || [];
  const specPairs: any[] = [];
  for (let i = 0; i < specs.length; i += 2) specPairs.push([specs[i], specs[i + 1]]);

  const exec = data.executive || ({} as any);
  const ctx = data.context;
  const alts = data.alternatives || [];
  const sol = data.solution;
  const subs = data.subsystems || [];
  const scope = data.scopeDetail;
  const res = data.resources || [];
  const bom = data.bom || ({ categories: [], totals: [] } as any);
  const cs = data.costSummary;
  const sched = data.schedule || { totalWeeks: 6, phases: [] };
  const risks = data.risks || [];
  const ac = data.acceptanceCriteria || [];
  const dtc = data.dataToConfirm || [];
  const cv = data.conceptualVisualization || [];
  const roiA = data.roiAnalysis;
  const roi = data.roi || [];
  const safety = data.safetyAnalysis;
  const elec = data.electricalSpecs;
  const ec = data.executiveControl;
  const acc = data.acceptance || ({ contractor: { label: m.clientName }, contracted: { label: m.companyName } } as any);

  const riskBg = (lvl: string) => (lvl === "ALTO" ? "#fee2e2" : lvl === "MEDIO" ? "#fef9e7" : "#eafaf1");
  const riskBadge = (lvl: string) => (lvl === "ALTO" ? "#dc2626" : lvl === "MEDIO" ? "#d97706" : "#16a34a");

  return (
    <Document title={m.title} author={m.companyName} subject={m.status}>
      {/* CAPA */}
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
            {m.clientLegalName ? <Text style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{m.clientLegalName}{m.clientCnpj ? ` · CNPJ ${m.clientCnpj}` : ""}</Text> : null}
          </View>
          {m.confidential ? <Text style={s.confidential}>CONFIDENCIAL · USO RESTRITO</Text> : null}
        </View>
        <PageFooter d={data} s={s} />
      </Page>

      {/* 1. APRESENTAÇÃO EXECUTIVA */}
      <Page size="A4" style={s.page}>
        <PageHeader d={data} s={s} />
        <SectionBar num="01" title="APRESENTAÇÃO EXECUTIVA" meta={`${m.docId} · ${m.date}`} s={s} />
        <Text style={s.body}>{exec.summary}</Text>
        {exec.note ? <InfoBox label="DESTAQUE DA PROPOSTA" s={s}>{exec.note}</InfoBox> : null}
        {exec.headlineMetrics?.length ? (
          <View style={s.metricsRow} wrap={false}>
            {exec.headlineMetrics.slice(0, 4).map((h, i) => (
              <View key={i} style={s.metricCard}>
                <Text style={s.metricLabel}>{h.label}</Text>
                <Text style={s.metricValue}>{h.value}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <PageFooter d={data} s={s} />
      </Page>

      {/* 2. CONTEXTO E PREMISSAS */}
      {ctx ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="02" title="CONTEXTO E PREMISSAS DO PROJETO" meta={m.docId} s={s} />
          <Text style={s.h3}>2.1 Análise da Necessidade do Cliente</Text>
          <Text style={s.body}>{ctx.needAnalysis}</Text>
          <View style={s.twoCol} wrap={false}>
            <View style={[s.twoColBox, { borderLeftColor: brand.primary }]}>
              <Text style={[s.twoColLabel, { color: brand.primary }]}>FATO</Text>
              <Text style={{ fontSize: 8.5 }}>{ctx.fato}</Text>
            </View>
            <View style={[s.twoColBox, { borderLeftColor: brand.secondary }]}>
              <Text style={[s.twoColLabel, { color: brand.secondary }]}>PREMISSA</Text>
              <Text style={{ fontSize: 8.5 }}>{ctx.premissa}</Text>
            </View>
          </View>
          <InfoBox label="HIPÓTESE DE NEGÓCIO" s={s}>{ctx.hipotese}</InfoBox>
          <Text style={s.h3}>2.2 Premissas de Projeto</Text>
          <Bul items={ctx.premisesList} s={s} />
          <Text style={s.h3}>2.3 Fluxo de Processo Conceitual</Text>
          <View style={s.flowRow}>
            {ctx.processFlow.map((st, i) => (
              <React.Fragment key={i}>
                <View style={s.flowStep}>
                  <Text style={s.flowCircle}>{st.step}</Text>
                  <Text style={s.flowLabel}>{st.label}</Text>
                </View>
                {i < ctx.processFlow.length - 1 ? <Text style={s.flowArrow}>→</Text> : null}
              </React.Fragment>
            ))}
          </View>
          <Text style={s.body}>{ctx.flowDescription}</Text>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 3. ALTERNATIVAS */}
      {alts.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="03" title="ANÁLISE DE ALTERNATIVAS TECNOLÓGICAS" meta={`${alts.length} cenários`} s={s} />
          {alts.map((a, i) => (
            <View key={i} style={[s.altCard, a.recommended ? s.altRecommended : null]} wrap={true}>
              <Text style={[s.h4, { marginTop: 0 }]}>{a.code} — {a.name}{a.recommended ? " · RECOMENDADA" : ""}</Text>
              <Text style={[s.body, { marginBottom: 4 }]}>{a.description}</Text>
              <View style={s.twoCol}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.h4, { color: "#16a34a", marginTop: 0 }]}>Vantagens</Text>
                  <Bul items={a.advantages} s={s} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.h4, { color: "#dc2626", marginTop: 0 }]}>Desvantagens</Text>
                  <Bul items={a.disadvantages} s={s} />
                </View>
              </View>
              <Text style={{ fontSize: 8, color: "#555" }}>
                <Text style={{ fontWeight: "bold" }}>Risco operacional: </Text>{a.operationalRisk}
                {a.qualityRisk ? <Text> · <Text style={{ fontWeight: "bold" }}>Risco qualidade: </Text>{a.qualityRisk}</Text> : null}
              </Text>
            </View>
          ))}
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 4. SOLUÇÃO RECOMENDADA */}
      {sol ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="04" title="SOLUÇÃO RECOMENDADA" meta={m.docId} s={s} />
          <Text style={s.body}>{sol.architectureDescription}</Text>
          {sol.technicalDetails?.map((td, i) => (
            <View key={i} wrap={true}>
              <Text style={s.h4}>{td.title}</Text>
              {td.paragraphs.map((p, pi) => <Text key={pi} style={s.body}>{p}</Text>)}
              {td.calculations?.map((c, ci) => (
                <InfoBox key={ci} label={c.label} s={s}>{c.lines.join("\n")}</InfoBox>
              ))}
              <Bul items={td.bullets} s={s} />
            </View>
          ))}
          <Text style={s.h3}>Especificações dos Equipamentos</Text>
          {sol.equipmentSpecs?.map((e, i) => (
            <View key={i} wrap={false}>
              <Text style={s.h4}>{e.name}</Text>
              <Bul items={e.bullets} s={s} />
            </View>
          ))}
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 4.A SUBSISTEMAS */}
      {subs.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="04.A" title="DESCRIÇÃO TÉCNICA DOS SUBSISTEMAS" meta={`${subs.length} subsistemas`} s={s} />
          {subs.map((ss, si) => (
            <View key={si} style={s.ssCard} wrap={true}>
              <View style={s.ssHeader} wrap={false}>
                <Text>
                  <Text style={s.ssCode}>{ss.code} </Text>
                  <Text style={s.ssName}>{ss.name}</Text>
                </Text>
                <Text style={s.ssDiscipline}>{ss.discipline}</Text>
              </View>
              <View style={s.ssBody}>
                <Text style={{ fontSize: 8, color: "#444", marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold", color: brand.primary }}>Objetivo: </Text>{ss.objective}
                </Text>
                <Text style={{ fontSize: 8.5, lineHeight: 1.5, textAlign: "justify", marginBottom: 5 }}>{ss.description}</Text>
                {ss.components?.length ? (
                  <>
                    <Text style={{ fontSize: 7, fontWeight: "bold", color: brand.primary, marginTop: 4, marginBottom: 2 }}>COMPONENTES PRINCIPAIS</Text>
                    <View style={s.table} wrap={false}>
                      <View style={s.thead}>
                        <Text style={[s.th, { flex: 2 }]}>Componente</Text>
                        <Text style={[s.th, { flex: 3 }]}>Especificação</Text>
                        <Text style={[s.th, { flex: 3, borderRightWidth: 0 }]}>Função</Text>
                      </View>
                      {ss.components.map((c, ci) => (
                        <View key={ci} style={s.tr} wrap={false}>
                          <Text style={[s.td, { flex: 2, fontWeight: "bold" }]}>{c.name}</Text>
                          <Text style={[s.td, { flex: 3 }]}>{c.specification}</Text>
                          <Text style={[s.td, { flex: 3, color: "#555", borderRightWidth: 0 }]}>{c.function}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}
                {ss.technicalParams?.length ? (
                  <>
                    <Text style={{ fontSize: 7, fontWeight: "bold", color: brand.primary, marginTop: 4, marginBottom: 2 }}>PARÂMETROS</Text>
                    <View style={s.table} wrap={false}>
                      {ss.technicalParams.map((p, pi) => (
                        <View key={pi} style={s.tr} wrap={false}>
                          <Text style={[s.td, { flex: 1, fontWeight: "bold", color: "#555", backgroundColor: "#f8fafc" }]}>{p.label}</Text>
                          <Text style={[s.td, { flex: 1, borderRightWidth: 0 }]}>{p.value}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}
                {ss.standards?.length ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4, alignItems: "center" }}>
                    <Text style={{ fontSize: 7, fontWeight: "bold", color: brand.primary, marginRight: 4 }}>NORMAS:</Text>
                    {ss.standards.map((std, sti) => <Text key={sti} style={s.badge}>{std}</Text>)}
                  </View>
                ) : null}
                {ss.interfaces ? (
                  <Text style={{ marginTop: 4, padding: 5, backgroundColor: "#f8fafc", borderLeftWidth: 3, borderLeftColor: brand.secondary, fontSize: 8 }}>
                    <Text style={{ fontWeight: "bold", color: brand.primary }}>Interfaces: </Text>{ss.interfaces}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 5. ESCOPO */}
      {scope ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="05" title="ESCOPO TÉCNICO DETALHADO" meta={m.docId} s={s} />
          <Text style={s.h3}>5.1 Fornecimento de Equipamentos</Text>
          {scope.suppliedEquipment?.map((e, i) => (
            <View key={i} wrap={false}>
              <Text style={s.h4}>{e.name}</Text>
              <Bul items={e.bullets} s={s} />
            </View>
          ))}
          <Text style={s.h3}>5.2 Serviços Inclusos</Text>
          <Bul items={scope.servicesIncluded} s={s} />
          <Text style={s.h3}>5.3 Itens Não Inclusos</Text>
          <Bul items={scope.itemsNotIncluded} s={s} />
          {scope.cybersecurity ? (
            <>
              <Text style={s.h3}>5.4 Cibersegurança (OT/IT)</Text>
              <Text style={s.h4}>Rede de Automação (OT)</Text>
              <Bul items={scope.cybersecurity.otNetwork} s={s} />
              <Text style={s.h4}>Rede de Dados (IT)</Text>
              <Bul items={scope.cybersecurity.itNetwork} s={s} />
              <Text style={s.h4}>Medidas de Cibersegurança</Text>
              <Bul items={scope.cybersecurity.measures} s={s} />
              {scope.cybersecurity.riskNote ? <InfoBox label="RISCO CIBERNÉTICO" s={s} kind="warn">{scope.cybersecurity.riskNote}</InfoBox> : null}
            </>
          ) : null}
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 6. CRONOGRAMA */}
      <Page size="A4" style={s.page}>
        <PageHeader d={data} s={s} />
        <SectionBar num="06" title={`CRONOGRAMA — ${sched.totalWeeks} SEMANAS`} meta={`${sched.phases.length} fases`} s={s} />
        <View style={s.table} wrap={false}>
          <View style={s.thead}>
            <Text style={[s.th, { flex: 3 }]}>Fase / Responsável</Text>
            {Array.from({ length: sched.totalWeeks }, (_, i) => (
              <Text key={i} style={[s.th, { flex: 1, textAlign: "center", fontSize: 6 }]}>S{i + 1}</Text>
            ))}
            <Text style={[s.th, { flex: 3, borderRightWidth: 0 }]}>Marcos</Text>
          </View>
          {sched.phases.map((p, pi) => (
            <View key={pi} style={s.tr}>
              <View style={[s.td, { flex: 3 }]}>
                <Text style={{ fontWeight: "bold", fontSize: 7 }}>{p.name}</Text>
                <Text style={{ fontSize: 6, color: "#666" }}>{p.responsible}</Text>
              </View>
              {Array.from({ length: sched.totalWeeks }, (_, i) => {
                const wk = i + 1;
                const active = wk >= p.startWeek && wk <= p.endWeek;
                return <View key={i} style={[s.td, { flex: 1, backgroundColor: active ? brand.secondary : "transparent" }]} />;
              })}
              <Text style={[s.td, { flex: 3, fontSize: 6, borderRightWidth: 0 }]}>{p.milestones}</Text>
            </View>
          ))}
        </View>
        <PageFooter d={data} s={s} />
      </Page>

      {/* 7. RECURSOS */}
      {res.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="07" title="RECURSOS NECESSÁRIOS" meta={`${res.length} áreas`} s={s} />
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 2 }]}>Área</Text>
              <Text style={[s.th, { flex: 3 }]}>Recursos Alocados</Text>
              <Text style={[s.th, { flex: 3, borderRightWidth: 0 }]}>Perfil</Text>
            </View>
            {res.map((r, ri) => (
              <View key={ri} style={s.tr} wrap={false}>
                <Text style={[s.td, { flex: 2, fontWeight: "bold" }]}>{r.area}</Text>
                <Text style={[s.td, { flex: 3 }]}>{r.allocated}</Text>
                <Text style={[s.td, { flex: 3, borderRightWidth: 0 }]}>{r.profile}</Text>
              </View>
            ))}
          </View>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 8. ESTIMATIVA DE CUSTOS */}
      {cs ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="08" title="ESTIMATIVA DE CUSTOS" meta={m.docId} s={s} />
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 0.6 }]}>Item</Text>
              <Text style={[s.th, { flex: 3.5 }]}>Descrição</Text>
              <Text style={[s.th, { flex: 1.8, textAlign: "right" }]}>Valor (R$)</Text>
              <Text style={[s.th, { flex: 2.5, borderRightWidth: 0 }]}>Observações</Text>
            </View>
            {cs.items.map((it, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={[s.td, { flex: 0.6, fontWeight: "bold" }]}>{it.code}</Text>
                <Text style={[s.td, { flex: 3.5 }]}>{it.description}</Text>
                <Text style={[s.td, { flex: 1.8, textAlign: "right", fontWeight: "bold" }]}>{it.value}</Text>
                <Text style={[s.td, { flex: 2.5, color: "#555", borderRightWidth: 0, fontSize: 7 }]}>{it.observations}</Text>
              </View>
            ))}
            <View style={[s.tr, { backgroundColor: brand.primary }]}>
              <Text style={[s.td, { flex: 4.1, color: "#fff", fontWeight: "bold" }]}>TOTAL GERAL ESTIMADO</Text>
              <Text style={[s.td, { flex: 1.8, color: "#fff", fontWeight: "bold", textAlign: "right" }]}>{cs.total}</Text>
              <Text style={[s.td, { flex: 2.5, color: "#fff", borderRightWidth: 0 }]}>Base engenharia básica</Text>
            </View>
          </View>
          {cs.composition?.length ? (
            <>
              <Text style={s.h3}>Composição de Custos</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {cs.composition.map((c, i) => (
                  <View key={i} style={{ width: "48%", padding: 6, borderWidth: 1, borderColor: "#e5e7eb", borderLeftWidth: 3, borderLeftColor: brand.secondary, marginBottom: 4 }} wrap={false}>
                    <Text style={{ fontSize: 9, fontWeight: "bold", color: brand.primary }}>{c.label} <Text style={{ color: brand.secondary }}>{c.percentage}</Text></Text>
                    <Text style={{ fontSize: 7.5, color: "#555", marginTop: 2 }}>{c.description}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
          {cs.categoryDistribution?.length ? (
            <View style={{ marginTop: 8, padding: 8, backgroundColor: "#f8fafc" }}>
              <Text style={{ fontSize: 9, fontWeight: "bold", color: brand.primary, marginBottom: 4 }}>Distribuição por Categoria</Text>
              {cs.categoryDistribution.map((c, i) => {
                const pct = parseFloat(String(c.percentage).replace(/[^0-9.,]/g, "").replace(",", "."));
                const w = Math.min(100, Math.max(0, isFinite(pct) ? pct : 0));
                return (
                  <View key={i} style={{ flexDirection: "row", alignItems: "center", marginVertical: 2 }}>
                    <Text style={{ width: 130, fontSize: 7.5 }}>{c.label}</Text>
                    <View style={{ flex: 1, backgroundColor: "#e5e7eb", height: 8 }}>
                      <View style={{ width: `${w}%`, height: "100%", backgroundColor: brand.secondary }} />
                    </View>
                    <Text style={{ width: 40, textAlign: "right", fontSize: 7.5, fontWeight: "bold", marginLeft: 4 }}>{c.percentage}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}
          <InfoBox label="INFORMAÇÃO CRÍTICA" s={s} kind="danger">Esta estimativa é baseada em engenharia básica. Análise de detalhe é necessária para precisão de ±5%.</InfoBox>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 8.A BOM */}
      {bom.categories?.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="08.A" title="LISTA DE MATERIAIS — BOM DETALHADA" meta={`${bom.categories.length} categorias`} s={s} />
          {bom.categories.map((cat: any, ci: number) => (
            <View key={ci} wrap={true} style={{ marginBottom: 6 }}>
              <Text style={s.bomCatHeader}>{cat.code} — {cat.name}{cat.subtotal ? ` · SUBTOTAL: ${cat.subtotal}` : ""}</Text>
              <View style={s.table}>
                <View style={s.thead} fixed>
                  <Text style={[s.th, { flex: 1 }]}>Código</Text>
                  <Text style={[s.th, { flex: 4 }]}>Descrição</Text>
                  <Text style={[s.th, { flex: 1.2 }]}>Disc.</Text>
                  <Text style={[s.th, { flex: 0.7, textAlign: "center" }]}>Qtd</Text>
                  <Text style={[s.th, { flex: 0.7, textAlign: "center" }]}>Un.</Text>
                  <Text style={[s.th, { flex: 1.3, textAlign: "right" }]}>Unit.</Text>
                  <Text style={[s.th, { flex: 1.3, textAlign: "right", borderRightWidth: 0 }]}>Total</Text>
                </View>
                {(cat.items || []).map((it: any, ii: number) => (
                  <View key={ii} style={[s.tr, ii % 2 ? { backgroundColor: "#fafafa" } : null]} wrap={false}>
                    <Text style={[s.td, { flex: 1, fontFamily: "IBMPlexMono" }]}>{it.code}</Text>
                    <Text style={[s.td, { flex: 4 }]}>{it.description}</Text>
                    <Text style={[s.td, { flex: 1.2 }]}>{it.discipline || "-"}</Text>
                    <Text style={[s.td, { flex: 0.7, textAlign: "center" }]}>{it.quantity}</Text>
                    <Text style={[s.td, { flex: 0.7, textAlign: "center" }]}>{it.unit}</Text>
                    <Text style={[s.td, { flex: 1.3, textAlign: "right" }]}>{it.unitPrice}</Text>
                    <Text style={[s.td, { flex: 1.3, textAlign: "right", fontWeight: "bold", borderRightWidth: 0 }]}>{it.total}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
          {bom.totals?.length ? (
            <View style={s.table} wrap={false}>
              {bom.totals.map((t: any, ti: number) => (
                <View key={ti} style={[s.tr, t.highlight ? { backgroundColor: brand.primary } : { backgroundColor: "#f9fafb" }]}>
                  <Text style={[s.td, { flex: 6, color: t.highlight ? "#fff" : "#0f1419", fontWeight: "bold" }]}>{t.label}</Text>
                  <Text style={[s.td, { flex: 2, textAlign: "right", color: t.highlight ? "#fff" : "#0f1419", fontWeight: "bold", borderRightWidth: 0 }]}>{t.value}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 10. RISCOS */}
      {risks.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="10" title="GESTÃO DE RISCOS" meta={`${risks.length} riscos`} s={s} />
          <View style={s.table} wrap={true}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 0.8 }]}>Nível</Text>
              <Text style={[s.th, { flex: 1.4 }]}>Categoria</Text>
              <Text style={[s.th, { flex: 3 }]}>Descrição</Text>
              <Text style={[s.th, { flex: 0.8, textAlign: "center" }]}>Prob.</Text>
              <Text style={[s.th, { flex: 0.8, textAlign: "center" }]}>Impacto</Text>
              <Text style={[s.th, { flex: 3, borderRightWidth: 0 }]}>Mitigação</Text>
            </View>
            {risks.map((r, ri) => (
              <View key={ri} style={[s.tr, { backgroundColor: riskBg(r.level) }]} wrap={false}>
                <View style={[s.td, { flex: 0.8, justifyContent: "center" }]}>
                  <Text style={{ backgroundColor: riskBadge(r.level), color: "#fff", fontSize: 6, fontWeight: "bold", paddingHorizontal: 3, paddingVertical: 1, alignSelf: "flex-start" }}>{r.level}</Text>
                </View>
                <Text style={[s.td, { flex: 1.4 }]}>{r.category}</Text>
                <Text style={[s.td, { flex: 3 }]}>{r.description}</Text>
                <Text style={[s.td, { flex: 0.8, textAlign: "center" }]}>{r.probability}</Text>
                <Text style={[s.td, { flex: 0.8, textAlign: "center" }]}>{r.impact}</Text>
                <Text style={[s.td, { flex: 3, borderRightWidth: 0 }]}>{r.mitigation}</Text>
              </View>
            ))}
          </View>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 11. CRITÉRIOS DE ACEITAÇÃO */}
      {ac.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="11" title="CRITÉRIOS DE ACEITAÇÃO" meta={`${ac.length} critérios`} s={s} />
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 2 }]}>Critério</Text>
              <Text style={[s.th, { flex: 2 }]}>Meta</Text>
              <Text style={[s.th, { flex: 3, borderRightWidth: 0 }]}>Método de Validação</Text>
            </View>
            {ac.map((c, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={[s.td, { flex: 2, fontWeight: "bold" }]}>{c.criterion}</Text>
                <Text style={[s.td, { flex: 2, color: brand.primary, fontWeight: "bold" }]}>{c.target}</Text>
                <Text style={[s.td, { flex: 3, color: "#555", borderRightWidth: 0 }]}>{c.validationMethod}</Text>
              </View>
            ))}
          </View>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 12. DADOS A CONFIRMAR */}
      {dtc.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="12" title="DADOS A CONFIRMAR" meta={`${dtc.length} grupos`} s={s} />
          {dtc.map((g, i) => (
            <View key={i} wrap={false}>
              <Text style={s.h4}>{g.group}</Text>
              <Bul items={g.items} s={s} />
            </View>
          ))}
          <InfoBox label="IMPACTO DA CONFIRMAÇÃO" s={s} kind="warn">A falta de confirmação ou alterações significativas nestes dados podem impactar escopo, custo e prazo.</InfoBox>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 13. VISÃO CONCEITUAL */}
      {cv.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="13" title="VISÃO CONCEITUAL" meta={`${cv.length} vistas`} s={s} />
          {cv.map((v, i) => <InfoBox key={i} label={v.label} s={s}>{v.description}</InfoBox>)}
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 14. ROI */}
      {roiA ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="14" title="ANÁLISE DE RETORNO DE INVESTIMENTO (ROI)" meta={m.docId} s={s} />
          <Text style={s.h3}>14.1 Premissas Financeiras</Text>
          <Bul items={roiA.premises} s={s} />
          <Text style={s.h4}>Benefícios Anuais Estimados</Text>
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 3 }]}>Benefício</Text>
              <Text style={[s.th, { flex: 2, textAlign: "right", borderRightWidth: 0 }]}>Valor Anual (R$)</Text>
            </View>
            {roiA.benefits.map((b, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={[s.td, { flex: 3 }]}>{b.label}</Text>
                <Text style={[s.td, { flex: 2, textAlign: "right", fontWeight: "bold", borderRightWidth: 0 }]}>{b.annual}</Text>
              </View>
            ))}
            <View style={[s.tr, { backgroundColor: brand.primary }]}>
              <Text style={[s.td, { flex: 3, color: "#fff", fontWeight: "bold" }]}>Benefícios Totais</Text>
              <Text style={[s.td, { flex: 2, color: "#fff", textAlign: "right", fontWeight: "bold", borderRightWidth: 0 }]}>{roiA.benefitsTotal}</Text>
            </View>
          </View>
          <Text style={s.h4}>OPEX Adicional</Text>
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 3 }]}>Custo</Text>
              <Text style={[s.th, { flex: 2, textAlign: "right", borderRightWidth: 0 }]}>Valor Anual (R$)</Text>
            </View>
            {roiA.opex.map((o, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={[s.td, { flex: 3 }]}>{o.label}</Text>
                <Text style={[s.td, { flex: 2, textAlign: "right", fontWeight: "bold", borderRightWidth: 0 }]}>{o.annual}</Text>
              </View>
            ))}
            <View style={[s.tr, { backgroundColor: brand.primary }]}>
              <Text style={[s.td, { flex: 3, color: "#fff", fontWeight: "bold" }]}>OPEX Total</Text>
              <Text style={[s.td, { flex: 2, color: "#fff", textAlign: "right", fontWeight: "bold", borderRightWidth: 0 }]}>{roiA.opexTotal}</Text>
            </View>
          </View>
          <InfoBox label="Fluxo de Caixa Operacional Líquido" s={s}>{roiA.netCashFlow}</InfoBox>
          <Text style={s.h3}>14.2 Resultados</Text>
          <View style={{ flexDirection: "row", gap: 8, marginVertical: 6 }}>
            <View style={s.metricBig}><Text style={s.metricBigLabel}>VPL</Text><Text style={s.metricBigValue}>{roiA.results.vpl}</Text></View>
            <View style={s.metricBig}><Text style={s.metricBigLabel}>TIR</Text><Text style={s.metricBigValue}>{roiA.results.tir}</Text></View>
            <View style={s.metricBig}><Text style={s.metricBigLabel}>Payback</Text><Text style={s.metricBigValue}>{roiA.results.payback}</Text></View>
          </View>
          <Text style={s.h3}>14.3 Análise de Sensibilidade</Text>
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 1.5 }]}>Cenário</Text>
              <Text style={[s.th, { flex: 1.5 }]}>CAPEX</Text>
              <Text style={[s.th, { flex: 1.5 }]}>VPL</Text>
              <Text style={[s.th, { flex: 1 }]}>TIR</Text>
              <Text style={[s.th, { flex: 1.2, borderRightWidth: 0 }]}>Payback</Text>
            </View>
            {roiA.sensitivity.map((sn, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={[s.td, { flex: 1.5, fontWeight: "bold" }]}>{sn.scenario}</Text>
                <Text style={[s.td, { flex: 1.5 }]}>{sn.capex}</Text>
                <Text style={[s.td, { flex: 1.5 }]}>{sn.vpl}</Text>
                <Text style={[s.td, { flex: 1 }]}>{sn.tir}</Text>
                <Text style={[s.td, { flex: 1.2, borderRightWidth: 0 }]}>{sn.payback}</Text>
              </View>
            ))}
          </View>
          <InfoBox label="Conclusão da Análise Financeira" s={s}>{roiA.conclusion}</InfoBox>
          <PageFooter d={data} s={s} />
        </Page>
      ) : roi.length ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="14" title="ANÁLISE DE ROI — CENÁRIOS" meta={m.docId} s={s} />
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 1.2 }]}>Cenário</Text>
              <Text style={[s.th, { flex: 1.3 }]}>CAPEX</Text>
              <Text style={[s.th, { flex: 1.5 }]}>Benefício Anual</Text>
              <Text style={[s.th, { flex: 1.2 }]}>Payback</Text>
              <Text style={[s.th, { flex: 3, borderRightWidth: 0 }]}>Premissa</Text>
            </View>
            {roi.map((r, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={[s.td, { flex: 1.2, fontWeight: "bold" }]}>{r.scenario}</Text>
                <Text style={[s.td, { flex: 1.3 }]}>{r.capex}</Text>
                <Text style={[s.td, { flex: 1.5 }]}>{r.annualBenefit}</Text>
                <Text style={[s.td, { flex: 1.2 }]}>{r.paybackMonths}</Text>
                <Text style={[s.td, { flex: 3, borderRightWidth: 0 }]}>{r.assumption}</Text>
              </View>
            ))}
          </View>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 15. SEGURANÇA */}
      {safety ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="15" title="PERIGOS E MEDIDAS DE PROTEÇÃO (ISO 12100 · NR-12)" meta={m.docId} s={s} />
          <Text style={s.h3}>15.1 Perigos Identificados</Text>
          <View style={s.table}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 2 }]}>Perigo</Text>
              <Text style={[s.th, { flex: 2.5 }]}>Fonte</Text>
              <Text style={[s.th, { flex: 3.5, borderRightWidth: 0 }]}>Análise</Text>
            </View>
            {safety.hazards.map((h, i) => (
              <View key={i} style={s.tr} wrap={false}>
                <Text style={[s.td, { flex: 2, fontWeight: "bold" }]}>{h.hazard}</Text>
                <Text style={[s.td, { flex: 2.5 }]}>{h.source}</Text>
                <Text style={[s.td, { flex: 3.5, color: "#555", borderRightWidth: 0 }]}>{h.analysis}</Text>
              </View>
            ))}
          </View>
          <Text style={s.h3}>15.2 Medidas de Proteção</Text>
          <Text style={s.h4}>Controles de Engenharia (Prioridade Máxima)</Text>
          <Bul items={safety.engineeringControls} s={s} />
          <Text style={s.h4}>Controles Administrativos</Text>
          <Bul items={safety.administrativeControls} s={s} />
          <Text style={s.h4}>EPIs Obrigatórios</Text>
          <Bul items={safety.ppe} s={s} />
          <InfoBox label="CONFORMIDADE NORMATIVA" s={s}>{safety.complianceNote}</InfoBox>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* 16. ELÉTRICO */}
      {elec ? (
        <Page size="A4" style={s.page}>
          <PageHeader d={data} s={s} />
          <SectionBar num="16" title="ESPECIFICAÇÕES ELÉTRICAS E PROTEÇÕES" meta={m.docId} s={s} />
          <Text style={s.h3}>16.1 Distribuição de Energia</Text>
          <Bul items={elec.distribution} s={s} />
          <Text style={s.h3}>16.2 Proteção Elétrica</Text>
          <Bul items={elec.protection} s={s} />
          <Text style={s.h3}>16.3 Qualidade de Energia</Text>
          <Bul items={elec.powerQuality} s={s} />
          <InfoBox label="CONFORMIDADE" s={s}>{elec.complianceNote}</InfoBox>
          <PageFooter d={data} s={s} />
        </Page>
      ) : null}

      {/* CONTROLE EXECUTIVO + ACEITE */}
      <Page size="A4" style={s.page}>
        <PageHeader d={data} s={s} />
        <SectionBar num="17" title="CONTROLE EXECUTIVO E ACEITE" meta={m.docId} s={s} />
        {ec ? (
          <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 9 }}><Text style={{ fontWeight: "bold" }}>Elaborado por: </Text>{ec.elaboratedBy}</Text>
              <Text style={{ fontSize: 9 }}><Text style={{ fontWeight: "bold" }}>Data: </Text>{ec.emissionDate}</Text>
              <Text style={{ fontSize: 9 }}><Text style={{ fontWeight: "bold" }}>Versão: </Text>{ec.versionNote}</Text>
              <Text style={{ fontSize: 9 }}><Text style={{ fontWeight: "bold" }}>Confidencialidade: </Text>{ec.confidentialityNote}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 4 }}>Próximos Passos:</Text>
              {ec.nextSteps.map((n, i) => <Text key={i} style={{ fontSize: 8.5, marginLeft: 8 }}>{i + 1}. {n}</Text>)}
            </View>
          </View>
        ) : null}
        {ec?.signatures?.length ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {ec.signatures.map((sg, i) => (
              <View key={i} style={{ width: "48%", padding: 10, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 6 }} wrap={false}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#333", height: 28, marginBottom: 4 }} />
                <Text style={{ fontSize: 9, fontWeight: "bold", color: brand.primary }}>{sg.name}</Text>
                <Text style={{ fontSize: 8, color: "#666" }}>{sg.role}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <Text style={s.h3}>Aceite</Text>
        <View style={{ flexDirection: "row", gap: 14 }} wrap={false}>
          <View style={s.sigBox}>
            <Text style={s.sigLabel}>CONTRATANTE — {(acc.contractor?.label || m.clientName).toUpperCase()}</Text>
            <Text style={s.sigLine}>Nome: {acc.contractor?.name || "_______________________________"}</Text>
            <Text style={s.sigLine}>Cargo: {acc.contractor?.title || "_______________________________"}</Text>
            <Text style={s.sigLine}>CPF/CNPJ: {acc.contractor?.cnpj || "_______________________"}</Text>
            <View style={s.sigSpace} />
            <Text style={{ fontSize: 7, color: "#666", marginTop: 4 }}>Assinatura · Data: ___/___/______</Text>
          </View>
          <View style={s.sigBox}>
            <Text style={s.sigLabel}>CONTRATADA — {(acc.contracted?.label || m.companyName).toUpperCase()}</Text>
            <Text style={s.sigLine}>Nome: {acc.contracted?.name || "_______________________________"}</Text>
            <Text style={s.sigLine}>Cargo: {acc.contracted?.title || "_______________________________"}</Text>
            <Text style={s.sigLine}>CREA/CPF: {acc.contracted?.crea || acc.contracted?.cnpj || "_______________________"}</Text>
            <View style={s.sigSpace} />
            <Text style={{ fontSize: 7, color: "#666", marginTop: 4 }}>Assinatura · Data: ___/___/______</Text>
          </View>
        </View>
        <PageFooter d={data} s={s} />
      </Page>
    </Document>
  );
};
