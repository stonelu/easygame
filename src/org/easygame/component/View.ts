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
     * view的基本类
     * 所有的ui组件都应该放置在ui层中
     * 在view中只处理view相关的逻辑,对ui成层的组件进行操作
     */
    export class View extends ReceiveGroup {
        private _scene:easy.rpg.Scene = null;
        public constructor() {
            super();
            this._loadingUIClz = ViewManager.defaultLoadingClass;
        }

        /**
         * view进入的逻辑
         * 可以再次根据外部数据情况做一些逻辑处理
         */
        public enter():void {
            super.enter();
            var key:string = egret.getQualifiedClassName(this);
            var myEvent:easy.MyEvent = easy.MyEvent.getEvent(easy.EventType.VIEW_ENTER);
            myEvent.addItem("data", key);
            myEvent.send();
            if (this._scene){
                this._scene.enter();
            }
            //检测尺寸
            this.checkViewSize();
        }
        /**
         * view退出的逻辑
         * 做一些数据的销毁或者初始化,保证下次进入的时候,不会残留
         */
        public outer():void {
            super.outer();
            var key:string = egret.getQualifiedClassName(this);
            var myEvent:easy.MyEvent = easy.MyEvent.getEvent(easy.EventType.VIEW_OUTER);
            myEvent.addItem("data", key);
            myEvent.send();
        }
        /**
         * 设置ui层的显示对象
         * @param myui
         */
        public setUI(myui:BaseGroup) {
            super.setUI(myui);
            this._ui = myui;
            if (this._ui) {
                this.addChild(this._ui);
            }
        }
        /**
         * 检测view的尺寸要求是否达到设定
         */
        public checkViewSize():void {
            if (GlobalSetting.DISPLAY_MODEL == GlobalSetting.DISPLAY_VIEW_EASYGAME){
                var w:number = this.width;
                var h:number = this.height;
                if (this._scene){
                    //console.log("check size has sence")
                    //有场景的,需要自适应窗口大小
                    if (this.scene.sceneWidth <= 0) {
                        w = GlobalSetting.STAGE_WIDTH;
                    } else if(GlobalSetting.STAGE_WIDTH < w){
                        if (GlobalSetting.STAGE_WIDTH >= GlobalSetting.VIEW_MINI_WIDTH) {
                            w = GlobalSetting.STAGE_WIDTH;
                        } else {
                            w = GlobalSetting.VIEW_MINI_WIDTH;
                        }
                    } else if (GlobalSetting.STAGE_WIDTH > this.scene.sceneWidth) {
                        w = this.scene.sceneWidth;
                    } else {
                        w = GlobalSetting.STAGE_WIDTH;
                    }
                    if (this.scene.sceneHeight <= 0) {
                        h = GlobalSetting.STAGE_HEIGHT;
                        if (!egret.NumberUtils.isNumber(h)) {
                            //console.log("checkViewSize2222 height is not a number!!!!");
                        }
                    } else if(GlobalSetting.STAGE_HEIGHT < h){
                        if (GlobalSetting.STAGE_HEIGHT >= GlobalSetting.VIEW_MINI_HEIGHT) {
                            h = GlobalSetting.STAGE_HEIGHT;
                            //console.log("checkViewSize333 height is not a number!!!!");
                        } else {
                            h = GlobalSetting.VIEW_MINI_HEIGHT;
                            //console.log("checkViewSize444 height is not a number!!!!");
                        }
                    } else if (GlobalSetting.STAGE_HEIGHT > this.scene.sceneHeight) {
                        h = this.scene.sceneHeight;
                        //console.log("checkViewSize555 height is not a number!!!! h=" + h);
                    } else {
                        h = GlobalSetting.STAGE_HEIGHT;
                        //console.log("checkViewSize666 height is not a number!!!!");
                    }
                } else {//无场景的
                    //console.log("check size no sence")
                    if(GlobalSetting.STAGE_WIDTH > w){
                        if (GlobalSetting.STAGE_WIDTH >= GlobalSetting.VIEW_MINI_WIDTH) {
                            w = GlobalSetting.STAGE_WIDTH;
                        } else {
                            w = GlobalSetting.VIEW_MINI_WIDTH;
                        }
                    } else if (GlobalSetting.VIEW_MINI_WIDTH > w){
                        w = GlobalSetting.STAGE_WIDTH;
                    }
                    if(GlobalSetting.STAGE_HEIGHT > h){
                        if (GlobalSetting.STAGE_HEIGHT >= GlobalSetting.VIEW_MINI_HEIGHT) {
                            h = GlobalSetting.STAGE_HEIGHT;
                        } else {
                            h = GlobalSetting.VIEW_MINI_HEIGHT;
                        }
                    } else if (GlobalSetting.VIEW_MINI_HEIGHT > h){
                        h = GlobalSetting.STAGE_HEIGHT;
                    }
                }
                w = parseInt("" + w);
                h = parseInt("" + h);
                this.setSize(w, h);
                var ui:BaseGroup = this.getUI();
                if (ui){
                    ui.setSize(w, h);
                }
                if (this._scene)this._scene.setSize(w, h);
                //console.log("view checkViewSize widht=" + w + ", height=" + h)
            }
        }
        /**
         * enter的过渡效果
         */
        public enterTransition():void {
            if (ViewManager.currentView && ViewManager.currentView != this) ViewManager.currentView.outer();
            super.enterTransition();
        }
        /**
         * enter的过渡效果结束
         */
        public enterTransitionComplete():void {
            if (ViewManager.currentView && ViewManager.currentView != this) ViewManager.currentView.outerTransitionComplete();
            super.enterTransitionComplete();
            ViewManager.currentView = this;
        }

        /**
         * 设置场景
         * @param scene
         */
        public set scene(scene:easy.rpg.Scene){
            if (this._scene){//旧场景移除
                this._scene.removeFromParent();
            }
            this._scene = scene;
            if (this._scene){
                this.addChildAt(this._scene, 0);
            }
            this.checkViewSize();
        }

        public get scene():easy.rpg.Scene{
            return this._scene;
        }

        /**
         * 舞台尺寸变化
         */
        public onStageResize():void {
            if (GlobalSetting.DISPLAY_MODEL == GlobalSetting.DISPLAY_VIEW_EASYGAME) {
                this.setSize(GlobalSetting.DISPLAY_WIDTH, GlobalSetting.DISPLAY_HEIGHT);
                super.onStageResize();
                this.checkViewSize();
                //调整当前view的loading的位置
                var loading:LoadingBaseUI = ObjectPool.getByClass(this._loadingUIClz, "loading", false);
                if (loading && loading.parent){//loading 在显示中
                    loading.x = 0;
                    loading.y = 0;
                }
            }
        }
    }
}