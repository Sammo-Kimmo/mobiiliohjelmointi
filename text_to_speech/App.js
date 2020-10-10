import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import * as Speech from 'expo-speech';


export default function App() {
  const [speakMe, setSpeakMe] = useState(null);

  const say = () => {
    if (speakMe.length > Speech.maxSpeechInputLength) {
      Alert.alert("Liikaa merkkejä");
    } else {
      Speech.speak(speakMe);
    }

  }
  return (
    <View style={styles.container}>
      <TextInput style={{ marginBottom: 7 }} placeholder="Write something to say" multiline={true} onChangeText={(value) => setSpeakMe(value)} value={speakMe} />
      <Button title="Press to hear" onPress={() => say()} />
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
});
