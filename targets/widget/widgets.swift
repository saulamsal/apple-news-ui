import WidgetKit
import SwiftUI

let APP_GROUP_NAME = "group.com.sportapp.anews-ui"

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
        title: "DeepSeek AI App Overtakes ChatGPT, Spooks Tech Market",
        source: "The Washington Post",
        sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Logo_of_The_Washington_Post_Newspaper.svg/2560px-The_Logo_of_The_Washington_Post_Newspaper.svg.png",
        imageUrl: "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/EYXT27QC4M62VXI3NXUG4WVCQU.JPG&w=1200",
        isNewsPlus: 1
    ),
    NewsArticle(
        title: "Chiefs Defeat Bills 32-29 in AFC Championship",
        source: "The Athletic",
        sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/The_Athletic_wordmark_black_2020.svg/2560px-The_Athletic_wordmark_black_2020.svg.png",
        imageUrl: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_auto,q_auto:best/rockcms/2025-01/250124-Chiefs-Bills-aa-1256-8f6ff0.jpg",
        isNewsPlus: 1
    ),
    NewsArticle(
        title: "Amazon's Zoox Plans To Launch Robotaxi Service This Year",
        source: "Benzinga",
        sourceLogo: "https://www.benzinga.com/next-assets/images/benzinga-logo.png",
        imageUrl: "https://fortune.com/img-assets/wp-content/uploads/2024/09/GettyImages-2154179524-e1726086410920.jpg",
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
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 4) {
                Text("@saul_sharma")
                .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundColor(.red)
                Spacer()
                Image(systemName: "apple.news")
                    .font(.caption2)
                    .foregroundColor(.red)
            }
            .padding(.horizontal, 8)
            .padding(.top, 0)
            
            Text(entry.article.title)
            .font(.caption)
                .fontWeight(.bold)
                .lineLimit(4)
                .padding(.horizontal, 8)
                .padding(.top, 2)
            
            if entry.article.isNewsPlusEnabled {
                HStack {
                    Text("News+")
                        .font(.caption2)
                        .fontWeight(.semibold)
                        .foregroundColor(.red)
                }
                .padding(.horizontal, 8)
                .padding(.top, 2)
                .padding(.bottom, 2)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct MediumWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 4) {
                Text("Latest News")
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundColor(.red)
                Spacer()
                Image(systemName: "apple.news")
                    .font(.caption2)
                    .foregroundColor(.red)
            }
            .padding(.horizontal, 12)
            .padding(.top, 10)
            .padding(.bottom, 4)
            
            VStack(alignment: .leading, spacing: 8) {
                ForEach(0..<2) { index in
                    let article = dummyArticles[index]
                    HStack(spacing: 8) {
                        VStack(alignment: .leading, spacing: 1) {
                            Text(article.source)
                                .font(.caption2)
                                .foregroundColor(.gray)
                            Text(article.title)
                                .font(.caption)
                                .fontWeight(.bold)
                                .lineLimit(2)
                            if article.isNewsPlusEnabled {
                                HStack(spacing: 2) {
                                    Text("News+")
                                        .font(.caption2)
                                        .fontWeight(.semibold)
                                }
                                .foregroundColor(.red)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        AsyncImage(url: URL(string: article.imageUrl)) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 50, height: 50)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        } placeholder: {
                            Color.gray.opacity(0.2)
                                .frame(width: 50, height: 50)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                    }
                    .padding(.horizontal, 12)
                    
                    if index == 0 {
                        Divider()
                            .padding(.horizontal, 12)
                    }
                }
            }
            .padding(.vertical, 4)
        }
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct LargeWidgetView: View {
    var entry: Provider.Entry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 4) {
                Text("Top Stories")
                  .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(.red)
                Spacer()
                Image(systemName: "apple.news")
                    .font(.caption2)
                    .foregroundColor(.red)
            }
            .padding(.horizontal, 12)
            .padding(.top, 8)
            .padding(.bottom, 2)
            
            VStack(alignment: .leading, spacing: 10) {
                ForEach(0..<3) { index in
                    let article = dummyArticles[index]
                    HStack(spacing: 8) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(article.source)
                                .font(.caption2)
                                .foregroundColor(.gray)
                            Text(article.title)
                            .font(.subheadline)
                                .fontWeight(.bold)
                                .lineLimit(3)
                            if article.isNewsPlusEnabled {
                                HStack(spacing: 2) {
                                    Text("News+")
                                        .font(.caption2)
                                        .fontWeight(.semibold)
                                }
                                .foregroundColor(.red)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        AsyncImage(url: URL(string: article.imageUrl)) { image in
                            image.resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 60, height: 60)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        } placeholder: {
                            Color.gray.opacity(0.2)
                                .frame(width: 60, height: 60)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                    }
                    .padding(.horizontal, 12)
                    
                    if index < 2 {
                        Divider()
                            .padding(.horizontal, 12)
                    }
                }
            }
            .padding(.vertical, 8)
        }
        .clipShape(RoundedRectangle(cornerRadius: 12))
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

