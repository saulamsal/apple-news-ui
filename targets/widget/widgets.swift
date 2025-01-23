import WidgetKit
import SwiftUI

let APP_GROUP_NAME = "group.com.sportapp.apple-news-ui"

struct NewsArticle: Codable {
    let title: String
    let source: String
    let sourceLogo: String
    let imageUrl: String
    private let isNewsPlus: Int
    
    var isNewsPlusEnabled: Bool {
        return isNewsPlus == 1
    }
    
    init(title: String, source: String, sourceLogo: String, imageUrl: String, isNewsPlus: Int) {
        self.title = title
        self.source = source
        self.sourceLogo = sourceLogo
        self.imageUrl = imageUrl
        self.isNewsPlus = isNewsPlus
    }
}

struct Provider: AppIntentTimelineProvider {
    func loadDataFromSharedStore() -> NewsArticle? {
        print("🔍 Widget: Starting to load data from shared store")
        let sharedDefaults = UserDefaults(suiteName: APP_GROUP_NAME)
        print("🔍 Widget: Using app group:", APP_GROUP_NAME)
        
        // Debug: Print all available keys and values
        if let dict = sharedDefaults?.dictionaryRepresentation() {
            print("📝 Widget: All keys in UserDefaults:", Array(dict.keys))
            print("📝 Widget: All values in UserDefaults:", dict)
        } else {
            print("❌ Widget: Failed to get UserDefaults dictionary")
        }
        
        // Get JSON string from UserDefaults
        guard let jsonString = sharedDefaults?.string(forKey: "latestNews") else {
            print("❌ Widget: No JSON string found for latestNews")
            return nil
        }
        
        print("📝 Widget: Retrieved JSON string:", jsonString)
        
        // Convert string to data
        guard let jsonData = jsonString.data(using: .utf8) else {
            print("❌ Widget: Failed to convert string to data")
            return nil
        }
        
        // Decode JSON
        do {
            let decoder = JSONDecoder()
            let article = try decoder.decode(NewsArticle.self, from: jsonData)
            print("✅ Widget: Successfully decoded article:", article)
            return article
        } catch {
            print("❌ Widget: Failed to decode article. Error:", error)
            print("📝 Widget: JSON data:", String(data: jsonData, encoding: .utf8) ?? "nil")
            return nil
        }
    }
    
    func placeholder(in context: Context) -> SimpleEntry {
        print("📱 Widget: placeholder() called")
        if let article = loadDataFromSharedStore() {
            print("✅ Widget: Using real data for placeholder")
            return SimpleEntry(date: Date(), article: article)
        }
        
        print("ℹ️ Widget: Using default placeholder data")
        let placeholderArticle = NewsArticle(
            title: "Loading latest news...",
            source: "News",
            sourceLogo: "https://example.com/logo.png",
            imageUrl: "https://example.com/image.jpg",
            isNewsPlus: 0
        )
        return SimpleEntry(date: Date(), article: placeholderArticle)
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        print("📱 Widget: snapshot() called")
        if let article = loadDataFromSharedStore() {
            print("✅ Widget: Using real data for snapshot")
            return SimpleEntry(date: Date(), article: article)
        }
        
        print("ℹ️ Widget: Using placeholder for snapshot")
        return placeholder(in: context)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        print("📱 Widget: timeline() called")
        var entries: [SimpleEntry] = []
        let currentDate = Date()
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: currentDate)!
        
        if let article = loadDataFromSharedStore() {
            print("✅ Widget: Using real data for timeline")
            let entry = SimpleEntry(date: currentDate, article: article)
            entries.append(entry)
        } else {
            print("ℹ️ Widget: Using placeholder for timeline")
            entries.append(placeholder(in: context))
        }

        print("📱 Widget: Timeline created, next update at", nextUpdate)
        return Timeline(entries: entries, policy: .after(nextUpdate))
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let article: NewsArticle
}

struct NewsWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        case .systemLarge:
            LargeWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

struct SmallWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            AsyncImage(url: URL(string: entry.article.sourceLogo)) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(height: 20)
            } placeholder: {
                Text(entry.article.source)
                    .font(.caption)
                    .fontWeight(.bold)
            }
            
            Text(entry.article.title)
                .font(.headline)
                .lineLimit(3)
                .minimumScaleFactor(0.8)
        }
        .padding()
    }
}

struct MediumWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 8) {
                AsyncImage(url: URL(string: entry.article.sourceLogo)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 24)
                } placeholder: {
                    Text(entry.article.source)
                        .font(.caption)
                        .fontWeight(.bold)
                }
                
                Text(entry.article.title)
                    .font(.headline)
                    .lineLimit(4)
                    .minimumScaleFactor(0.8)
            }
            .padding()
            
            AsyncImage(url: URL(string: entry.article.imageUrl)) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 120)
                    .clipped()
            } placeholder: {
                Color.gray.opacity(0.3)
            }
        }
    }
}

struct LargeWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        VStack(spacing: 0) {
            AsyncImage(url: URL(string: entry.article.imageUrl)) { image in
                image.resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(height: 160)
                    .clipped()
            } placeholder: {
                Color.gray.opacity(0.3)
                    .frame(height: 160)
            }
            
            VStack(alignment: .leading, spacing: 12) {
                AsyncImage(url: URL(string: entry.article.sourceLogo)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 24)
                } placeholder: {
                    Text(entry.article.source)
                        .font(.caption)
                        .fontWeight(.bold)
                }
                
                Text(entry.article.title)
                    .font(.title3)
                    .fontWeight(.bold)
                    .lineLimit(3)
                    .minimumScaleFactor(0.8)
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

struct NewsWidget: Widget {
    let kind: String = "NewsWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            NewsWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("News Widget")
        .description("Display the latest news articles.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

#Preview(as: .systemSmall) {
    NewsWidget()
} timeline: {
    SimpleEntry(
        date: .now,
        article: Provider().loadDataFromSharedStore() ?? NewsArticle(
            title: "Loading latest news...",
            source: "News",
            sourceLogo: "https://example.com/logo.png",
            imageUrl: "https://example.com/image.jpg",
            isNewsPlus: 0
        )
    )
}

#Preview(as: .systemMedium) {
    NewsWidget()
} timeline: {
    SimpleEntry(
        date: .now,
        article: Provider().loadDataFromSharedStore() ?? NewsArticle(
            title: "Loading latest news...",
            source: "News",
            sourceLogo: "https://example.com/logo.png",
            imageUrl: "https://example.com/image.jpg",
            isNewsPlus: 0
        )
    )
}

#Preview(as: .systemLarge) {
    NewsWidget()
} timeline: {
    SimpleEntry(
        date: .now,
        article: Provider().loadDataFromSharedStore() ?? NewsArticle(
            title: "Loading latest news...",
            source: "News",
            sourceLogo: "https://example.com/logo.png",
            imageUrl: "https://example.com/image.jpg",
            isNewsPlus: 0
        )
    )
}
