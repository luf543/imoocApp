import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
} from 'react-native';


const {height, width} = Dimensions.get('window')

class List extends Component {
  constructor(props){
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows([
        {
            "_id": "650000200309197305",
            "thumb": "http://dummyimage.com/1280x720/fc7b24)",
            "title": "测试内容4239",
            "video": "http://mp4.vjshi.com/2017-07-06/9025ac69534bfa2a413bd9e293925925.mp4"
        },
        {
            "_id": "340000199203239804",
            "thumb": "http://dummyimage.com/1280x720/94c8a4)",
            "title": "测试内容4239",
            "video": "http://mp4.vjshi.com/2017-07-06/9025ac69534bfa2a413bd9e293925925.mp4"
        },
        {
            "_id": "65000020110523069X",
            "thumb": "http://dummyimage.com/1280x720/dea3a5)",
            "title": "测试内容4239",
            "video": "http://mp4.vjshi.com/2017-07-06/9025ac69534bfa2a413bd9e293925925.mp4"
        },
        {
            "_id": "640000197611232929",
            "thumb": "http://dummyimage.com/1280x720/3553a3)",
            "title": "测试内容4239",
            "video": "http://mp4.vjshi.com/2017-07-06/9025ac69534bfa2a413bd9e293925925.mp4"
        },
        {
            "_id": "330000200007142734",
            "thumb": "http://dummyimage.com/1280x720/d3ec41)",
            "title": "测试内容4239",
            "video": "http://mp4.vjshi.com/2017-07-06/9025ac69534bfa2a413bd9e293925925.mp4"
        },
        {
            "_id": "650000200510146390",
            "thumb": "http://dummyimage.com/1280x720/f3fc82)",
            "title": "测试内容4239",
            "video": "http://mp4.vjshi.com/2017-07-06/9025ac69534bfa2a413bd9e293925925.mp4"
        },
        {
            "_id": "460000199904278627",
            "thumb": "http://dummyimage.com/1280x720/c8719b)",
            "title": "测试内容4239",
            "video": "http://mp4.vjshi.com/2017-07-06/9025ac69534bfa2a413bd9e293925925.mp4"
        },
        {
            "_id": "620000200404083159",
            "thumb": "http://dummyimage.com/1280x720/3883eb)",
            "title": "测试内容4239",
            "video": "http://mp4.vjshi.com/2017-07-06/9025ac69534bfa2a413bd9e293925925.mp4"
        }
      ]),
    };
  }
  renderRow(row){
    return (
      <TouchableHighlight>
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <View>
            <Image
              source={{uri: row.thumb}}
              style={styles.thumb} />
            <Icon
              name='ios-play'
              size={28}
              style={styles.play}/>
          </View>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name='ios-heart-outline'
                size={28}
                style={styles.up}/>
              <Text style={styles.handleText}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name='ios-chatboxes-outline'
                size={28}
                style={styles.commentIcon}/>
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#FFF'
  },
  thumb: {
    width: width,
    height: width * 0.56,
    resizeMode: 'cover'
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66'
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width / 2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  up: {
    fontSize: 22,
    color: '#333'
  },
  commentIcon: {
    fontSize: 22,
    color: '#333'
  }

});

export default List