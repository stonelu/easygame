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
    /**
     * 视频
     */
    export class Video extends Group {
        public static STATE_PLAYING:string = "playing";
        public static STATE_PAUSE:string = "pause";
        public static STATE_STOP:string = "stop";

        //播放器
        private _video:egret.Video = null;
        //播放源
        private _source:string = null;
        //界面截图
        private _poster:string = null;
        private _imgPoster:egret.Bitmap = null;//
        //声音0-100
        private _valume:number = -1;
        //是否全屏
        private _fullscreen:boolean = false;
        //当前状态
        private _state:string = Video.STATE_STOP;
        //自动播放
        private _autoplay:boolean = false;

        //显示播放按钮
        private _showBtnPlay:boolean = true;

        //播放按钮图像
        private _btnPlayTexture:egret.Texture = null;
        private _btnPlayTween:egret.Tween = null;
        //播放按钮
        private _btnPlay:Button = null;
        //循环播放
        private _loop:boolean = false;
        //io加载错误次数
        private _ioerror:number = 0;

        public constructor(drawDelay:boolean = false) {
            super(drawDelay);
        }

        public createChildren():void {
            super.createChildren();
            this.bgColor = 0x000000;
            this.border = false;
            this.setSize(Style.VIDEO_DEFAULT_WIDTH, Style.VIDEO_DEFAULT_HEIGHT);
            this._video = new egret.Video();
            this.addChild(this._video);
            //this._video.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playOrStopVideo, this);
            this._video.addEventListener(egret.Event.COMPLETE, this.onEventComplete, this);
            this._video.addEventListener(egret.Event.ENDED, this.onEventEnd, this);
            this._video.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onEventError, this);

            if (this._source != null) this._video.src = this._source;
            if (this._valume != -1) this._video.volume = this._valume/100;
            if (this._poster != null) this._video.poster = this._poster;
            this._video.fullscreen = this._fullscreen;
            if (this._autoplay) this.play();
        }

        private onEventComplete(event:any):void {
            //console.log("video load complete!!");
            this._ioerror = 0;
        }
        private onEventEnd(event:any):void {
            //console.log("video load end!!");
            this._ioerror = 0;
        }
        private onEventError(event:any):void {
            //console.log("video io error!!=" + this.state);
            if (this._video  && this.state == Video.STATE_PAUSE && this._ioerror < 3){
                if (this._video.parent) this._video.parent.removeChild(this._video);
                this._video = new egret.Video();
                this.addChildAt(this._video,1);
                this._video.addEventListener(egret.Event.COMPLETE, this.onEventComplete, this);
                this._video.addEventListener(egret.Event.ENDED, this.onEventEnd, this);
                this._video.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onEventError, this);
                this._video.width = this.width;
                this._video.height = this.height;
                this._ioerror ++;
                this._video.src = this._source;
                this._video.play(0, this._loop);//io错误,尝试重新播放
            }
        }

        /**
         * 显示播放按钮
         */
        private onShowBtnPlay():void {
            if(!this._showBtnPlay) return;
            if (this._btnPlayTexture == null) {
                //绘制播放按钮
                var _radius1:number = 58;//底部圆弧半径
                var _radius2:number = 60;//顶部圆半径
                var _lineLength:number = 80;//三角形边长
                var _circle1X:number = 72;//底部圆心x坐标
                var _circle1Y:number = 73;//底部圆心y坐标
                var _circle2X:number = 70;//顶部圆心x坐标
                var _circle2Y:number = 70;//顶部圆心y坐标

                var shape:egret.Shape = new egret.Shape();
                shape.graphics.beginFill(0x799cd6,0.3);
                shape.graphics.lineStyle(2,0xffffff,0.4);
                shape.graphics.drawCircle(_circle1X,_circle1Y,_radius1+2);
                shape.graphics.endFill();

                shape.graphics.beginFill(0x799cd6);
                shape.graphics.lineStyle(1,0x000000,0.5);
                shape.graphics.drawCircle(_circle2X,_circle2Y,_radius2);
                shape.graphics.endFill();

                shape.graphics.beginFill(0x28405b);
                shape.graphics.lineStyle(1,0x081f3e);
                shape.graphics.moveTo(_circle2X - Math.sqrt(3)/ 6 * _lineLength,_circle2Y - _lineLength / 2);
                shape.graphics.lineTo(_circle2X + Math.sqrt(3) / 3 * _lineLength,_circle2Y);
                shape.graphics.lineTo(_circle2X - Math.sqrt(3)/ 6 * _lineLength,_circle2Y + _lineLength / 2);
                shape.graphics.lineTo(_circle2X - Math.sqrt(3)/ 6 * _lineLength,_circle2Y - _lineLength / 2);
                shape.graphics.endFill();


                var renderTexture:egret.RenderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(shape);
                this._btnPlayTexture = renderTexture;
            }
            if (this._btnPlay == null) {
                this._btnPlay = new easy.Button();
                this._btnPlay.statesLength = 1;
                this._btnPlay.texture = this._btnPlayTexture;
                this._btnPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapPlay, this);
            }
            this.addChild(this._btnPlay);
            this._btnPlay.width = this._btnPlayTexture.textureWidth;
            this._btnPlay.height = this._btnPlayTexture.textureHeight;
            this._btnPlay.x = this.cx - this._btnPlay.cx;
            this._btnPlay.y = this.cy - this._btnPlay.cy;
            if (this._btnPlayTween == null){
                this._btnPlayTween = egret.Tween.get(this._btnPlay, {loop:true}).to({alpha:0.5}, 3000).wait(1000).to({alpha:1}, 3000).wait(1000);
            }
            this._btnPlayTween.setPaused(false);
            //显示视频截图
            if (this._imgPoster && this._imgPoster.parent){
                this._imgPoster.visible = true;
            }
        }

        /**
         * 隐藏播放按钮
         */
        private onHiddenBtnPlay():void {
            if (this._btnPlay){
                this._btnPlay.removeFromParent();
                this._btnPlayTween.setPaused(true);
            }
        }

        /**
         * 视频播放完毕
         */
        public onVideoComplete(event:egret.Event):void {
            if (this._video){
                this._video.position = 0;
                easy.MyEvent.sendEvent(EventType.VIDEO_END);//发送结束事件
                this._video.removeEventListener(egret.Event.ENDED, this.onVideoComplete, this);
            }
            this.onShowBtnPlay();
        }

        private onTouchTapPlay():void {
            this.play();
        }
        /**
         * 点击触发是播放还是停止
         */
        private playOrStopVideo(event:egret.Event):void {
            if (this._video){
                if (this._state == Video.STATE_PLAYING){
                    this.pause();
                } else {
                    this.play();
                }
            }
        }

        /**
         * 播放状态state
         * @param value
         */
        public set state(value:string){
            if (this._state != value) {
                this._state = value;
                this.invalidate();
            }
        }

        public get state():string {
            return this._state;
        }

        /**
         * 设置播放源
         * @param value
         */
        public set source(value:string){
            if (this._source != value) {
                this._source = value;
                if (this._video) this._video.src = this._source;
            }
        }

        public get source():string {
            return this._source;
        }

        /**
         * 画面截图
         * @param value
         */
        public set poster(value:string){
            if (this._poster != value) {
                this._poster = value;
                this.invalidate();
                //if (this._video) this._video.poster = this._poster;
            }
        }
        public get poster():string {
            return this._poster;
        }

        /**
         * 设置播放音量0-100
         * @param value
         */
        public set valume(value:number){
            if (this._valume != value) {
                this._valume = value;
                if (this._video) this._video.volume = this._valume/100;
            }
        }

        public get valume():number {
            return this._valume;
        }

        /**
         * 设置播放音量0-100
         * @param value
         */
        public set fullscreen(value:boolean){
            if (this._fullscreen != value) {
                this._fullscreen = value;
                if (this._video) this._video.fullscreen = this._fullscreen;
            }
        }

        public get fullscreen():boolean {
            return this._fullscreen;
        }
        /**
         * 自动播放
         * @param value
         */
        public set autoplay(value:boolean){
            if (this._autoplay != value) {
                this._autoplay = value;
                //if (this._video) this.play();
            }
        }

        public get autoplay():boolean {
            return this._autoplay;
        }
        /**
         * 设置循环播放
         * @param value
         */
        public set loop(value:boolean){
            if (this._loop != value) {
                this._loop = value;
            }
        }

        public get loop():boolean {
            return this._loop;
        }

        /**
         * 显示播放按钮
         * @param value
         */
        public set showBtnPlay(value:boolean){
            if (this._showBtnPlay != value) {
                this._showBtnPlay = value;
                this.invalidate();
            }
        }

        public get showBtnPlay():boolean {
            return this._showBtnPlay;
        }
        /**
         * 设置播放按钮的材质
         * @param value
         */
        public set btnPlayTexture(value:egret.Texture){
            if (this._btnPlayTexture != value) {
                this._btnPlayTexture = value;
                this.invalidate();
            }
        }

        public get btnPlayTexture():egret.Texture {
            return this._btnPlayTexture;
        }

        /**
         * 播放
         * @param startTime
         * @param loop
         */
        public play(startTime:number = 0):void {
            if (this._video && this._source){
                this._state = Video.STATE_PLAYING;
                this.onHiddenBtnPlay();
                //this._video.load(this._source);
                if (startTime == 0) startTime = this._video.position;
                this._video.addEventListener(egret.Event.ENDED, this.onVideoComplete, this);
                this._video.play(startTime, this._loop);
                if (this._imgPoster && this._imgPoster.parent){
                    this._imgPoster.visible = false;
                }
            }
        }
        /**
         * 加载source的内容
         * @param url
         */
        public load(url:string):void {
            this._source = url;
            if (this._video) this._video.load(this.source);
        }

        public close():void {
            this._state = Video.STATE_STOP;
            if (this._video){
                this._video.close();
                this.onShowBtnPlay();
            }
            if (this._imgPoster && this._imgPoster.parent){
                this._imgPoster.visible = true;
            }
        }
        public pause():void {
            this._state = Video.STATE_STOP;
            if (this._video){
                this._state = Video.STATE_PAUSE;
                this._video.pause();
                this.onShowBtnPlay();
            }
        }

        public draw():void {
            super.draw();
            if (this._video == null) return;
            if (this._showBtnPlay && this._state != Video.STATE_PLAYING){
                this.onShowBtnPlay();
            }
            if (easy.StringUtil.isUsage(this._poster)){
                if (this._imgPoster == null){
                    this._imgPoster = new egret.Bitmap();
                    this.addChildAt(this._imgPoster, this.getChildIndex(this._btnPlay));
                }
                if (easy.ResManager.getRes(this._poster)) {
                    this._imgPoster.texture = easy.ResManager.getRes(this._poster);
                    if (this._imgPoster.texture) {
                        this._imgPoster.x = this.cx - this._imgPoster.width/2;
                        this._imgPoster.y = this.cy - this._imgPoster.height/2;
                    }
                } else {
                    easy.EventManager.addEventListener(easy.EventType.RESOURCE_DOWNLOADED, this.onDownloadedPoster, this);
                }
                //this._video.poster = this._poster;
            }
            this._video.width = this.width;
            this._video.height = this.height;
            if (this._btnPlay && this._btnPlay.texture != this._btnPlayTexture){
                this._btnPlay.texture = this._btnPlayTexture;
            }
        }

        private onDownloadedPoster(myevent:easy.MyEvent):void {
            if (easy.ResManager.getRes(this._poster)) {
                easy.EventManager.removeEventListener(easy.EventType.RESOURCE_DOWNLOADED, this.onDownloadedPoster, this);
                this._imgPoster.texture = easy.ResManager.getRes(this._poster);
                if (this._imgPoster.texture) {
                    this._imgPoster.x = this.cx - this._imgPoster.width/2;
                    this._imgPoster.y = this.cy - this._imgPoster.height/2;
                }
            }
        }
    }
}