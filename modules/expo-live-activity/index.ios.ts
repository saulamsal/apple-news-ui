import { NativeModule, requireNativeModule } from "expo";

export type ExpoLiveActivityModuleEvents = {
  onLiveActivityCancel: () => void;
};

export interface LiveActivityState {
  homeScore: number;
  awayScore: number;
  timeOrPeriod: string;
  currentEvent: string;
  situation: string;
}

interface ExpoLiveActivityModule {
  areActivitiesEnabled(): boolean;
  isActivityInProgress(): boolean;
  isActivityInProgressForGame(gameID: string): boolean;
  startActivity(args: [
    string,  // gameID
    string,  // competition
    string,  // homeTeam
    string,  // awayTeam
    string,  // homeLogo
    string,  // awayLogo
    string,  // homeColor
    string,  // awayColor
    LiveActivityState  // initialState
  ]): Promise<boolean>;
  updateActivity(gameID: string, state: LiveActivityState): void;
  endActivity(gameID: string, state: LiveActivityState): void;
}

const nativeModule = requireNativeModule<ExpoLiveActivityModule>("ExpoLiveActivity");

const LiveActivities = {
  areActivitiesEnabled(): boolean {
    const enabled = nativeModule.areActivitiesEnabled();
    console.log('[LiveActivity:TS] Activities enabled:', enabled);
    return enabled;
  },

  isActivityInProgress(): boolean {
    const inProgress = nativeModule.isActivityInProgress();
    console.log('[LiveActivity:TS] Activity in progress:', inProgress);
    return inProgress;
  },

  isActivityInProgressForGame(gameID: string): boolean {
    try {
      console.log('[LiveActivity:TS] Checking activity for game:', gameID);
      const exists = nativeModule.isActivityInProgressForGame(gameID);
      console.log('[LiveActivity:TS] Activity exists:', exists);
      return exists ?? false;
    } catch (error) {
      console.error('[LiveActivity:TS] Error checking activity:', error);
      return false;
    }
  },

  async startActivity(
    gameID: string,
    competition: string,
    homeTeam: string,
    awayTeam: string,
    homeLogo: string,
    awayLogo: string,
    homeColor: string,
    awayColor: string,
    initialState: LiveActivityState
  ): Promise<boolean> {
    console.log('[LiveActivity:TS] Starting activity with params:', {
      gameID,
      competition,
      homeTeam,
      awayTeam,
      homeLogo,
      awayLogo,
      homeColor,
      awayColor,
      initialState
    });

    try {
      // First check if an activity for this game already exists
      if (this.isActivityInProgressForGame(gameID)) {
        console.log('[LiveActivity:TS] Activity already exists, updating instead');
        this.updateActivity(gameID, initialState);
        return true;
      }

      // Create the arguments array
      const args: [string, string, string, string, string, string, string, string, LiveActivityState] = [
        gameID,
        competition,
        homeTeam,
        awayTeam,
        homeLogo,
        awayLogo,
        homeColor,
        awayColor,
        initialState
      ];

      console.log('[LiveActivity:TS] Creating new activity with args:', args);
      const result = await nativeModule.startActivity(args);
      console.log('[LiveActivity:TS] Activity creation result:', result);
      return result;
    } catch (error) {
      console.error('[LiveActivity:TS] Error starting activity:', error);
      return false;
    }
  },

  updateActivity(gameID: string, state: LiveActivityState): void {
    try {
      console.log('[LiveActivity:TS] Updating activity:', gameID, state);
      
      if (this.isActivityInProgressForGame(gameID)) {
        console.log('[LiveActivity:TS] Activity found, updating');
        nativeModule.updateActivity(gameID, state);
      } else {
        console.log('[LiveActivity:TS] No activity found to update');
      }
    } catch (error) {
      console.error('[LiveActivity:TS] Error updating activity:', error);
    }
  },

  endActivity(gameID: string, state: LiveActivityState): void {
    try {
      console.log('[LiveActivity:TS] Ending activity:', gameID, state);
      
      if (this.isActivityInProgressForGame(gameID)) {
        console.log('[LiveActivity:TS] Activity found, ending');
        nativeModule.endActivity(gameID, state);
      } else {
        console.log('[LiveActivity:TS] No activity found to end');
      }
    } catch (error) {
      console.error('[LiveActivity:TS] Error ending activity:', error);
    }
  },
};

export default LiveActivities;