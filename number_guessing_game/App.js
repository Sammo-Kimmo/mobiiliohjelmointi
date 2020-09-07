import { StatusBar } from 'expo-status-bar';
import React, { useReducer, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

export default function App() {
  const randomNumber = () => Math.floor(Math.random() * 100) + 1;
  const initMemory = {hiddenNumber: randomNumber(), lastGuess: "", guessedNumbers: [], alertText: ""};

  function memoryCtrl(memory, action){
    switch(action.type){
      case 'setGuess':
        return {...memory, lastGuess: action.guessing};
      case 'result':
        guessedList = [...memory.guessedNumbers];
        guessedList.push(memory.lastGuess);
        return {...memory, lastGuess:'', guessedNumbers: guessedList, alertText: action.alertText};  
      case 'reset':
        return initMemory;
    }
  }
  const [memory, setMemory] = useReducer(memoryCtrl, initMemory);
  
  function memoryGame(){
    var infoText = '';
    const guess = Number(memory.lastGuess);
    if (!guess || guess < 1 || guess > 100){
      Alert.alert("Only numbers 1 - 100");
      return setMemory({type: 'setGuess', guessing: ''});
    }

    const memoryNumber = Number(memory.hiddenNumber);
   
    if (guess < memoryNumber){
      infoText = 'too low';
    } else if (guess > memoryNumber){
      infoText = 'too high';
    } else {
      infoText = 'correct';
      Alert.alert("You guessed the number in " + (memory.guessedNumbers.length + 1) + " guesses.");
    }          
    setMemory({type: 'result', alertText: infoText});
 

  }

  
  return (
    <View style={styles.container}>
      {memory.alertText != '' ? <Text>Your answer {memory.guessedNumbers[memory.guessedNumbers.length - 1]} is {memory.alertText}</Text>:<></>}
      <Text>Guess a number between 1 to 100</Text>
      {memory.guessedNumbers.length > 0 ? <Text>Guessed: {memory.guessedNumbers.join(", ")}</Text> :< ></>}
      <TextInput autoFocus={true} placeholder="Type here 1-100" keyboardType="number-pad"  onChangeText={text => setMemory({type: 'setGuess', guessing: text})} value={memory.lastGuess}/>
      {memory.alertText != 'correct' ? <Button title="Make a guess" onPress={() => memoryGame()}/> : <Button title="Reset" onPress={() => setMemory({type: 'reset'})} /> }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
