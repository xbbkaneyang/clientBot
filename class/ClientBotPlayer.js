"use strict";
/**
 * Created by kaneyang on 2021-09-06 13:58
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ClientBotPlayer = /** @class */ (function () {
    function ClientBotPlayer(sid) {
        this.sid = sid;
    }
    ClientBotPlayer.prototype.setLoginCallBackData = function (data) {
        this.account = data.account;
        this.accountType = data.accountType;
        this.chips = data.chips;
        this.credit = data.credit;
        this.currency = data.currency;
        this.goodRoad = data.goodRoad;
        this.isActive = data.isActive;
        this.isBet = data.isBet;
        this.limit = data.limit;
        this.nickname = data.nickname;
        this.payway = data.payway;
        this.paymentURL = data.paymentURL;
        this.playerID = data.playerID;
        this.userTag = data.userTag;
        this.timeZone = data.timeZone;
        this.gameTypesDeny = data.gameTypesDeny;
        this.ad = data.ad;
        this.tablesDeny = data.tablesDeny;
        this.userLimit = data.userLimit;
        this.recommendList = data.recommendList;
        this.userGroups = data.userGroups;
    };
    return ClientBotPlayer;
}());
exports.ClientBotPlayer = ClientBotPlayer;
