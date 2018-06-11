import React, { Component } from 'react';

import Video from 'react-native-video'

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

const {height, width} = Dimensions.get('window')

class Detail extends Component {
  constructor(props){
    super(props)
    this.state =  {
      data: props.navigation.state.params.data,
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
    console.log(data)
    console.log('progress')
  }
  _onEnd(){
    console.log('end')
  }
  _onError(e){
    console.log(e)
    console.log('error')
  }

  render(){
    const {data, rate, muted, resizeMode, repeat} = this.state
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

            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
});

export default Detail