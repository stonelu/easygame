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
	 * 带有默认背景的容器
	 * 可以设置裁剪区域
	 */
	export class Group extends BaseGroup {
		/**
		 * 是否显示默认样式 ,
		 * 默认为true,显示.
		 */
		public _showBg:boolean = true;
		/**
		 * 默认背景的颜色
		 */
		private _bgColor:number = 0xCCCCCC;
		/**
		 * 默认背景的显示对象
		 */
		public _bgImage:egret.Bitmap = null;
		private _bgTexture:egret.Texture = null;//背景材质
		//默认背景的显示对象九宫拉伸的设定
		private _scale9GridEnable:boolean = false;//九宫拉伸生效
		private _scale9GridRect:egret.Rectangle = null;//九宫拉伸的尺寸
		//private _scaleEnable:Boolean = true;
		private _fillMode:string = "scale";//scale, repeat.
		/**
		 * 默认背景是否带边框
		 */
		private _border:boolean = true;
		/**
		 * 是否将子代剪切到视区的边界,
		 * 默认为true,剪切.
		 */
		private _clip:boolean = false;
		private _touchNonePixel:boolean = false;//没有像素点时是否能触发事件

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
		}
		/**
		 * 默认样式色块颜色值. 
		 */		
		public get bgColor():number{
			return this._bgColor;
		}

		public set bgColor(value:number){
			if(this._bgColor != value && this._showBg){
    			this._bgColor = value;
				this._bgTexture = null;
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
        //public set enabled(value:boolean) {
			//this._enabled = value;
        //    //this.touchEnabled = value;
        //    this.alpha = this.enabled ? 1.0 : 0.5;
        //}

		/**
		 * 设置默认背景是否显示
		 */
		public set showBg(value:boolean){
			if(this._showBg != value){
				this._showBg = value;
				//console.log("!!!Group set showDefaultSkin=" + this._showDefaultSkin)
				this.invalidate();				
			}
		}
		
		public get showBg():boolean{
			return this._showBg;
		}

		/**
		 * 设置剪裁
		 * @param value
		 */
		public set clip(value:boolean){
			if(value != this._clip){
				this._clip = value;
				this.invalidate();
			}
		}
		public get clip():boolean{
			return this._clip;
		}
		/**
		 * 更新显示组件的各项属性,重新绘制显示
		 */
		public draw():void{
			//console.log("Group draw");
			if (this.width == 0 || this.height == 0) return;
            super.draw();
            //console.log("Group draw");
            //console.log("Group draw this._clip=" + this._clip + ", _showBg=" + this._showBg);
			if(this._clip){//剪裁
                var rect:egret.Rectangle = easy.ObjectPool.getByClass(egret.Rectangle);
                if (this.scrollRect) {
                    easy.ObjectPool.recycleClass(this.scrollRect);
                    this.scrollRect = null;
                }
                rect.width = this.width;
                rect.height = this.height;
                rect.x = 0;
                rect.y = 0;
				this.scrollRect = rect;
			}else{
				this.scrollRect = null;
			}
			//console.log("Group draw this._showDefaultSkin=" + this._showDefaultSkin);
            if(this._showBg || (this._touchNonePixel && this.touchEnabled)){
                this.addDefaultSkin();
				if(this._bgImage){
					this._bgImage.visible = true;
					if(this._touchNonePixel && !this._showBg){//如果设置没有像素点能触发事件 并且没有设置默认样式 则设置alpha=0即可
						this._bgImage.alpha = 0;
					}else{
						this._bgImage.alpha = 1;
					}
				}
            } else {
                if(this._bgImage){
                    this._bgImage.visible = false;
					if (this._bgImage.parent) {
						this._bgImage.parent.removeChild(this._bgImage);
					}
                }
            }
		}
        /**
         * 创建背景应用的quad 用于showdefaultskin显示 
         */        
        private addDefaultSkin():void{
			var d:egret.Video
			//console.log("Group addDefaultSkin this.width=" + this.width + ", this.height=" + this.height)
            if (this.width > 0 && this.height > 0) {
                if(this._bgImage == null){
                    this._bgImage = new egret.Bitmap();
				}
				if (this._bgTexture == null){//生成默认材质
					this._bgImage.fillMode = egret.BitmapFillMode.SCALE;//拉伸放大方式铺满
					var shape:egret.Shape = new egret.Shape();
					shape.width = this.width;
					shape.height = this.height;
					shape.graphics.beginFill(this._bgColor, 1);
					shape.graphics.drawRect(0,0, this.width, this.height);
					shape.graphics.endFill();
					if (this._border){
						shape.graphics.lineStyle(1, 0x00ff00, 1);
						shape.graphics.drawRect(0,0, this.width, this.height);
					}
					var renderTexture:egret.RenderTexture = new egret.RenderTexture();
					renderTexture.drawToTexture(shape);
					this._bgTexture = renderTexture;
					this._bgImage.texture = this._bgTexture ;
				} else{
					this._bgImage.texture = this._bgTexture ;
					//TODO 是否要用背景图撑大整个group?
				}
			}
			if (this._bgImage && (this._showBg || (this._touchNonePixel && this.touchEnabled))) {
				if (!this._bgImage.parent)this.addChildAt(this._bgImage, 0);
				if (this._scale9GridEnable){
					this._bgImage.scale9Grid = this._scale9GridRect;
				}
				this._bgImage.width = this.width;
				this._bgImage.height = this.height;
				this._bgImage.fillMode = this._fillMode;
			}
        }
		/**
		 * 默认皮肤的边框显示
		 * true, 显示边框;false,不显示边框.
		 * @param value
		 *
		 */
		public set border(value:boolean){
			if(this._border != value){
				this._border = value;
				this.invalidate();
			}
		}
		public get border():boolean{
			return this._border;
		}

		/**
		 * 获取背景图显示对象
		 * @returns {egret.Bitmap}
		 */
		public getDefaultSkin():egret.Bitmap {
			return this._bgImage;
		}

		/**
		 * 背景的默认材质
		 * 会取代自动绘制的背景图
		 * @param value
		 */
		public set bgTexture(value:egret.Texture){
			if (this._bgTexture != value) {
				this._bgTexture = value;
				this.invalidate();
			}
		}
		public get bgTexture():egret.Texture{
			return this._bgTexture;
		}
		public get touchNonePixel():boolean{
			return this._touchNonePixel;
		}
		/**
		 * 无像素时是否能触发事件
		 */
		public set touchNonePixel(value:boolean){
			if(value != this._touchNonePixel){
				this._touchNonePixel = value;
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
				if (this._scale9GridEnable && this._scale9GridRect == null) {
                    this._scale9GridRect = new egret.Rectangle();
                    this._scale9GridRect.x = 1;
                    this._scale9GridRect.y = 1;
                    this._scale9GridRect.width = 1;
                    this._scale9GridRect.height = 1;
                }
				this.invalidate();
			}
		}
		/**
		 * Sets the x of the bitmap's scale9Grid.
		 */
		public set scale9GridX(value:number){
			if (this._scale9GridRect == null) {
                this._scale9GridRect = new egret.Rectangle();
                this._scale9GridRect.x = 1;
                this._scale9GridRect.y = 1;
                this._scale9GridRect.width = 1;
                this._scale9GridRect.height = 1;
            }
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
			if (this._scale9GridRect == null) {
                this._scale9GridRect = new egret.Rectangle();
                this._scale9GridRect.x = 1;
                this._scale9GridRect.y = 1;
                this._scale9GridRect.width = 1;
                this._scale9GridRect.height = 1;
            }
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
			if (this._scale9GridRect == null) {
                this._scale9GridRect = new egret.Rectangle();
                this._scale9GridRect.x = 1;
                this._scale9GridRect.y = 1;
                this._scale9GridRect.width = 1;
                this._scale9GridRect.height = 1;
            }
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
			if (this._scale9GridRect == null) {
                this._scale9GridRect = new egret.Rectangle();
                this._scale9GridRect.x = 1;
                this._scale9GridRect.y = 1;
                this._scale9GridRect.width = 1;
                this._scale9GridRect.height = 1;
            }
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
    }
}