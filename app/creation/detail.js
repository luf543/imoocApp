import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const {height, width} = Dimensions.get('window')

class Detail extends Component {
  constructor(props){
    super(props)
    this.state =  {
      data: props.navigation.state.params.data,

      //video loads
      videoLoaded: false,
      playing: false,

      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,

      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false
    }
  }

  _onLoadStart(){
    console.log('load start')
  }
  _onLoad(){
    console.log('loads')
  }
  _onProgress(data){
    const {videoLoaded, playing} = this.state

    const duration = data.playableDuration
    const currentTime = data.currentTime
    const percent = Number((currentTime / duration).toFixed(2)) //取小数点后两位
    const newState = {
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    }

    if(!videoLoaded){
      newState.videoLoaded = true
    }
    if(!playing){
      newState.playing = true
    }
    this.setState(newState)
  }
  _onEnd(){
    this.setState({
      videoProgress: 1,
      playing: false
    })
  }
  _onError(e){
    console.log(e)
    console.log('error')
  } 
  _rePlay(){
    this.refs.videoPlayer.seek(0)
  }

  render(){
    const {data, rate, muted, resizeMode, repeat, videoLoaded, videoProgress, playing} = this.state
    return (
      <View style={styles.container}>
        <Text>详情页面{data._id}</Text>
        <View style={styles.videoBox}>
          <Video
            ref='videoPlayer' //相当于对这个组件的引用
            source={{uri: data.video}}  //视频地址
            style={styles.video}
            volume={5}  //声音的放大倍数
            paused={false}  //是否暂停，默认false，打开页面就可以播放
            rate={rate} //取值0/1，0暂停，1正常
            muted={muted} //是否静音，true为静音
            resizeMode={resizeMode} //视频在视频容器中的拉伸方式，充满整个播放区域，还是自动适应
            repeat={repeat} //是否重复播放

            onLoadStart={this._onLoadStart.bind(this)}
            onLoad={this._onLoad.bind(this)}
            onProgress={this._onProgress.bind(this)}
            onEnd={this._onEnd.bind(this)}
            onError={this._onError.bind(this)}
          />
          {
            //color写在组件ActivityIndicator上，否则会有报警
            !videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading}/>
          }

          {
            videoLoaded && !playing
            ? <Icon
                onPress={this._rePlay.bind(this)}
                name='ios-play'
                size={48}
                style={styles.playIcon}/>
            : null
          }

          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * videoProgress}]}></View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  videoBox: {
    width: width,
    height: 360,
    backgroundColor: '#000'
  },
  video: {
    width: width,
    height: 360,
    backgroundColor: '#000'
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 180,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600'
  },
  playIcon: {
    position: 'absolute',
		top: 140,
		left: width / 2 - 30,
		width: 60,
		height: 60,
		paddingTop: 6,
		paddingLeft: 22,
		backgroundColor: 'transparent',
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 30,
		color: '#ed7b66'
  }
});

export default Detail