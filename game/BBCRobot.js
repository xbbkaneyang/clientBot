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
var BBCBetAreaCode;
(function (BBCBetAreaCode) {
    BBCBetAreaCode["Bank"] = "b1";
    BBCBetAreaCode["Play"] = "b2";
    BBCBetAreaCode["BankPair"] = "b3";
    BBCBetAreaCode["PlayPair"] = "b4";
    BBCBetAreaCode["Big"] = "b5";
    BBCBetAreaCode["Small"] = "b6";
    BBCBetAreaCode["Draw"] = "b7";
    BBCBetAreaCode["AnyPair"] = "b8";
    BBCBetAreaCode["PerfectPair"] = "b9";
    BBCBetAreaCode["NoComm"] = "b10";
    BBCBetAreaCode["SuperSix"] = "b11"; // 幸運六,莊家六點獲勝
})(BBCBetAreaCode = exports.BBCBetAreaCode || (exports.BBCBetAreaCode = {}));
var BBCRobot = /** @class */ (function (_super) {
    __extends(BBCRobot, _super);
    function BBCRobot(env, gameType, playerIndex) {
        return _super.call(this, env, gameType, playerIndex) || this;
    }
    // 入座結果封包處理
    BBCRobot.prototype.handleEnterSeatResponse = function (msg) {
        _super.prototype.handleEnterSeatResponse.call(this, msg);
    };
    // 遊戲開局封包處理
    BBCRobot.prototype.handleRoundStart = function (data) {
        _super.prototype.handleRoundStart.call(this, data);
        this.enterSeatTable.rID = data.rID;
    };
    // 遊戲發牌封包處理
    BBCRobot.prototype.handleDealInfo = function (data) {
        _super.prototype.handleDealInfo.call(this, data);
    };
    // 遊戲結束封包處理
    BBCRobot.prototype.handleRoundEnd = function (data) {
        _super.prototype.handleRoundEnd.call(this, data);
        var b1 = data.cs.b1.c;
        var b2 = data.cs.b2.c;
        var b3 = !data.cs.b3 ? null : data.cs.b3.c;
        var p1 = data.cs.p1.c;
        var p2 = data.cs.p2.c;
        var p3 = !data.cs.p3 ? null : data.cs.p3.c;
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
    BBCRobot.prototype.handleBetResult = function (msg) {
        _super.prototype.handleBetResult.call(this, msg);
    };
    // 派彩封包處理
    BBCRobot.prototype.handleRoundResult = function (data) {
        _super.prototype.handleRoundResult.call(this, data);
    };
    BBCRobot.prototype.getTotalPoints = function (cards) {
        var total = 0;
        for (var key in cards) {
            var card = cards[key];
            if (card) {
                var point = parseInt(card.substring(1));
                point = point < 10 ? point : 0;
                total += point;
            }
        }
        return total % 10;
    };
    BBCRobot.prototype.getBetAreaStr = function (area) {
        var res = '';
        switch (area) {
            case BBCBetAreaCode.Bank:
                res = '莊';
                break;
            case BBCBetAreaCode.Play:
                res = '閒';
                break;
            case BBCBetAreaCode.BankPair:
                res = '莊對';
                break;
            case BBCBetAreaCode.PlayPair:
                res = '閒對';
                break;
            case BBCBetAreaCode.Big:
                res = '大';
                break;
            case BBCBetAreaCode.Small:
                res = '小';
                break;
            case BBCBetAreaCode.Draw:
                res = '和';
                break;
            case BBCBetAreaCode.AnyPair:
                res = '任意對';
                break;
            case BBCBetAreaCode.PerfectPair:
                res = '完美對';
                break;
            case BBCBetAreaCode.NoComm:
                res = '莊免佣';
                break;
            case BBCBetAreaCode.SuperSix:
                res = '幸運六';
                break;
            default:
                res = '不明注區:' + area;
                break;
        }
        return res;
    };
    return BBCRobot;
}(LiveRobotBase_1.LiveRobotBase));
exports.BBCRobot = BBCRobot;
module.exports = BBCRobot;
