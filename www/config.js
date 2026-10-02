// Central config. Replace the TEST ids with your real AdMob ids when ready,
// and set ADS_TEST=false for the release build.
window.NOVA_CONFIG = {
  ADS_TEST: true,
  ADMOB_APP_ID: "ca-app-pub-3940256099942544~3347511713",     // Google sample app id (also set in AndroidManifest)
  REWARDED_ID: "ca-app-pub-3940256099942544/5224354917",      // Google sample rewarded
  INTERSTITIAL_ID: "ca-app-pub-3940256099942544/1033173712",  // Google sample interstitial
  INTERSTITIAL_EVERY: 3,        // show an interstitial every N finished levels
  INTERSTITIAL_MIN_LEVEL: 4,    // never before this level (let players hook first)
  INTERSTITIAL_COOLDOWN_S: 90,  // minimum seconds between interstitials
  IAP_MOCK: true                // true until Play Billing products are created
};
