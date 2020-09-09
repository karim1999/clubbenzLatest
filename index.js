/**
 * @format
 */

import {AppRegistry, AsyncStorage} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import bgmessaging from './src/bgmessaging'
import BackgroundFetch from "react-native-background-fetch";
import Geolocation from "react-native-geolocation-service";
import {scheduleNotification} from './src/redux/actions/workshops';

let MyHeadlessTask = async (event) => {
    // Get task id from event {}:
    let taskId = event.taskId;
    console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

    // Perform an example HTTP request.
    // Important:  await asychronous tasks when using HeadlessJS.
    // let response = await fetch('https://facebook.github.io/react-native/movies.json');
    // let responseJson = await response.json();
    Geolocation.getCurrentPosition((position) => {
            console.log(position)
            AsyncStorage.getItem('user').then(userString => {
                let user= JSON.parse(userString)
                // console.log(user.id)
                scheduleNotification(user.id, position).then(res => {
                    // console.log(res);
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
            });
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish(taskId);
}

// Register your BackgroundFetch HeadlessTask
// BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
