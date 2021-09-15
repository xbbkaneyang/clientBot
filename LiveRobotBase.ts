/**
 * Created by kaneyang on 2021-09-06 11:17
 */
import {ClientBotPlayer} from './class/ClientBotPlayer';
import {LiveRobotSetting} from './LiveRobotSetting';
import {LiveGameProtocolType, LiveLobbyProtocolType, LiveRoute} from './class/LiveRobotEnum';
import {LiveTable} from './class/LiveTable';
import {LiveProtocolManager} from './LiveProtocolManager';

const process = require('process');
const log4js = require('log4js');
const request = require('request');
const util = require( 'util' );
const PomeloClient = require('./lib/pomelo-client-multiple');
const apiSetting = require('./config/api.json');
const URL = require('url');

export class LiveRobotBase {

    private pomelo: any;

    private env: string;

    private gameType: number;
    private gameSetting: any;
    private playerIndex: number;

    private logger: any;
    private errorLogger: any;

    private isGateDisconnect: boolean = false;
    private connectorHost: string;
    private connectorPort: string;

    public clientBotPlayer: ClientBotPlayer;

    private tableList: { [tableID: number]: any } = {};
    private vccTableMapping: { [vccTableID: string]: { [tableID: number]: boolean } } = {};
    private tableCount: number = 0;

    public enterSeatTable: LiveTable;

    constructor( env: string, gameType: string , playerIndex: number ) {
        this.env = env;
        this.gameType = parseInt(gameType);
        this.gameSetting = LiveRobotSetting[this.gameType];
        this.playerIndex = playerIndex;
        this.makeLogger();
        this.pomelo = new PomeloClient();
        this.pomelo.on('close', this.onDisconnect.bind(this));
        this.pomelo.on('onKick', this.onKick.bind(this));
        this.pomelo.on('io-error', this.onError.bind(this));
        this.pomelo.on('onEnterGame', this.onEnterGame.bind(this));
        this.onLinkFun();
    }

    public start() {
        this.connectToGate();
    }

    private connectToGate() {
        let gateInfo = require('./config/gate.json')[this.env];
        this.pomelo.init({
            host: gateInfo.host,
            port: gateInfo.port,
            log: true
        }, function () {
            let route = LiveRoute.GateRequest;
            this.pomelo.request(route, {token: "session_token"}, function (data) {
                if (data.code === 200) {
                    this.writeWarn('connect to gs gate success : ', data);
                    this.isGateDisconnect = true;
                    this.connectorHost = data.host;
                    this.connectorPort = data.port;
                    this.pomelo.disconnect();
                } else {
                    this.writeError('connect to gs gate fail : ', data);
                }
            }.bind(this));
        }.bind(this));
    }

    private connectToConnector(sid: string) {
        this.pomelo.init({
            host: this.connectorHost,
            port: this.connectorPort,
            log: true
        }, function () {
            let route = LiveRoute.ConnectorLogin;
            let loginData = this.makeLoginData(sid);
            this.pomelo.request(route, loginData, function (playerData) {
                this.writeWarn('connect to gs connector : ', playerData);
                this.clientBotPlayer.setLoginCallBackData(playerData);
            }.bind(this));
        }.bind(this));
    }

    private makeLoginData(sid: string) {
        let res: any = {};
        res.sid = sid;
        res.lang = 'zh-cn';
        res.optimize = 10;
        res.deviceType = 'pc';
        res.wagersType = 1;
        return res;
    }

    private makeLogger() {
        const logConfig = require('./config/log4js.json');
        if ( !logConfig.levels[this.gameSetting.loggerName] ) {
            console.error('can not find logger : %s, plz set correct loggerName' , this.gameSetting.loggerName );
            process.exit();
        }
        log4js.configure(logConfig);
        this.logger = log4js.getLogger(this.gameSetting.loggerName);
        this.errorLogger = log4js.getLogger(this.gameSetting.loggerName + '-error');

    }

