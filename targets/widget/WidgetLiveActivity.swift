import ActivityKit
import WidgetKit
import SwiftUI

struct WidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var homeScore: Int
        var awayScore: Int
        var timeOrPeriod: String
        var currentEvent: String
        var situation: String
        var homeColor: String
        var awayColor: String
    }
    
    var competition: String
    var homeTeam: String
    var homeTeamNickname: String
    var awayTeam: String
    var awayTeamNickname: String
}

struct WidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: WidgetAttributes.self) { context in
            ZStack {
                // Background gradient with dark overlay
                ZStack {
                    LinearGradient(
                        colors: [
                            (Color(hex: context.state.homeColor) ?? .blue).opacity(0.1),
                            Color(hex: context.state.homeColor) ?? .red
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                    Color.black.opacity(0.5) // Dark overlay
                }
                
                VStack(spacing: 8) {
                    // Top row with competition name
                    Text(context.attributes.competition)
                        .font(.system(.caption, design: .rounded))
                        .foregroundColor(.white.opacity(0.9))
                    
                    // Main score section
                    HStack(spacing: 12) {
                        // Home team
                        VStack(spacing: 4) {
                            Circle()
                                .fill(.ultraThinMaterial)
                                .frame(width: 45, height: 45)
                                .overlay(
                                    Text(context.attributes.homeTeamNickname)
                                        .font(.system(size: 15, weight: .bold, design: .rounded))
                                        .foregroundColor(.white)
                                )
                            
                            Text(context.attributes.homeTeam)
                                .font(.system(.caption, design: .rounded))
                                .foregroundColor(.white)
                                .fontWeight(.medium)
                        }
                        
                        Text("\(context.state.homeScore)")
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        
                        // Center section with time/period
                        VStack(spacing: 4) {
                            Text(context.state.timeOrPeriod)
                                .font(.system(.caption, design: .rounded))
                                .foregroundColor(.white)
                                .padding(.vertical, 4)
                                .padding(.horizontal, 10)
                                .background(Color.white.opacity(0.2))
                                .cornerRadius(12)
                        }
                        
                        Text("\(context.state.awayScore)")
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        
                        // Away team
                        VStack(spacing: 4) {
                            Circle()
                                .frame(width: 45, height: 45)
                                .overlay(
                                    Text(context.attributes.awayTeamNickname)
                                        .font(.system(size: 16, weight: .bold, design: .rounded))
                                        .foregroundColor(.black)
                                )
                            
                            Text(context.attributes.awayTeam)
                                .font(.system(.caption, design: .rounded))
                                .foregroundColor(.white)
                                .fontWeight(.medium)
                        }
                    }
                    
                    // Bottom event section
                    if !context.state.currentEvent.isEmpty {
                        HStack(spacing: 8) {
                            Circle()
                                .fill(Color(hex: context.state.homeColor) ?? .blue)
                                .frame(width: 24, height: 24)
                                .overlay(
                                    Text(context.attributes.homeTeamNickname)
                                        .font(.system(size: 7, weight: .bold, design: .rounded))
                                        .foregroundColor(.white)
                                )
                            
                            Text(context.state.currentEvent)
                                .font(.system(.callout, design: .rounded))
                                .foregroundColor(.white)
                                .multilineTextAlignment(.leading)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal)
                        .padding(.top, 4)
                    }
                }
                .padding()
            }
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    HStack {
                        Circle()
                            .fill(Color(hex: context.state.homeColor) ?? .blue)
                            .frame(width: 24, height: 24)
                            .overlay(
                                Text(context.attributes.homeTeamNickname)
                                    .font(.system(size: 10, weight: .bold, design: .rounded))
                                    .foregroundColor(.white)
                            )
                        VStack(alignment: .leading) {
                            Text("\(context.state.homeScore)")
                                .font(.system(.title2, design: .rounded).bold())
                                .foregroundColor(.white)
                        }
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    HStack {
                        VStack(alignment: .trailing) {
                            Text("\(context.state.awayScore)")
                                .font(.system(.title2, design: .rounded).bold())
                                .foregroundColor(.white)
                        }
                        Circle()
                            .fill(Color(hex: context.state.awayColor) ?? .red)
                            .frame(width: 24, height: 24)
                            .overlay(
                                Text(context.attributes.awayTeamNickname)
                                    .font(.system(size: 10, weight: .bold, design: .rounded))
                                    .foregroundColor(.white)
                            )
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack {
                        Text(context.state.timeOrPeriod)
                            .font(.system(.body, design: .rounded))
                            .foregroundColor(.white)
                        if !context.state.currentEvent.isEmpty {
                            Text(context.state.currentEvent)
                                .font(.system(.caption, design: .rounded))
                                .foregroundColor(.white)
                        }
                    }
                }
            } compactLeading: {
                Text("\(context.state.homeScore)-\(context.state.awayScore)")
                    .font(.system(.body, design: .rounded))
                    .foregroundColor(.white)
            } compactTrailing: {
                Text(context.state.timeOrPeriod)
                    .font(.system(.body, design: .rounded))
                    .foregroundColor(.white)
            } minimal: {
                Text("\(context.state.homeScore)-\(context.state.awayScore)")
                    .font(.system(.body, design: .rounded))
                    .foregroundColor(.white)
                }
            .widgetURL(URL(string: "https://www.apple-news-ui.app/scores"))
            .keylineTint(Color.white)
        }
    }
}

extension Color {
    init?(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")
        
        var rgb: UInt64 = 0
        
        guard Scanner(string: hexSanitized).scanHexInt64(&rgb) else {
            return nil
        }
        
        self.init(
            red: Double((rgb & 0xFF0000) >> 16) / 255.0,
            green: Double((rgb & 0x00FF00) >> 8) / 255.0,
            blue: Double(rgb & 0x0000FF) / 255.0
        )
    }
}

extension WidgetAttributes {
    fileprivate static var preview: WidgetAttributes {
        WidgetAttributes(
            competition: "Premier League",
            homeTeam: "Manchester United",
            homeTeamNickname: "MUN",
            awayTeam: "Manchester City",
            awayTeamNickname: "MCI"
        )
    }
}

extension WidgetAttributes.ContentState {
    fileprivate static var firstHalf: WidgetAttributes.ContentState {
        WidgetAttributes.ContentState(
            homeScore: 2,
            awayScore: 1,
            timeOrPeriod: "43'",
            currentEvent: "Fernandes scores! Beautiful finish from the edge of the box",
            situation: "GOAL",
            homeColor: "#DA291C",
            awayColor: "#6CABDD"
        )
    }
    
    fileprivate static var secondHalf: WidgetAttributes.ContentState {
        WidgetAttributes.ContentState(
            homeScore: 2,
            awayScore: 2,
            timeOrPeriod: "78'",
            currentEvent: "Yellow card for Fernandes after a tactical foul",
            situation: "YELLOW_CARD",
            homeColor: "#DA291C",
            awayColor: "#6CABDD"
        )
    }
}

#Preview("Notification", as: .content, using: WidgetAttributes.preview) {
   WidgetLiveActivity()
} contentStates: {
    WidgetAttributes.ContentState.firstHalf
    WidgetAttributes.ContentState.secondHalf
}
