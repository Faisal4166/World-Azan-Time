/**
 * @format
 */

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { AppRegistry, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)

  onRegister: function (token) {
    // console.log('______TOKEN_______', token);
  },

  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  setTimeout(() => {
    console.log('BACKGROUND LISTNEAR');
  }, 5000);
});

AppRegistry.registerComponent(appName, () => App);
