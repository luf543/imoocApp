import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button';
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

  _changeUserState(key, value){
    const user = this.state.user

    user[key] = value

    this.setState({
      user: user
    })
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
              defaultValue={user.bread}
              onChangeText={(text) => {
                this._changeUserState('bread', text)
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
  }
});

export default Update