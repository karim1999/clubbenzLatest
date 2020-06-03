import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { styles, colors } from '../../themes';
const { width, height } = Dimensions.get('window');
import { Switch } from 'react-native-switch';
import Icon from 'react-native-vector-icons/Entypo';
export default class FacebookToggleView extends Component {
    constructor(props) {
        super(props);
        this.state = { isActive: true }
    }

    changeState = (value) => {
        this.setState({
            isActive: value
        });
        this.props.toggle(value);
    }

    render() {
        return (

            <Switch
                value={this.state.isActive}
                onValueChange={val => this.changeState(val)}
                disabled={false}
                activeText={'On'}
                inActiveText={'Off'}
                circleSize={width * 0.06}
                barHeight={height * 0.04}
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
        );
    }
}
