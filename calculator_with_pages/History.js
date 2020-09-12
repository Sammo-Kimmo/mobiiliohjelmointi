import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';

export default function History({ route, navigation }) {

    const [history, setHistory] = useState(route.params);

    return (
        <SafeAreaView style={{padding: 35}}>
            <StatusBar hidden={true} />
            <Text>History clears on app close.</Text>
            <Text></Text>
            <FlatList
                data={history.history}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                    <Text>{item.key}</Text>}
            />


        </SafeAreaView>

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