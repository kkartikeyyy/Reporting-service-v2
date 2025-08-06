CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY,
    report_id VARCHAR(255),
    repo_url TEXT,
    scan_type VARCHAR(100),
    status VARCHAR(50),
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pdf_path TEXT,
    docx_path TEXT
);
