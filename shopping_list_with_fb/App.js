import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import * as fb from 'firebase';

export default function App() {


  var firebaseConfig = {
    apiKey: "AIzaSyDJyrTVS_nbkU5er_a6OodyCGjyf8Xq4M0",
    authDomain: "shopping-list-with-fb.firebaseapp.com",
    databaseURL: "https://shopping-list-with-fb.firebaseio.com",
    projectId: "shopping-list-with-fb",
    storageBucket: "shopping-list-with-fb.appspot.com",
    messagingSenderId: "95100914492",
    appId: "1:95100914492:web:89ffd26eee058b7d18ec39"
  };
  // Initialize Firebase

  if (!fb.apps.length) fb.initializeApp(firebaseConfig);

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [listItems, setListItems] = useState([]);
  const saveItem = () => {
    Keyboard.dismiss();
    var key = fb.database().ref('items/').push().key;
    fb.database().ref('items/' + key).set({ 'key': key, 'product': product, 'amount': amount });
    setProduct('');
    setAmount('');
  };
  const deleteItem = (id) => {
    fb.database().ref('items/' + id).remove();
  }
  const clearItems = () => {
    listItems.forEach(i => deleteItem(i.key));
  }
  useEffect(() => {
    fb.database().ref('items/').on('value', snapshot => {
      const data = snapshot.val();
      const prods = data ? Object.values(data) : [];
      setListItems(prods);
    });
  }, []);

  return (<View style={styles.container}>
    <Text style={{ fontWeight: "bold" }}>Shopping List</Text>
    <Text>Add some Shopping Items</Text>
    <TextInput placeholder="Product" autofocus={true} style={styles.textInput} onChangeText={input => setProduct(input)} value={product} />
    <TextInput placeholder="Amount" style={styles.textInput} onChangeText={input => setAmount(input)} value={amount} />
    <View style={styles.btnContainer}>
      <Button color="green" title="add" onPress={() => saveItem()}></Button>
      <Button color="saddlebrown" title="Clear List" onPress={() => clearItems()}></Button>
    </View>
    <Text style={{ margin: 10, fontWeight: "bold" }}>Shopping List Items</Text>
    <FlatList
      data={listItems}
      keyExtractor={item => item.key}
      renderItem={({ item }) =>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 2 }}>
          <Text style={{ margin: 6 }} >{item.product}, {item.amount}</Text>
          <Button style={{ padding: 3 }} title="bought" onPress={() => deleteItem(item.key)} />
        </View>
      }
    />
    <StatusBar hidden={true} />
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
    width: 160,
    margin: 6,
  },
  textInput: {
    height: 30,
    width: 200,
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
