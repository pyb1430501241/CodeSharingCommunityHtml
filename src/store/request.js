import axios from "axios";
import cookie from '../store/cookie'
import store from "../store";

const get = (url, params, success, fail) => {
    axios.get(url, params, {
        headers: {
            authorization: cookie.getCookie('authorization')
        }
    })
    .then(response => {
        success(response.data);
    })
    .catch(error => {
        fail(error);
    });
}

const post = (url, data, success, fail) => {

    axios.post(url, data, {
        headers: {
            authorization: cookie.getCookie('authorization')
        }
    })
    .then(response => {
        success(response.data);
    })
    .catch(error => {
        fail(error);
    });

}

const loginStatus = () => {
    var currentUser = sessionStorage.getItem('user');
    if(currentUser != null) {
      return true;
    }
    let val = false;
    axios
      .get("/nav", {
        params: {},
        headers: {
          authorization: cookie.getCookie('authorization'),
        },
      })
      .then((Response) => {
        if (Response.data.code === 200) {
          //将登陆状态放入store
          val = true;
          sessionStorage.setItem('user', JSON.stringify(Response.data.data));
        } else {
          val = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return val;
}

export default {
    get, post, loginStatus
}