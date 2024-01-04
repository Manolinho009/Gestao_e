import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';


import { styles,shadow, secondary, primary, light, dark } from '../../src/styles'
import CardHome from '../card';


import { collections, doc, getDoc, collection, query, where, getDocs , setDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase_config';

function Setor({nomeSetor, setorId = '', visibility = '', responsaveis = []}) {

    const [setorViewState, setSetorViewState] = useState('none')
    const [setorIconState, setSetorIconState] = useState('add')
    
    const [searchState, setSearchState] = useState(0)
    const [cards, setCards] = useState([])
    
    const [loadingStatus, setLoadingStatus] = useState(true)
    const [cardsStatus, setCardsStatus] = useState(true)


    function togleSector() {
        if(setorViewState == 'none'){
            setSetorViewState('')
            setSetorIconState('remove')

            getCardsData()
            // if(searchState == 0){
                // setSearchState(1)
            // }
        }else{
            setSetorViewState('none')
            setSetorIconState('add')
        }
    }
    
    

    function getCardsData(){
        
        setLoadingStatus(true)

        var card = []
        var hoje = new Date()

        const q = query(collection(db, "escalas"), where("data", ">=", hoje),  where("setorId", "==", setorId));

        getDocs(q).then((a)=>{
            a.forEach((doc) => {

                console.log(doc.id, " => ", doc.data());
                var val = doc.data()
                var data = val.data.toDate().toLocaleDateString() + ' ' + val.data.toDate().toLocaleTimeString();
                
                let admin = auth.currentUser.uid == val.responsavel || (responsaveis.indexOf(auth.currentUser.uid) > -1) ? true : false

                card.push({
                    key:doc.id ,
                    usuario:val.usuario ,
                    responsavel:val.responsavel ,
                    setorId: val.setorId ,
                    data:val.data,
                    data_registro:val.data_registro,
                    nome:val.ocupacao,
                    data_str:data,
                    confirm:val.confirm,
                    admin:admin,
                    setorStr:nomeSetor
                })
            });

            if(card.length <= 0){
                setCardsStatus(true)
            }else{
                setCardsStatus(false)
            }

            setCards(card);
            
            console.log(card);

            setLoadingStatus(false)
        }).catch((err)=>{
          console.log(err);
        })
        return card;
    }


  return (
    <View style={{marginVertical:10}}>
        <View >
            <Pressable
                style={{flexDirection:'row', justifyContent:'space-between', padding: 10}}
                onPress={(sector) => {togleSector()}}
            >
                <Text>{nomeSetor}</Text>
                <Ionicons name={setorIconState} size={24} color="black" />
                {/* <Ionicons name="remove" size={24} color="black" /> */}
            </Pressable>
        </View>
        <View style={{display: setorViewState}}>
            <ActivityIndicator style={{alignSelf:'center', display: loadingStatus ? '' : 'none' }}  size="small" color={primary} />

            <View style={[styles.containerFlex,{display: cardsStatus ? '' : 'none' ,height:30,backgroundColor:'#00000096', justifyContent:'center', borderRadius:30}]}>
                <Text style={{alignSelf:'center', justifyContent:'center', color: light, opacity:1}}>Sem Escalas</Text>
            </View>

            {cards.map((item, index) => (
                <CardHome
                    key={item.key}
                    nome={item.usuario}
                    informacao={ "Ocupação: "+item.nome+" \nData: "+ item.data_str }
                    confirmacao={item.confirm}
                    escalaId={item.key}
                    admin={item.admin}
                    setorStr={item.setorStr}
                    ocupacaoStr={item.nome}
                    voluntarioStr={item.usuario}
                    dateP={item.data.toDate()}
                />
              ))}
        </View>
    </View>
  )
}



export default Setor