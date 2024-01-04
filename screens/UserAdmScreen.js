import React, { Component, useEffect, useState } from 'react'
import { Text, StyleSheet, View, TextInput, Pressable, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Ionicons from '@expo/vector-icons/Ionicons';

import { dark, light, shadow, styles } from '../src/styles'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

import { auth, db } from '../firebase_config'
import userClass, { storeUser } from '../src/userClass'
import { query } from 'firebase/database'
import { collection, getDocs } from 'firebase/firestore'

import {Picker} from '@react-native-picker/picker';
import Setor from '../components/setores';
import CardHome, { CardUser } from '../components/card';


const UserAdmScreen = () => {

    const [usersCardsInfos, setUsersCardsInfos] = useState([])

    const [users, setUsers] = useState([])
    const [setores, setSetores] = useState([])

    const [selectedSetor, setSelectedSetor] = useState('*');
    const [setoresFilter, setSetoresFilter] = useState([])

    
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


    function listSetores() {
        let setores = []
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
            setSetoresFilter(setores);
        });
    }

    function listUsers() {
        
        var usuarios = []

        const q = query(collection(db, "usuarios"));

        getDocs(q).then((a)=>{
            a.forEach((doc) => {

                console.log(doc.id, " => ", doc.data());
                var val = doc.data()
                
                usuarios.push({
                   usuario:val.usuario,
                   userId: val.userId,
                   setores:val.setores
                })

            });
            
            setUsers(usuarios);

        }).catch((err)=>{
          console.log(err);
        })
        return usuarios;
    }

    
    function userInfoCards() {

        let cards = []
        users.map((u) => {
            let setoresAdm = []
            let setoresDeserializado = {}

            setores.map((s) => {
                if((s.responsaveis.indexOf(u.userId)) > -1){
                    setoresAdm.push({ setorId:s.setorId, nome:s.setor, adm:1  })
                }
                else{
                    setoresDeserializado[s.key] = s
                }
            })
            
            u.setores.map((su) => {

                let s = setoresDeserializado[su]
                if(s){
                    setoresAdm.push({ setorId:s.setorId, nome:s.setor, adm:0 })
                }
            })

            
            cards.push({key:u.userId, userId:u.userId ,user:u.usuario, setores:setoresAdm, admin:u.admin})
        })
        
        setUsersCardsInfos(cards)
    }
    
    
    useEffect(() =>{
        listUsers()
        listSetores()
        
        userInfoCards()
    },[])





    return (
      <View>
        <ScrollView>
            <View style={{backgroundColor:dark, padding:40, flexDirection:'column' }}> 
                <Text style={{color:light, margin:10}}>Filtro De Usuarios</Text>
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
                                onPress={() => {
                                    listUsers()
                                    listSetores()
                                    
                                    userInfoCards()
                                }}
                            >
                                <Text style={{color: light}}>
                                    Pesquisar
                                </Text>
                                <Ionicons name="search" size={15} style={{paddingHorizontal:5}} color={light} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            <View>
            {usersCardsInfos.map((cr, index) => (
                // nome, admim, setores = [{}]}
                <CardUser
                        key={cr.key} 
                        nome={cr.user}
                        admin={cr.admin}
                        setores={cr.setores}
                        userId={cr.key}
                        setoresFilter={setoresFilter}
                    />
                ))}
            </View>


        </ScrollView>
      </View>
    )
}

export default UserAdmScreen

