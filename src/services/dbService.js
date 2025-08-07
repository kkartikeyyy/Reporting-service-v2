const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.saveReport = async ({ id, report_id, repo_url, scan_type, status, data, createdAt, pdfPath, docxPath }) => {
  try {
    await pool.query(
      `INSERT INTO reports (id, report_id, repo_url, scan_type, status, data, created_at, pdf_path, docx_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, report_id, repo_url, scan_type, status, JSON.stringify(data), createdAt, pdfPath, docxPath]
    );
    console.log('✅ Report metadata saved to database');
  } catch (error) {
    console.warn('⚠️ Database unavailable, skipping metadata save:', error.code);
    // Don't throw error - continue without database
  }
};
