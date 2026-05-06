# ChatPulse

ChatPulse is a browser extension for sending controlled, timed messages in live-stream chats. It is designed for creators and moderators who want lightweight chat activity helpers without manually pasting the same message over and over.

The extension runs locally in the browser, uses closed UI presets instead of free-form risky inputs, and supports Chrome/Chromium and Firefox builds.

## Features

- Supports Kick, Twitch, YouTube Live, and TikTok Live.
- Sends messages on a randomized interval.
- Provides safe interval presets: `4-7m`, `2-4m`, and `1-2m`.
- Provides topic presets instead of open text fields.
- Supports multiple message languages with flag chips.
- Keeps at least one message language selected to avoid invalid configuration.
- Includes native phrase packs for `pt-BR`, `en`, and `es`.
- Falls back to public translation endpoints for other languages.
- Uses a compact dark UI inspired by Linear-style controls.
- Includes separate packaging scripts for Chrome and Firefox.

## Supported Platforms

- Kick
- Twitch
- YouTube Live
- TikTok Live

Live chat DOM structures change often. If a platform stops working, update the selectors in `src/content.js`.

## Development Install

### Chrome or Edge

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project directory.
5. Open a supported live stream.
6. Click the ChatPulse extension icon and configure it.

After editing source files, reload the extension from `chrome://extensions` and refresh the live-stream page.

### Firefox

Build the Firefox development version:

```powershell
.\scripts\build-firefox.ps1
```

Then:

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `dist\firefox\manifest.json`.
4. Open a supported live stream.
5. Click the ChatPulse extension icon and configure it.

Temporary Firefox add-ons are removed when Firefox restarts. Rebuild and reload after source changes.

## Packaging

Chrome Web Store package:

```powershell
.\scripts\package-chrome.ps1
```

Output:

```text
dist\chatpulse-chrome-<version>.zip
```

Firefox Add-ons package:

```powershell
.\scripts\package-firefox.ps1
```

Output:

```text
dist\chatpulse-firefox-<version>.zip
```

## Languages

Popup UI languages:

- `auto`
- `pt-BR`
- `en`
- `es`
- `fr`
- `de`
- `it`
- `ja`
- `ko`
- `zh-CN`

Message languages:

- `pt-BR`
- `en`
- `es`
- `fr`
- `de`
- `it`
- `ja`
- `ko`
- `zh-CN`
- `ru`
- `tr`
- `id`
- `ar`
- `hi`
- `nl`
- `pl`
- `sv`
- `vi`
- `th`
- `tl`

Native phrase packs currently exist for `pt-BR`, `en`, and `es`. Other languages are translated from the source phrase through public translation endpoints.

## Translation Fallbacks

ChatPulse first tries the public Google Translate endpoint:

```text
https://translate.googleapis.com
```

If that fails, it tries MyMemory:

```text
https://api.mymemory.translated.net
```

These are public endpoints with rate limits and no production SLA. If translation fails, ChatPulse falls back to the original generated phrase instead of blocking the send flow.

## Project Structure

```text
manifest.json                 Chrome/Chromium extension manifest
manifest.firefox.json         Firefox-specific manifest source
src/background.js             Translation requests and background message handling
src/content.js                Platform detection, phrase generation, and chat sending
src/popup.html                Extension popup markup
src/popup.css                 Popup design system, typography, flags, and layout
src/popup.js                  Popup state, validation, i18n, and settings persistence
src/assets/icon.svg           Source icon
src/assets/icons/*.png        Generated extension icons
src/assets/fonts/*.woff2      Local Inter font asset
scripts/build-firefox.ps1     Creates dist/firefox
scripts/generate-icons.ps1    Generates PNG icons from the icon design
scripts/package-chrome.ps1    Creates Chrome upload zip
scripts/package-firefox.ps1   Creates Firefox upload zip
```

## Permissions

ChatPulse requests:

- `storage`: saves user configuration locally.
- `activeTab`: communicates with the currently active live-stream tab.
- Host permissions for supported streaming platforms.
- Host permissions for public translation endpoints.

The extension does not require account credentials and does not ship a remote analytics service.

## Safety and Platform Policy Notes

ChatPulse is intended as a user-controlled helper, not a spam tool. The UI intentionally uses constrained presets:

- no free-form language codes
- no custom interval input
- no arbitrary message text input
- at least one language must remain selected
- sending can be paused from the popup

When publishing to browser stores, describe it as a timed chat assistant and clearly explain the user-controlled settings.

## Known Limitations

- Streaming platforms frequently change chat input selectors.
- Some chats may be inside iframes or require the user to be logged in.
- Public translation endpoints can rate-limit or fail.
- Automated chat behavior may be restricted by individual platform terms or channel moderation rules.

## Contributing

Contributions are welcome. Good first areas:

- improve platform selectors in `src/content.js`
- add native phrase packs for more languages
- improve UI translations
- add tests or validation scripts
- improve store-ready documentation and screenshots

Keep changes focused and avoid broad refactors when fixing a platform-specific issue.

## License

MIT. See [LICENSE](LICENSE).
