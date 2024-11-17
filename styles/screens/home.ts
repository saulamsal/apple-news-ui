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
    //   paddingHorizontal: 16,
    //   paddingTop: 60,
    //   paddingBottom: 16,
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
      gap: 0,
  
    },
    headerDate: {
      fontSize: 28,
      fontWeight: '800',
      opacity: 0.5,
      letterSpacing: -1,
      paddingTop: 4,
    },
    listHeaderText: {
      fontSize: 26,
      fontWeight: '800',
      color: Colors.light.tint,
    },
    quickActionLeft: {
      flexDirection: 'row',
      width: 120,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      height: '100%',
    },
    quickActionRight: {
      flexDirection: 'row',
      width: 120,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      position: 'absolute',
      right: 0,
      height: '100%',
    },
    quickActionButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listHeader: {
      paddingTop: 16,
      marginBottom: -8,
    },
    rowBack: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
      paddingRight: 15,
      marginBottom: 8,
      height: '100%',
    },
    leftActions: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
    },
    rightActions: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
 
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    leftActionButton: {
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    rightActionButton: {
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    headerIcon: {
      width: 60,
      height: 60,
      resizeMode: 'contain',
      
    },
    headerRight: {
      paddingRight: 8,
    },
    todayContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: 'rgba(255,255,255,0.9)',
      zIndex: 1,
      top: 0,
      height: 40,
      justifyContent: 'center',
    },
    todayText: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'left',
    }
  });
  