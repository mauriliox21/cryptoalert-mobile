import React, {useEffect} from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import Routes from './src/routes';
import { NativeBaseProvider } from 'native-base';
import { SQLiteProvider } from 'expo-sqlite/next';
import { databaseInit } from './src/database/databaseInit';

export default function App() {
  useEffect(() => {
    
    try{
      // messaging().getToken()
      // .then(token => {
      //   alert("token gerado com sucesso");
      //   console.log("token: " + token);
      // });
      // console.log("Device ------> " + Device.osName);
      // console.log("Real Device ------> " + Device.isDevice);

    }
    catch(erro){
      alert("erro de token");
    }
  }, []);

  return (
    <NativeBaseProvider>
        <StatusBar backgroundColor={"#010101"} barStyle={'light-content'} />
        <SQLiteProvider databaseName="cryptoalert.db" onInit={databaseInit}>
          <NavigationContainer>
            <Routes/>
          </NavigationContainer>
        </SQLiteProvider>
    </NativeBaseProvider>
  );
}

