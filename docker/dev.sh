#!/usr/bin/env bash

ACTION="${1:-up}"  # default to up

if [[ "$ACTION" == "down" ]]; then
  docker compose --env-file dev.env down
else
  docker compose --env-file dev.env up -d
fi
