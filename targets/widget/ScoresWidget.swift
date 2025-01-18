import WidgetKit
import SwiftUI

struct ScoreEntry: TimelineEntry {
    let date: Date
    let team1Name: String
    let team2Name: String
    let team1Score: String
    let team2Score: String
    let matchStatus: String
}

struct ScoresWidgetEntryView : View {
    var entry: ScoreEntry
    
    var body: some View {
        VStack(spacing: 8) {
            Text(entry.matchStatus)
                .font(.caption)
                .foregroundColor(.gray)
            
            HStack(spacing: 20) {
                VStack {
                    Text(entry.team1Name)
                        .font(.headline)
                    Text(entry.team1Score)
                        .font(.title)
                        .bold()
                }
                
                Text("vs")
                    .foregroundColor(.gray)
                
                VStack {
                    Text(entry.team2Name)
                        .font(.headline)
                    Text(entry.team2Score)
                        .font(.title)
                        .bold()
                }
            }
        }
        .padding()
    }
}

struct ScoresWidget: Widget {
    private let kind = "ScoresWidget"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: kind,
            provider: ScoresTimelineProvider()
        ) { entry in
            ScoresWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Live Scores")
        .description("Stay updated with live match scores.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct ScoresTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> ScoreEntry {
        ScoreEntry(
            date: Date(),
            team1Name: "Team 1",
            team2Name: "Team 2",
            team1Score: "0",
            team2Score: "0",
            matchStatus: "Live"
        )
    }
    
    func getSnapshot(in context: Context, completion: @escaping (ScoreEntry) -> Void) {
        let entry = ScoreEntry(
            date: Date(),
            team1Name: "Team 1",
            team2Name: "Team 2",
            team1Score: "2",
            team2Score: "1",
            matchStatus: "75'"
        )
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<ScoreEntry>) -> Void) {
        // Get data from UserDefaults (shared with main app)
        let sharedDefaults = UserDefaults(suiteName: "group.com.sportapp.apple-news-ui.ScoresWidget")
        
        let team1Name = sharedDefaults?.string(forKey: "team1Name") ?? "Team 1"
        let team2Name = sharedDefaults?.string(forKey: "team2Name") ?? "Team 2"
        let team1Score = sharedDefaults?.string(forKey: "team1Score") ?? "0"
        let team2Score = sharedDefaults?.string(forKey: "team2Score") ?? "0"
        let matchStatus = sharedDefaults?.string(forKey: "matchStatus") ?? "Live"
        
        let entry = ScoreEntry(
            date: Date(),
            team1Name: team1Name,
            team2Name: team2Name,
            team1Score: team1Score,
            team2Score: team2Score,
            matchStatus: matchStatus
        )
        
        let timeline = Timeline(entries: [entry], policy: .after(.now.advanced(by: 60)))
        completion(timeline)
    }
} 