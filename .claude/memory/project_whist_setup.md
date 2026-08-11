---
name: project-whist-setup
description: Metro is unreachable from the Android device over LAN; start the dev server with --tunnel
metadata:
  type: project
---

A "java.io.??? unable to download remote ???" error on the Android device means the Metro bundler is unreachable over LAN.

**Why:** PC and Android are on the same network, but the Metro port is blocked or the two are on different subnets.

**How to apply:** Always start the dev server with `npx expo start --tunnel` for this project. `npx expo login` may be needed first for ngrok tunnel auth.
