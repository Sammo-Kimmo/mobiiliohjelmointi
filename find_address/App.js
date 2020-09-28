import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Finland');

  const [markerPositions, setMarkerPositions] = useState([]);


  async function getCoordinates() {
    setMarkerPositions([]);
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=0pGleZQXBbZAnWGKh6R2BMTTRIaRfRo1&location=${(street + '+'+city + '+' + country).replace(' ', '+')}`;
    try {
      const fetched = await fetch(url);
      const fetchedJson = await fetched.json();
      const positions = fetchedJson.results[0].locations;
      setMarkerPositions(positions);
    } catch (e) { }

  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}

        region={{
          latitude: 65.011873,
          longitude: 25.471681,
          latitudeDelta: 15,
          longitudeDelta: 15,
        }}>
        {markerPositions ? markerPositions.map((p, i) => (
          <Marker
            key={''+ p.displayLatLng.lat + p.displayLatLng.lng}
            coordinate={{
              latitude: p.displayLatLng.lat,
              longitude: p.displayLatLng.lng
            }}
            title={p.street + ', '+ p.adminArea5}
          />
          
        )
        ) : <></>}



      </MapView>
      <View style={{ flexDirection: "row", padding: 4, }}>
        <View style={{ flexDirectioin: "column", padding: 4 }}>
          <TextInput placeholder="Street" onChangeText={value => setStreet(value)} value={street} autoFocus={true} />
          <View style={{ flexDirection: "row" }}>
            <TextInput style={{ padding: 3 }} placeholder="City" onChangeText={value => setCity(value)} value={city} />
            <TextInput placeholder="Country" onChangeText={value => setCountry(value)} value={country} />
          </View>
        </View>
        <Pressable style={styles.showButton} onPress={() => getCoordinates()} >
          <Text style={styles.buttonText} >Show on map</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: "100%",
    height: "80%",
  },
  showButton: {
    margin: 8,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#555",
    borderRadius: 5,
    backgroundColor: "green",
    borderWidth: 1,

  },
  buttonText: {
    color: "#ffe",
  }

});
