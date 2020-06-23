import React, { Component } from 'react';
import { Text, Image, StyleSheet, View, TouchableOpacity, Dimensions, ImageBackground, Animated, Linking, Platform } from 'react-native';
import { colors, fonts, metrics, styles } from "../../themes";
import { Fonts } from "../../resources/constants/Fonts";

const { width, height } = Dimensions.get('window');

import { IMG_PREFIX_URL, PROFILE_PIC_PREFIX } from '../../config/constant';

export default class Advertisement extends Component {
    constructor(props) {
        super(props);
        // debugger
        this.state = {
            isFiveSeconds: false,
            textOpacity: 0,
            ad: this.props.ad,
            time: this.props.time ? this.props.time : 0,
            hour: this.props.time ? this.props.time[0] : 0,
            min: this.props.time ? this.props.time[1] : 0,
            sec: this.props.time ? this.props.time[2] : 0,
            timer: this.props.time ? (this.props.time[3] > 0 ? (this.props.time[2] <= 10 ? this.props.time[2] + 10 : this.props.time[2]) : 0) : 0,
        }
    }

    openLink = (link) => {
        if (link != '') {
            Linking.canOpenURL(link)
            .then((supported) => {
                if (!supported) {
                    console.log("Can't handle url: " + link);
                } else {
                    return Linking.openURL(link);
                }
            })
            .catch((err) => {
                console.log('An error occurred', err)
            });
        }
    }

    componentWillMount = () => {

        this.animatedWidth = new Animated.Value(0)
        this.animatedHeight = new Animated.Value(0)
    }

    componentDidMount = () => {
        if (this.props.time[3] > 0) {
            this.interval = setInterval(
                () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
                1000
            );
        }
        this.animatedBox();
        // alert(JSON.stringify(this.state.ad))
    }

