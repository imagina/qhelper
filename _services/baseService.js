import http from "axios"
import {remember} from "@imagina/qhelper/_plugins/remember"
import {helper} from "@imagina/qhelper/_plugins/helper";
import config from 'src/config/index'

export default {
	/**
	 * Create a item
	 * @param configName
	 * @param data
	 * @returns {Promise<any>}
	 */
	create(configName, data) {
		return new Promise((resolve, reject) => {
			//Validations
			if (!configName) return reject('Config name is required')
			if (!data) return reject('Data is required')
			let urlApi = config(configName)//Get url from config
			let dataRequest = helper.toSnakeCase(data)
			//Request
			http.post(urlApi, {attributes:dataRequest}).then(response => {
				resolve(response.data)//Successful response
			}).catch(error => {
				reject(error.response.data.errors)//Failed response
			})
		})
	},

	/**
	 * Get items by params
	 * @param configName
	 * @param params {params : {}, remember: boolean}
	 * @returns {Promise<any>}
	 */
	index(configName, params = {}) {
		return new Promise((resolve, reject) => {
			//Validations
			if (!configName) return reject('Config name is required')
			params.remember == undefined ? params.remember = true : false
			params.refresh == undefined ? params.refresh = false : true

			let urlApi = config(configName)//Get url from config
			let requestParams = (params && params.params) ? params.params : false//Get request params
			//Remember request
			if (params && params.remember) {
				let key = !requestParams ? configName : configName + JSON.stringify(requestParams)//Key for rememeber
				remember.async(//Call method remember
					key, (3600 * 3),
					() => {
						return http.get(urlApi, {params: requestParams})
					},params.refresh
				).then(response => {
					resolve(response)//Successful response
				}).catch(error => {
					reject(error)//Failed response
				})
			} else {//Request without remember
				http.get(urlApi, {params: requestParams}).then(response => {
					resolve(response.data)//Successful response
				}).catch(error => {
					reject(error.response.data.errors)//Failed Response
				})
			}
		})
	},

	/**
	 * Get a item
	 * @param configName
	 * @param criteria
	 * @param params {params : {}, remember: boolean}
	 * @returns {Promise<any>}
	 */
	show(configName, criteria, params) {
		return new Promise((resolve, reject) => {
			//Validations
			if (!configName) return reject('Config name is required')
			if (!criteria) return reject('Criteria is required')
			params.refresh == undefined ? params.refresh = false : true

			let urlApi = config(configName) + '/' + criteria//Get url from config
			let requestParams = (params && params.params) ? params.params : false//Get request params

			if (params && params.remember) {//Remember request
				let key = !requestParams ? configName : configName + JSON.stringify(requestParams)//Key for rememeber
				remember.async(//Call method remember
					key, (3600 * 3),
					() => {
						return http.get(urlApi, {params: requestParams})
					},params.refresh
				).then(response => {
					resolve(response)//Successful response
				}).catch(error => {
					reject(error)//Failed response
				})
			} else {//Request without remember
				http.get(urlApi, {params: requestParams}).then(response => {
					resolve(response.data)//Successful response
				}).catch(error => {
					reject(error.response.data.errors)//Failed Response
				})
			}
		})
	},

	/**
	 * Delete a item
	 * @param configName
	 * @param criteria
	 * @param data
	 * @param params {params : {}, remember: boolean}
	 * @returns {Promise<any>}
	 */
	update(configName, criteria, data, params = {params : {}}) {
		return new Promise((resolve, reject) => {
			//Validations
			if (!configName) return reject('Config name is required')
			if (!criteria) return reject('Criteria is required')
			if (!data) return reject('Data is required')
			let urlApi = config(configName) + '/' + criteria//Get url from config
			//Get request params
			let requestParams = Object.assign(params.params, {attributes : helper.toSnakeCase(data)})
			//Request
			http.put(urlApi, requestParams).then(response => {
				resolve(response.data)//Successful response
			}).catch(error => {
				reject(error.response.data.errors)//Failed response
			})
		})
	},

	/**
	 * Delete a item
	 * @param configName
	 * @param criteria
	 * @param data
	 * @param params {params : {}, remember: boolean}
	 * @returns {Promise<any>}
	 */
	delete(configName, criteria, params) {
		return new Promise((resolve, reject) => {
			//Validations
			if (!configName) return reject('Config name is required')
			if (!criteria) return reject('Criteria is required')
			let urlApi = config(configName) + '/' + criteria//Get url from config
			let requestParams = (params && params.params) ? params.params : false//Get request params
			//Request
			http.delete(urlApi, requestParams).then(response => {
				resolve(response.data)//Successful response
			}).catch(error => {
				reject(error.response.data.errors)//Failed response
			})
		})
	},
}