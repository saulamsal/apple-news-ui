import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
    marginHorizontal: 16,
    position: 'relative'
  },
  fullImage: {
    width: '100%',
    height: 240,
  },
  mediumContent: {
    flex: 1,
    padding: 16,
    paddingRight: 120,
  },
  mediumImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    position: 'absolute',
    right: 16,
    top: 16,
  },
  sourceLogo: {
    height: 24,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 8,
    marginTop: 8,
    marginLeft: -10
  },
  newsTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    marginVertical: 8,
    letterSpacing: -0.8,
  },
  newsTitleFull: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -1,
  },
  topicButton: {
    backgroundColor: '#f2f2f2',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 8,
  },
  topicText: {
    fontSize: 13,
    color: '#000',
    letterSpacing: -0.3,
  },
  moreIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 8,
    opacity: 0.4
  },
  moreContainer: {
    paddingHorizontal: 8,
  },
  fullCardContent: {
    paddingHorizontal: 16,
  },
  newsPlusOverlay: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // height: 40,
    // width: 100,
    // paddingLeft: 12,
    // paddingTop: 12,
    // zIndex: 1
    paddingVertical: 4,
    paddingLeft: 12,
  },
}); 