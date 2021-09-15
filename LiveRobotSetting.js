"use strict";
/**
 * Created by kaneyang on 2021-09-09 13:59
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveRobotSetting = {
    3310: {
        path: './game/BCRobot.js',
        loggerName: 'bc',
        // tableID: 78,                            // 入座&下注遊戲桌ID
        vccTableID: '3_330011',
        isBet: true,
        bets: {
            'b10': 10,
            'b11': 10
        },
        isFilter: true // 是否阻擋其他遊戲桌封包
    },
    3320: {
        path: './game/BBCRobot.js',
        loggerName: 'bbc',
        tableID: 78,
        vccTableID: '11_11332001',
        isBet: true,
        bets: {
            'b10': 10,
        },
        isFilter: true // 是否阻擋其他遊戲桌封包
    }
};
