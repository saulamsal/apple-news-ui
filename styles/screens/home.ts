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
    //   paddingHorizontal: 16,
      gap: 20,
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
      marginLeft: 10,
    },
    rightActions: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      marginRight: 10,
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
      alignItems: 'center',
      flexDirection: 'row',
     
    },
    todayContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 8,
      // backgroundColor: 'rgba(255,255,255,0.9)',
      zIndex: 1,
      top: 0,
    //   height: 40,
      justifyContent: 'center',
    },
    todayText: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'left',
    }
  });
  