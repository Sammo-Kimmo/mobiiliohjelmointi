import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function App() {
  const [contacts, setContacts] = useState([]);

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync();
      console.log(data[0]);
      if (data.length > 0) {
        setContacts(data);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{marginBottom: 5, fontWeight: "bold"}}>Contacts {contacts.length}</Text>
      
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
        
            <View>
              {item.phoneNumbers && <Text>{item.name} {item.phoneNumbers[0].number}</Text>}
              
            </View>
       
        )

        }
      />
    
      <View style={{marginTop: 4, marginBottom: 4}}>
        <Button title="Show Contacts" onPress={() => getContacts()}/>
      </View>
      
      <StatusBar style="auto" />


    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
