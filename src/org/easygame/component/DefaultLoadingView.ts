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
module easy {
    export class DefaultLoadingView extends LoadingBaseUI {

        private _gridWidth:number = 256;
        private _gridHeight:number = 256;

        private _bmpBg:egret.Bitmap = null;//bg
        private _bmpLogo:egret.Bitmap = null;//logo

        public constructor() {
            super();
        }
        public createChildren():void {
            super.createChildren();
            this.showBg = false;
            this.setSize(this._gridWidth, this._gridHeight);

            this._bmpBg = new egret.Bitmap();
            this.addChild(this._bmpBg);
            this._bmpBg.texture = RES.getRes("loading_view_bg");
            this._bmpBg.anchorOffsetX = this._bmpBg.width * 0.5;
            this._bmpBg.anchorOffsetY = this._bmpBg.height * 0.5;
            this._bmpBg.x = this.cx;
            this._bmpBg.y = this.cy;

            this._bmpLogo = new egret.Bitmap();
            this.addChild(this._bmpLogo);
            this._bmpLogo.texture = RES.getRes("loading_view");
            this._bmpLogo.anchorOffsetX = this._bmpLogo.width * 0.5;
            this._bmpLogo.anchorOffsetY = this._bmpLogo.height * 0.5;
            this._bmpLogo.x = this.cx;
            this._bmpLogo.y = this.cy;
        }
        /**
         * 根据waitview的ui数据,进行下载控制
         */
        public enter():void {
            super.enter();
            this._bmpBg.rotation = 0;
            this.alpha = 0;
            //显示loading图像
            HeartBeat.addListener(this, this.onShowLoadingGraphics);
        }
        /**
         * 完成下载,回调加载view
         */
        public outer():void {
            super.outer();
            //console.log("@@LoadingViewUI outer")
            HeartBeat.removeListener(this, this.onShowLoadingGraphics);
        }
        /**
         * 显示下载进度的图形
         */
        public onShowLoadingGraphics():void {
            if (this.alpha < 1) this.alpha += 0.05;
            this._bmpBg.rotation += 2;
            this._bmpLogo.rotation -= 1;
        }
    }
}
