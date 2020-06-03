import {
    Dimensions,
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    ScrollView, TouchableOpacity
} from "react-native";
import React, {PureComponent} from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import StarRating from "react-native-star-rating";
import SplitHeading from "../common/splitHeading";
import {Fonts} from "../../resources/constants/Fonts";
import {colors, fonts, metrics, styles} from "../../themes";
import __ from "../../resources/copy";
const { width, height } = Dimensions.get('window');

class MultipleReviews extends PureComponent {
    constructor(props) {
        super(props);
        this.state={
            overall: 0,
            service: 0,
            value: 0,
            cleanliness: 0,
            competency: 0
        }
    }
    setAll(rating){
        this.setState({
            overall: rating,
            service: rating,
            value: rating,
            cleanliness: rating,
            competency: rating
        });
    }
    setOverall(){
        let overall= this.state.service + this.state.value + this.state.cleanliness + this.state.competency
        overall/= 4
        this.setState({
            overall: Math.round(overall),
        });
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{flexDirection: "column", flex: 1}}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20}}>
                        <Text style={{fontSize: 15, color: "black"}}>Overall: </Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.overall}
                            selectedStar={(rating) => this.setAll(rating)}
                        />
                    </View>
                    <SplitHeading
                        text="OR"
                        headingStyle={{ padding: 5, marginTop: 15, marginBottom: 2 }}
                        lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
                        textColor={{ color: "grey", fontFamily: Fonts.circular_medium }}
                    />
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 0}}>
                        <Text style={{fontSize: 15, color: "black"}}>Service Level: </Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.service}
                            selectedStar={(rating) => {
                                this.setState({
                                    service: rating
                                }, () => this.setOverall());
                            }}
                        />
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 0}}>
                        <Text style={{fontSize: 15, color: "black"}}>Value For Money: </Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.value}
                            selectedStar={(rating) => {
                                this.setState({
                                    value: rating
                                }, () => this.setOverall());
                            }}
                        />
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 0}}>
                        <Text style={{fontSize: 15, color: "black"}}>Cleanliness: </Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.cleanliness}
                            selectedStar={(rating) => {
                                this.setState({
                                    cleanliness: rating
                                }, () => this.setOverall());
                            }}
                        />
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20}}>
                        <Text style={{fontSize: 15, color: "black"}}>Competency: </Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.competency}
                            selectedStar={(rating) => {
                                this.setState({
                                    competency: rating
                                }, () => this.setOverall());
                            }}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: width * 0.038,
                                color: '#060029',
                                textAlign: 'center',
                                paddingHorizontal: width * 0.03,
                                fontFamily: Fonts.circular_book,
                            }}
                        >
                            {__('Sustain a quality service by sharing your opinion' , this.props.language)}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.props.onReviewClick(this.state.overall, this.state.service, this.state.value, this.state.cleanliness, this.state.competency)}>
                        <View style={Styles.btnStyle2}>
                            <Text style={styles.tapButtonStyleTextWhite}>{__('Rate your experience', this.props.language)}</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </ScrollView>

        );
    }
}

export default MultipleReviews;

let Styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    reviewPicture: {
        width: 66,
        height: 62,
        marginVertical: metrics.margin18,
    },
    rateTxtHeading: {
        color: '#11455F',
        fontSize: fonts.size.h4,
        fontFamily: Fonts.circular_book,
    },
    noReviewText: {
        textAlign: 'center',
        color: colors.grey93,
        fontSize: fonts.size.medium,
        marginVertical: metrics.smallMargin,
        fontFamily: Fonts.circular_book,
        width: metrics.deviceWidth / 1.5,
    },
    btnStyle: {
        width: metrics.deviceWidth - 40,
        height: 60,
        justifyContent: 'center',
        backgroundColor: '#11455F',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginVertical: 12,
    },
    btnStyle2: {
        width: metrics.deviceWidth - 80,
        height: 40,
        alignSelf: "center",
        justifyContent: 'center',
        backgroundColor: '#11455F',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginVertical: 12,
    },
    ad: {
        width: metrics.deviceWidth - 8,
        height: 110,
        marginVertical: 8,
    },
})
