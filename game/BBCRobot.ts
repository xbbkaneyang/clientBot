/**
 * Created by kaneyang on 2021-09-10 10:19
 */
import {LiveRobotBase} from '../LiveRobotBase';

const util = require('util');

export enum BBCBetAreaCode {
    Bank = 'b1',         // 莊
    Play = 'b2',         // 閒
    BankPair = 'b3',     // 莊對
    PlayPair = 'b4',     // 閒對
    Big = 'b5',          // 大,莊閒出牌總和為5 or 6,bootsRound超過30回合不能下
    Small = 'b6',        // 小,莊閒出牌總和為4,bootsRound超過30回合不能下
    Draw = 'b7',         // 和
    AnyPair = 'b8',      // 任意對
    PerfectPair = 'b9',  // 完美對
    NoComm = 'b10',       // 莊免佣(出現超級六時,賠率下調為0.5)
    SuperSix = 'b11'      // 幸運六,莊家六點獲勝
}

export class BBCRobot extends LiveRobotBase {

    constructor( env: string, gameType: string , playerIndex: number ) {
        super( env , gameType , playerIndex );
    }

    // 入座結果封包處理
    protected handleEnterSeatResponse( msg: any ) {
        super.handleEnterSeatResponse( msg );
    }

    // 遊戲開局封包處理
    protected handleRoundStart( data: any ) {
        super.handleRoundStart( data );
        this.enterSeatTable.rID = data.rID;
    }

    // 遊戲發牌封包處理
    protected handleDealInfo( data: any ) {
        super.handleDealInfo( data );

    }

    // 遊戲結束封包處理
    protected handleRoundEnd( data: any ) {
        super.handleRoundEnd( data );
        let b1 = data.cs.b1.c;
        let b2 = data.cs.b2.c;
        let b3 = !data.cs.b3 ? null : data.cs.b3.c;
        let p1 = data.cs.p1.c;
        let p2 = data.cs.p2.c;
        let p3 = !data.cs.p3 ? null : data.cs.p3.c;
        let bCount = !!b3 ? 3 : 2;
        let pCount = !!p3 ? 3 : 2;
        let bankPoint = this.getTotalPoints([b1,b2,b3]);
        let playPoint = this.getTotalPoints([p1,p2,p3]);
        let str = '\n';
        str += util.format('莊家 : %s 點(%s %s %s)\n閒家 : %s 點(%s %s %s)\n' ,
            bankPoint ,
            b1 ,
            b2 ,
            !!b3 ? b3 : 'x' ,
            playPoint ,
            p1 ,
            p2 ,
            !!p3 ? p3 : 'x');
        let winBets = data.wb[this.enterSeatTable.tID];
        str += '獲勝注區 : ';
        for ( let key in winBets ) {
            let area = winBets[key];
            str += this.getBetAreaStr( area ) + ' , ';
        }
        str = str.substring(0,str.length-2);
        this.writInfo(str);
        if ( bankPoint === 6 && playPoint < bankPoint ) {
            let mainMsg = '[%s][%s]幸運六開出(卡牌數:%s) : %s vs %s';
            this.sendMsgToTG( -366364546 , mainMsg , this.enterSeatTable.vID , this.enterSeatTable.rID , bCount , bankPoint , playPoint );
        }
    }

    // 下注結果封包處理
    protected handleBetResult( msg: any ) {
        super.handleBetResult( msg );

    }

    // 派彩封包處理
    protected handleRoundResult( data: any ) {
        super.handleRoundResult( data );

    }

    private getTotalPoints( cards: string[] ): number {
        let total = 0;
        for ( let key in cards ) {
            let card = cards[key];
            if ( card ) {
                let point = parseInt(card.substring(1));
                point = point < 10 ? point : 0;
                total += point;
            }
        }
        return total % 10;
    }

    private getBetAreaStr( area: string ): string {
        let res = '';
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
    }
}

module.exports = BBCRobot;