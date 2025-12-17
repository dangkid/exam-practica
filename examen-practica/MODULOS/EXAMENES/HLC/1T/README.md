# Examen HLC - Arquitectura Docker en Capas

## Arquitectura en Capas

```
Layer 1: ubbase (Ubuntu 22.04 + herramientas)
           ↓
Layer 2: ubsecurity (SSH + fail2ban)
           ↓       ↓
Layer 3:  ubsgbd   ubnginx
      (PostgreSQL) (Nginx)
                     ↓
Layer 4:          ubreact
                (React PokeAPI)
```

## Orden de Build

```bash
docker build -t ubbase:latest -f dockerfiles/base/ubbase .
docker build -t ubsecurity:latest -f dockerfiles/base/ubsecurity .
docker build -t ubsgbd:latest -f dockerfiles/base/ubsgbd .
docker build -t ubnginx:latest -f dockerfiles/base/ubnginx .
docker compose build ubreact
docker compose up -d
```

## Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| ubsecurity | 2222→22 | SSH server |
| ubsgbd | 5432 | PostgreSQL |
| ubreact | 80 | React + Nginx |

## Verificar

```bash
curl http://localhost
ssh -p 2222 root@localhost
docker exec -it hlc_ubsgbd psql -h localhost -U admin -d hlcdb
```
