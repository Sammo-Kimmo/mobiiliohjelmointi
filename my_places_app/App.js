import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Keyboard, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { Header, Input, Button, ListItem, Text, Icon } from 'react-native-elements';

function StreetMap({ route, navigation }) {
  const { coords } = route.params;

  return (
    <View>
      <Header
        statusBarProps={{ hidden: true }}
        centerComponent={{ text: coords.city, style: { color: '#FFF', fontWeight: '600', fontSize: 17} }}
        containerStyle={{ backgroundColor: 'darkmagenta', paddingTop: 5, height: 50, }}
      />
      <MapView style={styles.mapStyle}
        region={{
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.03,
          longitudeDelta: 0.04,
        }} >
        <Marker
          coordinate={{
            latitude: coords.lat,
            longitude: coords.lng,
          }}
          title={coords.street}
        />
      </MapView>
    </View>
  );
}

function Places({ navigation }) {
  const [street, setStreet] = useState();
  const [city, setCity] = useState();
  const [latLng, setLatLng] = useState({});
  const [myPlacesList, setMyPlacesList] = useState([]);
  const db = SQLite.openDatabase('myPlaces.db');

  async function getMyLocation() {
    await Location.requestPermissionsAsync();
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLatLng({ lat: location.coords.latitude, lng: location.coords.longitude });
      const url = `http://www.mapquestapi.com/geocoding/v1/reverse?key=0pGleZQXBbZAnWGKh6R2BMTTRIaRfRo1&location=${location.coords.latitude},${location.coords.longitude}&includeRoadMetadata=true&includeNearestIntersection=true`
      const fetchedLocation = await fetch(url);
      const fetchedLocationJson = await fetchedLocation.json();
      setCity(fetchedLocationJson.results[0].locations[0].adminArea5);
    } catch (e) {}
  }

  function updateList() {
    db.transaction(tx => {
      tx.executeSql('select * from place order by street', [], (_, { rows }) => {
        setMyPlacesList(rows._array);
      });
    })
  }

  useEffect(() => {
    getMyLocation();
    db.transaction(tx => {
      tx.executeSql('create table if not exists place(id integer primary key not null, street text, city text, lat real, lng real);');
    }, (e) => console.log(e.message), () => updateList());
  }, []);

  async function add() {
    Keyboard.dismiss();
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=0pGleZQXBbZAnWGKh6R2BMTTRIaRfRo1&location=${(street + '+' + city).replace(' ', '+')}`;
    try {
      const fetched = await fetch(url);
      const fetchedJson = await fetched.json();
      const positions = fetchedJson.results[0].locations[0];
      db.transaction(tx => {
        tx.executeSql('insert into place (street, city, lat, lng) values (?,?,?,?);', [street, city, positions.displayLatLng.lat, positions.displayLatLng.lng]);
      }, (e) => console.log(e.message), () => updateList());
    } catch (e) { }
    setStreet('');
  }

  function deleteItem(id) {
    db.transaction(tx => {
      tx.executeSql('delete from place where id = ?;', [id]);
    }, null, () => updateList());
  }

  const renderItem = ({ item, index }) => (
    <ListItem
      key={index}
      bottomDivider
      onPress={() => navigation.navigate('StreetMap', { coords: { lat: item.lat, lng: item.lng, street: item.street, city: item.city } })}
      onLongPress={() => Alert.alert(
        'Delete?', 
        item.street, 
        [{ text: 'Yes, delete', onPress: () => deleteItem(item.id) }, { text: 'Cancel', style: 'cancel' }]
        )}
    >
      <ListItem.Content>
        <ListItem.Title>{item.street}</ListItem.Title>
        <ListItem.Subtitle>{item.city}</ListItem.Subtitle>
      </ListItem.Content>
      <Text style={{ borderColor: 'saddlebrown', color: 'darkmagenta' }}>Show on Map</Text>
      <ListItem.Chevron />
    </ListItem>
  );
  return (
    <View>
      <Input placeholder="Street and number" onChangeText={input => setStreet(input)} value={street} />
      <Input placeholder="City"
        onChangeText={input => setCity(input)}
        value={city}
        leftIcon={city ?
          <Icon
            name='clear'
            onPress={() => setCity('')}
          /> : <></>
        }
      />
      <Button title="save" onPress={() => add()} />
      <FlatList
        data={myPlacesList}
        keyExtractor={item => item.id + ''}
        renderItem={renderItem}
      />
      <StatusBar style="auto" />
    </View>
  );
}
export default function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Header
        statusBarProps={{ hidden: true }}
        centerComponent={{ text: 'My Places', style: { color: '#FFF', fontWeight: '600', fontSize: 20 } }}
        containerStyle={{ backgroundColor: 'green', paddingBottom: 15 }}
      />
      <Stack.Navigator initialRouteName="Places">
        <Stack.Screen name="Places"
          component={Places}
          options={{ title: 'Save an address' }} />
        <Stack.Screen name="StreetMap"
          component={StreetMap}
          options={({route}) => ({ title: route.params.coords.street, headerTitleAlign: 'center', headerTitleStyle: {fontSize: 14}, headerBackTitle: 'Back', headerBackTitleVisible: true})} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
});
