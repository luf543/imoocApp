import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'

import request from '../common/request'
import config from '../common/config'

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  ListView,
} from 'react-native';
import List from '.';

const {height, width} = Dimensions.get('window')

class Detail extends Component {
  constructor(props){
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state =  {
      data: props.navigation.state.params.data,
      dataSource: ds.cloneWithRows([]),

      //video loads
      videoOk: true,
      videoLoaded: false,
      playing: false,

      paused: false,
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
    this.setState({
      videoOk: false
    })
    console.log(e)
    console.log('error')
  } 
  _rePlay(){
    this.refs.videoPlayer.seek(0)
  }
  _pause(){
    if(!this.state.paused){
      this.setState({
        paused: true
      })
    }
  }
  _resume(){
    if(this.state.paused){
      this.setState({
        paused: false
      })
    }
  }

  componentDidMount(){
    this._fetchData()
  }
  _fetchData(){
    request.get(config.api.base + config.api.comment, {
      id: 124,
      accessToken: '1212312'
    })
    .then((data) => {
      if(data && data.success){
        const comments = data.data
        if(comments && comments.length > 0){
          this.setState({
            comments: comments,
            dataSource: this.state.dataSource.cloneWithRows(comments)
          })
        }
      }
    })
    .catch(((error) => {
      console.log(error)
    }))
  }

  _renderRow(row){
    return (
      <View key={row._id} style={styles.replyBox}>
        <Image style={styles.replyAvatar} source={{uri: row.replyBy.avatar}}/>
        <View style={styles.reply}>
          <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
          <Text style={styles.replyContent}>{row.content}</Text>
        </View>
      </View>
    )
  }

  render(){
    const {data, rate, muted, resizeMode, repeat, videoLoaded, videoProgress, playing, paused, videoOk} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.videoBox}>
          <Video
            ref='videoPlayer' //相当于对这个组件的引用
            source={{uri: data.video}}  //视频地址
            style={styles.video}
            volume={5}  //声音的放大倍数
            paused={paused}  //是否暂停，默认false，打开页面就可以播放
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
            !videoOk && <Text style={styles.failText}>视频出错了!很抱歉</Text>
          }

          {
            //color写在组件ActivityIndicator上，否则会有报警
            videoOk && !videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading}/>
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
          {
            //TouchableOpacity必须要有子元素，不能为空
            videoLoaded && playing
            ? <TouchableOpacity
                onPress={this._pause.bind(this)}
                style={styles.pauseBtn}>
                {
                  paused
                  ? <Icon
                    onPress={this._resume.bind(this)}
                    name='ios-play'
                    size={48}
                    style={styles.resumeIcon}/>
                  : <Text></Text>
                }
              </TouchableOpacity>
            : null
          }

          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * videoProgress}]}></View>
          </View>
        </View>
        <ScrollView
          enableEmptySections={true}	//ListView去除警告
					showsVerticalScrollIndicator={false}	//ScrollView当此属性为true的时候，显示一个垂直方向的滚动条
          automaticallyAdjustContentInsets={false}	//禁止自动调整内容属性
          style={styles.scrollView}
        >
          <View style={styles.infoBox}>
            <Image style={styles.avatar} source={{uri: data.author.avatar}}/>
            <View style={styles.descBox}>
              <Text style={styles.nickname}>{data.author.nickname}</Text>
              <Text style={styles.title}>{data.title}</Text>
            </View>
          </View>

          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
          />
        </ScrollView>
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
    height: width * 0.56,
    backgroundColor: '#000'
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  failText: {
    position: 'absolute',
    left: 0,
    top: 90,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 90,
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
		top: 90,
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
  },
  pauseBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: width * 0.56,
  },
  resumeIcon: {
		position: 'absolute',
		top: 90,
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
  },

  infoBox: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },
  descBox: {
    flex: 1
  },
  nickname: {
    fontSize: 18
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },

  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  replayNickname: {
    color: '#666'
  },
  replyContent: {
    marginTop: 4,
    color: '#666'
  },
  reply: {
    flex: 1
  }
});

export default Detail