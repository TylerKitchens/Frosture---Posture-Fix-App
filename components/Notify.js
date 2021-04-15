import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { STORAGE } from '../api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Notify(navigation) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    (async () => await schedulePushNotification())()

    /* return () => {
       Notifications.removeNotificationSubscription(notificationListener.current);
       Notifications.removeNotificationSubscription(responseListener.current);
     };
     */
  }, []);

  return (
    <View ></View>
  );
}

async function schedulePushNotification() {
  if (await STORAGE.getTwoDayNotify() != {}) {
    Notifications.cancelScheduledNotificationAsync(await STORAGE.getTwoDayNotify())
    console.log('Canceled Notification')
  }
  // const trigger = new Date(Date.now() + 60 * 60 * 1000 * 48);
  //const trigger = new Date(Date.now() + 60  * 1000 );




  if (await STORAGE.getNotificationStatus() === 'yes') {
    const twoDay = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't Give Up On Your Posture!",
        body: 'Start Frosturizing again!',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 172800 }
    });
    //Cancel this when user opens the app
    STORAGE.saveTwoDayNotify(twoDay)
  }



}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;

    }
    if (finalStatus !== 'granted') {
      //alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(await STORAGE.getNotificationStatus())
    if(!await STORAGE.getNotificationStatus()){
      await STORAGE.setNotification('yes')
    }
  } else {
    //alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}