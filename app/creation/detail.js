import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'
import Button from 'react-native-button'

import request from '../common/request'
import config from '../common/config'

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ListView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import List from '.';

const {height, width} = Dimensions.get('window')

const cachedResults = {
	nextPage: 1,
	items: [],
	total: 0
}

class Detail extends Component {
  constructor(props){
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state =  {
      data: props.navigation.state.params.data,

      // comments
      dataSource: ds.cloneWithRows([]),

      //video loads
      videoOk: true,
      videoLoaded: false,
      playing: false,
      paused: false,
      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,

      // modal
      animationType: 'none',
      modalVisible: false,
      isSending: false,

      // video player
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
    this._fetchData(1)
  }

  _fetchData(page){
    this.setState({
      isLoadingTail: true
    })

		request.get(config.api.base + config.api.comments, {
      accessToken: 'adasd',
      creation: 124,
			page: page
		})
    .then((data) => {
      if (data && data.success) {
        let items = cachedResults.items.slice()
        
        items = items.concat(data.data)
        cachedResults.nextPage += 1

        cachedResults.items = items
        cachedResults.total = data.total

        this.setState({
          isLoadingTail: false,
          dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
        })
      }
    })
    .catch((error) => {
      this.setState({
        isLoadingTail: false,
      })
      console.error(error)
    })
	}

	_hasMore(){
		return cachedResults.items.length !== cachedResults.total
	}

	_fetchMoreData(){
		if (!this._hasMore() || this.state.isLoadingTail){
			return
		}
		const page = cachedResults.nextPage
		this._fetchData(page)
	}

	_renderFooter(){
		if (cachedResults.total !== 0 && !this._hasMore()){
			return (
				<View style={styles.loadingMore}>
					<Text style={styles.loadingText}>没有更多了</Text>
				</View>
			)
		}

		if (!this.state.isLoadingTail){
			return <View style={styles.loadingMore} />
		}
		return <ActivityIndicator style={styles.loadingMore} />
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

  _focus(){
    this._setModalVisible(true)
  }
  _blur(){

  }
  _closeModal(){
    this._setModalVisible(false)
  }

  _setModalVisible(isVisible){
    this.setState({
      modalVisible: isVisible
    })
  }

  _renderHeader(){
    const data = this.state.data
    return (
      <View style={styles.listHeader}>
        <View style={styles.infoBox}>
          <Image style={styles.avatar} source={{uri: data.author.avatar}}/>
          <View style={styles.descBox}>
            <Text style={styles.nickname}>{data.author.nickname}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              placeholder='敢不敢评论一个...'
              style={styles.content}
              multiline={true} //多行
              onFocus={this._focus.bind(this)}
            />
          </View>
        </View>

        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>
    )
  }

  _submit(){
    const {content, isSending, dataSource} = this.state
    if (!content){
      Alert.alert('留言不能为空！')
      return
    }
    if(isSending){
      return
    }

    this.setState({
      isSending: true
    }, () => {
      request.post(config.api.base + config.api.comment, {
        accessToken: 'asad',
        creation: '213213',
        content: content
      })
      .then((data) => {
        console.log('post comment', data)
        if(data && data.success){
          let items = cachedResults.items.slice()

          items = [{
            content: content,
            replyBy: {
              avatar: 'http://dummyimage.com/640x640/77e1d6)',
              nickname: '八戒'
            }
          }].concat(items)

          cachedResults.items = items
          cachedResults.total = cachedResults.total + 1

          this.setState({
            content: '',
            isSending: false,
            dataSource: dataSource.cloneWithRows(cachedResults.items)
          })

          this._setModalVisible(false)
        }else{
          throw new Error("接口正常，返回数据为空")
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          isSending: false,
        })
        Alert.alert('留言失败，稍后重试！','',[
          {text: 'OK', onPress: () => {
            this._setModalVisible(false)
          }},
        ])
      })
    })
  }

  render(){
    const {
      data,
      rate,
      muted,
      resizeMode,
      repeat,
      videoLoaded,
      videoProgress,
      playing,
      paused,
      videoOk,
      modalVisible,
      content,
    } = this.state
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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderHeader={this._renderHeader.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          onEndReached={this._fetchMoreData.bind(this)}
          onEndReachedThreshold={20}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        />

        <Modal
          animationType={'fade'}  //浮层出现的形式，动画类型
          visible={modalVisible}  //是否可见
          onRequestClose={() => {this._setModalVisible(false)}}  //关闭钩子
        >
          <View style={styles.modalContainer}>
            <Icon
              onPress={this._closeModal.bind(this)}
              name='ios-close-outline'
              style={styles.closeIcon}
            />

            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput
                  placeholder='敢不敢评论一个...'
                  style={styles.content}
                  multiline={true} //多行
                  onFocus={this._focus.bind(this)}
                  onBlur={this._blur.bind(this)}
                  defaultValue={content}
                  onChangeText={(text) => {
                    this.setState({
                      content: text
                    })
                  }}
                />
              </View>
            </View>

            <Button style={styles.submitBtn} onPress={this._submit.bind(this)}>评论</Button>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#fff'
  },
  closeIcon: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#ee735c'
  },
  submitBtn: {
    width: width - 20,
    padding: 16,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 4,
    fontSize: 18,
    color: '#ee735c'
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
  },

  loadingMore: {
		marginVertical: 20
	},
	loadingText: {
		color: '#777',
		textAlign: 'center'
  },
  
  listHeader: {
    width: width,
    marginTop: 10
  },
  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },
  content: {
    paddingLeft: 2,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 14,
    height: 80
  },

  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
});

export default Detail