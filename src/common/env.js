/*
 * 配置编译环境和线上环境之间的切换
 * 以及静态变量
 * baseUrl: 域名地址
 * routerMode: 路由模式
 */
let baseUrl = '';
let routerMode = 'hash';
let DEBUG = false;    // debug模式
let cancleHTTP = []; //取消请求头设置
if (process.env.NODE_ENV == 'development') { // 本地环境
    baseUrl = "./";
    DEBUG = true;
}else if(process.env.NODE_ENV == 'production'){  // 生产环境
    baseUrl = "./";
    DEBUG = false;
}else if(process.env.NODE_ENV == 'testing'){  // 测试环境
    baseUrl = "./";
    DEBUG = false;
}

export default{
    baseUrl,
    routerMode,
    DEBUG,
    cancleHTTP
}