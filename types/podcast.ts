import { SharedValue } from 'react-native-reanimated';

export interface PodcastEpisode {
  id: string;
  title: string;
  streamUrl: string;
  artwork: {
    url: string;
  };
  showTitle: string;
  duration: number;
  releaseDate: string;
  summary: string;
}

export interface PodcastEpisodeData {
  id: string;
  type: string;
  attributes: {
    name: string;
    description: {
      standard: string;
      short: string;
    };
    artwork: {
      url: string;
      width: number;
      height: number;
    };
    durationInMilliseconds: number;
    releaseDateTime: string;
    assetUrl: string;
    artistName: string;
  };
}

export interface PodcastData {
  intent: {
    storefront: string;
    language: null | string;
    roomId: string;
    $kind: string;
  };
  data: {
    shelves: Array<{
      contentType: string;
      items: Array<{
        id: string;
        title: string;
        duration: number;
        releaseDate: string;
        showTitle: string;
        summary: string;
        episodeArtwork?: {
          template: string;
          width: number;
          height: number;
        };
        icon?: {
          template: string;
          width: number;
          height: number;
        };
        playAction: {
          episodeOffer: {
            streamUrl: string;
          };
        };
      }>;
    }>;
  };
}

export interface AudioContextType {
  // ... other types
  progress: SharedValue<number>;
} 