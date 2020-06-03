'use strict';

import React, {Platform, NativeModules, Alert} from 'react-native';
import {_} from 'lodash';
import {encode} from 'querystring2';
import store from 'react-native-simple-store';
import CryptoJS from 'crypto-js';
import __ from './copy';


const SHARED_SECRET = '@7*4Xr{7B$[m3z2k2R&caa8{';
// test urls
// const WEBSERVICE_URL = 'http://tboxsolutionz.com/webservice.php';
//const WEBSERVICE_URL = 'http://www.tuvisioncanal.com/mobileapps/webservice_dumy.php';
//const upload_url = "http://web1.tuvisioncanal.com:1080/files/";

 //const WEBSERVICE_URL = 'http://192.168.100.9/webservice.php';

//live urls
const WEBSERVICE_URL = 'http://www.tuvisioncanal.com/mobileapps/webservice.php';
const upload_url = "http://www.tuvisioncanal.com:1080/files/";

// const upload_url = "http://master.tus.io/files/";



function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

async function buildURL(controller, action, parameters) {
  var url = WEBSERVICE_URL + '?' + (
    '_controller=' + controller + '&'
  ) + (
    '_action=' + action + '&'
  );

  // Auth
  var timestamp = new Date().getTime();
  var token = CryptoJS.SHA256(SHARED_SECRET + '_' + timestamp).toString();
  if (token && timestamp) {
    url += 'token=' + token + '&timestamp=' + timestamp;
  }

  // Custom parameters
  if (parameters && _.isObject(parameters)) {
    url += '&' + encode(parameters)
  }

  // Session
  await store.get('sessionId').then((sessionId) => {
    console.log('Request promise1 done:', sessionId);
    if (sessionId) {
      url += '&tvcsession=' + sessionId;
    }
  });

  // UUID
  await store.get('uuid').then((deviceId) => {
    console.log('Request promise2 done:', deviceId);
    if (!deviceId) {
      deviceId = generateUUID();
      store.save('uuid', deviceId);
      console.log('New UUID', deviceId);
    }
    url += '&deviceId=' + deviceId;
  })

  url += '&platform=' + Platform.OS;

  return url;
}

async function callWebService(controller, action, parameters, callback) {
  const url = await buildURL(controller, action, parameters);

   console.log(url);
  const headers = {
    Accept: 'application/json'
  };
  console.log('PARAMETERS', parameters)

  if (parameters && 'files' in parameters
      && parameters.files.length > 0 && parameters.files[0].filename) {
    
   if(parameters.files[0].configration){

     return NativeModules.FileUpload.upload({
      uploadUrl: url,
      method: 'POST',
      headers: headers,
      files: parameters.files
    },

  function(err, r) {
      console.log('Request callback3 done:', r, err);
      if (r.status != 200 || err) {
        // Alert.alert(
        //             __('Notice'),
        //             __('An error occurred, please try again'),
        //  );
      }
      callback(JSON.parse(r.data));
    });


   }
   else
   {
     // return NativeModules.FileUpload.upload({
    //   uploadUrl: url,
    //   method: 'POST',
    //   headers: headers,
    //   files: parameters.files
    // },

    return NativeModules.Fileuploading.upload({
        params: parameters,
        uploadUrl: upload_url,
    },

    function(err, r) {
      console.log('Request callback3 done:', r, err);
      if (r.status != 200 || err) {
        // Alert.alert(
        //             __('Notice'),
        //             __('An error occurred, please try again'),
        //  );
      }
      callback(JSON.parse(r.data));
    });
   }


   
  } else {
    return fetch(url, {
      method: 'POST',
      headers: headers,
      //body: JSON.stringify(body || {})
    }).then((r) => {
      console.log('Request promise3 done:', r);
      var jsn = r.json();
      //debugger;
      if (r.status != 200) {
        // Alert.alert(
        //             __('Notice'),
        //             __('An error occurred, please try again'),
        //  );
      }
      return jsn;
    }).then(callback);
  }
}


export default callWebService;
