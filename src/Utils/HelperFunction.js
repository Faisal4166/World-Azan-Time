import { SheetManager } from 'react-native-actions-sheet';
import notifee, { TriggerType } from '@notifee/react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const FormatedDate = (date) => {
  let month;
  if (date.getMonth() < 9 && date.getMonth() > 0) {
    month = `${0}${date.getMonth() + 1}`;
  } else if (date.getMonth() === 0) {
    month = `${0}${date.getMonth() + 1}`;
  } else {
    month = date.getMonth() + 1;
  }
  let day;
  if (date.getDate() < 10) {
    day = `${0}${date.getDate()}`;
  } else {
    day = date.getDate();
  }
  const fd = `${day}-${month}-${date.getFullYear()}`;
  return fd;
};
export const OpenActionSheet = async (id) => {
  SheetManager.show(id);
};
export const setPrayerNotifictionTime = async (reducerState, time, type) => {
  const silent = [
    {
      Fajr: {
        silent: true,
        unsilent: false,
        azansound: false,
      },
      Sunrise: {
        silent: true,
        unsilent: false,
        azansound: false,
      },
      Dhuhr: {
        silent: true,
        unsilent: false,
        azansound: false,
      },
      Asr: {
        silent: true,
        unsilent: false,
        azansound: false,
      },
      Maghrib: {
        silent: true,
        unsilent: false,
        azansound: false,
      },
      Isha: {
        silent: true,
        unsilent: false,
        azansound: false,
      },
    },
  ];
  const unsilent = [
    {
      Fajr: {
        silent: false,
        unsilent: true,
        azansound: false,
      },
      Sunrise: {
        silent: false,
        unsilent: true,
        azansound: false,
      },
      Dhuhr: {
        silent: false,
        unsilent: true,
        azansound: false,
      },
      Asr: {
        silent: false,
        unsilent: true,
        azansound: false,
      },
      Maghrib: {
        silent: false,
        unsilent: true,
        azansound: false,
      },
      Isha: {
        silent: false,
        unsilent: true,
        azansound: false,
      },
    },
  ];
  const sound = [
    {
      Fajr: {
        silent: false,
        unsilent: false,
        azansound: true,
      },
      Sunrise: {
        silent: false,
        unsilent: false,
        azansound: true,
      },
      Dhuhr: {
        silent: false,
        unsilent: false,
        azansound: true,
      },
      Asr: {
        silent: false,
        unsilent: false,
        azansound: true,
      },
      Maghrib: {
        silent: false,
        unsilent: false,
        azansound: true,
      },
      Isha: {
        silent: false,
        unsilent: false,
        azansound: true,
      },
    },
  ];
  const obj = {};
  if (type === 'silent') {
    obj[time.name] = silent[0][time.name];
    const returnSilentData = {
      ...reducerState,
      ...obj,
    };
    return returnSilentData;
  } else if (type === 'noti') {
    obj[time.name] = unsilent[0][time.name];
    const returnUnsilentData = {
      ...reducerState,
      ...obj,
    };
    return returnUnsilentData;
  } else if (type === 'sound') {
    obj[time.name] = sound[0][time.name];
    const returnSoundData = {
      ...reducerState,
      ...obj,
    };
    return returnSoundData;
  }
};

// const notify = async (hour, minute, sound, prayerName) => {
//   const date = new Date(Date.now());
//   date.setHours(hour);
//   date.setMinutes(minute);
//   const trigger = {
//     type: TriggerType.TIMESTAMP,
//     timestamp: date.getTime(),
//     alarmManager: true,
//   };

//   await notifee.createTriggerNotification(
//     {
//       title: "It's Time to Pray",
//       body: prayerName + 'Pray time',
//       android: {
//         channelId: 'WorldAzanTime',
//         sound: sound ? 'azan' : false,
//         showTimestamp: true,
//         largeIcon:
//           'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
//       },
//       ios: {
//         sound: sound ? 'azan2' : false,
//       },
//     },
//     trigger
//   );
// };
// const SetNotifictionSeconds = async (gettingTime, sound, prayerName) => {
//   let dt = new Date();
//   let hour = Number(gettingTime.slice(0, 2));
//   let minute = Number(gettingTime.slice(3, 5));
//   let currentHour = dt.getHours();
//   let currentMinute = dt.getMinutes();
//   if (hour > currentHour) {
//     // let calhour = Math.abs(currentHour - hour) * 3600;
//     // let calminutes = Math.abs(currentMinute - minute) * 60;
//     // let total = calhour + calminutes;

//     notify(hour, minute, sound, prayerName);
//   } else if (hour === currentHour) {
//     if (minute > currentMinute) {
//       // let calhour = Math.abs(currentHour - hour) * 3600;
//       // let calminutes = Math.abs(currentMinute - minute) * 60;
//       // let total = calhour + calminutes;
//       notify(hour, minute, sound, prayerName);
//     }
//   }
// };

