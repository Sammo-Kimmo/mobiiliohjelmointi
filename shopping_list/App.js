import { StatusBar } from 'expo-status-bar';
import React, { useReducer, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

export default function App() {
  const initialValues = {listItems: [], addItem:""};

  function shoppingList(shopItems, action){
    switch(action.type){
      case 'addItem':
        return {...shopItems, addItem: action.addItem};
      case 'add':
        var items = [...shopItems.listItems];
        items.push({key: action.shopItem});
        return {...shopItems, listItems: items};
      case 'reset':
        return initialValues;
    }
  }
  const[shopItems, setShopItems] = useReducer(shoppingList, []);
  return (
    <View style={styles.container}>
       <Text>Shopping List</Text>
          <Text>Add some Shopping Items</Text>
        <TextInput  style={styles.textInput} onChangeText={input => setShopItems({type: 'addItem', addItem: input})}  value={shopItems.addItem} />

      <View style={styles.btnContainer}>
        <Button title="add" onPress={() => setShopItems({ type: 'add', shopItem: shopItems.addItem })}></Button>
        <Button title="reset" onPress={() => setShopItems({ type: 'reset' })}></Button>
      </View>

      <StatusBar style="auto" />


      <Text>shoppingList</Text>
      <FlatList
        data={shopItems.listItems}
        renderItem={({ item }) =>
          <Text>{item.key}</Text>}
      />


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
  paddingTop: 200,
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
