function formatDateTime(){
    var date = new Date();
    var month = date.getMonth() + 1;
    var datetime = date.getFullYear()
        + ""
        + (month >= 10 ? month : "0"+ month)
        + ""
        + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
        + ""
        + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())
        + ""
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
        + ""
        + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());

    return datetime;
}

function checkLogin(){

}

function goBack(){
    if(document.referrer.replace(/\$/g,"").indexOf('login') > -1){
        window.location.href = '../';
    }else{
        if(!document.referrer.replace(/\$/g,"")){
            window.location.href = '../';
        }else{
            // window.location.href = document.referrer.replace(/\$/g,"");
            window.history.go(-1);
        }
    }
}

var zValidate = {};
zValidate.phone = function(phone){
    var myreg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
    return myreg.test(phone);
}
zValidate.email = function(email){
    var myreg = /^[\w-']+([\.\+][\w-']+)*@([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*?\.[a-zA-Z]{2,8}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
    return myreg.test(email.replace(/(^\s*)|(\s*$)/g, ""));
}
zValidate.int = function(int){
    var myreg = /^[0-9]*[1-9][0-9]*$/;
    return myreg.test(int);
}
zValidate.password = function(password){
    var myreg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{8,20}$/;
    return myreg.test(password);
}

zValidate.identityId = function(identityId){
    var myreg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    return myreg.test(identityId);
}


function fetchLocalStorage(name){
    return window.localStorage.getItem(name);
}

function saveLocalStorage(name, items){
    window.localStorage.setItem(name, items);
}

function removeLocalStorage(name){
    window.localStorage.removeItem(name);
}

function empty(str){
    if(str == undefined || str == null || str == ''){
        return true;
    }else{
        return false;
    }
}

function checkLogin(){
    var user = JSON.parse(getCookie('user'));
    return empty(user);
}

function header(){
    var user = JSON.parse(getCookie('user'));
    var header = {};
    if(!empty(user)){
        var token = user.accessToken;
        if(!empty(token)){
            header = {
                'Authorization':'Bearer ' + token,
                "accept" : 'text/plain',
                'Content-Type': 'application/json'
            };
        }
    }

    return header;
}


function setCookie(name,value){ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + 30*24*60*60*1000); 
    document.cookie = name + "="+  (value) + ";expires=" + exp.toUTCString(); 
}

function getCookie(name){ 
    var arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if(arr = document.cookie.match(reg)){
        return (arr[2]); 
    }
    else{
        return null; 
    }    
}

function delCookie(name){ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval = getCookie(name); 
    if(cval != null){
        document.cookie = name + "=" + cval+";expires=" + exp.toUTCString(); 
    } 
}
var setTimer;
function getPhoneCodeNow(o, time, status, text, retext, type){
    if(type !== undefined && type === 'off'){
        clearTimeout(setTimer)
    }
    
    if(time === 0) {
        o.innerHTML = text;
        o.classList.remove('loading');
        time = 60;
        status = true;
    } else {
        status = false;
        o.classList.add('loading');
        o.innerHTML = retext + '(' + time + 's)';
        time--;
        setTimer = setTimeout(function() {
            getPhoneCodeNow(o,time,status,text,retext)
        }, 1000);
    }

    return status;
}

function checkLogin(){
    var user = JSON.parse(getCookie('user'));
    return empty(user);
}

function commonAjax(obj,url,type,value,success,err){
    var user = JSON.parse(getCookie('user'));
    var header = {};
    if(!empty(user)){
        var token = user.accessToken;
        if(!empty(token)){
            header = {
                'Authorization':'Bearer ' + token,
                "accept" : 'text/plain',
                'Content-Type': 'application/json-patch+json',
                'Vue.http.options.emulateHTTP': 'true',
                'Vue.http.options.emulateJSON': 'true'
            };
        }
    }
    url = API + url;
    if(type == 'post'){
        obj.$http.post(url,value, { headers: header }).then(function (response) {
            success(response);
        }).catch(function (error) {
            err(error);
        });
    }
    if(type == 'get'){
        obj.$http.get(url, { headers: header }).then(function (response) {
            success(response);
        }).catch(function (error) {
            err(error);
        });
    }
    if(type == 'delete'){
        obj.$http.delete(url, { headers: header }).then(function (response) {
            success(response);
        }).catch(function (error) {
            err(error);
        });
    }
    if(type == 'put'){
        obj.$http.put(url,value, { headers: header }).then(function (response) {
            success(response);
        }).catch(function (error) {
            err(error);
        });
    }
}

function getUrlString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null; 
}

function submitOssPhoto(base64,fileName){
    var user = JSON.parse(getCookie('user'));
    var header = {};
    if(empty(user)){
        var token = user.accessToken;
        if(!empty(token)){
            header = {
                'Authorization':'Bearer '+token
            };
        }
    }

	var uploadSuccess = false;

	var file = convertBase64UrlToBlob(base64);

    $.ajax({
		url:API+'/api/services/app/AliyunOSS/GetUploadParameters',
		method:'get',
        async : false,
        dataType : "json",
        contentType:'application/json',
        headers:header,
		success:function(data){
			var ret = data;
			console.log(JSON.stringify(ret));
            if(ret){
                if(ret.success){
                    var ossSign = ret.result;

                    var request = new FormData();
                    request.append("OSSAccessKeyId", ossSign.accessKeyId);
                    request.append("policy", ossSign.policy);
                    request.append("Signature", ossSign.signature);
                    request.append("key", fileName);
                    request.append("success_action_status", '200');
                    request.append("file", file);

                    $.ajax({
                        url : ossSign.host,
                        data : request,
                        type : 'post',
                        contentType : false,
                        processData : false,
                        async : false,
                        timeout : 60000,
                        success : function(ret) {
                            uploadSuccess = true;
                            console.log(JSON.stringify(ret));
                            console.log("key:" + fileName);
                            return fileName;
                        },
                        error : function(err) {
                            console.log(JSON.stringify(err));
                            alert("上传图片失败，请重试");
                        }
                    });
                }
            }
		},
		error:function(err){
			alert('上传图片错误，请联系管理员');
			console.log(JSON.stringify(err));
		}
	});

    if(uploadSuccess){
    	return fileName;
	}else{
    	return null;
	}

}

//base64转换成file
function convertBase64UrlToBlob(urlData) {
console.log(urlData)
    var bytes = window.atob(urlData.split(',')[1]);
    // var bytes = window.atob(urlData.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''))
    //去掉url的头，并转换为byte

    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {
        type : 'image/png'
    });
}

function isIos()
{
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("iPhone", "iPad", "iPod");
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > -1) { flag = true; break; }
    }
    return flag;
}