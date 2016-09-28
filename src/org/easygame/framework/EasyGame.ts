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
     * <p>EasyGame管理类</p>
     * @date  :2015-08-10 11:39:50
     * @author:EasyUI Tools
     */
    export class EasyGame{
        /**
         * 初始化 Easy Gaame
         */
        public static init():void{
            GlobalSetting.STAGE.frameRate = GlobalSetting.FRAME_RATE;
            //计算正常帧时
            HeartBeat._eplasedTime = 1000/GlobalSetting.FRAME_RATE;
            var config:any = RES.getRes("easygame_config");
            //console.log("EasyGameManager init00");
            if (config){
                //console.log("EasyGameManager init111");
                //基础参数
                if (config["name"]) easy.GlobalSetting.APP_NAME = config["name"];
                if (config["product"]) easy.GlobalSetting.APP_PRODUCT = config["product"];
                if (config["version"]) easy.GlobalSetting.APP_VERSION = config["version"];

                //报表 渠道
                if (config["report"]) {
                    var jsonReport:any = config["report"];
                    if (jsonReport["url"]) easy.GlobalSetting.REPORT_URL = jsonReport["url"];
                    if (jsonReport["provide"]) easy.GlobalSetting.APP_PROVIDE = jsonReport["provide"];

                    if (jsonReport["channel"]) {
                        for(var i = 0; i < jsonReport.channel.length; i++) {
                            if (GlobalSetting.APP_PROVIDE == jsonReport.channel[i].id) {
                                GlobalSetting.APP_CHANNEL = jsonReport.channel[i].name;
                                easy.GlobalSetting.APP_RATE = jsonReport.channel[i].rate;//汇率
                                easy.GlobalSetting.APP_RATE_NAME = jsonReport.channel[i].unit;//汇率的单位
                                GlobalSetting.REPORT = jsonReport.channel[i].report;
                                GlobalSetting.APP_STORAGE =  jsonReport.channel[i].storage;
                                break;
                            }
                        }
                        Report._baseInfo = {"pn":GlobalSetting.APP_NAME, "ch":GlobalSetting.APP_CHANNEL, "ver":GlobalSetting.APP_VERSION, "dev":GlobalSetting.APP_DEVICE, "ti":0, "tk":0};
                        Report._isInit = true;
                    }
                }

                if (config["dev"]) {//开发模式设置
                    if (config["dev"]["scale_mode"]) GlobalSetting.DISPLAY_MODEL = config["dev"]["scale_mode"];
                    if (config["dev"]["loading_max"]) GlobalSetting.LOADING_THREAD_MAX = config["dev"]["loading_max"];
                    if (config["dev"]["debug"]) GlobalSetting.DEV_MODEL = (config["dev"]["debug"] == "true");
                    if (GlobalSetting.DEV_MODEL){
                        //打开性能控制面板
                        EasyGame.showDebugInfo();
                    }
                    RES.setMaxLoadingThread(GlobalSetting.LOADING_THREAD_MAX);//设置5个线程下载
                }
            }
            //监听resize事件
            GlobalSetting.STAGE.addEventListener(egret.Event.RESIZE, EasyGame.onStageResize, EasyGame);
        }

        /**
         * Stage 舞台尺寸变化
         */
        private static onStageResize(event:egret.Event):void {
            GlobalSetting.initInfoSize();
            //通知view和win
            if (easy.ViewManager.currentView) easy.ViewManager.currentView.onStageResize();
            if (easy.PopupManager.currentWin) easy.PopupManager.currentWin.onStageResize();
        }

        /**
         * 显示debug信息
         */
        private static _tfInfo:egret.TextField = null;
        private static showDebugInfo():void {
            if (easy.GlobalSetting.DEV_MODEL) {
                //性能控制面板
                //egret.Profiler.getInstance().run();

                if (this._tfInfo == null){
                    this._tfInfo = new egret.TextField();
                }
                GlobalSetting.STAGE.addChild(this._tfInfo);
                //this._tfInfo.y = 300;
                this._tfInfo.x = 300;
                this._tfInfo.width = 300;
                this._tfInfo.height = 40;
                //this._tfInfo.text = "w=" + GlobalSetting.STAGE.stageWidth + " ,h=" + GlobalSetting.STAGE.stageHeight;
                easy.HeartBeat.addListener(this, this.onShowHearBeatInfo);

                var btnDebugWin:easy.Button = new easy.Button();
                GlobalSetting.STAGE.addChild(btnDebugWin);
                btnDebugWin.label = "DEBUG";
                btnDebugWin.fontSize = 16;
                btnDebugWin.labelColor = 0xff00ff;
                btnDebugWin.setSize(80, 35);
                btnDebugWin.y = 2;
                btnDebugWin.x = 150;
                btnDebugWin.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
                    easy.DebugWin.show();
                },this);

            }
        }
        /**
         * 显示帧频呼吸的情况
         */
        private static onShowHearBeatInfo():void {
            EasyGame._tfInfo.text = "HB:" + easy.HeartBeat.getHearBeatLenght();
            if (easy.DebugWin._instance && easy.DebugWin._instance.parent){
                easy.DebugWin.refresh();
            }
        }
    }
    /**
     * EasyGame的全屏适配模式
     */
    export class EasyGameFullScreen extends egret.sys.DefaultScreenAdapter {

        constructor() {
            super();
        }
        /**
         * @private
         * 计算舞台显示尺寸
         * @param scaleMode 当前的缩放模式
         * @param screenWidth 播放器视口宽度
         * @param screenHeight 播放器视口高度
         * @param contentWidth 初始化内容宽度
         * @param contentHeight 初始化内容高度
         */
        public calculateStageSize(scaleMode:string, screenWidth:number, screenHeight:number,
                                  contentWidth:number, contentHeight:number):egret.sys.StageDisplaySize {
            var displayWidth = screenWidth;
            var displayHeight = screenHeight;
            var stageWidth = contentWidth;
            var stageHeight = contentHeight;
            var scaleX = (displayWidth / stageWidth) || 0;
            var scaleY = (displayHeight / stageHeight) || 0;

            //var scaleX:number = displayWidth / designedResolutionWidth;
            //var scaleY:number = displayHeight / designedResolutionHeight;
            if (scaleX > scaleY) {
                stageWidth = Math.round(displayWidth/scaleY);
            } else {
                stageHeight = Math.round(displayHeight/scaleX);
            }
            return {
                stageWidth: stageWidth,
                stageHeight: stageHeight,
                displayWidth: displayWidth,
                displayHeight: displayHeight
            };
        }
    }
}