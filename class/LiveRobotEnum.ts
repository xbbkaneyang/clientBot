/**
 * Created by kaneyang on 2021-09-09 14:25
 */

export enum LiveRoute {
    GateRequest = 'gate.gateHandler.queryEntry',
    ConnectorLogin = 'connector.inHandler.enter',
    LobbyEnterGame = 'lobby.lobbyHandler.enterGame',
    LobbyGetOnlineUser = 'lobby.lobbyHandler.getOnlineUser',
    GameRequest = 'game.gameHandler.Game',
}

// 大廳協議
export enum LiveLobbyProtocolType {
    GameList = 1,
    OnlineUser = 12,
    MaintainAll     = 91, // 金流平台掛維護
    MaintainCompany = 92, // 平台商維護
    MaintainGame    = 93, // 對遊戲掛分項維護
}

// 遊戲接收協議
export enum LiveGameProtocolType {
    OnConnect = 1,                       // 傳送遊戲連線成功通知
    InitTableInfo = 2,                   // 傳送初始桌資訊
    EnterSeatResponse = 3,               // 傳送入座回傳資訊
    BetResult = 4,                        // 傳送下注結果
    RoundStart = 5,                      // 傳送新局開始
    DealInfo = 6,                        // 傳送發牌訊息
    RoundEnd = 7,                        // 傳送回合結束
    LeaveSeatResponse = 8,               // 傳送離座回傳資訊
    OtherEnterSeat = 9,                  // 傳送同桌他人入座資訊
    OtherLeaveSeat = 10,                 // 傳送他人離座資訊
    RoundResult = 11,                    // 傳送派彩結果
    ChangeBoots = 12,                    // 傳送換靴通知
    ChangeDealer = 13,                   // 傳送換荷官通知
    UpdatePool = 14,                     // 更新彩池訊息
    ChangeVCCMarquee = 15,               // 更新VCC跑馬燈
    AddTable = 16,                       // 加桌
    UpdateVCCInfo = 17,                  // 更新VCC桌資訊
    Shuffle = 18,                        // 傳送洗牌通知
    ChangeVideoStreaming = 19,           // 傳送換VCC串流
    ChangeCdnLink = 20,                  // 傳送換VCC cdn
    ChangeVCCActive = 21,                // 傳送VCC桌啟用變更通知
    ChangeAllowBetTime = 22,             // 傳送允許下注時間變更通知
    CancelRound = 23,                    // 傳送回合註銷通知
    ChangeTableActive = 24,              // 傳送桌啟用變更通知
    ChangeTableMaintain = 25,            // 傳送桌維護變更通知
    ChangeTableName = 26,                // 傳送更改桌名稱通知
    ChangeTableMarquee = 27,             // 傳送更改控端桌跑馬燈通知
    SetNickname = 28,                    // 傳送玩家設定暱稱結果
    SetChips = 29,                       // 傳送玩家設定慣用籌碼結果
    SetGoodRoad = 30,                    // 傳送玩家設定好路結果
    UpdateTableInfo = 31,                // 傳送更新桌資訊
    EnterSeatCount = 32,                 // 傳送入座玩家人數
    VccDisConnect = 33,                  // 傳送vcc斷線通知
    UpdatePlayersCredit = 34,            // 傳送更新虛擬桌所有玩家餘額
    HeadCardInfo = 35,                   // 傳送頭牌資訊
    GamePlayInfo = 36,                   // 傳送玩法資訊
    HistoryInfo = 37,                    // 傳送發牌歷史資訊
    NoTripleRound = 38,                  // 傳送未開豹子/同花順局數
    VCCTableMaintain = 39,               // 傳送vcc桌維護變更通知
    TableGroupList = 40,                 // 傳送控端桌群組列表
    VCCTableHistory = 41,                // 傳送vcc桌發牌歷史紀錄
    UpdatePlayerCredit = 42,             // 更新玩家餘額
    BlockChainShoeInfo = 43,             // 傳送區塊鏈靴資訊
    BlockChainShoeDropCardCount = 44,    // 傳送區塊鏈當前靴棄牌張數
    PreRoundCardInfo = 45,               // 傳送前一局發牌資訊
    BlockChainTxInfo = 46,               // 傳送最新上鍊交易hash資訊
    BlockChainCurrentRoundCardHash = 47, // 傳送當前局卡牌hash資訊
    InsuranceBet = 48,                   // 傳送保險下注通知
    UsualMarquee = 49,                   // 傳送常駐跑馬燈
    ChangeSettlementTime = 50,           // 傳送等待新局時間變更通知
    AutoBetResult = 51,                  // 傳送自動下注請求結果
    StopAutoBetResult = 52,              // 傳送停止自動下注請求結果
    TableCategoryList = 53,              // 傳送大廳桌分類列表
    ChangeDefaultBaccaratBigSmallDenyRound = 54,// 傳送預設百家樂禁止投注大小局數變更通知
    AllowAutoBetGameList = 55,           // 傳送允許自動投注遊戲列表
    RoomBetResult = 56,                  // 傳送同桌玩家下注結果
    ChangeAllowAutoBetGames = 57,        // 傳送更新開放自動投注平台商列表
    ChangeCustomBaccaratBigSmallDenyRound = 58, // 傳送自訂百家樂禁止投注大小局數變更通知
    CustomBaccaratBigSmallDenyRoundGroups = 59, // 傳送自訂百家樂禁止投注大小局數使用群組
    ChangeDefaultAutoBetAllowGames = 60,        // 傳送預設允許自動投注遊戲列表變更通知
    ChangeCustomAutoBetAllowGames = 61,        // 傳送自訂允許自動投注遊戲列表變更通知
    CustomAutoBetAllowGamesGroups = 62,        // 傳送自訂允許自動投注遊戲列表使用群組
    UserGroupRuleSetting = 63,                  // 傳送會員標籤規則設定
    ChangePlayerUserGroups = 64,                 // 傳送更新玩家會員標籤
    AddCurrency = 65,                       // 傳送新增幣別/匯率
    ChangeCurrency = 66,                       // 傳送修改幣別/匯率
    ExtraResponse = 99                   // 傳送遊戲額外請求回傳
}

