import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

import request from '../common/request'
import config from '../common/config'
import {
	StyleSheet,
	Text,
	View,
	ListView,
	TouchableHighlight,
	Image,
	Dimensions,
	ActivityIndicator,
	RefreshControl,
	Alert,
} from 'react-native';


const {height, width} = Dimensions.get('window')

const cachedResults = {
	nextPage: 1,
	items: [],
	total: 0
}

class Item extends Component {
	constructor(props){
		super(props)
		const row = props.row
		this.state = {
			up: row.voted,
			row: row
		}
	}

	_up(){
		const { up, row } = this.state
		const url = config.api.base + config.api.up

		const body = {
			id: row._id,
			up: up ? 'no' : 'yes',
			accessToken: 'adsas'
		}

		request.post(url, body)
			.then((data) => {
				if(data && data.success){
					this.setState({
						up: !up
					})
				}else{
					Alert.alert('点赞失败，ee稍后重试')
				}
			})
			.catch((err) => {
				console.log(err)
				Alert.alert('点赞失败，稍后重试')
			})
	}

	render(){
		const row = this.state.row

		return(
			<TouchableHighlight onPress={this.props.onSelect}>
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
								name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
								size={28}
								style={[styles.up, this.state.up ? null : styles.down]}
								onPress={this._up.bind(this)}/>
							<Text style={styles.handleText} onPress={this._up.bind(this)}>喜欢</Text>
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
}

class List extends Component {
	constructor(props){
		super(props)
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			isRefreshing: false,
			isLoadingTail: false,
			dataSource: ds.cloneWithRows([]),
		};
	}

	_renderRow(row){
		return <Item
			key={row._id}
			onSelect={() => this._loadPage(row)}
			row={row} />
	}

	componentDidMount(){
		this._fetchData(1)
	}

	_fetchData(page){
		if(page !== 0){
			this.setState({
				isLoadingTail: true
			})
		}else{
			this.setState({
				isRefreshing: true
			})
		}
		

		request.get(config.api.base + config.api.creations, {
			accessToken: 'adasd',
			page: page
		})
		.then((data) => {
			if (data && data.success) {
				let items = cachedResults.items.slice()
				
				if(page !== 0){
					items = items.concat(data.data)
					cachedResults.nextPage += 1
				}else{
					items = data.data.concat(items)
				}

				cachedResults.items = items
				cachedResults.total = data.total

				if(page !== 0){
					this.setState({
						isLoadingTail: false,
						dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
					})
				}else{
					this.setState({
						isRefreshing: false,
						dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
					})
				}
			}
		})
		.catch((error) => {
			if(page !== 0){
				this.setState({
					isLoadingTail: false,
				})
			}else{
				this.setState({
					isRefreshing: false,
				})
			}
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

	_onRefresh(){
		this._fetchData(0)
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

	_loadPage(row){
		this.props.navigation.navigate('Detail', {
      data: row
		})
		// this.props.navigation.push({
		// 	routeName: 'Detail',
		// 	params:{
		// 		row: row
		// 	}
		// })
	}

	render(){
		return (
			<View style={styles.container}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this._renderRow.bind(this)}
					renderFooter={this._renderFooter.bind(this)}
					onEndReached={this._fetchMoreData.bind(this)}
					refreshControl={	//ScrollView指定RefreshControl组件，用于为ScrollView提供下拉刷新功能。
	          <RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh.bind(this)}
						tintColor='#ff6600'
						title='拼命加载中...'
						titleColor='#00ff00'
						colors={['#ff6600', '#00ff00', '#0000ff']}
						progressBackgroundColor='#ffff00'
	          />
	        }
					onEndReachedThreshold={20}	//ListView调用onEndReached之前的临界值，单位是像素。
					enableEmptySections={true}	//ListView去除警告
					showsVerticalScrollIndicator={false}	//ScrollView当此属性为true的时候，显示一个垂直方向的滚动条
					automaticallyAdjustContentInsets={false}	//ScrollView当滚动视图放在一个导航条或者工具条后面的时候，iOS系统是否要自动调整内容的范围。默认值为true。（译注：如果你的ScrollView或ListView的头部出现莫名其妙的空白，尝试将此属性置为false）
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
	down: {
		fontSize: 22,
		color: '#333'
	},
	up: {
		fontSize: 22,
		color: '#ed7b66'
	},
	commentIcon: {
		fontSize: 22,
		color: '#333'
	},
	loadingMore: {
		marginVertical: 20
	},
	loadingText: {
		color: '#777',
		textAlign: 'center'
	}
});

export default List