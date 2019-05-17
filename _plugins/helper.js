import {Cookies, LocalStorage, Loading, QSpinnerHourglass} from 'quasar'
import {Forage} from '@imagina/qhelper/_plugins/localForage' //LocalForage
import {Notify} from 'quasar'
import Config from 'src/config/index';
import {array} from "@imagina/qhelper/_plugins/array"
import {alert} from "@imagina/qhelper/_plugins/alert";
import store from 'src/store/index'

class Helper {
	constructor() {
		this.storage = Forage
		this.array = array
		this.alert = alert
	}
	
	loadingShow() {
		Loading.show({
			spinner: QSpinnerHourglass,
			spinnerColor: 'primary',
			customClass : 'bg-loading no-shadow',
			message: 'Loading...',
			messageColor: 'primary',
			//spinnerSize: 250, // in pixels
		})
	}

	loadingHidden() {
		Loading.hide();
	}

	/*return timestamp in seconds unix*/
	timestamp() {
		return Date.now() / 1000 | 0
	}

	/*mask value with format phone US*/
	maskPhone(number) {
		if (number) {
			let value = this.getInt(number)
			let response = ''

			if (value) {
				value = value.toString()
				value.length >= 1 ? response += '(' : false;
				response += value.substr(0, 3)
				value.length >= 4 ? response += ') ' : false;
				response += value.substr(3, 3)
				value.length >= 7 ? response += '-' + value.substr(6, 4) : false;
			} else {
				response = value ? value[0] : ''
			}

			return response
		} else {
			return number
		}
	}

	/*get only numbers from a string*/
	getInt(value) {
		let regex = /(\d+)/g;
		let response = value.match(regex)
		response = response ? response.join('') : response;

		return response
	}

	/**
	 * Return range date
	 * @param type {string} requiere : ('today','currentMonth','lastMonth')
	 */
	rangeDate(type) {
		type ? true : type = 'today'

		let from = new Date(); //Create object date
		let to = new Date(); //Create object date
		switch (type) {
			case 'today':
				break;
			case 'yesterday':
				from.setSeconds(-86400);
				to.setSeconds(-86400);
				break;
			case 'tomorrow':
				from.setSeconds(86400);
				to.setSeconds(86400);
				break;
			case 'currentMonth':
				from.setDate(1);
				to = new Date(to.getFullYear(), from.getMonth() + 1, 0);
				break;
			case 'lastMonth':
				from = new Date(from.getFullYear(), from.getMonth() - 1, 1);
				to = new Date(to.getFullYear(), to.getMonth(), 0);
				break;

		}

		return {
			from: from.getFullYear() + '/' + (from.getMonth() + 1) + '/' + from.getDate(),
			to: to.getFullYear() + '/' + (to.getMonth() + 1) + '/' + to.getDate(),
		};
	}

	/*set names months in dom*/
	nameMonths() {
		var d = new Date();
		var mount = d.getMonth()
		var months = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

		return [
			{label: months[(mount != 0) ? (mount - 1) : 11], value: 'lastMonth'},
			{label: months[mount], value: 'currentMonth'},
			{label: 'Today', value: 'today'}
		];
	}

	/**
	 * Clear Cache Data
	 * @param data type {string} required
	 *
	 */
	async clearCache(data) {
		await this.storage.keys().then(keys => {
			keys.forEach(el => {
				if (el.indexOf(data) > -1)
					this.storage.remove(el);
			})
		});
	}

	/**
	 * redirect to Lead view, Old system
	 * @param id
	 */
	goToLead(id) {
		window.open(Config('apiRoutes.api.fha_show_lead') + id, '_blank')
	}

	/**
	 * load latitude and logitude
	 */
	async loadPosition() {
		try {
			const position = await this.getCurrentPosition();
			return position.coords;
		} catch (error) {
		}
	}

	/**
	 * get position of navigator
	 */
	getCurrentPosition(options = {}) {
		return new Promise((resolve, reject) => {
			navigator.permissions.query({'name': 'geolocation'})
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	}

	/**
	 * Convert fields to frontend
	 * @param field
	 */
	convertToFrontField(fields = [], mergeFields = []){
		let response = {}

		//Merge fields
		if(mergeFields.length){
			mergeFields.forEach(mergeField => {
				//Search merge field name in fields
				
				var existField = false;
				fields.forEach((field,index) => {
					if(field.name == mergeField.name){
            existField = true;
            if(mergeField.value){
              fields[index] = mergeField
            }else{
              fields[index].id = mergeField.id
						}
					}
				})
				
				if(!existField){
          fields.push(mergeField)
				}
			})
		}
		//Conver fields
		fields.forEach(field => {
			response[field.name] = field
		})
		return response
	}

	/**
	 * Convert to backend fields
	 * @param fields
	 */
	convertToBackField(fields){
		let response = []
		for(var field in fields){
			response.push(fields[field])
		}
		return response
	}
  
  /**
   * Convert strings to snake_case
   * @param object
   */
  convertStringToSnakeCase(string) {
    return string.replace(/[\w]([A-Z0-9])/g, function (m) {
      return m[0] + "_" + m[1];
    }).toLowerCase();
  }
	
	/**
	 * Convert object keys to snake_case
	 * @param object
	 */
  toSnakeCase(object) {
    //function recursive to loop all items from object
    let convertObject = (dataObject) => {
      let response = {}//Object to save fields vonverted
      //Loop all items for convert
      
      for (var item in dataObject) {

        let itemValue = dataObject[item]//Value from item
        if(item !== 'options'
          && item !== 'fields'
          && item !== 'settings'
          && item !== 'permissions'){
          //If value is object, also convert value
          if ((typeof itemValue === 'object' && itemValue !== null)){
            itemValue = convertObject(dataObject[item])
        }
          //Add to response new Key with Value if isn't null
          //if((itemValue !== null) && (itemValue !== undefined))
					response[this.convertStringToSnakeCase(item)] = itemValue
        }else
          response[item] = itemValue
      }
      return response
    }
    return convertObject(object)//Return response
  }

  checkPassword(password){
  	// Must be at least 8 characters and contain a at least 1 lowercase character, at least 1 uppercase character and a number.
    return password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
	}

	/**
	 * redirect to google maps with encode address
	 * @param address
	 */
	map(address) {
		if /* if we're on iOS, open in Apple Maps */
		((navigator.platform.indexOf("iPhone") != -1) ||
			(navigator.platform.indexOf("iPod") != -1) )
			window.open("maps://maps.google.com/maps?q=" + encodeURI(address));

		else /* else use Google */
			window.open("https://maps.google.com/maps?q=" + encodeURI(address));
	}
}

const helper = new Helper();

export default ({Vue}) => {
	Vue.prototype.$helper = helper;
}

export {helper};
