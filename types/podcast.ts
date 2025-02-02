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
  attributes?: {
    offers?: Array<{
      kind: string;
      type: string;
      hlsUrl?: string;
      durationInMilliseconds?: number;
    }>;
    durationInMilliseconds?: number;
    name: string;
    artistName: string;
  };
}

export interface PodcastEpisodeData {
  id: string;
  type: string;
  href: string;
  attributes: {
    offers: Array<{
      kind: string;
      type: string;
    }>;
    copyright: string;
    contentAdvisory: string;
    genreNames: string[];
    artworkOrigin: string;
    itunesTitle: string;
    kind: string;
    mediaKind: string;
    description: {
      standard: string;
      short: string;
    };
    artwork: {
      width: number;
      height: number;
      url: string;
      bgColor: string;
      textColor1: string;
      textColor2: string;
      textColor3: string;
      textColor4: string;
    };
    url: string;
    releaseDateTime: string;
    websiteUrl: string;
    durationInMilliseconds: number;
    name: string;
    guid: string;
    contentRating: string;
    artistName: string;
    subscribable: boolean;
    assetUrl: string;
  };
  relationships?: {
    podcast: {
      href: string;
      data: Array<{
        id: string;
        type: string;
        href: string;
        attributes: {
          offers: Array<{
            kind: string;
            type: string;
          }>;
          feedUrl: string;
          copyright: string;
          genreNames: string[];
          releaseFrequency: string;
          kind: string;
          description: {
            standard: string;
          };
          artwork: {
            width: number;
            height: number;
            url: string;
            bgColor: string;
            textColor1: string;
            textColor2: string;
            textColor3: string;
            textColor4: string;
          };
          name: string;
          artistName: string;
          subscribable: boolean;
        };
      }>;
    };
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