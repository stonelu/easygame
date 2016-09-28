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

	export class Label extends Group{
		private _text:string = "";//文本内容
        private _textField:egret.TextField = null;
        
        private _fontSize:number = Style.fontSize;//字体大小
        private _color:number = Style.LABEL_TEXT;//字体颜色
        private _fontName:string = Style.fontName;//字体名称
        private _hAlign:string = egret.HorizontalAlign.LEFT;
        private _vAlign:string = egret.VerticalAlign.MIDDLE;
        private _bold:boolean = false;
        private _italic:boolean = false;
		private _lineSpacing:number = 0;//行间距
		private _multiline:boolean = false;//多行显示
        private _stroke:number = 0;
		private _strokeColor:number = 0x003350;
		private _html:boolean = false;

		private _autoSize:boolean = false;//根据文字自动调整Label的尺寸

		public _link:Function = null;
        public constructor(drawDelay:boolean = false) {
            super(drawDelay);
        }
        public initData():void {
            super.initData();
        }
        /**
         * 初始化主场景的组件,加入场景时,主动调用一次
         * 子类覆写该方法,添加UI逻辑
         */  
        public createChildren():void {
			super.createChildren();
			if (!this._autoSize)this.setSize(Style.TEXTINPUT_WIDTH, Style.TEXTINPUT_HEIGHT);
            this._textField = new egret.TextField();
			this._textField.addEventListener(egret.Event.CHANGE, this.onChangeHdl, this);
			this.addChild(this._textField);
			this.invalidate();
		}
		/**
		 * Called when the text in the text field is manually changed.
		 */
		public onChangeHdl(event:Event):void{
			this._text = this._textField.text;
		}
		
        /**
         * 文本内容
         */ 
        public get text():string {
            return this._text;
        }

        public set text(value:string) {
			if(this._text != value){
	            this._text = value;
				if(this._text == null) this._text = "";
				this.invalidate();
			}
        }

        /**
         * 文本内容显示对象
         */ 
        public getTextField():egret.TextField {
            return this._textField;
        }
		///////////////////////////////////
		// public methods
		///////////////////////////////////
		/**
		 * Draws the visual ui of the component.
		 */
		public draw():void{
			super.draw();
			if (this._textField == null) return;
			//console.log("@@label draw text=" + this._text);
            if (this._fontName != null){
				this._textField.fontFamily = this.fontName;
			}
			if (this._color >= 0) this._textField.textColor = this._color;
			if (this._fontSize > 0) this._textField.size = this._fontSize;
			this._textField.bold = this._bold;
			this._textField.italic = this._italic;
			this._textField.text = this._text;
			this._textField.multiline = this._multiline;
			this._textField.lineSpacing = this._lineSpacing;
            this._textField.stroke = this._stroke;
            this._textField.strokeColor = this._strokeColor;
            if (this._autoSize){
				this.height = this._textField.measuredHeight;
				this.width = this._textField.measuredWidth;
			} else {
				this._textField.width = this.width;
				//this._textField.height = this.height;

                if (this._vAlign == egret.VerticalAlign.MIDDLE){
                    this._textField.y = (this.height - this._textField.height)/2;
                } else if (this._vAlign == egret.VerticalAlign.BOTTOM){
                    this._textField.y = this.height - this._textField.height;
                } else {
                    this._textField.y = 0;
                }
			}
            this._textField.textAlign = this._hAlign;
            this._textField.verticalAlign = this._vAlign;
		}

		/**
		 * 设置文本是否斜体
		 * @param value
		 *
		 */
		public set italic(value:boolean){
			if(this._italic != value){
				this._italic = value;
				this.invalidate();
			}
		}
		public get italic():boolean{
			return this._italic;
		}
		/**
		 * 设置文本是否粗体
		 * @param value
		 *
		 */
		public set bold(value:boolean){
			if(this._bold != value){
				this._bold = value;
				this.invalidate();
			}
		}
		public get bold():boolean{
			return this._bold;
		}
		/**
		 * 设置文本字体 
		 * @param value
		 * 
		 */		
		public set fontName(value:string){
			if(this._fontName != value){
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
		public set fontSize(value:any){
			if(this._fontSize != value){
                this._fontSize = value;
				this.invalidate();				
			}
		}
		public get fontSize():any{
			return this._fontSize;
		}
		/**
		 * 设置文本颜色 
		 * @param value
		 * 
		 */		
		public set color(value:any){
			if(this._color != value){
                this._color = value;
				this.invalidate();				
			}
		}
		public get color():any{
			return this._color;
		}
		/**
		 * 设置多行间距，外部设置一般为正数
		 */		
		public get lineSpacing():number{
			return this._lineSpacing;
		}
		
		public set lineSpacing(value:number){
			if(this._lineSpacing != value){
				this._lineSpacing = value;
				this.invalidate();
			}
		}
		/**
		 * 设置多行间距，外部设置一般为正数
		 */
		public get multiline():boolean{
			return this._multiline;
		}

		public set multiline(value:boolean){
			if(this._multiline != value){
				this._multiline = value;
				this.invalidate();
			}
		}
		/**
		 * 文字描边
		 */
		public get stroke():number{
			return this._stroke;
		}

		public set stroke(value:number){
			if(this._stroke != value){
				this._stroke = value;
				this.invalidate();
			}
		}
		/**
		 * 文字描边颜色
		 */
		public get strokeColor():number{
			return this._strokeColor;
		}

		public set strokeColor(value:number){
			if(this._strokeColor != value){
				this._strokeColor = value;
				this.invalidate();
			}
		}
		/**
		 * 是否自动计算文字的尺寸来设置label尺寸
		 */
		public get autoSize():boolean{
			return this._autoSize;
		}

		public set autoSize(value:boolean){
			if(this._autoSize != value){
				this._autoSize = value;
				this.invalidate();
			}
		}
				/**
		 * 水平对齐设置
		 * 默认egret.HorizontalAlign.LEFT;
		 */
		public get hAlign():string{
			return this._hAlign;
		}

		public set hAlign(value:string){
			if(this._hAlign != value){
				this._hAlign = value;
				this.invalidate();
			}
		}
		/**
		 * 竖直对齐设置
		 * 默认egret.VerticalAlign.MIDDLE;
		 */
		public get vAlign():string{
			return this._vAlign;
		}

		public set vAlign(value:string){
			if(this._vAlign != value){
				this._vAlign = value;
				this.invalidate();
			}
		}
    }
}