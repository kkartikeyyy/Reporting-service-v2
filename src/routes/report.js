const express = require("express");
const router = express.Router();
const { generatePDF } = require("../services/pdfService");
const { generateDocx } = require("../services/docxService");
const { saveReport } = require("../services/dbService");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const id = uuidv4();
    const createdAt = new Date();
    const pdfPath = path.join("reports", `${id}.pdf`);
    const docxPath = path.join("reports", `${id}.docx`);

    // Extract key fields from the scanner data
    const { report_id, repo_url, scan_type, status } = data;

    await generatePDF(data, pdfPath);
    await generateDocx(data, docxPath);
    await saveReport({ 
      id, 
      report_id, 
      repo_url, 
      scan_type, 
      status, 
      data, 
      createdAt, 
      pdfPath, 
      docxPath 
    });

    res.json({
      message: "Report generated successfully.",
      report_id: id,
      original_report_id: report_id,
      pdf: pdfPath,
      docx: docxPath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error generating report." });
  }
});

module.exports = router;
