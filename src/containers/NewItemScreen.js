import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import ListItem from '../components/list/ListItem';
import { styles, colors } from '../themes';
const { height, width } = Dimensions.get('window');
class NewItemScreen extends PureComponent {
	ListEmptyView = () => {
		// alert(JSON.stringify(this.props.ItemList))
		// debugger
		return (
		  <View style={styles.MainContainer}>

			<Text style={{textAlign: 'center'}}> Sorry, No Data Present</Text>

		  </View>
		);
	  }
	render() {
		return (
			<View style={styleNewItemScreen.container}>
				<View style={{ flex: 6 }}>
					<FlatList
						onEndReached={this.props.onLoadMore}
						onEndReachedThreshold={.1}
								data={this.props.ItemList}
								keyExtractor={(item, index) => item.id}
								renderItem={({ item, index }) => (
									<ListItem item={item} index={index} onPress={ this.props.onPress } language={this.props.language} length={this.props.ItemList.length} preferences={this.props.preferences} />
								)}
								ListFooterComponent={this._renderFooter}
							/>
				</View>
				{/*{this.props.loadMoreEnable ?	<View style={{ flex: 1.15 }}>*/}
				{/*	<View*/}
				{/*		style={{*/}
				{/*			flexDirection: 'row',*/}
				{/*			justifyContent: 'center',*/}
				{/*			alignItems: 'center',*/}
				{/*			marginVertical: height * 0.015,*/}
				{/*		}}*/}
				{/*	>*/}
				{/*<TouchableOpacity onPress={this.props.onLoadMore}>*/}
				{/*			<View*/}
				{/*				style={[*/}
				{/*					styles.tapableButton,*/}
				{/*					{*/}
				{/*						paddingHorizontal: width * 0.3,*/}
				{/*						backgroundColor: 'transparent',*/}
				{/*						borderColor: colors.blueText,*/}
				{/*						borderWidth: 1,*/}
				{/*					},*/}
				{/*				]}*/}
				{/*			>*/}
				{/*				<Text style={styles.tapButtonStyleTextBlue}>{__('Load more' , this.props.language)}</Text>*/}
				{/*			</View>*/}
				{/*		</TouchableOpacity>*/}
				{/*	</View>*/}
				{/*</View> : null}*/}
			</View>
		);
	}
}
export default NewItemScreen;
const styleNewItemScreen = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: -10,
	},
});
