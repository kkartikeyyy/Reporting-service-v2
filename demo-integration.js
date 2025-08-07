/**
 * Demo Script: Scanner Service Integration Test
 * 
 * This script demonstrates the complete integration between the reporting service
 * and scanner service using the Test2 result data.
 */

const axios = require('axios');

async function demonstrateIntegration() {
    console.log('🎯 CodeShuriken Reporting Service Integration Demo');
    console.log('='.repeat(55));
    console.log('');
    
    // Configuration
    const reportingServiceUrl = 'http://localhost:3500';
    const scannerServiceUrl = 'http://localhost:3000';
    const scanId = '20250731072332_fee07cb7_SBOM_1ff28aad';
    const reportType = 'pdf'; // As requested by frontend
    
    console.log('📋 Demo Configuration:');
    console.log(`   🔍 Scan ID: ${scanId}`);
    console.log(`   📄 Report Type: ${reportType}`);
    console.log(`   📡 Scanner Service: ${scannerServiceUrl}`);
    console.log(`   🎯 Reporting Service: ${reportingServiceUrl}`);
    console.log('');
    
    try {
        console.log('🔄 Step 1: Verify Scanner Service Health');
        const healthResponse = await axios.get(`${scannerServiceUrl}/health`);
        console.log(`   ✅ Scanner service status: ${healthResponse.data.status}`);
        console.log('');
        
        console.log('🔄 Step 2: Fetch Scan Data from Scanner Service');
        const scanDataResponse = await axios.get(`${scannerServiceUrl}/scan-report/${scanId}`);
        const scanData = scanDataResponse.data;
        console.log(`   ✅ Scan data retrieved successfully`);
        console.log(`   📊 Repository: ${scanData.repo_url}`);
        console.log(`   🌿 Branch: ${scanData.branch}`);
        console.log(`   🔍 Scan Type: ${scanData.scan_type}`);
        console.log(`   📅 Created: ${scanData.created_at}`);
        console.log(`   ✅ Status: ${scanData.status}`);
        console.log('');
        
        console.log('🔄 Step 3: Generate Report via Reporting Service');
        console.log(`   📞 Calling: GET ${reportingServiceUrl}/api/report/generate/${scanId}`);
        
        const reportResponse = await axios.get(`${reportingServiceUrl}/api/report/generate/${scanId}`);
        
        if (reportResponse.data.success) {
            const { data } = reportResponse.data;
            
            console.log('   ✅ Report generation successful!');
            console.log('');
            console.log('📊 Generated Report Details:');
            console.log(`   🆔 Report ID: ${data.report_id}`);
            console.log(`   🆔 Database ID: ${data.db_id}`);
            console.log(`   📁 PDF Path: ${data.pdf_path}`);
            console.log(`   📄 DOCX Path: ${data.docx_path}`);
            console.log(`   📅 Generated At: ${data.generated_at}`);
            console.log('');
            
            console.log('🛡️ Security Analysis Summary:');
            console.log(`   🔴 Critical: ${data.vulnerability_summary.critical}`);
            console.log(`   🟠 High: ${data.vulnerability_summary.high}`);
            console.log(`   🟡 Medium: ${data.vulnerability_summary.medium}`);
            console.log(`   🟢 Low: ${data.vulnerability_summary.low}`);
            console.log(`   📈 Total: ${data.vulnerability_summary.total}`);
            console.log('');
            
            console.log('📦 Repository Information:');
            console.log(`   🌐 URL: ${data.repository.url}`);
            console.log(`   🌿 Branch: ${data.repository.branch}`);
            console.log('');
            
            // Simulate frontend behavior
            console.log('🎯 Frontend Integration Simulation:');
            console.log('   Frontend requested:');
            console.log(`     - Report Type: ${reportType}`);
            console.log(`     - Report ID: ${scanId}`);
            console.log('   Backend response:');
            console.log(`     - Success: ${reportResponse.data.success}`);
            console.log(`     - PDF Available: ${data.pdf_path ? '✅' : '❌'}`);
            console.log(`     - DOCX Available: ${data.docx_path ? '✅' : '❌'}`);
            console.log('');
            
            // Check file existence
            console.log('📁 File Verification:');
            const fs = require('fs');
            const path = require('path');
            
            const pdfPath = path.join(__dirname, data.pdf_path);
            const docxPath = path.join(__dirname, data.docx_path);
            
            if (fs.existsSync(pdfPath)) {
                const pdfStats = fs.statSync(pdfPath);
                console.log(`   📄 PDF: ✅ (${(pdfStats.size / 1024).toFixed(2)} KB)`);
            } else {
                console.log('   📄 PDF: ❌ File not found');
            }
            
            if (fs.existsSync(docxPath)) {
                const docxStats = fs.statSync(docxPath);
                console.log(`   📄 DOCX: ✅ (${(docxStats.size / 1024).toFixed(2)} KB)`);
            } else {
                console.log('   📄 DOCX: ❌ File not found');
            }
            
        } else {
            console.log('   ❌ Report generation failed');
            console.log(`   Error: ${reportResponse.data.error}`);
            console.log(`   Message: ${reportResponse.data.message}`);
        }
        
    } catch (error) {
        console.log('❌ Demo Error:');
        
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data:`, error.response.data);
        } else {
            console.log(`   Message: ${error.message}`);
        }
    }
    
    console.log('');
    console.log('🎉 Demo Complete!');
    console.log('='.repeat(55));
}

// Run the demo
if (require.main === module) {
    demonstrateIntegration().catch(console.error);
}

module.exports = { demonstrateIntegration };
