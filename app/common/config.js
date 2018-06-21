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
		base: 'https://www.easy-mock.com/mock/5b286fd9b2d7376412a0c42f/',
		creations: 'api/creations',
		comments: 'api/comments',
		comment: 'api/comments',
		up: 'api/up',
		signup: 'api/u/signup',
		verify: 'api/u/verify',
		update: 'api/u/update',
		signature: 'api/signature',
	}
}