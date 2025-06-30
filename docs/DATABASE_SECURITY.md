# Database Security Configuration

## Overview
This document outlines the database security configuration for UBI Compass.

## Password Security

### ⚠️ Important Security Update
The default database password has been changed from `password` to a secure password for production readiness.

### Current Configuration
- **Database**: PostgreSQL v16
- **Port**: 7000 (custom port for security)
- **Database Name**: UBIDatabase
- **Username**: postgres
- **Password**: `UBI_Compass_2024_Secure!`

### Files Updated
The following files have been updated with the new secure password:

1. **Main Environment Files**:
   - `.env` - Main application environment
   - `ubi-backend/.env` - Backend service environment

2. **Database Connection Files**:
   - `src/lib/db.ts` - Frontend database connection
   - `ubi-backend/services/statscan-data-service.ts` - Backend service

3. **Example Files**:
   - `.env.example` - Template for new installations

### Production Deployment

For production deployment, you should:

1. **Generate a unique password** for each environment
2. **Use environment variables** instead of hardcoded values
3. **Enable SSL/TLS** for database connections
4. **Restrict database access** to specific IP addresses
5. **Use database user with minimal privileges**

### Recommended Production Password
Generate a strong password using:
```bash
# Option 1: OpenSSL (Linux/Mac)
openssl rand -base64 32

# Option 2: PowerShell (Windows)
[System.Web.Security.Membership]::GeneratePassword(32, 8)

# Option 3: Online generator
# Use a reputable password generator with 32+ characters
```

### Environment Variable Setup

For production, set these environment variables:

```bash
# Database Configuration
DB_USER=ubi_compass_user
DB_HOST=your-database-host
DB_NAME=UBIDatabase
DB_PASSWORD=your_super_secure_password_here
DB_PORT=5432

# Connection String Format
DATABASE_URL=postgresql://username:password@host:port/database
```

### Security Best Practices

1. **Never commit passwords** to version control
2. **Use different passwords** for dev/staging/production
3. **Rotate passwords** regularly
4. **Monitor database access** logs
5. **Use SSL certificates** for encrypted connections
6. **Backup encryption** for database backups

### Local Development

For local development, the current password `UBI_Compass_2024_Secure!` is acceptable, but ensure:

- PostgreSQL is not exposed to external networks
- Firewall rules restrict access to localhost only
- Regular security updates are applied

### Troubleshooting

If you encounter authentication errors:

1. **Check password in all config files**
2. **Verify PostgreSQL user exists**
3. **Confirm database permissions**
4. **Test connection manually**:
   ```bash
   psql -h localhost -p 7000 -U postgres -d UBIDatabase
   ```

### Contact

For security concerns or questions, refer to the main project documentation or create an issue in the repository.
