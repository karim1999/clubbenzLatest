import React, { Component } from 'react';
import { Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');

export default class FilterModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			acceptTerms: true,
		};
	}
	render() {
		return (
			<View style={{ backgroundColor: 'rgba(14, 45, 60, 0.8)', flex: 1 }}>
				<View style={{ flex: 1 }} />
				<View
					style={{
						flex: 3,
						backgroundColor: '#fff',
						borderTopRightRadius: width * 0.04,
						borderTopLeftRadius: width * 0.04,
					}}
				>
					<View style={{ borderBottomColor: '#cdccd4', borderBottomWidth: 1 }}>
						<Text
							style={{
								textAlign: 'center',
								color: '#0E2D3C',
								fontSize: width * 0.04,
								// fontWeight: 'bold',
								paddingTop: height * 0.02,
							}}
						>
							Filters
						</Text>
						<Text
							style={{
								textAlign: 'center',
								color: '#0E2D3C',
								fontSize: width * 0.025,
								paddingBottom: height * 0.03,
							}}
						>
							Choose your prefered service
						</Text>
						<View />
					</View>

					<View
						style={{
							borderBottomColor: '#cdccd4',
							borderBottomWidth: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingHorizontal: width * 0.05,
							alignItems: 'center',
							paddingVertical: width * 0.04,
						}}
					>
						<Text
							style={{
								color: '#0E2D3C',
								fontSize: width * 0.03,
								fontWeight: '500',
							}}
						>
							Battery Replacement
						</Text>
						<View>
							<TouchableOpacity onPress={() => this.setState({ acceptTerms: !this.state.acceptTerms })}>
								<Image
									style={{ width: 30, height: 30 }}
									source={
										this.state.acceptTerms
											? require('../../resources/images/checked.png')
											: require('../../resources/images/un-checked.png')
									}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View
						style={{
							borderBottomColor: '#cdccd4',
							borderBottomWidth: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingHorizontal: width * 0.05,
							alignItems: 'center',
							paddingVertical: width * 0.04,
						}}
					>
						<Text
							style={{
								color: '#0E2D3C',
								fontSize: width * 0.03,
								fontWeight: '500',
							}}
						>
							Battery Replacement
						</Text>
						<View>
							<TouchableOpacity onPress={() => this.setState({ acceptTerms: !this.state.acceptTerms })}>
								<Image
									style={{ width: 30, height: 30 }}
									source={
										this.state.acceptTerms
											? require('../../resources/images/checked.png')
											: require('../../resources/images/un-checked.png')
									}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View
						style={{
							borderBottomColor: '#cdccd4',
							borderBottomWidth: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingHorizontal: width * 0.05,
							alignItems: 'center',
							paddingVertical: width * 0.04,
						}}
					>
						<Text
							style={{
								color: '#0E2D3C',
								fontSize: width * 0.03,
								fontWeight: '500',
							}}
						>
							Battery Replacement
						</Text>
						<View>
							<TouchableOpacity onPress={() => this.setState({ acceptTerms: !this.state.acceptTerms })}>
								<Image
									style={{ width: 30, height: 30 }}
									source={
										this.state.acceptTerms
											? require('../../resources/images/checked.png')
											: require('../../resources/images/un-checked.png')
									}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View
						style={{
							borderBottomColor: '#cdccd4',
							borderBottomWidth: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingHorizontal: width * 0.05,
							alignItems: 'center',
							paddingVertical: width * 0.04,
						}}
					>
						<Text
							style={{
								color: '#0E2D3C',
								fontSize: width * 0.03,
								fontWeight: '500',
							}}
						>
							Battery Replacement
						</Text>
						<View>
							<TouchableOpacity onPress={() => this.setState({ acceptTerms: !this.state.acceptTerms })}>
								<Image
									style={{ width: 30, height: 30 }}
									source={
										this.state.acceptTerms
											? require('../../resources/images/checked.png')
											: require('../../resources/images/un-checked.png')
									}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View
						style={{
							borderBottomColor: '#cdccd4',
							borderBottomWidth: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
							paddingHorizontal: width * 0.05,
							alignItems: 'center',
							paddingVertical: width * 0.04,
						}}
					>
						<Text
							style={{
								color: '#0E2D3C',
								fontSize: width * 0.03,
								fontWeight: '500',
							}}
						>
							Battery Replacement
						</Text>
						<View>
							<TouchableOpacity onPress={() => this.setState({ acceptTerms: !this.state.acceptTerms })}>
								<Image
									style={{ width: 30, height: 30 }}
									source={
										this.state.acceptTerms
											? require('../../resources/images/checked.png')
											: require('../../resources/images/un-checked.png')
									}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							paddingHorizontal: width * 0.2,
							paddingTop: height * 0.02,
						}}
					>
						<View>
							<TouchableOpacity onPress={this.props.onCancel}>
								<Text
									style={{
										color: '#0E2D3C',
										fontSize: width * 0.03,
										fontWeight: '500',
									}}
								>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
						<View>
							<TouchableOpacity>
								<View
									style={{
										justifyContent: 'center',
										alignItems: 'center',
										paddingHorizontal: width * 0.08,
										backgroundColor: '#0E2D3C',
										paddingVertical: width * 0.03,
										borderRadius: width * 0.06,
									}}
								>
									<Text
										style={{
											color: '#fff',
											fontSize: width * 0.03,
										}}
									>
										Apply
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		);
	}
}
