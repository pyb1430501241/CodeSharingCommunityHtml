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

const currentUser = () => {
  var currentUser = sessionStorage.getItem('user');

  if(currentUser != null) {
    return JSON.parse(currentUser);
  }

  if(loginStatus()) {
    currentUser = sessionStorage.getItem('user');
    return JSON.parse(currentUser);
  }

  return {username: 'username'};
}

const loginCheck = () => {

  if(cookie.getCookie('authorization') == null) {
    return false;
  }

  return loginStatus();
}


const loginStatus = () => {
    var currentUser = sessionStorage.getItem('user');

    if(currentUser != null) {
      return true;
    }

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
          sessionStorage.setItem('user', JSON.stringify(Response.data.data));

          return true;
        }

        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
}

export default {
    get, post, loginStatus, loginCheck, currentUser
}