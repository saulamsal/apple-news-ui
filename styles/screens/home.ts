import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    listContent: {
      paddingHorizontal: 16,
      gap: 16,
    },
    card: {
      marginBottom: 8,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 2.22,
      elevation: 3,
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
      marginLeft:-10
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
  
    },
    topicText: {
      fontSize: 15,
      color: '#666',
    },
    moreIcon: {
      position: 'absolute',
      right: 8,
      top: 8,
      padding: 8,
    },
    moreContainer: {
      paddingHorizontal: 8,
      // backgroundColor: 'blue',
    },
    fullCardContent: {
      paddingHorizontal: 16,
      // backgroundColor: 'red',
    },
    headerLeft: {
      flexDirection: 'column',
      // alignItems: 'center',
      gap: 4,
  
    },
    headerDate: {
      fontSize: 26,
      fontWeight: '800',
      opacity: 0.5,
    },
    listHeaderText: {
      fontSize: 26,
      fontWeight: '800',
      color: Colors.light.tint,
    }
    
  });
  