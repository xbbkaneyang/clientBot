"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by kaneyang on 2021-09-06 11:17
 */
var ClientBotPlayer_1 = require("./class/ClientBotPlayer");
var LiveRobotSetting_1 = require("./LiveRobotSetting");
var LiveRobotEnum_1 = require("./class/LiveRobotEnum");
var LiveTable_1 = require("./class/LiveTable");
var LiveProtocolManager_1 = require("./LiveProtocolManager");
var process = require('process');
var log4js = require('log4js');
var request = require('request');
var util = require('util');
var PomeloClient = require('./lib/pomelo-client-multiple');
var apiSetting = require('./config/api.json');
var URL = require('url');
var LiveRobotBase = /** @class */ (function () {
    function LiveRobotBase(env, gameType, playerIndex) {
        this.isGateDisconnect = false;
        this.tableList = {};
        this.vccTableMapping = {};
        this.tableCount = 0;
        this.env = env;
        this.gameType = parseInt(gameType);
        this.gameSetting = LiveRobotSetting_1.LiveRobotSetting[this.gameType];
        this.playerIndex = playerIndex;
        this.makeLogger();
        this.pomelo = new PomeloClient();
        this.pomelo.on('close', this.onDisconnect.bind(this));
        this.pomelo.on('onKick', this.onKick.bind(this));
        this.pomelo.on('io-error', this.onError.bind(this));
        this.pomelo.on('onEnterGame', this.onEnterGame.bind(this));
        this.onLinkFun();
    }
    LiveRobotBase.prototype.start = function () {
        this.connectToGate();
    };
    LiveRobotBase.prototype.connectToGate = function () {
        var gateInfo = require('./config/gate.json')[this.env];
        this.pomelo.init({
            host: gateInfo.host,
            port: gateInfo.port,
            log: true
        }, function () {
            var route = LiveRobotEnum_1.LiveRoute.GateRequest;
            this.pomelo.request(route, { token: "session_token" }, function (data) {
                if (data.code === 200) {
                    this.writeWarn('connect to gs gate success : ', data);
                    this.isGateDisconnect = true;
                    this.connectorHost = data.host;
                    this.connectorPort = data.port;
                    this.pomelo.disconnect();
                }
                else {
                    this.writeError('connect to gs gate fail : ', data);
                }
            }.bind(this));
        }.bind(this));
    };
    LiveRobotBase.prototype.connectToConnector = function (sid) {
        this.pomelo.init({
            host: this.connectorHost,
            port: this.connectorPort,
            log: true
        }, function () {
            var route = LiveRobotEnum_1.LiveRoute.ConnectorLogin;
            var loginData = this.makeLoginData(sid);
            this.pomelo.request(route, loginData, function (playerData) {
                this.writeWarn('connect to gs connector : ', playerData);
                this.clientBotPlayer.setLoginCallBackData(playerData);
            }.bind(this));
        }.bind(this));
    };
    LiveRobotBase.prototype.makeLoginData = function (sid) {
        var res = {};
        res.sid = sid;
        res.lang = 'zh-cn';
        res.optimize = 10;
        res.deviceType = 'pc';
        res.wagersType = 1;
        return res;
    };
    LiveRobotBase.prototype.makeLogger = function () {
        var logConfig = require('./config/log4js.json');
        if (!logConfig.levels[this.gameSetting.loggerName]) {
            console.error('can not find logger : %s, plz set correct loggerName', this.gameSetting.loggerName);
            process.exit();
        }
        log4js.configure(logConfig);
        this.logger = log4js.getLogger(this.gameSetting.loggerName);
        this.errorLogger = log4js.getLogger(this.gameSetting.loggerName + '-error');
    };
    LiveRobotBase.prototype.onDisconnect = function (event) {
        this.writeWarn('onDisconnect : ', JSON.stringify(event));
        if (this.isGateDisconnect) {
            var loginList = require('./config/player.json')[this.env];
            if (!loginList || loginList.length === 0) {
                this.writeError("env %s find no player login data : %s", this.env, loginList);
                return;
            }
            var loginInfo = loginList[this.playerIndex];
            if (!loginInfo) {
                this.writeError('can not find player use index : ', this.playerIndex);
                process.exit();
            }
            this.getSid(loginInfo.Account, loginInfo.Password, function (err, sidData) {
                if (err) {
                    this.writeError("get sid fail : ", err);
                    return;
                }
                this.clientBotPlayer = new ClientBotPlayer_1.ClientBotPlayer(sidData.sid);
                this.connectToConnector(this.clientBotPlayer.sid);
            }.bind(this));
        }
    };
    LiveRobotBase.prototype.onKick = function (event) {
        this.writeError('onKick : ', JSON.stringify(event));
    };
    LiveRobotBase.prototype.onError = function (event) {
        this.writeError('onError : ', JSON.stringify(event));
    };
    LiveRobotBase.prototype.onEnterGame = function (msg) {
        this.writeWarn('onEnterGame : ', msg);
    };
    LiveRobotBase.prototype.enterGame = function () {
        var msg = {};
        msg.g = [this.gameType];
        setTimeout(function () {
            this.pomelo.notify(LiveRobotEnum_1.LiveRoute.LobbyEnterGame, msg);
        }.bind(this), 500);
    };
    LiveRobotBase.prototype.onLobbyReceive = function (msg) {
        var protocolType = msg.c;
        var data = msg.d;
        switch (protocolType) {
            case LiveRobotEnum_1.LiveLobbyProtocolType.GameList:
                this.writInfo('取得遊戲列表 : ', data);
                this.enterGame();
                break;
            case LiveRobotEnum_1.LiveLobbyProtocolType.OnlineUser:
                this.writInfo('取得在線人數 : ', data);
                break;
            default:
                this.writeError('onLobbyReceive unknown protocol : ', msg);
                break;
        }
    };
    LiveRobotBase.prototype.onGameReceive = function (msg) {
        var protocolType = msg.c;
        var data = msg.d;
        switch (protocolType) {
            case LiveRobotEnum_1.LiveGameProtocolType.OnConnect:
                this.writInfo('遊戲連線成功 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.GamePlayInfo:
                this.writInfo('接收玩法資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.TableGroupList:
                this.writInfo('接收控端桌群組列表 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.TableCategoryList:
                this.writInfo('接收大廳桌分類列表 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.UsualMarquee:
                this.writInfo('接收常駐跑馬燈 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.AllowAutoBetGameList:
                this.writInfo('接收允許自動投注遊戲列表 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.UserGroupRuleSetting:
                this.writInfo('接收會員標籤規則設定 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.InitTableInfo:
                this.writInfo('接收遊戲桌資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleTableInfo(data);
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.EnterSeatResponse:
                this.writInfo('接收入座結果 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleEnterSeatResponse(msg);
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.RoundStart:
                if (!this.filterMessage(msg.d.vID)) {
                    return;
                }
                this.writInfo('接收開局資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleRoundStart(msg.d);
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.DealInfo:
                if (!this.filterMessage(msg.d.vID)) {
                    return;
                }
                this.writInfo('接收發牌資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleDealInfo(msg.d);
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.RoundEnd:
                if (!this.filterMessage(msg.d.vID)) {
                    return;
                }
                this.writInfo('接收回合結束資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleRoundEnd(msg.d);
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.BetResult:
                this.writInfo('接收下注結果 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleBetResult(msg);
                break;
            case LiveRobotEnum_1.LiveGameProtocolType.RoundResult:
                this.writInfo('接收派彩結果 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleRoundResult(msg.d);
                break;
            default:
                // this.writeError('onGameReceive unknown protocol : ' , msg );
                break;
        }
    };
    LiveRobotBase.prototype.onOtherReceive = function (msg) {
        this.writeWarn('onOtherReceive : ', msg);
    };
    LiveRobotBase.prototype.onLinkFun = function () {
        for (var i = 1; i < 999; i++) {
            var iStr = i.toString();
            var fun = void 0;
            if (iStr === '1') {
                fun = this['onLobbyReceive'];
            }
            else if (iStr === '2') {
                fun = this['onGameReceive'];
            }
            else {
                fun = this['onOtherReceive'];
            }
            this.pomelo.on(iStr, fun.bind(this));
        }
    };
    LiveRobotBase.prototype.getSid = function (account, password, cb) {
        var param = {
            account: account,
            password: password
        };
        var apiUrl = apiSetting[this.env];
        var post_options = {
            uri: apiUrl,
            method: 'POST',
            json: param,
            headers: {
                Ekey: 'mevilni',
                Token: 'e4cbff26dc76fa18c3135573e62f1afa4eac625ebf9edf215a3cdf34f8bfea22b09c0bd4b12419d7bc9c30a57a42e25f95087a84b0814a12c1b4c385f07405d4SKCK5PIt7u5IqVsgrgOaKPppm0yz3dEBJ1L9GI0pZVx4'
            }
        };
        request.post(post_options, function (err, response, body) {
            if (err) {
                console.error('post error,', err, post_options);
                cb(err, null);
            }
            else {
                var errcode = null;
                if (parseInt(body.errorCode)) {
                    console.error('post recv errorCode,', body, post_options);
                    errcode = body;
                    cb(errcode, null);
                    return;
                }
                var bodyObj = null;
                try {
                    switch (typeof body) {
                        case 'string':
                            bodyObj = JSON.parse(body);
                            break;
                        case 'object':
                            bodyObj = body;
                            break;
                        default:
                            console.error('typeof body error:', typeof body);
                            cb(null, null);
                            return;
                    }
                    var data = bodyObj.data;
                    cb(null, data);
                }
                catch (e) {
                    console.error('body error! body:', body, ', err:', e);
                    cb(e, null);
                }
            }
        }.bind(this));
    };
    LiveRobotBase.prototype.writeDebug = function (msg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        (_a = this.logger).debug.apply(_a, [msg].concat(params));
        var _a;
    };
    LiveRobotBase.prototype.writInfo = function (msg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        (_a = this.logger).info.apply(_a, [msg].concat(params));
        var _a;
    };
    LiveRobotBase.prototype.writeWarn = function (msg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        (_a = this.logger).warn.apply(_a, [msg].concat(params));
        var _a;
    };
    LiveRobotBase.prototype.writeError = function (msg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        (_a = this.errorLogger).error.apply(_a, [msg].concat(params));
        var _a;
    };
    LiveRobotBase.prototype.handleTableInfo = function (data) {
        var total = data.total;
        var tables = data.tables;
        var str = '接收遊戲桌 : \n';
        for (var key in tables) {
            var tableData = tables[key];
            var table = new LiveTable_1.LiveTable(tableData);
            this.tableList[tableData.tID] = table;
            if (!this.vccTableMapping[table.vID]) {
                this.vccTableMapping[table.vID] = {};
            }
            this.vccTableMapping[table.vID][table.tID] = table.checkAllowBet();
            this.tableCount++;
            str += util.format('桌[%s](現場桌號:%s)[%s]:桌名[%s],啟用[%s],維護[%s],現場維護[%s]\n', table.tID, table.vID, table.gt, table.n['zh_tw']['name'], table.a, table.im, table.vim);
        }
        this.writInfo(str);
        if (this.tableCount === total) {
            // 取得所有桌資訊 > 入座
            this.enterSeat();
        }
    };
    LiveRobotBase.prototype.handleEnterSeatResponse = function (msg) {
        var error = msg.error;
        var data = msg.d;
        if (error) {
            this.writeError('%s 入座失敗 : %s', data.tID, msg.error);
            return;
        }
        else {
            this.writInfo('%s 入座成功', data.tID);
        }
        this.enterSeatTable = this.tableList[data.tID];
    };
    LiveRobotBase.prototype.handleRoundStart = function (data) {
        if (!this.gameSetting.isBet) {
            return;
        }
        this.bet();
    };
    LiveRobotBase.prototype.handleDealInfo = function (data) {
    };
    LiveRobotBase.prototype.handleRoundEnd = function (data) {
    };
    LiveRobotBase.prototype.handleBetResult = function (msg) {
        var error = msg.error;
        var data = msg.d;
        if (error) {
            this.writeError('%s 下注失敗 : %s', data.tID, msg.error);
            return;
        }
        else {
            this.writInfo('%s 下注成功', data.tID);
            this.clientBotPlayer.currency = data.cr;
        }
    };
    LiveRobotBase.prototype.handleRoundResult = function (data) {
        this.clientBotPlayer.currency = data.cr;
    };
    LiveRobotBase.prototype.enterSeat = function () {
        var enterSeatTableID = null;
        var targetTableID = this.gameSetting.tableID;
        if (targetTableID) {
            var table = this.tableList[targetTableID];
            if (!table) {
                this.writeError('入座失敗，查無此遊戲桌 : ', targetTableID);
                return;
            }
            if (table.checkAllowBet()) {
                this.writeError('入座失敗，該桌[%s]未啟用[%s]或維護中[im:%s, vim:%s] : ', targetTableID, table.a, table.im, table.vim);
                return;
            }
            if (table.gt !== this.gameType) {
                console.log('%s vs %s', typeof table.gt, typeof this.gameType);
                this.writeError('入座失敗，該桌[%s]遊戲類[%s]別與bot[%s]不一致', targetTableID, table.gt, this.gameType);
                return;
            }
            enterSeatTableID = targetTableID;
        }
        else {
            // 未設定遊戲桌ID > 取現場桌ID
            var targetVccTableID = this.gameSetting.vccTableID;
            var tableList = this.vccTableMapping[targetVccTableID];
            if (!tableList) {
                this.writeError('入座失敗，查無此現場桌 : ', targetVccTableID);
                return;
            }
            for (var tID in tableList) {
                if (tableList[tID]) {
                    var mt = this.tableList[tID];
                    if (mt.gt !== this.gameType) {
                        this.writeWarn('該桌[%s]遊戲類別[%s]與bot[%s]不一致 > pass ', tID, mt.gt, this.gameType);
                        continue;
                    }
                    enterSeatTableID = parseInt(tID);
                    break;
                }
            }
            if (!enterSeatTableID) {
                this.writeError('入座失敗，該現場桌%s對應之遊戲桌均無法遊戲 : %s', targetVccTableID, JSON.stringify(tableList));
                return;
            }
        }
        if (enterSeatTableID) {
            var msg = LiveProtocolManager_1.LiveProtocolManager.Encode_RequestEnterSeat(enterSeatTableID);
            this.writInfo('傳送入座請求 : ', msg);
            this.pomelo.notify(LiveRobotEnum_1.LiveRoute.GameRequest, msg);
        }
    };
    LiveRobotBase.prototype.bet = function () {
        var bets = this.gameSetting.bets;
        if (!this.enterSeatTable) {
            this.writeError('下注請求失敗，尚未入座成功 : ', this.enterSeatTable);
            return;
        }
        if (!bets) {
            this.writeError('下注請求失敗，未設定下注注區 : ', bets);
            return;
        }
        var msg = LiveProtocolManager_1.LiveProtocolManager.Encode_RequestBet(this.enterSeatTable.tID, 1, bets);
        this.writInfo('傳送下注請求 : ', msg);
        this.pomelo.notify(LiveRobotEnum_1.LiveRoute.GameRequest, msg);
    };
    // 阻擋非目標遊戲桌封包資訊
    LiveRobotBase.prototype.filterMessage = function (vccTable) {
        if (!this.gameSetting.isFilter) {
            return true;
        }
        // 尚未入座 > 全部阻擋
        if (!this.enterSeatTable) {
            return false;
        }
        var res = true;
        if (!vccTable) {
            return res;
        }
        else {
            if (vccTable !== this.enterSeatTable.vID) {
                res = false;
            }
        }
        return res;
    };
    LiveRobotBase.prototype.sendMsgToTG = function (chatID, msg) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        var sendMsg = util.format.apply(util, [msg].concat(params));
        var url = URL.format({
            protocol: 'https',
            host: 'api.telegram.org/bot941332209:AAGo91TAEhzEn6AY8ALAFr0vdd952AN571A',
            pathname: '/sendMessage',
            query: {
                chat_id: chatID,
                text: sendMsg,
            }
        });
        var option = {
            uri: url,
        };
        var callback = function (error, json) {
            if (error) {
                console.error('Call TG Failed : ', json);
            }
        };
        this.get(option, callback);
    };
    LiveRobotBase.prototype.get = function (options, cb) {
        options.method = 'GET';
        options.json = true;
        options.rejectUnauthorized = false;
        request(options, function (err, response, body) {
            if (!err && response.statusCode === 200 && cb && body) {
                cb(null, body);
            }
            else {
                cb(err ? err : body);
            }
        });
    };
    return LiveRobotBase;
}());
exports.LiveRobotBase = LiveRobotBase;
