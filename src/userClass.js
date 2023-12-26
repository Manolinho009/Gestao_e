import { Text, View } from 'react-native'
import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { collection, getDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase_config';
import { query } from 'firebase/database';


// storing data
export const storeUser = async (value) => {
try {
    const q = query(collection(db, "usuarios"), where("userId", "==", JSON.parse(value).uid));

    let userData = {}
    getDocs(q).then((a) => {
        a.forEach((doc) => {
            console.log(doc.data());
            let val = doc.data()
            
            console.log(val);

            userData.nome = val.usuario
            userData.userId = val.userId
            userData.registroId = doc.id
            userData.setores = val.setores
            
        })
        userData.credentials = value
        AsyncStorage.setItem("user", JSON.stringify(userData));
    }).catch((err) => {
        console.log(err);
    });


} catch (error) {
    console.log(error);
}
};

// getting data
export const getUser = async () => {
try {
    const userData = JSON.parse(await AsyncStorage.getItem("user"))

    return userData
} catch (error) {
console.log(error); 
}
};

