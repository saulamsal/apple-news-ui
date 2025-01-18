import ActivityKit
import WidgetKit
import SwiftUI

struct ScoresAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var team1Score: String
        var team2Score: String
        var matchStatus: String
    }
    
    var team1Name: String
    var team2Name: String
}

struct ScoresLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: ScoresAttributes.self) { context in
            // Live Activity UI for Dynamic Island and Lock Screen
            HStack(spacing: 20) {
                VStack {
                    Text(context.attributes.team1Name)
                        .font(.caption)
                    Text(context.state.team1Score)
                        .font(.title2.bold())
                }
                
                Text("vs")
                    .foregroundStyle(.secondary)
                
                VStack {
                    Text(context.attributes.team2Name)
                        .font(.caption)
                    Text(context.state.team2Score)
                        .font(.title2.bold())
                }
            }
            .padding()
            
        } dynamicIsland: { context in
            // Dynamic Island UI
            DynamicIsland {
                // Expanded UI
                DynamicIslandExpandedRegion(.leading) {
                    VStack(alignment: .leading) {
                        Text(context.attributes.team1Name)
                            .font(.caption2)
                        Text(context.state.team1Score)
                            .font(.title3.bold())
                    }
                }
                
                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .trailing) {
                        Text(context.attributes.team2Name)
                            .font(.caption2)
                        Text(context.state.team2Score)
                            .font(.title3.bold())
                    }
                }
                
                DynamicIslandExpandedRegion(.center) {
                    Text("vs")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
                
                DynamicIslandExpandedRegion(.bottom) {
                    Text(context.state.matchStatus)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            } compactLeading: {
                // Compact Leading
                Text(context.state.team1Score)
                    .font(.caption2.bold())
            } compactTrailing: {
                // Compact Trailing
                Text(context.state.team2Score)
                    .font(.caption2.bold())
            } minimal: {
                // Minimal UI
                Text("🏆")
            }
        }
    }
} 