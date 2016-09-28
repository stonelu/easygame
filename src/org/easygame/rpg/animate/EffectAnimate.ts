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
     * 技能攻击动画 
     * @author Administrator
     * 
     */
    export class EffectAnimate extends BaseAnimate {
        public skillId:number = 0;//技能id
        public actorSrc:Actor = null;//技能起始人
        public actorDes:Actor = null;//技能目标
        private _shape:egret.Shape = null;

        private dx:number = 0.2;//横向运动
        private motionCount:number = 0;
        private a:number;
        private b:number;
        private c:number;

		public constructor(){
			super();
		}
        /**
         * 播放动画
         */  
        public play():void {
            this._loop = true;
            if (this.skillId > 0 ){
                this._resJsonId = "skill_json_" + this.skillId;
                this._resImgId = "skill_img_" + this.skillId;
                this.jsonData = RES.getRes(this._resJsonId);
            }
            super.play();//设置runing标志
            if (this._shape == null){
                this._shape  = new egret.Shape();
            }
            this._imgDisplay.x = this.actorSrc._ctrl.gameData._screenXY.x;
            this._imgDisplay.y = this.actorSrc._ctrl.gameData._screenXY.y;
            //console.log("EffectAnimate effectId=" + this.skillId);
            this.intiParabola();
        }
        /**
         * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
         */  
        public onHeartBeat():void {
            super.onHeartBeat();
            if(this.runing && this.jsonData){
                if (this.skillId == 20){
                    this.levelFly();
                } else {
                    this.parabola();
                }
                this.hitTest();
                this.checkStop();
            }
        }

        /**
         * 平行飞行
         */
        private levelFly():void {
            this._imgDisplay.x += this._speed;
        }

        private intiParabola(waveHeight:number = 240):void {
            var startPt:egret.Point = this.actorSrc._ctrl.gameData._screenXY;
            var endPt:egret.Point = this.actorDes._ctrl.gameData._screenXY;
            var vertexPt:egret.Point = new egret.Point(startPt.x + (endPt.x - startPt.x) / 2, endPt.y - waveHeight);

            var x1:number = startPt.x;
            var x2:number = endPt.x;
            var x3:number = vertexPt.x;

            var y1:number = startPt.y;
            var y2:number = endPt.y;
            var y3:number = vertexPt.y;

            this.b = ((y1 - y3) * (x1 * x1 - x2 * x2) - (y1 - y2) * (x1 * x1 - x3 * x3)) / ((x1 - x3) * (x1 * x1 - x2 * x2) - (x1 - x2) * (x1 * x1 - x3 * x3));
            this.a = ((y1 - y2) - this.b * (x1 - x2)) / (x1 * x1 - x2 * x2);
            this.c = y1 - this.a * x1 * x1 - this.b * x1;
        }
        /**
         * 抛物线运动
         */
        public getParabolaY(posX:number):number {
            var posY:number = this.a * posX * posX + this.b * posX + this.c;
            return posY;
        }

        private parabola():void {
            this.motionCount ++;
            this._imgDisplay.x += this.dx* this.motionCount;
            this._imgDisplay.y = this.getParabolaY(this._imgDisplay.x);
            //console.log("p2.x=" + (this._imgDisplay.x) + ", p2.y=" + this.getParabolaY(this._imgDisplay.x))
        }

        private checkStop():void {
            //检测是否结束
            var screenPoint:egret.Point = new egret.Point(this._imgDisplay.x, this._imgDisplay.y);
            this.scene.map.toScreen(screenPoint, screenPoint);

            //console.log("x=" + screenPoint.x + ", y=" + screenPoint.y + ", rec.x=" + this.scene.map._cameraRect.x + ", rec,y=" + this.scene.map._cameraRect.y + ", rec.w=" + this.scene.map._cameraRect.width + ", rec.h=" + this.scene.map._cameraRect.height);
            if(screenPoint.x < this.scene.map._cameraRect.x || screenPoint.y < this.scene.map._cameraRect.y
                || screenPoint.x > (this.scene.map._cameraRect.x + this.scene.map._cameraRect.width)  || screenPoint.y > (this.scene.map._cameraRect.y + this.scene.map._cameraRect.height)) {
                this.stop();
                console.log("结束!!!")
            }
        }

        /**
         * 碰撞检测
         */
        private hitTest():void {
            //console.log("imh.x=")
            var b1Rect:egret.Rectangle = this._imgDisplay.getBounds();
            //if (this._shape && !this._shape.parent){
            //    this.scene._effectContainer.addChild(this._shape);
            //}
            //if (this._shape){
            //    var x:number =this._imgDisplay.x;
            //    var y:number =this._imgDisplay.y;
            //    if (this._imgDisplay.anchorX != 0){
            //        x -= this._imgDisplay.width * this._imgDisplay.anchorX;
            //    }
            //    if (this._imgDisplay.anchorY != 0){
            //        y -= this._imgDisplay.height * this._imgDisplay.anchorY;
            //    }
            //    this._shape.graphics.clear();
            //    this._shape.graphics.lineStyle(1, 0xff0f0f);
            //    this._shape.graphics.drawRect(x, y , b1Rect.width, b1Rect.height);
            //    this._shape.width = b1Rect.width;
            //    this._shape.height = b1Rect.height;
            //}
            if (HitTestUtil.testHit(this._imgDisplay, this.actorDes)){
                console.log("命中!!")
                //产生碰撞效果
                var effectHit:HitAnimate = ObjectPool.getByClass(HitAnimate);
                effectHit.skillId = 100;
                effectHit.actorDes = this.actorDes;
                effectHit.actorSrc = this.actorSrc;
                effectHit.scene = this.scene;
                AnimateManager.getInstance().addAnimate(effectHit);
                this.stop();
            }
        }

        /**
         * 销毁数据
         */
        public destroy():void{
            super.destroy();
            if (this._shape && this._shape.parent){
                this._shape.parent.removeChild(this._shape);
            }
            this.skillId = 0;
            this.actorSrc = null;
            this.actorDes = null;
            this.motionCount = 0;
            this.dx = 0.2;
        }
    }
}