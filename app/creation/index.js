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
} from 'react-native';


const {height, width} = Dimensions.get('window')

const cachedResults = {
	nextPage: 1,
	items: [],
	total: 0
}

class List extends Component {
	constructor(props){
		super(props)
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			isLoadingTail: false,
			dataSource: ds.cloneWithRows([]),
		};
	}

	_renderRow(row){
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

	componentDidMount(){
		this._fetchData(1)
	}

	_fetchData(page){
		this.setState({
			isLoadingTail: true
		})


		request.get(config.api.base + config.api.creations, {
			accessToken: 'adasd',
			page: page
		})
			.then((data) => {
				if (data.success) {
					let items = cachedResults.items.slice()

					items = items.concat(data.data)

					cachedResults.items = items
					cachedResults.total = data.total

					setTimeout(() => {
						this.setState({
							isLoadingTail: false,
							dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
						})
					}, 2000)
				}
			})
			.catch((error) => {
				this.setState({
					isLoadingTail: false
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

		return <ActivityIndicator style={styles.loadingMore} />
	}

	render(){
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>列表页面</Text>
				</View>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this._renderRow.bind(this)}
					renderFooter={this._renderFooter.bind(this)}
					onEndReached={this._fetchMoreData.bind(this)}
					onEndReachedThreshold={20}
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