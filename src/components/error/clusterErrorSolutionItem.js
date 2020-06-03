import React, { PureComponent } from "react";
import { TouchableWithoutFeedback, StyleSheet, View, Text, Image } from "react-native";
import { colors, metrics, styles, fonts } from "../../themes";
import {IMG_PREFIX_URL} from '../../config/constant';
import { Fonts } from '../../resources/constants/Fonts';
import __ from '../../resources/copy';
import { connect } from 'react-redux';

// const ClusterErrorSolutionItem = ({ data, rowIndex, like, disLike, count, isLiked , errorSolution}) => {

class ClusterErrorSolutionItem extends PureComponent {
    state ={
       like:this.props.errorSolution.is_user_like ?  this.props.errorSolution.is_user_like[0].type === 'like' ? true:false:false,
       dislike:this.props.errorSolution.is_user_like ?  this.props.errorSolution.is_user_like[0].type === 'dislike' ? true:false:false,
       is_user_like:this.props.errorSolution.is_user_like ?true:false,
       likeCount:parseInt(this.props.errorSolution.total_likes),
       dislikeCount:parseInt(this.props.errorSolution.total_dislikes),
    }
    update_status =(id,type) =>{
      this.props.like(id,type);
    //   alert(type)
      if(type == 'like'){
        this.setState({like:true , dislike:false,is_user_like:true});
      }else{
        this.setState({like:false , dislike:true,is_user_like:true});
      }
    //   this.props.refresh();
    }

    render() {
    return (
        <View style={styleClusterErrorSolutionItem.listItem}>
            <View style={styleClusterErrorSolutionItem.solutionTextContainer}>
                <Text numberOfLines={4} style={styleClusterErrorSolutionItem.solutionText}>{this.props.language.isArabic == true ? this.props.errorSolution.description_arabic : this.props.errorSolution.description}</Text>
                <TouchableWithoutFeedback onPress={() => this.props.zoomImage(IMG_PREFIX_URL+this.props.errorSolution.picture)}>
                <Image
                    style={styleClusterErrorSolutionItem.solutionPartImage}
                    resizeMode="contain"
                    source={
                        this.props.errorSolution.picture
                          ? { uri: IMG_PREFIX_URL+this.props.errorSolution.picture }
                          : require("../../resources/images/car_error_sample-1.png")
                      }
                    />
                    </TouchableWithoutFeedback>
            </View>
            <View style={[styleClusterErrorSolutionItem.bottomRow,{  backgroundColor: this.state.is_user_like  ? "#11455F": "#EFEFF4"}]}>
                <Text style={this.state.is_user_like ? styleClusterErrorSolutionItem.opinionText : styleClusterErrorSolutionItem.opinionTextNoLike}>{this.state.is_user_like ? __('Thanks for your opinion' , this.props.language): __('Tell us if it works with you?' , this.props.language)}</Text>
                <View style={styleClusterErrorSolutionItem.likeDislikeContainer}>
                    <TouchableWithoutFeedback onPress={() => this.update_status(this.props.errorSolution.id , 'like')}>
                        <View style={[styleClusterErrorSolutionItem.feedbackButton, {
                            backgroundColor: this.state.is_user_like ? this.state.like ? "#2EAC6D" : "white" : "white"
                        }]}>
                            <Image
                                style={styleClusterErrorSolutionItem.imagelikeImage}
                                resizeMode="contain"
                                source={  this.state.is_user_like  ? this.state.like  ? require("../../resources/icons/ic_like.png") :
                                    require("../../resources/icons/ic_liked.png"):require("../../resources/icons/ic_liked.png")} />
                            <Text style={{ color: this.state.is_user_like  ? this.state.like  ? "white" : "#2EAC6D" : "#2EAC6D", fontFamily: Fonts.CircularBook, }}>{this.state.likeCount}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() =>  this.update_status(this.props.errorSolution.id ,'dislike') }>
                        <View style={[styleClusterErrorSolutionItem.feedbackButton, {
                            backgroundColor: this.state.is_user_like ? this.state.dislike ? "#FFA07A" : "white" : "white",
                        }]}>
                            <Image
                                style={styleClusterErrorSolutionItem.image}
                                resizeMode="contain"
                                source={require("../../resources/icons/ic_bad.png")} />
                            <Text style={{ fontFamily: Fonts.CircularBook, color: '#D80000' }}>{this.state.dislikeCount}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View >
    );
}
}

mapStateToProps = (state) => {
	return {
		language: state.language,
	}
}

export default connect(mapStateToProps, null)(ClusterErrorSolutionItem);

const styleClusterErrorSolutionItem = StyleSheet.create({

    listItem: {
        width: metrics.deviceWidth - 24,
        // height: metrics.deviceWidth * 0.29,
        backgroundColor: "#EFEFF4",
        borderRadius: 8,
        marginVertical: 4
        //elevation: 1 for shadow in android
    },
    solutionTextContainer: {
        flex: 65,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: metrics.baseMargin,
        paddingVertical: 2,
        paddingTop: 14,
        paddingLeft: 10,
        paddingBottom: 10,
    },
    solutionText: {
        flex: 1,
        color: "#060029",
        fontFamily: Fonts.circular_book,
    },
    solutionPartImage: {
        width: 79,
        height: 59,
        borderRadius: 8,
    },
    bottomRow: {
        flex: 35,
        flexDirection: "row",
        alignItems: "center",
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        paddingHorizontal: metrics.basePadding,
        justifyContent: "space-between",
        paddingTop: 7,
        paddingBottom: 10,
    },
    opinionText: {
        flex: 2,
        fontSize: 14,
        color: colors.white,
        fontFamily: Fonts.circular_book,
    },
    opinionTextNoLike: {
        flex: 2,
        fontSize: 14,
        color: "#8E8E93",
        fontFamily: Fonts.circular_book,
    },
    likeDislikeContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    feedbackButton: {
        width: metrics.deviceWidth * 0.14,
        height: metrics.deviceWidth * 0.08,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 19,
        height: 19
    }
});
