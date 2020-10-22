import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions, StatusBar, FlatList } from 'react-native';

import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
// import NavigationComponent from '../components/navigation/navigation';
import NavigationComponent from '../components/navigation/navWIthInput';
import Toast from "react-native-simple-toast";
import SplitHeading from '../components/common/splitHeading';
import CategoryItem from '../components/Category/CategoryItem';
import OtherCategory from '../components/Category/OtherCategory';
import * as partAction from "./../redux/actions/parts";

import { connect } from "react-redux";
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
import Header from '../components/NewHomeScreen/Header';

class CategoriesScreen extends Component {
	state = {
		categories: [],
		top_products: [],
		searchText: '',
	};
	componentDidMount() {
		this.partCategories();

	}
	partCategories = () => {
		this.setState({ categories: [] });
		this.setState({ top_products: [] });
		//console.log("chassis",this.props.navigation.state);
		partAction.partCategories({ chassis: this.props.navigation.state.params.chassis, search: '' })
			.then(res => {
			   //console.log(res);
				if (res.success) {
				    if(res.data)
					    this.setState({ categories: res.data });
				    if(res.top_products)
					    this.setState({ top_products: res.top_products });
				}
			})

	}

	openItem = (partItem) => {
		this.props.navigation.navigate('DetailScreen', { partItem: partItem })
		// alert(this.props.navigation.state.params.selected_car.model_text)
	}

	onSearch = (text) => {
		if (text != '' && text.length != 0) {
			this.partCategoriesList(text)
		} else {
			alert('Please Enter Some Key To Search');
		}
	}

	partCategoriesList = (text) =>{
		 var chassis_id = this.props.selected_car.car.chassis;
		 var search = text;
		 partAction.partCategoriesListData(search, chassis_id )
		   .then(res => {
			//    alert(JSON.stringify(res))
			// this.setState({ search: '' })
				this.props.navigation.navigate('PartSearchListScreen', {search: text, ItemList:res.shops, totalCount:res.total, language: this.props.language, preferences: this.props.preferences, chassis_id: this.props.selected_car.car.chassis});
			})
	 }

	render() {
		return (
			<View style={[styles.columnContainer]}>
				<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
				{/* <NavigationComponent title={this.props.navigation.state.params.selected_car.model} subTitle={this.props.navigation.state.params.selected_car.model_text}  goBack={() => this.props.navigation.goBack()} /> */}
				<Header
					homeButton={false}
					navigation={this.props.navigation}
					goBack={() => this.props.navigation.goBack()}
					title={__('Parts Catalogue', this.props.language)}
					placeholder={__('Search Parts Catalogue', this.props.language)}
					onSearch={this.onSearch}
					onSubmitEditing={this.onSearch}
				/>

				{/*<NavigationComponent*/}
				{/*	homeButton={false}*/}
				{/*	navigation={this.props.navigation}*/}
				{/*	goBack={() => this.props.navigation.goBack()}*/}
				{/*	placeholder={__('Search Parts Catalogue', this.props.language)}*/}
				{/*	onSearch={this.onSearch}*/}
				{/*	onSubmitEditing={this.onSearch}*/}
				{/*// onMapPress={this.onMapPress}*/}
				{/*/>*/}

				<View style={[styles.columnContainer, {marginTop: 120}]}>
					{this.state.top_products.length > 0 ?

						<View style={{ height: height * 0.20 }}>
							<Text style={{ textAlign: 'center', color: '#000', fontSize: 18, marginVertical: 15, fontFamily: Fonts.circular_book }}>{__('Common requested parts for this model', this.props.language)}</Text>
							<FlatList
								style={{ marginLeft: -10, alignSelf: 'flex-start' }}
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								data={this.state.top_products}
								renderItem={({ item }) => <CategoryItem
									item={item}
									onPress={(val) => this.openItem(val)}
									language={this.props.language}
								/>}
							/>

						</View> : null}
					<SplitHeading
						text={__('Explore all listed parts', this.props.language)}
						headingStyle={{ padding: 10, marginTop: 10 }}
						lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
						textColor={{ color: '#8E8E93', fontFamily: Fonts.CircularMedium, fontSize: 14 }}
					/>
					<ScrollView style={{ flexWrap: 'wrap', flex: 1, flexDirection: 'row', marginTop: 2.5 }}>
						<FlatList
							// data={[{name: 'Condenser',image:''},{name: 'Receiver Drier',image:''},{name: 'Air Conditioning Pipe',image:''},{name: 'Controls / Regulation',image:''},{name: 'Sensors',image:''},{name: 'Pressure Switch',image:''} ]}
							data={this.state.categories}
							numColumns={3}
							renderItem={({ item }) => <OtherCategory
								Item={item}
								onPress={() => this.props.navigation.navigate('CategoryListScreen', { categoryId: item.id, categoryName: this.props.language.isArabic == true ? item.arabic_name ? item.arabic_name : item.name : item.name, chassis_id: this.props.navigation.state.params.chassis })}
								language={this.props.language}
							/>}
						/>

					</ScrollView>
				</View>
			</View>
		);
	}
}

mapStateToProps = state => {
	return {
		language: state.language,
		selected_car: state.auth.selected_car,
		preferences: state.init.preferences,
	};
};

export default connect(mapStateToProps, null)(CategoriesScreen);

const styleCarPartsScreen = StyleSheet.create({
	carType: {
		width: metrics.deviceWidth - 13,
		marginTop: 1,
		marginLeft: 10,
	},
	carTypeText: {
		marginRight: width * 0.07,
		fontFamily: fonts.type.bold,
		fontSize: width * 0.15,
		color: colors.blueText,
		textAlign: 'center',
		// fontWeight: 'bold',
	},
	title: {
		fontFamily: fonts.type.base,
		fontSize: fonts.size.h14,
		color: colors.blueButton,
		textAlign: 'center',
		marginTop: 15,
	},
	subTitle: {
		fontFamily: fonts.type.base,
		fontSize: fonts.size.h14,
		color: colors.darkGray,
		textAlign: 'center',
		marginTop: 15,
	},
	btnStyle: {
		width: metrics.deviceWidth - 40,
		marginTop: 25,
		height: height * 0.15,
		borderRadius: width * 0.03,
		flexDirection: 'row',
	},
	continueBtnStyle: {
		width: metrics.deviceWidth - 40,
		marginTop: 25,
		marginBottom: 30,
	},
	bottomContainer: {
		flex: 1,
		flexDirection: 'column',
		marginTop: 15,
		height: metrics.deviceHeight - metrics.deviceHeight / 4,
		width: metrics.deviceWidth,
		borderColor: colors.black,
		borderWidth: 1,
		borderStyle: 'solid',
		borderTopEndRadius: metrics.radius15,
		borderTopStartRadius: metrics.radius15,
	},
	overlayLayer: {
		flex: 1,
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(14, 45, 59, 0.8)',
	},
});
