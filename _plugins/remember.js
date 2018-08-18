import {Cookies, LocalStorage} from 'quasar'
import Config from 'src/config/index'
import {helper} from '@imagina/qhelper/_plugins/helper';

class Remember {

  constructor() {
    this.storages = {
      Cookies,
      LocalStorage
    };
    this.storage = this.storages[Config('auth.default_storage')];
  }

  /*Return data in cache*/
  sync(key, seconds, callback) {
    let data = this.storage.get.item(key)
    let difference = data ? this.timestamp() - data.updated_at : seconds

    if (difference >= seconds || !data) {
      return callback();
    } else {
      return data.data
    }
  }

  /*Return data in cache*/
  async(key, seconds, callback) {
    return new Promise((resolve, reject) => {
      let data = this.storage.get.item(key)
      let difference = data ? helper.timestamp() - data.updated_at : seconds

      if (difference >= seconds || !data) {
        callback().then(response => {

          try {
            this.storage.set(key, {
              data: response.data.data,
              meta: response.data.meta ? response.data.meta : '',
              updated_at: helper.timestamp()
            })
          } catch(error) {
            console.log(error)
          }

          resolve(response.data);
        })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      } else {
        resolve(data);
      }

    })
  }
}

const remember = new Remember();

export default ({Vue}) => {

  Vue.prototype.$remember = remember;

}

export {remember};
