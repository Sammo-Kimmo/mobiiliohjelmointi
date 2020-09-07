import { StatusBar } from 'expo-status-bar';
import React, { useReducer } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, FlatList, SafeAreaView } from 'react-native';


export default function App() {
  const initialNumbers = { n1: '', n2: '', result: 0, history: [] };

  function reducer(numbers, action) {
    
    switch (action.type) {
      
      case 'changeValue':
        return { ...numbers, ...action.payload };
      case 'plus':
        let sumNum = Number(numbers.n1) + Number(numbers.n2);
        let sumText = numbers.n1 + '+' + numbers.n2 + '=' + sumNum;
        var newHistory = [...numbers.history];
        newHistory.push({ key: sumText });
        return { ...numbers, result: sumNum, history: newHistory };
      case 'minus':
        let minusNum = Number(numbers.n1) - Number(numbers.n2);
        let minusText = numbers.n1 + '-' + numbers.n2 + '=' + minusNum;
        var new2History = [...numbers.history];
        new2History.push({ key: minusText });
        return { ...numbers, result: minusNum, history: new2History };
      case 'reset':
        return { ...numbers, n1: '', n2: '', result: 0 };
    }
  }
  const [numbers, dispatch] = useReducer(reducer, initialNumbers);
  return (
    <View style={styles.container}>
      <View style={styles.calcContainer}>
        <Text>Result: {numbers.result}</Text>
        <View style={styles.inputRow}>
          <Text>Put some numbers:</Text>
          <TextInput keyboardType="numeric" style={styles.textInput} onChangeText={input => dispatch({ type: 'changeValue', payload: { n1: input } })} value={numbers.n1} />
        </View>
        <View style={styles.inputRow}>
          <Text>Put some numbers:</Text>
          <TextInput keyboardType="numeric" style={styles.textInput} onChangeText={input => dispatch({ type: 'changeValue', payload: { n2: input } })} value={numbers.n2} />
        </View>
        <View style={styles.btnContainer}>
          <Button title="+" onPress={() => dispatch({ type: 'plus' })}></Button>
          <Button title="-" onPress={() => dispatch({ type: 'minus' })}></Button>
          <Button title="reset" onPress={() => dispatch({ type: 'reset' })}></Button>
        </View>

        <StatusBar style="auto" />
      </View>
      <View styles={styles.histContainer}>
        <Text>History (clears on app close)</Text>
        <FlatList
          data={numbers.history}
          renderItem={({ item }) =>
            <Text>{item.key}</Text>}
        />
      </View>

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
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 120,
    margin: 6,
  },
  textInput: {
    height: 20,
    width: 40,
    borderBottomColor: 'black',
    borderBottomWidth: 1,

  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 180,
    margin: 10,
  },
  calcContainer: {
    paddingTop: 400,
  },
  histContainer: {

  }


});
