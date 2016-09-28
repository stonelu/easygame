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
     * 按钮
     */
	export class Button extends BaseGroup {
        public static TOGGLE_PREFIX:string = "ui#button#toggle_";//toggle事件的前缀,尽量避免受到其他事件名称的混淆
        public static DEFAULT_TEXTURE:egret.RenderTexture = null;//默认材质

        public static STATE_UP:string = "up";
        public static STATE_OVER:string = "over";
        public static STATE_DOWN:string = "down";
        public static STATE_DISABLE:string = "disable";
        
		private _textureLabel:egret.Texture = null;//文字图片
		private _textureIcon:egret.Texture = null;//图标
		private _label:Label = null;//文本
		private _text:string = "";
        
        private _texture:egret.Texture = null;//外设的纹理
        private _imgDisplay:egret.Bitmap = null;//显示按钮up用的image

        public _imgLabel:egret.Bitmap = null;//显示文字图片的image
        public _imgIcon:egret.Bitmap = null;//显示图标用的image
        
        private _initDisplayData:boolean = false;//是否初始化显示对象
        public _selected:boolean = false;//选择时为ture
        private _toggleGroup:string = null;//toggle分组名称
        public stateArray:Array<any> = [Button.STATE_UP];//正常的按钮,只有三态,第四态是禁用态,其他的态可以自己加入
        private _currentState:string = Button.STATE_UP;//当前态
        public _textureDict:any = {};//各材质的映射,在给予img之前,保存在这个映射中
		//private _scaleEnable:boolean = false;// 直接拉伸
        
        private _verticalSplit:boolean = true;//bitmapdata采用竖直切割的方式
        //public _gapSplit:number = 0;//3态切割间隔
        //public _xOffsetSplit:number = 0;//切割x起始
        //public _yOffsetSplit:number = 0;//切割y起始
        //文字部分的设定
        private _labelMarginLeft:number = 0;
        private _labelMarginLeftEnable:boolean = false;
        private _labelMarginTop:number = 0;
        private _labelMarginTopEnable:boolean = false;
        //icon设定
        private _iconMarginLeft:number = 0;
        private _iconMarginLeftEnable:boolean = false;
        private _iconMarginTop:number = 0;
        private _iconMarginTopEnable:boolean = false;
        /**
         * 适合材质的尺寸
         */
        private _autoSize:boolean = false;
        private _labelColor:number = Style.BUTTON_TEXT;
        private _labelBold:boolean = false;//label加粗
        private _labelItalic:boolean = false;
        private _labelLineSpacing:number = 0;//行间距
        private _labelMultiline:boolean = false;//多行显示
        private _labelStroke:number = 0;
        private _labelStrokeColor:number = 0x003350;

        //labe字体大小
        private _fontSize:number = 12;
        //label字体
        private _fontName:string = null;

        private _scale9GridEnable:boolean = false;
        private _scale9GridRect:egret.Rectangle = null;//九宫拉伸的尺寸
        private _fillMode:string = "scale";//scale, repeat.

        //声音播放
        private _soundName:string = null;

        //像素级检测
        private _testPixelEnable:boolean = false;

        public constructor(drawDelay:boolean = false) {
            super(drawDelay);
        }

        public createChildren():void {
            super.createChildren();
            this.setSize(Style.BUTTON_DEFAULT_WIDTH, Style.BUTTON_DEFAULT_HEIGHT);
            this.touchEnabled = true;//事件接收
            this.touchChildren = false;
            //背景图多态显示
            this._imgDisplay = new egret.Bitmap();
            this.addChild(this._imgDisplay);
            this._imgDisplay.width = this.width;
            this._imgDisplay.height = this.height;
            this._imgDisplay.fillMode = egret.BitmapFillMode.SCALE;
            this._imgDisplay.touchEnabled = false;

            //文字显示
            this._label = new Label(this.drawDelay);
            this._label.autoSize = true;
            this._label.clip = false;
            this._label.hAlign = egret.HorizontalAlign.CENTER;
            this._label.showBg = false;
			this.addChild(this._label);

            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchRleaseOutside, this);
        }
        public onTouchEvent(event:egret.TouchEvent) : void {
            if (!this.enabled){
                event.stopImmediatePropagation();
                return;
            }
            //console.log("Button onTouchEvent=" + event.type);
            if (event.currentTarget == this){
                //像素检测
                if (this._testPixelEnable){
                    if (!this.testPixel32(event.localX, event.localY)){
                        event.stopImmediatePropagation();
                        return;
                    }
                }
                if(StringUtil.isUsage(this._toggleGroup)) {
                    if (event.type == egret.TouchEvent.TOUCH_BEGIN){
                        this.selected = !this._selected;
                    }
                    this.onPlaySound();
                    if (GlobalSetting.REPORT_UI) Report.send({"name": this.name, "type":"button", "action":"click", "data":this.data}, "/ui");
                   // console.log("Button _toggleGroup=" + this._toggleGroup + ", _selected=" + this._selected);
                } else {
                    if (event.type == egret.TouchEvent.TOUCH_BEGIN){
                        this._currentState = Button.STATE_DOWN;
                        this.onPlaySound();
                        if (GlobalSetting.REPORT_UI) Report.send({"name": this.name, "type":"button", "action":"click", "data":this.data}, "/ui");
                    } else if (event.type == egret.TouchEvent.TOUCH_END) {
                        this._currentState = Button.STATE_UP;
                    } else if (event.type == egret.TouchEvent.TOUCH_MOVE) {
                        this._currentState = Button.STATE_OVER;
                    }
                    if(this.statesLength == 1 && this._currentState == Button.STATE_DOWN){
                        this.scaleX = 0.9;
                        this.scaleY = 0.9;
                        this.alpha = 0.8;
                    }else{
                        this.scaleX = 1;
                        this.scaleY = 1;
                        this.alpha = 1;
                    }
                }
            }
            this.invalidate();
        }

        /**
         * 在外释放
         * @param event
         */
        private onTouchRleaseOutside(event:egret.TouchEvent):void {
            if(!StringUtil.isUsage(this._toggleGroup) || (StringUtil.isUsage(this._toggleGroup) && !this._selected)) {
                this._currentState = Button.STATE_UP;
                this.invalidate();
            }
        }
        public get currentState():string{
            return this._currentState;
        }
        
        public set currentState(value:string){
            if (this._currentState != value){
                this._currentState = value;
                this.invalidate();
            }
        }

        public get texture():egret.Texture{
            return this._texture;
        }

        public set texture(value:egret.Texture){
            if (this._texture != value) {
                this._initDisplayData = false;
                this._texture = value;
                this.invalidate();
            }
        }
        /**
         * Sets/gets the fillMode of the scale9Grid bitmap.(scale|repeat)
         */
        public get fillMode():string{
            return this._fillMode;
        }

        public set fillMode(value:string){
            if (this._fillMode != value){
                this._fillMode = value;
                this.invalidate();
            }
        }

        /**
         * 默认背景texture的九宫格拉伸设定
         * 只有showDefaultSkin并且设置了defaultSkinTexture,才有效
         * 默认绘制的背景是纯色的,所以不需要进行九宫拉伸设定
         */
        public get scale9GridEnable():boolean{
            return this._scale9GridEnable;
        }

        public set scale9GridEnable(value:boolean){
            if (this._scale9GridEnable != value) {
                this._scale9GridEnable = value;
                if (this._scale9GridEnable && this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
                this.invalidate();
            }
        }
        /**
         * Sets the x of the bitmap's scale9Grid.
         */
        public set scale9GridX(value:number){
            if (this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
            if(this._scale9GridRect.x != value){
                this._scale9GridRect.x = value;
                this.invalidate();
            }
        }
        public get scale9GridX():number{
            if (this._scale9GridRect)return this._scale9GridRect.x;
            return 0;
        }
        /**
         * Sets the y of the bitmap's scale9Grid.
         */
        public set scale9GridY(value:number){
            if (this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
            if(this._scale9GridRect.y != value){
                this._scale9GridRect.y = value;
                this.invalidate();
            }
        }
        public get scale9GridY():number{
            if (this._scale9GridRect)return this._scale9GridRect.y;
            return 0;
        }
        /**
         * Sets the width of the bitmap's scale9Grid.
         */
        public set scale9GridWidth(value:number){
            if (this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
            if(this._scale9GridRect.width != value){
                this._scale9GridRect.width = value;
                this.invalidate();
            }
        }
        public get scale9GridWidth():number{
            if (this._scale9GridRect)return this._scale9GridRect.width;
            return 0;
        }
        /**
         * Sets the height of the bitmap's scale9Grid.
         */
        public set scale9GridHeight(value:number){
            if (this._scale9GridRect == null) this._scale9GridRect = new egret.Rectangle();
            if(this._scale9GridRect.height != value){
                this._scale9GridRect.height = value;
                this.invalidate();
            }
        }
        public get scale9GridHeight():number{
            if (this._scale9GridRect)return this._scale9GridRect.height;
            return 0;
        }

        /**
         * 九宫设置的区域
         * @returns {egret.Rectangle}
         */
        public get scale9GridRect():egret.Rectangle{
            return this._scale9GridRect;
        }

        public set scale9GridRect(rect:egret.Rectangle) {
            this._scale9GridRect = rect;
        }
        /**
         * 绘制
         */
		public draw():void{
			//super.draw();
            //if (this._data)console.log("@@Button draw _text=" + this._text + ", selected=" + this.selected + ", data=" + this._data.id);
            //初始化显示对象和数据
            if (!this._initDisplayData){
                if (!this._texture){
                    if (Button.DEFAULT_TEXTURE == null){
                        this.initDefaultTexture();
                    }
                    this._texture = Button.DEFAULT_TEXTURE;
                }
                this.splitTextureSource();//切割成态数对应的材质
            }
            if (this._imgDisplay == null) return;
            //一态的时候，第二态用第一态的资源 但是alpha 为0.8 scale为0.9
            if(this.statesLength == 1 && this._currentState == Button.STATE_DOWN){
                this._imgDisplay.texture = this._textureDict[Button.STATE_UP];
            }else{
                this._imgDisplay.texture = this._textureDict[this._currentState];
            }

            if (this.scale9GridEnable && this.scale9GridRect != null){//九宫拉伸设置
                this._imgDisplay.scale9Grid = this.scale9GridRect;
            } else {
                this._imgDisplay.scale9Grid = null;
            }
            this._imgDisplay.fillMode = this._fillMode;
            this._imgDisplay.width = this.width;
            this._imgDisplay.height = this.height;
            this._imgDisplay.anchorOffsetX = this._imgDisplay.width / 2;
            this._imgDisplay.anchorOffsetY = this._imgDisplay.height / 2;
            this._imgDisplay.x = this._imgDisplay.width / 2;
            this._imgDisplay.y = this._imgDisplay.height / 2;
            //console.log("Button.draw 1111 this.width=" + this.width + ", this.height=" + this.height);

			if(this._textureLabel != null){//文字图片显示
                if (this._imgLabel == null){
                    this._imgLabel = new egret.Bitmap();
                    this._imgLabel.touchEnabled = false;
                    this.addChild(this._imgLabel);
                }
                this._imgLabel.texture = this._textureLabel;

                if(this._labelMarginLeftEnable){
                    this._imgLabel.x = this._labelMarginLeft;
                }else{
                    this._imgLabel.x = (this.width - this._imgLabel.width)/2;
                }
                if (this._labelMarginTopEnable) {
                    this._imgLabel.y = this._labelMarginTop;
                } else {
                    this._imgLabel.y = (this.height - this._imgLabel.height)/2;
                }
			}
			if(this._textureIcon != null){//图标显示
                if (this._imgIcon == null){
                    this._imgIcon = new egret.Bitmap(null);
                    this._imgIcon.touchEnabled = false;
                    this.addChild(this._imgIcon);
                }
                this._imgIcon.texture = this._textureIcon;

                if(this._iconMarginLeftEnable){
                    this._imgIcon.x = this._iconMarginLeft;
                }else{
                    this._imgIcon.x = (this.width - this._imgIcon.width)/2;
                }
                if (this._iconMarginTopEnable) {
                    this._imgIcon.y = this._iconMarginTop;
                } else {
                    this._imgIcon.y = (this.height - this._imgIcon.height)/2;
                }
			}
			if(this._label){
                if (!this._label.parent) this.addChild(this._label);
                this._label.text = this._text;
                this._label.fontSize = this._fontSize;
                this._label.fontName = this._fontName;
                this._label.bold = this._labelBold;
                this._label.italic = this._labelItalic;
                this._label.lineSpacing = this._labelLineSpacing;
                this._label.multiline = this._labelMultiline;
                this._label.stroke = this._labelStroke;
                this._label.strokeColor = this._labelStrokeColor;
                this._label.onInvalidate(null);//立即生效,这样下面的数据才准

                if(this._labelMarginLeftEnable){
                    this._label.x = this._labelMarginLeft;
                }else{
                    this._label.x = (this.width - this._label.width)/2;
                    //console.log("Button.draw 222 this.width=" +this.width + ", this._label.width=" + this._label.width);
                }
                if (this._labelMarginTopEnable) {
                    this._label.y = this._labelMarginTop;
                } else {
                    this._label.y = (this.height - this._label.height)/2;
                }
            }
		}

        /**
         * 没有材质,绘制一个默认的材质背景
         */
        private initDefaultTexture():void {
            if (Button.DEFAULT_TEXTURE == null){
                var shape:egret.Shape = new egret.Shape();
                shape.width = this.width;
                shape.height = this.height * 2;
                shape.graphics.beginFill(Style.BUTTON_FACE);
                shape.graphics.drawRect(0, 0 , this.width, this.height);
                shape.graphics.beginFill(0xfff666);
                shape.graphics.drawRect(0, this.height , this.width, this.height);
                //shape.graphics.beginFill(0x33ff66);
                //shape.graphics.drawRect(0, this.height * 2, this.width, this.height);
                shape.graphics.endFill();
                //boder
                shape.graphics.lineStyle(1, 0x000000);
                shape.graphics.drawRect(1, 1 , this.width-2, 2* this.height-2);

                shape.graphics.moveTo(1, this.height-1);
                shape.graphics.lineTo(this.width-2, this.height-1);
                shape.graphics.moveTo(1, this.height + 1);
                shape.graphics.lineTo(this.width-2, this.height + 1);

                var renderTexture:egret.RenderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(shape);
                Button.DEFAULT_TEXTURE = renderTexture;
            }
        }
        /**
         * 切割Texture材质集
         * @param value
         */
        private splitTextureSource():void {
            if (this._texture){
                //console.log("splitTextureSource texture.w=" + this._texture._sourceWidth + ", h=" + this._texture._sourceHeight + ", name=" + this.name)
                this._initDisplayData = true;
                var splietWidth:number = 0;
                var splietHeight:number = 0;
                var textureWidth:number = this._texture.textureWidth;
                var textureHeight:number = this._texture.textureHeight;
                if (this.stateArray.length == 1){
                    splietWidth = textureWidth;
                    splietHeight = textureHeight;
                    this._textureDict[this.stateArray[0]] = this._texture;
                } else {
                    var i:number = 0;
                    var xOffset:number = 0;//this._texture._bitmapX;
                    var yOffset:number = 0;//this._texture._bitmapY;
                    if (this._verticalSplit){
                        splietWidth = textureWidth;
                        splietHeight = textureHeight/this.statesLength;
                    } else {
                        splietWidth = textureWidth/this.statesLength;
                        splietHeight = textureHeight;
                    }
                    var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(this._texture);
                    for (i = 0; i < this.stateArray.length; i++) {
                        if (this._verticalSplit) {
                            this._textureDict[this.stateArray[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random() * 999999) + "_" + this.stateArray[i], xOffset, i * splietHeight + yOffset, splietWidth, splietHeight);
                        } else {
                            this._textureDict[this.stateArray[i]] = spriteSheet.createTexture(this.name + Math.round(Math.random() * 999999) + "_" + this.stateArray[i], i * splietWidth + xOffset, yOffset, splietWidth, splietHeight);
                        }
                    }
                }

                if (this._autoSize){
                    this.width = splietWidth;
                    this.height = splietHeight;
                }
            }
        }
		/**
		 * 设置按钮弹起态皮肤
		 */		
		public set upSkin(value:egret.Texture){
			if(!this.isStateExist(Button.STATE_UP)){
				this.stateArray.push(Button.STATE_UP);
			}
			this._textureDict[Button.STATE_UP] = value;
			this.invalidate();
		}
		public get upSkin():egret.Texture{
			return this._textureDict[Button.STATE_UP];
		}
		/**
		 * 设置按钮悬停态皮肤
		 */		
		public set overSkin(value:egret.Texture){
			if(!this.isStateExist(Button.STATE_OVER)){
				this.stateArray.push(Button.STATE_OVER);
			}
            this._textureDict[Button.STATE_OVER] = value;
			this.invalidate();
		}
		public get overSkin():egret.Texture{
			return this._textureDict[Button.STATE_OVER];
		}
		/**
		 * 设置按钮按下态皮肤
		 */	
		public set downSkin(value:egret.Texture){
			if(!this.isStateExist(Button.STATE_DOWN)){
				this.stateArray.push(Button.STATE_DOWN);
			}
            this._textureDict[Button.STATE_DOWN] = value;
			this.invalidate();
		}
		public get downSkin():egret.Texture{
			return this._textureDict[Button.STATE_DOWN];
		}
		/**
		 * 设置按钮禁用态皮肤
		 */	
		public set disableSkin(value:egret.Texture){
			if(!this.isStateExist(Button.STATE_DISABLE)){
				this.stateArray.push(Button.STATE_DISABLE);
			}
            this._textureDict[Button.STATE_DISABLE] = value;
			this.invalidate();
		}
		public get disableSkin():egret.Texture{
			return this._textureDict[Button.STATE_DISABLE];
		}
		/**
		 * 
		 * @param state
		 * @return false,不存在;true,存在.
		 * 
		 */		
		private isStateExist(state:string):boolean{
			if(this.stateArray.indexOf(state) != -1){
				return true;
			}
			return false;
		}
		/**
		 * 设置按钮文本
		 */		
		public set label(value:string){
			this._text = value;
			if(this._label){
				this._label.text = this._text;
			}
			this.invalidate();
		}
       	public get label():string{
			return this._text;
		}
		
        public set selected(value:boolean) {
            this._selected = value;
            this._currentState = (this._selected?Button.STATE_DOWN:Button.STATE_UP);
            //if (this._data)console.log("button data=" + this._data.id + ", selected=" + this._selected);
            if (this._selected && StringUtil.isUsage(this._toggleGroup)) {
                var myevent:MyEvent = MyEvent.getEvent(Button.TOGGLE_PREFIX + this._toggleGroup);
                myevent.addItem("caller", this);
                myevent.addItem("group", this._toggleGroup);
                myevent.send();
            }
            this.invalidate();
        }
        public get selected():boolean {
            return this._selected;
        }
		/**
		 * 设置按钮可用状态
		 * <p>在预设基础下修改状态数组长度</p>
		 * <p>[STATE_UP, STATE_OVER, STATE_DOWN, STATE_DISABLE, STATE_TOGGLE]</p>
		 * @param value 长度值
		 */		
		public set statesLength(value:number){
			value = value < 0?1:value;
            //if (this.stateArray.length == value) return;
            //this.stateArray.length = 0;
            switch(value) {
                case 1:
        			this.stateArray = [Button.STATE_UP];//一态的时候，第二态用第一态的资源 但是alpha 为0.8 scale为0.9
                    break;
                case 2:
        			this.stateArray = [Button.STATE_UP, Button.STATE_DOWN];
                    break;
                case 3:
        			this.stateArray = [Button.STATE_UP, Button.STATE_OVER, Button.STATE_DOWN];
                    break;
                case 4:
        			this.stateArray = [Button.STATE_UP, Button.STATE_OVER, Button.STATE_DOWN, Button.STATE_DISABLE];
                    break;
            }
            this._initDisplayData = false;
            this.invalidate();
		}
		public get statesLength():number{
			return this.stateArray.length;
		}
		/**
		 * Sets the bitmapData of the bitmap.
		 */
		public set imgLabel(value:egret.Texture){
            if (this._textureLabel != value) {
                this._textureLabel = value;
    			this.invalidate();
            }
		}
		
		public get imgLabel():egret.Texture{
			return this._textureLabel;
		}
		/**
		 * Sets the bitmapData of the imgIcon.
		 */
        public set imgIcon(value:egret.Texture){
            if (this._textureIcon != value) {
                this._textureIcon = value;
    			this.invalidate();
            }
		}
		public get imgIcon():egret.Texture{
			return this._textureIcon;
		}
        /**
         * 设置文字文本的颜色
         */
        public set labelColor(value:number){
            if (this._labelColor != value) {
    			this._labelColor = value;
                if (this._label)this._label.color = value;
                this.invalidate();
            }
        }
        public get labelColor():number{
			return this._labelColor;
		}
		/**
		 * 设置文本字体 
		 * @param value
		 * 
		 */		
		public set fontName(value:string){
            if (this._fontName != value) {
                this._fontName = value;
    			this.invalidate();
            }
		}
		public get fontName():string{
			return this._fontName;
		}
		/**
		 * 设置文本字体大小 
		 * @param value
		 * 
		 */		
		public set fontSize(value:number){
            if (this._fontSize != value) {
                this._fontSize = value;
    			this.invalidate();				
            }
		}
		public get fontSize():number{
			return this._fontSize;
		}
        /**
        * 是否设置label显示左边距(即label在button中的x坐标)
        */
        public set labelMarginLeft(value:number){
            if (this._labelMarginLeft != value){
                this._labelMarginLeft = value;
                this.invalidate();
            }
        }
		public get labelMarginLeft():number{
			return this._labelMarginLeft;
		}

        public set labelMarginLeftEnable(value:boolean){
            if (this._labelMarginLeftEnable != value) {
                this._labelMarginLeftEnable = value;
                this.invalidate();
            }
        }
        public get labelMarginLeftEnable():boolean{
            return this._labelMarginLeftEnable;
        }

        public set labelMarginTop(value:number){
            if (this._labelMarginTop != value){
                this._labelMarginTop = value;
                this.invalidate();
            }
        }

        public get labelMarginTop():number{
            return this._labelMarginTop;
        }

        public set labelMarginTopEnable(value:boolean){
            if (this._labelMarginTopEnable != value) {
                this._labelMarginTopEnable = value;
                this.invalidate();
            }
        }
        public get labelMarginTopEnable():boolean{
            return this._labelMarginTopEnable;
        }
		
		public set iconMarginLeft(value:number){
            if (this._iconMarginLeft != value) {
    			this._iconMarginLeft = value;
    			this.invalidate();
            }
		}
		public get iconMarginLeft():number{
			return this._iconMarginLeft;
		}

        public set iconMarginLeftEnable(value:boolean){
            if (this._iconMarginLeftEnable != value) {
                this._iconMarginLeftEnable = value;
                this.invalidate();
            }
        }
        public get iconMarginLeftEnable():boolean{
            return this._iconMarginLeftEnable;
        }
        public set iconMarginTop(value:number){
            if (this._iconMarginTop != value) {
                this._iconMarginTop = value;
                this.invalidate();
            }
        }
        public get iconMarginTop():number{
            return this._iconMarginTop;
        }
        public set iconMarginTopEnable(value:boolean){
            if (this._iconMarginTopEnable != value) {
                this._iconMarginTopEnable = value;
                this.invalidate();
            }
        }
        public get iconMarginTopEnable():boolean{
            return this._iconMarginTopEnable;
        }
        /**
         * 设置按钮是否按照材质的宽高设置
         * true:按照切割后的材质,设置按钮的宽和高
         * false:根据按钮本身的宽和高设置材质的宽高
         * @param value
         */
		public set autoSize(value:boolean){
            if (this._autoSize != value) {
    			this._autoSize = value;
    			this.invalidate();
            }
		}
		public get autoSize():boolean{
			return this._autoSize;
		}

        public set toggleGroup(value:string){
            if (StringUtil.isUsage(this._toggleGroup)){//旧的group
                EventManager.removeEventListener(Button.TOGGLE_PREFIX + this._toggleGroup, this.onEventToggle, this);
            }
            this._toggleGroup = value;//新的group
            if(StringUtil.isUsage(this._toggleGroup)){
                EventManager.addEventListener(Button.TOGGLE_PREFIX + this._toggleGroup, this.onEventToggle, this);
            }
        }

        public get toggleGroup():string {
            return this._toggleGroup;
        }
        private onEventToggle(event:MyEvent):void {
            if (StringUtil.isUsage(this._toggleGroup) && event.getItem("group") == this._toggleGroup && event.getItem("caller") != this){
                //console.log("0000 onEventToggle group=" + this._toggleGroup + ", data=" + this._data.id);
                this._selected = false;
                this._currentState = Button.STATE_UP;
                this.invalidate();
            }
        }
        public setSize(w:number, h:number):void {
            super.setSize(w,h);
            this.autoSize = false;
        }

        /**
         * 初始化声音对象,并播放声音
         */
        private onPlaySound():void {
            if (easy.StringUtil.isUsage(this._soundName)) {
                easy.Sound.play(this._soundName);
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
        public set drawDelay(delay:boolean) {
            this._setDrawDelay(delay);
            if (this._label)this._label.drawDelay = delay;
        }
        /**
         * label 加粗
         * @param value
         */
        public set labelBold(value:boolean){
            if (this._labelBold != value) {
                this._labelBold = value;
                this.invalidate();
            }
        }
        public get labelBold():boolean{
            return this._labelBold;
        }

        /**
         * label 斜体
         * @param value
         */
        public set labelItalic(value:boolean){
            if (this._labelItalic != value) {
                this._labelItalic = value;
                this.invalidate();
            }
        }
        public get labelItalic():boolean{
            return this._labelItalic;
        }

        /**
         * label 行间距
         * @param value
         */
        public set labelLineSpacing(value:number){
            if (this._labelLineSpacing != value) {
                this._labelLineSpacing = value;
                this.invalidate();
            }
        }
        public get labelLineSpacing():number{
            return this._labelLineSpacing;
        }
        /**
         * label 多行显示
         * @param value
         */
        public set labelMultiline(value:boolean){
            if (this._labelMultiline != value) {
                this._labelMultiline = value;
                this.invalidate();
            }
        }
        public get labelMultiline():boolean{
            return this._labelMultiline;
        }
        /**
         * label 描边厚度
         * @param value
         */
        public set labelStroke(value:number){
            if (this._labelStroke != value) {
                this._labelStroke = value;
                this.invalidate();
            }
        }
        public get labelStroke():number{
            return this._labelStroke;
        }
        /**
         * label 描边颜色
         * @param value
         */
        public set labelStrokeColor(value:number){
            if (this._labelStrokeColor != value) {
                this._labelStrokeColor = value;
                this.invalidate();
            }
        }
        public get labelStrokeColor():number{
            return this._labelStrokeColor;
        }
        /**
         * 像素级检测
         * @param value
         */
        public set testPixelEnable(value:boolean){
            this._testPixelEnable = value;
        }
        public get testPixelEnable():boolean{
            return this._testPixelEnable;
        }
        /**
         * 获取xy位置的像素值,xy是舞台值
         * @param x 舞台坐标
         * @param y 舞台坐标
         */
        public getPixel32( x:number,y:number ):Array<number>{
            //底图
            var locolPoint:egret.Point = this.globalToLocal(x,y);
            var found:boolean
            var datas:Array<number> = null;
            if (this._imgDisplay && this._imgDisplay.texture){
                datas =  this._imgDisplay.texture.getPixel32(locolPoint.x, locolPoint.y);
            }
            for(var i:number = 0; i < datas.length; i++){
                if (datas[i] > 0 ) {
                    found = true;
                    return datas;
                }
            }
            //icon
            if (this._imgIcon && this._imgIcon.texture){
                datas =  this._imgIcon.texture.getPixel32(x,y);
            }
            for(var i:number = 0; i < datas.length; i++){
                if (datas[i] > 0 ) {
                    found = true;
                    return datas;
                }
            }

            //label
            if (this._imgLabel && this._imgLabel.texture){
                datas =  this._imgLabel.texture.getPixel32(x,y);
            }
            for(var i:number = 0; i < datas.length; i++){
                if (datas[i] > 0 ) {
                    found = true;
                    return datas;
                }
            }
            return [];
        }
        /**
         * 检测xy位置的像素值是否透明,xy是舞台值
         * @param x 舞台值
         * @param y 舞台值
         * @return true:有像素值, false:无像素值
         */
        public testPixel32(x:number,y:number):boolean{
            var datas:Array<number> = this.getPixel32(x, y);
            for(var i:number = 0; i < datas.length; i++){
                if (datas[i] > 0 ) {
                    return true;
                }
            }
            return false;
        }
    }
}