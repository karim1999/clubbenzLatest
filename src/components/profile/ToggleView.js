import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { styles, colors } from '../../themes';
const { width, height } = Dimensions.get('window');
import { Switch } from 'react-native-switch';
import Icon from 'react-native-vector-icons/Entypo';
import { Fonts } from '../../resources/constants/Fonts';
export default class ToggleView extends Component {
	constructor(props) {
		super(props);
		// this.state = { isActive: true }
		// debugger
		this.state = { isActive: this.props.value }
	}

	render() {
		return (
			<View
				style={[
					styles.tapableButton,
					{
						backgroundColor: 'transparent',
						borderColor: colors.gray100,
						borderWidth: 1,
						alignSelf: 'stretch',
						marginHorizontal: width * 0.1,
						marginTop: height * 0.02,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						paddingHorizontal: 20
					},
				]}
			>
				<Text style={{ fontFamily: Fonts.CircularBold,fontSize: width * 0.035, color: '#0E2D3C' }}>
					{this.props.text}
				</Text>
				{this.props.facebook ? (
					<Switch
						value={this.state.isActive}
						onValueChange={val => {
							this.setState({isActive: val})
							this.props.onChange(val)
						}}
						disabled={false}
						activeText={'On'}
						inActiveText={'Off'}
						circleSize={width * 0.08}
						barHeight={height * 0.05}
						circleBorderWidth={0}
						backgroundActive={colors.facebook}
						backgroundInactive={'gray'}
						circleActiveColor={'#fff'}
						circleInActiveColor={'#fff'}
						changeValueImmediately={true}
						renderInsideCircle={() => (
							<Icon name={'facebook'} size={width * 0.05} color={colors.facebook} />
						)}
						innerCircleStyle={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }} // style for inner animated circle for what you (may) be rendering inside the circle
						outerCircleStyle={{}} // style for outer animated circle
						renderActiveText={false}
						renderInActiveText={false}
						switchLeftPx={2.5} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
						switchRightPx={2.5} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
						switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
					/>
				) : (
					<Switch
						value={this.state.isActive}
						onValueChange={val => {
							this.setState({isActive: val})
							this.props.onChange(val)
						}}
						disabled={false}
						activeText={'On'}
						inActiveText={'Off'}
						circleSize={width * 0.08}
						barHeight={height * 0.05}
						circleBorderWidth={0}
						backgroundActive={'#4cd964'}
						backgroundInactive={'gray'}
						circleActiveColor={'#fff'}
						circleInActiveColor={'#fff'}
						changeValueImmediately={true}
						innerCircleStyle={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }} // style for inner animated circle for what you (may) be rendering inside the circle
						outerCircleStyle={{}} // style for outer animated circle
						renderActiveText={false}
						renderInActiveText={false}
						switchLeftPx={2.5} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
						switchRightPx={2.5} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
						switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
					/>
				)}
			</View>
		);
	}
}