// Using notifee library
export const NotificationSetting = async (prayertime, azanData) => {
  const d = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  d.forEach(async (item) => {
    if (azanData[item].silent) {
      const gettingTime = prayertime?.data?.timings[item];
      let hour = Number(gettingTime.slice(0, 2));
      let minute = Number(gettingTime.slice(3, 5));
      const date = new Date(Date.now());
      date.setHours(hour);
      date.setMinutes(minute);
      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        alarmManager: true,
      };
      // console.log('in data upper silent');
      await notifee.createTriggerNotification(
        {
          title: "It's Time to Pray",
          body: item + ' Pray time',
          android: {
            channelId: 'WorldAzanTime',
            showTimestamp: true,
            largeIcon:
              'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
          },
        },
        trigger
      );
      await notifee.displayNotification({
        title: 'its Time to Prayer',
        android: {
          channelId: 'WorldAzanTime',
          smallIcon: 'default', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      });
      // console.log('in data lower silent');
    }
    if (azanData[item].unsilent) {
      const gettingTime = prayertime?.data?.timings[item];
      let hour = Number(gettingTime.slice(0, 2));
      let minute = Number(gettingTime.slice(3, 5));

      const date = new Date(Date.now());
      date.setHours(hour);
      date.setMinutes(minute);
      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        alarmManager: true,
      };
      await notifee.createTriggerNotification(
        {
          title: "It's Time to Pray",
          body: item + ' Pray time',
          android: {
            channelId: 'WorldAzanTime',
            sound: 'default',
            showTimestamp: true,
            largeIcon:
              'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
          },
          ios: {
            sound: 'default',
          },
        },
        trigger
      );
      console.log('in data lower unsilent');
    }

    if (azanData[item].azansound) {
      const gettingTime = prayertime?.data?.timings[item];

      let hour = Number(gettingTime.slice(0, 2));
      let minute = Number(gettingTime.slice(3, 5));
      const date = new Date(Date.now());
      date.setHours(hour);
      date.setMinutes(minute);
      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        alarmManager: true,
      };

      await notifee.createTriggerNotification(
        {
          title: "It's Time to Pray",
          body: item + ' Pray time',
          android: {
            channelId: 'WorldAzanTime',
            sound: 'azan',
            showTimestamp: true,
            largeIcon:
              'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
          },
          ios: {
            channelId: 'WorldAzanTime',
            sound: 'azan.mp3',
            showTimestamp: true,
            largeIcon:
              'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
          },
        },
        trigger
      );
      console.log('in data lower sound');
      await notifee.displayNotification({
        title: 'World Azan Time',
        body: 'its time to Prayer',
        date: new Date(Date.now() + total * 1000),
        playSound: true,
        soundName: 'azan.mp3',
        android: {
          channelId: 'WorldAzanTime',
          smallIcon: 'default', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  });
  // console.log(await notifee.getTriggerNotifications());
};

// using push-notification
export const PushNotificationSetting = async (prayertime, azanData) => {
  console.log('----Push Notification Function---');
  PushNotification.popInitialNotification((notification) => {
    console.log('Initial Notification ---- ', notification);
  });
  PushNotification.cancelAllLocalNotifications();
  PushNotification.localNotificationSchedule({
    channelId: 'WorldAzanTime',
    title: 'Welcome Dear hope you are doing good',
    message: 'World Azan Time',
    date: new Date(Date.now() + 5 * 1000),
    allowWhileIdle: false,
    importance: Importance.HIGH,
    playSound: true,
    vibrate: true,
    soundName: 'azan',
    bigPictureUrl:
      'http://2.bp.blogspot.com/-M98YkZcc6lY/Utdz3km3LPI/AAAAAAAAILg/VIGWrrxrZIo/s1600/Masjid-e-Nabvi+(SAWW).jpg',
  });
  const dt = new Date();

  const d = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  d.forEach(async (item) => {
    if (azanData[item].silent) {
      const gettingTime = prayertime?.data?.timings[item];
      let hour = Number(gettingTime.slice(0, 2));
      let minute = Number(gettingTime.slice(3, 5));
      let currentHour = dt.getHours();
      let currentMinute = dt.getMinutes();
      // console.log('in data upper silent');
      if (hour > currentHour) {
        let calhour = Math.abs(currentHour - hour) * 3600;
        let calminutes = Math.abs(currentMinute - minute) * 60;
        let total = calhour + calminutes;

        PushNotification.localNotificationSchedule({
          channelId: 'WorldAzanTime',
          title: "It's Time to Pray",
          message: item + ' Pray time',
          date: new Date(Date.now() + total * 1000),
          allowWhileIdle: false,
          playSound: false,
          bigPictureUrl:
            'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
        });
      } else if (hour === currentHour) {
        if (minute > currentMinute) {
          let calhour = Math.abs(currentHour - hour) * 3600;
          let calminutes = Math.abs(currentMinute - minute) * 60;
          let total = calhour + calminutes;
          PushNotification.localNotificationSchedule({
            channelId: 'WorldAzanTime',
            title: "It's Time to Pray",
            message: item + ' Pray time',
            date: new Date(Date.now() + total * 1000),
            allowWhileIdle: false,
            playSound: false,
            bigPictureUrl:
              'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
          });
        }
      }

      // console.log('in data lower silent');
    }
    if (azanData[item].unsilent) {
      const gettingTime = prayertime?.data?.timings[item];
      let hour = Number(gettingTime.slice(0, 2));
      let minute = Number(gettingTime.slice(3, 5));
      let currentHour = dt.getHours();
      let currentMinute = dt.getMinutes();
      // console.log('in data upper silent');
      if (hour > currentHour) {
        let calhour = Math.abs(currentHour - hour) * 3600;
        let calminutes = Math.abs(currentMinute - minute) * 60;
        let total = calhour + calminutes;
        await notifee.displayNotification({
          title: 'World Azan Time',
          body: 'its time to Prayer',
          date: new Date(Date.now() + total * 1000),
          playSound: true,
          android: {
            channelId: 'WorldAzanTime',
            smallIcon: 'default', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        });
        PushNotification.localNotificationSchedule({
          channelId: 'WorldAzanTime',
          title: "It's Time to Pray",
          message: item + ' Pray time',
          date: new Date(Date.now() + total * 1000),
          allowWhileIdle: false,
          playSound: true,
          soundName: 'default',
          bigPictureUrl:
            'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
        });
      } else if (hour === currentHour) {
        if (minute > currentMinute) {
          let calhour = Math.abs(currentHour - hour) * 3600;
          let calminutes = Math.abs(currentMinute - minute) * 60;
          let total = calhour + calminutes;

          await notifee.displayNotification({
            title: 'World Azan Time',
            body: 'its time to Prayer',
            date: new Date(Date.now() + total * 1000),
            playSound: true,
            android: {
              channelId: 'WorldAzanTime',
              smallIcon: 'default', // optional, defaults to 'ic_launcher'.
              // pressAction is needed if you want the notification to open the app when pressed
              pressAction: {
                id: 'default',
              },
            },
          });
          PushNotification.localNotificationSchedule({
            channelId: 'WorldAzanTime',
            title: "It's Time to Pray",
            message: item + ' Pray time',
            date: new Date(Date.now() + total * 1000),
            allowWhileIdle: false,
            playSound: true,
            soundName: 'azan.mp3',
            bigPictureUrl:
              'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
          });
        }
      }

      // console.log('in data lower silent');
    }
    if (azanData[item].azansound) {
      const gettingTime = prayertime?.data?.timings[item];
      let hour = Number(gettingTime.slice(0, 2));
      let minute = Number(gettingTime.slice(3, 5));
      let currentHour = dt.getHours();
      let currentMinute = dt.getMinutes();
      // console.log('in data upper silent');
      if (hour > currentHour) {
        let calhour = Math.abs(currentHour - hour) * 3600;
        let calminutes = Math.abs(currentMinute - minute) * 60;
        let total = calhour + calminutes;
        await notifee.displayNotification({
          title: 'World Azan Time',
          body: 'its time to Prayer',
          date: new Date(Date.now() + total * 1000),
          playSound: true,
          soundName: 'azan.mp3',
          android: {
            channelId: 'WorldAzanTime',
            smallIcon: 'default', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        });
        PushNotification.localNotificationSchedule({
          channelId: 'WorldAzanTime',
          title: "It's Time to Pray",
          message: item + ' Pray time',
          date: new Date(Date.now() + total * 1000),
          allowWhileIdle: false,
          playSound: true,
          priority: 'high',
          actions: ['Yes'],
          soundName: 'azan.mp3',
          bigPictureUrl:
            'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
        });
      } else if (hour === currentHour) {
        if (minute > currentMinute) {
          let calhour = Math.abs(currentHour - hour) * 3600;
          let calminutes = Math.abs(currentMinute - minute) * 60;
          let total = calhour + calminutes;
          PushNotification.localNotificationSchedule({
            channelId: 'WorldAzanTime',
            title: "It's Time to Pray",
            message: item + ' Pray time',
            date: new Date(Date.now() + total * 1000),
            allowWhileIdle: false,
            playSound: true,
            soundName: 'azan.mp3',
            bigPictureUrl:
              'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
          });
        }
        await notifee.displayNotification({
          title: 'World Azan Time',
          body: 'its time to Prayer',
          date: new Date(Date.now() + total * 1000),
          playSound: true,
          soundName: 'azan.mp3',
          android: {
            channelId: 'WorldAzanTime',
            smallIcon: 'default', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        });
      }

      // console.log('in data lower silent');
    }
    // if (azanData[item].unsilent) {
    //   const gettingTime = prayertime?.data?.timings[item];
    //   let hour = Number(gettingTime.slice(0, 2));
    //   let minute = Number(gettingTime.slice(3, 5));

    //   const date = new Date(Date.now());
    //   date.setHours(hour);
    //   date.setMinutes(minute);
    //   PushNotification.localNotificationSchedule({
    //     channelId: 'WorldAzanTime',
    //     title: "It's Time to Pray",
    //     message: item + ' Pray time',
    //     date: date.getTime(),
    //     allowWhileIdle: false,
    //     playSound: true,
    //     soundName: 'default',
    //     bigPictureUrl:
    //       'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
    //   });
    //   console.log('in data lower unsilent');
    // }

    // if (azanData[item].azansound) {
    //   const gettingTime = prayertime?.data?.timings[item];
    //   let hour = Number(gettingTime.slice(0, 2));
    //   let minute = Number(gettingTime.slice(3, 5));
    //   const date = new Date(Date.now());
    //   date.setHours(hour);
    //   date.setMinutes(minute);
    //   PushNotification.localNotificationSchedule({
    //     channelId: 'WorldAzanTime',
    //     title: "It's Time to Pray",
    //     message: item + ' Pray time',
    //     date: date.getTime(),
    //     allowWhileIdle: false,
    //     playSound: true,
    //     soundName: 'azan',
    //     bigPictureUrl:
    //       'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
    //   });

    //   console.log('in data lower sound');
    // }
  });
  // console.log(
  //   PushNotification.getScheduledLocalNotifications((res) =>
  //     console.log(res, 'in all notification')
  //   )
  // );
  // console.log(await notifee.getTriggerNotifications());
};

export const NowUpcomingPrayerFilter = (prayerByDate, state, setstate) => {
  const dt = new Date();
  const hour = dt.getHours() < 10 ? `0${dt.getHours()}` : dt.getHours();
  const minutes = dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : dt.getMinutes();
  const currentTime = `"${hour}:${minutes}"`;

  // console.log('__++____', currentTime);

  if (
    currentTime > `"${prayerByDate?.data?.timings?.Fajr}"` &&
    currentTime < `"${prayerByDate?.data?.timings?.Sunrise}"`
  ) {
    setstate({
      ...state,
      now: 'Fajr',
      coming: 'Sunrise',
      comingTime: prayerByDate?.data?.timings?.Sunrise,
    });
  } else if (
    currentTime > `"${prayerByDate?.data?.timings?.Sunrise}"` &&
    currentTime < `"${prayerByDate?.data?.timings?.Dhuhr}"`
  ) {
    setstate({
      ...state,
      now: 'Sunrise',
      coming: 'Dhuhr',
      comingTime: prayerByDate?.data?.timings?.Dhuhr,
    });
  } else if (
    currentTime > `"${prayerByDate?.data?.timings?.Dhuhr}"` &&
    currentTime < `"${prayerByDate?.data?.timings?.Asr}"`
  ) {
    setstate({
      ...state,
      now: 'Dhuhr',
      coming: 'Asr',
      comingTime: prayerByDate?.data?.timings?.Asr,
    });
  } else if (
    currentTime > `"${prayerByDate?.data?.timings?.Asr}"` &&
    currentTime < `"${prayerByDate?.data?.timings?.Maghrib}"`
  ) {
    setstate({
      ...state,
      now: 'Asr',
      coming: 'Maghrib',
      comingTime: prayerByDate?.data?.timings?.Maghrib,
    });
  } else if (
    currentTime > `"${prayerByDate?.data?.timings?.Maghrib}"` &&
    currentTime < `"${prayerByDate?.data?.timings?.Isha}"`
  ) {
    setstate({
      ...state,
      now: 'Maghrib',
      coming: 'Isha',
      comingTime: prayerByDate?.data?.timings?.Isha,
    });
  } else if (
    currentTime > `"${prayerByDate?.data?.timings?.Isha}"` &&
    currentTime > `"${prayerByDate?.data?.timings?.Fajr}"`
  ) {
    setstate({
      ...state,
      now: 'Isha',
      coming: 'Fajr',
      comingTime: '',
    });
  }
};

/////////////////

export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const cords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position?.coords?.heading,
        };
        resolve(cords);
      },
      (error) => {
        reject(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization('whenInUse');
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
    }
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          resolve('granted');
        }
        return reject('Location Permission denied');
      })
      .catch((error) => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
      });
  });

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});
