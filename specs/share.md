# Share Screen

The Share screen lets users share the app with others by pointing them to the GitHub repository.

## Layout

1. **App icon** — the `ShareIcon` displayed in the accent colour, size 56.
2. **Title** — "Share Whist" (i18n key `share.title`).
3. **Subtitle** — "Scan this QR code to get the latest version of this app" (i18n key `share.scanPrompt`).
4. **QR code** — a 200 × 200 QR code encoding the repository URL (`https://github.com/ChezMose/Whist`), rendered on the surface background colour.
5. **Link row** — a tappable row below the QR code with:
   - A muted label "Or follow this link" (i18n key `share.orFollowLink`).
   - The repository URL rendered as an underlined accent-coloured link.
   - Tapping the row opens the URL in the default browser via `Linking.openURL`.

## Shared URL

```
https://github.com/ChezMose/Whist
```

This is the single value used for both the QR code and the tappable link. Update it here when the target URL changes.

## Behaviour

- The screen is purely informational — no input, no state.
- The QR code and link always point to the same URL defined above.
