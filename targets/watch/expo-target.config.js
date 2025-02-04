/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = config => ({
  type: "watch",
  icon: '../../assets/images/icon.png',
  colors: { 
    $accent: "#007AFF",
    $background: "#000000",
    $label: "#FFFFFF" 
  },
  deploymentTarget: "9.4",
  entitlements: { 
    "com.apple.security.application-groups": [
      "group.com.sportapp.anews-ui"
    ]
  },
  bundleIdentifier: "com.sportapp.anews-ui.watchkitapp"
});