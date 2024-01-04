import { View, Text, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'


import DateTimePicker from '@react-native-community/datetimepicker';

import { styles,shadow, secondary, light, secondary_shadow, primary, danger, grey } from '../../src/styles'
import { db } from '../../firebase_config';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc, where } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { query } from 'firebase/database';


function CardBadge ({value, color = 'grey' , adm = 0}){

  let final
  switch (adm) {
    case  0:
    final = (
        <View style={{backgroundColor:grey, padding:5, borderRadius:5, marginVertical: 3}}>
          <Text style={[styles.cardBody.text, {color: shadow}] }>{value}</Text>
        </View>
      )
      
      break;
    case  1:

    final = (
        <View style={{backgroundColor:primary, padding:5, borderRadius:5, marginVertical: 3}}>
          <Text style={[styles.cardBody.text, {color: light}] }>{value}</Text>
        </View>
      )
      
      break;
    case 2:

    final = (
        <View style={{backgroundColor:secondary, padding:5, borderRadius:5, marginVertical: 3}}>
          <Text style={[styles.cardBody.text, {color: shadow}] }>{value}</Text>
        </View>
      )
      
      break;
    case 3:

    final = (
        <View style={{backgroundColor:shadow, padding:5, borderRadius:5, marginVertical: 3}}>
          <Text style={[styles.cardBody.text, {color: light}] }>{value}</Text>
        </View>
      )
      
      break;
      
      default:
        final = (
          <View style={{backgroundColor:grey, padding:5, borderRadius:5, marginVertical: 3}}>
            <Text style={[styles.cardBody.text, {color: shadow}] }>{value}</Text>
          </View>
        )
      break;

    }
    
    return final;
}




