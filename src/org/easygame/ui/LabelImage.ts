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
     * 使用材质显示字符
     */
    export class LabelImage extends HGroup{
        private _text:string = "";//文本内容
        private _textureDict:Object = {};//切割好的材质,对应的材质映射表
        private _texture:egret.Texture = null;
        private _shape:egret.Shape = null;
        /**
         * 是否已初始化材质数据
         */
        private _initDisplayData:boolean = false;
        /**
         * 设置材质对应的字符
         * 默认是
         */
        private _chars:string = "0,1,2,3,4,5,6,7,8,9";
        /**
         * 切割符号指定
         * @type {string}
         * @private
         */
        private _charSplit:string = ",";
        /**
         * 横向切割
         */
        private _horizontalSplit:boolean = true;
        /**
         *切割间隔
         */
        private _gapSplit:number = 0;

        //声音播放
        private _soundName:string = null;
        private _sound:egret.Sound = null;

        //roling滚动设置
        private _rollingEnable:boolean = false;//滚动开关
        private _rollingZoomEnable:boolean = false;//滚动放大开关
        private _rollingZoomValue:number = 1.5;//放大倍数
        private _rollingZoomAlign:string = egret.HorizontalAlign.CENTER;//放大对齐方式
        private _rollingEffect:EffectNumberRolling = null;//滚动对象

        private _step:number = 0;//每次滚动增量的值

        public constructor(drawDelay:boolean = false) {
            super(drawDelay);
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
            super.createChildren();
            this.setSize(Style.TEXTINPUT_WIDTH, Style.TEXTINPUT_HEIGHT);
        }

        /**
         * 文本内容
         */
        public get text():string {
            return this._text;
        }

        public set text(value:string) {
            if(this._text != value){
                if (this._rollingEnable){
                    //滚动设置
                    if (this._rollingEffect == null){
                        this._rollingEffect = new EffectNumberRolling(this);
                        this._rollingEffect.zoomEnable = this._rollingZoomEnable;
                        this._rollingEffect.zoomValue = this._rollingZoomValue;
                        this._rollingEffect.zoomAlign = this._rollingZoomAlign;
                        this._rollingEffect.callbackFunc = this._callbackFunc;
                        this._rollingEffect.callbackFuncThis = this._callbackFuncThis;
                    }
                    this._rollingEffect.clean();//清除之前的滚动
                    this._rollingEffect.setText(value, this._step);
                } else {
                    if (this._rollingEffect)this._rollingEffect.clean(value);//清除之前的滚动
                    this.setText(value);
                }
            }
        }

        /**
         * 自己设置显示字符
         * @param str
         */
        public setText(str:string):void {
            this._text = "" + str;
            if(this._text == null) this._text = "";
            this.invalidate();
            this.onPlaySound();
        }


        public get texture():egret.Texture {
            return this._texture;
        }

        /**
         * 设置材质
         * @param value
         */
        public set texture(value:egret.Texture) {
            if(this._texture != value){
                this._texture = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        public get chars():string {
            return this._chars;
        }

        /**
         * 设置材质对应的字符
         * @param value
         */
        public set chars(value:string) {
            if(this._chars != value){
                this._chars = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        public get step():number {
            return this._step;
        }

        /**
         * 设置滚动的增量值
         * 这个值必须在滚动之前设置进入
         * 使用默认的滚动设置,设置为0即可
         * @param value
         */
        public set step(value:number) {
            if(this._step != value){
                this._step = value;
                //this._initDisplayData = false;
                //this.invalidate();
            }
        }
        public get horizontalSplit():boolean {
            return this._horizontalSplit;
        }

        /**
         * 材质切割的方向,默认水平切割
         * @param value
         */
        public set horizontalSplit(value:boolean) {
            if(this._horizontalSplit != value){
                this._horizontalSplit = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        public get gapSplit():number {
            return this._gapSplit;
        }

        /**
         * 材质切割的间隔
         * @param value
         */
        public set gapSplit(value:number) {
            if(this._gapSplit != value){
                this._gapSplit = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        public get charSplit():string {
            return this._charSplit;
        }

        /**
         * 切割符号,默认是,
         * @param value
         */
        public set charSplit(value:string) {
            if(this._charSplit != value){
                this._charSplit = value;
                this._initDisplayData = false;
                this.invalidate();
            }
        }
        /**
         * Draws the visual ui of the component.
         */
        public draw():void{
            if (!this._initDisplayData){
                this.splitTextureSource();
            }
            if (this._bgImage && this._bgImage.parent) {
                this._bgImage.parent.removeChild(this._bgImage);
            }
            //回收旧资源
            var bitmap:egret.Bitmap = null;
            for (var i = this.numChildren - 1; i >= 0; i --){
                bitmap = <egret.Bitmap>this.getChildAt(i);
                bitmap.texture = null;
                bitmap.parent.removeChild(bitmap);
                ObjectPool.recycleClass(bitmap, "labelimg");
            }
            //根据字符显示材质内容
            var texture:egret.Texture = null;
            if (StringUtil.isUsage(this._text)){
                for (var i = 0; i < this._text.length; i ++){
                    texture = this._textureDict[this._text.charAt(i)];
                    if (texture){
                        bitmap = ObjectPool.getByClass(egret.Bitmap, "labelimg");
                        this.addChild(bitmap);
                        bitmap.texture = texture;
                        bitmap.width = texture._bitmapWidth;
                        bitmap.height = texture._bitmapHeight;
                        bitmap.visible = true;
                        bitmap.alpha = 1;
                    }
                }
            }
            super.draw();
        }
        private  splitTextureSource():void {
            if (this._texture && easy.StringUtil.isUsage(this._chars)) {
                var charArr:Array<string> = easy.StringUtil.spliteStrArr(this._chars, this._charSplit);
                if (charArr.length > 0) {
                    this._initDisplayData = true;
                    var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(this._texture);
                    var splietWidth:number = 0;
                    var splietHeight:number = 0;
                    var textureWidth:number = this._texture._bitmapWidth;
                    if (textureWidth == 0) textureWidth = this._texture._sourceWidth;
                    var textureHeight:number = this._texture._bitmapHeight;
                    if (textureHeight == 0) textureHeight = this._texture._sourceHeight;
                    if (this._horizontalSplit) {
                        splietWidth = (textureWidth - charArr.length * this._gapSplit) / charArr.length;
                        splietHeight = textureHeight;
                    } else {
                        splietWidth = textureWidth;
                        splietHeight = (textureHeight - charArr.length * this._gapSplit) / charArr.length;
                    }
                    //开始切割;
                    for (var i = 0; i < charArr.length; i++) {
                        if (this._horizontalSplit) {
                            this._textureDict[charArr[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random() * 999999) + "_" + charArr[i], i * splietWidth + i * this._gapSplit, 0, splietWidth, splietHeight);
                        } else {
                            this._textureDict[charArr[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random() * 999999) + "_" + charArr[i], 0, i * splietHeight + i * this._gapSplit, splietWidth, splietHeight);
                        }
                    }
                }
            }
        }
        /**
         * 初始化声音对象,并播放声音
         */
        private onPlaySound():void {
            if (this._sound == null && easy.StringUtil.isUsage(this._soundName)) {
                this._sound = RES.getRes(this._soundName);
            }
            if (this._sound){
                this._sound.play();
            }
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
         * 文字滚动设置
         * @param value
         */
        public set rollingEnable(value:boolean){
            this._rollingEnable = value;
        }
        public get rollingEnable():boolean {
            return this._rollingEnable;
        }

        /**
         * 文字滚动放大设置
         * @param value
         */
        public set rollingZoomEnable(value:boolean){
            this._rollingZoomEnable = value;
            if (this._rollingEffect) this._rollingEffect.zoomEnable = value;
        }
        public get rollingZoomEnable():boolean {
            return this._rollingZoomEnable;
        }

        /**
         * 设置文字滚动放大倍数,默认是1.5倍
         * @param value
         */
        public set rollingZoomValue(value:number){
            this._rollingZoomValue = value;
            if (this._rollingEffect) this._rollingEffect.zoomValue = value;
        }
        public get rollingZoomValue():number {
            return this._rollingZoomValue;
        }
        /**
         * 设置文字滚动的对齐方式
         * @param value
         */
        public set rollingZoomAlign(value:string){
            this._rollingZoomAlign = value;
            if (this._rollingEffect) this._rollingEffect.zoomAlign = value;
        }
        public get rollingZoomAlign():string {
            return this._rollingZoomAlign;
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
         * 设置滚动结束的回调通知
         */
        public setRollingEndFunc(thisObj:any, func:any):void{
            this._callbackFunc = func;
            this._callbackFuncThis = thisObj;
            if (this._rollingEffect){
                this._rollingEffect.callbackFunc = this._callbackFunc;
                this._rollingEffect.callbackFuncThis = this._callbackFuncThis;
            }
        }
        public removeRollingEndFunc():void {
            this._callbackFunc = null;
            this._callbackFuncThis = null;
            if (this._rollingEffect){
                this._rollingEffect.callbackFunc = this._callbackFunc;
                this._rollingEffect.callbackFuncThis = this._callbackFuncThis;
            }
        }
        //滚动回调的函数设置
        private _callbackFunc:any = null;
        private _callbackFuncThis:any = null;
     }
}
class EffectNumberRolling{
     public zoomEnable:boolean = false;
     public zoomValue:number = 1;
     public zoomAlign:string = egret.HorizontalAlign.CENTER;
     private _isZoom:boolean = false;
     private _zoomXOld:number = 1;
     private _zoomYOld:number = 1;
     private _xScale:number = 1;
     private _yScale:number = 1;
     private _xOld:number = 1;
     private _yOld:number = 1;
     private _lastRollString:string;
     private _labelLength:number;
     private _labelImg:easy.LabelImage = null;
     private _rollingText:Array<string> = [];//用于滚动的数组
     //滚动回调的函数设置
    public callbackFunc:any = null;
    public callbackFuncThis:any = null;
    public constructor(lableImg:easy.LabelImage) {
        this._labelImg = lableImg;
        this._xOld = this._labelImg.x;
        this._yOld = this._labelImg.y;
    }

    /**
     * 清除之前的滚动
     */
    public clean(value:string = null):void {
        if (this._rollingText.length > 0){
            this._labelImg.setText(this._rollingText[this._rollingText.length -1]);
            this._lastRollString = this._rollingText[this._rollingText.length -1];
        }
        this._rollingText.length = 0;
        if (easy.StringUtil.isUsage(value)){
            this._lastRollString = value;
        }
    }

    public setText(str:string, step:number){
        var _oldLabelText:string = this._labelImg.text;
        this._labelLength = parseInt(str);
        var _length:string = this._labelLength + "";
        //判断字符串是否是纯数字类型
        if(_length.length == str.length){
            //如果滚动数组中有值，将最后一个值记录 作为第二次跳转的起始值
            if (this._rollingText.length > 0){
                this._labelImg.setText(this._rollingText[this._rollingText.length -1]);
                this._lastRollString = this._rollingText[this._rollingText.length -1];
            }
            else{
                this._lastRollString = _oldLabelText;//如果当前没有滚动，将labelImg当前值记录
            }
            this._rollingText.length = 0;
            var tempNum:number;
            var temp:string;
            var step1:number = 0;
            if (step > 0 ){
                step1 = step;
            } else {
                step1 = this.getStepValue(parseInt(this._lastRollString),parseInt(str));
            }
            tempNum = parseInt(this._lastRollString) + step1;
            temp = tempNum + "";
            this._rollingText.push(temp);
            if(step1 > 0){
                while(parseInt(this._rollingText[this._rollingText.length - 1]) < parseInt(str)){
                    if(step1 + parseInt(this._rollingText[this._rollingText.length - 1]) < parseInt(str)){
                        tempNum += step1;
                        temp = tempNum + "";
                    }
                else {
                        tempNum = parseInt(str);
                        temp = tempNum + "";
                    }
                    this._rollingText.push(temp);
                }
            } else if(step1 < 0){
                while(parseInt(this._rollingText[this._rollingText.length - 1]) > parseInt(str)){
                    if(step1 + parseInt(this._rollingText[this._rollingText.length - 1]) > parseInt(str)){
                        tempNum += step1;
                        temp = tempNum + "";
                    }
                else {
                        tempNum = parseInt(str);
                        temp = tempNum + "";
                    }
                    this._rollingText.push(temp);
                }
            }
            //做非匀速跳转启用
            //var step2:number = 0;
            //var limitNum:number = parseInt(str) - step1 * 2;
            //if(step1 > 0){
            //    while(parseInt(this._rollingText[this._rollingText.length - 1]) < limitNum){
            //        if(step1 + parseInt(this._rollingText[this._rollingText.length - 1] ) < limitNum){
            //            tempNum += step1;
            //            temp = tempNum + "";
            //        }
            //        else{
            //            tempNum = limitNum;
            //            temp = tempNum + "";
            //        }
            //        this._rollingText.push(temp);
            //    }
            //    while (parseInt(this._rollingText[this._rollingText.length - 1]) < parseInt(str)){
            //       if(step2 + parseInt(this._rollingText[this._rollingText.length - 1] ) < parseInt(str)){
            //           tempNum += step2;
            //           temp = tempNum + ""
            //       }
            //        else{
            //           tempNum = parseInt(str);
            //           temp = tempNum +"";
            //       }
            //        this._rollingText.push(temp);
            //    }
            //}
            //else if(step1 < 0){
            //    while(parseInt(this._rollingText[this._rollingText.length - 1]) > limitNum){
            //        if(step1 + parseInt(this._rollingText[this._rollingText.length - 1] ) > limitNum){
            //            tempNum += step1;
            //            temp = tempNum + "";
            //        }
            //        else{
            //            tempNum = limitNum;
            //            temp = tempNum + "";
            //        }
            //        this._rollingText.push(temp);
            //    }
            //    while (parseInt(this._rollingText[this._rollingText.length - 1]) > parseInt(str)){
            //        if(step2 + parseInt(this._rollingText[this._rollingText.length - 1] ) > parseInt(str)){
            //            tempNum += step2;
            //            temp = tempNum + ""
            //        }
            //        else{
            //            tempNum = parseInt(str);
            //            temp = tempNum +"";
            //        }
            //        this._rollingText.push(temp);
            //    }
            //}
        }
        if(this.zoomEnable && this.zoomValue != 1){
            this._labelImg.scaleX = this.zoomValue;
            this._labelImg.scaleY = this.zoomValue;
            if(this.zoomValue > 1){
                this._xScale = this._xOld - this._labelImg.width * (this._labelImg.scaleX - 1);
                this._yScale = this._yOld - this._labelImg.height * (this._labelImg.scaleX - 1);
            }
            else if(this.zoomValue < 1){
                this._xScale = this._xOld + this._labelImg.width * (this._labelImg.scaleX - 1);
                this._yScale = this._yOld + this._labelImg.height * (this._labelImg.scaleX - 1);
            }

            if(this.zoomValue > 1){
                if(this.zoomAlign == "center"){
                    this._labelImg.x = this._xOld - this._labelImg.width * (this._labelImg.scaleX - 1) / 2;
                    this._labelImg.y = this._yOld - this._labelImg.height * (this._labelImg.scaleY - 1) / 2;
                }
                else if(this.zoomAlign == "left"){
                    this._labelImg.y = this._yOld - this._labelImg.height * (this._labelImg.scaleY - 1) / 2;
                }
                else if(this.zoomAlign == "right"){
                    this._labelImg.x = this._xOld - this._labelImg.width * (this._labelImg.scaleX - 1);
                    this._labelImg.y = this._yOld - this._labelImg.height * (this._labelImg.scaleY - 1) / 2;
                }
            }
            else if(this.zoomValue < 1){
                if(this.zoomAlign == "center"){
                    this._labelImg.x = this._xOld + this._labelImg.width * (this._labelImg.scaleX - 1) / 2;
                    this._labelImg.y = this._yOld + this._labelImg.height * (this._labelImg.scaleY - 1) / 2;
                }
                else if(this.zoomAlign == "left"){
                    this._labelImg.y =  this._yOld + this._labelImg.height * (this._labelImg.scaleY - 1) / 2;
                }
                else if(this.zoomAlign == "right"){
                    this._labelImg.x = this._xOld + this._labelImg.width * (this._labelImg.scaleX - 1);
                    this._labelImg.y = this._yOld + this._labelImg.height * (this._labelImg.scaleY - 1) / 2;
                }
            }
            this._isZoom = true;
        }
        easy.HeartBeat.addListener(this,this.onChangeText,3);
    }

    /**
     * 根据最大和最小值,计算出增量多少合适
     * @param min
     * @param max
     */
    private getStepValue(num1:number, num2:number):number {
        var tempStep = Math.abs(num1 - num2);
        var value:number = 1;
        if (tempStep < 30){//30次
            value = 1;
        } else if (tempStep < 60) {//30次
            value = 2;
        } else if (tempStep < 100) {//30次
            value = 3;
        } else if (tempStep < 200) {//40次
            value = 5;
        } else if (tempStep < 400) {//40次
            value = 10;
        } else if (tempStep < 800) {//40次
            value = 20;
        } else if (tempStep < 1500) {//50次
            value = 30;
        } else if (tempStep < 2500) {//60次
            value = 40;
        } else if (tempStep < 3500) {//70次
            value = 50;
        } else {
            value = Math.floor(Math.round(tempStep/200) + 50);
        }
        if (num1 > num2){
            value = -value;
        }
        console.log("step=" + value);
        return value;
    }
    private onChangeText():void {
        if (this._rollingText.length > 0) {
            this._labelImg.setText(this._rollingText.shift()) ;
        } else {
            //结束rolling
            easy.HeartBeat.removeListener(this, this.onChangeText);
            if (this._isZoom){
                var paramObj:Object = {scaleX:this._zoomXOld, scaleY:this._zoomYOld};
                if (this._labelImg.anchorX == 0 && this._labelImg.anchorOffsetX == 0){
                    paramObj["x"] = this._xOld;
                }
                if (this._labelImg.anchorY == 0 && this._labelImg.anchorOffsetY == 0){
                    paramObj["y"] = this._yOld;
                }
                egret.Tween.get(this._labelImg).to(paramObj, 200);
            }
            this._isZoom = false;
            if (this.callbackFunc && this.callbackFuncThis){
                this.callbackFunc.call(this.callbackFuncThis);
            }
        }
    }
}
