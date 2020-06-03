import {Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image, Modal, Dimensions} from "react-native";
import React, {PureComponent} from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import __ from "../../resources/copy";
import {Fonts} from "../../resources/constants/Fonts";
import {connect} from "react-redux";
const { height, width } = Dimensions.get("window");

class SecondHeader extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            showOverlay: false,
            showSorting: false,
            formBy: "distance",
            formType: "ASC"
        }
    }

    render() {
        return (
            <View style={Styles.secondHeader}>
                <View>
                    <TouchableOpacity style={Styles.button}  onPress={this.props.openNow}>
                        <Text style={Styles.buttonText}>{__('Open Now' , this.props.language)}</Text>
                        <Image style={{width: 25, height: 25}} source={require('../../resources/icons/Filter.png')} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={{...Styles.button, alignSelf: "flex-end"}}  onPress={() => {
                        this.props.showOverlay()
                        this.setState(prevState => ({...prevState, showSorting: !prevState.showSorting, showOverlay: true}))
                    }}>
                        <Text style={Styles.buttonText}>{__('Sort By' , this.props.language)}</Text>
                        <Icon name="angle-down" size={25} />
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.showSorting}
                    animationType="slide"
                    onRequestClose={() => {
                        this.setState({showSorting: false, showOverlay: false});
                        this.props.hideOverlay()
                    }}
                >
                    <View style={{marginTop: 200, backgroundColor: "white", padding: 30, marginRight: 20, marginLeft: 20, flexDirection: "column", justifyContent: "center", alignItems: "flex-start"}}>
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <Text style={Styles.sortingText}>{__('Sort By:' , this.props.language)}</Text>
                            <TouchableOpacity style={{...Styles.button2}}  onPress={()=> this.setState({formBy: "distance"}) }>
                                <Text style={[Styles.buttonText]}>{__('Location' , this.props.language)}</Text>
                                <Icon name={this.state.formBy == "distance" ? "circle" : "circle-o"} size={15} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{...Styles.button2}}  onPress={()=> this.setState({formBy: "avg_rating"}) }>
                                <Text style={[Styles.buttonText]}>{__('Rating' , this.props.language)}</Text>
                                <Icon name={this.state.formBy == "avg_rating" ? "circle" : "circle-o"} size={15} />
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <Text style={Styles.sortingText}>{__('Sort Type:' , this.props.language)}</Text>
                            <TouchableOpacity style={{...Styles.button2}}  onPress={()=> this.setState({formType: "ASC"}) }>
                                <Text style={[Styles.buttonText]}>{__('ASC' , this.props.language)}</Text>
                                <Icon name={this.state.formType == "ASC" ? "circle" : "circle-o"} size={15} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{...Styles.button2}}  onPress={()=> this.setState({formType: "DESC"}) }>
                                <Text style={[Styles.buttonText]}>{__('DESC' , this.props.language)}</Text>
                                <Icon name={this.state.formType == "DESC" ? "circle" : "circle-o"} size={15} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{alignSelf: "center"}} onPress={()=>  {
                            this.props.hideOverlay()
                            this.setState({showSorting: false, showOverlay: false});
                            this.props.sortButton(this.state.formBy, this.state.formType)
                        }}>
                            <Text style={Styles.sortingButton}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {this.state.showOverlay ? <View onPress={()=> this.setState({showOverlay: false, showSorting: false})} style={Styles.overlayLayer} /> : null}
            </View>
        );
    }
}

mapStateToProps = (state) => {
    return {
        language: state.language,
    }
}

export default connect(mapStateToProps, null)(SecondHeader)

let Styles= StyleSheet.create({
    secondHeader: {
        height: 80,
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingBottom: 15,
        top: -5,
        zIndex: -1,
        marginTop: 100
    },
    button: {
//   width: 100,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: width * 0.02,
        marginLeft: width * 0.03,
        marginRight: width * 0.03,
    },
    button2: {
//   width: 100,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: width * 0.02,
        marginLeft: width * 0.03,
        marginRight: width * 0.03,
    },
    sortingText: {
        fontSize: 15,
        color: "black"
    },
    buttonText: {
        color: "#717171",
        fontFamily: Fonts.CircularBold,
        // borderWidth: 1,
        // borderColor: "#717171",
        // borderRadius: width * 0.05,
        alignSelf: "flex-start",
        padding: 7,
        paddingLeft: 10,
        paddingRight: 10
    },
    activeButtonText: {
        backgroundColor: "#e1e4e6"
    },
    sortingButton: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 50,
        paddingRight: 50,
        marginTop: 20,
        borderRadius: 20,
        backgroundColor: "#0b2052",
        color: "white"
    },
    overlayLayer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(47,51,54,0.22)',
    },
})
