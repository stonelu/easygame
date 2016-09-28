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
     * <p>并行效果</p>
     * @date  :Jun 18, 2012
     * @author:jinyi.lu
     */
    export class ParalleQueue extends easy.rpg.BaseAnimate {
        private animateList:Array<IAnimate> = new Array<IAnimate>();//并行动画的列表

        public constructor(){
            super();
        }
        /**
         * 心跳,呼吸, 运动的之类要覆盖该方法,做动作
         */  
        public onHeartBeat():void {
            super.onHeartBeat();
            if (this.runing){
                if (this.animateList.length > 0) {
                    for (var i = this.animateList.length - 1; i >= 0; i--) {
                        if (this.animateList[i].completed && this.animateList[i].afterFrame <= 0) {
                            this.removeAnimate(this.animateList[i]);
                        }
                    }
                    var item:IAnimate = null;
                    var length1:number = this.animateList.length;
                    for (var i = 0; i < length1; i++) {
                        item = this.animateList[i];
                        item.onHeartBeat();
                        if (!item.runing && item.delayFrame <= 0)item.play();
                    }
                }
                if (this.animateList.length == 0) this.stop();
            }
        }
        /**
         * 添加一个并行动画
         */  
        public addAnimate(animate:IAnimate):void {
            animate.parent = this;
            this.animateList.push(animate);
        }
        /**
         * 删除一个串行动画
         */  
        public removeAnimate(animate:IAnimate):void {
            for (var i = 0; i < this.animateList.length; i++) {
                if (this.animateList[i] == animate) {
                    this.animateList[i].stop();
                    this.animateList[i].destroy();
                    this.animateList.splice(i, 1);
                    break;
                }
            }
        }
        /**
         * 销毁数据
         */  
        public destroy():void{
            super.destroy();
            for (var i = 0; i < this.animateList.length; i++) {
                this.animateList[i].destroy();
            }
            this.animateList.length = 0;
        }
        
        public set frozen(value:boolean){
            this._frozen = value;
            for (var i = 0; i < this.animateList.length; i++) {
                this.animateList[i].frozen = value;
            }
        }
    }
}