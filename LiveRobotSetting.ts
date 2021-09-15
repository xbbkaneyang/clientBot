/**
 * Created by kaneyang on 2021-09-09 13:59
 */

export const LiveRobotSetting = {
    3310: {
        path: './game/BCRobot.js',
        loggerName: 'bc',                      // logger名稱
        // tableID: 78,                            // 入座&下注遊戲桌ID
        vccTableID: '3_330011',              // 入座&下注現場桌ID
        isBet: true,                            // 是否下注
        bets: {                                 // 下注組合
            'b10': 10,
            'b11': 10
        },
        isFilter: true                         // 是否阻擋其他遊戲桌封包
    },
    3320: {
        path: './game/BBCRobot.js',
        loggerName: 'bbc',                      // logger名稱
        tableID: 78,                            // 入座&下注遊戲桌ID
        vccTableID: '11_11332001',              // 入座&下注現場桌ID
        isBet: true,                            // 是否下注
        bets: {                                 // 下注組合
            'b10': 10,
            // 'b11': 10
        },
        isFilter: true                         // 是否阻擋其他遊戲桌封包
    }
};