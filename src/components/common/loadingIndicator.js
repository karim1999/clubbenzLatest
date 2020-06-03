import LoadingSpinner from 'react-native-loading-spinner-overlay';
import React,{Component} from 'react'
import {StyleSheet} from 'react-native'
import { connect } from 'react-redux';

const LoadingIndicator = (props)=>{
    return <LoadingSpinner
          visible={props.is_loading_indicator}
          textStyle={styles.spinnerTextStyle}
        />
}

const styles = StyleSheet.create({
    spinnerTextStyle:{

    }
})

mapStateToProps = (state) => {
	return {
		is_loading_indicator: state.init.is_loading_indicator
	}
  }

export default connect(mapStateToProps, null)(LoadingIndicator)
