export type ExpoLiveActivityModuleEvents = {
  onLiveActivityCancel: () => void;
};

interface LiveActivityState {
  homeScore: number;
  awayScore: number;
  timeOrPeriod: string;
  currentEvent: string;
  situation: string;
}

const LiveActivities = {
  areActivitiesEnabled(): boolean {
    return false;
  },

  isActivityInProgress(): boolean {
    return false;
  },

  startActivity(
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

  updateActivity(state: LiveActivityState): void {},

  endActivity(state: LiveActivityState): void {},
};

export default LiveActivities;