import React, { Component } from 'react';
import sha1 from 'sha1'
import Icon from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'react-native-image-picker'

import request from '../common/request'
import config from '../common/config'

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
const photoOptions = {
  title: '选择头像',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '选择相册',
  quality: 0.75,  //图片质量
  allowsEditing: true,  //是不是内置应用对照片操作
  noData: false,  //图片转base64
  storageOptions: {
    skipBackup: true, //图片不会传iCloud
    path: 'images'
  }
}
const CLOUDINARY = {
  cloud_name: 'gougou',
  api_key: '852224485571877',
  api_secret: 'ht91J3cXl2TnkAgLR-ftK-iasPE',
  base: 'http://res.cloudinary.com/gougou',
  image: 'https://api.cloudinary.com/v1_1/gougou/image/upload',
  video: 'https://api.cloudinary.com/v1_1/gougou/video/upload',
  audio: 'https://api.cloudinary.com/v1_1/gougou/audio/upload',
}

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

  _pickPhoto(){
    ImagePicker.showImagePicker(photoOptions, (res) => {
      console.log('res = ', res)
     
      if (res.didCancel) {
        console.log('User cancelled image picker')
        return
      }

      const avatarData = 'data:image/jpeg;base64,' + res.data
      const user = this.state.user
      user.avatar = avatarData
      this.setState({
        user: user
      })

      const timestamp = Date.now()
      const tags = 'app,avatar'
      const folder = 'avatar'
      const accessToken = this.state.user.accessToken

      request.post(config.api.base + config.api.signature, {
        accessToken: accessToken,
        timestamp: timestamp,
        type: 'avatar'
      })
      .then((data) => {
        if(data && data.success){
          // data.data
          let signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret

          signature = sha1(signature)
        }
      })
    })
  }

  render(){
    const {user} = this.state
    return (
      <View style={styles.container}>
      {
        user.avatar
        ? <TouchableOpacity onPress={this._pickPhoto.bind(this)} style={styles.avatarContainer}>
          <ImageBackground source={{uri: user.avatar}} style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
              <Image
                source={{uri: user.avatar}}
                style={styles.avatar}/>
              <Text style={styles.avatarTip}>戳这里换头像</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        : <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto.bind(this)}>
          <Text style={styles.avatarTip}>添加头像</Text>
          <View style={styles.avatarBox}>
            <Icon
              name='ios-cloud-upload-outline'
              style={styles.plusIcon}/>
          </View>
        </TouchableOpacity>
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