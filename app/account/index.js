import React, { Component } from 'react';
import sha1 from 'sha1'
import Icon from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'react-native-image-picker'
import * as Progress from 'react-native-progress';

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
  Alert,
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

function avatar(id, type) {
  if(id.indexOf('http') > -1){
    return id
  }
  if(id.indexOf('data:image') > -1){
    return id
  }
  return CLOUDINARY.base + '/' + type + '/upload/' + id
}

class Account extends Component {
  constructor(props){
    super(props)
    const user = props.user || {}
    this.state = {
      user: user,
      avatarProgress: 0,
      avatarUploading: false
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
      const timestamp = Date.now()
      const tags = 'app,avatar'
      const folder = 'avatar'
      const accessToken = this.state.user.accessToken

      request.post(config.api.base + config.api.signature, {
        accessToken: accessToken,
        timestamp: timestamp,
        folder: folder,
        tags: tags,
      })
      .catch((err) => {
        console.log(err)
      })
      .then((data) => {
        if(data && data.success){
          // data.data
          let signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret

          signature = sha1(signature)

          const body = new FormData()

          body.append('folder', folder)
          body.append('signature', signature)
          body.append('tags', tags)
          body.append('timestamp', timestamp)
          body.append('api_key', CLOUDINARY.api_key)
          body.append('resource_type', 'image')
          body.append('file', avatarData)

          this._upload(body)
        }
      })
    })
  }

  _upload(body){
    const xhr = new XMLHttpRequest()
    const url = CLOUDINARY.image

    this.setState({
      avatarUploading: true,
      avatarProgress: 0
    })

    xhr.open('POST', url)
    xhr.onload = () => {
      if(xhr.status !== 200){
        Alert.alert('请求失败')
        console.log(xhr.responseText)

        return
      }

      if(!xhr.responseText){
        Alert.alert('请求失败')

        return
      }

      let response

      try {
        response = JSON.parse(xhr.response)
      }
      catch (e) {
        console.log(e)
        console.log('parse fails')
      }

      if(response && response.public_id){
        const user = this.state.user
        user.avatar = response.public_id

        this.setState({
          avatarUploading: false,
          avatarProgress: 0,
          user: user
        })

        this._asyncUser(true)
      }
    }

    if(xhr.upload){
      xhr.upload.onprogress = (event) => {
        if(event.lengthComputable){
          const percent = Number((event.loaded / event.total).toFixed(2))

          this.setState({
            avatarProgress: percent
          })
        }
      }
    }

    xhr.send(body)
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
            AsyncStorage.setItem('user', JSON.stringify(user))
          })
        }
      })
    }
  }

  render(){
    const {user, avatarUploading, avatarProgress} = this.state
    return (
      <View style={styles.container}>
      {
        user.avatar
        ? <TouchableOpacity onPress={this._pickPhoto.bind(this)} style={styles.avatarContainer}>
          <ImageBackground source={{uri: avatar(user.avatar, 'image')}} style={styles.avatarContainer}>
            <View style={styles.avatarBox}>
              {
                avatarUploading
                ? <Progress.Circle
                  showsText={true}
                  size={75}
                  color={'#ee735c'}
                  progress={avatarProgress}
                  indeterminate={true} />
                : <Image
                  source={{uri: avatar(user.avatar, 'image')}}
                  style={styles.avatar}/>
              }
            </View>
            <Text style={styles.avatarTip}>戳这里换头像</Text>
          </ImageBackground>
        </TouchableOpacity>
        : <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto.bind(this)}>
          <Text style={styles.avatarTip}>添加头像</Text>
          <View style={styles.avatarBox}>
            {
              avatarUploading
              ? <Progress.Circle
                showsText={true}
                size={75}
                color={'#ee735c'}
                progress={avatarProgress}
                indeterminate={true} />
              : <Icon
                name='ios-cloud-upload-outline'
                style={styles.plusIcon} />
            }
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