/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: "widget",
  name: "ScoresWidget",
  icon: "../../assets/images/icon.png",
  colors: {
    $widgetBackground: "#000000",
    $accent: "#FFFFFF",
  },
  entitlements: {
    "com.apple.security.application-groups": ["group.com.qlur.apple-news-ui.widget"]
  }
};