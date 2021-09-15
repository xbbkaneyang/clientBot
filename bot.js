"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by kaneyang on 2021-04-28 10:48
 */
var LiveRobotBase_1 = require("./LiveRobotBase");
var LiveRobotSetting_1 = require("./LiveRobotSetting");
var process = require('process');
var program = require('commander');
program
    .option('-e, --env <type>', '登入gs環境/站別(development,realdevelopment,QA,onlineAC)', 'development')
    .option('-g, --gameType <type>', '遊戲類別(3310,3320,....)')
    .option('-p, --playerIndex <type>', '指定玩家index(0,1,2,.....)', 0)
    .parse(process.argv);
var env = program.env;
var gameType = program.gameType;
var playerIndex = parseInt(program.playerIndex);
if (!gameType) {
    console.error('plz add -g to set gameType');
    process.exit();
}
if (!LiveRobotSetting_1.LiveRobotSetting[gameType]) {
    console.error('gameType %s can not find setting in LiveRobotSetting', gameType);
    process.exit();
}
if (Number.isNaN(playerIndex)) {
    console.error('playerIndex %s is NaN, plz add -p to set player index', program.playerIndex);
    process.exit();
}
var bot;
var classPath = LiveRobotSetting_1.LiveRobotSetting[gameType].path;
if (!classPath) {
    bot = new LiveRobotBase_1.LiveRobotBase(env, gameType, playerIndex);
}
else {
    var robotClass = require(classPath);
    if (!robotClass) {
        bot = new LiveRobotBase_1.LiveRobotBase(env, gameType, playerIndex);
    }
    else {
        bot = new robotClass(env, gameType, playerIndex);
    }
}
bot.start();
