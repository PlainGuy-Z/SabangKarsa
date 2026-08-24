# Deploy SabangKarsaBE-Next ke VPS Hostinger

## 📋 Prerequisites
- VPS Hostinger sudah aktif
- Domain/subdomain (opsional tapi recommended)
- SSH access ke VPS

## 🚀 Deployment Steps

### 1. SSH ke VPS Hostinger
```bash
ssh root@your-vps-ip
# atau
ssh username@your-vps-ip
```

### 2. Install Node.js & PM2
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Verify
node -v
npm -v

# Install PM2 (Process Manager)
npm install -g pm2
```

### 3. Install MongoDB
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
apt update
apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod
systemctl status mongod
```

### 4. Clone & Setup Backend
```bash
# Create directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/shafadisyaaulia/SabangKarsaBE_New.git
cd SabangKarsaBE_New

# Install dependencies
npm install

# Create .env file
nano .env
```

### 5. Configure .env
```env
# MongoDB (local or Atlas)
MONGO_URI=mongodb://localhost:27017/sabangkarsa

# Server
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=generate_a_super_secure_random_string_here

# Frontend URL
FRONTEND_URL=https://your-nextjs-domain.vercel.app

# Xendit (Get from https://dashboard.xendit.co)
XENDIT_SECRET_KEY=xnd_production_your_key_here
XENDIT_PUBLIC_KEY=xnd_public_production_your_key_here
XENDIT_CALLBACK_TOKEN=your_webhook_callback_token

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=https://your-nextjs-domain.vercel.app
```

Save: `Ctrl+X`, `Y`, `Enter`

### 6. Update index.js untuk CORS
```javascript
// Update CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### 7. Start dengan PM2
```bash
# Start application
pm2 start index.js --name sabangkarsa-api

# Auto-start on server reboot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs sabangkarsa-api
```

### 8. Install & Configure Nginx
```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/sabangkarsa-api
```

Paste configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Ganti dengan domain/IP anda

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/sabangkarsa-api /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

### 9. Install SSL Certificate (Free dengan Let's Encrypt)
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d api.yourdomain.com

# Auto-renewal
systemctl enable certbot.timer
```

### 10. Configure Firewall
```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

### 11. Configure Xendit Webhook
1. Login ke Xendit Dashboard: https://dashboard.xendit.co
2. Go to Settings → Webhooks
3. Add webhook URL: `https://api.yourdomain.com/api/payments/webhook`
4. Copy callback token dan paste ke `.env` sebagai `XENDIT_CALLBACK_TOKEN`

## ✅ Test Deployment

### Test API
```bash
# From VPS
curl http://localhost:3001

# From outside
curl https://api.yourdomain.com
```

### Test Endpoints
```bash
# Health check
curl https://api.yourdomain.com/

# Auth
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔧 PM2 Commands (Maintenance)

```bash
# View logs
pm2 logs sabangkarsa-api

# Restart application
pm2 restart sabangkarsa-api

# Stop application
pm2 stop sabangkarsa-api

# Monitor
pm2 monit

# View detailed info
pm2 info sabangkarsa-api
```

## 🔄 Update Application

```bash
cd /var/www/SabangKarsaBE_New

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Restart with PM2
pm2 restart sabangkarsa-api
```

## 📱 Update Frontend .env

Setelah backend deployed, update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

Deploy frontend ke Vercel:
```bash
cd ../sabangkarsa-next
git push origin main
# Auto-deploy via Vercel
```

## 🐛 Troubleshooting

### Check PM2 logs
```bash
pm2 logs --lines 100
```

### Check Nginx logs
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### MongoDB issues
```bash
systemctl status mongod
journalctl -u mongod
```

### Restart services
```bash
pm2 restart all
systemctl restart nginx
systemctl restart mongod
```

## 🔒 Security Best Practices

1. **Strong passwords** untuk MongoDB & JWT_SECRET
2. **Firewall** enabled dengan ufw
3. **SSL** certificate installed
4. **Regular updates**: `apt update && apt upgrade`
5. **Backup database** regularly
6. **Monitor logs** dengan PM2

## 📊 Monitoring (Optional)

Install monitoring tools:
```bash
# Install htop for resource monitoring
apt install -y htop

# Setup PM2 Plus (free monitoring)
pm2 link [secret] [public]
```

## 💾 Database Backup

```bash
# Create backup script
nano /root/backup-mongodb.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db sabangkarsa --out /backups/mongodb_$DATE
find /backups -type d -mtime +7 -exec rm -rf {} \;
```

```bash
chmod +x /root/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /root/backup-mongodb.sh
```

## 🎉 Done!

Your backend is now live at:
- HTTP: `http://api.yourdomain.com`
- HTTPS: `https://api.yourdomain.com`

Test full flow:
1. Register/Login via frontend
2. Browse accommodation
3. Book & proceed to payment (Xendit)
4. Payment callback updates booking status

---

Need help? Check logs first:
```bash
pm2 logs sabangkarsa-api --lines 50
```
