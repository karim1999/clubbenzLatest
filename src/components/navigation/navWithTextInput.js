import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, StyleSheet, View, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import { colors, fonts, metrics, styles } from '../../themes';
import moduleName from 'react-native-vector-icons/';
import { Fonts } from '../../resources/constants/Fonts';

const { height, width } = Dimensions.get('window');


class NavTextInput extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        searchText: ""
    }



    onTextChange = (value) => {
        this.setState({
            searchText: value
        })
        this.props.onChangeText(value);
    }

    render() {
        return (
            <View>
                <View style={styles.navigationComponent}>
                    {this.props.menuIcon ? (
                        <TouchableWithoutFeedback onPress={this.props.onMenuPress}>
                            <View style={navigationStyle.leftContainer}>
                                <Image
                                    style={styles.navigationMenuButton}
                                    source={require('../../resources/icons/ic_menu.png')}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    ) : (
                            <TouchableWithoutFeedback onPress={this.props.goBack}>
                                <View style={navigationStyle.leftContainer}>
                                    <Image
                                        style={{height:32,width:32}}
                                        resizeMode="contain"
                                        source={require('../../resources/images/ic-back.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    <View style={navigationStyle.title}>
                        <View style={navigationStyle.inputWrapper}>


                            <TextInput
                                style={navigationStyle.textInput}
                                placeholder={this.props.text}
                                onChangeText={(value) => this.props.onTextChange(value)}
                                value={this.state.email}
                            />

                            <TextInput
                            />
                        </View>
                    </View>

                    <View style={navigationStyle.rightContainer}>
                        <TouchableWithoutFeedback onPress={this.props.onRightPress}>
                            <View style={navigationStyle.rightContainer}>
                                <Image
                                    style={[styles.navigationMenuButton, { marginLeft: 5 }]}
                                    source={require('../../resources/icons/ic_search_bar.png')}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    }
}
export default NavTextInput;
NavTextInput.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
};

const navigationStyle = StyleSheet.create({
    title: {
        flex: 5,
    },
    rightContainer: {
        flex: 0.8,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textInput: {
        color: colors.blueText,
        fontSize: width * 0.04,
        fontFamily: Fonts.CircularBold,
    },
    inputWrapper: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
        flex: 1,
        paddingLeft: width * 0.02,
        // alignItems: "flex-start",
        // justifyContent: "flex-start"
    },
});
