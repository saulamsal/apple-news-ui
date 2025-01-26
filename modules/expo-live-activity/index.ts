import { NativeModule, requireNativeModule } from "expo";

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

interface ExpoLiveActivityModule {
  areActivitiesEnabled(): boolean;
  isActivityInProgress(): boolean;
  startActivity(
    competition: string,
    homeTeam: string,
    awayTeam: string,
    homeLogo: string,
    awayLogo: string,
    initialState: LiveActivityState
  ): Promise<boolean>;
  updateActivity(state: LiveActivityState): void;
  endActivity(state: LiveActivityState): void;
}

const nativeModule = requireNativeModule<ExpoLiveActivityModule>("ExpoLiveActivity");

const LiveActivities = {
  areActivitiesEnabled(): boolean {
    return nativeModule.areActivitiesEnabled();
  },

  isActivityInProgress(): boolean {
    return nativeModule.isActivityInProgress();
  },

  startActivity(
    competition: string,
    homeTeam: string,
    awayTeam: string,
    homeLogo: string,
    awayLogo: string,
    initialState: LiveActivityState
  ): Promise<boolean> {
    return nativeModule.startActivity(
      competition,
      homeTeam,
      awayTeam,
      homeLogo,
      awayLogo,
      initialState
    );
  },

  updateActivity(state: LiveActivityState): void {
    nativeModule.updateActivity(state);
  },

  endActivity(state: LiveActivityState): void {
    nativeModule.endActivity(state);
  },
};

export default LiveActivities;
