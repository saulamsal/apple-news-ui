# Live Activity Implementation Guide

## Overview
This guide explains how to implement and update Live Activities in the app. Live Activities show real-time updates for ongoing events like sports matches on the iOS Lock Screen and in Dynamic Island.

## File Structure
- `targets/widget/WidgetLiveActivity.swift`: Main Live Activity UI implementation
- `modules/expo-live-activity/index.ts`: TypeScript interface for Live Activities
- `modules/expo-live-activity/index.ios.ts`: iOS-specific implementation

## State vs Attributes

### Attributes (Static)
Attributes are static properties that don't change during the lifetime of a Live Activity. They are set when starting the activity and cannot be modified.

```typescript
// Set in startActivity():
{
  competition: string;    // e.g., "Premier League"
  homeTeam: string;      // e.g., "Manchester United"
  awayTeam: string;      // e.g., "Manchester City"
  homeLogo: string;      // e.g., "mun"
  awayLogo: string;      // e.g., "mci"
  homeColor: string;     // e.g., "#DA291C"
  awayColor: string;     // e.g., "#6CABDD"
}
```

### State (Dynamic)
State contains dynamic properties that can be updated during the Live Activity's lifetime:

```typescript
interface LiveActivityState {
  homeScore: number;     // Current score for home team
  awayScore: number;     // Current score for away team
  timeOrPeriod: string;  // e.g., "43'" or "Q2"
  currentEvent: string;  // e.g., "Goal scored!"
  situation: string;     // e.g., "GOAL", "YELLOW_CARD"
}
```

## Usage

### Starting a Live Activity
```typescript
const success = await LiveActivities.startActivity(
  competition,      // Competition name
  homeTeam,         // Home team name
  awayTeam,         // Away team name
  homeLogo,         // Home team logo identifier
  awayLogo,         // Away team logo identifier
  homeColor,        // Home team color (hex)
  awayColor,        // Away team color (hex)
  initialState      // Initial dynamic state
);
```

### Updating a Live Activity
```typescript
LiveActivities.updateActivity({
  homeScore: 2,
  awayScore: 1,
  timeOrPeriod: "43'",
  currentEvent: "Goal scored!",
  situation: "GOAL"
});
```

### Ending a Live Activity
```typescript
LiveActivities.endActivity({
  homeScore: 2,
  awayScore: 1,
  timeOrPeriod: "FINAL",
  currentEvent: "Game Over!",
  situation: "FINAL"
});
```

## Best Practices

1. **Color Management**
   - Always set team colors as attributes when starting the activity
   - Never include colors in state updates
   - Colors in attributes ensure consistent UI throughout the activity's lifetime

2. **State Updates**
   - Only update dynamic content through state
   - Keep updates minimal and relevant
   - Don't try to update static attributes after activity starts

3. **Error Handling**
   - Always check the success status when starting an activity
   - Implement proper error handling for failed updates
   - Handle activity termination gracefully

## Common Issues

1. **Color Changes**
   - Issue: Colors changing unexpectedly during updates
   - Solution: Move colors to attributes instead of state

2. **Activity Not Updating**
   - Check if the activity was started successfully
   - Verify the activity hasn't been terminated
   - Ensure state updates contain valid data

## File Updates Guide

When implementing new features or making changes:

1. **Swift Changes (WidgetLiveActivity.swift)**
   - Update `WidgetAttributes` for new static properties
   - Update `ContentState` for new dynamic properties
   - Modify the UI implementation as needed

2. **TypeScript Interface (index.ts)**
   - Update `LiveActivityState` interface
   - Add new method signatures if needed
   - Update type definitions

3. **iOS Implementation (index.ios.ts)**
   - Implement new methods defined in the interface
   - Update native module bindings
   - Handle new parameters in existing methods

## Testing

1. Test Live Activity creation with various team combinations
2. Verify color consistency during updates
3. Test different update scenarios (goals, cards, time changes)
4. Verify proper cleanup when ending activities
5. Test error cases and recovery

## Swift Implementation Details

### WidgetAttributes Structure
```swift
struct WidgetAttributes: ActivityAttributes {
    // Dynamic properties that can be updated
    public struct ContentState: Codable, Hashable {
        var homeScore: Int
        var awayScore: Int
        var timeOrPeriod: String
        var currentEvent: String
        var situation: String
    }
    
    // Static properties set once at creation
    var competition: String
    var homeTeam: String
    var awayTeam: String
    var homeLogo: String
    var awayLogo: String
    var homeColor: String    // Team colors are static attributes
    var awayColor: String    // Team colors are static attributes
}
```

### Important Notes
1. The `WidgetAttributes` struct in `ExpoLiveActivityModule.swift` MUST exactly match the one in `WidgetLiveActivity.swift`
2. Colors are defined as attributes (static properties) rather than state to ensure they remain constant
3. The native module's `startActivity` function accepts 8 parameters:
   ```swift
   Function("startActivity") { (
       competition: String, 
       homeTeam: String, 
       awayTeam: String, 
       homeLogo: String, 
       awayLogo: String, 
       homeColor: String,    // Color parameters
       awayColor: String,    // Color parameters
       initialState: [String: Any]
   ) -> Bool }
   ```

### Common Errors
1. **Parameter Mismatch**: If you get an error like "Received 8 arguments, but 6 was expected", ensure your Swift module's `startActivity` function signature matches the TypeScript interface.
2. **Struct Mismatch**: If the `WidgetAttributes` structs don't match between files, you might see runtime errors or unexpected behavior. 