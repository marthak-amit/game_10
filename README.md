# Chain Nova

One-tap chain-reaction puzzle for mobile. Tap once to drop a nova; every orb it touches
explodes into a new nova. Chain as many as you can. Single-file HTML5 (`index.html`), no build step.

Run locally: `python3 -m http.server 8000` → open on a phone / Chrome devtools mobile mode.

## Game design (retention loops)
- **Infinite procedural levels** (seeded, deterministic) with new orb types unlocking over time:
  Nova (big blast), Armor (2 hits), Split (3 mini-blasts), Freeze (stops time).
- **Satisfying juice**: pentatonic pitch that climbs with the chain, haptics, screen shake, particles.
- **Stars (1–3)** → replayability. **Daily Challenge** (same seed for everyone) and **7-day gift streak** → daily return.
- **Meta progression**: Blast Size / Duration / Coin Bonus upgrades, consumable power-ups (+1 Tap, Mega, Slow-mo).

## Monetization hooks (in `index.html`: `Ads` and `IAP` objects — currently mocks)
| Placement | Type |
|---|---|
| "So close!" → +1 tap & keep progress | Rewarded (highest value) |
| Double coins on win, double daily gift | Rewarded |
| Out-of-stock power-up → free one | Rewarded |
| Every 3rd level end | Interstitial (disabled by Remove Ads) |
| Coin packs ₹49–₹899, Starter Pack ₹99, Remove Ads ₹199 | IAP |

## Next steps (when accounts are ready)
1. Wrap with Capacitor: `npm i @capacitor/core @capacitor/cli @capacitor/android && npx cap init && npx cap add android && npx cap sync`
2. AdMob: install `@capacitor-community/admob`, implement `Ads.rewarded/interstitial` + add banner-free consent (UMP).
3. Play Billing: `cordova-plugin-purchase` or RevenueCat, implement `IAP.buy`, restore purchases.
4. Add analytics (Firebase) to tune level difficulty, ad frequency, and D1/D7 retention.
5. Store assets (icon from `icon.svg`, screenshots, trailer) and soft-launch in India + Tier-2 markets.

> Revenue to hit ₹10 lakh/month depends on installs & retention (roughly 100k+ DAU with hybrid ad + IAP);
> this build provides the product and monetization surface — user acquisition is the other half.
