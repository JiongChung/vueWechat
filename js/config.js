

var env = 'develop';
if(window.location.hostname === 'localhost'){
    env = 'develop';
}else if(window.location.hostname === ''){
    env = 'develop';
}else {
    env = 'product';
}

var ENV = env;

var HOSTS = {
    develop: {
      api: '//192.168.2.110'
    },
    product: {
      api: '//192.168.2.110'
    }
}

var API = HOSTS[ENV].api;