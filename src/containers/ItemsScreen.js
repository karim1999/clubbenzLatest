import React, { PureComponent } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	Dimensions,
	FlatList,
	StatusBar,
} from 'react-native';

import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
// import NavigationComponent from '../components/navigation/navWIthInput';
import NavigationComponent from '../components/navigation/navigation';
import BrandItem from '../components/list/BrandItem';
import AllItemScreen from './AllItemScreen';
import NewItemScreen from './NewItemScreen';
import UsedItemScreen from './UsedItemScreen';
import * as partAction from "./../redux/actions/parts";

import { connect } from "react-redux";
import { Fonts } from '../resources/constants/Fonts';

import __ from '../resources/copy';
class ItemsScreen extends PureComponent {
	state = {
		focus: 1,
		selectBrand:'',
		type:'',
		ItemList:[],
		start:0,
		loadMoreEnable:false,
		totalCount:0,
		newBrands: [],
		usedBrands: [],
		defaultBrand:  [
			{
				"id": "2",
				"image": "",
				"name": __('All', this.props.language),
				// "name": "All",
				"arabic_name": ""
			}
		],
		parts_brand: [
			{
				"id": "2",
				"image": "",
				"name": __('All', this.props.language),
				// "name": "All",
				"arabic_name": ""
			},
			{
			  "id": "3",
			  "image": "1556655320MERCEDES-BENZ.jpg",
			  "name": "MERCEDES-BENZ",
			  "arabic_name": "MERCEDES-BENZ"
			},
			{
			  "id": "4",
			  "image": "15566552621553841587FERODO.jpg",
			  "name": "Fredo",
			  "arabic_name": "Fredo"
			},
			{
			  "id": "5",
			  "image": "1552773161Bosch.jpg",
			  "name": "Bosch",
			  "arabic_name": "Bosch"
			},
			{
			  "id": "6",
			  "image": "1552773193Febi.jpg",
			  "name": "Febi",
			  "arabic_name": "Febi"
			},
			{
			  "id": "7",
			  "image": "1552773228BERU.jpg",
			  "name": "BERU",
			  "arabic_name": "BERU"
			},
			{
			  "id": "8",
			  "image": "1552773272Sachs.jpg",
			  "name": "Sachs",
			  "arabic_name": "Sachs"
			},
			{
			  "id": "9",
			  "image": "1552773302Behr.jpg",
			  "name": "Behr",
			  "arabic_name": "Behr"
			},
			{
			  "id": "10",
			  "image": "1552773331ATe.jpg",
			  "name": "Ate",
			  "arabic_name": "Ate"
			},
			{
			  "id": "11",
			  "image": "1552825570SWAG.jpg",
			  "name": "SWAG",
			  "arabic_name": "SWAG"
			},
			{
			  "id": "12",
			  "image": "1552825604MEYLE.jpg",
			  "name": "MEYLE",
			  "arabic_name": "MEYLE"
			},
			{
			  "id": "13",
			  "image": "1552825632Valeo.jpg",
			  "name": "VALEO",
			  "arabic_name": "VALEO"
			},
			{
			  "id": "14",
			  "image": "1552825678TRUCKTEC.jpg",
			  "name": "TRUCKTEC",
			  "arabic_name": "TRUCKTEC"
			}
		  ],
	};

	componentDidMount = () => {
		//console.log("preferences:",this.props.preferences);
		this.partCategoriesList('').then(res => {
			let newBrands= [...this.state.defaultBrand];
			let usedBrands= [...this.state.defaultBrand];
			this.props.preferences.parts_brand.map(brand => {
				let isNew = false;
				let isUsed= false;
				res.shops.map(shop => {
					if(shop.part_brand[0].id == brand.id){
						if(shop.part_case == "Used")
							isUsed= true
						if(shop.part_case == "New")
							isNew= true
					}
				})
				if(isNew)
					newBrands.push(brand)
				if(isUsed)
					usedBrands.push(brand)
			})
			this.setState({newBrands})
			console.log("newBrands:",newBrands);
			this.setState({usedBrands})
			console.log("usedBrands:",usedBrands);
		});
	}

