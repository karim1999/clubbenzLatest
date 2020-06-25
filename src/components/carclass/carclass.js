import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { colors, fonts, metrics, styles } from '../../themes';
import { IMG_PREFIX_URL } from '../../config/constant';
import { Fonts } from '../../resources/constants/Fonts';
import {bindActionCreators} from 'redux';
import {updateUser} from '../../redux/actions/auth';
import {connect} from 'react-redux';

const { height, width } = Dimensions.get('window');
class CarClass extends PureComponent {
	constructor(props) {
		super(props);
		this.carClassSelected = this.carClassSelected.bind(this);
	}
	carClassSelected() {}

	render() {
		const item = this.props.item
		return (
			<TouchableOpacity style={[this.props.item.selected && {  borderRadius: 4,borderBottomWidth : 0.5,borderColor: colors.blueText  }]} onPress={() => this.props.onPress ? this.props.onPress(item): ""}>
			<View>
				<View style={[ {width: this.props.selectionResult ? 150 : 200 },CarClassStyle.classContainer]}>
					<Text style={[ CarClassStyle.title, this.props.item.selected || this.props.selected ? { color: colors.navgationBar } : {color : 'rgba(14,45,60, 0.2)'} , {fontSize: this.props.selectionResult ? fonts.size.h2 : fonts.size.h1}, {marginTop: 15}]}>
						{this.props.language.isArabic ? item.arabic_name : item.name}
					</Text>
					<View style={[this.props.item.selected || this.props.selected ? { flex: 1, width: '100%', opacity: 1} : { flex: 1, width: '100%', opacity: 0.4 }]}>
						<Image
							style={CarClassStyle.classImage}
							source={{uri:IMG_PREFIX_URL+item.image}}
						/>
					</View>
				</View>
			</View>
		</TouchableOpacity>
		);
	}
}
mapStateToProps = (state) => {
	return {
		language: state.language,
	}
}

export default connect(mapStateToProps, {})(CarClass)

CarClass.propTypes = {
	title: PropTypes.string,
	carImage: PropTypes.string,
};

const CarClassStyle = StyleSheet.create({
	title: {
		textAlign: 'center',
		fontFamily: Fonts.CircularBold,
		color: colors.overlayLayer,
	},
	classImage: {
		flex: 1,
		resizeMode: 'contain',
		height: null,
		width: null,
	},

	classContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: width * 0.05,
		height: height * 0.18,
	},
});
