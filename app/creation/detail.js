import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


class Detail extends Component {
  constructor(props){
    super(props)
  }
  render(){
    const row = this.props.navigation.state.params.row
    return (
      <View style={styles.container}>
        <Text>详情页面{row._id}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

export default Detail