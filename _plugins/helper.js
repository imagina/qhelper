import {Cookies, LocalStorage, Loading, QSpinnerHourglass} from 'quasar'
import {Forage} from '@imagina/qhelper/_plugins/localForage' //LocalForage
import {Notify} from 'quasar'
import Config from 'src/config/index';

class Helper {

  constructor() {
    this.storage = Forage
  }

  loadingShow() {
    Loading.show({
      spinner: QSpinnerHourglass,
      spinnerColor: 'white',
      //customClass : 'bg-loading'
      //message: 'Some message',
      //messageColor: 'blue',
      //spinnerSize: 250, // in pixels
      //customClass : 'bg-primary'
    })
  }

  loadingHidden() {
    Loading.hide();
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
    window.open(Config('api.fha_show_lead') + id, '_blank')
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
}

const helper = new Helper();

export default ({Vue}) => {
  Vue.prototype.$helper = helper;
}

export {helper};
