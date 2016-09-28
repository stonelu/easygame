/**
 * Copyright (c) 2014,www.easygame.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the easygame.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EASYEGRET.COM AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
module easy.rpg {
    export class RpgSetting {
        public static SHOW_OTHER_PLAYER:boolean = true;//显示其他玩家

        public static ACTOR_TYPE_NPC:string = "npc";
        public static ACTOR_TYPE_PLAYER:string = "player";
        public static ACTOR_TYPE_BUILDING:string = "building";
        //public static ACTOR_TYPE_:string = "";



        public static PLAYER_ID:number = 0;//ME ID

        public static ACTOR_STD:string = "std";//人物站立
        public static ACTOR_MOV:string = "mov";//人物行走
        public static ACTOR_DIE:string = "die";//人物死亡
        public static ACTOR_ATK:string = "atk";//人物攻击
        public static ACTOR_BAK:string = "bak";//人物被攻击
        public static ACTOR_SKL:string = "skl";//人物释放技能

        /**
         * 方向定义, valve,保持和动作序列的下标一致
         *          n
         *      wn     ne
         *    w           e
         *      sw     es
         *          s
         *
         *        [1]
         *     [2]    [8]
         *   [3]        [7]
         *     [4]    [6]
         *        [5]
         */
        public static DIRECTION_8:number = 8;
        public static DIRECTION_7:number = 7;
        public static DIRECTION_6:number = 6;
        public static DIRECTION_5:number = 5;
        public static DIRECTION_4:number = 4;
        public static DIRECTION_3:number = 3;
        public static DIRECTION_2:number = 2;
        public static DIRECTION_1:number = 1;
        public static DIRECTION_0:number = 0;//无此方向

        public static DIRECT_NUMBER:number =RpgSetting.DIRECT_2;//角色状态的方向材质数量定义
        public static DIRECT_2:number = 2;//2方向,提供3的材质
        public static DIRECT_4:number = 4;//4方向,提供2,4的材质
        public static DIRECT_6:number = 6;//6,提供2,3,4的材质
        public static DIRECT_8:number = 8;//8方向1,2,3,4,5的材质

        public static BUFF_CENTER_FRONT:string = "centre_F";//中前
        public static BUFF_CENTER_BACK:string = "centre_B";//中后
        public static BUFF_ABOVE:string = "above";//上
        public static BUFF_BELOW_BACK:string = "below_B";//下后
        public static BUFF_BELOW_FRONT:string = "below_F";//下前
        public static EFFECT_MISSILE:string = "missile";//飞行

        //战斗命令类型
        /**
         * 移动命令
         */
        public static FIGHT_ACTION_MOV:number = 0;
        /**
         * 攻击命令
         */
        public static FIGHT_ACTION_SKILL:number = 1;
        /**
         * 血量变化命令
         */
        public static FIGHT_ACTION_CHANGE_HP:number = 2;
        /**
         * 死亡命令
         */
        public static FIGHT_ACTION_DIE:number = 3;
        /**
         * 战斗结果命令
         */
        public static FIGHT_ACTION_TYPE_RESULT:number = 4;
        /**
         * 傀儡能量值刷新.
         */
        public static FIGHT_ACTION_TYPE_ENEYGY:number = 5;
        /**
         * 战斗角色获得buff通知.
         */
        public static FIGHT_ACTION_TYPE_BUFF:number = 6;

        //战斗伤害类型
        /**
         * 攻击伤害，普通
         */
        public static FIGHT_DAMEGE_COMMON:number = 0;
        /**
         * 攻击伤害，闪避
         */
        public static FIGHT_DAMEGE_DODGE:number = 1;
        /**
         * 攻击伤害，暴击
         */
        public static FIGHT_DAMEGE_CRIT:number = 2;
        /**
         * 攻击伤害，效果
         */
        public static FIGHT_DAMEGE_EFFECT:number = 3;
        /**
         * 攻击伤害，抵抗
         */
        public static FIGHT_DAMEGE_RESISTANCE:number = 4;
        /**
         * 移动同步总帧时
         */
        public static MOVE_SYNC_FRAME_COUNT:number = 5;
        //任务  任务内容类型 1:杀怪  2：对话
        public static TASK_TYPE_DIALOGUE:number = 2;
        public static TASK_TYPE_KILL:number = 1;
        /**
         * 技能类型:通用
         */
        public static BATTLE_SKILL_TYPE_COM:number = 0;
        /**
         * 技能类型:受击
         */
        public static BATTLE_SKILL_TYPE_BAK:number = 1;


        /** 角色的身处场景的状态要求 */
        public static GAME_STATE_FIGHT:string = "fight";//战斗状态
        public static GAME_STATE_NORMAL:string = "normal";//正常态
        public static GAME_STATE_ALL:string = "all";//全显示
        public static GAME_STATE_NONE:string = "none";//全都不显示
    }
}