import React, { Component, useEffect, useState } from 'react'
import { Text, StyleSheet, View, TextInput, Pressable, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { styles } from '../src/styles'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../firebase_config'
import userClass, { storeUser } from '../src/userClass'


const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()


    function goRegister(){
        navigation.navigate("Register")
    }
    
    function goHome(){
        navigation.navigate("Home")
    }


     const handleLogin = () => {
        console.log(email, ' = ', password);
        signInWithEmailAndPassword(auth, email, password)
         .then(userCredentials => {
             const user = userCredentials.user;

             storeUser(JSON.stringify(user))
             console.log("LOGOU" , user);
             navigation.navigate("Home")
         })
         .catch(err => {
             alert(err.message)
         })
     }
 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if(user){
                goHome()
            }
        })
        return unsubscribe
        
    }, [])


    return (
      <View style={[styles.container, {marginTop:50}]}>
        <Image source={require('../assets/icon.png')} 
        style={{width:250, height:250, margin:30}}/>

        <Text
            style={styles.textInputLabel}
        > Login </Text>
        <TextInput
            style={styles.textInput}
            placeholder='123@mail.com'      
            onChangeText={ text => setEmail(text)}
            />
        <Text 
            style={styles.textInputLabel}
        > Password </Text>
        <TextInput
            style={styles.textInput}
            placeholder='************'
            onChangeText={ text => setPassword(text)} 
            secureTextEntry    
        />

        <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={styles.buttonSuccessOutlined}
                onPress={goRegister}
            >
                <Text style={styles.buttonSuccessOutlined.text}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonSuccess}
                onPress={handleLogin}
            >
                <Text style={styles.buttonSuccess.text}>Login</Text>
            </TouchableOpacity>
        </View>
      </View>
    )
}

export default LoginScreen

