import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { primary, shadow, styles } from '../../src/styles';
import { useNavigation } from '@react-navigation/native'

import Ionicons from '@expo/vector-icons/Ionicons';


function FloatButton() {

  const [menuState,setMenuState] = useState('none')

  
    
  const navigation = useNavigation()

  function goCreateEscala(){
      navigation.navigate("CreateEscala")
  }

  
  function togleMenuState() {
    if(menuState == 'none'){
      setMenuState('')
    }else{setMenuState('none')}
  }
  return (
    <View>
      <View style={{display:menuState}}>
        <TouchableOpacity 
          onPress={goCreateEscala}
          style={[stylesFab.container,{bottom: 220,paddingHorizontal: 10, paddingVertical: 10,right:25}]}
        > 
            <Ionicons style={stylesFab.title} name="add-circle" size={35} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={[stylesFab.container,{bottom: 160,paddingHorizontal: 10, paddingVertical: 10,right:25}]}> 
            <Ionicons style={stylesFab.title} name="person-add" size={35} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={[stylesFab.container,{bottom: 100,paddingHorizontal: 10, paddingVertical: 10,right:25}]}> 
            <Ionicons style={stylesFab.title} name="build" size={35} color="black" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        onPress={togleMenuState}
        style={stylesFab.container}
      > 
          <Ionicons style={stylesFab.title} name="menu" size={50} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const stylesFab = StyleSheet.create({ 
    container: { 
        justifyContent: "center", 
        alignItems: "center", 
        borderRadius: 50, 
        position: "absolute", 
        bottom: 30, 
        right: 20, 
        backgroundColor: primary, 
        paddingHorizontal: 15, 
        paddingVertical: 15, 
        borderWidth:1,
        borderColor:shadow,
    }, 
    title: { 
        fontSize: 25, 
        color: "#fff", 
        fontWeight: "bold", 
    }, 
}); 


export default FloatButton