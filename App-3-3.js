/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class Son extends Component {
  constructor(props){
    console.log('child', 'constructor')
    super(props)
    this.state = {
      times: props.times
    }
  }

  timesPlus(){
    var times = this.state.times
    times++
    this.setState({
      times: times
    })
  }

  componentWillMount(){
    console.log('child', 'componentWillMount')
  }

  componentDidMount(){
    console.log('child', 'componentDidMount')
  }

  componentWillReceiveProps(props){
    console.log(this.props)
    console.log('child', 'componentWillReceiveProps')
    this.setState({
      times: props.times
    })
  }

  shouldComponentUpdate(){
    console.log('child', 'shouldComponentUpdate')
    return true
  }

  componentWillUpdate(){
    console.log('child', 'componentWillUpdate')
  }

  componentDidUpdate(){
    console.log('child', 'componentDidUpdate')
  }

  timesReset(){
    this.props.timesReset()
  }

  render(){
    console.log('child', 'render')
    return (
      <View>
        <Text style={styles.welcome} onPress={this.timesPlus.bind(this)}>
          儿子：有本事揍我啊！
        </Text>
        <Text style={styles.instructions}>
          你居然揍我 {this.state.times} 次
        </Text>
        <Text style={styles.instructions} onPress={this.timesReset.bind(this)}>
          信不信我亲亲你
        </Text>
      </View>
    );
  }
}

export default class App extends Component {
  constructor(props){
    console.log('fater', 'constructor')
    super(props)
    this.state = {
      hit: false,
      times: 2
    }
  }

  componentWillMount(){
    console.log('fater', 'componentWillMount')
  }

  componentDidMount(){
    console.log('fater', 'componentDidMount')
  }

  shouldComponentUpdate(){
    console.log('fater', 'shouldComponentUpdate')
    return true
  }

  componentWillUpdate(){
    console.log('fater', 'componentWillUpdate')
  }

  componentDidUpdate(){
    console.log('fater', 'componentDidUpdate')
  }

  timesReset(){
    this.setState({
      times: 0
    })
  }

  willHit(){
    this.setState({
      hit: !this.state.hit
    })
  }

  timesPlus(){
    var times = this.state.times
    times += 3
    this.setState({
      times: times
    })
  }

  render(){
    console.log('fater', 'render')
    return (
      <View style={styles.container}>
        {
          this.state.hit
          ? <Son times={this.state.times} timesReset={this.timesReset.bind(this)} />
          : null
        }
        <Text style={styles.welcome} onPress={this.timesReset.bind(this)}>
          老子说：心情好就放你一马
        </Text>
        <Text style={styles.instructions} onPress={this.willHit.bind(this)}>
          到底揍不揍
        </Text>
        <Text style={styles.instructions}>
          就揍了你 {this.state.times} 次而已
        </Text>
        <Text style={styles.instructions} onPress={this.timesPlus.bind(this)}>
          不听话，再揍你 3 次
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    padding: 30,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
});