    componentDidUpdate() {
        if (this.state.timer === 1) {
            clearInterval(this.interval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    animatedBox = () => {

        Animated.timing(this.animatedWidth, {
            toValue: width,
            duration: 1000
        }).start()

        Animated.timing(this.animatedHeight, {
            //    toValue: height / 1.75,
            //    toValue: height / 2.25,
            toValue: height / 2,
            duration: 2000
        }).start()

        setTimeout(() => {
            this.setState({ textOpacity: 100 })
        }, 1000)

        setTimeout(() => {
            this.animateBack();
        }, 8000)
    }

    animateBack = () => {
        Animated.timing(this.animatedWidth, {
            toValue: 0,
            duration: 1000
        }).start()

        Animated.timing(this.animatedHeight, {
            toValue: 0,
            duration: 2000
        }).start()

        setTimeout(() => {
            this.setState({ textOpacity: 0 })
        }, 1100)

        setTimeout(() => {
            this.setState({ isFiveSeconds: true })
        }, 1300)
    }

    render() {
        const animatedStyle = { width: this.animatedWidth, height: this.animatedHeight, position: 'absolute', opacity: this.state.isFiveSeconds == true ? 0 : 100/*zIndex: this.state.isFiveSeconds == true ? -100 : 1*/ }
        const initialView = { width: 50, height: 50 }
        return (
            <Animated.View style={[animatedStyle]}>
                <TouchableOpacity onPress={() => this.openLink(this.state.ad.link)} style={[style.mainContainer, { zIndex: this.state.isFiveSeconds == true ? -100 : -98, }]}>
                    <ImageBackground style={{ flex: 1 }} /*source={require('../../resources/images/sample.jpg')}*/ source={{ uri: IMG_PREFIX_URL + this.state.ad.image }}>
                        <View style={{/*height: 50*/ flex: 0.2, width: width, flexDirection: 'row', }}>
                            <View style={[styles.center, { width: width }]}>
                                <Text style={{ color: '#FFFFFF', fontFamily: Fonts.CircularMedium, fontSize: fonts.size.h12, textAlign: 'center', opacity: this.state.textOpacity }}>It remains only:</Text>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', marginLeft: width - 40, marginTop: 10, opacity: 0 }} >
                                <Image style={{ width: 30, height: 30 }} source={require('../../resources/images/cross_image.png')}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.center, { flex: 0.4, width: width / 1.5, flexDirection: 'row', alignSelf: 'center', /*marginTop: -5,*/ }]}>
                            <View style={{ backgroundColor: '#FFFFFF', flex: this.state.time[0] > 99 ? 0.5 : 0.25, /*height: 75*/ borderRadius: 10, flexDirection: 'column', }}>
                                <View style={[styles.center, { flex: 0.7 }]}>
                                    <Text style={[style.time, { opacity: this.state.textOpacity }]}>{this.state.hour}</Text>
                                </View>
                                <View style={[styles.center, { flex: 0.3 }]}>
                                    <Text style={[style.timeFormat, { opacity: this.state.textOpacity }]}>hr</Text>
                                </View>
                            </View>

                            <View style={{ backgroundColor: '#FFFFFF', flex: 0.25, /*height: 75*/ borderRadius: 10, marginLeft: 10, }}>
                                <View style={[styles.center, { flex: 0.7 }]}>
                                    <Text style={[style.time, { opacity: this.state.textOpacity }]}>{this.state.min}</Text>
                                </View>
                                <View style={[styles.center, { flex: 0.3 }]}>
                                    <Text style={[style.timeFormat, { opacity: this.state.textOpacity }]}>min</Text>
                                </View>
                            </View>

                            <View style={{ backgroundColor: '#FFFFFF', flex: 0.25, /*height: 75*/ borderRadius: 10, marginLeft: 10, }}>
                                <View style={[styles.center, { flex: 0.7 }]}>
                                    <Text style={[style.time, { opacity: this.state.textOpacity }]}>{this.state.timer}</Text>
                                </View>

                                <View style={[styles.center, { flex: 0.3 }]}>
                                    <Text style={[style.timeFormat, { opacity: this.state.textOpacity }]}>sec</Text>
                                </View>
                            </View>


                        </View>

                        <ImageBackground style={{ width: width, flex: 0.4, marginTop: 20 }} source={require('../../resources/images/transparent-layer-1.png')}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                {/*<View style={{ alignItems: 'flex-start', flex: 0.1 }}>*/}
                                {/*    <Image style={{ width: 40, flex: 1, resizeMode: 'contain', marginLeft: -9 }} source={require('../../resources/icons/left_icon.png')} />*/}
                                {/*</View>*/}

                                <View style={[styles.center, { flex: 0.8 }]}>
                                    {/* {this.state.ad.discount_percentage != '' ?
                                <Text style={[style.offerText, {opacity: this.state.textOpacity}]}>{this.state.ad.discount_percentage}%</Text> :
                                <Text style={[style.offerText, {opacity: this.state.textOpacity}]}>% N/A</Text>
                                } */}
                                </View>

                                {/*<View style={{ alignItems: 'flex-end', flex: 0.1 }}>*/}
                                {/*    <Image style={{ width: 40, flex: 1, resizeMode: 'contain', marginRight: -9, }} source={require('../../resources/icons/right_icon.png')} />*/}
                                {/*</View>*/}
                            </View>

                            {/* <View style={{ flex: 0.5, flexDirection: 'column', paddingBottom: 10 }}>
                                <View style={{ flex: 0.65 }}>
                                    <Text style={[style.offerDescription, { opacity: this.state.textOpacity }]}>{this.state.ad.part_name == '' ? 'No part name available' : this.state.ad.part_name}</Text>
                                </View>
                                <View style={[{ flex: 0.35 }, styles.center]}>
                                    <Text style={[style.offerTerms, { opacity: this.state.textOpacity }]}>{this.state.ad.description == '' ? 'No description available' : this.state.ad.description}</Text>
                                </View>
                            </View> */}

                        </ImageBackground>

                    </ImageBackground>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

// 21% OFF
// ON SPARE PARTS
// This discount is not valid in conjunction with any other offer.

const style = StyleSheet.create({
    mainContainer: {
        width: width,
        // height: height / 1.75,
        height: height / 2.25,
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 84 : 64,
    },
    time: {
        color: '#494949',
        fontFamily: Fonts.CircularMedium,
        fontSize: fonts.size.h1,
        textAlign: 'center'
    },
    timeFormat: {
        color: '#545454',
        fontFamily: Fonts.CircularMedium,
        fontSize: fonts.size.medium,
        textAlign: 'center'
    },
    offerText: {
        color: 'white',
        // fontSize: fonts.size.exlarge,
        fontSize: width * 0.09,
        fontFamily: Fonts.CircularBold,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    offerDescription: {
        color: 'white',
        // fontSize: fonts.size.h5,
        fontSize: width * 0.06,
        fontFamily: Fonts.CircularBook,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    offerTerms: {
        color: 'white',
        // fontSize: 11,
        fontSize: width * 0.04,
        fontFamily: Fonts.CircularBook,
        textAlignVertical: 'bottom',
        textAlign: 'center',
    }
});
