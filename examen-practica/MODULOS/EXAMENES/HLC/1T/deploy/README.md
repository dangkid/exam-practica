# Examen HLC - Docker Deployment

## Estructura Simplificada

```
1T/
├── deploy/                     ← Todos los archivos de deployment
│   ├── docker-compose.yml      ← Orquestación
│   ├── Dockerfile.ssh          ← SSH + seguridad
│   ├── Dockerfile.db           ← PostgreSQL
│   └── Dockerfile.web          ← Nginx + React
├── personal/
│   └── pokeapi-app/            ← Aplicación React
└── common/
    └── id_ed25519.pub
```

## Cambios Principales

### ✅ Antes (Compleja)
- 5 Dockerfiles con herencia: ubbase → ubsecurity → ubnginx/ubsgbd → ubreact
- Build: 15 minutos
- Difícil de debuggear

### ✅ Ahora (Simple)
- 3 Dockerfiles independientes
- Build: 5-7 minutos
- Fácil de debuggear
- Sin herencia compleja

## Comandos Rápidos

### Desarrollo Local
```bash
cd deploy
docker compose build
docker compose up -d
docker compose ps
```

### Despliegue en VPS
```bash
# Subir archivos
scp -r deploy/ dangelo@37.60.238.102:~/exam-practica/examen-practica/MODULOS/EXAMENES/HLC/1T/

# Conectar y desplegar
ssh dangelo@37.60.238.102
cd ~/exam-practica/examen-practica/MODULOS/EXAMENES/HLC/1T/deploy
sudo docker compose build
sudo docker compose up -d
```

### Verificar Servicios
```bash
# Web
curl http://localhost

# SSH
ssh -p 2222 root@localhost
# Password: rootpassword

# PostgreSQL
docker exec -it hlc_db psql -U admin -d hlcdb
```

### Limpiar
```bash
docker compose down -v
docker system prune -af
```

## Servicios

| Servicio | Puerto | Contenedor | Descripción |
|----------|--------|------------|-------------|
| ssh | 2222→22 | hlc_ssh | SSH + fail2ban + ufw |
| db | 5432 | hlc_db | PostgreSQL 14 |
| web | 80 | hlc_web | Nginx + React PokeAPI |

### Credenciales
- **SSH**: root / rootpassword
- **PostgreSQL**: admin / admin123 / hlcdb

## Estrategia para el Examen (5 Commits - 4 horas)

### Commit 1: Estructura Base (30 min)
```bash
# Crear carpetas y archivos básicos
mkdir -p deploy personal common
touch deploy/docker-compose.yml deploy/Dockerfile.{ssh,db,web}
touch README.md

git add .
git commit -m "feat: initial project structure"
git push
```

### Commit 2: Servicio PostgreSQL (45 min)
```bash
# Completar deploy/Dockerfile.db
# Añadir servicio 'db' en docker-compose.yml
docker compose build db
docker compose up -d db
docker compose logs db

git add deploy/Dockerfile.db deploy/docker-compose.yml
git commit -m "feat: add PostgreSQL database service"
git push
```

### Commit 3: Servicio SSH/Seguridad (45 min)
```bash
# Completar deploy/Dockerfile.ssh
# Añadir servicio 'ssh' en docker-compose.yml
docker compose build ssh
docker compose up -d ssh
ssh -p 2222 root@localhost

git add deploy/Dockerfile.ssh deploy/docker-compose.yml common/
git commit -m "feat: add SSH security service with fail2ban"
git push
```

### Commit 4: Servicio Web con HTML estático (60 min)
```bash
# Completar deploy/Dockerfile.web (solo nginx + HTML básico)
# Crear personal/pokeapi-app/public/index.html básico
docker compose build web
docker compose up -d web
curl http://localhost

git add deploy/Dockerfile.web personal/
git commit -m "feat: add Nginx web server with static content"
git push
```

### Commit 5: Aplicación React Completa (90 min)
```bash
# Modificar Dockerfile.web (añadir Node.js + build)
# Copiar aplicación React completa
# npm install + npm run build
docker compose build web --no-cache
docker compose up -d web
curl http://localhost

git add personal/pokeapi-app/ deploy/Dockerfile.web
git commit -m "feat: complete React PokeAPI application"
git push
```

## Tips para el Examen

1. **Lee bien el enunciado** - Puede pedir puertos o servicios específicos
2. **Prueba cada servicio antes de commit** - `docker compose up <servicio>`
3. **Usa --no-cache solo si hay problemas** - Ahorra tiempo
4. **Ten comandos preparados** - Copia/pega rápido
5. **Commitea frecuentemente** - Cada 45-60 min
6. **No uses herencia de Dockerfiles** - Complica innecesariamente

## Debugging

```bash
# Ver logs
docker compose logs -f <servicio>

# Rebuild un servicio
docker compose build <servicio> --no-cache

# Entrar a contenedor
docker exec -it hlc_<servicio> bash

# Ver estado
docker compose ps

# Reiniciar servicio
docker compose restart <servicio>
```

## Ventajas de esta Estructura

- ✅ **Simple**: 3 Dockerfiles independientes, sin herencia
- ✅ **Rápida**: Build 5-7 min vs 15 min
- ✅ **Clara**: Un archivo por servicio
- ✅ **Profesional**: Estructura estándar en la industria
- ✅ **Debuggeable**: Fácil encontrar y arreglar problemas
- ✅ **Modular**: Modificar un servicio no afecta otros
