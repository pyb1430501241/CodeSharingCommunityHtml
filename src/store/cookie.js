
const setCookie = (name, value, day) => {
    var time = 60 * 60 * 24 * day;
    var day = new Date;
    day.setTime(day.getTime + time)
    document.cookie =
    name + "=" + value + "; path=/;max-age=" + time + ";expires=" + day.toGMTString() + ";SameSite=lax";
}

const delCookie = (name) => {
    var time = new Date;
    time.setTime(time.getTime() - 1);

    var cookieValue = getCookie(name);

    if(cookieValue != null) {
        ocument.cookie =
            name + "=" + cookieValue + "; path=/;max-age=0" + time + ";expires=" + time.toGMTString() + ";SameSite=lax";
    }
}

const getCookie = (name) => {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if(arr = document.cookie.match(reg)) {
        return arr[2];
    }
    
    return null;
}

export default {
    setCookie, getCookie, delCookie
}