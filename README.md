# Apple News UI Clone with Expo

This project demonstrates an implementation of the Apple News app UI in React Native using Expo, with a focus on replicating the native iOS experience and features.

## Features

- 📰 News feed with swipeable article cards
- 🔍 Search functionality
- 🎯 Topic-based news filtering
- 📱 iOS-style news article presentation
- 🌟 News+ premium content support
- 💫 Live Activities for sports scores
- 🎨 Dynamic UI with dark/light mode
- 🖼️ Home Screen Widgets
- 📋 Magazine and newspaper catalogs
- ⚡ Context menus and peek previews
- 🔄 Swipe gestures for article actions
- 📱 Native iOS widgets integration
- 🏆 Sports scores with live updates
- 🎵 Audio content support

## Tech Stack

- [Expo](https://expo.dev) - React Native development platform
- [Expo Router](https://docs.expo.dev/router/introduction) - File-based routing
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Smooth animations
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) - Native-driven gesture handling
- [WidgetKit](https://developer.apple.com/documentation/widgetkit) - iOS widgets
- [ActivityKit](https://developer.apple.com/documentation/activitykit) - Live Activities
- [Zeego](https://zeego.dev/) - Context menus

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Open in iOS Simulator or Android Emulator:
   - Press `i` for iOS
   - Press `a` for Android

## Project Structure

```
project-root/
├── app/
│   ├── (tabs)/
│   │   ├── (index)/       # Home feed
│   │   ├── (news+)/       # News+ content
│   │   ├── (sports)/      # Sports section
│   │   ├── (audio)/       # Audio content
│   │   ├── (search)/      # Search functionality
│   │   └── _layout.tsx    # Tab navigation layout
├── components/
│   ├── NewsItem.tsx       # News article component
│   ├── SwipeableNewsItem.tsx
│   ├── NewsLogo.tsx
│   └── CategoryCard.tsx
├── contexts/
│   └── AudioContext.tsx   # Audio playback state
├── modules/
│   └── expo-live-activity/# Live Activities module
├── targets/
│   └── widget/           # iOS widget implementation
└── styles/
    └── screens/          # Screen-specific styles
```

## Features in Development

- [ ] Android widget support
- [ ] Background audio playback
- [ ] Push notifications
- [ ] React Server Components integration
- [ ] Enhanced Live Activities

## Contributing

Feel free to contribute to this project by:

1. Forking the repository
2. Creating a feature branch
3. Submitting a pull request

## License

This project is open source and available under the MIT License.


## Dummy data scraped:
1. Podcast: https://podcasts.apple.com/us/room/1589753370 (#serialized-server-data)
fyi: 
i. replace: {w}x{h}
with : /376x376bb.webp

ii.



#TODO - apple news
[] swap expo-av with expo-audio
[x] Lock screen player
[] Lock screen control