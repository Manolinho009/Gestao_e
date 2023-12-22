import { StyleSheet, Text, View } from 'react-native';


// colors
export const primary = '#726EFF'
export const secondary = '#5AFFE7'
export const secondary_shadow = '#O8C6AB'
export const shadow = '#37465B'
export const dark = '#212B38'
export const light = '#f2f4ec'
export const grey = '#e6e5e5'

export const styles = StyleSheet.create({    
    container:{
        flex:1,
        alignItems:'center',
        marginHorizontal:50,
        height:'100%'
    },
    containerFlex:{
        flex:1,
        margin:10,
        height:'100%'
    },
    cardContainer:{
        margin:10,
        height:'auto',
        width:'auto',
        borderColor:shadow,
        borderWidth:1,
        // backgroundColor:secondary_shadow,
        borderRadius:10,
        shadowColor:dark,
        zIndex:100
    },
    cardBody:{
        height:'auto',
        width:'auto',
        paddingVertical:10,
        paddingHorizontal:10,
        // backgroundColor:secondary_shadow,
        flex:1,
        justifyContent:'flex-start',
        alignItems:'flex-start',
        borderRadius:10,
        text:{
            color:shadow,
            fontSize:12
            
        }
    },
    cardHeader:{
        height:'auto',
        width:'auto',
        maxWidth:'40%',
        padding:30,
        borderWidth:1,
        borderWidth:0,
        backgroundColor:grey,
        borderTopStartRadius:10,
        borderBottomStartRadius:10,
        zIndex:10,
    },
    cardFooter:{
        height:'auto',
        width:'auto',
        maxWidth:'30%',
        padding:30,
        borderWidth:1,
        borderWidth:0,
        backgroundColor:primary,
        borderTopEndRadius:10,
        borderBottomEndRadius:10,
        zIndex:10,
        text:{color:light}
    },
    textInput:{
        borderColor:shadow,
        borderWidth:1,
        width:'100%',
        padding:10,
        margin:5,
        borderRadius:5
    },
    textInputLabel:{
        color:shadow,
        fontSize:15,
        alignSelf:'flex-start'
    },
    buttonGroup:{
        width:'100%',
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        
    },
    buttonSuccess:{
        text:{
            color: light
        },
        backgroundColor: primary,
        padding: 10,
        borderRadius: 5,
        margin:10
    },
    buttonSuccessOutlined:{
        text:{
            color: primary
        },
        borderColor: primary,
        borderWidth:2,
        padding: 10,
        borderRadius: 5,
        margin:10
    }

})
 