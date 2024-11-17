export interface PodcastEpisode {
  id: string;
  title: string;
  showTitle: string;
  duration: number;
  releaseDate: string;
  summary: string;
  streamUrl: string;
  icon?: {
    template: string;
    width: number;
    height: number;
  };
  episodeArtwork?: {
    template: string;
    width: number;
    height: number;
  };
}

export interface PodcastShelf {
  contentType: string;
  items: PodcastEpisode[];
}

export interface PodcastData {
  shelves: PodcastShelf[];
} 