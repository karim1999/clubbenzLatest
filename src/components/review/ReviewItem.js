import React from 'react';
import { Text, View, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { styles, fonts, colors, metrics } from '../../themes';
const { width, height } = Dimensions.get('window');
import { PROFILE_PIC_PREFIX, IMG_PREFIX_URL } from "../../config/constant";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Fonts } from '../../resources/constants/Fonts';
import ReviewsAd from '../../components/common/reviewsAd';
import StarRating from "react-native-star-rating";

const ReviewItem = ({ item, key, index, preferences, length }) => {

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let date = new Date(item.date_created.split(' ')[0])
    date = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()

    // renderAds = () => {
    //     for (i = 0; i < preferences.home_ads.length; i++) {
    //         if (preferences.home_ads[i].type === "Reviews") {
    //             return <ReviewsAd home_ads={preferences.home_ads[i]} />;
    //         }
    //     }
    // }

    renderAds = () => {
        console.log(preferences)
        // debugger
        if (preferences.banner[3] !== null && preferences.banner[3].status === 'active' && preferences.banner[3].type === 'Review Comment') {
            return <ReviewsAd home_ads={preferences.banner[3]} />
        } else {
            return null;
        }
    }

    return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ flexDirection: 'row', flex: 0.6, paddingVertical: 10/*metrics.smallPadding*/ }}>

                <View style={{
                    flex: 1, justifyContent: 'flex-start',
                    alignItems: 'center',

                }}>
                    {item.user_picture != '' ?
                            <Image style={{
                                width: 60,
                                height: 60,
                                borderRadius:60 / 2,
                                overflow:'hidden',
                            }}
                                source={{ uri: PROFILE_PIC_PREFIX + item.user_picture }}
                                 />
                        :
                        // <Icon name="comment-o" size={60} color='#11455F' />
                        <Image style={{ width: 56, height: 56, borderRadius: 100 }} source={require('../../resources/images/icon1.png')} />
                    }

                    <View style={{ alignSelf: 'flex-end', marginTop: -25, marginRight: 10, backgroundColor: "white", padding: 3, borderRadius: 600 }}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={15}
                            rating={item.rate}
                            selectedStar={(rating) => {
                                console.log(rating)
                            }}
                        />
                        {/*{item.rate == "like" ? <Icon name="heart-o" size={15} color='#11455F' /> : null}*/}
                        {/*{item.rate == "ok" ? <Icon name="smile-o" size={15} color='#11455F' /> : null}*/}
                        {/*{item.rate == "bad" ? <Icon name="thumbs-o-down" size={15} color='#11455F' /> : null}*/}
                    </View>

                </View>

                <View style={{ justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.grey93, flex: 3 }}>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ fontFamily: Fonts.circular_book, color: '#1E313E', fontSize: 14, marginRight: metrics.baseMargin, alignSelf: 'flex-start' }}>{item.detail != "" ? item.detail : "No details"}</Text>
                        {item.picture ? <Image style={styleReviewItem.reviewImage} source={{ uri: IMG_PREFIX_URL + item.picture }} resizeMode='cover' /> : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: metrics.baseMargin }}>
                            <Text style={{ fontFamily: Fonts.CircularBoldItalic, color: '#8E8E93', fontSize: 11 }}>{item.user_name ? item.user_name : "Unknown User"}</Text>
                            {/* <Text style={{ fontFamily: Fonts.CircularBoldItalic, color: '#8E8E93', fontSize: 11 }}>{item.username ? item.username : "Unknown User"}</Text> */}
                            <Text style={{ marginRight: metrics.baseMargin, marginBottom: metrics.smallMargin, color: '#1E313E', fontFamily: Fonts.circular_book, fontSize: 11 }}>{date}</Text>
                        </View>
                    </View>
                </View>

            </View>
            <View style={{ flex: 0.4 }}>
                {
                    (length == 1 && index == 1) ? this.renderAds() : <View />
                }
            </View>

        </View>
    );
};
const styleReviewItem = StyleSheet.create({

    reviewImage: {
        borderRadius: 18,
        marginTop: 12,
        width: metrics.deviceWidth * 0.72,
        height: metrics.deviceWidth * 0.5
    }
});
export default ReviewItem;
