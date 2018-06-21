import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button';

import request from '../common/request'
import config from '../common/config'

import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';

class Update extends Component {
  constructor(props){
    super(props)
    const user = props.user || {}
    this.state = {
      user: user,
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('user')
    .then((data) => {
      let user
      if(data){
        user = JSON.parse(data)
      }

      if(user && user.accessToken){
        this.setState({
          user: user
        })
      }
    })
  }

  _asyncUser(isAvatar){
    let user = this.state.user
    if(user && user.accessToken){
      request.post(config.api.base + config.api.update, user)
      .then((data) => {
        if(data && data.success){
          user = data.data

          if(isAvatar){
            Alert.alert('头像更新成功')
          }

          this.setState({
            user: user
          }, () => {
            this.props.navigation.goBack()
            AsyncStorage.setItem('user', JSON.stringify(user))
          })
        }
      })
    }
  }

  _changeUserState(key, value){
    const user = this.state.user

    user[key] = value

    this.setState({
      user: user
    })
  }

  

  _submit(){
    this._asyncUser()
  }

  render(){
    const user = this.state.user
    return (
      <View style={styles.container}>
        <View style={styles.modalContainer}>

          <View style={styles.fieldItem}>
            <Text style={styles.label}>昵称</Text>
            <TextInput
              placeholder={'输入你的昵称'}
              style={styles.inputField}
              autoCapitalize={'none'}
              autoCorrect={false}
              defaultValue={user.nickname}
              onChangeText={(text) => {
                this._changeUserState('nickname', text)
              }}
            />
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.label}>品种</Text>
            <TextInput
              placeholder={'狗狗的品种'}
              style={styles.inputField}
              autoCapitalize={'none'}
              autoCorrect={false}
              defaultValue={user.breed}
              onChangeText={(text) => {
                this._changeUserState('breed', text)
              }}
            />
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.label}>年龄</Text>
            <TextInput
              placeholder={'狗狗的年龄'}
              style={styles.inputField}
              autoCapitalize={'none'}
              autoCorrect={false}
              defaultValue={user.age}
              onChangeText={(text) => {
                this._changeUserState('age', text)
              }}
            />
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.label}>性别</Text>
            <Icon.Button
              onPress={() => {
                this._changeUserState('gender', 'male')
              }}
              style={[
                styles.gender,
                user.gender === 'male' && styles.genderChecked
              ]}
              name='ios-paw'>男</Icon.Button>
            <Icon.Button
              onPress={() => {
                this._changeUserState('gender', 'female')
              }}
              style={[
                styles.gender,
                user.gender === 'female' && styles.genderChecked
              ]}
              name='ios-paw-outline'>女</Icon.Button>
          </View>

          <Button
            style={styles.btn}
            onPress={this._submit.bind(this)}>保存资料</Button>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff'
  },

  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#eee',
    borderBottomWidth: 1
  },

  label: {
    color: '#ccc',
    marginRight: 10
  },

  gender: {
    backgroundColor: '#ccc'
  },

  genderChecked: {
    backgroundColor: '#ee735c'
  },

  inputField: {
    flex: 1,
    height: 50,
    color: '#666',
    fontSize: 14
  },

  btn: {
    marginTop: 25,
    padding: 10,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    color: '#ee735c'
  }
});

export default Update