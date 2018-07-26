//for huaweicloud DCS
var redis = require('redis');
var express = require('express');
var app = express();
const log4js = require('log4js');
var fs = require("fs");

//env

var HOST = process.env.HOST;
var valuelen = process.env.LEN;

var redisPool = require('redis-connection-pool')('myRedisPool', {
    host: HOST, // default 
    port: 6379, //default 
    max_clients: 1000, // defalut 
    perform_checks: false, // checks for needed push/pop functionality 
    database: 0, // database number to use 
    //options: {
    //  auth_pass: 'password'
    //} //options for createClient of node-redis, optional 
  });

var redis_port = 6379;
var initvalue = randomString(6);
console.log(initvalue);
var Forpush = new random();
var Forpop = new random();
var Forhset = new random();
var Forhget = new random();
//Forpush.init('abcd000');
//Forpop.init('abcd000');

function random(){
	var i=0;
	return {
		next: function(){
			i++;
			if (i > 700000) {
				i = 0;
			}
			return initvalue + i;
		}
	};
}

log4js.configure({
    appenders: {
        xcLogFile: {
            type: "dateFile",
            filename: 'logs/run.log',
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log",
            encoding: 'utf-8',//default "utf-8"，文件的编码
            maxLogSize: 11024 }, //文件最大存储空间
        xcLogConsole: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['xcLogFile'],
            level: 'all'
        },
        xcLogFile: {
            appenders: ['xcLogFile'],
            level: 'all'
        },
        xcLogConsole: {
            appenders: ['xcLogConsole'],
            level: log4js.levels.ALL
        }
    }
});
module.exports = log4js.getLogger('xcLogConsole');
var logger = log4js.getLogger('log_file');

//redis配置参数
var redis_config = {
    "host": HOST,
    "port": 6379
};

//get
app.get('/get', async (req, res) => {
	//var client = redis.createClient(redis_config);
	var randomNum = Math.random()*1000;
	var setkey = parseInt(randomNum,10);
	//redis 链接错误
	//client.on("error", function(error) {
	//	logger.info(error);
	//});
	
	redisPool.get(setkey, function(error, res){
		//logger.info("enter get exec");
		if(error) {
			logger.info(error);
		} //else {
			//logger.info(setkey);
		//	logger.info(res);
		//	logger.info("get successfully!");
		//}
	});
	
	//client.quit();	
	res.send("request successfully!");	
})
//set
app.get('/set', async (req, res) => {
	//var client = redis.createClient(redis_config);
	//redis 链接错误
	var randomNum = Math.random()*100000;
	var setkey = parseInt(randomNum,10);
	var value = getvalue(valuelen);	
	//logger.info(setkey);
	//client.on("error", function(error) {
	//	logger.info(error);
	//});

	redisPool.set(setkey, value, function(error, res) {
		//logger.info("enter set exec");
		if(error) {
			logger.info(error);
		}// else {
			//logger.info(res);
			logger.info("set successfully!");
		//}
	});
	
	//client.quit();
	res.send("request successfully!");	
})
//lpush
app.get('/lpush', async (req, res) => {
	//var client = redis.createClient(redis_config);
	//set value
	var value = getvalue(valuelen);
	//console.log(value);
	//redis 链接错误
	//client.on("error", function(error) {
	//	logger.info(error);
	//});
	var listkey = '';
	listkey = Forpush.next();
	
	//logger.info(listkey);
	redisPool.lpush(listkey, value, function(error, res) {
		logger.info("enter lpush exec");
		if(error) {
			logger.info(error);
		} else {
			logger.info(res);
			logger.info("lpush successfully!");
		}
		});
	//client.quit();
	res.send("request successfully!");	
})
//lpop
app.get('/lpop', async (req, res) => {
	//var client = redis.createClient(redis_config);
	//redis 链接错误
	//client.on("error", function(error) {
	//	logger.info(error);
	//});
	var listkey = Forpop.next();
	
	//logger.info(listkey);
	redisPool.blpop(listkey, function(error, res) {
		logger.info("enter lpop exec");
		if(error) {
			logger.info(error);
		} else {
			logger.info(res);
			logger.info("lpop successfully!");
		}
		});
	//client.quit();
	res.send("request successfully!");	
})
//mset
app.get('/mset', async (req, res) => {
	//var client = redis.createClient(redis_config);
	//set value
	var value = getvalue(valuelen);
	//var value1 = getvalue(valuelen);
	//redis 链接错误
	//client.on("error", function(error) {
	//	logger.info(error);
	//});
	var listkey = Forhset.next();
	logger.info(listkey);
	redisPool.hset(listkey, "demo:redis", value, function(error, res) {
		logger.info("enter hset exec");
		if(error) {
			logger.info(error);
		} else {
			logger.info(value);
			//logger.info(value1);
			logger.info(res);
			logger.info("mset successfully!");
		}
		});
	//client.quit();
	res.send("request successfully!");	
})

//mget
app.get('/mget', async (req, res) => {
	//var client = redis.createClient(redis_config);
	//redis 链接错误
	//client.on("error", function(error) {
	//	logger.info(error);
	//});
	var listkey = Forhget.next();
	//logger.info(listkey);
	redisPool.hget(listkey, "demo:redis", function(error, res) {
		logger.info("enter hget exec");
		if(error) {
			logger.info(error);
		} else {
			logger.info(res);
			logger.info("mget successfully!");
		}
		});
	//client.quit();
	res.send("request successfully!");	
})

function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

function getvalue(len) {
		var value = '';
		if ( len == 1000 ) {
			value = fs.readFileSync("thousand.txt","utf-8");
		} else if ( len == 10000 ) {
			value = fs.readFileSync("ten-thousand.txt","utf-8");
		} else {
			value = randomString(len); 
		}
		return value;
}

var server = app.listen(redis_port, function () {

  console.log("应用实例，访问地址为 http://127.0.0.1:%s",redis_port)
})
