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
     * 这个类是作为win弹出管理类,控制窗口的资源加载,保证资源加载完成后再显示窗口
     * 集中管理的好处,是可以精确控制置顶和窗口组合显示
     * 可以在这个地方加入窗口的弹出效果和隐藏效果
     */
    export class PopupManager {
        public static defaultLoadingClass:any = DefaultLoadingView;//默认的view loading ui，可以替换成自己需要的loading
        public static CURRENT_SHOW:Array<Win> = [];//当前显示的窗口

        public static waitShowWin:Win = null;//等待显示的弹出窗口

        public static currentWin:Win = null;//当前显示的窗口
        private static _winIsManager:Object = {};//当前显示窗口是否需要管理

        private static _mask:egret.Shape = null;//遮罩
        //private static _mask:Group = null;//遮罩

        /**
         * 弹出win显示
         * @param clz 显示的窗口类名
         * @param data 携带的数据
         * @param mask 是否遮罩
         * @param manager 是否管理,纳入管理,在连续两次弹窗的时候,会在前一个弹窗关闭时,自动回复显示
         */
        public static show(clz:any, data:any = null, mask:boolean = true, manager:boolean = true):any {
            //当前有显示窗口在显示
            var key:string = egret.getQualifiedClassName(clz);
            //Debug.log = "win.show=" + key;
            PopupManager._winIsManager[key] =  manager;
            PopupManager.waitShowWin = ObjectPool.getByClass(clz, "", false);
            if (PopupManager.currentWin){
                //判断当前要显示的窗口,是不是已经在显示总
                if (PopupManager.currentWin == PopupManager.waitShowWin) {
                    GlobalSetting.STAGE.addChild(PopupManager.currentWin);//确保最前显示
                    PopupManager.waitShowWin = null;
                    return PopupManager.currentWin;
                }
                key = egret.getQualifiedClassName(PopupManager.currentWin);
                var currentWinIsManager:boolean = PopupManager._winIsManager[key];
                if (currentWinIsManager) {
                    if (PopupManager.CURRENT_SHOW.indexOf(PopupManager.currentWin) < 0) PopupManager.CURRENT_SHOW.push(PopupManager.currentWin);
                    PopupManager.currentWin.removeFromParent();
                }
            }
            if (PopupManager._mask == null) {
                PopupManager._mask = new egret.Shape();
                PopupManager._mask.touchEnabled = true;
                PopupManager._mask.graphics.beginFill(0x000000, 0.8);
                PopupManager._mask.graphics.drawRect(0, 0, GlobalSetting.STAGE_WIDTH, GlobalSetting.STAGE_HEIGHT);
                PopupManager._mask.graphics.endFill();
            }
            if (mask){
                GlobalSetting.STAGE.addChild(PopupManager._mask);
            } else if (PopupManager._mask.parent){
                PopupManager._mask.parent.removeChild(PopupManager._mask);
            }
            if (PopupManager.waitShowWin){//未保证view创建子元素,首先要加入场景中触发创建
                PopupManager.waitShowWin.data = data;
                PopupManager.waitShowWin.alpha = 0;
                GlobalSetting.STAGE.addChildAt(PopupManager.waitShowWin, 0);
            }
            if (PopupManager.waitShowWin &&PopupManager.waitShowWin.checkResReady()) {
                //检测完成情况,未完成会自动启动loading,已经完成,直接enter
                PopupManager.waitWinDoEnter();
                //未完成下载,则等待Loading回调ViewManager.waitViewDoEnter()方法,完成加载
                return PopupManager.waitShowWin;
            }
            return null;
        }
        /**
         * 等待显示的win已经准备完毕,开始enter
         */
        public static waitWinDoEnter():void {
            //console.log("@@PopupManager waitWinDoEnter win=" + egret.getQualifiedClassName(PopupManager.waitShowWin))
            if (PopupManager.waitShowWin) {
                if (!PopupManager.waitShowWin._uiResReady) PopupManager.waitShowWin._uiResReady = true;//ui的res已经准备完成,下次不需要download了
                PopupManager.waitShowWin.removeFromParent();
                PopupManager.waitShowWin.alpha = 1;
                GlobalSetting.STAGE.addChild(PopupManager.waitShowWin);
                PopupManager.waitShowWin.x = ViewManager.currentView.cx - PopupManager.waitShowWin.cx;
                PopupManager.waitShowWin.y = ViewManager.currentView.cy - PopupManager.waitShowWin.cy;
                var key:string = egret.getQualifiedClassName(PopupManager.waitShowWin);

                var currentWinIsManager:boolean = PopupManager._winIsManager[key];
                //if (currentWinIsManager)
                PopupManager.currentWin = PopupManager.waitShowWin;
                PopupManager.waitShowWin.enter();
                //console.log("@@PopupManager 0000 waitWinDoEnter visible=" + PopupManager.waitShowWin.visible + ", alpha=" + PopupManager.waitShowWin.alpha)

                //PopupManager.waitShowWin = null;
            }
        }
        /**
         * 隐藏win显示
         * @param instance
         */
        public static hidden(instance:Object):void {
            var key:string = egret.getQualifiedClassName(instance);
            //Debug.log = "win.hidden=" + key;
            var winInstance:Win = ObjectPool.getObject(key, false);
            if (winInstance){
                winInstance.outer();
                winInstance.removeFromParent();
                if (PopupManager.CURRENT_SHOW.lastIndexOf(winInstance) >= 0) PopupManager.CURRENT_SHOW.splice(PopupManager.CURRENT_SHOW.indexOf(winInstance), 1);
            }
            if (PopupManager.currentWin == winInstance) {
                if (PopupManager._mask && PopupManager._mask.parent) PopupManager._mask.parent.removeChild(PopupManager._mask);
                PopupManager.currentWin = null;
                //恢堆栈中的窗口
                if (PopupManager.CURRENT_SHOW.length > 0 ){
                    PopupManager.currentWin = PopupManager.CURRENT_SHOW.pop();
                }
            }
            if (PopupManager.currentWin){
                GlobalSetting.STAGE.addChild(PopupManager._mask);
                GlobalSetting.STAGE.addChild(PopupManager.currentWin);
            } else {
                if (PopupManager._mask.parent)GlobalSetting.STAGE.removeChild(PopupManager._mask);
            }
        }

        /**
         * 根据类名,获取窗口实例
         * @param clz
         */
        public static getWinInstance(clz:any):any{
            return ObjectPool.getByClass(clz, "", false);
        }

        public static isShow(clz:any):boolean {
            var inst:any = PopupManager.getWinInstance(clz);
            if (PopupManager.CURRENT_SHOW.indexOf(inst) >= 0 || PopupManager.currentWin == inst) {
                return true;
            }
            return false;
        }

        private static onEventMask(event:egret.TouchEvent){
            event.stopImmediatePropagation();
            event.stopPropagation();
        }

        /**
         * 移除所有显示或者不显示的窗口
         */
        public static removeAll():void {
            while (PopupManager.currentWin) PopupManager.hidden(PopupManager.currentWin);
            while(PopupManager.CURRENT_SHOW.length > 0){
                PopupManager.hidden(PopupManager.CURRENT_SHOW.pop());
            }
            PopupManager.currentWin = null;
        }
    }
}
