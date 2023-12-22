import { Text, StyleSheet, View, ScrollView, Pressable, TextInput } from 'react-native'
import React, { Component, useEffect, useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons';

import { styles, dark, light, shadow } from '../src/styles'
import CardHome from '../components/card'

import {Picker} from '@react-native-picker/picker';
import Setor from '../components/setores';



import { collections, doc, getDoc, collection, query, where, getDocs , setDoc, addDoc, updateDoc, deleteDoc, Timestamp, FieldPath } from 'firebase/firestore';
import { auth, db } from '../firebase_config';

const HomeScreen = () => {

    const [selectedSetor, setSelectedSetor] = useState('*');


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

    function getSetoresData() {
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
    
                    setores.push({
                        key:doc.id ,
                        setorId:doc.id, 
                        setor: val.setor,
                        responsaveis: val.responsaveis
                    })
                });
                
                setSetores(setores);
    
            }).catch((err)=>{
              console.log(err);
            })
            return setores;
        }
    }



    // useEffect(() => {
    //     getSetoresData()
    // }, [])

    return (
      <ScrollView>
        <View style={{backgroundColor:dark, padding:40, flexDirection:'column' }}> 
        <Text style={{color:light, margin:10}}>{auth.currentUser.displayName}</Text>
            <Pressable 
            style={{flexDirection:'row', margin:10}}
            onPress={togleMenu}
            >
                <Ionicons style={[styles.cardFooter.text,{marginHorizontal: 10}]} name={menuViewIcon} size={20}/>
                <Text style={{color:light}}>Filtros</Text>
            </Pressable>

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
                        {setores.map((item, index) => (
                            <Picker.Item style={{fontSize:12}} key={item.key+"_picker"} label={item.setor} value={item.setorId} />
                        ))}
                    </Picker>

                </View>
                <View
                    style={{flexDirection:'row', justifyContent:'flex-end'}}
                >
                    <Pressable
                        style={[styles.buttonSuccess, {padding:15, flexDirection:'row'}]}
                        onPress={getSetoresData}
                    >
                        <Text style={{color: light}}>
                            Pesquisar
                        </Text>
                        <Ionicons name="search" size={15} style={{paddingHorizontal:5}} color={light} />
                    </Pressable>
                </View>
            </View>
        </View>


        <View style={[styles.containerFlex, {marginTop:50}]}>
            <View style={[styles.containerFlex]}>
                {setores.map((item, index) => (
                    <Setor
                        key={item.key}
                        nomeSetor={item.setor} 
                        setorId={item.setorId}
                    />
                ))}

            </View>
        </View>
      </ScrollView>
    )
}

export default HomeScreen