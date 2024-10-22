#!/bin/bash
psql <<-EOSQL
CREATE USER n8n WITH PASSWORD '$N8N_USER_DB_PASSWORD';
CREATE DATABASE n8n;
GRANT ALL PRIVILEGES ON DATABASE n8n to n8n;
ALTER DATABASE n8n OWNER TO n8n;
CREATE USER elc WITH PASSWORD '$ELC_USER_DB_PASSWORD';
CREATE DATABASE elc;
GRANT ALL PRIVILEGES ON DATABASE elc to elc;
\connect elc;
CREATE TYPE proficiency_level AS ENUM ('Awareness', 'Working', 'Practitioner', 'Expert');
CREATE TABLE courses (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('eLearning', 'File', 'Video', 'eBook')),
    duration INT NOT NULL,
    thumbnail TEXT,
    url TEXT NOT NULL,
    proficiency proficiency_level NOT NULL,  -- Use the defined enum type here
    active BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON courses TO n8n;
GRANT SELECT, INSERT, UPDATE, DELETE ON courses TO elc;
EOSQL