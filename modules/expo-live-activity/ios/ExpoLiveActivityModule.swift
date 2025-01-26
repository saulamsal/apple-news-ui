import ExpoModulesCore
import ActivityKit

// MUST exactly match the WidgetAttributes struct in WidgetLiveActivity.
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
    
    // Fixed non-changing properties about your activity go here!
    var competition: String
    var homeTeam: String
    var awayTeam: String
    var homeLogo: String
    var awayLogo: String
}

public class ExpoLiveActivityModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoLiveActivity')` in JavaScript.
        Name("ExpoLiveActivity")
        
        Events("onLiveActivityCancel")
        
        Function("areActivitiesEnabled") { () -> Bool in
            if #available(iOS 16.2, *) {
                return ActivityAuthorizationInfo().areActivitiesEnabled
            } else {
                return false
            }
        }
        
        Function("isActivityInProgress") { () -> Bool in
            if #available(iOS 16.2, *) {
                return !Activity<WidgetAttributes>.activities.isEmpty
            } else {
                return false
            }
        }
        
        Function("startActivity") { (competition: String, homeTeam: String, awayTeam: String, homeLogo: String, awayLogo: String, initialState: [String: Any]) -> Bool in
            if #available(iOS 16.2, *) {
                let attributes = WidgetAttributes(
                    competition: competition,
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    homeLogo: homeLogo,
                    awayLogo: awayLogo
                )
                
                let contentState = WidgetAttributes.ContentState(
                    homeScore: initialState["homeScore"] as? Int ?? 0,
                    awayScore: initialState["awayScore"] as? Int ?? 0,
                    timeOrPeriod: initialState["timeOrPeriod"] as? String ?? "0'",
                    currentEvent: initialState["currentEvent"] as? String ?? "",
                    situation: initialState["situation"] as? String ?? "",
                    homeColor: initialState["homeColor"] as? String ?? "#000000",
                    awayColor: initialState["awayColor"] as? String ?? "#000000"
                )
                
                let activityContent = ActivityContent(state: contentState, staleDate: nil)
                
                do {
                    let activity = try Activity.request(attributes: attributes, content: activityContent)
                    NotificationCenter.default.addObserver(self, selector: #selector(self.onLiveActivityCancel), name: Notification.Name("onLiveActivityCancel"), object: nil)
                    return true
                } catch (let error) {
                    print("Error starting activity: \(error)")
                    return false
                }
            } else {
                return false
            }
        }
        
        Function("updateActivity") { (state: [String: Any]) -> Void in
            if #available(iOS 16.2, *) {
                let contentState = WidgetAttributes.ContentState(
                    homeScore: state["homeScore"] as? Int ?? 0,
                    awayScore: state["awayScore"] as? Int ?? 0,
                    timeOrPeriod: state["timeOrPeriod"] as? String ?? "0'",
                    currentEvent: state["currentEvent"] as? String ?? "",
                    situation: state["situation"] as? String ?? "",
                    homeColor: state["homeColor"] as? String ?? "#000000",
                    awayColor: state["awayColor"] as? String ?? "#000000"
                )
                
                Task {
                    for activity in Activity<WidgetAttributes>.activities {
                        await activity.update(using: contentState)
                    }
                }
            }
        }
        
        Function("endActivity") { (state: [String: Any]) -> Void in
            if #available(iOS 16.2, *) {
                let contentState = WidgetAttributes.ContentState(
                    homeScore: state["homeScore"] as? Int ?? 0,
                    awayScore: state["awayScore"] as? Int ?? 0,
                    timeOrPeriod: state["timeOrPeriod"] as? String ?? "FINAL",
                    currentEvent: state["currentEvent"] as? String ?? "",
                    situation: state["situation"] as? String ?? "",
                    homeColor: state["homeColor"] as? String ?? "#000000",
                    awayColor: state["awayColor"] as? String ?? "#000000"
                )
                
                let finalContent = ActivityContent(state: contentState, staleDate: nil)
                
                Task {
                    for activity in Activity<WidgetAttributes>.activities {
                        await activity.end(finalContent, dismissalPolicy: .default)
                    }
                }
                NotificationCenter.default.removeObserver(self, name: Notification.Name("onLiveActivityCancel"), object: nil)
            }
        }
    }
    
    @objc
    func onLiveActivityCancel() {
        sendEvent("onLiveActivityCancel", [:])
    }
}
