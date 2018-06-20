/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

import List from './app/creation/index'
import Detail from './app/creation/detail'
import Edit from './app/edit/index'
import Account from './app/account/index'
import Login from './app/account/login'

import {
  Platform,
  StyleSheet,
  YellowBox,
  AsyncStorage,
} from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader','Class RCTCxxModule']);

const headerStyle = {
  ios: {
    height: 52,
    paddingTop: 14,
    backgroundColor: '#ee735c'
  },
  android: {
    height: 0,
    paddingTop: 0
  }
}

const AccountStack = createStackNavigator({
  Account: { 
    screen: Account,
    navigationOptions: {
      headerTitle: '我的账户',
      headerStyle: headerStyle[Platform.OS],
      headerBackground: '#ee735c',
      headerTintColor: '#fff',
    }
  },
})

const ListStack = createStackNavigator({
  List: {
    screen: List,
    navigationOptions: {
      headerTitle: '列表页面',
      headerStyle: headerStyle[Platform.OS],
      headerBackground: '#ee735c',
      headerTintColor: '#fff',
    }
  },
  Detail: {
    screen: Detail,
    navigationOptions: {
      headerTitle: '视频详情页面',
      headerStyle: headerStyle[Platform.OS],
      headerBackground: '#ee735c',
      headerTintColor: '#fff',
    }
  },
})

const Tabs = createBottomTabNavigator(
  {
    List: ListStack,
    Edit: Edit,
    Account: AccountStack,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'List') {
          iconName = `ios-videocam${focused ? '' : '-outline'}`;
        } else if (routeName === 'Edit') {
          iconName = `ios-mic${focused ? '' : '-outline'}`;
        } else if (routeName === 'Account') {
          iconName = `ios-person${focused ? '' : '-outline'}`;
        }
        return <Icon name={iconName} size={28} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#ee735c',
      inactiveTintColor: 'gray',
      showLabel: false,
    },
  }
)

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: null,
      logined: false
    }
  }

  componentDidMount(){
    this._asyncAppStatus()
  }

  _asyncAppStatus(){
    AsyncStorage.getItem('user')
      .catch((err)=>{
        console.log(err)
        console.log('get fails')
      })
      .then((data) => {
        let user
        let newState = {}

        if(data){
          user = JSON.parse(data)
        }

        if(user && user.accessToken){
          newState.user = user
          newState.logined = true
        }else{
          newState.logined = false
        }

        this.setState(newState)
      })
  }

  _afterLogin(user){
    user = JSON.stringify(user)
    AsyncStorage.setItem('user', user)
      .then(() => {
        this.setState({
          logined: true,
          user: user
        })
      })
  }

  render() {
    if(!this.state.logined){
      return <Login afterLogin={this._afterLogin.bind(this)}/>
    }
    return <Tabs />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
