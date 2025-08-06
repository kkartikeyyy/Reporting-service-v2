const fs = require('fs-extra');
const path = require('path');
const pdfService = require('./src/services/pdfService');
const docxService = require('./src/services/docxService');

async function generateDVWAReport() {
    try {
        console.log('📖 Reading DVWA test data...');
        const dvwaData = JSON.parse(fs.readFileSync('./DVWA_test.txt', 'utf8'));
        
        console.log('📊 DVWA Scan Summary:');
        console.log(`- Repository: ${dvwaData.repo_url}`);
        console.log(`- Total files scanned: ${dvwaData.progress.total_files}`);
        console.log(`- Vulnerability counts:`);
        console.log(`  • Critical: ${dvwaData.vulnerability_count.Critical}`);
        console.log(`  • High: ${dvwaData.vulnerability_count.High}`);
        console.log(`  • Medium: ${dvwaData.vulnerability_count.Medium}`);
        console.log(`  • Low: ${dvwaData.vulnerability_count.Low}`);
        
        // Transform DVWA data to match our report format
        const reportData = {
            // Top-level fields expected by template
            repo_url: dvwaData.repo_url,
            repo_id: dvwaData.repo_id,
            branch: dvwaData.branch,
            report_id: dvwaData.report_id,
            scan_id: dvwaData.report_id,
            scan_date: dvwaData.created_at,
            scan_status: dvwaData.status,
            scan_type: dvwaData.scan_type,
            scan_duration: Math.round((new Date(dvwaData.completed_at) - new Date(dvwaData.created_at)) / 1000 / 60) + ' minutes',
            created_at: dvwaData.created_at,
            completed_at: dvwaData.completed_at,
            
            // Repository structure
            repository: {
                name: "DVWA",
                url: dvwaData.repo_url,
                branch: dvwaData.branch
            },
            
            // Progress information
            progress: dvwaData.progress,
            
            // Scan information
            scan: {
                id: dvwaData.report_id,
                date: dvwaData.created_at,
                status: dvwaData.status,
                duration: Math.round((new Date(dvwaData.completed_at) - new Date(dvwaData.created_at)) / 1000 / 60) + ' minutes'
            },
            
            // Vulnerabilities summary counts (no detailed data to avoid duplication)
            vulnerabilities: {
                total: dvwaData.vulnerability_count.Critical + dvwaData.vulnerability_count.High + dvwaData.vulnerability_count.Medium + dvwaData.vulnerability_count.Low,
                critical: dvwaData.vulnerability_count.Critical,
                high: dvwaData.vulnerability_count.High,
                medium: dvwaData.vulnerability_count.Medium,
                low: dvwaData.vulnerability_count.Low
            },
            
            // Scan results for detailed security analysis section
            scan_results: dvwaData.scan_results,
            
            // Repository information
            repository_info: dvwaData.repository_info
        };
        
        console.log('\n📄 Generating PDF report...');
        const pdfPath = path.join(__dirname, 'reports', `dvwa-security-report-${Date.now()}.pdf`);
        await fs.ensureDir(path.dirname(pdfPath));
        await pdfService.generatePDF(reportData, pdfPath);
        console.log(`✅ PDF report generated: ${pdfPath}`);
        
        console.log('\n📄 Generating DOCX report...');
        const docxPath = path.join(__dirname, 'reports', `dvwa-security-report-${Date.now()}.docx`);
        await docxService.generateDocx(reportData, docxPath);
        console.log(`✅ DOCX report generated: ${docxPath}`);
        
        console.log('\n🎉 DVWA security reports generated successfully!');
        
    } catch (error) {
        console.error('❌ Error generating DVWA report:', error);
    }
}

generateDVWAReport();
