import {NotificationsAndroid} from 'react-native-notifications';
import navigator from './../NavigationService';


const NotificationListner = ()=>{
    // NotificationsAndroid.refreshToken()
    // NotificationsAndroid.setRegistrationTokenUpdateListener((deviceToken) => {
    //   // TODO: Send the token to my server so it could send back push notifications...
    //   console.log('Push-notifications registered!', deviceToken)
    //   global.android_token = deviceToken
    //   console.log(deviceToken)
    //   NotificationsAndroid.setNotificationReceivedListener((notification) => {
    //     //alert(JSON.stringify(notification))
    //     console.log("Notification received on device in background or foreground", notification.getData());
    //   });
    //   NotificationsAndroid.setNotificationReceivedInForegroundListener((notification) => {
    //     console.log("Notification received on device in foreground", notification.getData());
    //   });
    //   NotificationsAndroid.setNotificationOpenedListener((notification) => {
    //     console.log("Notification opened by device user", notification.getData());
    //   });
    //   //alert(deviceToken)
    // });
}

export {NotificationListner}