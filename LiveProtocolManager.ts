/**
 * Created by kaneyang on 2021-09-09 16:36
 */
import {LiveGameClientProtocolType} from './class/LiveRobotEnum';

export class LiveProtocolManager {

    // 入座請求
    public static Encode_RequestEnterSeat( tableID: number ) {
        let msg: any = {};
        msg.c = LiveGameClientProtocolType.EnterSeat;
        msg.tableID = tableID;
        return msg;
    }

    // 下注請求
    public static Encode_RequestBet( tableID: number , wagersType: any , betArea: {[area: string]: number} , roadDetail: string = '0' ) {
        let msg: any = {};
        msg.c = LiveGameClientProtocolType.Bet;
        msg.tableID = tableID;
        msg.wagersType = wagersType;
        msg.bets = betArea;
        msg.roadDetail = roadDetail;
        return msg;
    }
}