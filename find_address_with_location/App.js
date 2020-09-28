import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [latLng, setLatLng] = useState({ lat: 60, lng: 28 })
  const [address, setAddress] = useState();
  async function getMyLocation() {
    await Location.requestPermissionsAsync();

    try {
      let location = await Location.getCurrentPositionAsync({});
      const url = `http://www.mapquestapi.com/geocoding/v1/reverse?key=0pGleZQXBbZAnWGKh6R2BMTTRIaRfRo1&location=${location.coords.latitude},${location.coords.longitude}&includeRoadMetadata=true&includeNearestIntersection=true`
      const fetchedLocation = await fetch(url);
      const fetchedLocationJson = await fetchedLocation.json();
      setLatLng({ lat: fetchedLocationJson.results[0].providedLocation.latLng.lat, lng: fetchedLocationJson.results[0].providedLocation.latLng.lng });
      setAddress(`${fetchedLocationJson.results[0].locations[0].street}, ${fetchedLocationJson.results[0].locations[0].adminArea5}`);
    } catch (e) { console.log('ei') }
  }
  useEffect(() => {
    getMyLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        initialRegion={{
          latitude: 60,
          longitude: 28,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3
        }}
        region={{
          latitude: latLng.lat,
          longitude: latLng.lng,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3
        }}
      >
        <Marker

          coordinate={{
            latitude: latLng.lat,
            longitude: latLng.lng
          }}
        />

      </MapView>
      <Text style={{ fontSize: 20 }}>{address}</Text>
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
  mapStyle: {
    width: "100%",
    height: "70%",
    marginBottom: 10,
  },
});
