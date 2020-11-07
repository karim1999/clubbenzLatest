import {store} from './../redux/create';
import {UPDATE_INDICATOR_FLAG} from './../redux/actions/types';
import NetInfo from "@react-native-community/netinfo";
import SimpleToast from 'react-native-simple-toast';

let DEFAULT_HEADERS = {
   //'Content-Type': 'multipart/form-data',
}
const GET = 'GET'
const HEAD = 'HEAD'

export class RequestService {
  constructor(params) {
    if (!params.url) throw new Error('invalid request url')

    console.log(params);
    this.params = params
  }

  callIndex=()=> {
    this.params.method = 'GET'
    return this.call()
  }

  callCreate=()=> {
    this.params.method = 'POST'
    return this.call()
  }

  callCreateWithoutLoader=()=> {
    this.params.method = 'POST'
    return this.callWithoutLoader()
  }

  callShow=()=> {
    this.params.method = 'GET'
    return this.call()
  }

  callShowWithoutLoader=()=> {
    this.params.method = 'GET';
    return this.callWithoutLoader();
  }

  callUpdate=()=> {
    this.params.method = 'PUT'
    return this.call()
  }

  callDestroy=()=> {
    this.params.method = 'DELETE'
    return this.call()
  }

  call=async ()=> {
    if (!this.params.method) return {}

    NetInfo.fetch().then(isConnected => {
      if (!isConnected)
        SimpleToast.show('Not connected to internet', SimpleToast.SHORT)
    })

    // if (NetInfo)
    //   SimpleToast.show('Connected To Internet', 2000);
    // else if (!NetInfo)
    //   SimpleToast.show('Not Connected To Internet', 4000);

      try{
        // debugger
        store.dispatch({type:UPDATE_INDICATOR_FLAG,data:true})

        const asyncResponse = await fetch(this.params.url, this.mountRequest(this.params))

        const json = await asyncResponse.json()

        store.dispatch({type:UPDATE_INDICATOR_FLAG,data:false})
        // alert(JSON.stringify(json))
        return json
      }
      catch(e){
        console.log(e);
        store.dispatch({type:UPDATE_INDICATOR_FLAG,data:false})
        return {"success":false,"message":"Something went wrong on server"}
      }

  }

  callWithoutLoader=async ()=> {
    if (!this.params.method) return {}

    // NetInfo.fetch().then(isConnected => {
    //   if (!isConnected)
    //     SimpleToast.show('Not connected to internet', SimpleToast.SHORT)
    // })

      try{

        const asyncResponse = await fetch(this.params.url, this.mountRequest(this.params))

        const json = await asyncResponse.json()

        return json
      }
      catch(e){

        console.log(e);
        return {"success":false,"message":"Something went wrong on server"}
      }

  }

  mountRequest=()=> {
    let request = {
      method: this.params.method,
      headers: this.mountHeaders()
    }
    console.log("request:",request);
    if (request.method !== GET && request.method !== HEAD) {
      request.body = this.mountBody()
    }
    console.log("requestmountBody:",request);
    return request
  }


  mountBody=()=> {
    if (!this.params.body) return {}
    let form_data = new FormData();
    let body = this.params.body
    for ( var key in body) {
        form_data.append(key, body[key]);
    }
    for (var file in this.params.files) {
      var photo = {
        uri: this.params.files[file],
        type: 'image/jpg',
        name: 'profile_picture.jpg',
      };
      form_data.append(file, photo);
    }
    form_data.append("app_type", "android");
    console.log("form_data",form_data);
    return form_data;
  }

  mountHeaders=()=> {
    let mountedHeaders = Object.assign(
      DEFAULT_HEADERS
    )

    if (this.params.headers) {

      mountedHeaders = Object.assign(
        mountedHeaders,
        this.params.headers
      )
    }
    //console.log(mountedHeaders);
    return mountedHeaders
  }
  mountFiles=()=>{
    let fileArray=[]
    let files = this.params.files
    //alert(JSON.stringify(files))
    if(files){
      for (var file in files) {
        let json={};
        json['filename']=file
        json['filepath']=files[file]
        json['filetype']="image/jpeg"
        fileArray.push(json)
      }
      return fileArray
    }
    else{
      return fileArray
    }
  }

}
export default RequestService;
