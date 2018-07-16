var redis = require('redis');
var express = require('express');
var app = express();
var redis_port = 6379;
var num = process.env.NUM;
var HOST = process.env.HOST;

const log4js = require('log4js');
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

app.get('/get', async (req, res) => {
	var randomNum = Math.random()*1000;
	var setkey = parseInt(randomNum,10);
	//redis 链接错误
	client.on("error", function(error) {
		//console.log(error);
		//res.send(error);
		logger.info(error);
	});

	for ( i = 0; i <= num; i++ ) {
		client.get(setkey, function(error, res){
		if(error) {
			//console.log(error);
			//res.send(error);
			logger.info(error);
		} else {
			//console.log(res);
			//console.log("get successfully!");
			logger.info(setkey);
			logger.info(res);
			logger.info("get successfully");
		}
		});
	}
			
	
	res.send("request successfully!");	
})

app.get('/set', async (req, res) => {
	//redis 链接错误
	var randomNum = Math.random()*1000;
	var setkey = parseInt(randomNum,10);
	console.log(setkey);
	client.on("error", function(error) {
		//console.log(error);
		//res.send(error);
		logger.info(error);
	});

	client.set(setkey, '012345678aaghjkiuhgdf012345678aa', function(error, res) {
		if(error) {
			//console.log(error);
			//res.send(error);
			logger.info(error);
		} else {
			//console.log(res);
			//console.log("set successfully!");
			logger.info(setkey);
			logger.info(res);
			logger.info("set successfully!");
		}
		});
	
	res.send("request successfully!");	
})

var server = app.listen(redis_port, function () {

  console.log("应用实例，访问地址为 http://127.0.0.1:%s",redis_port)
})
