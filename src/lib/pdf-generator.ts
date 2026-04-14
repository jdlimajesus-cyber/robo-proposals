import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Analyzes tables in the HTML to detect if any need landscape orientation.
 * Rules:
 * - Table with >6 columns → landscape
 * - Schedule/cronograma table with >8 time columns → landscape
 */
function detectLandscapeSections(container: HTMLElement): Set<HTMLElement> {
  const landscapeElements = new Set<HTMLElement>();
  const tables = container.querySelectorAll("table");

  tables.forEach((table) => {
    const headerCells = table.querySelectorAll("thead th, thead td, tr:first-child th, tr:first-child td");
    const colCount = headerCells.length;

    if (colCount > 6) {
      landscapeElements.add(table as HTMLElement);
    }

    // Check if it's a schedule/cronograma by looking for "Sem" or "Semana" headers
    let timeColumns = 0;
    headerCells.forEach((cell) => {
      const text = cell.textContent?.trim() || "";
      if (/^(sem|semana|s\d|fase|etapa|mês|mes|sprint|week|wk)\s*/i.test(text)) {
        timeColumns++;
      }
    });
    if (timeColumns > 8) {
      landscapeElements.add(table as HTMLElement);
    }
  });

  return landscapeElements;
}

/**
 * Splits the proposal HTML into logical page sections, 
 * identifying which ones need landscape orientation.
 */
interface PageSection {
  element: HTMLElement;
  orientation: "portrait" | "landscape";
}

function splitIntoSections(container: HTMLElement): PageSection[] {
  const landscapeTables = detectLandscapeSections(container);
  const sections: PageSection[] = [];

  // Find all major section divs (identified by section headers or direct children)
  const children = Array.from(container.children) as HTMLElement[];

  if (children.length === 0) {
    return [{ element: container, orientation: "portrait" }];
  }

  let currentGroup: HTMLElement[] = [];
  let currentOrientation: "portrait" | "landscape" = "portrait";

  const flushGroup = () => {
    if (currentGroup.length === 0) return;
    const wrapper = document.createElement("div");
    currentGroup.forEach((el) => wrapper.appendChild(el.cloneNode(true)));
    sections.push({ element: wrapper, orientation: currentOrientation });
    currentGroup = [];
    currentOrientation = "portrait";
  };

  children.forEach((child) => {
    const hasLandscapeTable = landscapeTables.has(child) || 
      Array.from(child.querySelectorAll("table")).some((t) => landscapeTables.has(t as HTMLElement));

    if (hasLandscapeTable && currentOrientation === "portrait") {
      flushGroup();
      currentOrientation = "landscape";
      currentGroup.push(child);
      flushGroup();
    } else {
      currentGroup.push(child);
    }
  });

  flushGroup();

  // If no sections were created, return the whole container as portrait
  if (sections.length === 0) {
    return [{ element: container, orientation: "portrait" }];
  }

  return sections;
}

