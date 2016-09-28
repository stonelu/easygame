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

	export class TextInput extends Group{
		public _textField:egret.TextField = null;
		public _text:string = "";
		public _password:boolean = false;
		private _fontName:string = Style.fontName;//字体
		private _fontSize:number = Style.fontSize;//字体大小
		private _fontColor:number = Style.TEXTINPUT_COLOR;//字体颜色

		private _hAlign:string = egret.HorizontalAlign.LEFT;
		private _vAlign:string = egret.VerticalAlign.MIDDLE;
		private _bold:boolean = false;
		private _italic:boolean = false;
		private _lineSpacing:number = 0;//行间距
		private _multiline:boolean = false;//多行显示
		private _stroke:number = 0;
		private _strokeColor:number = 0;
        private _wordWrap:boolean = true;//自动换行

		public constructor(drawDelay:boolean = false){
			super(drawDelay);
		}
		public createChildren():void{
			super.createChildren();
			this.setSize(Style.TEXTINPUT_WIDTH, Style.TEXTINPUT_HEIGHT);
			this.bgColor = Style.INPUT_TEXT;
			this.clip = false;
			this.touchEnabled = true;
			this._textField = new egret.TextField();
			this._textField.height = this.height;
			this._textField.width = this.width;
			this._textField.displayAsPassword = false;
			this._textField.type = egret.TextFieldType.INPUT;
			this._textField.addEventListener(egret.Event.CHANGE, this.onChangeHdl, this);
			this._textField.touchEnabled = true;
			this.addChild(this._textField);
		}
		/**
		 * 文字输入变化处理
		 */
		public onChangeHdl(event:egret.Event):void{
			this._text = this._textField.text;
			//console.log("TextInput Change text=" + this._text);
			this.invalidate();
		}
		/**
		 * 返回文字输入对象
		 */
		public getTextField():egret.TextField{
			return this._textField;
		}
		/**
		 * 绘制组件内容
		 */
		public draw():void{
			super.draw();
			//console.log("TextInput draw=" + this._textField + ", text=" + this._textField.type);
            if (!this._textField) return;
			if (this._fontName != null){
				this._textField.fontFamily = this._fontName;
			}
			if (this._fontColor >= 0) this._textField.textColor = this._fontColor;
			if (this._fontSize > 0) this._textField.size = this._fontSize;
			this._textField.textAlign = this._hAlign;
			this._textField.verticalAlign = this._vAlign;
			this._textField.bold = this._bold;
			this._textField.italic = this._italic;
			this._textField.multiline = this._multiline;
			this._textField.lineSpacing = this._lineSpacing;
			this._textField.stroke = this._stroke;
			this._textField.strokeColor = this._strokeColor;
			this._textField.width = this.width;
			this._textField.height = this.height;
			this._textField.displayAsPassword = this._password;
			this._textField.text = this._text;
            this._textField.wordWrap = this._wordWrap;
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
		 * 设置文本输入为密码输入,采用掩码显示输入的内容
		 * @param value
		 * 
		 */		
		public set password(value:boolean){
            if (this._password != value) {
    			this._password = value;
    			this.invalidate();
            }
		}
		public get password():boolean {
			return this._password;
		}
		/**
		 * 设置文本字体大小
		 * @param value
		 *
		 */
		public set fontSize(value:any){
            if (this._fontSize != value) {
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
		public set fontColor(value:number){
            if (this._fontColor != value) {
    			this._fontColor = value;
    			this.invalidate();
            }
		}
		public get fontColor():number{
			return this._fontColor;
		}
		/**
		 * 显示和设置文字
		 */
		public set text(t:string){
			if(this._text != t){
				this._text = t;
				this.invalidate();
			}
		}
		public get text():string{
			return this._text;
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
		 * 设置自动换行
		 */
		public get wordWrap():boolean{
			return this._wordWrap;
		}

		public set wordWrap(value:boolean){
			if(this._wordWrap != value){
				this._wordWrap = value;
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
		 * 文字水平对齐方式
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
		 * 文字竖直对齐方式
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
        public setFocus(){
            if(this._textField){
                this._textField.setFocus();
            }
        }
	}
}