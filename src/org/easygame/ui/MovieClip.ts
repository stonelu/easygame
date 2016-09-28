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
    export class MovieClip extends Group {
        private _imgDisplay:egret.Bitmap = null;
        //序列帧播放间隔时长
        private _fps:number = 0;
        private _autoFps:boolean = true;
        private _textures:Array<egret.Texture> = null;
        //当前播放帧的下标
        private _numFrameIndex:number = 0;
        //播放计数
        private _numFrammeCount:number = 0;
        //是否在播放
        private _isPlaying:boolean = false;
        //是否循环播放
        private _loop:boolean = false;
        //声音播放
        private _soundName:string = null;
        //使用animate data的情况
        private _animateName:string = null;
        private _animateDataDownload:boolean = false;//动画数据是否已经开始下载
        private _animateData:AnimateData = null;
        //播放回调
        private _callFuncDict:any = null;
        private _autoDestory:boolean = false;//停止的时候,自动销毁
        private _autoSize:boolean = true;//自动根据材质计算的最大宽高改变播放容器的宽高
        //自动播放
        private _autoplay:boolean = false;
        public constructor(drawDelay:boolean = false) {
            super(drawDelay);
        }
        /**
         * 初始化主场景的组件
         * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
            super.createChildren();
            this._imgDisplay = new egret.Bitmap();
            this.addChild(this._imgDisplay);
            this.showBg = false;
        }

        /**
         * 从指定帧开始播放
         * @param fps 帧间隔时间
         * @param frame  从第几帧开始播放
         */
        public play(fps:number = 0, frame:number = 0):void {
            if (!easy.StringUtil.isUsage(this._animateName) && !this._textures) return;
            if (fps > 0 ) {
                this._fps = fps;
                this._autoFps = false;
            }
            this._numFrameIndex = frame;
            if (this._isPlaying) return;
            if (easy.StringUtil.isUsage(this._animateName) || this._textures.length > 1) {
                this._numFrammeCount = this._fps;//触发第一次播放的必备条件
                this.onChangeTexture();//先响应,防止延迟
                HeartBeat.addListener(this, this.onChangeTexture, 1);
            } else {
                this._imgDisplay.texture = this._textures[0];
            }
            //this._numFrammeCount = 0;
            this._isPlaying = true;
            this.onPlaySound();
        }

        /**
         * 从指定帧开始播放
         * @param frame
         */
        public gotoAndPlay(frame:number):void {
            this.play(0, frame);
        }

        /**
         * 跳到指定帧,从0开始计数
         * @param frame
         */
        public gotoAndStop(frame:number):void {
            this._numFrameIndex = frame;
            this._numFrammeCount = this._fps;
            this.onChangeTexture();//先响应,防止延迟
            this._isPlaying = false;
            HeartBeat.removeListener(this, this.onChangeTexture);
        }

        /**
         * 暂停播放
         */
        public pause():void {
            this._isPlaying = false;
            HeartBeat.removeListener(this, this.onChangeTexture);
            easy.Sound.stop(this._soundName);
        }

        /**
         *停止播放
         */
        public stop():void {
            this._isPlaying = false;
            this._numFrameIndex = 0;
            this._numFrammeCount = 0;
            HeartBeat.removeListener(this, this.onChangeTexture);
            easy.Sound.stop(this._soundName);
            if (this._callFuncDict && this._callFuncDict["-1"]) this._callFuncDict["-1"].func.call(this._callFuncDict["-1"].thisFunc, this, -1);
            if (this._autoDestory) this.destory();
            //console.log("movie.stop=" + this._animateName);
        }

        /**
         * 重新播放
         */
        public replay():void {
            if (!easy.StringUtil.isUsage(this._animateName) && !this._textures) return;
            this._isPlaying = true;
            if (easy.StringUtil.isUsage(this._animateName) || this._textures.length > 1) {
                HeartBeat.addListener(this, this.onChangeTexture, 1);
            } else {
                this._imgDisplay.texture = this._textures[0];
            }
            easy.Sound.play(this._soundName, 0, this._loop?0:1);
        }

        /**
         * 销毁数据
         */
        public destory():void {
            this._isPlaying = false;
            this.resetData();
            this.verticalEnabled = false;
            this.horizontalEnabled = false;
            HeartBeat.removeListener(this, this.onChangeTexture);
            this.removeFromParent();
        }

        /**
         * 重置数据
         */
        private  resetData():void {
            easy.Sound.stop(this._soundName);
            this._autoFps = true;
            this._numFrameIndex = 0;
            this._numFrammeCount = 0;
            this._textures = null;
            this._animateData = null;
            this._animateName = null;
            this._callFuncDict = null;
            this._animateDataDownload = false;
            this.anchorX = 0;
            this.anchorY = 0;
            this.anchorEnabled = false;
            this.anchorOffsetX = 0;
            this.anchorOffsetY = 0;
            if (this._imgDisplay)this._imgDisplay.texture = null;

        }
        /**
         * 设置播放的材质集合
         * @param value
         */
        public set textures(value:Array<egret.Texture>){
            this._textures = value;
        }
        public get textures():Array<egret.Texture> {
            return this._textures;
        }

        /**
         * 通过设置animate动画数据的名称来设置数据
         * @param name
         */
        public set animateName(name:string) {
            this.resetData();
            this._animateName = name;
        }

        /**
         * 设置animate动画数据
         * @param item
         */
        public set animateData(item:AnimateData) {
            this._animateData = item;
            if (this._animateData) {
                this._animateName = item.id;
                this.setAnimateData();
            }
        }
        public get animateData():AnimateData {
            return this._animateData;
        }

        /**
         * 设置播放的声音名称
         * @param value
         */
        public set sound(value:string){
            this._soundName = value;
        }
        public get sound():string {
            return this._soundName;
        }
        /**
         * 设置播放的帧频间隔
         * @param value
         */
        public set fps(value:number){
            this._fps = value;
            if (this._fps != 0){
                this._autoFps = false;
            }
        }
        public get fps():number {
            return this._fps;
        }
        /**
         * 设置播放是否循环
         * @param value
         */
        public set loop(value:boolean){
            this._loop = value;
        }
        public get loop():boolean {
            return this._loop;
        }
        /**
         * 设置stop结束回调
         * @param thisArg func对象
         * @param value func方法
         * @param frame 在第几帧触发,-1,表示结束的时候触发
         */
        public setCallFunc(thisArg:any, value:Function, frame:number = -1){
            if (this._callFuncDict == null){
                this._callFuncDict  = {};
            }
            this._callFuncDict["" + frame] = {func:value, thisFunc:thisArg};
        }

        /**
         * 移除call back function的设置
         * @param frame
         */
        public removeCallFunc(frame:number = -1){
            if (this._callFuncDict && this._callFuncDict["" + frame]){
                delete this._callFuncDict["" + frame];
            }
        }

        /**
         * 变更材质
         */
        private onChangeTexture():void {
            if (!this.parent) {
                this.stop();
                return;
            }
            if (!this._imgDisplay) return;
            this._numFrammeCount ++;
            if (this._numFrammeCount >= this._fps) {
                this._numFrammeCount = 0;
                if (!this._animateDataDownload && this._animateData == null && StringUtil.isUsage(this._animateName)){//确保延迟加载的情况下,尽可能快的获取到动画数据
                    //easy.Debug.log = "@@@@MovieClip.animateName=" + this._animateName;
                    this.animateData = AnimateManager.getAnimateData(this._animateName);
                    this._animateDataDownload = true;
                    if (this.animateData == null){
                        //添加资源下载的监听
                        easy.EventManager.addEventListener(EventType.RESOURCE_DOWNLOADED, this.onEventAnimateDataDownloaded, this);
                        return;
                    }
                }
                if (this._textures){
                    if (this._fps == 0) this._fps = 1;
                    if (this._numFrameIndex >= this._textures.length){
                        if (!this._loop){
                            this.stop();
                            return;
                        }
                        this._numFrameIndex = 0;
                    }
                } else {
                    if (this._animateData && this._numFrameIndex >= this._animateData.textures.length) {
                        if (!this._loop) {
                            this.stop();
                            return;
                        }
                        this._numFrameIndex = 0;
                    }
                }
                if (this._callFuncDict && this._callFuncDict["" + this._numFrameIndex])
                    this._callFuncDict["" + this._numFrameIndex].func.call(this._callFuncDict["" + this._numFrameIndex].thisFunc, this, this._numFrameIndex);
            } else {
                return;
            }
            if (this._textures){
                this._imgDisplay.texture = this._textures[this._numFrameIndex];
                this._imgDisplay.x = this.cx - this._imgDisplay.width/2;
                this._imgDisplay.y = this.cy - this._imgDisplay.height/2;
                this._numFrameIndex ++;
            } else {//animate data的情况
                if (this._animateData && this._animateData.textures && this._imgDisplay) {
                    var animateTexture:AnimateTexture = this._animateData.getTexture(this._numFrameIndex);
                    //console.log("id=" + animateTexture.id)
                    if (this._autoFps)this._fps = animateTexture.frame;
                    //this._imgDisplay.setSize(animateTexture.width, animateTexture.height);
                    if (this.animateData._merge && this._animateData.textures.length > 1){
                        this._imgDisplay.x = this.cx + animateTexture.x;
                        this._imgDisplay.y = this.cy + animateTexture.y;
                    } else {
                        this._imgDisplay.x = 0;
                        this._imgDisplay.y = 0;
                    }
                    this._imgDisplay.texture = animateTexture.texutre;
                    this._numFrameIndex++;
                    if (this._animateData.textures.length == 1){//不需要变换,停止呼吸变换
                        HeartBeat.removeListener(this, this.onChangeTexture);
                    }
                }
            }
        }

        /**
         * animate data下载完成通知
         * @param myevent
         */
        private onEventAnimateDataDownloaded(myevent:MyEvent):void {
            if (myevent.getItem("name") == this._animateName){
                easy.EventManager.removeEventListener(EventType.RESOURCE_DOWNLOADED, this.onEventAnimateDataDownloaded, this);
                this.setAnimateData();
            }
        }

        /**
         * 设置animate data 数据,并初始化
         */
        private setAnimateData():void {
            this._animateData = AnimateManager.getAnimateData(this._animateName);
            if (this.animateData && this._autoSize) {
                this.setSize(this.animateData.width, this.animateData.height);
            }
            //根据材质设定帧频
            if (this._fps == 0 && this.animateData && this._autoFps) {
                this._fps = this.animateData.frame;
            }
        }

        /**
         * 初始化声音对象,并播放声音
         */
        private onPlaySound():void {
            if (!GlobalSetting.VOLUME_OPEN) return;
            if (easy.StringUtil.isUsage(this._soundName)) {
                easy.Sound.play(this._soundName, 0 , this._loop?0:1);
            }
        }

        /**
         * 查询当前时候在播放
         * @returns {boolean}
         */
        public get isPlaying():boolean {
            return this._isPlaying;
        }

        /**
         * 当前播放的帧数
         * @returns {number}
         */
        public get currentFrame():number {
            return this._numFrameIndex;
        }
        /**
         * 总的帧数
         * @returns {number}
         */
        public get totalFrame():number {
            if (this._textures) {
                return this._textures.length;
            } else if (this._animateData){
                return this._animateData.textures.length;
            }
            return 0;
        }
        /**
         * 停止播放的时候,自动销毁
         * @param value
         */
        public set autoDestory(value:boolean){
            this._autoDestory = value;
        }
        public get autoDestory():boolean {
            return this._autoDestory;
        }
        /**
         * 自动根据材质计算的最大宽高改变播放容器的宽高
         * 容器的中点,是播放材质的x,y原点
         * @param value
         */
        public set autoSize(value:boolean){
            this._autoSize = value;
        }
        public get autoSize():boolean {
            return this._autoSize;
        }
        /**
         * 设置是否下一帧计算相对位置
         * 不需要对子元素,进行布局,所以覆写,减少消耗
         */
        public onInvalidatePosition():void{//重新计算布局位置
            if(!this._hasInvalidatePosition){
                this._hasInvalidatePosition = true;
                this.addEventListener(egret.Event.ENTER_FRAME, this.resetPosition, this);
            }
        }
        /**
         * 自动播放
         * @param value
         */
        public set autoplay(value:boolean){
            if (this._autoplay != value) {
                this._autoplay = value;
            }
        }

        public get autoplay():boolean {
            return this._autoplay;
        }
    }
}