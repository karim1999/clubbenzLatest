import React from 'react';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import NavigationService from './NavigationService';
import { store, persistor } from './redux/create';
// import {NotificationListner} from './services/NotificationListner';
import RootNavigator from './RootNavigator';
import firebase from 'react-native-firebase';
import { Alert, AsyncStorage, Platform, Linking, AppState } from 'react-native';

import * as carAction from "./redux/actions/car_guide";
import NewHomeScreen from "./containers/NewHomeScreen";
import BackgroundFetch from "react-native-background-fetch";
import Geolocation from "react-native-geolocation-service";
import {scheduleNotification} from './redux/actions/workshops';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.navigate = this.navigate.bind(this)
	}

	// for deep linking
	_unsubscribeFromBranch = null

	state = {
		appState: AppState.currentState,
	};

	navigate = (url, value) => { // E
		if (url != null) {

			AsyncStorage.getItem('user').then((value) => {
				if (value != null) {

					const route = url.replace(/.*?:\/\//g, '');
					const id = route.match(/\/([^\/]+)\/?$/)[1];
					const routeName = route.split('/')[0];

					console.log(url)

					if (routeName === 'workshop') {
						AsyncStorage.setItem("workshopId", id);
						// debugger
						// if (!value) {
						// 	window.navigation.navigate('WorkshopDetailScreen', { preferences: this.props.preferences, language: this.props.language })
						// }
						// else if (value) {
						NavigationService.navigate('WorkshopDetailScreen', { preferences: this.props.preferences, language: this.props.language })
						// }
					} else if (routeName === 'serviceshop') {
						AsyncStorage.setItem("serviceShopId", id);
						if (!value) {
							window.navigation.navigate("ServicesDetailScreen", { preferences: this.props.preferences, language: this.props.language });
						} else if (value) {
							NavigationService.navigate("ServicesDetailScreen", { preferences: this.props.preferences, language: this.props.language });
						}
					} else if (routeName === 'partshop') {
						AsyncStorage.setItem("partShopId", id);
						if (!value) {
							window.navigation.navigate("PartShopDetailScreen", { preferences: this.props.preferences, language: this.props.language });
						} else if (value) {
							NavigationService.navigate("PartShopDetailScreen", { preferences: this.props.preferences, language: this.props.language });
						}
					} else if (routeName === 'parts') {
						var partItem = { id: id }
						// if (!value) {
						// 	window.navigation.navigate('DetailScreen', { partItem: partItem })
						// } else if (value) {
						NavigationService.navigate('DetailScreen', { partItem: partItem })
						// }
					} else if (routeName === 'cluster') {
						var error_id = route.split('/')[1];
						var chassis = route.split('/')[2];
						// debugger
						this.getClusterErrors(error_id, chassis, value);
					}

					console.log(url)
				}
			})

		}
	}

	_handleAppStateChange = (nextAppState) => {
		// console.log('curr state ' + this.state.appState + ' next state ' + nextAppState)
		if (
			this.state.appState.match(/inactive|background/) &&
			nextAppState === 'active'
		) {
			this._checkInitialUrl(false)
			//   console.log('App has come to the foreground!');
		} else if (this.state.appState === 'active' && nextAppState === 'active') {
			this._checkInitialUrl(true)
		} else if (this.state.appState === 'active' && nextAppState === 'background') {

		}

		this.setState({ appState: nextAppState });
	};

	_checkInitialUrl = async (value) => {
		const url = await this._getInitialUrl()
		if (value)
			this._handleUrl(url, value)
		else {
			this._handleUrl(url, value)
		}
	}

	_handleUrl = (url, value) => {
		this.navigate(url, value)
	}

	_getInitialUrl = async () => {
		const url = await Linking.getInitialURL()
		return url
	}

	componentDidMount() {

		firebase.links()
			.getInitialLink()
			.then((url) => {

				if (url) {
					this.returnShopOrCluster(url)
				}
			});

		this.dynamicLinksListener = firebase.links()
			.onLink((url) => {
				if (url) {
					this.returnShopOrCluster(url)
				}
			});

		// setting the navigate function to window to access in background mode

		window.navigate = this.navigate;
		// commenting for now but is important for deep linking (non-universal)
		// Linking.getInitialURL().then(url => {
		// 	debugger
		// 	if (url != null) {
		// 		this.navigate(url)
		// 		console.log(url)
		// 	}
		// });

		Linking.addEventListener('url', this._handleOpenURL);

		this.checkPermission();
		this.createNotificationListeners();
		Geolocation.requestAuthorization("always")
        BackgroundFetch.configure({
            minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
            // Android options
			enableHeadless: true,
			forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
            requiresCharging: false,      // Default
            requiresDeviceIdle: false,    // Default
            requiresBatteryNotLow: false, // Default
            requiresStorageNotLow: false  // Default
        }, async (taskId) => {
            // Required: Signal completion of your task to native code
            // If you fail to do this, the OS can terminate your app
            // or assign battery-blame for consuming too much background-time
						console.log("fetching......")
            Geolocation.watchPosition(
                (position) => {
                	console.log(position)
					AsyncStorage.getItem('user').then(userString => {
						let user= JSON.parse(userString)
						// console.log(user.id)
						scheduleNotification(user.id, position).then(res => {
							console.log(res);
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

            BackgroundFetch.finish(taskId);
        }, (error) => {
            console.log("[js] RNBackgroundFetch failed to start");
        });
        // Optional: Query the authorization status.
        BackgroundFetch.status((status) => {
            switch(status) {
                case BackgroundFetch.STATUS_RESTRICTED:
                    console.log("BackgroundFetch restricted");
                    break;
                case BackgroundFetch.STATUS_DENIED:
                    console.log("BackgroundFetch denied");
                    break;
                case BackgroundFetch.STATUS_AVAILABLE:
                    console.log("BackgroundFetch is enabled");
                    break;
            }
        });
				BackgroundGeolocation.configure({
					desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
					stationaryRadius: 50,
					distanceFilter: 50,
					notificationTitle: 'Background tracking',
					notificationText: 'enabled',
					debug: false,
					startOnBoot: false,
					notificationsEnabled: false,
					startForeground: true,
					stopOnTerminate: false,
					locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
					interval: 10000,
					fastestInterval: 5000,
					activitiesInterval: 10000,
					stopOnStillActivity: false,
				});

BackgroundGeolocation.on('location', (location) => {
	console.log(location);
	// handle your locations here
	// to perform long running operation on iOS
	// you need to create background task
	BackgroundGeolocation.startTask(async (taskKey) => {
		console.log(taskKey);
		console.log(location)
await AsyncStorage.getItem('user').then(async (userString) => {
let user= JSON.parse(userString)
// console.log(user.id)
await scheduleNotification(user.id, {coords: location}).then(res => {
console.log(res);
}).catch(err => {
console.log(err)
})
}).catch(err => {
});
		// execute long running task
		// eg. ajax post location
		// IMPORTANT: task has to be ended by endTask
		BackgroundGeolocation.endTask(taskKey);
	});
});

BackgroundGeolocation.on('stationary', (stationaryLocation) => {
	// handle stationary locations here
	// Actions.sendLocation(stationaryLocation);
});

BackgroundGeolocation.on('error', (error) => {
	console.log('[ERROR] BackgroundGeolocation error:', error);
});

BackgroundGeolocation.on('start', () => {
	console.log('[INFO] BackgroundGeolocation service has been started');
});

BackgroundGeolocation.on('stop', () => {
	console.log('[INFO] BackgroundGeolocation service has been stopped');
});

BackgroundGeolocation.on('authorization', (status) => {
	console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
	if (status !== BackgroundGeolocation.AUTHORIZED) {
		// we need to set delay or otherwise alert may not be shown
		setTimeout(() =>
			Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
				{ text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
				{ text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
			]), 1000);
	}
});

BackgroundGeolocation.on('background', () => {
	console.log('[INFO] App is in background');
});

BackgroundGeolocation.on('foreground', () => {
	console.log('[INFO] App is in foreground');
});

BackgroundGeolocation.on('abort_requested', () => {
	console.log('[INFO] Server responded with 285 Updates Not Required');

	// Here we can decide whether we want stop the updates or not.
	// If you've configured the server to return 285, then it means the server does not require further update.
	// So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
	// But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
});

BackgroundGeolocation.on('http_authorization', () => {
	console.log('[INFO] App needs to authorize the http requests');
});

BackgroundGeolocation.checkStatus(status => {
	console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
	console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
	console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

	// you don't need to check status before start (this is just the example)
	if (!status.isRunning) {
		BackgroundGeolocation.start(); //triggers start on start event
	}
});

	}

	returnShopOrCluster = (url) => {

		AsyncStorage.getItem('user').then((value) => {
			if (value != null) {
				const tokenizd = url.split('/');
				debugger
				if (tokenizd[3] && (tokenizd[3] === 'serviceshop' || tokenizd[3] === 'partshop' || tokenizd[3] === 'workshop')) {
					// this is a shop
					this.navigateToShop(tokenizd[3], tokenizd[4]);
				} else if (tokenizd[3] === 'cluster') {
					// this is a cluster error
					this.getClusterErrors(tokenizd[4], tokenizd[5])
				}
			}
		})
	}

	navigateToShop = (shop, id) => {
		if (shop === 'workshop') {
			AsyncStorage.setItem("workshopId", id);
			if (NavigationService && NavigationService.navigate)
				NavigationService.navigate('WorkshopDetailScreen', { preferences: this.props.preferences, language: this.props.language })
			else
				window.navigation.navigate('WorkshopDetailScreen', { preferences: this.props.preferences, language: this.props.language })
		} else if (shop === 'partshop') {
			AsyncStorage.setItem("partShopId", id);
			if (NavigationService && NavigationService.navigate)
				NavigationService.navigate("PartShopDetailScreen", { preferences: this.props.preferences, language: this.props.language });
			else
				window.navigation.navigate("PartShopDetailScreen", { preferences: this.props.preferences, language: this.props.language });
		} else if (shop === 'serviceshop') {
			AsyncStorage.setItem("serviceShopId", id);
			if (NavigationService && NavigationService.navigate)
				NavigationService.navigate("ServicesDetailScreen", { preferences: this.props.preferences, language: this.props.language });
			else
				window.navigation.navigate("ServicesDetailScreen", { preferences: this.props.preferences, language: this.props.language });
		}
	}

	getClusterErrors = (error_id, chassis, value) => {
		carAction.get_Cluster_error({ chassis: chassis })
			.then(res => {
				if (res.success) {
					var errorList = res.data;
					var error = {}
					for (var obj of errorList) {
						if (obj.id == error_id) {
							error = obj;
							if (NavigationService && NavigationService.navigate) {
								NavigationService.navigate('ClusterErrorSolutionsScreen',
									{
										errorDetail: error,
										token: '',
										title: '',
										chassis: chassis,
										fromShare: true,
									}
								)
							} else {
								window.navigation.navigate('ClusterErrorSolutionsScreen',
									{
										errorDetail: error,
										token: '',
										title: '',
										chassis: chassis,
										fromShare: true,
									}
								)
							}

						}
					}
				}
			})
	}

	componentWillUnmount() {
		BackgroundGeolocation.removeAllListeners();

		Linking.removeEventListener('url', this._handleOpenURL);

		this.notificationListener();
		this.notificationOpenedListener();
	}

	_handleOpenURL(event) {
		// commenting for now but is important for deep linking
		// debugger
		// window.navigate(event.url)
		// console.log(NavigationService);
	}

	async createNotificationListeners() {
		/*
		* Triggered when a particular notification has been received in foreground
		* */
		debugger
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			const value = notification.data;
			// alert("onNotification")

			var result = [];
			var keys = Object.keys(value);

			keys.forEach(function (key) {
				result.push(value[key]);
			});
			debugger
			const shop_type = result[2];
			const shop_id = result[0];

			// alert(result)

			const Notification = {
				"shop_type": shop_type,
				"shop_id": shop_id
			}

			debugger

			AsyncStorage.setItem('Notification', JSON.stringify(Notification))

			console.log('This is notification from firebase')

			const { title, body } = notification;

			const foregroundNotification = new firebase.notifications.Notification()
				.setNotificationId(notification.notificationId)
				.setTitle(notification.title)
				.setBody(notification.body)
				.setData({
					key1: 'value1',
					key2: 'value2',
				})
				.setSound("default");

			// debugger

			foregroundNotification
				.android.setChannelId(notification.notificationId + '')
				.android.setSmallIcon('ic_launcher')
				.android.setPriority(firebase.notifications.Android.Priority.High)
				.android.setAutoCancel(true);

			// Build a channel
			const channelId = new firebase.notifications.Android.Channel(notification.notificationId + '', 'Clubbenz Notification', firebase.notifications.Android.Importance.Max);

			// Create the channel
			firebase.notifications().android.createChannel(channelId);

			// debugger

			firebase.notifications().displayNotification(foregroundNotification)
		});

		/*
		* If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		* */


		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			debugger
			const { title, body } = notificationOpen.notification;

			var shop_type;
			var shop_id;
			// alert("onNotificationOpened")

			if (notificationOpen.notification.data.key1){
				AsyncStorage.getItem('Notification').then((value) => {
					if (value != null) {
						shop_type = JSON.parse(value).shop_type;
						shop_id = JSON.parse(value).shop_id;
						if (shop_type === "partsshop") {
							AsyncStorage.setItem("partShopId", shop_id);
							NavigationService.navigate("PartShopDetailScreen", { preferences: this.props.preferences, language: this.props.language });
						} else if (shop_type === "workshop") {
							AsyncStorage.setItem("workshopId", shop_id);
							NavigationService.navigate("WorkshopDetailScreen", { preferences: this.props.preferences, language: this.props.language })
						} else if (shop_type === "serviceshop") {
							AsyncStorage.setItem("serviceShopId", shop_id);
							NavigationService.navigate("ServicesDetailScreen", { preferences: this.props.preferences, language: this.props.language });
						}
					}
				})
			} else {
				const value = notificationOpen.notification.data;

				result = [];
				keys = Object.keys(value);

				keys.forEach(function (key) {
					result.push(value[key]);
				});

				shop_type = result[2];
				shop_id = result[4];

				if (shop_type === "partsshop") {
					AsyncStorage.setItem("partShopId", shop_id);
					NavigationService.navigate("PartShopDetailScreen", { preferences: this.props.preferences, language: this.props.language });
				} else if (shop_type === "workshop") {
					AsyncStorage.setItem("workshopId", shop_id);
					NavigationService.navigate("WorkshopDetailScreen", { preferences: this.props.preferences, language: this.props.language })
				} else if (shop_type === "serviceshop") {
					AsyncStorage.setItem("serviceShopId", shop_id);
					NavigationService.navigate("ServicesDetailScreen", { preferences: this.props.preferences, language: this.props.language });
				}
			}

		});

		/*
		* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		* */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			// alert(JSON.stringify(notificationOpen.notification))
			var shop_type;
			var shop_id;
			const { title, body } = notificationOpen.notification;
			if (notificationOpen.notification.data.key1){
				AsyncStorage.getItem('Notification').then((value) => {
					if (value != null) {
						shop_type = JSON.parse(value).shop_type;
						shop_id = JSON.parse(value).shop_id;
					}
				})
			} else {
				const value = notificationOpen.notification.data;
				debugger
				var result = [];
				var keys = Object.keys(value);

				keys.forEach(function (key) {
					result.push(value[key]);
				});

				shop_type = result[2];
				shop_id = result[4];
			}




			if (shop_type === "partsshop") {
				AsyncStorage.setItem("partShopId", shop_id);
				if (NavigationService && NavigationService.navigate)
					NavigationService.navigate("PartShopDetailScreen", { preferences: this.props.preferences, language: this.props.language });
				else
					window.navigation.navigate("PartShopDetailScreen", { preferences: this.props.preferences, language: this.props.language });
			} else if (shop_type === "workshop") {
				AsyncStorage.setItem("workshopId", shop_id);
				if (NavigationService && NavigationService.navigate)
					NavigationService.navigate("WorkshopDetailScreen", { preferences: this.props.preferences, language: this.props.language })
				else
					window.navigation.navigate("WorkshopDetailScreen", { preferences: this.props.preferences, language: this.props.language })
			} else if (shop_type === "serviceshop") {
				AsyncStorage.setItem("serviceShopId", shop_id);
				if (NavigationService && NavigationService.navigate)
					NavigationService.navigate("ServicesDetailScreen", { preferences: this.props.preferences, language: this.props.language });
				else
					window.navigation.navigate("ServicesDetailScreen", { preferences: this.props.preferences, language: this.props.language });
			}



		}

		/*
		* Triggered for data only payload in foreground
		* */
		this.messageListener = firebase.messaging().onMessage((message) => {
			//process data message

			AsyncStorage.setItem("Notification", JSON.stringify(message.data));

			console.log('Foreground')
			console.log(JSON.stringify(message));
		});

	}

	showAlert(title, body) {
		Alert.alert(
			title, body,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
			{ cancelable: false },
		);
	}

	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<RootNavigator
						ref={navigatorRef => {
							NavigationService.setTopLevelNavigator(navigatorRef);
						}}
					/>
					{/*<NewHomeScreen />*/}
				</PersistGate>
			</Provider>
		);
	}

	async checkPermission() {
		const enabled = await firebase.messaging().hasPermission();
		if (enabled) {
			this.getToken();
		} else {
			this.requestPermission();
		}
	}

	async getToken() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
			if (fcmToken) {
				// user has a device token
				await AsyncStorage.setItem('fcmToken', fcmToken);
			}
		}
	}

	async requestPermission() {
		try {
			await firebase.messaging().requestPermission();
			// User has authorised
			this.getToken();
		} catch (error) {
			// User has rejected permissions
			console.log('permission rejected');
		}
	}
}
