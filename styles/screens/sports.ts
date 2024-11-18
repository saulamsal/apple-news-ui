import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const SportsStyles = StyleSheet.create({
    headerLeftText: {
        fontSize: 24,
        fontWeight: '700',

    },
    headerLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },
    headerIconRight: {
        // width: 32,
        // height: 32,
        borderRadius: 50,
        backgroundColor: '#E5E4EB',
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 12
    },
    listHeaderSubText: {
        fontSize: 15,
        fontWeight: '400',
        color: '#000000',
        opacity: 0.5
    },
    listHeader: {
       gap: 4,
       marginTop: 20
    },
    headerIconRightText: {
        fontSize: 15,
        fontWeight: '700',
      
    }
});
  