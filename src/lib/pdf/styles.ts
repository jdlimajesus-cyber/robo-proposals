import { StyleSheet } from "@react-pdf/renderer";

// Brand colors
export const COLORS = {
  primary: "#1a3a5c",
  primaryLight: "#2c5a8c",
  accent: "#e67e22",
  text: "#333333",
  textLight: "#666666",
  white: "#ffffff",
  bgLight: "#f9f9f9",
  bgSection: "#f0f4f8",
  border: "#dddddd",
  borderLight: "#e5e7eb",
  success: "#27ae60",
  warning: "#f39c12",
  danger: "#e74c3c",
  info: "#3498db",
};

export const styles = StyleSheet.create({
  // Page
  page: {
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: 42, // ~1.5cm
    backgroundColor: COLORS.white,
    fontFamily: "OpenSans",
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.4,
  },
  pageLandscape: {
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: 42,
    backgroundColor: COLORS.white,
    fontFamily: "OpenSans",
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.4,
  },

  // Header
  header: {
    position: "absolute",
    top: 20,
    left: 42,
    right: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 8,
  },
  headerLogo: {
    width: 100,
    height: 30,
    objectFit: "contain",
  },
  headerText: {
    fontSize: 7,
    color: COLORS.textLight,
    textAlign: "right",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 42,
    right: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: COLORS.textLight,
  },
  footerConfidential: {
    fontSize: 7,
    color: COLORS.danger,
    fontFamily: "OpenSansBold",
  },
  pageNumber: {
    fontSize: 7,
    color: COLORS.textLight,
  },

  // Cover page
  coverPage: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: COLORS.white,
  },
  coverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  coverAccentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: COLORS.accent,
  },
  coverTopBar: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.primary,
  },
  coverLogo: {
    width: 180,
    height: 60,
    objectFit: "contain",
    marginBottom: 40,
  },
  coverTitle: {
    fontFamily: "MontserratBold",
    fontSize: 28,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  coverSubtitle: {
    fontFamily: "Montserrat",
    fontSize: 16,
    color: COLORS.primaryLight,
    textAlign: "center",
    marginBottom: 40,
  },
  coverDivider: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.accent,
    marginBottom: 30,
  },
  coverInfoBox: {
    backgroundColor: COLORS.bgLight,
    borderRadius: 6,
    padding: 20,
    width: "80%",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  coverInfoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  coverInfoLabel: {
    fontFamily: "OpenSansBold",
    fontSize: 9,
    color: COLORS.textLight,
    width: 100,
  },
  coverInfoValue: {
    fontFamily: "OpenSans",
    fontSize: 9,
    color: COLORS.text,
    flex: 1,
  },

  // Typography
  h1: {
    fontFamily: "MontserratBold",
    fontSize: 22,
    color: COLORS.primary,
    marginBottom: 14,
    marginTop: 4,
  },
  h2: {
    fontFamily: "MontserratSemiBold",
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 16,
  },
  h3: {
    fontFamily: "MontserratSemiBold",
    fontSize: 12,
    color: COLORS.primaryLight,
    marginBottom: 8,
    marginTop: 12,
  },
  bodyText: {
    fontFamily: "OpenSans",
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.5,
    marginBottom: 6,
    textAlign: "justify",
  },

  // Section header bar
  sectionHeaderBar: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeaderNumber: {
    fontFamily: "MontserratBold",
    fontSize: 14,
    color: COLORS.accent,
    marginRight: 10,
  },
  sectionHeaderTitle: {
    fontFamily: "MontserratBold",
    fontSize: 14,
    color: COLORS.white,
  },

  // Lists
  listItem: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 8,
  },
  listBullet: {
    fontFamily: "OpenSans",
    fontSize: 10,
    color: COLORS.accent,
    width: 14,
  },
  listText: {
    fontFamily: "OpenSans",
    fontSize: 10,
    color: COLORS.text,
    flex: 1,
    lineHeight: 1.4,
  },

  // Tables
  table: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 3,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tableHeaderCell: {
    fontFamily: "OpenSansBold",
    fontSize: 8,
    color: COLORS.white,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tableRowEven: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.bgLight,
  },
  tableCell: {
    fontFamily: "OpenSans",
    fontSize: 8,
    color: COLORS.text,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderLight,
  },

  // Highlight boxes
  highlightBox: {
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
  },
  highlightInfo: {
    backgroundColor: "#eaf4fc",
    borderLeftColor: COLORS.info,
  },
  highlightWarning: {
    backgroundColor: "#fef9e7",
    borderLeftColor: COLORS.warning,
  },
  highlightSuccess: {
    backgroundColor: "#eafaf1",
    borderLeftColor: COLORS.success,
  },
  highlightMoney: {
    backgroundColor: "#fef5e7",
    borderLeftColor: COLORS.accent,
  },
  highlightText: {
    fontFamily: "OpenSans",
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.4,
  },

  // Image placeholder
  imagePlaceholder: {
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderStyle: "dashed",
    borderRadius: 6,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: COLORS.bgLight,
    minHeight: 80,
  },
  imagePlaceholderText: {
    fontFamily: "OpenSans",
    fontSize: 9,
    color: COLORS.textLight,
    textAlign: "center",
  },

  // Gantt chart
  ganttContainer: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    padding: 10,
  },
  ganttTitle: {
    fontFamily: "MontserratSemiBold",
    fontSize: 11,
    color: COLORS.primary,
    marginBottom: 10,
  },
  ganttRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    minHeight: 22,
  },
  ganttLabel: {
    fontFamily: "OpenSans",
    fontSize: 7,
    color: COLORS.text,
    width: 120,
    paddingRight: 6,
  },
  ganttBarArea: {
    flex: 1,
    flexDirection: "row",
    height: 16,
    position: "relative",
  },
  ganttBar: {
    height: 14,
    borderRadius: 3,
    position: "absolute",
  },
  ganttWeekHeader: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 120,
  },
  ganttWeekCell: {
    flex: 1,
    alignItems: "center",
  },
  ganttWeekText: {
    fontFamily: "OpenSansBold",
    fontSize: 6,
    color: COLORS.textLight,
  },
  ganttMilestoneRow: {
    flexDirection: "row",
    marginTop: 6,
    paddingLeft: 120,
    alignItems: "center",
  },
  ganttMilestone: {
    position: "absolute",
    alignItems: "center",
  },
  ganttMilestoneDiamond: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.danger,
    transform: "rotate(45deg)",
  },
  ganttMilestoneLabel: {
    fontFamily: "OpenSans",
    fontSize: 5,
    color: COLORS.text,
    marginTop: 2,
    textAlign: "center",
    width: 50,
  },
  ganttLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  ganttLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  ganttLegendColor: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 4,
  },
  ganttLegendText: {
    fontFamily: "OpenSans",
    fontSize: 6,
    color: COLORS.text,
  },

  // Alternatives table
  altContainer: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 10,
  },
  altCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 10,
  },
  altCardRecommended: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fffaf0",
  },
  altCardTitle: {
    fontFamily: "MontserratBold",
    fontSize: 11,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  altBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: "center",
    marginBottom: 6,
  },
  altBadgeText: {
    fontFamily: "OpenSansBold",
    fontSize: 6,
    color: COLORS.white,
  },
  altFeature: {
    fontFamily: "OpenSans",
    fontSize: 8,
    color: COLORS.text,
    marginBottom: 3,
    paddingLeft: 8,
  },
  altPrice: {
    fontFamily: "MontserratBold",
    fontSize: 14,
    color: COLORS.accent,
    textAlign: "center",
    marginTop: 8,
  },

  // Risk matrix
  riskHigh: { backgroundColor: "#fadbd8", color: COLORS.danger },
  riskMedium: { backgroundColor: "#fef9e7", color: "#d4a017" },
  riskLow: { backgroundColor: "#eafaf1", color: COLORS.success },

  // Signature block
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 40,
  },
  signatureBlock: {
    flex: 1,
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.text,
    marginBottom: 6,
    marginTop: 50,
  },
  signatureName: {
    fontFamily: "OpenSansBold",
    fontSize: 9,
    color: COLORS.text,
    textAlign: "center",
  },
  signatureRole: {
    fontFamily: "OpenSans",
    fontSize: 8,
    color: COLORS.textLight,
    textAlign: "center",
  },
});
