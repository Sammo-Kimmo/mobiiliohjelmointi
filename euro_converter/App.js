import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { View, Picker, StyleSheet, Text, TextInput, Button, Alert } from "react-native";
import Constants from 'expo-constants';

export default function App() {
  const defaultValues = {
    AED: 3.989789,
    AFN: 82.498646,
    ALL: 125.17313,
    AMD: 525.117493,
    ANG: 1.945304,
    AOA: 614.550488
  };
  const [currencies, setCurrencies] = useState(defaultValues);
  const [isLoaded, setIsLoaded] = useState(false);
  const [amount, setAmount] = useState('')
  const [selectedValue, setSelectedValue] = useState(null);



  async function getCurrencies() {
    const url = 'http://data.fixer.io/api/latest?access_key=2ddda3fe7a4411081d0f93008e721bd1';
    try {
      const fetched = await fetch(url);
      const fetchedJson = await fetched.json();
      if (fetchedJson.success){
        setCurrencies(fetchedJson.rates);
      }
      

    } catch (e) { 

    }
  }
 useEffect(()=>{
  getCurrencies();
 },[] );


  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={{fontSize: 20, marginBottom: 10}}>Convert to Euros</Text>
      <View style={{flexDirection: "row"}}>
      <TextInput
        style={styles.text}
        placeholderTextColor='#2c2'
        keyboardType="decimal-pad"
        value={amount}
        placeholder="Set Amount here"
        onChangeText={(i) => setAmount(i)}
      />
      <Button title="reset" onPress={()=>setAmount("")} />
      </View>
      
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Choose currency" value="0" />
        {Object.entries(currencies).map(([k, v], i) => <Picker.Item key={i} label={`${k} (${v})`} value={v} />)}
      </Picker>


      <Text style={styles.text2}>{selectedValue !== null ? `= ${selectedValue * amount} €` : ''} </Text>
    </View>


  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 30,
    justifyContent: "center",
    alignItems: "center"
  },
  placeholder: {
    color: 'green',
  },
  text: {
    height: 50,
    fontSize: 25,
    textAlign: "center",
    textAlignVertical: "center",
    width: '80%',
    borderColor: 'green',
    borderWidth: 2,
  },
  text2: {
    height: 50,
    fontSize: 25,
    textAlign: "center",
    textAlignVertical: "center",
    width: '100%',
    borderColor: 'green',
    borderWidth: 2,
  },
  picker: {
    height: 60,
    width: '50%',
    fontSize: 30,
    borderTopWidth: 3,
    borderColor: 'black'
  },
});