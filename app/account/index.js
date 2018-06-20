import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';

const {height, width} = Dimensions.get('window')

class Account extends Component {
  constructor(props){
    super(props)
    const user = props.user || {}
    this.state = {
      user: user
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

  render(){
    const {user} = this.state
    return (
      <View style={styles.container}>
      {
        user.avatar
        ? <TouchableOpacity style={styles.avatarContainer}>
          <ImageBackground source={{uri: user.avatar}} style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
              <Image
                source={{uri: user.avatar}}
                style={styles.avatar}/>
              <Text style={styles.avatarTip}>戳这里换头像</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        : <View style={styles.avatarContainer}>
          <Text style={styles.avatarTip}>添加头像</Text>
          <TouchableOpacity style={styles.avatarBox}>
            <Icon
              name='ios-cloud-upload-outline'
              style={styles.plusIcon}/>
          </TouchableOpacity>
        </View>
      }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatarContainer: {
    width: width,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666'
  },

  avatarTip: {
    color: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },

  avatar: {
    marginBottom: 15,
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'cover',
    borderRadius: width * 0.1
  },

  avatarBox: {
    marginTop: 15,
  },

  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: '#999',
    fontSize: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 8,
  }
});

export default Account