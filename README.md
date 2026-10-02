# Chain Nova

One-tap chain-reaction puzzle for Android (Capacitor + HTML5 canvas). Tap once, drop a nova, every orb it touches
explodes into a new nova — chain them all.

## Features
- Endless levels; each one is **played by a solver at load time**, so every level is winnable and its goal is a fraction
  of the best achievable result (difficulty ramps by raising that fraction + speed + armored orbs).
- Orb types: Nova (huge blast), Armor (2 hits), Split (3 mini-novas), Freeze (stops time). Mega Level every 10 (2 taps, 2x coins).
- 1–3 stars, Perfect clear bonus, Daily Challenge, 7-day gift streak, level map, upgrades, power-ups, music + haptics.
- **AdMob** rewarded + interstitial (Google *test* ids for now), UMP consent, **IAP layer** (mock until Play Billing is set up).

## Project layout
- `www/` – the game (`index.html`, `config.js`). `www/native.js` is built from `src/native.js`.
- `android/` – Capacitor Android project (AdMob app id lives in `AndroidManifest.xml`).
- `.github/workflows/android.yml` – builds a debug APK on every push (Actions → artifact `chain-nova-debug-apk`).

## Run / build
```
npm install
npm run serve          # play in browser at http://localhost:8000 (ads are mocked on web)
npm run sync           # bundle native bridge + copy www into android/
cd android && ./gradlew assembleDebug     # needs JDK 21 + Android SDK
```

## Going live with real ads (when you have your AdMob ids)
1. `www/config.js`: set `ADMOB_APP_ID`, `REWARDED_ID`, `INTERSTITIAL_ID`, and `ADS_TEST:false`.
2. `android/app/src/main/AndroidManifest.xml`: replace the `com.google.android.gms.ads.APPLICATION_ID` value.
3. Never click your own live ads; use test devices.

## Monetization placements
| Placement | Type |
|---|---|
| "So close!" → +1 tap, keep progress | Rewarded |
| Double coins on win / double daily gift | Rewarded |
| Out-of-stock power-up → free one | Rewarded |
| Every 3rd finished level (from level 4, 90 s cooldown) | Interstitial (removed by Remove Ads) |
| Coin packs ₹49–₹899, Starter ₹99, Remove Ads ₹199 | IAP |

## TODO before Play Store release
- Create IAP products in Play Console + implement `IAP.buy` (currently grants instantly: `IAP_MOCK`).
- Release signing keystore, privacy policy URL (required by AdMob/Play), Data-safety form, store listing assets.
- Add Firebase Analytics to tune ad frequency and difficulty.
