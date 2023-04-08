import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';

const Foreground_Handler = () => {
  useEffect(() => {
    const unSubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      );
      PushNotification.localNotification({
        channelId: 'WorldAzanTime',
        channelName: 'Prayer_Time',
        title: 'World-Azan-Time',
        body: 'Prayer Time',
        soundName: 'azan ? azan : azan.mp3',
        vibrate: true,
        playSound: true,
      });
    });
    return unSubscribe;
  }, []);
};
export default Foreground_Handler;
