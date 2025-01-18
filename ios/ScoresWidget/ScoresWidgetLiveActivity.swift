//
//  ScoresWidgetLiveActivity.swift
//  ScoresWidget
//
//  Created by Saul Sharma on 1/18/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct ScoresWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct ScoresWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: ScoresWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension ScoresWidgetAttributes {
    fileprivate static var preview: ScoresWidgetAttributes {
        ScoresWidgetAttributes(name: "World")
    }
}

extension ScoresWidgetAttributes.ContentState {
    fileprivate static var smiley: ScoresWidgetAttributes.ContentState {
        ScoresWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: ScoresWidgetAttributes.ContentState {
         ScoresWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: ScoresWidgetAttributes.preview) {
   ScoresWidgetLiveActivity()
} contentStates: {
    ScoresWidgetAttributes.ContentState.smiley
    ScoresWidgetAttributes.ContentState.starEyes
}
