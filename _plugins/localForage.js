import LocalForage from "localforage";
import {helper} from "@imagina/qhelper/_plugins/helper";

class localForage {

  constructor() {
    //Order config to localForage
    let configDrivers = () => {
      let drivers = env('LOCALFORAGE_DRIVERS','INDEXEDDB,LOCALSTORAGE,WEBSQL').split(',')
      let data = []
      drivers.forEach((driver) => {
        data.push(LocalForage[driver])
      })
      return data
    }

    //Config for LocalForage
    LocalForage.config({
      driver: configDrivers(),
      name: env('LOCALFORAGE_NAME','ProjectDB'),
      version: 1,
      storeName: 'storage',
    });

    //Contructor of method get
    this.get = {
      //Return data by index name
      item: (index) => {
        if (index) {
          return new Promise((resolve, reject) => {
            LocalForage.getItem(index).then(value => {
              resolve(value)
            })
          })
        }else{
          return 'Error: index requiered'
        }
      },
      //Return data of one or more items
      //param type {array} require
      items: (items) => {
        if (Array.isArray(items) && items.length) {
          return new Promise(async (resolve, reject) => {
            let dataItems = {}

            //Get data from all items
            for(var index in items){
              dataItems[items[index]] = await LocalForage.getItem(items[index])
            }

            resolve(dataItems) //Return data
          })
        }else{
          return 'Error: param type {array} require'
        }
      },
      //return all data
      all: () => {
        return new Promise((resolve, reject) => {
          //Get all keys in storage

          LocalForage.keys().then(function(keys) {
            if(keys.length){
              let allStorage = {};
              //Get data by key
              keys.forEach((key,index) => {
                LocalForage.getItem(key).then(value => {
                  allStorage[key] = value //Add data from storage
                  if(keys.length == index)
                    resolve(allStorage);
                })
              })
            }else{
              resolve(allStorage);
            }
          })
        })
      }
    }
  }

  //Insert or update
  set(index, data) {
    if (index) {
      return new Promise((resolve, reject) => {
        LocalForage.setItem(index, data).then(value => {
          resolve(value)
        }).catch(error => {
          console.error('Error: Localforage method SET. ',error)
          reject(error)
        })
      })
    }
  }

  //Remove an item from storage
  remove(index) {
    if(index){
      return new Promise((resolve, reject) => {
        LocalForage.removeItem(index).then(value => {
          resolve(true)
        })
      })
    }
  }

  //Return all keys fron storage
  keys() {

      return new Promise((resolve, reject) => {
        LocalForage.keys().then(value => {
          resolve(value)
        })
      })

  }

  //Remove all items from storage
  clear() {
    return new Promise((resolve, reject) => {
      LocalForage.clear().then(value => {
        resolve(true)
      })
    })
  }

  //Restore cache, save any data
  async restore(){
    let data = {//Get data to save
      userToken: await this.get.item("userToken"),
      userId: await this.get.item("userId"),
      userData: await this.get.item("userData"),
      offRequests : await this.get.item("offlineRequests"),
      notifications : await this.get.item("notifications") || [],
      departmentId : await this.get.item("auth.department.id"),
      roleId : await this.get.item("auth.role.id"),
    }

    //Clear cache
    await this.clear()

    //Restore cache
    this.set('userToken', data.userToken)
    this.set('userId', data.userId)
    this.set('userData', data.userData)
    this.set('offlineRequests', data.offRequests)
    this.set('notifications', data.notifications)
    this.set('auth.department.id', data.departmentId)
    this.set('auth.role.id', data.roleId)
  }
}

const Forage = new localForage();


export default ({Vue}) => {
  Vue.prototype.$storage = Forage;
}

export {Forage};
