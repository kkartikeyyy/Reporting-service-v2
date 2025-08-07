const express = require("express");
const router = express.Router();
const { generatePDF } = require("../services/pdfService");
const { generateDocx } = require("../services/docxService");
const { saveReport } = require("../services/dbService");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");

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

// New endpoint to generate reports from scanner service
router.get("/generate/:scanId", async (req, res) => {
  try {
    const { scanId } = req.params;
    const scannerServiceUrl = process.env.SCANNER_SERVICE_URL || "http://localhost:3000";
    
    console.log(`🔍 Fetching scan report for ID: ${scanId}`);
    console.log(`📡 Scanner service URL: ${scannerServiceUrl}/scan-report/${scanId}`);
    
    // Fetch scan data from scanner service
    const scannerResponse = await axios.get(`${scannerServiceUrl}/scan-report/${scanId}`, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const scanData = scannerResponse.data;
    console.log(`✅ Scan data retrieved successfully`);
    console.log(`📊 Scan summary: ${scanData.vulnerability_count ? Object.values(scanData.vulnerability_count).reduce((a, b) => a + b, 0) : 'N/A'} total vulnerabilities`);
    
    // Transform scan data to match report format
    const reportData = {
      // Top-level fields expected by template
      repo_url: scanData.repo_url,
      repo_id: scanData.repo_id,
      branch: scanData.branch,
      report_id: scanData.report_id || scanId,
      scan_id: scanData.report_id || scanId,
      scan_date: scanData.created_at,
      scan_status: scanData.status,
      scan_type: scanData.scan_type,
      scan_duration: scanData.completed_at && scanData.created_at ? 
        Math.round((new Date(scanData.completed_at) - new Date(scanData.created_at)) / 1000 / 60) + ' minutes' : 
        'N/A',
      created_at: scanData.created_at,
      completed_at: scanData.completed_at,
      
      // Repository structure
      repository: {
        name: scanData.repo_url ? scanData.repo_url.split('/').pop().replace('.git', '') : 'Unknown',
        url: scanData.repo_url,
        branch: scanData.branch
      },
      
      // Progress information
      progress: scanData.progress || {
        total_files: scanData.scan_results ? Object.keys(scanData.scan_results).length : 0,
        processed_files: scanData.scan_results ? Object.keys(scanData.scan_results).length : 0,
        percentage: 100
      },
      
      // Scan information
      scan: {
        id: scanData.report_id || scanId,
        date: scanData.created_at,
        status: scanData.status,
        duration: scanData.completed_at && scanData.created_at ? 
          Math.round((new Date(scanData.completed_at) - new Date(scanData.created_at)) / 1000 / 60) + ' minutes' : 
          'N/A'
      },
      
      // Vulnerabilities summary counts
      vulnerabilities: scanData.vulnerability_count ? {
        total: Object.values(scanData.vulnerability_count).reduce((a, b) => a + b, 0),
        critical: scanData.vulnerability_count.Critical || 0,
        high: scanData.vulnerability_count.High || 0,
        medium: scanData.vulnerability_count.Medium || 0,
        low: scanData.vulnerability_count.Low || 0
      } : {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      
      // Scan results for detailed security analysis section
      scan_results: scanData.scan_results || {},
      
      // Repository information
      repository_info: scanData.repository_info || {
        languages: {},
        total_lines: 0,
        file_types: {}
      }
    };
    
    console.log('📄 Generating reports...');
    
    // Generate report files
    const timestamp = Date.now();
    const reportId = scanData.report_id || scanId;
    const pdfPath = path.join(__dirname, '../../reports', `security-report-${reportId}-${timestamp}.pdf`);
    const docxPath = path.join(__dirname, '../../reports', `security-report-${reportId}-${timestamp}.docx`);
    
    // Ensure reports directory exists
    await fs.ensureDir(path.dirname(pdfPath));
    
    // Generate PDF and DOCX reports
    await generatePDF(reportData, pdfPath);
    console.log(`✅ PDF report generated: ${pdfPath}`);
    
    await generateDocx(reportData, docxPath);
    console.log(`✅ DOCX report generated: ${docxPath}`);
    
    // Save to database
    const dbId = uuidv4();
    await saveReport({ 
      id: dbId, 
      report_id: reportId, 
      repo_url: scanData.repo_url, 
      scan_type: scanData.scan_type, 
      status: scanData.status, 
      data: reportData, 
      createdAt: new Date(), 
      pdfPath: path.relative(path.join(__dirname, '../..'), pdfPath), 
      docxPath: path.relative(path.join(__dirname, '../..'), docxPath)
    });
    
    res.json({
      success: true,
      message: "Report generated successfully from scanner service",
      data: {
        scan_id: scanId,
        report_id: reportId,
        db_id: dbId,
        pdf_path: path.relative(path.join(__dirname, '../..'), pdfPath),
        docx_path: path.relative(path.join(__dirname, '../..'), docxPath),
        generated_at: new Date().toISOString(),
        vulnerability_summary: reportData.vulnerabilities,
        repository: {
          url: scanData.repo_url,
          branch: scanData.branch
        }
      }
    });
    
  } catch (err) {
    console.error('❌ Error generating report from scanner service:', err);
    
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        success: false,
        error: "Scanner service unavailable",
        message: "Could not connect to scanner service. Please ensure it's running on the expected port."
      });
    }
    
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        success: false,
        error: "Scan report not found",
        message: `No scan report found with ID: ${req.params.scanId}`
      });
    }
    
    if (err.response && err.response.status) {
      return res.status(err.response.status).json({ 
        success: false,
        error: "Scanner service error",
        message: err.response.data?.message || "Error from scanner service"
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: "Internal error generating report",
      message: err.message
    });
  }
});

module.exports = router;
