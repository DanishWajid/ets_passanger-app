import EStyleSheet from 'react-native-extended-stylesheet';
import {PixelRatio, StyleSheet} from 'react-native';

const INPUT_HEIGHT = 60;
const BORDER_RADIUS = 4;

export default EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        height: INPUT_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS,
        marginVertical: 9,
        borderColor: '#d6d7',
    },
    smallInput: {
        backgroundColor: 'transparent'
    },
    icon: {
        fontSize: 20,
        width: 40,
        textAlign: 'center',
        color: '$primary',
    },
    textInputContainer: {
        flex: 1,
        height: INPUT_HEIGHT,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    textInput: {
        flex: 1,
        minHeight: 30,
        height: INPUT_HEIGHT,
        borderTopRightRadius: BORDER_RADIUS,
        paddingVertical: 0,
        paddingRight: 10,
        fontSize: 18
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    menuScroll: {
        flexGrow: 0,
        maxHeight: 250,
        backgroundColor: 'white'
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    menuText: {
        color: 'black'
    },
    menuCover: {
        minWidth: 250,
        marginTop: -15,
        backgroundColor: 'transparent'
    },
    powered: {},
    listView: {},
    row: {
        padding: 13,
        height: 44,
        flexDirection: 'row',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#c8c7cc',
    },
    description: {},
    loader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    androidLoader: {
        marginRight: -15,
    },

});
