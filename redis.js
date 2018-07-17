//for huaweicloud DCS
var redis = require('redis');
var express = require('express');
var app = express();
const uuidv4 = require('uuid/v4');
const log4js = require('log4js');
var fs = require("fs");

//env
var num = process.env.NUM;
var HOST = process.env.HOST;
var valuelen = process.env.LEN;

var redis_port = 6379;
var Forpush = new random();
var Forpop = new random();
Forpush.init('abcd');
Forpop.init('abcd');

function random(){
  var i=0, f;
  return {
    next: function(){
		i++;
		if (i > 100000) {
			i = 0;
		}
        return "abcd" + i;
    }, init: function(format){
      f = format;
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
var client = redis.createClient(redis_config);

//get
app.get('/get', async (req, res) => {
	var randomNum = Math.random()*1000;
	var setkey = parseInt(randomNum,10);
	//redis 链接错误
	client.on("error", function(error) {
		logger.info(error);
	});

	for ( i = 0; i <= num; i++ ) {
		client.get(setkey, function(error, res){
		if(error) {
			logger.info(error);
		} else {
			logger.info(setkey);
			logger.info(res);
			logger.info("get successfully");
		}
		});
	}
			
	res.send("request successfully!");	
})
//set
app.get('/set', async (req, res) => {
	//redis 链接错误
	var randomNum = Math.random()*1000;
	var setkey = parseInt(randomNum,10);
	var value = getvalue(valuelen);	
	console.log(setkey);
	client.on("error", function(error) {
		logger.info(error);
	});

	client.set(setkey, value, function(error, res) {
		if(error) {
			logger.info(error);
		} else {
			logger.info(setkey);
			logger.info(res);
			logger.info("set successfully!");
		}
		});
	
	res.send("request successfully!");	
})
//lpush
app.get('/lpush', async (req, res) => {
	//set value
	var value = getvalue(valuelen);
	console.log(value);
	//redis 链接错误
	client.on("error", function(error) {
		logger.info(error);
	});
	var listkey = '';
	listkey = Forpush.next();
	
	logger.info(listkey);
	client.lpush(listkey, value, function(error, res) {
		if(error) {
			logger.info(error);
		} else {
			logger.info(res);
			logger.info("lpush successfully!");
		}
		});
	res.send("request successfully!");	
})
//lpop
app.get('/lpop', async (req, res) => {
	//redis 链接错误
	client.on("error", function(error) {
		logger.info(error);
	});
	var listkey = Forpop.next();
	logger.info(listkey);
	client.lpop(listkey, function(error, res) {
		if(error) {
			logger.info(error);
		} else {
			logger.info(res);
			logger.info("lpop successfully!");
		}
		});
	
	res.send("request successfully!");	
})
//mset
app.get('/mset', async (req, res) => {
	//set value
	var value = getvalue(valuelen);
	var value1 = getvalue(valuelen);
	//redis 链接错误
	client.on("error", function(error) {
		logger.info(error);
	});
	
	client.mset(Forpush.next(), value, Forpush.next(), value1, function(error, res) {
		if(error) {
			logger.info(error);
		} else {
			logger.info(value);
			logger.info(value1);
			logger.info(res);
			logger.info("mset successfully!");
		}
		});
	
	res.send("request successfully!");	
})

//mget
app.get('/mget', async (req, res) => {
	//redis 链接错误
	client.on("error", function(error) {
		logger.info(error);
	});

	client.mget(Forpop.next(), Forpop.next(), function(error, res) {
		if(error) {
			logger.info(error);
		} else {
			logger.info(res);
			logger.info("mget successfully!");
		}
		});
	
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
		if ( valuelen == 1000 ) {
			value = fs.readFileSync("thousand.txt","utf-8");
		} else if ( valuelen == 10000 ) {
			value = fs.readFileSync("ten-thousand.txt","utf-8");
		} else {
			value = randomString(); 
		}
		return value;
}

var server = app.listen(redis_port, function () {

  console.log("应用实例，访问地址为 http://127.0.0.1:%s",redis_port)
})
