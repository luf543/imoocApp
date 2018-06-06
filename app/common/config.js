'use strict'

export default {
	header: {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	},
	api: {
		base: 'http://rapapi.org/mockjs/34628/',
		creations: 'api/creations',
		up: 'api/up'
	}
}