    private onDisconnect(event) {
        this.writeWarn('onDisconnect : ', JSON.stringify(event));
        if (this.isGateDisconnect) {
            let loginList = require('./config/player.json')[this.env];
            if (!loginList || loginList.length === 0) {
                this.writeError("env %s find no player login data : %s", this.env, loginList);
                return;
            }
            let loginInfo = loginList[this.playerIndex];
            if ( !loginInfo ) {
                this.writeError('can not find player use index : ' , this.playerIndex );
                process.exit();
            }
            this.getSid(loginInfo.Account, loginInfo.Password, function (err, sidData) {
                if (err) {
                    this.writeError("get sid fail : ", err);
                    return;
                }
                this.clientBotPlayer = new ClientBotPlayer(sidData.sid);
                this.connectToConnector(this.clientBotPlayer.sid);
            }.bind(this));
        }
    }

    private onKick(event) {
        this.writeError('onKick : ', JSON.stringify(event));
    }

    private onError(event) {
        this.writeError('onError : ', JSON.stringify(event));
    }

    private onEnterGame(msg) {
        this.writeWarn('onEnterGame : ', msg);
    }

    private enterGame() {
        let msg: any = {};
        msg.g = [this.gameType];
        setTimeout(function () {
            this.pomelo.notify(LiveRoute.LobbyEnterGame, msg);
        }.bind(this), 500);
    }

    private onLobbyReceive(msg) {
        let protocolType = msg.c;
        let data = msg.d;
        switch (protocolType) {
            case LiveLobbyProtocolType.GameList:
                this.writInfo('取得遊戲列表 : ', data);
                this.enterGame();
                break;
            case LiveLobbyProtocolType.OnlineUser:
                this.writInfo('取得在線人數 : ', data);
                break;
            default:
                this.writeError('onLobbyReceive unknown protocol : ', msg);
                break;
        }
    }

