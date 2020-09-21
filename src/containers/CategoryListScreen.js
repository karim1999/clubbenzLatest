import React, { PureComponent } from 'react';
import { View, StyleSheet, ScrollView,  Dimensions, StatusBar , FlatList } from 'react-native';

import { styles, colors } from '../themes';
import NavigationComponent from '../components/navigation/navigation';
import SubCategory from '../components/Category/SubCategory';
import * as partAction from "./../redux/actions/parts";

import { connect } from "react-redux";

class CategoryListScreen extends PureComponent {
	state = {
		subCategories:[]
	};

	constructor(props) {
		super(props);
		console.log(this.props);
		this.partSubCategories();
		// debugger;
	}

	onCarOptionPress = () => {};

	partSubCategories = () =>{
		partAction.partSubCategories({id:this.props.navigation.state.params.categoryId, chassis_id: this.props.navigation.state.params.chassis_id, phone: this.props.user.phone})
		.then(res => {
			    console.log(res);
			if (res.success) {

               this.setState({subCategories:res.data});
			}
			//  else {
			// //   Toast.show(res.message, Toast.LONG);
			// }
		  })


	}

	render() {
		return (
			<View style={[styles.columnContainer]}>
				<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
				<NavigationComponent	navigation={this.props.navigation}
														title={this.props.navigation.state.params.categoryName}  goBack={() => this.props.navigation.goBack()} />
				<ScrollView>
				<FlatList
							// data={[{name: 'Condenser',image:''},{name: 'Receiver Drier',image:''},{name: 'Air Conditioning Pipe',image:''},{name: 'Controls / Regulation',image:''},{name: 'Sensors',image:''},{name: 'Pressure Switch',image:''} ]}
							data={this.state.subCategories }
							renderItem={({item}) => <SubCategory
							Item={item}
							onPress={() => item.parts > 0 ?
								this.props.navigation.navigate('ItemsScreen',{SubCategoryName: this.props.language.isArabic == true ? item.arabic_name ? item.arabic_name : '' : item.name , SubCategoryId:item.id, language: this.props.language ,chassis_id: this.props.navigation.state.params.chassis_id}) : null}
							language={this.props.language}
						/>}
							/>



				</ScrollView>
			</View>
		);
	}
}

mapStateToProps = state => {
	return {
		user: state.auth.user,
	  language: state.language,
	};
  };

export default connect(mapStateToProps, null)(CategoryListScreen);

const styleCategoriesScreen = StyleSheet.create({});
