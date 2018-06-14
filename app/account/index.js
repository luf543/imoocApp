import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';


class Account extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: {
        nickname: '老四',
        times: 0
      }
    }
  }

  componentDidMount(){
  
    //AsyncStorage 键'user' 值必须是一个字符串或者数组[key: string, value: string]方式，如果是一个对象自变量，就会报错

    //回调方式
    // AsyncStorage.setItem('user', userData, (err)=>{
    //   if(err){
    //     console.log(err)
    //     console.log('save fails')
    //   }else{
    //     console.log('save ok')
    //   }
    // })

    //promise方式
    // AsyncStorage
    //   .getItem('user')
    //   .catch((err)=>{
    //     console.log(err)
    //     console.log('get fails')
    //   })
    //   .then((data)=>{
    //     if(data === null){
    //       data = this.state.user
    //     }else{
    //       data = JSON.parse(data)
    //     }

    //     this.setState({
    //       user: data
    //     }, ()=>{
    //       data.times++
    //       const userData = JSON.stringify(data)
    //       AsyncStorage
    //         .setItem('user', userData)
    //         .catch((err)=>{
    //           console.log(err)
    //           console.log('save fails')
    //         })
    //         .then(()=>{
    //           console.log('save ok')
    //         })
    //     })
    //   })

    // AsyncStorage.removeItem('user')
    //   .then(()=>{
    //     console.log('remove ok')
    //   })

    // AsyncStorage.multiSet([['user1', '1'], ['user2', '2']])
    //   .then(()=>{
    //     console.log('save ok')
    //   })
    // AsyncStorage.multiGet(['user1', 'user2', 'user'])
    //   .then((data)=>{
    //     console.log(data)
    //   })
    AsyncStorage.multiRemove(['user1', 'user2'])
      .then(()=>{
        console.log('remove ok')
        AsyncStorage.multiGet(['user1', 'user2', 'user'])
          .then((data)=>{
            console.log(data)
          })
      })
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
        <Text style={[styles.item, styles.item1]}>
          {this.state.user.nickname}不爽了{this.state.user.times}次
        </Text>
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