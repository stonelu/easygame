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
module easy{
    /**
     * win的基本类
     * 所有的ui组件都应该放置在ui层中
     * 在win中只处理view相关的逻辑,对ui成层的组件进行操作
     */
    export class Win extends ReceiveGroup {
        /**
         * 进入的效果
         */
        private _outerEffect:IEffect = null;
        /**
         * win成对应的ui展现
         * @type {null}
         * @private
         */
        public constructor() {
            super();
            this._loadingUIClz = PopupManager.defaultLoadingClass;
        }
        public createChildren():void {
            super.createChildren();
        }
        /**
         * enter的过渡效果
         */
        public enterTransition():void {
            super.enterTransition();
        }
        /**
         * enter的过渡效果结束
         */
        public enterTransitionComplete():void {
            super.enterTransitionComplete();
        }
        /**
         * win进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        public enter():void {
            super.enter();
            var key:string = egret.getQualifiedClassName(this);
            var myEvent:easy.MyEvent = easy.MyEvent.getEvent(easy.EventType.WIN_ENTER);
            myEvent.addItem("data", key);
            myEvent.send();
        }

        /**
         * win退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        public outer():void {
            super.outer();
            var key:string = egret.getQualifiedClassName(this);
            var myEvent:easy.MyEvent = easy.MyEvent.getEvent(easy.EventType.WIN_OUTER);
            myEvent.addItem("data", key);
            myEvent.send();
        }

        /**
         * 舞台尺寸变化
         */
        public onStageResize():void {
            //super.onStageResize();
            this.x = ViewManager.currentView.cx - this.cx;
            this.y = ViewManager.currentView.cy - this.cy;
            //调整当前view的loading的位置
            var loading:LoadingBaseUI = ObjectPool.getByClass(this._loadingUIClz, "loadingwin", false);
            if (loading && loading.parent){//loading 在显示中
                loading.x = 0;
                loading.y = 0;
            }
        }

        /**
         * 关闭窗口类
         */
        public hiddent():void {
            easy.PopupManager.hidden(this);
        }
    }
}