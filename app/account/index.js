import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


class Account extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <View style={styles.container}>
        <Text style={[styles.item, styles.item1]}>账户页面1</Text>
        <View style={[styles.item, styles.item2]}>
          <Text>账户页面2</Text>
        </View>
        <View style={[styles.item, styles.item3]}>
          <Text>账户页面3</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //宽度高度充满整个视窗
    flexDirection: 'row',  //默认column
    flexWrap: 'wrap', //默认nowrap不换行
    justifyContent: 'space-around',  //主轴控制，默认flex-start，两端对齐space-between，两端对齐且两边距离是中间距离一半space-around
    alignItems: 'center', //stretch拉伸
    backgroundColor: '#ff6600',
  },
  item1: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  item2: {
    flex: 1,
    backgroundColor: '#999',
  },
  item3: {
    flex: 1,
    backgroundColor: '#666',
  },
});

export default Account