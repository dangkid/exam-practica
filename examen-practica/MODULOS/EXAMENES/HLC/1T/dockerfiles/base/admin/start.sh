#!/bin/bash
# Script de inicio para contenedores base

# Iniciar SSH
service ssh start

# Mantener el contenedor activo
tail -f /dev/null
