#!/usr/bin/env bash

ACTION="${1:-up}"  # default to up

if [[ "$ACTION" == "down" ]]; then
  docker compose --env-file prod.env down
else
  docker compose --env-file prod.env up -d
fi
