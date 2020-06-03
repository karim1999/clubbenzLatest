import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

import {AsyncStorage} from 'react-native';

import Toast from "react-native-simple-toast";

export default async (message: RemoteMessage) => {
    // handle your message
    console.log(message.data)
    debugger
    console.log('background and app killed notification from firebase')

    Toast.show('Background Message', Toast.LONG, Toast.BOTTOM);
    
    AsyncStorage.setItem("Notification", JSON.stringify(message.data));

    return Promise.resolve();
}