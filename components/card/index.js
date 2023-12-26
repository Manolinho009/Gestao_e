import { View, Text, TouchableOpacity, Alert, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'


import DateTimePicker from '@react-native-community/datetimepicker';

import { styles,shadow, secondary, light, secondary_shadow, primary, danger, grey } from '../../src/styles'
import { db } from '../../firebase_config';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';




function CardHome({nome, informacao, confirmacao = 1, escalaId = '', admin = false, setorStr= '', ocupacaoStr = '', voluntarioStr = '', dateP = null }) {
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



export default CardHome