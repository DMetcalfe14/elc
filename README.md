# Enterprise Learning Catalogue

## Description

This project is a full-stack solution for demonstrating the end-to-end process of adding content to an Enterprise Learning Catalogue. Learning materials can be added to the catalogue via SFTP (for legacy systems) or via API. The setup is containerized using Docker and includes the following services:

- **n8n**: Automation tool for building workflows.
- **PostgreSQL**: Database for n8n and the ELC (Enterprise Learning Cloud) API.
- **Mailhog**: Email testing tool that captures outgoing emails for development purposes.
- **MinIO**: Object storage service for file storage.
- **Atmoz SFTP**: Secure FTP server for file transfers.
- **ELC API**: Custom API for managing learning resources.
- **Learning Platform (LXP)**: A fake learning platform for demonstration purposes.

## Project Structure

```
project-root/
├── api/               # Backend API code (Node.js)
├── app/               # Frontend for the Learning Platform (React)
├── db-init/          # Database initialization scripts
├── docker-compose.yml # Docker Compose configuration
├── .env               # Environment variables (not committed)
└── README.md          # Project documentation
```

## Services Overview

### 1. **n8n (Automation Tool)**
- n8n is a powerful workflow automation tool that connects to various services, databases, and APIs.
- **Port**: `5678`
- **Basic Auth**: Enabled with admin credentials via environment variables.
- **Database**: Uses PostgreSQL for persistence.
  
### 2. **PostgreSQL (Database)**
- PostgreSQL serves as the database for both n8n and the ELC API.
- **Port**: `5432`
- **Volumes**: Persistent storage of the database data.
  
### 3. **Mailhog (Email Testing)**
- Captures outgoing emails and provides a web interface to view them.
- **Ports**: 
  - SMTP: `1025` (for email sending)
  - Web UI: `8025` (for viewing captured emails)

### 4. **MinIO (Object Storage)**
- MinIO acts as an object storage solution, similar to AWS S3.
- **Ports**:
  - API: `9000`
  - Console: `9001`
- **MinIO Console**: Provides a management interface to interact with the MinIO instance.

### 5. **SFTP (File Transfer)**
- Secure FTP server for file uploads and downloads.
- **Port**: `2222`

### 6. **ELC API**
- Custom Node.js API for managing course data.
- **Port**: `3000`
- **Database**: Connects to PostgreSQL and interacts with MinIO for storing course thumbnails.

### 7. **Fake Learning Platform (LXP)**
- A basic frontend for demonstration purposes.
- **Port**: `80`

## Prerequisites

- Docker and Docker Compose
- `.env` file with necessary environment variables

## Environment Variables

Create a `.env` file in the project root and add the following variables:

```bash
# .env

# PostgreSQL
POSTGRES_PASSWORD=your_postgres_password
N8N_USER_DB_PASSWORD=your_n8n_db_password
ELC_USER_DB_PASSWORD=your_elc_db_password

# n8n Admin
N8N_ADMIN_PASSWORD=your_n8n_admin_password

# MinIO
MINIO_ROOT_PASSWORD=your_minio_root_password

# SFTP
SFTP_USERS=username:password:::upload
```

- **POSTGRES_PASSWORD**: PostgreSQL admin password.
- **N8N_USER_DB_PASSWORD**: Password for the `n8n` PostgreSQL user.
- **ELC_USER_DB_PASSWORD**: Password for the `elc` PostgreSQL user.
- **N8N_ADMIN_PASSWORD**: Password for accessing the n8n dashboard.
- **MINIO_ROOT_PASSWORD**: MinIO root password.
- **SFTP_USERS**: SFTP user configuration (e.g., `username:password:::upload`).

## Installation and Setup

### 1. Clone the repository:

```bash
git clone https://github.com/douglasm14/elc.git
cd elc
```

### 2. Create the `.env` file:

Follow the instructions above to create a `.env` file in the project root with the required environment variables.

### 3. Build and start the services:

```bash
docker-compose up --build
```

This will launch all the services defined in the `docker-compose.yml` file.

### 4. Access the services:

- **n8n (Automation Tool)**: [http://localhost:5678](http://localhost:5678)
- **Mailhog (Email Testing UI)**: [http://localhost:8025](http://localhost:8025)
- **MinIO API**: [http://localhost:9000](http://localhost:9000)
- **ELC API**: [http://localhost:3000](http://localhost:3000)
- **Fake Learning Platform (LXP)**: [http://localhost](http://localhost)

### 5. Stopping the services:

To stop and remove the containers, run:

```bash
docker-compose down
```

## Customizing the Project

### Initializing the Database

To initialize the PostgreSQL database with seed data, you can add SQL scripts to the `db-init/` directory. These will be executed when the database container is first created.