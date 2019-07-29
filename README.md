## QHELPER 1.0.0

This package content methods with helpers to coding more easy and fast 

## Installation

`` npm i @imagina/qhelper@1.0.0 ``

## Base Service
This services has basic CRUD methods to make request. You can use this service calling `this.$crud` or
import it this way:

```js 
import crudServices from '@imagina/qhelper/_services/baseService'
``` 
- #### Methods
    - ###### create(configName, data)    
    - ###### index(configName, params : {params: {'params-request'}, refresh : true, cacheTime: (3600*3)})    
    - ###### show(configName, criteria, params : {params: {'params-request'}})    
    - ###### update(configName, criteria, data, params : {params: {'params-request'}})    
    - ###### delete(configName, criteria, params : {params: {'params-request'}})

- #### Usage: Ejm
    ``this.$crud.create('apiRoute-name', params : {})``    
    
## Plugins
- #### Alert
    Activate alert in bottom-right position. to use it, call `this.$alert` 
    .You too can import it this way:
    
    ```js
    import alert from '@imagina/qhelper/_plugins/alert'
    ```
    
    The availables types are : `success`, `error`, `info`, `warning`, `light`,`dark`. Usage:
    
    ```js
    this.$alert.success({message : '', timeOut : 4000})
    ```
    
- #### Storage
    Globaly Cache storage is available in `async` way. Usage : `this.$storage`
    #### Methods
    - ###### storage.set(key, data)
      Create/Update data in storage

    - ###### storage.get.item(key)  
      Get a item from storage  
            
    - ###### storage.remove(key)
      Remove a key from storage 
        
## Methods
You can use all methods from this package in your `APP` calling `$helper` in the template 
or `this.$helper` in scripts. you too can import it this way:

    ```js 
    import {helper} from '@imagina/qhelper/_plugins/helper' 
    ``` 

- ###### timetamp()
  Return current date in timestamp format, if set a parameter date, return this date in timestamp format    

- ###### maskPhone(value)
  Return a number with phone format 
  
- ###### getInt(value)
  Return only integer values from a string
  
- ###### convertToFrontField(fields)
  Change format to 'fields' data, to use in front-end, if you set a second parameter this will 
  be merged with the frist parameter
  
- ###### convertToBackField(fields)
  Change format to 'fields' data, to send to back-end
    
- ###### convertStringToSnakeCase(string)
  Change a string to snake case.   
  
- ###### toSnakeCase(object)
  Change keys from object to snake case  
  
- ###### checkPassword(password)
  Check if password has a correct format

- ###### array.tree(array, {label : 'title', id: 'id'})
  Return a array with options format to use component `tree-select` / `qselect`

- ###### array.parents(array, id)
  Return all parents from array, setting ID parameter to search into a array
  
- ###### array.children(array, id)    
  Return all childrens from array, setting ID parameter to search into a array
  
- ###### array.diff(array1, array2)
  Search differences between two arrays.
