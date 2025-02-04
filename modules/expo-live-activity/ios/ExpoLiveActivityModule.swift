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
    }
    
    // Fixed non-changing properties about your activity go here!
    var gameID: String
    var competition: String
    var homeTeam: String
    var awayTeam: String
    var homeLogo: String
    var awayLogo: String
    var homeColor: String
    var awayColor: String
}

public class ExpoLiveActivityModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        Name("ExpoLiveActivity")
        
        Events("onLiveActivityCancel")
        
        // Register all functions
        AsyncFunction("startActivity") { (args: [Any]) throws -> Bool in
            guard args.count == 9,
                  let gameID = args[0] as? String,
                  let competition = args[1] as? String,
                  let homeTeam = args[2] as? String,
                  let awayTeam = args[3] as? String,
                  let homeLogo = args[4] as? String,
                  let awayLogo = args[5] as? String,
                  let homeColor = args[6] as? String,
                  let awayColor = args[7] as? String,
                  let initialState = args[8] as? [String: Any] else {
                throw NSError(domain: "ExpoLiveActivity", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid arguments"])
            }
            
            print("[LiveActivity] Starting activity with params:", [
                "gameID": gameID,
                "competition": competition,
                "homeTeam": homeTeam,
                "awayTeam": awayTeam,
                "homeLogo": homeLogo,
                "awayLogo": awayLogo,
                "homeColor": homeColor,
                "awayColor": awayColor,
                "initialState": initialState
            ])
            
            if #available(iOS 16.2, *) {
                print("[LiveActivity] Creating attributes for game: \(gameID)")
                let attributes = WidgetAttributes(
                    gameID: gameID,
                    competition: competition,
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    homeLogo: homeLogo,
                    awayLogo: awayLogo,
                    homeColor: homeColor,
                    awayColor: awayColor
                )
                
                print("[LiveActivity] Creating content state")
                let contentState = WidgetAttributes.ContentState(
                    homeScore: initialState["homeScore"] as? Int ?? 0,
                    awayScore: initialState["awayScore"] as? Int ?? 0,
                    timeOrPeriod: initialState["timeOrPeriod"] as? String ?? "0'",
                    currentEvent: initialState["currentEvent"] as? String ?? "",
                    situation: initialState["situation"] as? String ?? ""
                )
                
                print("[LiveActivity] Initial state: \(initialState)")
                let activityContent = ActivityContent(state: contentState, staleDate: nil)
                
                do {
                    print("[LiveActivity] Requesting activity for game: \(gameID)")
                    let activity = try Activity.request(attributes: attributes, content: activityContent)
                    print("[LiveActivity] Activity started successfully")
                    print("[LiveActivity] Activity ID: \(activity.id)")
                    print("[LiveActivity] Activity state: \(activity.contentState)")
                    NotificationCenter.default.addObserver(self, selector: #selector(self.onLiveActivityCancel), name: Notification.Name("onLiveActivityCancel"), object: nil)
                    return true
                } catch (let error) {
                    print("[LiveActivity] Failed to start activity")
                    print("[LiveActivity] Error: \(error.localizedDescription)")
                    if let nsError = error as NSError? {
                        print("[LiveActivity] Error domain: \(nsError.domain)")
                        print("[LiveActivity] Error code: \(nsError.code)")
                        print("[LiveActivity] Error user info: \(nsError.userInfo)")
                    }
                    return false
                }
            } else {
                print("[LiveActivity] iOS version < 16.2, cannot start activity")
                return false
            }
        }
        
        Function("areActivitiesEnabled") { () -> Bool in
            if #available(iOS 16.2, *) {
                let enabled = ActivityAuthorizationInfo().areActivitiesEnabled
                print("[LiveActivity] Activities enabled: \(enabled)")
                return enabled
            } else {
                print("[LiveActivity] iOS version < 16.2, activities not supported")
                return false
            }
        }
        
        Function("isActivityInProgress") { () -> Bool in
            if #available(iOS 16.2, *) {
                let hasActivities = !Activity<WidgetAttributes>.activities.isEmpty
                print("[LiveActivity] Has active activities: \(hasActivities)")
                return hasActivities
            } else {
                print("[LiveActivity] iOS version < 16.2, no activities possible")
                return false
            }
        }
        
        Function("isActivityInProgressForGame") { (gameID: String) -> Bool in
            print("[LiveActivity] Checking if activity exists for game: \(gameID)")
            if #available(iOS 16.2, *) {
                let exists = Activity<WidgetAttributes>.activities.contains { activity in
                    activity.attributes.gameID == gameID
                }
                print("[LiveActivity] Activity exists: \(exists)")
                return exists
            }
            print("[LiveActivity] iOS version < 16.2, no activities possible")
            return false
        }
        
        Function("updateActivity") { (gameID: String, state: [String: Any]) -> Void in
            print("[LiveActivity] Updating activity for game: \(gameID)")
            print("[LiveActivity] Update state: \(state)")
            
            if #available(iOS 16.2, *) {
                let contentState = WidgetAttributes.ContentState(
                    homeScore: state["homeScore"] as? Int ?? 0,
                    awayScore: state["awayScore"] as? Int ?? 0,
                    timeOrPeriod: state["timeOrPeriod"] as? String ?? "0'",
                    currentEvent: state["currentEvent"] as? String ?? "",
                    situation: state["situation"] as? String ?? ""
                )
                
                Task {
                    let activities = Activity<WidgetAttributes>.activities
                    print("[LiveActivity] Found \(activities.count) active activities")
                    
                    for activity in activities {
                        print("[LiveActivity] Checking activity: \(activity.id)")
                        if activity.attributes.gameID == gameID {
                            print("[LiveActivity] Updating matching activity")
                            await activity.update(using: contentState)
                            print("[LiveActivity] Activity updated successfully")
                            break
                        }
                    }
                }
            }
        }
        
        Function("endActivity") { (gameID: String, state: [String: Any]) -> Void in
            print("[LiveActivity] Ending activity for game: \(gameID)")
            if #available(iOS 16.2, *) {
                let contentState = WidgetAttributes.ContentState(
                    homeScore: state["homeScore"] as? Int ?? 0,
                    awayScore: state["awayScore"] as? Int ?? 0,
                    timeOrPeriod: state["timeOrPeriod"] as? String ?? "FINAL",
                    currentEvent: state["currentEvent"] as? String ?? "",
                    situation: state["situation"] as? String ?? ""
                )
                
                let finalContent = ActivityContent(state: contentState, staleDate: nil)
                
                Task {
                    for activity in Activity<WidgetAttributes>.activities {
                        if activity.attributes.gameID == gameID {
                            print("[LiveActivity] Ending activity: \(activity.id)")
                            await activity.end(finalContent, dismissalPolicy: .default)
                            print("[LiveActivity] Activity ended successfully")
                            break
                        }
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