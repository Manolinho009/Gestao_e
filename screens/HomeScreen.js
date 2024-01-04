import { Text, StyleSheet, View, ScrollView, Pressable, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import Ionicons from '@expo/vector-icons/Ionicons';

import { styles, dark, light, shadow, primary } from '../src/styles'
import CardHome from '../components/card'

import {Picker} from '@react-native-picker/picker';
import Setor from '../components/setores';



import { collections, doc, getDoc, collection, query, where, getDocs , setDoc, addDoc, updateDoc, deleteDoc, Timestamp, FieldPath } from 'firebase/firestore';
import { auth, db } from '../firebase_config';
import FloatButton from '../components/fab';
import userClass, { getUser } from '../src/userClass';

const HomeScreen = () => {


    const [userData, setUserData] = useState({});

    const [selectedSetor, setSelectedSetor] = useState('*');

    const [loadingStatus, setLoadingStatus] = useState(true)

    const [setoresFilterStatus, setSetoresFilterStatus] = useState(false)
    const [setoresFilter, setSetoresFilter] = useState([])
    const [setores, setSetores] = useState([])

    const [menuViewState, setMenuViewState] = useState('none')
    const [menuViewIcon, setMenuViewIcon] = useState('add-circle')


    function togleMenu() {
        if(menuViewState == 'none'){
            setMenuViewState('')
            setMenuViewIcon('remove-circle')
        }else{
            setMenuViewState('none')
            setMenuViewIcon('add-circle')
        }
    }

    function getSetoresData(user = null) {
        setLoadingStatus(true)
        let uservar
        if(user){
            uservar = user
        }else{
            uservar = userData
        }
        
        
        var setores = []
        let q 
        if(selectedSetor != '*'){
            getDoc(doc(db, 'setores',selectedSetor)).then((doc)=>{
                console.log(doc.id, " => ", doc.data());
                var val = doc.data()
               
                setores.push({
                    key:doc.id ,
                    setorId:doc.id, 
                    setor: val.setor,
                    responsaveis: val.responsaveis
                })
              
                setSetores(setores);
    

                setLoadingStatus(false)
            }).catch((err)=>{
              console.log(err);
            })
            return setores;
        }
        else{
            q = query(collection(db, "setores"));
            
            getDocs(q).then((a)=>{
                a.forEach((doc) => {
    
                    console.log(doc.id, " => ", doc.data());

                    var val = doc.data()

                    let setorAuth = (uservar.setores.indexOf(doc.id) > -1) ? true : false

                    let admin = (val.responsaveis.indexOf(auth.currentUser.uid) > -1) ? true : false
                    console.log('TRU OU FAL ',setorAuth, ' a ',admin);
                    if(admin || setorAuth){
                        setores.push({
                            key:doc.id ,
                            setorId:doc.id, 
                            setor: val.setor,
                            responsaveis: val.responsaveis
                        })
                    }
                });
                
                setSetores(setores);
                
                if(!setoresFilterStatus){
                    setSetoresFilter(setores);
                    setSetoresFilterStatus(true);
                }
                
                setLoadingStatus(false)
            }).catch((err)=>{
              console.log(err);
            })
            return setores;
        }
    }



    useEffect(() => {
        getUser().then((a) => {
            setUserData(a);
            getSetoresData(a);
        })
    }, [])

    return (
    <View style={{height:'100%'}}>
        <ScrollView>
            <View style={{backgroundColor:dark, padding:40, flexDirection:'column' }}> 
            <Text style={{color:light, margin:10}}>{auth.currentUser.displayName}</Text>
                <TouchableOpacity 
                style={{flexDirection:'row', margin:10}}
                onPress={togleMenu}
                >
                    <Ionicons style={[styles.cardFooter.text,{marginHorizontal: 10}]} name={menuViewIcon} size={20}/>
                    <Text style={{color:light}}>Filtros</Text>
                </TouchableOpacity>

                <View
                    style={{display: menuViewState, paddingVertical:20, paddingHorizontal:5}}
                >
                    <Text style={{color:light, padding:5, fontSize: 15}}>Selecione Um Setor</Text>
                    <View style={[styles.textInput, {backgroundColor: light , padding: 0}]} >
                        <Picker
                            style={[{
                                color:shadow,
                                borderColor:shadow,
                                borderWidth:1,
                                width:'100%',
                                borderRadius:5
                            }]}
                            selectedValue={selectedSetor}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedSetor(itemValue)
                            }>
                            <Picker.Item style={{fontSize:12}} label="Todos" value="*" />
                            {setoresFilter.map((item, index) => (
                                <Picker.Item style={{fontSize:12}} key={item.key+"_picker"} label={item.setor} value={item.setorId} />
                            ))}
                        </Picker>

                    </View>
                    <View
                        style={{flexDirection:'row', justifyContent:'flex-end'}}
                    >
                        <TouchableOpacity
                            style={[styles.buttonSuccess, {padding:15, flexDirection:'row'}]}
                            onPress={() => {getSetoresData()}}
                        >
                            <Text style={{color: light}}>
                                Pesquisar
                            </Text>
                            <Ionicons name="search" size={15} style={{paddingHorizontal:5}} color={light} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


            <View style={[styles.containerFlex, {marginTop:50}]}>
                <ActivityIndicator style={{alignSelf:'flex-start', display: loadingStatus ? '' : 'none' }}  size="large" color={primary} />
            

                <View style={[styles.containerFlex]}>
                    {setores.map((item, index) => (
                        <Setor
                            key={item.key}
                            nomeSetor={item.setor} 
                            setorId={item.setorId}
                            responsaveis={item.responsaveis}
                        />
                    ))}

                </View>
            </View>
        </ScrollView>

        <FloatButton
          styles={{display:'none'}}
        />
      </View>
    )
}

export default HomeScreen