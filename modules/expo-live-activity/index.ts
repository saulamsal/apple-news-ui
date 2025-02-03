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

interface LiveActivities {
  areActivitiesEnabled(): boolean;
  isActivityInProgress(): boolean;
  isActivityInProgressForGame(gameID: string): boolean;
  startActivity(
    gameID: string,
    competition: string,
    homeTeam: string,
    awayTeam: string,
    homeLogo: string,
    awayLogo: string,
    homeColor: string,
    awayColor: string,
    initialState: LiveActivityState
  ): Promise<boolean>;
  updateActivity(gameID: string, state: LiveActivityState): void;
  endActivity(gameID: string, state: LiveActivityState): void;
}

const LiveActivities: LiveActivities = {
  areActivitiesEnabled(): boolean {
    return false;
  },

  isActivityInProgress(): boolean {
    return false;
  },

  isActivityInProgressForGame(gameID: string): boolean {
    return false;
  },

  startActivity(
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
    return Promise.resolve(false);
  },

  updateActivity(gameID: string, state: LiveActivityState): void {},

  endActivity(gameID: string, state: LiveActivityState): void {},
};

export default LiveActivities;