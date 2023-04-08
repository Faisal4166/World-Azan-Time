import React, { Component, useEffect, useState } from 'react';

import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Store, persistor } from './src/redux/store';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const RootStack = createNativeStackNavigator();
// Navigator Screens
import Navigation from './src/Screens/Navigations/StackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestUserPermission, NotificationListner } from './src/Utils/PushNotification_Halper';
import Foreground_Handler from './src/Utils/Foreground_Handler';

function App() {
  useEffect(() => {
    requestUserPermission();
    PushNotification.createChannel({
      channelId: 'WorldAzanTime',
      channelName: 'Prayer_Time',
    });
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('=======', authStatus);

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    await messaging().requestPermission({
      sound: true,
      announcement: true,
      provisional: true,
      providesAppNotificationSettings: true,
      // ... other permission settings
    });
    if (enabled) {
      console.log('Authorization status:', authStatus);
      generateFcmToken();
    } else {
      console.log('Not AUTHORIZED');
    }
  };

  const generateFcmToken = async () => {
    if (!fcmtoken) {
      try {
        const newfcmToken = messaging().getToken();
        await AsyncStorage.setItem('fcmToken', newfcmToken);
      } catch (error) {
        console.log(error, 'in generating fcm token error');
      }
    }
  };

  // useEffect(() => {
  //   requestUserPermission();
  //   NotificationListner();
  // }, []);

  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <Foreground_Handler />
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack.Navigator
              headerMode="none"
              screenOptions={{
                headerShown: false,
              }}
            >
              <RootStack.Screen name="Navigation" component={Navigation} />
            </RootStack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
