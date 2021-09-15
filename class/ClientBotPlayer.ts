/**
 * Created by kaneyang on 2021-09-06 13:58
 */

export class ClientBotPlayer {

    public sid: string;

    public account: string;
    public accountType: number;
    public chips: any[];
    public credit: number;
    public currency: string;
    public goodRoad: any;
    public isActive: boolean;
    public isBet: boolean;
    public limit: any;
    public nickname: string;
    public payway: string;
    public paymentURL: string;
    public playerID: number;
    public userTag: string;
    public timeZone: string;
    public gameTypesDeny: number[];
    public ad: string;
    public tablesDeny: number[];
    public userLimit: any;
    public recommendList: any;
    public userGroups: number[];

    constructor( sid: string ) {
        this.sid = sid;
    }

    public setLoginCallBackData( data: any ) {
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
    }
}