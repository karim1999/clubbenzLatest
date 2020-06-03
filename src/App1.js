import React, {Component} from 'react';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import NavigationService from './NavigationService';
import { store, persistor } from './redux/create';
import RootNavigator from './RootNavigator';
import { View, Text, Linking } from 'react-native';

export default class App1 extends Component {

	constructor(props) {
        super(props)
	}
	
	componentDidMount() {
        Linking.getInitialURL().then((url) => {
            console.log(url)
        })
        Linking.addEventListener('url', this._handlerURL)
    }

    componentWillUnmount() {
        console.log('unmount')
		Linking.removeEventListener('url', this._handlerURL)
    }

    _handlerURL = (event) => {
        console.log('Fareed')
        console.log('hello' + event.url)
    }

	render() {
		return (
			// <Provider store={store}>
			// 	<PersistGate loading={null} persistor={persistor}>
			// 		<RootNavigator
			// 			ref={navigatorRef => {
			// 				NavigationService.setTopLevelNavigator(navigatorRef);
			// 			}}
			// 		/>
			// 	</PersistGate>
			// </Provider>
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text style={{fontSize: 30}}>Hello</Text>
			</View>
		);
	}

}