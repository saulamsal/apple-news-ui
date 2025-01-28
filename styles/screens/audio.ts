import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
    // flexShrink: 0
  },
  headerContainer: {
    marginBottom: 16,
    // paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerRightButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
    // boxShadow: "#000 0px 0px 10px -4px",
    position: 'relative',
  },
  headerRightText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff'
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 16,
  }
});
  