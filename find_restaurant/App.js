import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Pressable, Linking } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

export default function App() {
  const [street, setStreet] = useState('');
  const [regionPosition, setRegionPosition] = useState({
    lat: 60.166628,
    lng: 24.943508,
  });
  const [restaurantDistance, setRestaurantDistance] = useState('0.3');
  const [restaurants, setRestaurants] = useState()

  async function getRestaurants() {
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=0pGleZQXBbZAnWGKh6R2BMTTRIaRfRo1&location=${(street).replace(' ', '+')}+Helsinki+Finland`;
    try {
      const fetched = await fetch(url);
      const fetchedJson = await fetched.json();
      const position = fetchedJson.results[0].locations[0].latLng;
      setRegionPosition({ lat: position.lat, lng: position.lng });
      const url2 = `http://open-api.myhelsinki.fi/v1/places/?tags_search=Restaurant&distance_filter=${position.lat}%2C${position.lng}%2C${restaurantDistance}`
      const fetchedRestaurants = await fetch(url2);
      const fetchedRestaurantsJson = await fetchedRestaurants.json();
      setRestaurants(fetchedRestaurantsJson.data);
    } catch (e) { }
  }

  return (
    <View style={styles.container}>
      <Text style={{ margin: 10, fontWeight: "bold" }}> Find a nearby restaurant in Helsinki</Text>
      <MapView
        style={styles.mapStyle}
        region={{
          latitude: regionPosition.lat,
          longitude: regionPosition.lng,
          latitudeDelta: regionPosition.lat != 60.166628 ? 0.01 : 0.15,
          longitudeDelta: regionPosition.lng != 24.943508 ? 0.01 : 0.15,
        }}>
        {restaurants ? restaurants.map(r => (
          <Marker
            key={r.id}
            coordinate={{
              latitude: r.location.lat,
              longitude: r.location.lon
            }}
          >
            <Callout tooltip={false} onPress={() => Linking.openURL(r.info_url)}>
              <Text style={{ fontWeight: "bold" }}>{r.name.fi}</Text>
              <Text style={{ width: 300, margin: 10 }}>{r.description.body}</Text>
              <Text >{r.info_url}</Text>
            </Callout>
          </Marker>
        )
        ) : <></>}
      </MapView>
      <View style={{ flexDirection: "row", padding: 4, alignItems: "center" }}>
        <View style={{ flexDirectioin: "column", padding: 4 }}>
          <TextInput placeholder="Street" onChangeText={value => setStreet(value)} value={street} autoFocus={true} />
          <View style={{ flexDirection: "row" }}>
            <TextInput style={{ padding: 3 }} placeholder="City" value="Helsinki" />
            <TextInput placeholder="Country" value="Finland" />
          </View>
        </View>
        <Pressable style={styles.showButton} onPress={() => getRestaurants()} >
          <Text style={styles.buttonText} >Show restaurants</Text>
        </Pressable>
        <TextInput style={{ width: 25 }} placeholder="distance" onChangeText={value => setRestaurantDistance(value)} value={restaurantDistance} />
        <Text>Km</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: "100%",
    height: "70%",
  },
  showButton: {
    margin: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#555",
    borderRadius: 5,
    backgroundColor: "green",
    borderWidth: 1,
    height: 60,
    width: 100

  },
  buttonText: {
    color: "#ffe",
  }

});
