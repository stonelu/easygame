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
    export class ActorData implements IActorData{
        public id:number = 0;//角色id
        public name:string = null;//名称
        public hp:number = 0;//角色血量
        public speed:number = 20;//行走速度
        public direciton:Array<number> = [];//技能标号组
        public wing:number = 0;//翅膀编号 (使用的时候会后缀自动加方向编号,格式::{编号}_{方向}, 例如:3000_1)
        public mount:number = 0;//坐骑编号 (使用的时候会后缀自动加方向编号,格式::{编号}_{方向}, 例如:4000_1)

        public type:string = "npc";
        public constructor() {
        }

        /**
         * 通过json数据赋值
         * 请保证json属性和类属性一致
         * @param json
         */
        public setJsonData(json:any):void {
            for (var key in json){
                console.log("Actor set key=" + key + ", value=" + json[key]);
                if (this.hasOwnProperty(key)) this[key] = json[key];
            }
        }
    }
}