"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by kaneyang on 2021-09-10 10:19
 */
var LiveRobotBase_1 = require("../LiveRobotBase");
var util = require('util');
var BCBetAreaCode;
(function (BCBetAreaCode) {
    BCBetAreaCode["Bank"] = "b1";
    BCBetAreaCode["Play"] = "b2";
    BCBetAreaCode["BankPair"] = "b3";
    BCBetAreaCode["PlayPair"] = "b4";
    BCBetAreaCode["Big"] = "b5";
    BCBetAreaCode["Small"] = "b6";
    BCBetAreaCode["Draw"] = "b7";
    BCBetAreaCode["AnyPair"] = "b8";
    BCBetAreaCode["PerfectPair"] = "b9";
    BCBetAreaCode["NoComm"] = "b10";
    BCBetAreaCode["SuperSix"] = "b11"; // 幸運六,莊家六點獲勝
})(BCBetAreaCode = exports.BCBetAreaCode || (exports.BCBetAreaCode = {}));
var BCRobot = /** @class */ (function (_super) {
    __extends(BCRobot, _super);
    function BCRobot(env, gameType, playerIndex) {
        return _super.call(this, env, gameType, playerIndex) || this;
    }
    // 入座結果封包處理
    BCRobot.prototype.handleEnterSeatResponse = function (msg) {
        _super.prototype.handleEnterSeatResponse.call(this, msg);
    };
    // 遊戲開局封包處理
    BCRobot.prototype.handleRoundStart = function (data) {
        _super.prototype.handleRoundStart.call(this, data);
        this.enterSeatTable.rID = data.rID;
    };
    // 遊戲發牌封包處理
    BCRobot.prototype.handleDealInfo = function (data) {
        _super.prototype.handleDealInfo.call(this, data);
    };
    // 遊戲結束封包處理
    BCRobot.prototype.handleRoundEnd = function (data) {
        _super.prototype.handleRoundEnd.call(this, data);
        var b1 = data.cs.b1;
        var b2 = data.cs.b2;
        var b3 = !data.cs.b3 || data.cs.p3 === '' ? null : data.cs.b3;
        var p1 = data.cs.p1;
        var p2 = data.cs.p2;
        var p3 = !data.cs.p3 || data.cs.p3 === '' ? null : data.cs.p3;
        var bCount = !!b3 ? 3 : 2;
        var pCount = !!p3 ? 3 : 2;
        var bankPoint = this.getTotalPoints([b1, b2, b3]);
        var playPoint = this.getTotalPoints([p1, p2, p3]);
        var str = '\n';
        str += util.format('莊家 : %s 點(%s %s %s)\n閒家 : %s 點(%s %s %s)\n', bankPoint, b1, b2, !!b3 ? b3 : 'x', playPoint, p1, p2, !!p3 ? p3 : 'x');
        var winBets = data.wb[this.enterSeatTable.tID];
        str += '獲勝注區 : ';
        for (var key in winBets) {
            var area = winBets[key];
            str += this.getBetAreaStr(area) + ' , ';
        }
        str = str.substring(0, str.length - 2);
        this.writInfo(str);
        if (bankPoint === 6 && playPoint < bankPoint) {
            var mainMsg = '[%s][%s]幸運六開出(卡牌數:%s) : %s vs %s';
            this.sendMsgToTG(-366364546, mainMsg, this.enterSeatTable.vID, this.enterSeatTable.rID, bCount, bankPoint, playPoint);
        }
    };
    // 下注結果封包處理
    BCRobot.prototype.handleBetResult = function (msg) {
        _super.prototype.handleBetResult.call(this, msg);
    };
    // 派彩封包處理
    BCRobot.prototype.handleRoundResult = function (data) {
        _super.prototype.handleRoundResult.call(this, data);
    };
    BCRobot.prototype.getTotalPoints = function (cards) {
        var total = 0;
        for (var key in cards) {
            var card = cards[key];
            if (card && card !== '') {
                var point = parseInt(card.substring(1));
                point = point < 10 ? point : 0;
                total += point;
            }
        }
        return total % 10;
    };
    BCRobot.prototype.getBetAreaStr = function (area) {
        var res = '';
        switch (area) {
            case BCBetAreaCode.Bank:
                res = '莊';
                break;
            case BCBetAreaCode.Play:
                res = '閒';
                break;
            case BCBetAreaCode.BankPair:
                res = '莊對';
                break;
            case BCBetAreaCode.PlayPair:
                res = '閒對';
                break;
            case BCBetAreaCode.Big:
                res = '大';
                break;
            case BCBetAreaCode.Small:
                res = '小';
                break;
            case BCBetAreaCode.Draw:
                res = '和';
                break;
            case BCBetAreaCode.AnyPair:
                res = '任意對';
                break;
            case BCBetAreaCode.PerfectPair:
                res = '完美對';
                break;
            case BCBetAreaCode.NoComm:
                res = '莊免佣';
                break;
            case BCBetAreaCode.SuperSix:
                res = '幸運六';
                break;
            default:
                res = '不明注區:' + area;
                break;
        }
        return res;
    };
    return BCRobot;
}(LiveRobotBase_1.LiveRobotBase));
exports.BCRobot = BCRobot;
module.exports = BCRobot;
