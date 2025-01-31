export type ExpoLiveActivityModuleEvents = {
  onLiveActivityCancel: () => void;
};

interface LiveActivityState {
  homeScore: number;
  awayScore: number;
  timeOrPeriod: string;
  currentEvent: string;
  situation: string;
  homeColor: string;
  awayColor: string;
}

const LiveActivities = {
  areActivitiesEnabled(): boolean {
    return false;
  },

  isActivityInProgress(): boolean {
    return false;
  },

  startActivity: (
    competition: string,
    homeTeam: string,
    homeTeamNickname: string,
    awayTeam: string,
    awayTeamNickname: string,
    homeLogo: string,
    awayLogo: string,
    initialState: any
  ) => Promise<boolean>,

  updateActivity: (state: any) => Promise<boolean>,

  endActivity: (state: any) => Promise<boolean>,
};

export default LiveActivities;
