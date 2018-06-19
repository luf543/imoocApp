'use strict'

import * as queryString from 'query-string'
import * as _ from 'lodash'
// import Mock from 'mockjs'
import config from './config'

export default {
  get(url, params){
    if(params){
      url += '?' + queryString.stringify(params)
    }

    return fetch(url)
      .then((response) => response.json())
      // .then((responseJson) => Mock.mock(responseJson))
  },
  post(url, body){
    const options = _.extend(config.header, {
      body: JSON.stringify(body)
    })

    return fetch(url, options)
      .then((response) => response.json())
      // .then((responseJson) => Mock.mock(responseJson))
  }
}
