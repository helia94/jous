import { shouldUseMinimalExperience } from "./performanceMode";

let gaPromise;
let initialized = false;

function loadGA() {
  if (!gaPromise) {
    gaPromise = import("react-ga4").then((module) => module.default);
  }

  return gaPromise;
}

export async function initAnalytics() {
  if (initialized || shouldUseMinimalExperience()) {
    return;
  }

  const ReactGA = await loadGA();
  ReactGA.initialize("G-21G3CNF1CB");
  ReactGA.send("pageview");
  initialized = true;
}

export function trackEvent(event) {
  if (shouldUseMinimalExperience()) {
    return;
  }

  window.setTimeout(() => {
    loadGA()
      .then((ReactGA) => {
        if (!initialized) {
          ReactGA.initialize("G-21G3CNF1CB");
          initialized = true;
        }
        ReactGA.event(event);
      })
      .catch(() => {});
  }, 0);
}
