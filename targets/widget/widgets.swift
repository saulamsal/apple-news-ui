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

// Dummy data for testing
let dummyArticles = [
    NewsArticle(
        title: "Trump signs executive actions on Jan. 6, TikTok, immigration and more",
        source: "Yahoo",
        sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Yahoo%21_%282019%29.svg/1200px-Yahoo%21_%282019%29.svg.png",
        imageUrl: "https://npr.brightspotcdn.com/dims3/default/strip/false/crop/4477x2984+0+0/resize/1100/quality/85/format/webp/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Fd0%2Fef%2F9b556f744f428622f04dff087855%2Fgettyimages-2194440770.jpg",
        isNewsPlus: 1
    ),
    NewsArticle(
        title: "Mike Tyson is bigger than boxing. His fight with Jake Paul is proof.",
        source: "Sports Illustrated", 
        sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/SportsIllustratedLogo.svg/2560px-SportsIllustratedLogo.svg.png",
        imageUrl: "https://www.aljazeera.com/wp-content/uploads/2024/11/AFP__20241115__36MH9YH__v2__HighRes__BoxHeavyUsaTysonPaulWeighIn-1731720368.jpg?resize=570%2C380&quality=80",
        isNewsPlus: 1
    ),
    NewsArticle(
        title: "Trump's family circle has a different look as he returns to the White House",
        source: "AP",
        sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Associated_Press_logo_2012.svg/2560px-Associated_Press_logo_2012.svg.png",
        imageUrl: "https://s.yimg.com/ny/api/res/1.2/TMni9_X6IlPj3l5Hv8zcjQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTY0MA--/https://media.zenfs.com/en/ap.org/24c93ab1b4b4259db0817866f8c821a3",
        isNewsPlus: 0
    )
]

struct Provider: AppIntentTimelineProvider {
    func loadArticleData(useDummyData: Bool = true) -> NewsArticle? {
        if useDummyData {
            return dummyArticles[0]
        }
        
        // TODO: Fix issue with SharedDefaults not working properly
        // Uncomment and fix the below code when SharedDefaults is working
        /*
        print("🔍 Widget: Starting to load data from shared store")
        let sharedDefaults = UserDefaults(suiteName: APP_GROUP_NAME)
        
        guard let jsonString = sharedDefaults?.string(forKey: "latestNews"),
              let jsonData = jsonString.data(using: .utf8) else {
            return nil
        }
        
        do {
            let decoder = JSONDecoder()
            return try decoder.decode(NewsArticle.self, from: jsonData)
        } catch {
            print("❌ Widget: Failed to decode article. Error:", error)
            return nil
        }
        */
        
        return nil
    }
    
    func placeholder(in context: Context) -> SimpleEntry {
        if let article = loadArticleData() {
            return SimpleEntry(date: Date(), article: article)
        }
        return SimpleEntry(date: Date(), article: dummyArticles[0])
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        if let article = loadArticleData() {
            return SimpleEntry(date: Date(), article: article)
        }
        return SimpleEntry(date: Date(), article: dummyArticles[1])
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        var entries: [SimpleEntry] = []
        let currentDate = Date()
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: currentDate)!
        
        if let article = loadArticleData() {
            entries.append(SimpleEntry(date: currentDate, article: article))
        } else {
            entries.append(SimpleEntry(date: currentDate, article: dummyArticles[2]))
        }

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
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Top Stories")
                    .font(.headline)
                    .foregroundColor(.red)
                Spacer()
                Image(systemName: "apple.news")
                    .foregroundColor(.red)
            }
            .padding(.horizontal)
            .padding(.top)
            
            Text(entry.article.title)
                .font(.subheadline)
                .lineLimit(4)
                .padding(.horizontal)
                .padding(.bottom)
        }
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 15))
    }
}

struct MediumWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Science")
                    .font(.headline)
                    .foregroundColor(.blue)
                Spacer()
                Image(systemName: "apple.news")
                    .foregroundColor(.red)
            }
            .padding(.horizontal)
            .padding(.top, 8)
            
            VStack(alignment: .leading, spacing: 8) {
                ForEach(0..<2) { index in
                    if index > 0 {
                        Divider()
                    }
                    
                    HStack(spacing: 8) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(entry.article.source)
                                .font(.caption)
                                .foregroundColor(.gray)
                            Text(entry.article.title)
                                .font(.callout)
                                .lineLimit(2)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        AsyncImage(url: URL(string: entry.article.imageUrl)) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 50, height: 50)
                                .clipShape(RoundedRectangle(cornerRadius: 6))
                        } placeholder: {
                            Color.gray.opacity(0.3)
                                .frame(width: 50, height: 50)
                                .clipShape(RoundedRectangle(cornerRadius: 6))
                        }
                    }
                    .padding(.horizontal)
                }
            }
            .padding(.vertical, 8)
        }
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 15))
    }
}

struct LargeWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Science")
                    .font(.headline)
                    .foregroundColor(.blue)
                Spacer()
                Image(systemName: "apple.news")
                    .foregroundColor(.red)
            }
            .padding()
            
            VStack(alignment: .leading, spacing: 12) {
                ForEach(0..<3) { index in
                    if index > 0 {
                        Divider()
                    }
                    
                    HStack(spacing: 12) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(entry.article.source)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            Text(entry.article.title)
                                .font(.headline)
                                .lineLimit(2)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        AsyncImage(url: URL(string: entry.article.imageUrl)) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 60, height: 60)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        } placeholder: {
                            Color.gray.opacity(0.3)
                                .frame(width: 60, height: 60)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                    }
                    .padding(.horizontal)
                }
            }
            .padding(.vertical, 8)
        }
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 15))
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
        article: Provider().loadArticleData() ?? NewsArticle(
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
        article: Provider().loadArticleData() ?? NewsArticle(
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
        article: Provider().loadArticleData() ?? NewsArticle(
            title: "Loading latest news...",
            source: "News",
            sourceLogo: "https://example.com/logo.png",
            imageUrl: "https://example.com/image.jpg",
            isNewsPlus: 0
        )
    )
}
