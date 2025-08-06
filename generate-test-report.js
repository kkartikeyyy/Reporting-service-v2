const { generatePDF } = require("./src/services/pdfService");
const { generateDocx } = require("./src/services/docxService");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

async function generateTestReport() {
  try {
    console.log("Loading test data...");
    const testData = JSON.parse(fs.readFileSync("test-data.json", "utf8"));
    
    const id = uuidv4();
    const pdfPath = path.join("reports", `${id}.pdf`);
    const docxPath = path.join("reports", `${id}.docx`);
    
    console.log("Generating PDF report...");
    await generatePDF(testData, pdfPath);
    console.log(`PDF generated: ${pdfPath}`);
    
    console.log("Generating DOCX report...");
    await generateDocx(testData, docxPath);
    console.log(`DOCX generated: ${docxPath}`);
    
    console.log("\nReport generation completed successfully!");
    console.log(`Report ID: ${id}`);
    console.log(`PDF: ${pdfPath}`);
    console.log(`DOCX: ${docxPath}`);
    
  } catch (error) {
    console.error("Error generating report:", error);
  }
}

generateTestReport();
