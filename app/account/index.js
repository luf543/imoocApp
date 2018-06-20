import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {height, width} = Dimensions.get('window')

class Account extends Component {
  constructor(props){
    super(props)
    const user = {}
    this.state = {
      user: user
    }
  }

  componentDidMount(){
  }

  render(){
    const {user} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarTip}>添加头像</Text>
          <TouchableOpacity style={styles.avatarBox}>
            <Icon
              name='ios-cloud-upload-outline'
              style={styles.plusIcon}/>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#eee'
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