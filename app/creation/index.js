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
} from 'react-native';


const {height, width} = Dimensions.get('window')

class List extends Component {
	constructor(props){
		super(props)
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			dataSource: ds.cloneWithRows([]),
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
	componentDidMount(){
		this._fetchData()
	}
	_fetchData(){
		request.get(config.api.base + config.api.creations, {
			accessToken: 'adasd'
		})
			.then((data) => {
				if (data.success) {
					this.setState({
						dataSource: this.state.dataSource.cloneWithRows(data.data)
					})
				}
			})
			.catch((error) => {
				console.error(error)
			})
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