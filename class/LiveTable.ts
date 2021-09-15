/**
 * Created by kaneyang on 2021-09-09 15:17
 */

export class LiveTable {

    // 遊戲桌參數
    public n: any;      // 桌名
    public tID: any;    // 桌號
    public cID: any;    // 公司ID
    public a: any;      // 是否啟用
    public im: any;     // 是否維護
    public bs: any;     // 玩家在此桌當前回合的下注資訊
    public gt: any;     // 遊戲類別(ex:3310)
    public mq: any;     // 控端桌跑馬燈
    public lt: any;     // 桌限額
    public gp: any;     // 玩法
    public c: any;      // 入座人數
    public pc: any;     // 當前回合彩池下注玩家數量
    public b: any;      // 當前回合彩池注區,注額,下注人數
    public ss: any;     // 視訊尺寸設定
    public od: any;     // 桌排序
    public gID: any;    // 控端桌群組ID
    public ico: any;    // 遊戲桌圖示
    public sgt: any;    // 共用玩法遊戲類別
    public e: any;      // 各遊戲額外桌參數

    // 現場桌參數
    public vID: any;    // 現場桌號
    public rID: any;    // 局號
    public bID: any;    // 靴號
    public br: any;     // 靴局號
    public bat: any;    // gameStartUTCTime校準時間
    public cs: any;     // 目前發牌資訊
    public sts: any;    // 局狀態:0-等待新局,1-下注中,2-開牌中,3-未用,4-洗牌中
    public sit: any;    // 現場代碼
    public res: any;    // 當前局是否已結束(開新局=false,有結果=true)
    public vs: any;     // 串流
    public cdn: any;    // cdnLink
    public vmq: any;    // 現場桌跑馬燈
    public mu: any;     // 歷史公告URL
    public hc: any;     // 當前局頭牌資訊(cs:頭牌卡牌,rID:頭牌所屬局號)
    public nTR: any;    // 未開豹子局數
    public nSF: any;    // 未開同花順局數
    public vim: any;    // 現場桌維護狀態
    public ht: any;     // 發牌歷史
    public dl: any;     // 荷官資訊
    public crd: any;    // 註銷局號
    public ibo: any;    // 保險下注賠率
    public wb: any;     // 當局獲勝注區
    public smt: any;    // 等待新局時間
    public ret: any;    // 停止下注時間

    constructor( params: any ) {
        this.n = params.n;
        this.tID = params.tID;
        this.cID = params.cID;
        this.a = params.a;
        this.im = params.im;
        this.bs = params.bs;
        this.gt = params.gt;
        this.mq = params.mq;
        this.lt = params.lt;
        this.gp = params.gp;
        this.c = params.c;
        this.pc = params.pc;
        this.b = params.b;
        this.ss = params.ss;
        this.od = params.od;
        this.gID = params.gID;
        this.ico = params.ico;
        this.sgt = params.sgt;
        this.e = params.e;

        this.vID = params.vID;
        this.rID = params.rID;
        this.bID = params.bID;
        this.br = params.br;
        this.bat = params.bat;
        this.cs = params.cs;
        this.sts = params.sts;
        this.sit = params.sit;
        this.res = params.res;
        this.vs = params.vs;
        this.cdn = params.cdn;
        this.vmq = params.vmq;
        this.mu = params.mu;
        this.hc = params.hc;
        this.nTR = params.nTR;
        this.nSF = params.nSF;
        this.vim = params.vim;
        this.ht = params.ht;
        this.dl = params.dl;
        this.crd = params.crd;
        this.ibo = params.ibo;
        this.wb = params.wb;
        this.smt = params.smt;
        this.ret = params.ret;
    }

    public checkAllowBet(): boolean {
        return this.a && !this.im && !this.vim;
    }
}