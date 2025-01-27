import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const SportsStyles = StyleSheet.create({
    headerLeftText: {
        fontSize: 24,
        fontWeight: '700',

    },
    headerLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        width: '100%',
    },
    headerIconRight: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 12,
        overflow: 'hidden',
        // position: 'absolute',
        right: 0,
    },
    headerIconRightWrapper: {
        position: 'absolute',
        right: 0,
    },
    listHeaderSubText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000000',
        opacity: 0.5
    },
    listHeader: {
       gap: 4,
    //    marginTop: 20,
       alignItems: 'center',
       flexDirection: 'row',
       justifyContent: 'space-between',
    },
    headerIconRightText: {
        fontSize: 15,
        fontWeight: '700',
      
    },
    todayContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
    },
    seeAll: {
        backgroundColor: '#E8E8E8',
        width: 32,
        height: 32,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
  