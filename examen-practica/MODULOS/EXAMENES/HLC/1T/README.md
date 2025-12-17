# 📦 EXAMEN FINAL HLC - Arquitectura Docker en Capas

**Estudiante:** D'Angelo Magallanes  
**Fecha:** 16-17 Diciembre 2025  
**Curso:** ASIR 2025/26

## 🏗️ Arquitectura del Proyecto

```
ubbase (Ubuntu Base)
    ↓
ubsecurity (SSH + Seguridad)
    ↓
    ├─→ ubsgbd (PostgreSQL)
    └─→ ubnginx (Nginx)
           ↓
        ubreact (React + PokeAPI)
```

## 📋 Componentes

### 1. **ubbase** - Imagen Base Ubuntu
- Ubuntu 22.04
- Herramientas básicas (curl, wget, vim, net-tools)
- Base para todas las demás imágenes

### 2. **ubsecurity** - Capa de Seguridad
- Construida sobre `ubbase`
- OpenSSH Server (puerto 5724)
- Fail2ban y UFW
- Usuario root con password configurado

### 3. **ubsgbd** - Base de Datos
- Construida sobre `ubsecurity`
- PostgreSQL 14+
- Puerto: 5432
- Credenciales:
  - Usuario: `admin`
  - Password: `admin123`
  - Base de datos: `hlcdb`

### 4. **ubnginx** - Servidor Web
- Construida sobre `ubsecurity`
- Nginx como reverse proxy
- Puerto: 80
- Redirige tráfico a la aplicación React

### 5. **ubreact** - Aplicación React
- Construida sobre `ubnginx`
- Node.js + React 18
- Aplicación PokeAPI
- Puerto: 3000

## 🚀 Despliegue

### Opción 1: Script Automático (Recomendado)

```bash
cd /Users/dangelomagallanes/Desktop/ASIR\ 2025\:26/HLC/Docker/Caronte/proyectos/examen-final
chmod +x build-and-deploy.sh
./build-and-deploy.sh
```

### Opción 2: Manual

```bash
# 1. Construir imágenes en orden
docker build -t ubbase:latest -f dockerfiles/Dockerfile.ubbase .
docker build -t ubsecurity:latest -f dockerfiles/Dockerfile.ubsecurity .
docker build -t ubsgbd:latest -f dockerfiles/Dockerfile.ubsgbd .
docker build -t ubnginx:latest -f dockerfiles/Dockerfile.ubnginx .

# 2. Instalar dependencias React
cd pokeapi-app && npm install && cd ..

# 3. Construir imagen React
docker build -t ubreact:latest -f dockerfiles/Dockerfile.ubreact .

# 4. Levantar servicios
docker-compose up -d
```

## 🌐 Puertos Expuestos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| React App | 3000 | Aplicación PokeAPI |
| Nginx | 80 | Servidor web/proxy |
| PostgreSQL | 5432 | Base de datos |
| SSH (ubsecurity) | 5724 | Acceso SSH base |
| SSH (ubsgbd) | 5725 | Acceso SSH BD |
| SSH (ubnginx) | 5726 | Acceso SSH Nginx |
| SSH (ubreact) | 5727 | Acceso SSH React |

## 📱 Acceso a la Aplicación

- **Aplicación React:** http://localhost:3000
- **A través de Nginx:** http://localhost:80
- **SSH a contenedor:** `ssh root@localhost -p 5724` (password: `rootpassword`)

## 🔄 Push a VPS y Repositorio

### Configurar y ejecutar push

```bash
# 1. Editar push-to-vps-and-repo.sh con tus datos:
#    - VPS_USER: tu usuario
#    - VPS_HOST: IP de tu VPS
#    - VPS_PATH: ruta en el VPS
#    - REMOTE_REPO_URL: URL del repo del profesor

# 2. Ejecutar script
chmod +x push-to-vps-and-repo.sh
./push-to-vps-and-repo.sh
```

El script hará:
1. ✅ Guardar imágenes Docker como archivos .tar
2. ✅ Transferir proyecto al VPS vía rsync
3. ✅ Cargar y ejecutar contenedores en VPS
4. ✅ Push a repositorio Git del profesor

## 📊 Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f ubreact

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Conectar a un contenedor
docker exec -it hlc_ubreact /bin/bash

# Ver imágenes construidas
docker images | grep ub
```

## 🐛 Resolución de Problemas

### Si React no inicia:
```bash
docker-compose down
cd pokeapi-app
rm -rf node_modules package-lock.json
npm install
cd ..
docker-compose up --build
```

### Si PostgreSQL no inicia:
```bash
docker-compose down -v  # Elimina volúmenes
docker-compose up -d
```

### Si hay conflictos de puertos:
```bash
# Ver qué proceso usa el puerto
lsof -i :3000
# Matar el proceso si es necesario
kill -9 <PID>
```

## 📝 Checklist para el Examen

- [ ] Todas las imágenes construidas correctamente
- [ ] Docker-compose levanta todos los servicios
- [ ] Aplicación PokeAPI funciona en localhost:3000
- [ ] Nginx redirige correctamente en puerto 80
- [ ] PostgreSQL accesible en puerto 5432
- [ ] SSH funciona en puerto 5724
- [ ] Estructura de capas respetada (ubbase → ubsecurity → ubsgbd/ubnginx → ubreact)
- [ ] Push al VPS exitoso
- [ ] Push al repositorio del profesor exitoso
- [ ] Documentación completa

## 🎯 Demostración en el Examen

1. **Mostrar arquitectura:** Explicar la estructura de capas
2. **Construir imágenes:** `./build-and-deploy.sh`
3. **Verificar servicios:** `docker-compose ps`
4. **Mostrar aplicación:** Abrir http://localhost:3000
5. **Probar SSH:** `ssh root@localhost -p 5724`
6. **Mostrar puertos:** `docker-compose ps` muestra todos los puertos
7. **Push a VPS:** `./push-to-vps-and-repo.sh`
8. **Push a repo:** El mismo script hace ambos push

## 🔑 Credenciales

### SSH
- Usuario: `root`
- Password: `rootpassword`

### PostgreSQL
- Usuario: `admin`
- Password: `admin123`
- Base de datos: `hlcdb`
- Host: `localhost:5432`

## 📚 Tecnologías Utilizadas

- **Docker & Docker Compose** - Containerización
- **Ubuntu 22.04** - Sistema operativo base
- **OpenSSH** - Acceso remoto
- **Nginx** - Servidor web y reverse proxy
- **PostgreSQL** - Base de datos
- **Node.js** - Runtime JavaScript
- **React 18** - Framework frontend
- **PokeAPI** - API pública de Pokémon
- **Axios** - Cliente HTTP

## 📖 Referencias

- [PokeAPI Documentation](https://pokeapi.co/docs/v2)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [React Documentation](https://react.dev/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**¡Buena suerte en el examen! 🚀**
