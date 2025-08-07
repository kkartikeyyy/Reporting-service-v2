const express = require('express');
const fs = require('fs');
const path = require('path');

// Create a temporary mock scanner service for testing
const app = express();
const PORT = 3000;

app.use(express.json());

// Mock endpoint that returns Test2 result data
app.get('/scan-report/:scanId', (req, res) => {
    const { scanId } = req.params;
    
    console.log(`📡 Mock Scanner Service: Received request for scan ID: ${scanId}`);
    
    try {
        // Read the Test2 result data
        const test2Data = fs.readFileSync(path.join(__dirname, 'Test2 result.txt'), 'utf8');
        
        // Extract JSON from the file (skip the first line "Test2 result")
        const lines = test2Data.split('\n');
        const jsonData = lines.slice(2).join('\n'); // Skip first two lines
        
        const scanData = JSON.parse(jsonData);
        
        console.log(`✅ Mock Scanner Service: Returning scan data for ${scanData.scan_type} scan`);
        console.log(`📊 Repository: ${scanData.repo_url}`);
        console.log(`🔍 Scan Type: ${scanData.scan_type}`);
        
        res.json(scanData);
    } catch (error) {
        console.error('❌ Mock Scanner Service Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to retrieve scan data'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'mock-scanner-service',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('🚀 Mock Scanner Service running on http://localhost:3000');
    console.log('📡 Available endpoints:');
    console.log(`   GET /scan-report/:scanId - Returns Test2 result data`);
    console.log(`   GET /health - Health check`);
});

module.exports = app;
