# Docker Setup Guide for ShoolinTech Website

## Prerequisites
- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### Option 1: Build and Run with Docker Compose (Recommended)

1. **Clone/Navigate to project directory:**
   ```bash
   cd /path/to/shoolintechllc-website
   ```

2. **Create .env file with MongoDB connection:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shoolintechllc
   JWT_SECRET=your-super-secret-key-here
   PORT=8000
   NODE_ENV=production
   ```

3. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

4. **Access the website:**
   - Open http://localhost:8000 in your browser

5. **View logs:**
   ```bash
   docker-compose logs -f shoolintech-web
   ```

6. **Stop the container:**
   ```bash
   docker-compose down
   ```

---

### Option 2: Build and Run Docker Image Only

1. **Build the Docker image:**
   ```bash
   docker build -t shoolintech:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name shoolintech-website \
     -p 8000:8000 \
     -e MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shoolintechllc \
     -e JWT_SECRET=your-secret-key \
     -e NODE_ENV=production \
     shoolintech:latest
   ```

3. **View logs:**
   ```bash
   docker logs -f shoolintech-website
   ```

4. **Stop the container:**
   ```bash
   docker stop shoolintech-website
   docker rm shoolintech-website
   ```

---

### Option 3: Use MongoDB in Docker (Optional)

To run both the website and MongoDB in Docker:

1. **Uncomment MongoDB service in docker-compose.yml:**
   
   Edit `docker-compose.yml` and uncomment the `mongodb` service section

2. **Start both services:**
   ```bash
   docker-compose up -d
   ```

3. **Update .env with local MongoDB:**
   ```
   MONGODB_URI=mongodb://admin:password@mongodb:27017/shoolintechllc
   ```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Environment mode |
| `PORT` | 8000 | Port to run server on |
| `MONGODB_URI` | mongodb://localhost:27017/shoolintechllc | MongoDB connection string |
| `JWT_SECRET` | your-secret-key-change-in-production | JWT signing secret |

---

## Useful Docker Commands

### View running containers:
```bash
docker ps
```

### View all containers:
```bash
docker ps -a
```

### View container logs:
```bash
docker logs container_name
```

### Execute command in container:
```bash
docker exec -it shoolintech-website sh
```

### Remove image:
```bash
docker rmi shoolintech:latest
```

### Clean up unused Docker resources:
```bash
docker system prune
```

---

## Dockerfile Structure

- **Base Image:** `node:18-alpine` - Lightweight Node.js image
- **Working Directory:** `/app` in container
- **Port:** 8000
- **Health Check:** Verifies container is running every 30 seconds
- **Node Modules:** Excluded from volume mount for performance

---

## Docker Compose Services

### shoolintech-web
- **Build:** From Dockerfile in current directory
- **Container Name:** shoolintech-website
- **Port:** 8000:8000
- **Volumes:** 
  - Code synced with host (live reload)
  - node_modules mounted separately
- **Restart Policy:** unless-stopped
- **Health Check:** Enabled

### mongodb (Optional - Commented Out)
- **Image:** mongo:6
- **Port:** 27017:27017
- **Volume:** mongodb_data for persistence

---

## Production Deployment

For production, consider:

1. **Use MongoDB Atlas** instead of local MongoDB
2. **Set strong JWT_SECRET** environment variable
3. **Use NODE_ENV=production**
4. **Configure reverse proxy** (Nginx) in front of Docker
5. **Use Docker secrets** for sensitive data
6. **Enable SSL/TLS** for HTTPS
7. **Set resource limits** in docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

---

## Troubleshooting

### Container exits immediately
- Check logs: `docker logs shoolintech-website`
- Verify MONGODB_URI is correct
- Ensure port 8000 is not already in use

### Connection refused to MongoDB
- Verify MongoDB is running
- Check MONGODB_URI in .env
- For local MongoDB, use host.docker.internal:27017

### Port 8000 already in use
- Change port mapping in docker-compose.yml: `"8001:8000"`
- Or stop conflicting container: `docker ps` and `docker stop <container_id>`

### Permission denied
- Use `sudo` for Docker commands if not added to docker group
- Add user to docker group: `sudo usermod -aG docker $USER`

---

## Next Steps

1. Build and run: `docker-compose up -d`
2. Access website: http://localhost:8000
3. Configure MongoDB connection in `.env`
4. Deploy to production using Docker registries or container orchestration (Kubernetes)

For more info: [Docker Documentation](https://docs.docker.com/)