const PDF_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 100%;
    font-family: 'Segoe UI', 'Inter', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #333333;
    background: white;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
  th { background: #1a237e !important; color: white !important; padding: 8px 12px; text-align: left; font-weight: 600; border: 1px solid #1a237e; }
  td { padding: 6px 12px; border: 1px solid #ddd; }
  tr:nth-child(even) { background: #f9f9f9; }
  img { max-width: 100% !important; height: auto !important; }
  h1, h2, h3 { margin-top: 16px; margin-bottom: 8px; }
  p { margin-bottom: 8px; text-align: justify; orphans: 3; widows: 3; }
  ul, ol { padding-left: 24px; margin-bottom: 12px; }
  li { margin-bottom: 4px; }
  div[style*="border-left:4px"], div[style*="border-left: 4px"] { margin: 12px 0; }
`;

/**
 * Renders a single HTML section to a canvas at high DPI.
 */
async function renderSectionToCanvas(
  htmlContent: string,
  widthPx: number
): Promise<HTMLCanvasElement> {
  const offscreen = document.createElement("div");
  offscreen.style.position = "absolute";
  offscreen.style.left = "-99999px";
  offscreen.style.top = "0";
  offscreen.style.width = `${widthPx}px`;
  offscreen.style.background = "white";
  offscreen.style.padding = "0";

  offscreen.innerHTML = `<style>${PDF_STYLES}</style>${htmlContent}`;
  document.body.appendChild(offscreen);

  // Wait for fonts and images
  await new Promise((r) => setTimeout(r, 300));

  const canvas = await html2canvas(offscreen, {
    scale: 2, // High DPI
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: widthPx,
    windowWidth: widthPx,
    backgroundColor: "#ffffff",
  });

  document.body.removeChild(offscreen);
  return canvas;
}

/**
 * Main PDF generation function.
 * Generates a multi-page PDF with intelligent orientation switching.
 */
export async function generatePDF(
  htmlContent: string,
  fileName: string,
  onProgress?: (stage: string) => void
): Promise<void> {
  onProgress?.("Analisando conteúdo...");

  // Create a temporary container to analyze content
  const analyzer = document.createElement("div");
  analyzer.style.position = "absolute";
  analyzer.style.left = "-99999px";
  analyzer.innerHTML = htmlContent;
  document.body.appendChild(analyzer);

  const sections = splitIntoSections(analyzer);
  document.body.removeChild(analyzer);

  // A4 dimensions in mm
  const A4_W_MM = 210;
  const A4_H_MM = 297;
  const MARGIN_TOP = 20;
  const MARGIN_BOTTOM = 20;
  const MARGIN_LEFT = 15;
  const MARGIN_RIGHT = 15;

  // Start with portrait
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let isFirstPage = true;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const isLandscape = section.orientation === "landscape";

    onProgress?.(`Renderizando seção ${i + 1} de ${sections.length}...`);

    const pageW = isLandscape ? A4_H_MM : A4_W_MM;
    const pageH = isLandscape ? A4_W_MM : A4_H_MM;
    const contentW = pageW - MARGIN_LEFT - MARGIN_RIGHT;
    const contentH = pageH - MARGIN_TOP - MARGIN_BOTTOM;

    // Render at ~96dpi equivalent width (mm to px: 1mm ≈ 3.78px)
    const renderWidthPx = Math.round(contentW * 3.78);

    const canvas = await renderSectionToCanvas(
      section.element.innerHTML,
      renderWidthPx
    );

    // Calculate how many PDF pages this canvas needs
    const canvasWidthMM = contentW;
    const canvasHeightMM = (canvas.height / canvas.width) * canvasWidthMM;
    const pagesNeeded = Math.ceil(canvasHeightMM / contentH);

    for (let p = 0; p < pagesNeeded; p++) {
      if (!isFirstPage) {
        pdf.addPage("a4", isLandscape ? "landscape" : "portrait");
      }
      isFirstPage = false;

      // Calculate the slice of canvas for this page
      const sliceTopMM = p * contentH;
      const sliceHeightMM = Math.min(contentH, canvasHeightMM - sliceTopMM);

      // Convert to canvas pixels
      const pxPerMM = canvas.height / canvasHeightMM;
      const sliceTopPx = Math.round(sliceTopMM * pxPerMM);
      const sliceHeightPx = Math.round(sliceHeightMM * pxPerMM);

      // Create a sub-canvas for this page slice
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;
      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0, sliceTopPx, canvas.width, sliceHeightPx,
          0, 0, canvas.width, sliceHeightPx
        );
      }

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);
      pdf.addImage(
        imgData,
        "JPEG",
        MARGIN_LEFT,
        MARGIN_TOP,
        canvasWidthMM,
        sliceHeightMM
      );
    }
  }

  onProgress?.("Finalizando PDF...");
  pdf.save(fileName);
}
