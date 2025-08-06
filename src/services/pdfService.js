const fs = require("fs-extra");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const path = require("path");

// Register Handlebars helper to format analysis text
handlebars.registerHelper('splitAnalysis', function(analysisText) {
  if (!analysisText) return [];
  
  const lines = analysisText.split('\n');
  const formatted = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Check for different types of content
    if (line.startsWith('##') || line.startsWith('**') && line.endsWith('**')) {
      // Headings
      const text = line.replace(/^##\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
      formatted.push({ isHeading: true, text: text });
    } else if (line.startsWith('* **') && line.includes('**')) {
      // Bullet points with labels
      const match = line.match(/^\*\s*\*\*(.*?)\*\*\s*(.*)/);
      if (match) {
        formatted.push({ isBullet: true, label: match[1] + ':', text: match[2] });
      } else {
        formatted.push({ isBullet: true, label: '', text: line.replace(/^\*\s*/, '') });
      }
    } else if (line.startsWith('*') && line.includes('Severity:')) {
      // Severity lines
      const severityMatch = line.match(/\*\*Severity:\*\*\s*(\w+)/);
      if (severityMatch) {
        const level = severityMatch[1].toLowerCase();
        formatted.push({ isSeverity: true, level: level, text: severityMatch[1] });
      }
    } else if (line.startsWith('*') && line.includes('Remediation:')) {
      // Remediation lines
      const remediationText = line.replace(/^\*\s*\*\*Remediation:\*\*\s*/, '');
      formatted.push({ isRecommendation: true, text: remediationText });
    } else if (line.startsWith('*')) {
      // Sub bullet points
      formatted.push({ isSubBullet: true, text: line.replace(/^\*\s*/, '') });
    } else if (line.match(/^\d+\./)) {
      // Numbered recommendations
      formatted.push({ isRecommendation: true, text: line });
    } else {
      // Regular paragraphs
      formatted.push({ text: line });
    }
  }
  
  return formatted;
});

exports.generatePDF = async (data, outputPath) => {
  const templatePath = path.join(__dirname, "../../templates/report.hbs");
  const templateSrc = await fs.readFile(templatePath, "utf8");
  const template = handlebars.compile(templateSrc);
  const html = template(data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "40px", bottom: "40px", left: "20px", right: "20px" },
    preferCSSPageSize: true
  });

  await browser.close();
};
