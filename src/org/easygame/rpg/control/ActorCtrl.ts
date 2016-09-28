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
     * 对角色的数据进行更新和控制显示
     */
    export class ActorCtrl {
        /**
         * 角色显示对象
         */
        private _actor:Actor = null;
        /**
         * 角色运行时数据
         */
        private _gameData:GameData = null;
        /**
         * 标识是否显示区域内
         * 不在显示区域内,只做xy数值的计算,不做图像材质的变更计算
         * @type {boolean}
         */
        public isDisplay:boolean = false;

        public moveMapStepCallBackFunc:Function = null;
        public moveMapStepCallBackThis:any = null;

        private _textureJsonData:Object = {};//每个状态的材质数据:key=gamestate,value=json
        public tweenMove:egret.Tween = null;

        /**
         * 角色控制器
         * @param act  角色显示对象
         * @param data 角色原始数据
         */
        public constructor(act:Actor, data:IActorData) {
            this._actor = act;
            this._gameData = new easy.rpg.GameData();
            this._gameData.actorData = data;
        }

        /**
         * 获取角色显示对象
         * @returns {Actor}
         */
        public get actor():Actor {
            return this._actor;
        }

        /**
         * 设置角色原始数据
         * @param value
         */
        public set actorData(value:IActorData){
            this._gameData.actorData = value;
        }

        public get actorData():IActorData{
            if (this._gameData){
                return this._gameData.actorData;
            }
            return null;
        }
        /**
         * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
         * 所有的数据变化,都是在这个方法更新到显示层
         *
         * 数据isInvalidate指的是x,y,hp
         * 模型的材质,另外计算时间
         */
        public onHeartBeat():void {
            if (this._gameData._gameState == RpgSetting.ACTOR_MOV){
                this.onMoveByPath();
            }
            if (this.isDisplay){//当前在显示,要定期根据角色状态变更图像材质
                this.onHBChangeTextTure();
            }
            //console.log("Actor.HB ctrl id=" + this._gameData.id + ", this.isDisplay=" + this.isDisplay);
        }
        //计算材质变化
        private _actorDisplayIndex:number = 0;//显示计数
        private _actorDisplayCount:number = 0;//计数最大值
        private _actorTextureIndex:number = 0;//材质计数
        private _actorTextureCount:number = 0;//材质最大值
        public onHBChangeTextTure():void {
            this.initActorTexture();
            this._actorDisplayIndex++;
            if (this._actorDisplayIndex > this._actorDisplayCount){//换帧
                this._actorDisplayIndex = 0;
                this.changeCurrentFrameActorTexture();
                this._actorTextureIndex ++;
                if (this._actorTextureIndex > this._actorTextureCount) {
                    this._actorTextureIndex = 0;
                }
            }
        }

        /**
         * 根据状态,改变当前帧的材质情况
         */
        private changeCurrentFrameActorTexture():void {
            var key:string = this.gameData.id + "_" + this.gameData.gameState;
            var jsongData = this._textureJsonData[key];
            //console.log("changeCurrentFrameActorTexture key=" + key + ", data=" + jsongData)
            if (jsongData) {
                //获取到图像
                //console.log("changeCurrentFrameActorTexture key=" + key + ", directionTexture=" + this.directionTexture)
                var jsonDirectionData = jsongData.texture["" + this.directionTexture][ this._actorTextureIndex];
                //console.log("texture.key=" + (key + "_" + this.gameData._direction + "_" + this._actorTextureIndex))
                var spriteSheet:egret.SpriteSheet = jsongData.spritesheet;
                var texture = spriteSheet.getTexture(key + "_" + this.directionTexture + "_" + this._actorTextureIndex);
                if (texture && this._actor._bitmapActor) {
                    this._actor._bitmapActor.texture = texture;
                    //this._actor._bitmapActor.x = jsonDirectionData.x + jsonDirectionData.offsetx;
                    //this._actor._bitmapActor.y = jsonDirectionData.offsety;
                    if (this.gameData._directionMirror) {
                        this._actor._bitmapActor.scaleX = -1;
                        this._actor._bitmapActor.x = -jsonDirectionData.offsetx;
                    } else {
                        this._actor._bitmapActor.scaleX = 1;
                        //this._actor._bitmapActor.x = - jsonDirectionData.offsetx;
                    }
                }

                //下一帧数据的改变
                this._actorTextureIndex ++;
                this.initTextureRuntimeData();
                this._actorTextureIndex --;
            }
        }
        /**
         * 材质初始化
         */
        private initActorTexture():void {
            //初始化材质
            if (!this._textureJsonData.hasOwnProperty(this.gameData.id + "_" + this.gameData.gameState)){
                var key:string = "actor_json_" + this.gameData.gameState + "_" + this.gameData.id;
                var jsongData = RES.getRes(key);
                //console.log("initActorTexture key=" + key + ", data=" + jsongData)
                if (jsongData){
                    this._textureJsonData[this.gameData.id + "_" + this.gameData.gameState] = jsongData;
                    this.gameData._directionNum = jsongData.direction.length;
                    key = "actor_img_" + this.gameData.gameState + "_" + this.gameData.id;
                    var texture = RES.getRes(key);
                    //console.log("initActorTexture texture.key=" + key + ", texture=" + texture + ", direction=" + jsongData.direction)
                    if (texture) {
                        var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(texture);
                        var spJsonData = null;
                        //生成方向材质
                        for (var i = 0; i < jsongData.direction.length; i++){
                            spJsonData = jsongData.texture["" + jsongData.direction[i]];
                            //console.log("spJsonData[" + jsongData.direction[i] + "].len=" + spJsonData.length)
                            for (var j = 0; j < spJsonData.length; j++){
                                //console.log("texture.key=" + (jsongData.id + "_" + spJsonData[j].img))
                                spriteSheet.createTexture(jsongData.id + "_" + spJsonData[j].img, spJsonData[j].x, spJsonData[j].y, spJsonData[j].w, spJsonData[j].h);
                            }
                        }
                        jsongData["spritesheet"] = spriteSheet;
                    }
                    //设置图像变化的数据
                    this._actorTextureIndex = 0;
                    this.initTextureRuntimeData();
                }
            }
        }

        private initTextureRuntimeData():void {
            var jsongData = this._textureJsonData[this.gameData.id + "_" + this.gameData.gameState];
            if (jsongData) {
                //console.log("this.gameData._direction="+ this.gameData._direction + ", data=" + jsongData.texture["" + this.directionTexture])
                var jsonDirectionData = jsongData.texture["" + this.directionTexture][this._actorTextureIndex];
                if (this._actorTextureIndex + 1 >= this._actorTextureCount) {
                    jsonDirectionData = jsongData.texture["" + this.directionTexture][0];
                }
                //if (jsonDirectionData["frame"]){
                //    this._actorDisplayCount = jsonDirectionData.frame;
                //} else {
                this._actorDisplayCount = jsongData.frame;
                //}
                this._actorTextureCount = jsongData.texture["" + this.directionTexture].length;
                //console.log("_actorTextureCount=" + this._actorTextureCount)
            }
        }

        //计算数据变化
        public onHBChangeData():void {
            if (this._gameData.isInvalidate){//数据有变化
                this._gameData.isInvalidate = false;
            }
            this._actor.x = this._gameData._screenXY.x;
            this._actor.y = this._gameData._screenXY.y;
        }

        /**
         * 获取角色id
         * @returns {number}
         */
        public get id():number {
            return this._gameData.id;
        }

        /**
         * 在场景的显示区域出现的时候调用
         */
        public enter():void {
            this.isDisplay = true;
        }

        /**
         * 不在场景的显示区域的时候调用
         */
        public outer():void {
            this.isDisplay = false;
        }

        /**
         * 获取游戏运行时数据
         * @returns {GameData}
         */
        public get gameData():GameData{
            return this._gameData;
        }
        /**
         * 设置自由移动的起始和结束坐标
         * 适合在没有格子的底图上移动,比如大地图点对点移动
         */
        public setFreePath(src:egret.Point, target:egret.Point, calculateDirection:boolean):void {
            var pathDatas:Array<egret.Point> = new Array<egret.Point>();
            pathDatas.push(src);
            pathDatas.push(target);
//            Debug.log("自由移动,方向计算 userid=" + this.data.data.id + ",src.x=" + src.x +  ",c.x=" + this.data.mapXY.x + ",src.y=" + src.y + ",c.y=" + this.data.mapXY.y + ",target.x=" + target.x + ",target.y=" + target.y);
            this.gameData.mapXY.x = src.x;
            this.gameData.mapXY.y = src.y;
            if (calculateDirection)this.direction = DirectionUtil.direction(src, target, RpgSetting.DIRECT_NUMBER);
            //分解x,y速度
            //计算心跳次数
            var speedPoint:egret.Point = DirectionUtil.speedXY(src, target, this.gameData._speed);
            //Debug.log("setFreePath speed=" + this.characterData.walkSpeed + ", x=" + speedPoint.x + ", y=" + speedPoint.y);
            this.gameData._speedXY.x = speedPoint.x;
            this.gameData._speedXY.y = speedPoint.y;
            this.setPath(pathDatas, false);
        }
        public setPath(path:Array<egret.Point>, caculateDirection:boolean = true):void {
            this.cleanPath();
            if (!path) {
                this.gameData.gameState = RpgSetting.ACTOR_STD;//站立
                return;
            }
            if (caculateDirection && path.length >= 2){
                this.direction = DirectionUtil.direction(path[0], path[1], RpgSetting.DIRECT_NUMBER);
            }
            this._gameData.gameState = RpgSetting.ACTOR_MOV;//运动
            if (this.gameData._path) {
                this.gameData._path.length = 0;
            }
            this.gameData._path = path;
            this.gameData.pathNextPoint();
        }
        /**
         * 按格子号进行移动运算
         */
        public onMoveByPath():void {
            //console.log("onMoveByPath 00000");
            if (this.gameData._pathTargetPoint) {
                //console.log("onMoveByPath 111111 path.length=" + this.gameData._path.length + ",TargetPoint.x=" + this.gameData._pathTargetPoint.x + ", TargetPoint.y" + this.gameData._pathTargetPoint.y + ", map.x=" + this.gameData.mapXY.x + ", map.y=" + this.gameData.mapXY.y);
                if (this.isReachTarget(this.gameData.mapXY, this.gameData._pathTargetPoint, this.gameData._direction)){//当前节点到达,继续下一节点
                    //console.log("onMoveByPath 22222");
                    if (this.gameData._path == null || this.gameData._path.length == 0){//终点,结束移动
                        //console.log("onMoveByPath 33333 终点");
                        this.cleanPath();
                        return;
                    } else {
                        this.gameData.pathNextPoint();//下一个节点继续
                        this.direction = DirectionUtil.direction(this.gameData.mapXY, this.gameData._pathTargetPoint, RpgSetting.DIRECT_NUMBER);
                        //计算移动的xy速度
                        var speedPoint:egret.Point = DirectionUtil.speedXY(this.gameData.mapXY, this.gameData._pathTargetPoint, this.gameData._speed);
                        this.gameData._speedXY.x = speedPoint.x;
                        this.gameData._speedXY.y = speedPoint.y;
                        //console.log("onMoveByPath 44444 下一个 speed.x=" + this.gameData._speedXY.x + ", y=" + this.gameData._speedXY.y);
                    }
                }
                //console.log("onMoveByPath 5555 speed.x=" + this.gameData._speedXY.x + ", y=" + this.gameData._speedXY.y);
                //继续移动
                this.moveMapStep(this.gameData._speedXY.x, this.gameData._speedXY.y);
            } else {
                this.cleanPath();
            }
        }
        //测试某点是否已经到达指定目标位置
        public isReachTarget(srcPoint:egret.Point, targetPoint:egret.Point, direction:number):boolean {
            if (Math.abs(egret.Point.distance(srcPoint, targetPoint)) <= 0.8) return true;
            return false;
        }
        /**
         * 在map上的坐标位置,增量修改
         */
        public moveMapStep(xStep:number, yStep:number):void {
            this.gameData.moveMapStep(xStep, yStep);
            if (this.moveMapStepCallBackFunc != null)this.moveMapStepCallBackFunc.call(this.moveMapStepCallBackThis, xStep, yStep);
        }

        /**
         * 清除路径数据
         */
        public cleanPath():void {
            this.gameState = RpgSetting.ACTOR_STD;
            this._gameData.isInvalidate = false;
            this._gameData._path.length = 0;
            this._gameData._pathTargetPoint = null;
        }

        /**
         * 转换成正确的材质方向,并且标记时候需要镜像
         * @param direction
         */
        public set direction(direction:number){
            this.gameData._direction = direction;
            //重新计算材质的数据局
            this._actorTextureIndex = 0;
            this.initTextureRuntimeData();
        }
        public get direction():number{
            return this.gameData._direction;
        }

        /**
         * 获得材质的方向
         * 原生材质的图为 2,3,4
         * @returns {number}
         */
        public get directionTexture():number {
            //var jsongData = RES.getRes("actor_json_" + this.gameData.id);
            //console.log("directionTexture key=" + ("actor_json_" + this.gameData.id) + ", data=" + jsongData)
            //if (jsongData){
            //
            //}
            this.gameData._directionMirror = false;
            var result:number = this.gameData._direction;
            if (result == 8) {
                result = 2;
                this.gameData._directionMirror = true;
            } else if (result == 6) {
                result = 4;
                this.gameData._directionMirror = true;
            } else if (result == 7) {
                result = 3;
                this.gameData._directionMirror = true;
            } else if (result == 1 || result == 5) {
                result = 3;
                this.gameData._directionMirror = true;
            }
            return result
        }
        public set gameState(state:string){
            //console.log("ctrl.gameState111" + state)
            if (this._gameData._gameState != state) {
                //console.log("ctrl.gameState2222" + state)
                this._gameData._gameState = state;
                this._actorTextureIndex = 0;
                this.initTextureRuntimeData();
            }
        }
        public get gameState():string{
            return this._gameData._gameState;
        }
    }
}
