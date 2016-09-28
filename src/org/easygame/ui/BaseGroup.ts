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
	 * 简单的对DisplayObjectContainer进行扩展
	 * 加入基础布局的算法
	 */
	export class BaseGroup extends egret.DisplayObjectContainer {
		private _isAddedToStage:boolean = false;//是否已加入过显示列表中,可用来判断各组件是否已经具备显示赋值的作用
		private _top:number = 0;
		private _topEnabled:boolean = false;
		private _left:number = 0;
		private _leftEnabled:boolean = false;
		private _bottom:number = 0;
		private _bottomEnabled:boolean = false;
		private _right:number = 0;
		private _rightEnabled:boolean = false;
		private _horizontalEnabled:boolean = false;
		private _horizontalCenter:number = 0;
		private _verticalEnabled:boolean = false;
		private _verticalCenter:number = 0;
        //原点/注册点剧中
        protected _registryPointEnabled:boolean = false;
		protected _registryOffsetX:number = 0;
		protected _registryOffsetY:number = 0;
		public _data:any = null;//可携带的数据
		private _enabled:boolean = true;//不可用状态
        //xy原点偏移比例
        private _anchorEnabled:boolean = false;
        private _anchorX:number = 0;
        private _anchorY:number = 0;

        protected _hasInvalidatePosition:boolean = false;//是否已经标记重新计算位置布局
        /**
         * 延迟绘制,使用在easy ui生成的代码,等待到材质validation后,再进行绘制渲染
         */
        private _drawDelay:boolean = false;
        private _hasInvalidate:boolean = false;//是否下一帧重绘

        public constructor(drawDelay:boolean = false) {
			super();

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onFirstAddToStage, this);
            this._drawDelay = drawDelay;
            //console.log("this._drawDelay=" + this._drawDelay)
		}
		/**
		 * 第一次加入场景的时候会运行该方法
		 */
		public onFirstAddToStage(event:Event):void {
			this._isAddedToStage = true;
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onFirstAddToStage, this);
			this.createChildren();//先创建
			this.initData();
            //console.log("222222this._drawDelay=" + this._drawDelay)
		}

		/**
		 * 初始化一些必要的逻辑数据
		 * 这个方法是在第一次加入stage的时候,做调用
		 */
		public initData():void {
		}
        /**
         * 初始化主场景的组件
		 * 这个方法在对象new的时候就调用,因为有些ui必须在加入stage之前就准备好
         * 子类覆写该方法,添加UI逻辑
         */
        public createChildren():void {
			this.touchEnabled = false;//默认不接受事件
			if (this.width == 0) this.width = 100;
			if (this.height == 0) this.height = 100;
        }

        /**
         * 覆写width方法,在width改变的时候,做逻辑运算
         * @param w
         */
		public set width(w:number){
			if(w > 0){
				super.$setWidth(w);
                if (this._anchorX != 0) this.anchorOffsetX = w * this._anchorX;
                this.onInvalidatePosition();
                this.invalidate();
            }
        }

		public get width():number{
			return this.$getWidth();
		}

        /**
         * 覆写height方法,在height改变的时候,做逻辑运算
         * @param h
         */
        public set height(h:number){
            if(h > 0){
                super.$setHeight(h);
                if (this._anchorY != 0) this.anchorOffsetY = h * this._anchorY;
                this.onInvalidatePosition();
                this.invalidate();
			}
		}
		public get height():number {
			return this.$getHeight();
		}

        /**
         * Moves the component to the specified position.
         * @param xpos the x position to move the component
         * @param ypos the y position to move the component
         */
        public move(xpos:number, ypos:number):void {
            this.x = xpos;;
            this.y = ypos;;
        }
        /**
         * Sets the size of the component.
         * @param w The width of the component.
         * @param h The height of the component.
         */
        public setSize(w:number, h:number):void {
			if(this.width != w || this.height != h) {
				this.width = w;
				this.height = h;
			}
        }

		///////////////////////////////////
		// 组件相对布局设置
		///////////////////////////////////
		public get top():number{
			return this._top;
		}
		/**
		 * 设置顶距
		 */
		public set top(value:number){
			if(this._top != value){
				this._top = value;
				if (this._topEnabled)this.onInvalidatePosition();
			}
		}

		public get topEnabled():boolean{
			return this._topEnabled;
		}
		/**
		 * 顶距可用设置
		 */
		public set topEnabled(value:boolean){
			this._topEnabled = value;
			this.onInvalidatePosition();
		}
		/**
		 * 设置左距
		 */
		public get left():number{
			return this._left;
		}

		public set left(value:number){
			if(this._left != value){
				this._left = value;
				if (this._leftEnabled)this.onInvalidatePosition();
			}
		}

		public get leftEnabled():boolean{
			return this._leftEnabled;
		}
		/**
		 * 设置左距可用
		 */
		public set leftEnabled(value:boolean){
			this._leftEnabled = value;
			this.onInvalidatePosition();
		}

		public get bottom():number{
			return this._bottom;
		}
		/**
		 * 设置底距
		 */
		public set bottom(value:number){
			if(this._bottom != value){
				this._bottom = value;
				if (this._bottomEnabled)this.onInvalidatePosition();
			}
		}

		public get bottomEnabled():boolean{
			return this._bottomEnabled;
		}
		/**
		 * 设置底距可用
		 */
		public set bottomEnabled(value:boolean){
			this._bottomEnabled = value;
			this.onInvalidatePosition();
		}

		public get right():number{
			return this._right;
		}
		/**
		 * 设置右距
		 */
		public set right(value:number){
			if(this._right != value){
				this._right = value;
				if (this._rightEnabled)this.onInvalidatePosition();
			}
		}

		public get rightEnabled():boolean{
			return this._rightEnabled;
		}
		/**
		 * 设置右距可用
		 */
		public set rightEnabled(value:boolean){
			this._rightEnabled = value;
			this.onInvalidatePosition();
		}
		public get horizontalEnabled():boolean{
			return this._horizontalEnabled;
		}
		/**
		 * 设置水平居中可用
		 */
		public set horizontalEnabled(value:boolean){
			this._horizontalEnabled = value;
			this.onInvalidatePosition();
		}

		public get horizontalCenter():number{
			return this._horizontalCenter;
		}
		/**
		 * 设置水平居中相对位置
		 */
		public set horizontalCenter(value:number){
			if(this._horizontalCenter != value){
				this._horizontalCenter = value;
				this.onInvalidatePosition();
			}
		}

		public get verticalEnabled():boolean{
			return this._verticalEnabled;
		}
		/**
		 * 设置竖直居中可用
		 */
		public set verticalEnabled(value:boolean){
			if (this._verticalEnabled != value){
				this._verticalEnabled = value;
				this.onInvalidatePosition();
			}
		}

		public get verticalCenter():number{
			return this._verticalCenter;
		}
		/**
		 * 设置竖直居中相对位置
		 */
		public set verticalCenter(value:number){
			if(this._verticalCenter != value){
				this._verticalCenter = value;
				this.onInvalidatePosition();
			}
		}

        public get registryPointEnabled():boolean{
            return this._registryPointEnabled;
        }
        /**
         * 设置注册点居中可用
         */
        public set registryPointEnabled(value:boolean){
            if (this._registryPointEnabled != value){
                this._registryPointEnabled = value;
                this.onInvalidatePosition();
            }
        }

        /**
         * 设置是否下一帧计算相对位置
         */
        public onInvalidatePosition():void{//重新计算布局位置
            //SystemHeartBeat.addEventListener(this.onHeartBeatInvalidate, 1, 1);
            //console.log("onInvalidatePosition000 name=" + this.name);
            //if (this._drawDelay) return;
            if(!this._hasInvalidatePosition){
                //console.log("onInvalidatePosition111 name=" + this.name);
                this._hasInvalidatePosition = true;
                this.addEventListener(egret.Event.ENTER_FRAME, this.resetPosition, this);
                for (var i:number = 0; i < this.numChildren; i++) {
                    if (this.getChildAt(i) instanceof BaseGroup)(<BaseGroup><any> (this.getChildAt(i))).onInvalidatePosition();
                }
            }
        }
        /**
		 * 容器相对位置刷新
		 */
		public resetPosition():void{
            //console.log("resetPosition name=" + this.name);
            var p:egret.DisplayObject = this.parent;
			if(p != null){
				var parentWidth:number = p.width;
				var parentHeight:number = p.height;
				var thisWidth:number = this.width;
				var thisHeight:number = this.height;
				//为了保证得到的宽高是数值型,这里进行了严格的检测
				if (parentWidth == NaN || parentWidth == undefined){
					parentWidth = p.width;
					if (parentWidth == NaN || parentWidth == undefined){
						parentWidth = p.measuredWidth;
					}
					if (parentWidth == NaN || parentWidth == undefined){
						parentWidth = 0;
					}
				}
				if (parentHeight == NaN || parentHeight == undefined){
					parentHeight = p.height;
					if (parentHeight == NaN || parentHeight == undefined){
						parentHeight = p.measuredHeight;
					}
					if (parentHeight == NaN || parentHeight == undefined){
						parentHeight = 0;
					}
				}
				if (thisWidth == NaN || thisWidth == undefined){
					thisWidth = this.width;
					if (thisWidth == NaN || thisWidth == undefined){
						thisWidth = this.measuredWidth;
					}
					if (thisWidth == NaN || thisWidth == undefined){
						thisWidth = 0;
					}
				}
				if (thisHeight == NaN || thisHeight == undefined){
					thisHeight = this.height;
					if (thisHeight == NaN || thisHeight == undefined){
						thisHeight = this.measuredHeight;
					}
					if (thisHeight == NaN || thisHeight == undefined){
						thisWidth = 0;
					}
				}

                var heightChanged:boolean = false;//高度有改变
                var widthChanged:boolean = false;//宽度有改变
                if(this._topEnabled && !this._bottomEnabled){
                    this.y = this._top;
                }else if(this._bottomEnabled && !this._topEnabled){
                    this.y = parentHeight - this._bottom - thisHeight;
                }else if(this._topEnabled && this._bottomEnabled){
                    this.y = this._top;
                    thisHeight = parentHeight - this._top - this._bottom;
                    if (this.height !=  thisHeight) {
                        this.height =  thisHeight;
                        for (var i:number = 0; i < this.numChildren; i++) {
                            if (this.getChildAt(i) instanceof BaseGroup)(<BaseGroup><any> (this.getChildAt(i))).onInvalidatePosition();
                        }
                        heightChanged = true;
                    }
                }
                if(this._leftEnabled && !this._rightEnabled){
                    this.x = this._left;
                }else if(this._rightEnabled && !this._leftEnabled){
                    this.x = parentWidth - this._right - thisWidth;
                }else if(this._leftEnabled && this._rightEnabled){
                    this.x = this._left;
                    thisWidth = parentWidth - this._left - this._right;
                    if (this.width !=  thisWidth) {
                        this.width =  thisWidth;
                        for (var i:number = 0; i < this.numChildren; i++) {
                            if (this.getChildAt(i) instanceof BaseGroup)(<BaseGroup><any> (this.getChildAt(i))).onInvalidatePosition();
                        }
                        widthChanged = true;
                    }
                }
                if(this._horizontalEnabled && !widthChanged){//宽度有改变的情况下,水平居中不再生效
                    this.x = (parentWidth - thisWidth)/2 + this._horizontalCenter;
                    //console.log("this._horizontalEnabled=" + this._horizontalEnabled + ", x=" + this._x);
                }
                if(this._verticalEnabled && !heightChanged){//高度有改变的情况下,竖直居中不再生效
                    this.y = (parentHeight - thisHeight)/2 + this._verticalCenter;
                    //console.log("this._verticalEnabled=" + this._verticalEnabled + ", y=" + this._y);
                }
                if (this._registryPointEnabled) {
                    this.x = parentWidth/2 + this._registryOffsetX;
                    this.y = parentHeight/2 + this._registryOffsetY;
                }
				if (this._anchorEnabled){
					this.anchorOffsetX = this._anchorX * this.width;
					this.anchorOffsetY = this._anchorY * this.height;
				}
			}
            this.removeEventListener(egret.Event.ENTER_FRAME, this.resetPosition, this);
            this._hasInvalidatePosition = false;
        }
        
        /**
         * 可设置的携带数据
         */  
        public getData():any {
            return this._data;
        }

        public setData(value:any) {
            this._data = value;
        }

		public get data():any {
			return this._data;
		}

		public set data(value:any) {
			this._data = value;
		}
        
        /**
         * 清理数据
         */  
        public clean():void {
            
        }
        /**
        * 设置enabled状态
        * @return
        */
        public get enabled():boolean {
            return this._enabled;
        }

        public set enabled(value:boolean) {
            this._enabled = value;
        }

		/**
		 * 中心x位置
		 * @returns {number}
		 */
		public get cx():number {
			return this.width/2;
		}
		/**
		 * 中心y位置
		 * @returns {number}
		 */
		public get cy():number {
			return this.height/2;
		}
		/**
		 * 从场景中移除改对象
		 */
		public removeFromParent():void {
			if (this.parent) (<egret.DisplayObjectContainer>this.parent).removeChild(this);
		}

		/**
		 * 返回全局x,y值
		 * @returns {egret.Point}
		 */
		public getGlobalXY():egret.Point{
			var point:egret.Point = new egret.Point(0,0);
			this.localToGlobal(point.x, point.y, point);
			return point;
		}

		/**
		 * 返回实际宽度
		 * @returns {number}
		 */
		public get actualWidth():number{
			return this.width * this.scaleX;
		}
		/**
		 * 返回实际高度
		 * @returns {number}
		 */
		public get actualHeight():number{
			return this.height * this.scaleX;
		}
		
		/**
		 * 获取注册点相对的偏移像素值
		 * 官方很奇葩,修改了注册点后,子组件竟然不是以改注册点的值作为起始xy的0值
		 * 这里计算出实际的偏移值,供大家使用
		 */
		public getRegPoint():egret.Point{
			var regPoint:egret.Point = new egret.Point(0,0);
			if (this.anchorOffsetX != 0) {
				regPoint.x = this.anchorOffsetX;
			}
			if (this.anchorOffsetX != 0) {
				regPoint.y = this.anchorOffsetY;
			}
			return regPoint;
		}
        public invalidate():void{
            if(!this._hasInvalidate && !this._drawDelay){
                //console.log("add invalidate draw")
                this.addEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                this._hasInvalidate = true;
            }
        }
        /**
         * 重绘通知
         */
        public onInvalidate(event:egret.Event):void{
            this.draw();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
            this._hasInvalidate = false;
        }
        public draw():void{
            //console.log("draw name=" + this.name);
        }

		/**
		 * 设置延迟绘制的快关
		 * true:这个期间的draw请求都会被屏蔽
		 * @param delay
		 * @private
		 */
        public _setDrawDelay(delay:boolean) {
            this._drawDelay = delay;
            if (this._drawDelay ) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                this._hasInvalidate = false;
            } else {
                this.invalidate();
            }
        }
        /**
         * 设置延迟draw
         * @param delay
         */
        public set drawDelay(delay:boolean) {
            //console.log("drawDelay=" + delay)
            this._drawDelay = delay;
            if (this._drawDelay ) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onInvalidate, this);
                this._hasInvalidate = false;
            } else {
                this.invalidate();
            }
        }
        public get drawDelay():boolean {
            return this._drawDelay;
        }

		/**
		 * 判断曾经加入过显示列表中
		 * 可以用来判断各属性是否已经准备好显示和使用
		 * @returns {boolean}
		 */
        public get isAddedToStage():boolean {
            return this._isAddedToStage;
        }


        /**
         * 设置x原点偏移比例
         * @param value
         */
        public set anchorX(value:number) {
			if (this._anchorX != value) {
				this._anchorX = value;
				this.onInvalidatePosition();
			}
        }

        public get anchorX():number {
            return this._anchorX;
        }

        /**
         * 设置y原点偏移比例
         * @param value
         */
        public set anchorY(value:number) {
			if (this._anchorY != value) {
				this._anchorY = value;
				this.onInvalidatePosition();
			}
        }

        public get anchorY():number {
            return this._anchorY;
        }
		/**
		 * 设置y原点偏移值
		 * @param value
		 */
		public set anchorEnabled(value:boolean) {
			if (this._anchorEnabled != value) {
				this._anchorEnabled = value;
				this.onInvalidatePosition();
			}
		}

		public get anchorEnabled():boolean {
			return this._anchorEnabled;
		}
        /**
         * 设置注册点y偏移值
         * @param value
         */
        public set registryOffsetX(value:number) {
			if (this._registryOffsetX != value) {
				this._registryOffsetX = value;
				this.onInvalidatePosition();
			}
        }

        public get registryOffsetX():number {
            return this._registryOffsetX;
        }        /**
         * 设置注册点y偏移值
         * @param value
         */
        public set registryOffsetY(value:number) {
			if (this._registryOffsetY != value) {
				this._registryOffsetY = value;
				this.onInvalidatePosition();
			}
        }

        public get registryOffsetY():number {
            return this._registryOffsetY;
        }
    }
}