    private onGameReceive(msg) {
        let protocolType = msg.c;
        let data = msg.d;
        switch (protocolType) {
            case LiveGameProtocolType.OnConnect:
                this.writInfo('遊戲連線成功 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveGameProtocolType.GamePlayInfo:
                this.writInfo('接收玩法資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveGameProtocolType.TableGroupList:
                this.writInfo('接收控端桌群組列表 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveGameProtocolType.TableCategoryList:
                this.writInfo('接收大廳桌分類列表 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveGameProtocolType.UsualMarquee:
                this.writInfo('接收常駐跑馬燈 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveGameProtocolType.AllowAutoBetGameList:
                this.writInfo('接收允許自動投注遊戲列表 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveGameProtocolType.UserGroupRuleSetting:
                this.writInfo('接收會員標籤規則設定 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                break;
            case LiveGameProtocolType.InitTableInfo:
                this.writInfo('接收遊戲桌資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleTableInfo(data);
                break;
            case LiveGameProtocolType.EnterSeatResponse:
                this.writInfo('接收入座結果 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleEnterSeatResponse(msg);
                break;
            case LiveGameProtocolType.RoundStart:
                if ( !this.filterMessage( msg.d.vID ) ) {
                    return;
                }
                this.writInfo('接收開局資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleRoundStart(msg.d);
                break;
            case LiveGameProtocolType.DealInfo:
                if ( !this.filterMessage( msg.d.vID ) ) {
                    return;
                }
                this.writInfo('接收發牌資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleDealInfo(msg.d);
                break;
            case LiveGameProtocolType.RoundEnd:
                if ( !this.filterMessage( msg.d.vID ) ) {
                    return;
                }
                this.writInfo('接收回合結束資訊 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleRoundEnd(msg.d);
                break;
            case LiveGameProtocolType.BetResult:
                this.writInfo('接收下注結果 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleBetResult( msg );
                break;
            case LiveGameProtocolType.RoundResult:
                this.writInfo('接收派彩結果 : \x1b[30m%s\x1b[0m', JSON.stringify(msg));
                this.handleRoundResult( msg.d );
                break;
            default:
                // this.writeError('onGameReceive unknown protocol : ' , msg );
                break;
        }

    }

    private onOtherReceive(msg) {
        this.writeWarn('onOtherReceive : ', msg);
    }

    private onLinkFun() {
        for (let i = 1; i < 999; i++) {
            let iStr: string = i.toString();
            let fun;
            if (iStr === '1') {
                fun = this['onLobbyReceive']
            } else if (iStr === '2') {
                fun = this['onGameReceive']
            } else {
                fun = this['onOtherReceive']
            }
            this.pomelo.on(iStr, fun.bind(this));
        }
    }

    private getSid(account: string, password: string, cb) {
        let param = {
            account: account,
            password: password
        };
        let apiUrl = apiSetting[this.env];
        let post_options = {
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
                let errcode = null;
                if (parseInt(body.errorCode)) {
                    console.error('post recv errorCode,', body, post_options);
                    errcode = body;
                    cb(errcode, null);
                    return;
                }
                let bodyObj = null;
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
                    let data = bodyObj.data;
                    cb(null, data);
                }
                catch (e) {
                    console.error('body error! body:', body, ', err:', e);
                    cb(e, null);
                }
            }
        }.bind(this));
    }

    public writeDebug(msg: any, ...params: any[]) {
        this.logger.debug(msg, ...params);
    }

    public writInfo(msg: any, ...params: any[]) {
        this.logger.info(msg, ...params);
    }

    public writeWarn(msg: any, ...params: any[]) {
        this.logger.warn(msg, ...params);
    }

    public writeError(msg: any, ...params: any[]) {
        this.errorLogger.error(msg, ...params);
    }

    protected handleTableInfo( data: any ) {
        let total = data.total;
        let tables = data.tables;
        let str = '接收遊戲桌 : \n';
        for (let key in tables) {
            let tableData = tables[key];
            let table: LiveTable = new LiveTable(tableData);
            this.tableList[tableData.tID] = table;
            if ( !this.vccTableMapping[table.vID] ) {
                this.vccTableMapping[table.vID] = {};
            }
            this.vccTableMapping[table.vID][table.tID] = table.checkAllowBet();
            this.tableCount++;
            str += util.format('桌[%s](現場桌號:%s)[%s]:桌名[%s],啟用[%s],維護[%s],現場維護[%s]\n',
                table.tID,
                table.vID,
                table.gt,
                table.n['zh_tw']['name'],
                table.a,
                table.im,
                table.vim );
        }
        this.writInfo(str);
        if (this.tableCount === total) {
            // 取得所有桌資訊 > 入座
            this.enterSeat();
        }
    }

    protected handleEnterSeatResponse( msg: any ) {
        let error =  msg.error;
        let data = msg.d;
        if ( error ) {
            this.writeError('%s 入座失敗 : %s' , data.tID , msg.error );
            return;
        } else {
            this.writInfo('%s 入座成功' , data.tID );
        }
        this.enterSeatTable = this.tableList[data.tID];
    }

    protected handleRoundStart( data: any ) {
        if ( !this.gameSetting.isBet ) {
            return;
        }
        this.bet();
    }

    protected handleDealInfo( data: any ) {

    }

    protected handleRoundEnd( data: any ) {

    }

    protected handleBetResult( msg: any ) {
        let error =  msg.error;
        let data = msg.d;
        if ( error ) {
            this.writeError('%s 下注失敗 : %s' , data.tID , msg.error );
            return;
        } else {
            this.writInfo('%s 下注成功' , data.tID );
            this.clientBotPlayer.currency = data.cr;
        }
    }

    protected handleRoundResult( data: any ) {
        this.clientBotPlayer.currency = data.cr;
    }

    private enterSeat() {
        let enterSeatTableID = null;
        let targetTableID = this.gameSetting.tableID;
        if ( targetTableID ) {
            let table: LiveTable = this.tableList[targetTableID];
            if ( !table ) {
                this.writeError('入座失敗，查無此遊戲桌 : ' , targetTableID );
                return;
            }
            if ( table.checkAllowBet() ) {
                this.writeError('入座失敗，該桌[%s]未啟用[%s]或維護中[im:%s, vim:%s] : ' , targetTableID , table.a , table.im , table.vim );
                return;
            }
            if ( table.gt !== this.gameType ) {
                console.log('%s vs %s', typeof table.gt , typeof this.gameType );
                this.writeError('入座失敗，該桌[%s]遊戲類[%s]別與bot[%s]不一致' , targetTableID , table.gt , this.gameType );
                return;
            }
            enterSeatTableID = targetTableID;
        } else {
            // 未設定遊戲桌ID > 取現場桌ID
            let targetVccTableID = this.gameSetting.vccTableID;
            let tableList = this.vccTableMapping[targetVccTableID];
            if ( !tableList ) {
                this.writeError('入座失敗，查無此現場桌 : ' , targetVccTableID );
                return;
            }
            for ( let tID in tableList ) {
                if ( tableList[tID] ) {
                    let mt: LiveTable = this.tableList[tID];
                    if ( mt.gt !== this.gameType ) {

                        this.writeWarn('該桌[%s]遊戲類別[%s]與bot[%s]不一致 > pass ' , tID , mt.gt , this.gameType );
                        continue;
                    }
                    enterSeatTableID = parseInt(tID);
                    break;
                }
            }
            if ( !enterSeatTableID ) {
                this.writeError('入座失敗，該現場桌%s對應之遊戲桌均無法遊戲 : %s' , targetVccTableID , JSON.stringify(tableList) );
                return;
            }
        }

        if ( enterSeatTableID ) {
            let msg = LiveProtocolManager.Encode_RequestEnterSeat( enterSeatTableID );
            this.writInfo('傳送入座請求 : ' , msg );
            this.pomelo.notify( LiveRoute.GameRequest , msg );
        }
    }

    private bet() {
        let bets = this.gameSetting.bets;
        if ( !this.enterSeatTable ) {
            this.writeError('下注請求失敗，尚未入座成功 : ' , this.enterSeatTable );
            return;
        }
        if ( !bets ) {
            this.writeError('下注請求失敗，未設定下注注區 : ' , bets );
            return;
        }
        let msg = LiveProtocolManager.Encode_RequestBet( this.enterSeatTable.tID , 1 , bets );
        this.writInfo('傳送下注請求 : ' , msg );
        this.pomelo.notify( LiveRoute.GameRequest , msg );
    }

    // 阻擋非目標遊戲桌封包資訊
    private filterMessage( vccTable: number ): boolean {
        if ( !this.gameSetting.isFilter ) {
            return true;
        }
        // 尚未入座 > 全部阻擋
        if ( !this.enterSeatTable ) {
            return false;
        }
        let res = true;
        if ( !vccTable ) {
            return res;
        } else {
            if ( vccTable !== this.enterSeatTable.vID ) {
                res = false;
            }
        }
        return res;
    }

    protected sendMsgToTG( chatID: number , msg: string , ...params: any[] ) {
        let sendMsg = util.format( msg , ...params );
        let url = URL.format({
            protocol: 'https',
            host: 'api.telegram.org/bot941332209:AAGo91TAEhzEn6AY8ALAFr0vdd952AN571A',
            pathname: '/sendMessage',
            query: {
                chat_id: chatID,
                text: sendMsg,
            }
        });

        let option: any = {
            uri: url,
        };

        let callback = function( error , json) {
            if (error) {
                console.error('Call TG Failed : ' , json );
            }
        };
        this.get(option , callback);
    }

    private get(options , cb ) {
        options.method = 'GET';
        options.json = true;
        options.rejectUnauthorized = false;
        request(options, function( err, response, body) {
            if (!err && response.statusCode === 200 && cb && body) {
                cb(null, body);
            } else {
                cb(err ? err : body);
            }
        });
    }
}