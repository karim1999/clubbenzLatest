import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { colors, fonts, metrics, styles } from '../themes';

import DropdownMenu from 'react-native-dropdown-menu';

import ProgressCircle from 'react-native-progress-circle'
import ReviewItem from '../components/review/ReviewItem';
import { Fonts } from '../resources/constants/Fonts';
import ReviewsAd from '../components/common/reviewsAd';
import { connect } from 'react-redux';
import __ from '../resources/copy';
import StarRating from 'react-native-star-rating';

var index1 = -1;
var index2 = -1;

class CommunitySaysScreen extends PureComponent {
    constructor(props) {
        
        // debugger
        super(props);
        // alert(this.props.avg_rating)
        console.log(this.props.reviews)
        // alert(JSON.stringify(this.props.reviews))
        const length = this.props.reviews.length;
        if (length > 0) {
            if (length == 1) {
                index1 = 1;
            } else {
                const value = Math.ceil(length / 2);
                // alert('The ceil value is ' + value)
                index2 = value;
            }
        }
    }
    state = {
        totalReviews: this.props.reviews.reduce((total, value) => {
            return parseInt(total) + parseInt(value.rate);
        }, 0),
    }

    // renderAds = () => {
    //     for (i = 0; i < this.props.preferences.home_ads.length; i++) {
    //         if(this.props.preferences.home_ads[i].type === "Reviews"){
    //           return  <ReviewsAd home_ads={this.props.preferences.home_ads[i]} />
    //         }
    //     }
    // }

    renderAds = () => {
        // debugger
        if (this.props.preferences.banner[3] !== null && this.props.preferences.banner[3].status === 'active' && this.props.preferences.banner[3].type === 'Review Comment') {
            return <ReviewsAd home_ads={this.props.preferences.banner[3]} />
        }
    }

    renderItem = ({ item, index }) => {
        // alert(JSON.stringify(item))
        if (index == index2) {
            return (
                <View>
                    {/* <View style={{width: 300, height: 90}}>{this.renderAds()}</View> */}
                    {this.renderAds()}
                    <ReviewItem item={item} key={index} index={index1} preferences={this.props.preferences} length={this.props.reviews.length} />
                </View>
            )
        } else {
            return <ReviewItem item={item} key={index} index={index1} preferences={this.props.preferences} length={this.props.reviews.length} />
        }
    }

    render() {
        // const data = [__('Most recent' , this.props.language)];
        var value = __('Most recent', this.props.language);
        // const data = [['Most recent']];
        const data = [[value]];
        const { reviews } = this.props

        let result = reviews.reduce((result, review) => {
            if (review.rate === 'like') result.liked++
            if (review.rate === 'ok') result.itsOk++
            if (review.rate === 'bad') result.badOne++
            return result
        }, { liked: 0, itsOk: 0, badOne: 0 })

        result.liked = (result.liked / reviews.length * 100).toFixed(0)
        result.itsOk = (result.itsOk / reviews.length * 100).toFixed(0)
        result.badOne = (result.badOne / reviews.length * 100).toFixed(0)

        return (

            <View style={CommunitySaysScreenStyle.container}>
                <Text style={CommunitySaysScreenStyle.rate}>
                    {__('Rated', this.props.language)} {parseFloat(this.props.avg_rating).toFixed(1)} {__('out of', this.props.language)} 10 {__('based on', this.props.language)} {reviews.length} {__('Members', this.props.language)}</Text>

                {/** Rate your experience section View */}
                <View style={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.lightGray,
                    width: metrics.deviceWidth,
                    alignItems: "center"
                }}>
                    <View style={CommunitySaysScreenStyle.ratePercantageSection}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={Math.round(this.state.totalReviews/this.props.reviews.length)}
                            selectedStar={(rating) => {
                                console.log(rating)
                            }}
                        />
                    </View>
                    <TouchableOpacity onPress={this.props.rateNow}>
                        <View style={CommunitySaysScreenStyle.btnStyle}>
                            <Text style={styles.tapButtonStyleTextWhite}>{__('Rate your experience', this.props.language)}</Text>
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={CommunitySaysScreenStyle.recentBar}>
                    <DropdownMenu
                        style={{ alignSelf: 'flex-end', width: 100, }}
                        bgColor={'white'}
                        tintColor={colors.blueText}
                        activityTintColor={colors.blueText}
                        // arrowImg={}
                        // checkImage={}
                        // optionTextStyle={{color: '#333333'}}
                        titleStyle={{ color: colors.blueText, fontSize: fonts.size.h13, fontFamily: Fonts.CircularBold, }}
                        // maxHeight={300}
                        handler={(selection, row) => this.setState({ text: data[selection][row] })}
                        data={data}
                    />
                    <Text style={{ flex: 2, fontFamily: Fonts.circular_book, color: '#8E8E93', textAlign: 'left' }}>{__('Members reviews', this.props.language)}</Text>
                </View>

                <View style={{ flex: 1, width: metrics.deviceWidth, zIndex: 0 }}>
                    <FlatList
                        data={reviews}
                        keyExtractor={(item, index) => item.id}
                        renderItem={this.renderItem}
                    />
                </View>


            </View>
        );
    }
}
mapStateToProps = (state) => {
    return {
        preferences: state.init.preferences,
        language: state.language,
    }
}

export default connect(mapStateToProps, null)(CommunitySaysScreen)

const CommunitySaysScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 12
    },
    rate: {
        color: colors.blueButton,
        fontFamily: Fonts.CircularBold
    },
    ratePercantageSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        marginTop: metrics.baseMargin
    },
    progressContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    progressCircle: {
        justifyContent: "center",
        alignItems: "center",
    },
    review: {
        color: colors.blueText,
        marginTop: 8,
        fontFamily: Fonts.circular_book,
    },
    btnStyle: {
        width: metrics.deviceWidth - 40,
        height: 60,
        justifyContent: 'center',
        backgroundColor: '#11455F',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginVertical: 18,
        fontFamily: Fonts.CircularMedium,
    },
    recentBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: metrics.deviceWidth,
        height: metrics.deviceWidth * 0.15,
        alignItems: 'center',
        marginVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        paddingHorizontal: metrics.basePadding,
        zIndex: 1
    }
});
