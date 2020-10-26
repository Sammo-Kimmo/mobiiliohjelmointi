import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Header, Input, Button, ListItem, Text, Divider } from 'react-native-elements';

export default function App() {


  const db = SQLite.openDatabase('shoppingListItemsDb.db');
  const [shopItem, setShopItem] = useState(null);
  const [amount, setAmount] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);

  function updateList() {
    db.transaction(tx => {
      tx.executeSql('select * from shoppingItem', [], (_, { rows }) => {
        setShoppingList(rows._array);
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

  const renderItem = ({ item, index }) => (
    <ListItem
      key={index}
      bottomDivider
    >
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
      <Button type= "outline" title="bought" buttonStyle={{borderColor:'saddlebrown'}} titleStyle={{color: 'darkmagenta'}} onPress={() => deleteItem(item.id)} />

    </ListItem>

  );


  return (
    <View>
      <Header
        statusBarProps={{ hidden: true }}
        centerComponent={{ text: 'Shopping List', style: {color: '#FFF', fontWeight: '600', fontSize: 20} }}
        containerStyle={{backgroundColor: 'green', paddingVertical:15}}
      />
      <View style={{ margin: 10 }}>
        <Text style={{ fontWeight: 'bold' }} >Add some Shopping Items</Text>
        <Input placeholder="Product" autofocus={true} onChangeText={input => setShopItem(input)} value={shopItem} />
        <Input placeholder="Amount" onChangeText={input => setAmount(input)} value={amount} />
        <View style={styles.btnContainer}>
          <Button buttonStyle={{ backgroundColor: 'green' }} title="Add" onPress={() => add()}></Button>
          <Button buttonStyle={{backgroundColor:'saddlebrown'}} title="Clear List" onPress={() => clearItems()}></Button>
        </View>
        <Divider />
        <FlatList
          data={shoppingList}
          keyExtractor={item => item.id + ''}
          renderItem={renderItem}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 160,
    marginBottom: 15

  },
  textInput: {
    height: 30,
    width: 200,
    borderBottomColor: 'black',
    borderBottomWidth: 1,

  },

  calcContainer: {
    paddingTop: 400,
  },
  histContainer: {

  }


});
