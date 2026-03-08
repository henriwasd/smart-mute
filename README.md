# Smart Mute Same-Site Tabs

An open-source Google Chrome extension with a Cyberpunk aesthetic that automatically mutes overlapping audio from duplicate tabs.

## Why this exists?
Ever been annoyed by opening multiple YouTube videos or Twitter tabs and having the audio play all at once? Smart Mute solves this. Instead of muting all your background tabs (like Spotify while you browse Reddit), it intelligently monitors your audio. 

If you open a new tab from the *same site* that is already playing audio, it will keep the sound of the new one and automatically mute the old one. Simple, free, and no bloatware.

## Features
- 🎧 **Smart Domain Muting:** Mutes old tabs from the same domain when a new one starts playing.
- 🌐 **Different Site Respect:** Allows you to keep background music (e.g., Spotify) playing while watching a video on another site (e.g., YouTube). (Can be toggled off for strict silence).
- 🛡️ **Unlimited Exceptions:** Add as many websites as you want to a whitelist that will *never* be auto-muted.
- ⚡ **Quick Toggle:** Turn the extension on or off with a single click.
- 🎨 **Cyberpunk UI:** A sleek, modern dark mode with neon accents.
- 🌍 **i18n Support:** Available in English and Portuguese (Brazil).

## Installation (Manual)
1. Download or clone this repository.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Enable **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"** and select the folder where you cloned this repo.

## Privacy
This extension runs entirely locally on your browser. It does not collect, transmit, or store any personal data. See the `PRIVACY_POLICY.md` for more details.

## Support
If you find this useful, consider buying me a coffee!
[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="150">](https://buymeacoffee.com/henriwasd)