// 遊戲前端請求協議
export enum LiveGameClientProtocolType {
    AllTables = 2,                  // 取所有桌
    EnterSeat = 3,                  // 入座
    Bet = 4,                        // 下注
    LeaveSeat = 5,                  // 離座
    SetNickname = 6,                // 設定暱稱
    SetChips = 7,                   // 設定慣用籌碼
    SetGoodRoad = 8,                // 設定好路
    GetHistory = 9,                 // 取歷史發牌紀錄
    GetShoeInfo = 10,               // 取區塊鏈靴資訊
    GetPreRoundCardInfo = 11,       // 取前一局發牌資訊
    AutoBet = 12,                   // 自動投注請求
    StopAutoBet = 13,               // 停止自動投注請求
    Extra = 99                      // 接收各遊戲額外請求
}

// 錯誤碼
export enum ErrorReason {

    CompanyNotFound = 101,          // 查無此平台商
    PlayerNotFound = 102,           // 查無該玩家
    LeaveWrongSeat = 103,           // 離錯桌子(先前非入座該桌)
    DuplicateEnterSeat = 104,       // 重複入座(僅允許入一桌，不允許入座同桌&同時入座2桌以上)
    LimitNotFound = 105,            // 未帶限額設定值
    InsertCreditRecordFail = 106,   // 寫入credit record失敗
    UpdateCreditRecordFail = 107,   // 更新credit record失敗
    EnterSeatTableIsMaintain = 108, // 入座桌子維護中
    SeatTableNotFound = 109,        // 查無此入/離座桌
    SeatTableIsNotActive = 110,     // 入/離座桌桌子未啟用
    RoomNotFound = 111,             // 查無虛擬桌
    EnterSeatGameTypeDeny = 112,    // 禁玩該遊戲，禁止入座
    NoConnectorData = 113,          // 查無connector資訊
    EnterSeatTableDeny = 114,       // 禁玩該桌，禁止入座
    ShoeInfoNotFound = 115,         // 查無區塊鏈桌資訊
    AutoBetGameTypeDeny = 116,      // 遊戲類別禁止自動投注
    AutoBetHaveSetting = 117,       // 已有設定自動投注
    AutoBetIntervalDeny = 118,      // 自動投注請求過於頻繁
    AutoBetRunning = 119,           // 自動投注中，禁止設定
    FindNoAutoBetSetting = 120,     // 查無自動投注設定
    AutoBetNotAllowBet = 121,       // 玩家停押中，不允許自動投注

    TableNotFound = 201,          // 查無此桌
    TableIsNotActive = 202,       // 桌子未啟用
    TableIsMaintain = 203,        // 桌子維護中
    BetAreaError = 204,           // 下注注區有誤
    GameNotFound = 205,           // 無此遊戲
    NotAllowBettingStatus = 206,  // 非在允許下注階段,不得下注
    CancelRound = 207,            // 此局註銷不能下注
    BetLimitNotFound = 208,       // 找不到該桌限額
    BetAmountError = 209,         // 下注金額不合法
    GetWagersIDFail = 210,        // 取注單ID失敗
    InsertWagersExtendFail = 211, // 寫入注單明細失敗
    InsertWagersFail = 212,       // 寫入注單失敗
    ReduceCreditFail = 213,       // 扣款失敗
    AddCreditFail = 214,          // 加錢失敗
    CreditNotEnough = 215,        // 玩家餘額不足
    NotAllowBet = 216,            // 玩家不允許下注(停押)
    OverAllowBetTime = 217,       // 超過可下注時間
    VCCTableNotFound = 218,       // 無對應vcc桌
    OverPerRoundBetCount = 219,   // 超過每回合可下注次數
    OverBetAreaLimitMax = 220,    // 超過注區最高限額
    GameTypeDeny = 221,           // 禁玩該遊戲
    TableDeny = 222,              // 禁玩該桌
    BaccaratPairDeny = 223,       // 百家樂遊戲超過60局禁下對子注區
    AutoBetSettingNotFound = 224, // 查無自動投注設定
    AutoBetCreditNotEnough = 225, // 自動投注餘額不足
    AutoBetIllegal = 226,         // 自動投注請求不合法
    AutoBettingDeny = 227,        // 自動投注中，禁止客端下注
    AutoBetRoundNotEnough = 228,  // 自動投注局數不足
    AutoBetStopLoss = 229,        // 自動投注到達停損停止
    AutoBetTakeProfit = 230,      // 自動投注到達停利停止
    AutoBetStopRequest = 231,     // 前端請求停止自動投注
    AutoBetPlayOnlineStop = 232,  // 玩家上線自動投注停止
    CompanyMaintain = 233,        // 平台商維護，禁止下注
    GSMaintain = 234,             // 大維護，禁止下注
    PlayerNotActive = 235,        // 玩家帳號停用，禁止下注

    ApiDataIllegal = 301,         // 接收的Api資料不合法
    RequestDataIllegal = 302,     // 接收client資料不合法
    UpdateDBUserDataFail = 303,   // 更新DB玩家資料失敗
    RoundResultIllegal = 304,     // 賽果不合法
    UpdateRoundSerialFail = 306,  // 更新局明細失敗
    DenyChangeResult = 307,       // 禁止修改賽果

    FunctionDoNotOverride = 0     // 遊戲開發者未實作
}