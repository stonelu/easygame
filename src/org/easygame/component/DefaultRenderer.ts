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

	export class DefaultRenderer extends Group{
		/**
		 * 对应的ui展现
		 */
		public _ui:BaseGroup = null;
		/**
		 * ui资源已准备好
		 * @type {boolean}
		 * @private
		 */
		public _uiResReady:boolean = false;

		public _selected:boolean;
		/**
		 * item render所在的list
		 * @type {null}
		 */
		public list:List = null;

		public constructor(){
			super();
		}
		
		public createChildren():void{
			super.createChildren();
            this.setSize(100, 65);
		}
		/**
		 * 设置数据
		 */
		public set data(value:any){
			this._data = value;
			this.invalidate();
		}
		public get data():any{
			return this._data;
		}
		/**
		 * 刷新
		 */
		public refresh():void {
			this.data = this._data;
		}

		/**
		 * 设置选中
		 */
		public set selected(value:boolean){
			this.setSelected(value);
		}
		public setSelected(value:boolean){
			if (this._selected != value) {
				this._selected = value;
				this.invalidate();
			}
		}
		public get selected():boolean{
			return this._selected;
		}
		/**
		 * 获取ui层的显示对象
		 * @returns {egret.Sprite}
		 */
		public getUI():any {
			return this._ui;
		}
		/**
		 * 设置ui层的显示对象
		 * @param myui
		 */
		public setUI(myui:BaseGroup) {
			this._ui = myui;
			//console.log("!!!view set ui!! 000 this._ui=" + egret.getQualifiedClassName(this._ui));
			if (this._ui) {
				this.addChild(this._ui);
				this.setSize(this._ui.width, this._ui.height);
				//console.log("!!!view set ui!! 1111 this._ui=" + egret.getQualifiedClassName(this._ui));
			}
			this.showBg = false;
		}
		/**
		 * 做ui的销毁
		 * 一般情况下,需要手动调用销毁
		 */
		public destroy():void {
			if (this._ui){
				//if (this._ui.hasOwnProperty("destroy"))this._ui.destroy();
				this._ui = null;
			}
		}
		/**
		 * 首次材质下载完成会调用加载一次,刷新UI皮肤显示
		 * 使用了框架的UI机制,单ui的资源下载完成会调用改方法刷新
		 * 若view中有逻辑使用到ui的素材,应该在这里做素材的赋值
		 */
		public validateNow():void{
			//console.log("clz=" + egret.getQualifiedClassName(this)  + ", validateNow!!")
			if (this._ui && this._ui["validateNow"]) this._ui["validateNow"]();
			this.drawDelay = false;
			if (this._ui)this._ui.drawDelay = false;
		}
	}
}