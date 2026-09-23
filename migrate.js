// Maps pre-1.1 preset colors to their contrast-tuned replacements so users who
// picked a preset before the refresh get the new colors automatically.
const LEGACY_THEME_MAP = {
  "#ed8515|#3b3a3a": { textColor: "#ffc896", backgroundColor: "#433831" },
  "#4fc3f7|#1c2b36": { textColor: "#a6e1ff", backgroundColor: "#1f4260" },
  "#7ed957|#1e2b1e": { textColor: "#b4f59c", backgroundColor: "#274727" },
  "#c792ea|#2b213b": { textColor: "#e8ccff", backgroundColor: "#43335e" },
  "#ff6b6b|#2b1a1a": { textColor: "#ffc7c7", backgroundColor: "#5c2e2e" },
  "#b58900|#002b36": { textColor: "#f7d460", backgroundColor: "#08475a" }
};

function migrateLegacyColors(settings) {
  const key = `${settings.textColor}|${settings.backgroundColor}`.toLowerCase();
  const replacement = LEGACY_THEME_MAP[key];
  if (!replacement) {
    return settings;
  }
  chrome.storage.sync.set(replacement);
  return { ...settings, ...replacement };
}