function CardHome({nome, informacao, confirmacao = 1, escalaId = '', admin = false, setorStr= '', ocupacaoStr = '', voluntarioStr = '', dateP = null, escalas = 1 }) {
  const [openDropDown, setOpenDropDown] = useState('none');
  const [openDropDownAdmin, setOpenDropDownAdmin] = useState('none');
  
  const [confimValue, setConfirmValue] = useState(1)
  const [confimState, setConfirmState] = useState(false)
  
  const [confirmIconState, setConfirmIconState] = useState('md-checkmark-circle')


  
  const [modalVisible, setModalVisible] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [ocupacao, setOcupacao] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [saveState, setSaveState] = useState(true);
  const [editState, setEditState] = useState(false);
  const [itemKey, setItemKey] = useState(null);

  
  const navigation = useNavigation()


  useEffect(()=>{
    if(dateP){
      setDate(dateP)
    }
  },[])

  useEffect(()=>{

    selectStateIcon()
    if(admin){
      setOpenDropDownAdmin('')
    }else{
      setOpenDropDownAdmin('none')
    }


  })

  function goHome(){
      navigation.navigate("Home")
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

    

    function convetDate(d){
        var datestring = `0${d.getDate()}`.slice(-2)  + "/" + `0${(d.getMonth()+1)}`.slice(-2)  + "/" + d.getFullYear()
        return datestring
    }
    
    function convetTime(d){
        var datestring = `0${d.getHours()}`.slice(-2)  + ":" + `0${d.getMinutes()}`.slice(-2) ;
        return datestring
    }


  
  function togleModal(state) {
      setModalVisible(state)
      if(!state){
        setEditState(false)
        setUsuario('')
        setOcupacao('')
        setDate(new Date())
      }
    }


  function dropdownTogle() {

    if(openDropDown == 'none'){
      setOpenDropDown('')
    }else{
      setOpenDropDown('none')
    }
  }


  function confirmEscala() {
    function runUpdate(confimVal) {
      console.log(confimVal);
        dropdownTogle()
  
        updateDoc(doc(db,'escalas',escalaId), {
          confirm: confimVal,
        }).then(()=>{
          confirmacao = confimVal
          goHome()
        }).catch((err) => {
    
          // console.log('Deu Erro');
        }) 
    }
    
    Alert.alert('Confirmação','Deseja Confirmar a Escala ? ', [
      {
        text: 'Cancel',
        onPress: () => {setConfirmState(false)},
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {setConfirmState(true), runUpdate(1)}},
      {text: 'Notificar', onPress: () => {setConfirmState(true), setConfirmValue(2), runUpdate(2)}},
    ])
  }


  function deleteEscala() {

    function runDelete() {
        dropdownTogle()
  
        deleteDoc(doc(db,'escalas',escalaId), {}).then(()=>{
          console.log('Apagado');
          goHome()
        }).catch((err) => {
    
          // console.log('Deu Erro');
        }) 
    }
    
    Alert.alert('Confirmação','Deseja Deletar a Escala ? ', [
      {
        text: 'Não',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Sim', onPress: () => {runDelete()}},
    ])
  }



  function selectStateIcon() {
    switch (confirmacao) {
      case 0:
        setConfirmIconState('close-circle-sharp')
        setConfirmState(false)
        
        break;
        
      case 1:
        setConfirmIconState('md-checkmark-circle')
        setConfirmState(true)
        break;
        
      default:
        setConfirmIconState('alert-circle')
        setConfirmState(false)
        break;
    }
  }





  function saveEscala() {
    function runUpdate() {

      console.log();
        dropdownTogle()
        setModalVisible(!modalVisible)
  
        updateDoc(doc(db,'escalas',escalaId), {
          data: date,
          confirm: 0,
        }).then(()=>{
          console.log('Deu Bom');
          goHome()
        }).catch((err) => {
    
          console.log('Deu Erro');
        }) 
    }
      
    Alert.alert('Confirmação','Deseja Salvar a Escala ? ', [
      {
        text: 'Não',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Sim', onPress: () => {runUpdate()}},
    ])
  }    





  return (
    


    <TouchableOpacity 
      onPress={dropdownTogle}
      style={styles.cardContainer}
    >

    <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            togleModal(!modalVisible);
          }}>
      
      <View style={[styles.containerFlex, {marginTop:50, height:'100%'}]}>
          <View style={[styles.containerFlex,{height:'100%'}]}>
              <View style={[styles.cardContainer, {backgroundColor: grey,height:'100%'}]}>
                <TouchableOpacity 
                  onPress={() => togleModal(!modalVisible)}
                  style={{padding: 20, alignItems:'flex-end'}}
                >
                  <Ionicons name="close" size={25} color={shadow} />
                </TouchableOpacity>
                <View style={[styles.container,{margin:30}]}>
                    
                    <Text style={styles.textInputLabel}>Selecione Um Setor</Text>
                    <View style={[styles.textInput,{marginVertical:20, padding:0}]}>
                        <Picker
                            enabled={false}
                            style={[{
                                color:shadow,
                                borderColor:shadow,
                                borderWidth:1,
                                width:'100%',
                                borderRadius:5,
                                disabled:true
                              }]}
                            
                            selectedValue={''}
                            onValueChange={(itemValue, itemIndex) =>
                                {console.log(itemValue);}
                            }>
                            <Picker.Item style={{fontSize:12}} label={setorStr} value='*' />
                        </Picker>
                    </View>

                    <Text style={styles.textInputLabel}>Selecione Um Voluntario</Text>
                    <View style={[styles.textInput,{marginVertical:20, padding:0}]}>
                        <Picker
                            enabled={false}
                            style={[{
                                color:shadow,
                                borderColor:shadow,
                                borderWidth:1,
                                width:'100%',
                                borderRadius:5
                            }]}
                            selectedValue={''}
                            onValueChange={(itemValue, itemIndex) =>
                                {console.log(itemValue);}
                            }>
                            <Picker.Item style={{fontSize:12}} label={voluntarioStr} value={'*'} />
                        </Picker>
                    </View>
                    
                    
                    <Text style={styles.textInputLabel}>Selecione Uma Ocupação</Text>
                    <View style={[styles.textInput,{marginVertical:20, padding:0}]}>
                        <Picker
                            enabled={false}
                            style={[{
                                color:shadow,
                                borderColor:shadow,
                                borderWidth:1,
                                width:'100%',
                                borderRadius:5
                            }]}
                            selectedValue={''}
                            onValueChange={(itemValue, itemIndex) =>
                                console.log(itemValue)
                            }>
                            <Picker.Item style={{fontSize:12}} label={ocupacaoStr} value='*' />
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
      </Modal>



      <View style={[{flexDirection:'row', justifyContent:'space-between'}]}>
        <View style={[styles.cardHeader]}>
              <Text>{nome}</Text>
        </View>
        <View style={styles.cardBody}>

          <Text style={styles.cardBody.text }>{informacao}</Text>
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Ionicons style={styles.cardFooter.text} name={confirmIconState} size={32}/>
            {/* <Ionicons name="close-circle-sharp" size={24} color="black" /> */}
            {/* <Ionicons name="alert-circle" size={24} color="black" /> */}
          </View>
        </View>
      </View>
      <View 
        style={[{display:openDropDown, padding:10 }]}
      >
        <TouchableOpacity
          onPress={confirmEscala}
          disabled={confimState}
        >
          <View style={[styles.cardContainer, {opacity: !confimState  ? 1 : 0.5 , padding:10, backgroundColor: primary,}]}>
            <Text style={{color:light}}>Confirmar</Text>
          </View>
        </TouchableOpacity>

        <View style={{display:openDropDownAdmin}}>
          <TouchableOpacity
            onPress={() => {togleModal(true)}}
          >
            <View style={[styles.cardContainer, {padding:10}]}>
              <Text>Editar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteEscala}
          >
            <View style={[styles.cardContainer, {padding:10, backgroundColor: danger,}]}>
              <Text style={{color:light}}>Excluir</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}


export function CardUser({nome, admin = false, setores = {}, userId = '', setoresFilter = [] }) {
  
  const [openDropDown, setOpenDropDown] = useState('none');
  
  const [confimState, setConfirmState] = useState(false)
  const [deleteIconState, setDeleteIconState] = useState(false)
  
  const [confirmIconState, setConfirmIconState] = useState('person')
  
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  
  const [setoresList, setSetoresList] = useState([])
  
  const [selectedAcesso, setSelectedAcesso] = useState(0);
  const [selectedSetor, setSelectedSetor] = useState('*');
  // const [setoresFilter, setSetoresFilter] = useState([])

  const navigation = useNavigation()

  function goHome(){
      navigation.navigate("Home")
    }


    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };

  
  function togleModal(state) {
      setModalVisible(state)
      if(!state){
        setEditState(false)
        setUsuario('')
        setOcupacao('')
        setDate(new Date())
      }
    }


  function dropdownTogle() {

    if(openDropDown == 'none'){
      setOpenDropDown('')
      setDeleteIconState(true)
    }else{
      setDeleteIconState(false)
      setOpenDropDown('none')
    }
  }

  
  function saveUserParams() {

    function runUpdateUser() {
      let q = query(collection(db, "usuarios"), where('userId', '==', userId));

      getDocs(q).then((a) => {
        let setores
        let idDoc

        a.forEach((doc) => {
          console.log(doc.data());

          setores = doc.data().setores
          idDoc = doc.id
  
        });

        if(!(setores.indexOf(selectedSetor) > -1)){
            
            setores.push(selectedSetor)
        
            updateDoc(doc(db,'usuarios',idDoc), {
              setores: setores,
            }).then(()=>{
              console.log("OK");
            }).catch((err) => {
              console.log('Deu Erro');
            }) 
        }else{
          console.log('ja cadastrado');  
        }
      })
    }

    function runUpdateAdm() {
        // dropdownTogle()

        getDoc(doc(db,'setores',selectedSetor)).then((a) => {

          console.log(a.data());
          let responsaveis = a.data().responsaveis
          
          console.log(responsaveis);
          console.log(userId);

          if(!(responsaveis.indexOf(userId) > -1)){
              
            responsaveis.push(userId)
          
              updateDoc(doc(db,'setores',selectedSetor), {
                responsaveis: responsaveis,
              }).then(()=>{
                console.log("OK");
              }).catch((err) => {
                console.log('Deu Erro');
              }) 
          }else{
            console.log('ja cadastrado');  
          }

        })

    }

    console.log(selectedSetor, selectedAcesso, userId);

    if(selectedAcesso == 0){
      runUpdateUser()
    }
    else if(selectedAcesso == 1){
      runUpdateUser()
      runUpdateAdm()
    }

    
    navigation.navigate("Home")
    navigation.navigate("UserAdm")

  }

  // function confirmEscala() {
  //   function runUpdate(confimVal) {
  //     console.log(confimVal);
  //       dropdownTogle()
  
  //       updateDoc(doc(db,'escalas',escalaId), {
  //         confirm: confimVal,
  //       }).then(()=>{
  //         confirmacao = confimVal
  //         goHome()
  //       }).catch((err) => {
    
  //         // console.log('Deu Erro');
  //       }) 
  //   }


    
  //   Alert.alert('Confirmação','Deseja Confirmar a Escala ? ', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => {setConfirmState(false)},
  //       style: 'cancel',
  //     },
  //     {text: 'OK', onPress: () => {setConfirmState(true), runUpdate(1)}},
  //     {text: 'Notificar', onPress: () => {setConfirmState(true), setConfirmValue(2), runUpdate(2)}},
  //   ])
  // }


  useEffect(() =>{
    
    if(admin){
      setConfirmIconState('briefcase')
    }else{
      setConfirmIconState('person')
    }

  })

  function removeSetor(setorId, adm) {
    console.log(setorId);
    console.log(adm);

    function removeAdm() {
        getDoc(doc(db,'setores',setorId)).then((a) => {

          console.log(a.data());
          let responsaveis = a.data().responsaveis
          
          console.log(responsaveis);
          
          let index = responsaveis.indexOf(userId)

          if(index > -1){
              responsaveis.splice(index, 1); 

              console.log(responsaveis);

              updateDoc(doc(db,'setores',setorId), {
                responsaveis: responsaveis,
              }).then(()=>{
                console.log("OK");
              }).catch((err) => {
                console.log('Deu Erro');
              }) 
          }else{
            console.log('ja cadastrado');  
          }

        })
    }
    function removeSetor() {
      console.log(userId);
        let q = query(collection(db, "usuarios"), where('userId', '==', userId));

        getDocs(q).then((a) => {
          let setores
          let idDoc

          a.forEach((doc) => {
            console.log(doc.data());

            setores = doc.data().setores
            idDoc = doc.id
    
          });
          
          let index = setores.indexOf(setorId)
          
          console.log(setores);
          console.log('asasasasasas',setoresList);
          
          
          
          let setoresListTmp = setoresList

          if(index > -1){
            
            setores.splice(index, 1); 

              // console.log(setoresListTmp);
              // var result = setoresListTmp.find(t=>t.setorId === setorId);
              // setoresListTmp.splice(setoresListTmp.indexOf(result), 1); 
              // console.log(setoresListTmp);
              
              // setSetoresList(setoresListTmp)

              updateDoc(doc(db,'usuarios',idDoc), {
                setores: setores,
              }).then(()=>{
                console.log("OK");
              }).catch((err) => {
                console.log('Deu Erro');
              }) 

          }else{
            console.log('ja cadastrado');  
          }
        })
    }
    
    if(adm == 1){
      removeAdm()
      removeSetor()
      
    } 
    else if(adm == 0 ){
      removeSetor()

    }

    navigation.navigate("Home")
    navigation.navigate("UserAdm")
  }


  useEffect(() =>{
    setSetoresList(setores)
    // setSetoresFilter(setores)
  },[])


  return (
    


    <TouchableOpacity 
      onPress={dropdownTogle}
      style={styles.cardContainer}
    >

    <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            togleModal(!modalVisible);
          }}>
      
      <View style={[styles.containerFlex, {marginTop:50, height:'100%'}]}>
          <View style={[styles.containerFlex,{height:'100%'}]}>
              
              <Text>aaaa</Text>
          </View>
      </View>
      </Modal>



      <View style={[{flexDirection:'row', justifyContent:'space-between'}]}>
        <View style={[styles.cardHeader, {justifyContent:'center'}]}>
              <Text>{nome}</Text>
        </View>
        <View style={[styles.cardBody]}>
          {setoresList.map((a,index) => (
            <View>
              <TouchableOpacity 
                onPress={() => {
                  removeSetor(a.setorId,a.adm)
                }}
                style={{display: !deleteIconState ? 'none' : '' ,position:'absolute', zIndex:100, end:0, top:0}}
              
              >
                <Ionicons  name="close-circle" size={24} color={danger} />
              </TouchableOpacity>
              <View style={{position:'relative', marginHorizontal:15, marginVertical:5}}>
                <CardBadge key={a.setorId} value={a.nome} adm={a.adm}/> 
              </View>
            </View>
          ))}
        </View>
        <View style={[styles.cardFooter,{justifyContent:'center'}]}>
          <View>
            <Ionicons style={styles.cardFooter.text} name={confirmIconState} size={32}/>
          </View>
        </View>
      </View>
      <View 
        style={[{display:openDropDown, padding:10 }]}
      >
      <View style={{flexDirection:'row', justifyContent:'center', alignContent:'space-around'}}>

        <Picker
            style={[{
                color:shadow,
                borderColor:shadow,
                borderWidth:1,
                width:'45%',
                borderRadius:5
            }]}
            selectedValue={selectedSetor}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedSetor(itemValue)
            }>
            <Picker.Item style={{fontSize:12}} label="Todos" value="*" />
            {setoresFilter.map((item, index) => (
                <Picker.Item style={{fontSize:12}} key={item.setorId+"_picker"} label={item.setor} value={item.setorId} />
            ))}
        </Picker>
        <Picker
            style={[{
                color:shadow,
                borderColor:shadow,
                borderWidth:1,
                width:'45%',
                borderRadius:5
            }]}
            selectedValue={selectedAcesso}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedAcesso(itemValue)
            }>
            <Picker.Item key={userId+'volunt1'} style={{fontSize:12}} label="Voluntario" value={0} />
            <Picker.Item key={userId+'adm1'} style={{fontSize:12}} label="Admin" value={1} />
        </Picker>
      </View>
        <TouchableOpacity
          onPress={saveUserParams}
          disabled={confimState}
        >
          <View style={[styles.cardContainer, {opacity: !confimState  ? 1 : 0.5 , padding:10, backgroundColor: primary,}]}>
            <Text style={{color:light}}>Confirmar</Text>
          </View>
        </TouchableOpacity>

      </View>
    </TouchableOpacity>
  )
}

export default CardHome