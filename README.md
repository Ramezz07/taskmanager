# 🚀 TaskManager — 3-Tier Deployment Project

A full-stack Task Manager app built with **React + Node.js + MongoDB Atlas**, deployed via **Jenkins → S3 → CloudFront** (frontend) and **GitHub Actions → EC2 → Docker** (backend).

---

## 📁 Project Structure

```
app/
├── frontend/               # React app
│   ├── src/
│   │   ├── api.js          # Axios instance with interceptors
│   │   ├── App.js          # Routes
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── TaskCard.js
│   │   │   └── TaskModal.js
│   │   └── pages/
│   │       ├── LoginPage.js
│   │       ├── RegisterPage.js
│   │       ├── DashboardPage.js
│   │       └── TasksPage.js
│   └── package.json
├── backend/                # Node.js + Express API
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/auth.js
│   ├── Dockerfile
│   ├── deploy.sh
│   └── package.json
├── Jenkinsfile.frontend    # Frontend CI/CD: Jenkins → S3 → CloudFront
└── Jenkinsfile.backend     # Backend CI/CD:  Jenkins → SSH → EC2 → Docker
```

---

## 🛠️ Local Development

### 1. Backend (WSL Ubuntu)
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas URI
npm install
npm run dev         # Runs on http://localhost:5000
```

### 2. Frontend (WSL Ubuntu)
```bash
cd frontend
cp .env.example .env
# .env already points to localhost:5000
npm install
npm start           # Runs on http://localhost:3000
```

---

## ☁️ Production Deployment

### Step 1 — MongoDB Atlas
1. Create free cluster at https://cloud.mongodb.com
2. **Network Access** → Add EC2 Elastic IP
3. **Database Access** → Create user with readWrite role
4. Copy connection string → paste into EC2's `/home/ubuntu/.env`

### Step 2 — Backend (EC2 + Docker)
```bash
# On EC2 (Ubuntu 22.04)
sudo apt update && sudo apt install -y docker.io git
sudo usermod -aG docker ubuntu  # then re-login

# Clone repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ~/app
cd ~/app/backend

# Create .env (NEVER commit this)
cp .env.example .env
nano .env   # Add MONGO_URI, JWT_SECRET, PORT=5000, CORS_ORIGIN=https://your-cf-url

# Make deploy script executable
chmod +x deploy.sh
bash deploy.sh   # First deploy
```

**EC2 Security Group rules:**
| Port | Source    | Purpose         |
|------|-----------|-----------------|
| 22   | Your IP   | SSH             |
| 5000 | 0.0.0.0/0 | API (or restrict to CloudFront IPs) |

**GitHub Secrets** (Settings → Secrets):
- `EC2_HOST` = your EC2 Elastic IP
- `EC2_USER` = ubuntu
- `EC2_SSH_PRIVATE_KEY` = paste your `.pem` file contents

### Step 3 — Frontend (S3 + CloudFront)
1. **Create S3 bucket** — enable Static Website Hosting
2. **Create CloudFront distribution** — origin = S3 bucket (use OAC)
   - Default root object: `index.html`
   - Custom error: 404 → `/index.html` (for React Router)
3. **Jenkins Setup (Two Pipeline Jobs):**
   - Install plugins: `NodeJS`, `AWS Steps`, `Pipeline`, `SSH Agent`
   - Add AWS IAM credentials → ID: `aws-credentials` (Access Key + Secret Key)
   - Add EC2 private key → ID: `ec2-ssh-key` (SSH Username with private key)
   - Create **Pipeline job: frontend** → SCM → repo → Script Path: `Jenkinsfile.frontend`
   - Create **Pipeline job: backend** → SCM → repo → Script Path: `Jenkinsfile.backend`
4. Set GitHub Webhook → `http://YOUR_JENKINS_URL/github-webhook/`

| Credential ID     | Type                          | Used In           |
|-------------------|-------------------------------|-------------------|
| `aws-credentials` | AWS Access Key + Secret Key   | Frontend pipeline |
| `ec2-ssh-key`     | SSH Username with Private Key | Backend pipeline  |

---

## 🔌 API Endpoints

| Method | Endpoint                  | Auth | Description         |
|--------|---------------------------|------|---------------------|
| POST   | /api/auth/register        | ❌   | Register user       |
| POST   | /api/auth/login           | ❌   | Login user          |
| GET    | /api/auth/me              | ✅   | Get current user    |
| GET    | /api/tasks                | ✅   | Get all tasks       |
| POST   | /api/tasks                | ✅   | Create task         |
| GET    | /api/tasks/:id            | ✅   | Get single task     |
| PUT    | /api/tasks/:id            | ✅   | Update task         |
| DELETE | /api/tasks/:id            | ✅   | Delete task         |
| GET    | /api/tasks/stats/summary  | ✅   | Dashboard stats     |

---

## 🔐 Environment Variables

### Backend `/home/ubuntu/.env` (EC2 — never commit)
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/taskmanager
JWT_SECRET=your_super_long_random_secret
CORS_ORIGIN=https://dXXXXXXXXXXXX.cloudfront.net
```

### Frontend (set in Jenkinsfile env block)
```
REACT_APP_API_URL=http://YOUR_EC2_ELASTIC_IP:5000/api
```
