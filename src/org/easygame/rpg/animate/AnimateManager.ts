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

	export class AnimateManager {
        private _isRun:boolean = false;
        private _isFrozen:boolean = false;
        private _animateList:Array<IAnimate> = [];

        private static _instance:AnimateManager = null;
        public static getInstance():AnimateManager {
            if (AnimateManager._instance == null) AnimateManager._instance = new easy.rpg.AnimateManager();
            return AnimateManager._instance;
        }
        /**
         * 动画控制开始
         */        
        private start():void {
            if (!this._isRun){
                //this._animateList.length = 0;
                easy.HeartBeat.addListener(this, this.onHeartBeat);
                this._isRun = true;
                this._isFrozen = false;
            }
        }
        /**
         * 战斗控制结束
         */ 
        public stop():void {
            //console.log("AnimateManager Stop")
            this._isRun = false;
            this._animateList.length = 0;
            easy.HeartBeat.removeListener(this, this.onHeartBeat);
        }
        /**
         * 添加动画
         */
        public addAnimate(animate:IAnimate):void {
            this._animateList.push(animate);
            this.start();
        }
        /**
         * 删除动画
         */
        public removeAnimate(animate:IAnimate):void {
            for (var i:number = 0; i < this._animateList.length; i++) {
                if (this._animateList[i] == animate) {
                    this._animateList[i].stop();
                    this._animateList[i].destroy();
                    this._animateList.splice(i, 1);
                    break;
                }
            }
            if (this._animateList.length == 0) this.stop();
        }
        /**
         * 清空所有特效操作
         */  
        public removeAllAnimate():void {
            for (var i:number = 0; i < this._animateList.length; i++) {
                this._animateList[i].destroy();
            }
            this._animateList.length = 0;
        }
        /**
         * 冻结
         * @param value
         */        
        public frozen(value:boolean):void {
            if (this._isRun){
                this._isFrozen = value;
                for (var i:number = 0; i < this._animateList.length; i++) {
                    this._animateList[i].frozen = value;
                }
            }
        }
        /**
         * 暂停播放
         */        
        public pause():void{
            this.frozen(true);
        }
        /**
         * 继续播放
         */        
        public replay():void {
            this.frozen(false);
        }
        /**
         * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
         */
        public onHeartBeat():void {
            if (!this._isRun || this._isFrozen) return;
            var length1:number = this._animateList.length;
            //console.log("Animate onHeartBeat.len=" + length1);
            for(var i1:number = 0;i1 < length1;i1++){
                var item:IAnimate = this._animateList[i1];
                item.onHeartBeat();
                //console.log("Animate onHeartBeat item.delay=" + item.delayFrame + ", completed=" + item.completed + ", after=" + item.afterFrame);
                if (!item.runing && item.delayFrame <= 0)item.play();
            }
            var i:number = 0;
            for (i = this._animateList.length - 1; i >= 0; i--) {
                if (this._animateList[i].completed && this._animateList[i].afterFrame <= 0){
                    this._animateList[i].destroy();
                    this._animateList.splice(i, 1);
                }
            }
            //console.log("Animate 111 onHeartBeat.len=" + this._animateList.length);
            if (this._animateList.length == 0) this.stop();
        }

        /**
         * 根据技能生成动画调度
         * @param jsonSkill
         */
        public genSkillAnimateQueue(jsonSkill:number):void {
            //console.log("genSkillAnimateQueue");
            var effectAnimate:EffectAnimate = ObjectPool.getByClass(EffectAnimate);
            effectAnimate.scene = ViewManager.currentView.scene;
            effectAnimate.skillId = jsonSkill;
            effectAnimate.actorSrc = ViewManager.currentView.scene.cameraFoucs;
            effectAnimate.actorDes = ViewManager.currentView.scene.getActorById(10001).actor;
            this.addAnimate(effectAnimate);
        }
    }
}