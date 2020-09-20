import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, TextInput, Image, Alert } from 'react-native';

export default function App() {

  const [searchWord, setSearchWord] = useState('');
  const [results, setResults] = useState([]);

  async function getRecipes(searchItem) {
    try {
      const url = `http://www.recipepuppy.com/api/?i=${searchItem}`;
      const fetched = await fetch(url);
      const fetchedJson = await fetched.json();
      if (!fetchedJson.results.length)
        Alert.alert("Try diffent form e.g. onion vs onions");
      setResults(fetchedJson.results);
    } catch (e) {
      setResults[{ title: "No connection" }]
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Find Recipes</Text>
      <View style={styles.row}>
        <TextInput
          style={{ width: 280, }}
          placeholder="Search by Ingredient, eg. tomato"
          onChangeText={input => setSearchWord(input)}
          value={searchWord}
        />
        <Button title="Find" onPress={() => getRecipes(searchWord)} />
        <Button title="Reset" onPress={() => setSearchWord("")} color="green" />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          <View style={styles.row}>
            <Image
              style={styles.thumbnails}
              source={{ uri: item.thumbnail ? item.thumbnail : 'http://img.recipepuppy.com/9.jpg' }}
            />
            <Text style={{ margin: 10, width: 300 }}>{item.title.replace(/\n|\r/g, '').trim()}</Text>
          </View>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnails: {
    width: 50,
    height: 50,
    margin: 7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "green",
    borderBottomWidth: 1,
  },
});