	partCategoriesList = (text) =>{
			// debugger
		   //var sub_category = 22;
			//alert(this.props.navigation.state.params.SubCategoryId);
			// alert(text)
			var sub_category = this.props.navigation.state.params.SubCategoryId;
			var type = this.state.type;
			var brand_id = this.state.selectBrand;
			var chassis_id = this.props.navigation.state.params.chassis_id ;
			var search = text;
			var start = this.state.start;
			this.setState({ItemList:[] , loadMoreEnable:false});
			return partAction.partCategoriesList(sub_category,search, type ,brand_id ,start,chassis_id, this.props.user.phone )
			  .then(res => {
					// alert(JSON.stringify(res.shops))
					// debugger
					// var arr = []

					// var temp = res.shops[0]

					// arr.push(temp)
					// arr.push(temp)
					// arr.push(temp)
					// arr.push(temp)
					// arr.push(temp)
					// arr.push(temp)

					 this.setState({ItemList:res.shops , totalCount:res.total});
					 if(res.total > 10 ){
               this.setState({loadMoreEnable:true});
					 }
					 return res;
			  })
		}

	onLoadMore = () => {
			const self = this;
			this.setState(prevState => ({start: parseInt(prevState.start)+ parseInt(10)}),() => {
				// if(parseInt(self.state.start) > parseInt(self.state.totalCount)){
				// 	self.setState({loadMoreEnable:false})
				// }
				var sub_category = self.props.navigation.state.params.SubCategoryId;
				var type = self.state.type;
				var brand_id = self.state.selectBrand;
				var chassis_id = self.props.navigation.state.params.chassis_id ;
				var search = "";
				var start = self.state.start;
//				alert(start)
				partAction.partCategoriesList(sub_category,search, type ,brand_id ,start, chassis_id )
					.then(res => {
						// alert("ItemsScreen")
						let data = [...self.state.ItemList, ...res.shops];
						self.setState({ItemList:data});
					})
			});

		}

	onChangeBrand = (item) => {
		const self = this;
		var parts_brand = this.props.preferences.parts_brand.map(function(el) {
			var BrandItem = Object.assign({}, el);
				if(BrandItem.id == item.id ){
					BrandItem.isActive = true;
				} else {

						BrandItem.isActive = false;
				}
				if (item.id == 2 && BrandItem.id == 2)
					BrandItem.isActive = true

			return BrandItem;
			})
			if (item.id == 2) {
				this.setState({ selectBrand: '' });
				this.setState({parts_brand});
				setTimeout(function(){ self.partCategoriesList(''); }, 500);
			} else {
				this.setState({selectBrand:item.id ,  totalCount:0  , start:0 });
				this.setState({parts_brand});
				setTimeout(function(){ self.partCategoriesList(''); }, 500);
			}
	}

	opnItem = (partItem) => {
		this.props.navigation.navigate('DetailScreen' , {partItem:partItem})
	}

	selectedOption = (option) => {
		const self = this;
		self.setState({ItemList:[] , totalCount:0 , selectBrand:'', start:0});

		var parts_brand = this.props.preferences.parts_brand.map(function(el) {
			var BrandItem = Object.assign({}, el);
			BrandItem.isActive = false;
			return BrandItem;
		  })
		var type = '';
		if(option == 1){
			type = '';
		}else if (option == 2){
			type = 'New';
		}else{
			type = 'Used';
		}
	    this.setState({type:type});
        this.setState({parts_brand});
		this.setState({ focus: option });
		setTimeout(function(){ self.partCategoriesList(''); }, 500);
	};

	renderScreen() {
		if (this.state.focus === 1) {
			return <AllItemScreen navigation={this}  ItemList={this.state.ItemList} onPress={(val) => this.opnItem(val)}  onLoadMore={this.onLoadMore.bind(this)}  loadMoreEnable={this.state.loadMoreEnable} language={this.props.language} preferences={this.props.preferences} />;
		} else if (this.state.focus === 2) {
			// debugger
			return <NewItemScreen navigation={this} ItemList={this.state.ItemList}  onPress={(val) => this.opnItem(val)}  onLoadMore={this.onLoadMore.bind(this)}  loadMoreEnable={this.state.loadMoreEnable} language={this.props.language} preferences={this.props.preferences} />;
		} else {
			// debugger
			if (this.state.ItemList[0] != null)
				return <UsedItemScreen navigation={this} ItemList={this.state.ItemList} onPress={(val) => this.opnItem(val)} onLoadMore={this.onLoadMore.bind(this)}  loadMoreEnable={this.state.loadMoreEnable} language={this.props.language} preferences={this.props.preferences} />;
		}
	}

