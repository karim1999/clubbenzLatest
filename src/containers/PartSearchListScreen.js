import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import ListItem from '../components/list/ListItem';
import { styles, colors } from '../themes';
const { height, width } = Dimensions.get('window');
import NavigationService from "../NavigationService";
import NavigationComponent from '../components/navigation/navWIthInput';
import * as partAction from "./../redux/actions/parts";

class PartSearchListScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ItemList: this.props.navigation.state.params.ItemList,
    }
  }

  onSearch = (text) => {
    if (text != '' && text.length != 0) {
      this.partCategoriesList(text);
    } else {
      alert('Please Enter Some Key To Search');
    }
  }

  openItem = (partItem) => {
    this.props.navigation.navigate('DetailScreen', { partItem: partItem });
  }

  ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>

        <Text style={{ textAlign: 'center' }}> Sorry, No Data Present</Text>

      </View>

    );
  }

  partCategoriesList = (text) => {
    var chassis_id = this.props.navigation.state.params.chassis_id;
    var search = text;
    this.setState({ ItemList: [] })
    partAction.partCategoriesListData(search, chassis_id)
      .then(res => {
        // debugger
        this.setState({ ItemList: res.shops })
      })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationComponent
            navigation={this.props.navigation}
            goBack={() => NavigationService.goBack()}
          placeholder={this.props.navigation.state.params.search}
          onSearch={this.onSearch}
          onSubmitEditing={this.onSearch}
          showText={true}
          notClear={true}
        // onMapPress={this.onMapPress}
        />
        <View>
          <FlatList
            data={this.state.ItemList}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item, index }) => (
              <ListItem item={item} index={index} onPress={this.openItem} language={this.state.ItemList.length} preferences={this.props.navigation.state.params.preferences} />
            )}
            ListFooterComponent={this._renderFooter}
            ListEmptyComponent={this.ListEmptyView}
          />
        </View>
      </View>

    );
  }

}

export default PartSearchListScreen;
