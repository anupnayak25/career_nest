# Deployment Guide

This guide covers deploying Career Nest to production environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Pre-deployment Checklist](#pre-deployment-checklist)
- [Backend Deployment](#backend-deployment)
- [AI Server Deployment](#ai-server-deployment)
- [Website Deployment](#website-deployment)
- [Database Deployment](#database-deployment)
- [Environment Variables](#environment-variables)
- [Security Considerations](#security-considerations)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Troubleshooting](#troubleshooting)

## 🌟 Overview

Career Nest consists of multiple components that can be deployed independently:

1. **Backend API** - Node.js/Express server
2. **AI Server** - Python/Flask server
3. **Website** - React static site
4. **Database** - MySQL database
5. **Mobile App** - Flutter (published to app stores)

### Recommended Architecture

```
┌─────────────────┐
│   CDN/Static    │ ← Website (React)
│   Hosting       │
└─────────────────┘
         │
    ┌────┴────┐
    │   LB    │ (Load Balancer)
    └────┬────┘
         │
    ┌────┴────────────────┐
    │                     │
┌───▼──────┐      ┌──────▼────┐
│ Backend  │      │ AI Server │
│ (Node.js)│      │ (Python)  │
└───┬──────┘      └───────────┘
    │
┌───▼────────┐
│   MySQL    │
│  Database  │
└────────────┘
```

## ✅ Pre-deployment Checklist

- [ ] All code is committed and pushed
- [ ] All tests pass locally
- [ ] Environment variables are documented
- [ ] Database schema is up to date
- [ ] Security vulnerabilities are addressed
- [ ] Error handling is implemented
- [ ] Logging is configured
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Backup strategy is defined
- [ ] SSL certificates are obtained
- [ ] Domain names are configured

## 🚀 Backend Deployment

### Option 1: Deploy to Heroku

#### 1. Install Heroku CLI
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 2. Login to Heroku
```bash
heroku login
```

#### 3. Create Heroku App
```bash
cd backend
heroku create career-nest-backend
```

#### 4. Set Environment Variables
```bash
heroku config:set PORT=5000
heroku config:set DB_HOST=your_db_host
heroku config:set DB_USER=your_db_user
heroku config:set DB_PASSWORD=your_db_password
heroku config:set DB_NAME=carrer_nest
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set AI_SERVER_URL=https://your-ai-server.herokuapp.com
heroku config:set BACKEND_PUBLIC_BASE=https://career-nest-backend.herokuapp.com
```

#### 5. Create Procfile
```bash
echo "web: node server.js" > Procfile
```

#### 6. Deploy
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### Option 2: Deploy to DigitalOcean/VPS

#### 1. Setup Server
```bash
# SSH into your server
ssh root@your_server_ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

#### 2. Clone Repository
```bash
cd /var/www
git clone https://github.com/anupnayak25/career_nest.git
cd career_nest/backend
```

#### 3. Install Dependencies
```bash
npm install --production
```

#### 4. Setup Environment Variables
```bash
nano .env
# Add your production environment variables
```

#### 5. Start with PM2
```bash
pm2 start server.js --name career-nest-backend
pm2 save
pm2 startup
```

#### 6. Setup Nginx as Reverse Proxy
```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/career-nest
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomai.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/career-nest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Option 3: Deploy to AWS EC2

Similar to DigitalOcean, but:
1. Launch an EC2 instance
2. Configure security groups (allow ports 80, 443, 22)
3. Follow VPS deployment steps above

## 🤖 AI Server Deployment

### Option 1: Deploy to Heroku

#### 1. Create Heroku App
```bash
cd ai_server
heroku create career-nest-ai-server
```

#### 2. Add Python Buildpack
```bash
heroku buildpacks:set heroku/python
```

#### 3. Create Procfile
```bash
echo "web: gunicorn -w 4 -b 0.0.0.0:\$PORT app:app" > Procfile
```

#### 4. Ensure Gunicorn is in requirements.txt
```bash
echo "gunicorn" >> requirements.txt
```

#### 5. Deploy
```bash
git add .
git commit -m "Prepare AI server for deployment"
git push heroku main
```

### Option 2: Deploy to VPS

#### 1. Install Python and Dependencies
```bash
ssh root@your_server_ip

sudo apt update
sudo apt install -y python3 python3-pip python3-venv ffmpeg
```

#### 2. Setup Application
```bash
cd /var/www/career_nest/ai_server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 3. Start with Supervisor
```bash
sudo apt install supervisor

# Create supervisor config
sudo nano /etc/supervisor/conf.d/ai-server.conf
```

Add configuration:
```ini
[program:ai-server]
directory=/var/www/career_nest/ai_server
command=/var/www/career_nest/ai_server/venv/bin/gunicorn -w 4 -b 0.0.0.0:7860 app:app
user=www-data
autostart=true
autorestart=true
stderr_logfile=/var/log/ai-server.err.log
stdout_logfile=/var/log/ai-server.out.log
```

Start the service:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start ai-server
```

#### 4. Setup Nginx
```nginx
server {
    listen 80;
    server_name ai.yourdomain.com;

    location / {
        proxy_pass http://localhost:7860;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 100M;  # For large video uploads
    }
}
```

## 🌐 Website Deployment

### Option 1: Deploy to Vercel

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
cd website
vercel --prod
```

#### 3. Set Environment Variables in Vercel Dashboard
- `VITE_API_URL=https://api.yourdomain.com`

### Option 2: Deploy to Netlify

#### 1. Build the Website
```bash
cd website
npm run build
```

#### 2. Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### 3. Set Environment Variables in Netlify Dashboard
- `VITE_API_URL=https://api.yourdomain.com`

### Option 3: Deploy to Static Hosting (S3, GitHub Pages, etc.)

#### 1. Build
```bash
npm run build
```

#### 2. Upload dist/ folder to your hosting service

For GitHub Pages:
```bash
npm install -g gh-pages
gh-pages -d dist
```

## 💾 Database Deployment

### Option 1: Managed Database (Recommended)

Use managed database services for production:

- **AWS RDS** (MySQL)
- **Google Cloud SQL**
- **DigitalOcean Managed Databases**
- **PlanetScale**
- **Aiven** (as currently used)

Benefits:
- Automated backups
- High availability
- Automatic scaling
- Monitoring included

### Option 2: Self-hosted MySQL

#### 1. Install MySQL
```bash
sudo apt install mysql-server
```

#### 2. Secure Installation
```bash
sudo mysql_secure_installation
```

#### 3. Create Database and User
```sql
CREATE DATABASE carrer_nest;
CREATE USER 'carrer_nest_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON carrer_nest.* TO 'carrer_nest_user'@'%';
FLUSH PRIVILEGES;
```

#### 4. Import Schema
```bash
mysql -u carrer_nest_user -p carrer_nest < carrer_nest.sql
```

#### 5. Configure for Remote Access (if needed)
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Change bind-address to 0.0.0.0
sudo systemctl restart mysql
```

## 🔐 Environment Variables

### Production Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DB_URL=mysql://user:pass@host:port/db?ssl-mode=REQUIRED
DB_HOST=production-db-host
DB_PORT=3306
DB_USER=production_user
DB_PASSWORD=strong_secure_password
DB_NAME=carrer_nest
SSL_MODE=REQUIRED
SSL_CERT_BASE64=your_base64_encoded_certificate
JWT_SECRET=very_long_and_secure_random_string_at_least_32_characters
AI_SERVER_URL=https://ai.yourdomain.com
BACKEND_PUBLIC_BASE=https://api.yourdomain.com
```

#### Website (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com
```

## 🔒 Security Considerations

### Backend Security

1. **Use HTTPS/SSL**
   - Obtain SSL certificates (Let's Encrypt)
   - Force HTTPS redirects

2. **Environment Variables**
   - Never commit `.env` files
   - Use secure secret management

3. **Database**
   - Use strong passwords
   - Enable SSL connections
   - Limit user privileges

4. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: ['https://yourdomain.com'],
     credentials: true
   }));
   ```

5. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

6. **Helmet for Security Headers**
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

### AI Server Security

1. **API Key Authentication**
2. **Request size limits**
3. **Input validation**
4. **Resource limits** (prevent abuse)

## 📊 Monitoring and Logging

### Backend Monitoring

#### 1. Winston Logger (already configured)
```javascript
const logger = require('./logger');
logger.info('Server started');
logger.error('Error occurred', { error: err });
```

#### 2. PM2 Monitoring
```bash
pm2 monit
pm2 logs career-nest-backend
```

#### 3. External Monitoring
- **New Relic** - Application performance monitoring
- **Datadog** - Infrastructure and application monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay and logging

### Database Monitoring

- Slow query log analysis
- Connection pool monitoring
- Disk space monitoring
- Backup verification

## 💾 Backup and Recovery

### Database Backups

#### Automated Daily Backups
```bash
#!/bin/bash
# /usr/local/bin/backup-db.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="carrer_nest"

mkdir -p $BACKUP_DIR

mysqldump -u user -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

Setup cron job:
```bash
crontab -e
# Add:
0 2 * * * /usr/local/bin/backup-db.sh
```

### Code Backups

- Use Git for version control
- Maintain multiple remotes (GitHub + backup)
- Tag releases

### File Backups

- Backup uploaded videos regularly
- Use cloud storage (S3, Google Cloud Storage)

## 🔧 Troubleshooting

### Common Issues

#### 1. 502 Bad Gateway
- Check if backend server is running
- Verify Nginx configuration
- Check firewall rules

#### 2. Database Connection Errors
- Verify credentials
- Check if database server is running
- Verify network connectivity
- Check SSL configuration

#### 3. CORS Errors
- Update CORS configuration in backend
- Verify allowed origins

#### 4. High Memory Usage (AI Server)
- Increase server resources
- Implement request queuing
- Add request size limits

#### 5. File Upload Failures
- Check disk space
- Verify file size limits
- Check folder permissions

### Logs to Check

```bash
# Backend logs (PM2)
pm2 logs career-nest-backend

# AI Server logs (Supervisor)
sudo tail -f /var/log/ai-server.out.log
sudo tail -f /var/log/ai-server.err.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

## 🎯 Performance Optimization

1. **Enable Gzip Compression** (Nginx)
2. **Use CDN** for static assets
3. **Database Indexing**
4. **Connection Pooling**
5. **Caching** (Redis)
6. **Load Balancing**
7. **Horizontal Scaling**

## 📝 Post-Deployment

1. **Test all endpoints**
2. **Verify database connections**
3. **Test file uploads**
4. **Test AI evaluation**
5. **Monitor error logs**
6. **Set up alerts**
7. **Document the deployment**

## 🆘 Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Search existing issues
4. Create a new issue with deployment details

---

**Remember**: Always test in a staging environment before deploying to production! 🚀
