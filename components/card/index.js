import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';


import { styles,shadow, secondary } from '../../src/styles'




function CardHome({nome, informacao, confirmacao = 1}) {

  const [confirmIconState, setConfirmIconState] = useState('md-checkmark-circle')

  useEffect(()=>{
    selectStateIcon()
  })

  function selectStateIcon() {
    switch (confirmacao) {
      case 0:
        setConfirmIconState('close-circle-sharp')
        
        break;
        
      case 1:
        setConfirmIconState('md-checkmark-circle')
        
        break;
        
      default:
        setConfirmIconState('alert-circle')
        break;
    }
  }
  return (
    <View style={[styles.cardContainer,{flexDirection:'row', justifyContent:'space-between'}]}>
      <View style={[styles.cardHeader]}>
            <Text>{nome}</Text>
      </View>
      <View style={styles.cardBody}>

        <Text style={styles.cardBody.text }>{informacao}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Ionicons style={styles.cardFooter.text} name={confirmIconState} size={32}/>
        {/* <Ionicons name="close-circle-sharp" size={24} color="black" /> */}
        {/* <Ionicons name="alert-circle" size={24} color="black" /> */}
      </View>
    </View>
  )
}



export default CardHome