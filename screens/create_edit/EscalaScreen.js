import React, { Component, useEffect, useState } from 'react'
import { Text, StyleSheet, View, ScrollView, TextInput, Pressable, TouchableOpacity } from 'react-native'
import { collections, doc, getDoc, collection, query, where, getDocs , setDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import FloatButton from '../../components/fab';
import Setor from '../../components/setores';
import { light, shadow, styles } from '../../src/styles';
import { useNavigation } from '@react-navigation/native'

import {Picker} from '@react-native-picker/picker';


import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../../firebase_config';
import { getUser } from '../../src/userClass';

const EscalaScreen  = ({
}) => {
      
    const [selectedSetor, setSelectedSetor] = useState('*');
    const [selectedOcupacao, setSelectedOcupacao] = useState({});
    const [selectedUsuario, setSelectedUsuario] = useState({});
    
    const [setores, setSetores] = useState([])
    const [ocupacoes, setOcupacoes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
  
    
    const [userData, setUserData] = useState({});

    const [menuViewState, setMenuViewState] = useState('none')
    const [menuViewIcon, setMenuViewIcon] = useState('add-circle')
  
  
    const [modalVisible, setModalVisible] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [ocupacao, setOcupacao] = useState('');
    const [dataAtual, setDataAtual] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [saveState, setSaveState] = useState(true);
    const [editState, setEditState] = useState(false);
    const [itemKey, setItemKey] = useState(null);

    const navigation = useNavigation()

    function goHome(){
        navigation.navigate("Home")
    }

    function listAllUsers(setorId = '*') {
        let usuariosTmp = []

        console.log('SET SETOR',setorId);
        
        let q
        if (setorId == '*'){
            console.log('SEM ');
            q = query(collection(db, "usuarios"));
        }
        else {
            console.log('COM ');
            q = query(collection(db, "usuarios"), where('setores', 'array-contains', setorId));
        }
        
            console.log(q);
            getDocs(q).then((a)=>{
                a.forEach((doc) => {
    
                    console.log(doc.id, " => ", doc.data());
                    var val = doc.data();
                    usuariosTmp.push({
                        key:doc.id,
                        usuario:val.usuario,
                        userId:val.userId
                    })

                });

                setUsuarios(usuariosTmp)
            }).catch((err)=>{
              console.log(err);
            })
    }

    function listAllSetores(user) {
        let setoresTmp = [] 
        let uservar
        if(user){
            uservar = user
        }else{
            uservar = userData
        }
        
        
        q = query(collection(db, "setores"));
            
            getDocs(q).then((a)=>{
                a.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());

                    var val = doc.data()

                    let setorAuth = (uservar.setores.indexOf(doc.id) > -1) ? true : false

                    let admin = (val.responsaveis.indexOf(auth.currentUser.uid) > -1) ? true : false

                    console.log('TRU OU FAL ',setorAuth, ' a ',admin);

                    if(admin || setorAuth){
                        setoresTmp.push({
                            key:doc.id,
                            setorId:doc.id,
                            setor:val.setor,
                            responsaveis:val.responsaveis
                        })
                    }
                    

                });

                setSetores(setoresTmp)
            }).catch((err)=>{
              console.log(err);
            })
    }

    function listAllOcupacoes(setorId = '*') {
        let ocupacoesTmp = []


        let q
        if (setorId == '*'){
            console.log('SEM ');
            q = query(collection(db, "ocupacoes"));
        }
        else {
            console.log('COM ');
            q = query(collection(db, "ocupacoes"), where('setorId', '==', setorId));
        }
            
            getDocs(q).then((a)=>{
                a.forEach((doc) => {
    
                    console.log(doc.id, " => ", doc.data());
                    var val = doc.data();
                    ocupacoesTmp.push({
                        key:doc.id,
                        ocupacao:val.ocupacao,
                        ocupacaoId:doc.id

                    })

                });

                setOcupacoes(ocupacoesTmp)
            }).catch((err)=>{
              console.log(err);
            })
    }
    // Start listing users from the beginning, 1000 at a time.
    //   listAllUsers();

    function saveEscala(){
        
        setSaveState(false)
        addDoc(collection(db, 'escalas'), {
            usuarioId : selectedUsuario.userId,
            usuario : selectedUsuario.usuario,
            responsavel: auth.currentUser.uid,
            setorId: selectedSetor,
            data_registro: dataAtual,
            data: date,
            confirm: 0,
            ocupacao: selectedOcupacao.ocupacao
        }).then(() => {
        console.log('Deu Bomm');
        
            setSaveState(true)
            goHome()
        }).catch((err) => {
        console.log(err);
        setSaveState(true)
        });
    }



      const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
      };
    
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };
    
      const showTimepicker = () => {
        showMode('time');
      };
  
      

      useEffect(() => {
        getUser().then((a) => {
            setUserData(a);
            listAllSetores(a)
        })
      },[])
  
      function convetDate(d){
          var datestring = `0${d.getDate()}`.slice(-2)  + "/" + `0${(d.getMonth()+1)}`.slice(-2)  + "/" + d.getFullYear()
          return datestring
      }
      
      function convetTime(d){
          var datestring = `0${d.getHours()}`.slice(-2)  + ":" + `0${d.getMinutes()}`.slice(-2) ;
          return datestring
      }
  
    return (
        <View style={{height:'100%'}}>
        <ScrollView>
            <View style={[styles.containerFlex, {marginTop:50}]}>
                <View style={[styles.containerFlex]}>

                    <View style={styles.cardContainer}>
                        <View style={[styles.container,{margin:50}]}>
                            
                            <Text style={styles.textInputLabel}>Selecione Um Setor</Text>
                            <View style={[styles.textInput,{marginVertical:20, padding:0}]}>
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
                                        {setSelectedSetor(itemValue)
                                        listAllUsers(itemValue)
                                        listAllOcupacoes(itemValue)
                                        console.log(itemValue);}
                                    }>
                                    <Picker.Item style={{fontSize:12}} label={'todos'} value='*' />
                                    {setores.map((item, index) => (
                                        <Picker.Item style={{fontSize:12}} key={item.key+"_picker_setor"} label={item.setor} value={item.setorId} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.textInputLabel}>Selecione Um Voluntario</Text>
                            <View style={[styles.textInput,{marginVertical:20, padding:0}]}>
                                <Picker
                                    style={[{
                                        color:shadow,
                                        borderColor:shadow,
                                        borderWidth:1,
                                        width:'100%',
                                        borderRadius:5
                                    }]}
                                    selectedValue={selectedUsuario}
                                    onValueChange={(itemValue, itemIndex) =>
                                        {setSelectedUsuario(itemValue)
                                        console.log(itemValue);}
                                    }>
                                    <Picker.Item style={{fontSize:12}} label={'-- Selecione Um Voluntario --'} value={'*'} />
                                    {usuarios.map((item, index) => (
                                        <Picker.Item style={{fontSize:12}} key={item.key+"_picker"} label={item.usuario} value={item} />
                                    ))}
                                </Picker>
                            </View>
                            
                            
                            <Text style={styles.textInputLabel}>Selecione Uma Ocupação</Text>
                            <View style={[styles.textInput,{marginVertical:20, padding:0}]}>
                                <Picker
                                    style={[{
                                        color:shadow,
                                        borderColor:shadow,
                                        borderWidth:1,
                                        width:'100%',
                                        borderRadius:5
                                    }]}
                                    selectedValue={selectedOcupacao}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setSelectedOcupacao(itemValue)
                                    }>
                                    <Picker.Item style={{fontSize:12}} label={'-- Selecione Uma Ocupação --'} value='*' />
                                    {ocupacoes.map((item, index) => (
                                        <Picker.Item style={{fontSize:12}} key={item.key+"_picker"} label={item.ocupacao} value={item} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={[styles.textInputLabel,{marginTop:30}]}>Data/Hora:</Text>
                            <View style={[styles.textInput, {flexWrap:'nowrap', flexDirection:'row', alignItems:'center', justifyContent:'center'}]} >
                                <TouchableOpacity style={[styles.textInput,{marginVertical:20, width:'auto',paddingHorizontal:10}]} onPress={showDatepicker} title="Data" >
                                    <Text>{convetDate(date)}</Text>
                                </TouchableOpacity>
                                <Text> / </Text>
                                <TouchableOpacity style={[styles.textInput,{marginVertical:20, width:'auto',paddingHorizontal:10}]} onPress={showTimepicker} title="Hora" >
                                    <Text>{convetTime(date)}</Text>
                                </TouchableOpacity>
                            </View>

                            {show && (
                                <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                locale={'en_GB'}
                                onChange={onChange}
                                />
                                )}


                            <View style={[styles.containerFlex, {justifyContent:'flex-end', alignItems:'flex-end', flexDirection:'row', flexWrap:'wrap', width:'100%'} ]}>
                                <TouchableOpacity
                                    style={styles.buttonSuccess}
                                    onPress={saveEscala}
                                >
                                    <Text style={{color:light, fontSize: 15}}>Salvar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </View>
            </View>
        </ScrollView>
      </View>
    )
}


export default EscalaScreen