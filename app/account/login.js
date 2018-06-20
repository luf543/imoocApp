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
import {CountDownText} from 'react-native-lf-countdown'


class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      verifyCode: '',
      phoneNumber: '',
      countingDone: false,
      codeSent: false,
    }
  }

  _showVerifyCode(){
    this.setState({
      codeSent: true
    })
  }

  _countingDone(){
    this.setState({
      countingDone: true
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

  _submit(){
    const {phoneNumber, verifyCode} = this.state

    if(!phoneNumber || !verifyCode){
      return Alert.alert('手机号或验证码不能为空！')
    }

    const body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    }

    request.post(config.api.base + config.api.verify, body)
      .then((data) => {
        if(data && data.success){
          this.props.afterLogin(data.data)
        }else{
          Alert.alert('获取验证码失败，请检查手机号是否正确')
        }
      })
      .catch((err) => {
        Alert.alert('获取验证码失败，请检查网络是否良好')
      })
  }

  render(){
    const {codeSent, countingDone} = this.state
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
                  style={styles.inputVerify}
                  onChangeText={(text) => {
                    this.setState({
                      verifyCode: text
                    })
                  }}
                />
                {
                  countingDone
                  ? <Button
                    style={styles.countBtn}
                    onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
                  : <CountDownText
                      style={styles.countBtn}
                      countType='seconds' // 计时类型：seconds / date
                      auto={true} // 自动开始
                      afterEnd={this._countingDone.bind(this)} // 结束回调
                      timeLeft={60} // 正向计时 时间起点为0秒
                      step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                      startText='获取验证码' // 开始的文本
                      endText='获取验证码' // 结束的文本
                      intervalText={(sec) => '剩余秒数:' + sec} // 定时的文本回调
                    />
                }
            </View>
            : null
          }

          {
            codeSent
            ? <Button
              style={styles.btn}
              onPress={this._submit.bind(this)}>登录</Button>
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

  verifyCodeBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inputVerify: {
    flex: 1,
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4
  },

  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    backgroundColor: '#ee735c',
    borderColor: '#ee735c',
    color: '#fff',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 15,
    borderRadius: 2,
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