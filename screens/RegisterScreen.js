import React, { Component, useState } from 'react'
import { Text, StyleSheet, View, TextInput, Pressable, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { styles } from '../src/styles'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../firebase_config'
import { addDoc, collection } from 'firebase/firestore'



const RegisterScreen  = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [nome, setNome] = useState('')


    const navigation = useNavigation()

    function goLogin(){
        navigation.navigate("Login")
    }


        
    const handleSignUp = () => {

        if(passwordConfirm != password){
            alert('Senhas não conferem')
            return
        }

        createUserWithEmailAndPassword(auth, email, password)
         .then(userCredentials => {
             const user = userCredentials.user;
             // navigation.navigate("Home")
            console.log(user);
            console.log(auth.currentUser);

             updateProfile(user, {
                displayName: nome
              }).then(() => {
                // Profile updated!
                // ...
                console.log("Deu Bom");


                addDoc(collection(db, 'usuarios'), {
                    usuario : nome,
                    userId: user.uid,
                }).then(() => {
                  console.log('Deu Bomm');
                }).catch((err) => {
                  // console.log(err);
                });


            }).catch((error) => {
                console.log(error);
                // An error occurred
                // ...
                
              });


         })
         .catch(err => {
             alert(err.message)
         })
     }
     


    return (
      <ScrollView style={[styles.containerFlex, {marginTop:50}]}>
        <View style={[styles.container,{marginBottom:150}]}>

            <Image source={require('../assets/icon.png')} 
            style={{width:250, height:250, margin:30}}/>

            <Text
                style={styles.textInputLabel}
            > Nome </Text>
            <TextInput
                style={styles.textInput}
                placeholder='Fulano'    
                onChangeText={text => setNome(text)}    
                />
            <Text
                style={styles.textInputLabel}
            > E-mail </Text>
            <TextInput
                style={styles.textInput}
                placeholder='123@mail.com'       
                onChangeText={text => setEmail(text)} 
                />

            <Text 
                style={[styles.textInputLabel,{marginTop:30}]}
            > Password </Text>
            <TextInput
                style={styles.textInput}
                placeholder='************'     
                onChangeText={text => setPassword(text)}
                secureTextEntry    
            />
            <Text 
                style={styles.textInputLabel}
            > Confirm </Text>
            <TextInput
                style={styles.textInput}
                placeholder='************'     
                onChangeText={text => setPasswordConfirm(text)}
                secureTextEntry    
            />

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={styles.buttonSuccess}
                    onPress={handleSignUp}
                >
                    <Text style={styles.buttonSuccess.text}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    )
}


export default RegisterScreen