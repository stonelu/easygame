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
    /**
     * 存储角色运行时产生的内存数据
     * 角色本身自带的各种属性数据由data数据来承担
     */
    export class GameData {
        public _control:ActorCtrl = null;//控制器
        public _data:IActorData = null;//角色原始定义
        public _mapXY:egret.Point = null;//地图坐标
        public _speedXY:egret.Point = null;//地图坐标
        public _screenXY:egret.Point = null;//carmera屏幕可视区域坐标,这个坐标是沟通map和显示区域的桥梁
        public _height:number = 100;//图像高度
        public _width:number = 50;//图像宽度
        public _xOffset:number = 0;//x中心偏移
        public _yOffset:number = 0;//y中心偏移
        public _scaleX:number = 1;//X拉伸大小
        public _scaleY:number = 1;//y拉伸大小
        public _hp:number = 0;//血量
        public _atk:number = 0;//攻击力
        public _name:string = null;//名称
        public _id:number = 0;//角色id
        public isInvalidate:boolean = false;//数据有变化
        public _direction:number = RpgSetting.DIRECTION_3;//当前方向
        public _directionMirror:boolean = false;
        public _directionNum:number = RpgSetting.DIRECT_2;
        public _speed:number = 20;//当前速度
        public _gameState:string = RpgSetting.ACTOR_STD;//这个状态是指战斗状态还是正常状态,决定了是否显示血量和方向指示器等

        //路径值
        public _path:Array<egret.Point> = [];//
        public _pathTargetPoint:egret.Point = null;//当前路径的目标点


        public constructor() {
            this.initData();
        }

        private initData():void {
            this._mapXY = new egret.Point();
            this._screenXY = new egret.Point();
            this._speedXY = new egret.Point();
        }

        /**
         * 设置角色数据
         * 子类可以覆写,设置更多的运行时数据
         * @param def
         */
        public set actorData(def:IActorData) {
            this._data = def;
            //设置运行时数值
            this.id = def.id;//角色id
            this.name = def.name;//名称
            this.hp = def.hp;//角色血量
            this._speed = def.speed;//行走速度
            //mov;//移动编号 (使用的时候会后缀自动加方向编号,格式:{编号}_{方向},例如:1000_1)
            //std;//站立编号 (使用的时候会后缀自动加方向编号:{编号}_{方向}:2000_1)
            //die;//死亡编号
            //atk;//普通攻击的编号
            //direciton:Array<number>;//方向
            //skl:Array<string>;//技能标号组
            //wing:number;//翅膀编号 (使用的时候会后缀自动加方向编号,格式::{编号}_{方向}, 例如:3000_1)
            //mount:number;//坐骑编号 (使用的时候会后缀自动加方向编号,格式::{编号}_{方向}, 例如:4000_1)
            //type;//数据类型
        }
        /**
         * 原始角色数据
         */
        public get actorData():IActorData {
            return this._data;
        }

        public get mapXY():egret.Point {
            return this._mapXY;
        }

        public set mapXY(value:egret.Point){
            this._mapXY = value;
            this.isInvalidate = true;
        }
        /**
         * 设置地图坐标
         * @param xValue
         * @param yValue
         */
        public setMapXY(xValue:number, yValue:number):void {
            this.mapXY.x = xValue;
            this.mapXY.y = yValue;
            this.isInvalidate = true;
        }

        /**
         * 增量变化地图坐标
         * @param xSetp
         * @param ySetp
         */
        public moveMapStep(xSetp:number, ySetp:number):void {
            this.mapXY.x += xSetp;
            this.mapXY.y += ySetp;
            this.isInvalidate = true;
        }
        /**
         * 清理数据
         */
        public clean():void {

        }
        /**
         * 销毁对象
         */
        public destroy():void{
        }
        /**
         * 图像高度
         * @return
         */
        public get height():number {
            return this._height - this._yOffset;
        }

        public set height(value:number){
            this._height = value;
            this.isInvalidate = true;
        }

        public get control():ActorCtrl {
            return this._control;
        }

        /**
         * 获得控制器
         * @param value
         */
        public set control(value:ActorCtrl){
            this._control = value;
        }
        public get xOffset():number {
            return this._xOffset;
        }

        /**
         * 设置X方向偏移
         * @param value
         */
        public set xOffset(value:number){
            this._xOffset = value;
            this.isInvalidate = true;
        }
        public get yOffset():number {
            return this._yOffset;
        }
        /**
         * 设置y方向偏移
         * @param value
         */
        public set yOffset(value:number){
            this._yOffset = value;
            this.isInvalidate = true;
        }
        public get scaleX():number {
            return this._scaleX;
        }

        /**
         * 设置x缩放
         * @param value
         */
        public set scaleX(value:number){
            this._scaleX = value;
            this.isInvalidate = true;
        }
        public get scaleY():number {
            return this._scaleX;
        }

        /**
         * 设置Y缩放
         * @param value
         */
        public set scaleY(value:number){
            this._scaleY = value;
            this.isInvalidate = true;
        }
        /**
         * 设置id
         * @param value
         */
        public set id(value:number){
            this._id = value;
            this.isInvalidate = true;
        }
        public get id():number {
            return this._id;
        }
        /**
         * 设置hp
         * @param value
         */
        public set hp(value:number){
            this._hp = value;
            this.isInvalidate = true;
        }
        public get hp():number {
            return this._hp;
        }
        /**
         * 设置atk
         * @param value
         */
        public set atk(value:number){
            this._atk = value;
            this.isInvalidate = true;
        }
        public get atk():number {
            return this._atk;
        }
        /**
         * 设置name
         * @param value
         */
        public set name(value:string){
            this._name = value;
            this.isInvalidate = true;
        }
        public get name():string {
            return this._name;
        }
        /**
         * 这个状态是指战斗状态还是正常状态
         * 决定了是否显示血量和方向指示器等
         * fihgt:战斗状态会显示血量,不显示方向指示
         * normal:正常态会显示方向指示,不显示血量
         * all:血量和方向都显示
         * none:血量和方向都不显示
         * @param value
         */
        public set gameState(value:string){
            this._gameState = value;
            this.isInvalidate = true;
        }
        public get gameState():string {
            return this._gameState;
        }

        /**
         * 角色类型
         * @returns {string}
         */
        public get type():string{
            return this._data.type;
        }

        /**
         * 对路径的下一个节点进行运算
         */
        public pathNextPoint():void {
            //console.log("pathNextPoint 00000");
            if (this._path.length > 0 ){
                //console.log("pathNextPoint 11111");
                this._pathTargetPoint = this._path.shift();
            }
        }
    }
}