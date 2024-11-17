declare module 'react-native-swipeable-list' {
  import { FlatListProps } from 'react-native';

  interface SwipeableFlatListProps<T> extends FlatListProps<T> {
    renderQuickActions?: (info: { item: T; index: number }) => React.ReactElement;
    maxSwipeDistance?: number;
    shouldBounceOnMount?: boolean;
  }

  export default class SwipeableFlatList<T = any> extends React.Component<SwipeableFlatListProps<T>> {}
} 