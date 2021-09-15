"use strict";
/**
 * Created by kaneyang on 2021-09-09 15:17
 */
Object.defineProperty(exports, "__esModule", { value: true });
var LiveTable = /** @class */ (function () {
    function LiveTable(params) {
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
    LiveTable.prototype.checkAllowBet = function () {
        return this.a && !this.im && !this.vim;
    };
    return LiveTable;
}());
exports.LiveTable = LiveTable;
