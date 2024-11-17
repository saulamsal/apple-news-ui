import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  forYouSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 8,
    alignItems: 'center',
  },
  forYouTitle: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -2,
  },
  forYouSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 20,
    color: '#000',
  },
});
