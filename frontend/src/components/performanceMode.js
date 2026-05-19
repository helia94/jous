export function getConnectionProfile() {
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    return { isConstrained: false, effectiveType: "unknown", saveData: false };
  }

  const effectiveType = connection.effectiveType || "unknown";
  const isConstrained =
    Boolean(connection.saveData) ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    effectiveType === "3g";

  return {
    isConstrained,
    effectiveType,
    saveData: Boolean(connection.saveData),
  };
}

export function shouldUseMinimalExperience() {
  const forcedMode = localStorage.getItem("jous-performance-mode");

  if (forcedMode === "minimal") {
    return true;
  }

  if (forcedMode === "full") {
    return false;
  }

  return getConnectionProfile().isConstrained;
}
