import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, Dimensions,TouchableOpacity } from 'react-native';
import {IMG_PREFIX_URL} from "../../config/constant";
import { Height } from '../../config/dimensions';
const { width, height } = Dimensions.get('window');

const StaticUsersView = (props) => {
	// debugger
	return (
		<View style={styleStaticUsersView.container}>
			{/* <View style={styleStaticUsersView.staticImages}> */}
			<View style={{ height: Height(7.5), width: Height(7.5), borderRadius: Height(7.5), overflow: 'hidden' }} >
				<Image
					resizeMode="cover"
					style={{ flex: 1, height: null, width: null }}
					// style={styleStaticUsersView.image}
					source={{uri:IMG_PREFIX_URL+ (props["profile_pictures"] != null ? props["profile_pictures"][0].profile_image : '')}}
				/>
			</View>
			
			<View style={{ height: Height(7.5), width: Height(7.5), borderRadius: Height(7.5), overflow: 'hidden' }} >
				<Image
					resizeMode="cover"
					style={{ flex: 1, height: null, width: null }}
					source={{uri:IMG_PREFIX_URL+ (props["profile_pictures"] != null ? props["profile_pictures"][1].profile_image : '')}}
				/>
			</View>
			<TouchableOpacity onPress={props.updateProfileImage} disabled={!props.profile}>
			<View style={{ height: Height(10), width: Height(10), borderRadius: Height(10), overflow: 'hidden' }} >
			  
			 {props.home ? <Image
					style={{ flex: 1, height: null, width: null }}
					source={{ uri: props.profile_picture }}
				/> :
				<Image
					style={{ flex: 1, height: null, width: null }}
					source={props.fromPicker=='' ? {uri: props.profile_picture} : {uri:props.fromPicker_uri}}
				/> 
			 }
				
				
			</View>
			</TouchableOpacity>
			
			<View style={{ height: Height(7.5), width: Height(7.5), borderRadius: Height(7.5), overflow: 'hidden' }} >
				<Image
					resizeMode="cover"
					style={{ flex: 1, height: null, width: null }}
					source={{uri:IMG_PREFIX_URL+ (props["profile_pictures"] != null ? props["profile_pictures"][2].profile_image : '')}}
				/>
			</View>
	
			<View style={{ height: Height(7.5), width: Height(7.5), borderRadius: Height(7.5), overflow: 'hidden' }} >
				<Image
					resizeMode="cover"
					style={{ flex: 1, height: null, width: null }}
					source={{uri:IMG_PREFIX_URL+ (props["profile_pictures"] != null ? props["profile_pictures"][3].profile_image : '')}}
				/>
			</View>
		</View>
	);
};

export default StaticUsersView;

const styleStaticUsersView = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		paddingVertical: 14,
		flex: 1,
		flexDirection: 'row',
		width:width+(width*0.1),
		marginLeft: -(width*0.05),
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	staticImages: {
		borderRadius: width * 0.03,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		borderRadius: width * 0.07,
		width: width * 0.12,
		height: width * 0.12,
	},
});
