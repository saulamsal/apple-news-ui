//
//  group_com_sportapp_an_ui_ScoresWidgetLiveActivity.swift
//  group.com.sportapp.an-ui.ScoresWidget
//
//  Created by Saul Sharma on 1/18/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct group_com_sportapp_an_ui_ScoresWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct group_com_sportapp_an_ui_ScoresWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: group_com_sportapp_an_ui_ScoresWidgetAttributes.self) { context in
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

extension group_com_sportapp_an_ui_ScoresWidgetAttributes {
    fileprivate static var preview: group_com_sportapp_an_ui_ScoresWidgetAttributes {
        group_com_sportapp_an_ui_ScoresWidgetAttributes(name: "World")
    }
}

extension group_com_sportapp_an_ui_ScoresWidgetAttributes.ContentState {
    fileprivate static var smiley: group_com_sportapp_an_ui_ScoresWidgetAttributes.ContentState {
        group_com_sportapp_an_ui_ScoresWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: group_com_sportapp_an_ui_ScoresWidgetAttributes.ContentState {
         group_com_sportapp_an_ui_ScoresWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: group_com_sportapp_an_ui_ScoresWidgetAttributes.preview) {
   group_com_sportapp_an_ui_ScoresWidgetLiveActivity()
} contentStates: {
    group_com_sportapp_an_ui_ScoresWidgetAttributes.ContentState.smiley
    group_com_sportapp_an_ui_ScoresWidgetAttributes.ContentState.starEyes
}
