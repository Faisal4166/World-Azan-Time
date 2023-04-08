import React, { useEffect, useState } from 'react';
import * as RNLocalize from 'react-native-localize';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Text,
  PermissionsAndroid,
  ImageBackground,
  Alert,
  Button,
} from 'react-native';
import getStyle from './Styles';
import useTheme1 from '../../Utils/useTheme1';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonSalah from '../../Components/Buttons/Buttons';
import {
  geoLocation,
  PrayerTimes,
  PrayerTimesByDate,
  QiblaDirection,
  setLatLongtd,
} from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import PrayerTimingCard from '../../Components/FlatLists/PrayerTimingCard';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import {
  FormatedDate,
  getCurrentLocation,
  locationPermission,
  NotificationSetting,
  NowUpcomingPrayerFilter,
  PushNotificationSetting,
} from '../../Utils/HelperFunction';
import TimeCompo from '../../Components/TimeCompo';
import HomeActionSheet from '../../Components/ActionSheets/Home/HomeActionSheet';
import getActionSheetStyle from '../../Utils/ActionSheetStyle';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { HOME_NOTIFICATION } from '../../Utils/ActionSheetConstant';
import RandomImages from '../../Utils/randomImages';
import Images from '../../Utils/Images';
import FileViewer from 'react-native-file-viewer';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import notifee, { TriggerType, AuthorizationStatus } from '@notifee/react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const Home = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { styles } = getStyle();
  const { ActionSheetStyle } = getActionSheetStyle();
  const { btnbackground2, btnBackground, txtWhite } = useTheme1();
  const dispatch = useDispatch();
  const {
    darkMode,
    method,
    adjustmentMethod,
    asrLater,
    prayerByDate,
    azanNotification,
    hour12,
    PrayerTime,
    geo_location,
    Latitude,
    Longitude,
  } = useSelector((state) => state.userReducer);
  const dt = new Date();
  const [state, setState] = useState({
    pickerdate: new Date(),
    show: false,
    parayeNotiData: {},
    now: '',
    coming: '',
    comingTime: '',
    cityName: '',
    countryName: '',
  });
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayName = days[state.pickerdate.getDay()];

  useEffect(() => {
    // userPermission();
    getCurrentLocationFun();
  }, [isFocused]);

  const getCurrentLocationFun = async () => {
    const userPermissions = await locationPermission();
    // console.log('__________ ', userPermissions);
    if (userPermissions === 'granted') {
      getPrayer2();
      const location = await getCurrentLocation();
      // console.log('__________________ ', location?.latitude, location?.longitude);
      if (location) {
        dispatch(setLatLongtd(location?.latitude, location?.longitude));
      }
    }
  };

  // console.log('___PrayerTime____', PrayerTime);

  // const userPermission = async () => {
  //   return new Promise((resolve) => {
  //     if (Platform.OS === 'android') {
  //       // console.log('+++++ANDROID+++++');
  //       Geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //           dispatch(setLatLongtd(latitude, longitude));
  //           // console.log('_______________________ ', latitude, '   ', longitude);
  //           resolve({ latitude, longitude });
  //         },
  //         (err) => resolve(err),
  //         {
  //           enableHighAccuracy: true,
  //           timeout: 100,
  //           maximumAge: 0,
  //         }
  //       );
  //     } else {
  //       request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE || PERMISSIONS.IOS.LOCATION_ALWAYS)
  //         .then((result) => {
  //           console.log('----->>>>location permission  ios   ', result);
  //           switch (result) {
  //             case RESULTS.UNAVAILABLE:
  //               console.log('This feature is not available (on this device / in this context)');
  //               break;
  //             case RESULTS.DENIED:
  //               console.log('The permission has not been requested / is denied but requestable');
  //               break;
  //             case RESULTS.LIMITED:
  //               console.log('The permission is limited: some actions are possible');
  //               break;
  //             case RESULTS.GRANTED:
  //               console.log('The permission is granted');
  //               Geolocation.getCurrentPosition((position) => {
  //                 console.log(
  //                   'The permission is granted',
  //                   position.coords.latitude,
  //                   ' ',
  //                   position.coords.longitude
  //                 );
  //                 if (position.coords) {
  //                   dispatch(setLatLongtd(position.coords.latitude, position.coords.longitude));
  //                 }
  //               });
  //               break;
  //             case RESULTS.BLOCKED:
  //               console.log('The permission is denied and not requestable anymore');
  //               break;
  //           }
  //         })
  //         .catch((error) => {
  //           console.low('error....  ', error);
  //         });
  //     }
  //   });
  // };

  const PrevPress = () => {
    setState({
      ...state,
      pickerdate: new Date(state.pickerdate.setDate(state.pickerdate.getDate() - 1)),
    });
  };
  const NextPress = () => {
    setState({
      ...state,
      pickerdate: new Date(state.pickerdate.setDate(state.pickerdate.getDate() + 1)),
    });
    return;
  };

  const onPressButton = (item) => {
    setState({ ...state, parayeNotiData: item });
    SheetManager.show(HOME_NOTIFICATION);
  };

  const getLoacation = () => {
    dispatch(geoLocation(Latitude, Longitude));
  };

  const getQiblaPosition = () => {
    dispatch(QiblaDirection(Latitude, Longitude));
  };

  const createPDF = async () => {
    const monthsName = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let tabledata;
    if (PrayerTime) {
      try {
        PrayerTime?.data?.map((item) => {
          const tempData = `
                <tr>
                <td>${item.date.readable}</td>
                <td>${timeAMPM(item?.timings?.Fajr?.split(' ')[0])}</td>
                <td>${timeAMPM(item?.timings?.Sunrise?.split(' ')[0])}</td>
                <td>${timeAMPM(item?.timings?.Dhuhr?.split(' ')[0])}</td>
                <td>${timeAMPM(item?.timings?.Asr?.split(' ')[0])}</td>
                <td>${timeAMPM(item?.timings?.Maghrib?.split(' ')[0])}</td>
                <td>${timeAMPM(item?.timings?.Isha?.split(' ')[0])}</td>
              </tr>
              `;
          if (!tabledata) {
            tabledata = tempData;
          } else {
            tabledata += tempData;
          }
        });
        const htmlStyle = ` <style>
      .table-heading {
        background-color: rgb(2, 2, 77);
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th {
        color: #fff;
      }
      th,
      td {
        text-align: left;
        padding: 8px;
      }
      tr:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.1);
      }
      /* th {
        color: #fff;
        font-weight: 700;
        font-size: 20px;
      } */
    </style>`;
        const html = `<html>
    <head>
    ${htmlStyle}
    </head>
    <body>
    <h2>Prayer time of ${monthsName[dt.getMonth()]} ${dt.getFullYear()} of ${
          geo_location?.results[0]?.address_components[0]?.long_name
        } By Azaan App</h2>
    <table>
      <tr class="table-heading">
        <th>Date</th>
        <th>Fajr</th>
        <th>Sunrise</th>
        <th>Dhuhr</th>
        <th>Asr</th>
        <th>Maghrib</th>
        <th>Isha</th>
      </tr>
      ${tabledata}
    </table>
    </body>
    </html>`;
        let options = {
          html,
          fileName: `${state.cityName}-${monthsName[dt.getMonth()]}-PrayerTime`,
          directory: 'Download',
          base64: true,
        };
        console.log('options===>>>', options);
        let file = await RNHTMLtoPDF.convert(options);
        if (file.filePath) {
          Alert.alert('Successfully Exported', `File Save at Location: ${file.filePath}`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open',
              onPress: () => {
                FileViewer.open(file.filePath)
                  .then(() => console.log('SuccessFully View'))
                  .catch((err) => console.log(err));
              },
            },
          ]);
        }
      } catch (error) {
        console.log(error, 'error on create pdf Function');
      }
    }
  };

  useEffect(() => {
    if (geo_location) {
      const cityName = geo_location?.results[0]?.address_components[0]?.long_name;
      const addressArray = geo_location?.results[0]?.formatted_address.split(',');
      const countryName = addressArray[addressArray.length - 1];
      setState({ ...state, cityName, countryName });
    }
  }, [geo_location, Latitude, Longitude]);

  useEffect(() => {
    NowUpcomingPrayerFilter(prayerByDate, state, setState);
  }, [prayerByDate]);
  useEffect(() => {
    if (Latitude && Longitude) {
      getPrayer();
    }
  }, [state.pickerdate, method, asrLater, adjustmentMethod, Latitude, Longitude]);

  const currentDateStatus = () => {
    let pickDate = `"${state.pickerdate.getDate()}-${state.pickerdate.getMonth()}-${state.pickerdate.getFullYear()}"`;
    let currentD = `"${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}"`;
    if (pickDate > currentD) {
      return 1;
    } else if (pickDate < currentD) {
      return 2;
    } else if (pickDate === currentD) {
      return 3;
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentdate = selectedDate || state.pickerdate;
    setState({ ...state, show: false, pickerdate: currentdate });
  };
  const PickDate = () => {
    showDatePicker();
    setState({ ...state, show: true });
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.warn('---', date);
    const currentdate = date || state.pickerdate;
    setState({ ...state, show: Platform.OS === 'ios', pickerdate: currentdate });
    hideDatePicker();
  };

  const getPrayer = () => {
    const timestamp = moment(state.pickerdate).unix();
    const type = asrLater ? 1 : 0;
    dispatch(PrayerTimesByDate(timestamp, Latitude, Longitude, method, adjustmentMethod, type));
  };

  useEffect(() => {
    if (Latitude && Longitude) {
      getQiblaPosition();
      getLoacation();
    }
  }, [Latitude, Longitude, isFocused]);

  const timeAMPM = (time) => {
    return moment(time, 'hh:mm a').format('hh:mm A');
  };

  useEffect(() => {
    // console.log('----- ', adjustmentMethod);
    if (Latitude && Longitude) {
      getPrayer2();
    }
  }, [hour12, Latitude, Longitude, method, asrLater, isFocused]);

  const getPrayer2 = () => {
    const timezone = RNLocalize.getTimeZone();
    const month = dt.getMonth() + 1;
    const year = dt.getFullYear();
    const type = asrLater ? 1 : 0;
    // console.log(
    //   Latitude,
    //   Longitude,
    //   method,
    //   adjustmentMethod,
    //   type,
    //   year,
    //   month,
    //   timezone,
    //   'in prayer'
    // );
    dispatch(
      PrayerTimes(Latitude, Longitude, method, adjustmentMethod, type, year, month, timezone)
    );
  };

  //Notifications Start

  async function requestUserPermission() {
    const settings = await notifee.requestPermission({
      sound: true,
      announcement: true,
      inAppNotificationSettings: false,
      provisional: true,
      inAppNotificationSettings: true,
    });

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Permission settings:', settings);
      } else {
        console.log('User declined permissions');
      }
    } else {
      if (settings.authorizationStatus) {
        console.log('User has notification permissions enabled');
      } else {
        console.log('User has notification permissions disabled');
      }
      console.log('iOS settings: ', settings.ios);
    }
    if (settings) {
      console.log('Current permission settings: ', settings);
    }
  }

  useEffect(() => {
    requestUserPermission();
    onDisplayNotification();
  }, [azanNotification, prayerByDate]);

  const onDisplayNotification = async () => {
    PushNotificationSetting(prayerByDate, azanNotification);
    NotificationSetting(prayerByDate, azanNotification);
    PushNotification.createChannel({
      channelId: 'WorldAzanTime',
      channelName: 'Prayer_Time',
      title: 'World-Azan-Time',
      body: state.now,
      soundName: 'azan',
      vibrate: true,
      playSound: true,
    });
    console.log('==============Notification======================');
    // console.log(prayerByDate);
    // console.log(azanNotification);
    // For notifee library
    await notifee.requestPermission({
      sound: true,
      announcement: true,
      inAppNotificationSettings: false,
      provisional: true,
      inAppNotificationSettings: true,
    });
    await notifee.createChannel({
      id: 'WorldAzanTime',
      name: 'World-Azan-Time' + state.now,
      sound: 'azan.mp3',
      vibrate: true,
      playSound: true,
    });
    await notifee.displayNotification({
      title: 'World Azan Time',
      body: 'Welcome to World-Azan-Time, it will provide you scheduled prayer notificaions',
      android: {
        channelId: 'WorldAzanTime',
        smallIcon: 'default', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
    // notification(12, 4);
    //  await notifee.cancelAllNotifications();
  };

  //Notification Function End

  // useEffect(() => {
  //   notification();
  // }, [isFocused]);

  // const notification = async (hour, minute) => {
  //   await notifee.cancelAllNotifications();
  //   await notifee.requestPermission();
  //   const date = new Date(Date.now());
  //   date?.setHours(hour);
  //   date?.setMinutes(minute);
  //   const trigger = {
  //     type: Platform.OS === 'ios' ? 'Notification' : TriggerType.TIMESTAMP,
  //     timestamp: date.getTime(),
  //     alarmManager: true,
  //   };
  //   await notifee.createTriggerNotification(
  //     {
  //       title: 'Meeting with Allah',
  //       body: 'Today at 08:44 pm',
  //       android: {
  //         channelId: 'WorldAzanTime',
  //         sound: 'azan',
  //         showTimestamp: true,
  //         largeIcon:
  //           'https://gumlet.assettype.com/greaterkashmir%2F2021-06%2Fca48251e-6dda-4e22-a131-58fb3bc77265%2FHajj_Makkah_Kaaba_Harmain.jpg?auto=format%2Ccompress&fit=max&w=768&dpr=1.0',
  //       },
  //       ios: {
  //         sound: 'azan.mp3',
  //         foregroundPresentationOptions: {
  //           banner: true,
  //           list: true,
  //         },
  //       },
  //     },
  //     trigger
  //   );
  //   console.log('in home');
  // };

  return (
    <View style={styles.MainView}>
      <ActionSheet id={HOME_NOTIFICATION} containerStyle={ActionSheetStyle.container}>
        <HomeActionSheet data={state.parayeNotiData} />
      </ActionSheet>
      {state.show && (
        <>
          {Platform.OS === 'ios' ? (
            <View style={[styles.calender, { zIndex: 999, backgroundColor: '#fff' }]}>
              <DateTimePicker
                testID="dateTimePicker"
                value={state.pickerdate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                onChange={onChangeDate}
              />
            </View>
          ) : (
            <>
              <View style={styles.calender}>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  date={state.pickerdate}
                />
              </View>
            </>
          )}
        </>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.MainView}>
          <ImageBackground
            source={
              RandomImages.length
                ? {
                    uri: `${RandomImages[Math.floor(Math.random() * RandomImages.length)]}`,
                    cache: 'reload',
                  }
                : Images.Masjid
            }
            imageStyle={{
              width: '100%',
              resizeMode: 'cover',
            }}
            style={{
              height: 150,
              justifyContent: 'space-between',
            }}
          >
            <View style={styles.heading_container}>
              <View style={styles.backgroundDrop}>
                <Text style={styles.headingTxt}>World Azan Time</Text>
                <TimeCompo />
              </View>
            </View>
            <View style={[styles.heading_container, { marginBottom: 6, alignItems: 'center' }]}>
              <View style={[styles.backgroundDrop, { alignItems: 'center' }]}>
                <Text style={styles.nowcoming_heading_txt}>Now</Text>
                <Text style={styles.nowcoming_txt}>{state.now}</Text>
              </View>
              <View style={[styles.backgroundDrop, { alignItems: 'center' }]}>
                <Text style={styles.nowcoming_heading_txt}>Upcoming</Text>
                <Text style={styles.nowcoming_txt}>{state.coming}</Text>
                {state.comingTime ? (
                  <Text style={styles.nowcoming_txt}>
                    {hour12 ? timeAMPM(state.comingTime) : state.comingTime}
                  </Text>
                ) : null}
              </View>
            </View>
          </ImageBackground>

          <View style={styles.wrapView}>
            <ButtonSalah Icons label={currentDateStatus()} />
            <View style={styles.wrapViewRow}>
              <TouchableOpacity onPress={PrevPress}>
                <Ionicons name="chevron-back" size={28} color={btnbackground2} />
              </TouchableOpacity>
              <View>
                <TouchableOpacity activeOpacity={0.6} onPress={() => PickDate()}>
                  <ButtonSalah
                    simpleTxt={true}
                    label={`${dayName} ${FormatedDate(state.pickerdate)}`}
                    customStyle={styles.txtSub}
                  />
                  {/* <Text style={[{ textAlign: 'center' }, styles.txtSub]}>{state.cityName}</Text> */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('LocationSearch')}
                    style={{ flexDirection: 'row', alignSelf: 'center' }}
                  >
                    <Text style={[{ textAlign: 'center' }, styles.txtSub]}>{state.cityName}</Text>
                    <Ionicons
                      name="location"
                      color={'#f75c2d'}
                      size={25}
                      style={{ marginTop: 3 }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={NextPress}>
                <Ionicons name="chevron-forward-sharp" size={28} color={btnbackground2} />
              </TouchableOpacity>
            </View>
          </View>
          <PrayerTimingCard timeAMPM={timeAMPM} onPress={onPressButton} date={state.pickerdate} />
          <TouchableOpacity
            // activeOpacity={0.4}
            style={{
              backgroundColor: darkMode ? btnBackground : '#8aa2ed50',
              alignSelf: 'center',
              paddingHorizontal: 20,
              paddingVertical: 7,
              borderRadius: 10,
              elevation: darkMode ? 5 : 0,
              borderWidth: 1,
              borderColor: '#fff',
              marginTop: 2,
              marginBottom: 30,
            }}
            onPress={createPDF}
          >
            <Text
              style={{
                color: txtWhite,
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              Generate PDF
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: '10%' }} />
      </ScrollView>
    </View>
  );
};
export default Home;
