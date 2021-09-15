/**
 * Created by kaneyang on 2021-04-28 10:48
 */
import {LiveRobotBase} from './LiveRobotBase';
import {LiveRobotSetting} from './LiveRobotSetting';

const process = require('process');
const program = require('commander');

program
    .option('-e, --env <type>', '登入gs環境/站別(development,realdevelopment,QA,onlineAC)', 'development')
    .option('-g, --gameType <type>', '遊戲類別(3310,3320,....)')
    .option('-p, --playerIndex <type>', '指定玩家index(0,1,2,.....)',0)
    .parse(process.argv);

const env = program.env;
const gameType = program.gameType;
const playerIndex = parseInt(program.playerIndex);

if ( !gameType ) {
    console.error('plz add -g to set gameType');
    process.exit();
}
if ( !LiveRobotSetting[gameType] ) {
    console.error('gameType %s can not find setting in LiveRobotSetting' , gameType);
    process.exit();
}

if ( Number.isNaN(playerIndex) ) {
    console.error('playerIndex %s is NaN, plz add -p to set player index' , program.playerIndex);
    process.exit();
}
let bot;
let classPath = LiveRobotSetting[gameType].path;
if (!classPath) {
    bot = new LiveRobotBase( env , gameType , playerIndex );
} else {
    let robotClass = require(classPath);
    if ( !robotClass ) {
        bot = new LiveRobotBase( env , gameType , playerIndex );
    } else {
        bot = new robotClass( env , gameType , playerIndex );
    }
}
bot.start();