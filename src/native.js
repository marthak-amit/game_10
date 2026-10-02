// Native bridge: bundled by esbuild to www/native.js. Exposes window.NativeAds and hooks the back button.
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { AdMob, RewardAdPluginEvents, InterstitialAdPluginEvents, AdmobConsentStatus } from "@capacitor-community/admob";

const C = window.NOVA_CONFIG || {};
if (Capacitor.isNativePlatform()) {
  const N = { ready: false, rewardedReady: false, interReady: false };
  window.NativeAds = N;

  const loadRewarded = async () => {
    try { N.rewardedReady = false; await AdMob.prepareRewardVideoAd({ adId: C.REWARDED_ID, isTesting: !!C.ADS_TEST }); } catch (e) { console.warn("prep rewarded", e); }
  };
  const loadInter = async () => {
    try { N.interReady = false; await AdMob.prepareInterstitial({ adId: C.INTERSTITIAL_ID, isTesting: !!C.ADS_TEST }); } catch (e) { console.warn("prep inter", e); }
  };

  let rewardCb = null, rewarded = false;
  AdMob.addListener(RewardAdPluginEvents.Loaded, () => { N.rewardedReady = true; });
  AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => { N.rewardedReady = false; setTimeout(loadRewarded, 15000); });
  AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { rewarded = true; });
  AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => { const cb = rewardCb; rewardCb = null; cb && cb(false, "show_failed"); loadRewarded(); });
  AdMob.addListener(RewardAdPluginEvents.Dismissed, () => { const cb = rewardCb; rewardCb = null; const ok = rewarded; rewarded = false; cb && cb(ok, ok ? "" : "skipped"); loadRewarded(); });

  let interCb = null;
  AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => { N.interReady = true; });
  AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, () => { N.interReady = false; setTimeout(loadInter, 20000); });
  AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => { const cb = interCb; interCb = null; cb && cb(); loadInter(); });
  AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => { const cb = interCb; interCb = null; cb && cb(); loadInter(); });

  N.rewarded = async (cb) => {
    if (!N.rewardedReady) { cb(false, "not_ready"); loadRewarded(); return; }
    rewardCb = cb; rewarded = false;
    try { await AdMob.showRewardVideoAd(); } catch (e) { rewardCb = null; cb(false, "error"); loadRewarded(); }
  };
  N.interstitial = async (cb) => {
    if (!N.interReady) { cb(); loadInter(); return; }
    interCb = cb;
    try { await AdMob.showInterstitial(); } catch (e) { interCb = null; cb(); loadInter(); }
  };

  (async () => {
    try {
      // GDPR/UMP consent (no-op outside regulated regions)
      const info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) await AdMob.showConsentForm();
    } catch (e) { console.warn("consent", e); }
    try {
      await AdMob.initialize({ initializeForTesting: !!C.ADS_TEST });
      N.ready = true; loadRewarded(); loadInter();
    } catch (e) { console.warn("admob init", e); }
  })();

  try { StatusBar.hide(); } catch (e) {}
  App.addListener("backButton", () => { window.dispatchEvent(new Event("nova-back")); });
}
