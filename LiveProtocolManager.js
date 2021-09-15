"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by kaneyang on 2021-09-09 16:36
 */
var LiveRobotEnum_1 = require("./class/LiveRobotEnum");
var LiveProtocolManager = /** @class */ (function () {
    function LiveProtocolManager() {
    }
    // 入座請求
    LiveProtocolManager.Encode_RequestEnterSeat = function (tableID) {
        var msg = {};
        msg.c = LiveRobotEnum_1.LiveGameClientProtocolType.EnterSeat;
        msg.tableID = tableID;
        return msg;
    };
    // 下注請求
    LiveProtocolManager.Encode_RequestBet = function (tableID, wagersType, betArea, roadDetail) {
        if (roadDetail === void 0) { roadDetail = '0'; }
        var msg = {};
        msg.c = LiveRobotEnum_1.LiveGameClientProtocolType.Bet;
        msg.tableID = tableID;
        msg.wagersType = wagersType;
        msg.bets = betArea;
        msg.roadDetail = roadDetail;
        return msg;
    };
    return LiveProtocolManager;
}());
exports.LiveProtocolManager = LiveProtocolManager;