	onSearch = (text)=>{
    if (text.length > 0)
      this.partCategoriesList(text)
    else
      alert('Please Enter Some Key To Search');
  }
  uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
	removeDuplicates(arr1, arr2) {
		let myArr= [...arr1, ...arr2];
		if(!myArr[0])
			return []
		var props = Object.keys(myArr[0])
		return myArr.filter((item, index, self) =>
			index === self.findIndex((t) => (
				props.every(prop => {
					return t[prop] === item[prop]
				})
			))
		)
	}
	render() {
		const { focus } = this.state;
		return (
			<View style={[styles.columnContainer, { backgroundColor: '#E1E4E6' }]}>
				<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
				{/* <NavigationComponent title={this.props.navigation.state.params.SubCategoryName} rightIcon goBack={() => this.props.navigation.goBack()} /> */}
				{/* <NavigationComponent title={"Test Nav"} rightIcon goBack={() => this.props.navigation.goBack()} /> */}

				{/* <NavigationComponent
          goBack={() => this.props.navigation.goBack()}
          placeholder={this.props.navigation.state.params.SubCategoryName}
          onSearch={this.onSearch}
					onSubmitEditing={this.onSearch}
          // onMapPress={this.onMapPress}
				/> */}

				<NavigationComponent
					navigation={this.props.navigation}

					goBack={() => this.props.navigation.goBack()}
					title={this.props.navigation.state.params.SubCategoryName}
				/>

				<View
					style={{
						backgroundColor: '#fff',
						flexDirection: 'row',
						marginTop: 10,
						marginHorizontal: width * 0.07,
						borderRadius: width * 0.05,
					}}
				>
					<TouchableWithoutFeedback
						onPress={() => {
							this.selectedOption(1)
						}}
					>
						<View
							style={{
								height: 30,
								backgroundColor: focus === 1 ? colors.blueText : '#fff',
								alignSelf: 'stretch',
								alignItems: 'center',
								justifyContent: 'center',
								paddingVertical: 5,
								borderRadius: width * 0.05,
								flex: 1,
								marginLeft: width * 0.01,
							}}
						>
							<Text
								style={{
									justifyContent: 'center',
									color: focus === 1 ? '#fff' : colors.blueText,
									fontSize: width * 0.032,
									fontFamily: Fonts.CircularBlack,
								}}
							>
								{__('All', this.props.language)}
							</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback
						onPress={() => {
							this.selectedOption(2)
						}}
					>
						<View
							style={{
								backgroundColor: focus === 2 ? colors.blueText : '#fff',
								alignSelf: 'stretch',
								alignItems: 'center',
								justifyContent: 'center',
								paddingVertical: 5,
								borderRadius: width * 0.05,
								flex: 1,
								marginLeft: width * 0.01,
							}}
						>
							<Text
								style={{
									color: focus === 2 ? '#fff' : colors.blueText,
									fontSize: width * 0.032,
									fontFamily: Fonts.CircularBlack,
								}}
							>
								{__('New', this.props.language)}
							</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback
						onPress={() => {
							this.selectedOption(3)
						}}
					>
						<View
							style={{
								backgroundColor: focus === 3 ? colors.blueText : '#fff',
								alignSelf: 'stretch',
								alignItems: 'center',
								justifyContent: 'center',
								paddingVertical: 5,
								borderRadius: width * 0.05,
								flex: 1,
								marginHorizontal: width * 0.01,
							}}
						>
							<Text
								style={{
									color: focus === 3 ? '#fff' : colors.blueText,
									fontSize: width * 0.032,
									fontFamily: Fonts.CircularBlack,
								}}
							>
								{__('Used', this.props.language)}
							</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>

				<View style={{alignItems: 'flex-start'}}>
					{/*<ScrollView horizontal showsHorizontalScrollIndicator={false}>*/}
					<FlatList
					    horizontal={true}
						data={this.state.focus == 1 ? this.removeDuplicates(this.state.newBrands, this.state.usedBrands) : this.state.focus == 2 ? this.state.newBrands : this.state.usedBrands}
						keyExtractor={(item, index) => item.id}
						renderItem={({ item, index }) => (
							<BrandItem item={item} index={index} onPress={(item) => this.onChangeBrand(item) } length={this.props.preferences.parts_brand.length} />
						)}
						// ListFooterComponent={this._renderFooter}
					/>
					{/*</ScrollView>*/}
				</View>
				<View style={{ flex: 1, }}>{this.renderScreen()}</View>
			</View>
		);
	}
}

mapStateToProps = state => {
	return {
		user: state.auth.user,
		language: state.language,
		preferences: state.init.preferences,
	};
};

export default connect(mapStateToProps, null)(ItemsScreen);

const styleCategoriesScreen = StyleSheet.create({});
