import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite'

export default function App() {
  const db = SQLite.openDatabase('shoppingListItemsDb.db');
  const [shopItem, setShopItem] = useState(null);
  const [amount, setAmount] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);

  function updateList() {
    db.transaction(tx => {
      tx.executeSql('select * from shoppingItem', [], (_, { rows }) => {
        setShoppingList(rows._array);
        console.log(rows.length);
      });
    })
  }
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppingItem(id integer primary key not null, product text, amount text);')
    }, (e) => console.log(e.message), () => updateList());
  }, []);

  function clearItems() {
    db.transaction(tx => {
      tx.executeSql('delete from shoppingItem;')
    }, (e) => console.log(e.message), () => updateList());
  }

  function add() {
    console.log(shopItem, amount);
    db.transaction(tx => {
      tx.executeSql('insert into shoppingItem (product, amount) values (?,?);', [shopItem, amount]);
    }, null, () => updateList());
    setAmount('');
    setShopItem('');
  }

  function deleteItem(id) {
    db.transaction(tx => {
      tx.executeSql('delete from shoppingItem where id = ?;', [id]);
    }, null, () => updateList());
  }


  return (
    <View style={styles.container}>
      <Text style={{fontWeight: "bold"}}>Shopping List</Text>
      <Text>Add some Shopping Items</Text>
      <TextInput placeholder="Product" autofocus={true} style={styles.textInput} onChangeText={input => setShopItem(input)} value={shopItem} />
      <TextInput placeholder="Amount" style={styles.textInput} onChangeText={input => setAmount(input)} value={amount} />
      <View style={styles.btnContainer}>
        <Button color="green" title="add" onPress={() => add()}></Button>
        <Button color="saddlebrown" title="Clear List" onPress={() => clearItems()}></Button>
      </View>
      <Text style={{ margin: 10, fontWeight: "bold" }}>Shopping List Items</Text>
      <FlatList
        data={shoppingList}
        keyExtractor={item => item.id + ''}
        renderItem={({ item }) =>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 2 }}>
            <Text style={{ margin: 6 }} >{item.product}, {item.amount}</Text>
            <Button style={{ padding: 3 }} title="bought" onPress={() => deleteItem(item.id)} />
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
