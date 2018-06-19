import React, { Component } from 'react';

import request from '../common/request'
import config from '../common/config'

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
} from 'react-native';
import Button from 'react-native-button';


class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      verifyCode: '',
      phoneNumber: '',
      codeSent: false,
    }
  }

  _showVerifyCode(){
    this.setState({
      codeSent: true
    })
  }

  _sendVerifyCode(){
    const phoneNumber = this.state.phoneNumber

    if(!phoneNumber){
      return Alert.alert('手机号不能为空！')
    }

    const body = {
      phoneNumber: phoneNumber
    }

    request.post(config.api.base + config.api.signup, body)
      .then((data) => {
        if(data && data.success){
          this._showVerifyCode()
        }else{
          Alert.alert('获取验证码失败，请检查手机号是否正确')
        }
      })
      .catch((err) => {
        Alert.alert('获取验证码失败，请检查网络是否良好')
      })
  }

  render(){
    const {codeSent} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            placeholder='输入手机号'
            autoCapitalize='none'  //控制TextInput是否要自动将特定字符切换为大写
            autoCorrect={false}  //不去纠正内容的对与错
            keyboardType='numeric' //纯数字键盘
            style={styles.inputField}
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text
              })
            }}
          />

          {
            codeSent
            ? <View style={styles.verifyCodeBox}>
                <TextInput
                placeholder='输入验证码'
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='numeric'
                style={styles.inputField}
                onChangeText={(text) => {
                  this.setState({
                    verifyCode: text
                  })
                }}
              />
            </View>
            : null
          }

          {
            codeSent
            ? <Button
              style={styles.btn}
              onPress={this._submit}>登录</Button>
            :<Button
              style={styles.btn}
              onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },

  signupBox: {
    marginTop: 30,
  },

  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center'
  },

  inputField: {
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  
  btn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c'
  }
});

export default Login