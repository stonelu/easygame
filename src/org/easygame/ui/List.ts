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

	export class List extends Group{
        /**
         * 消息和方法的映射关系表
         */
        private METHOD_DEF:Object = {};
        private _itemRenderer:any = DefaultRenderer;
        private _itemContainer:BaseGroup = null;
        private _gap:number = 2;
        private _direction:string = Style.VERTICAL;//朝向
        private _dataIndexBegin:number = 0;//显示数据起始索引
        private _dataIndexEnd:number = 0;//显示数据结束索引

        private _itemDatas:Array<any> = null;
        private _dataIndexToRender:any = null;
        private _autoSize:boolean = false;
        private _marginTop:number = 4;
        private _marginBottom:number = 4;
        private _marginLeft:number = 4;
        private _marginRight:number = 4;
        private _line:number = 1;//设置排数
        private _lineGap:number = 2;//设置排间距

        private _effect:string = null;//效果选择
        private _isDragBegin:boolean = false;//点击开始
        private _isMoveBegin:boolean = false;//滑动开始
        private _moveCount:number = 0;//移动的通知次数
        private _dragBeginPoint:egret.Point = null;
        private _dragLastTime:number = 0;

        private _autoScrollGap:number = 0;//自动滚动的间距
        private _lastTimeNum:number = 0;//

        private _selected:any = null;//选择的对象
        private _fixed:boolean = false;//在元素不够的时候,禁止继续滚动

        private _data_end_func_call:any = null;//数据已经结束的call
        private _data_end_func_this:any = null;//数据已经结束的func的this


		public constructor(drawDelay:boolean = false){
			super(drawDelay);
		}

		public createChildren():void{
			super.createChildren();
			this.setSize(100, 300);
            this.touchEnabled = true;
            this._itemContainer = new BaseGroup();
            this.addChild(this._itemContainer);
            this._itemContainer.touchEnabled = true;
            this._itemContainer.setSize(this.width, this.height);
            this._itemContainer.scrollRect = new egret.Rectangle(0, 0, this.width, this.height);
            //this._itemContainer.showBg = false;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndEvent, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaseOutsideEvent, this)
            this._dragBeginPoint = new egret.Point();
            this.addHandleEvent(EventType.RESOURCE_DOWNLOADED, "onMyEventResDownloaded");
            this.touchNonePixel = true;
		}
        /**
         * 添加事件的处理
         * 注意:必须调用MessageControler.addEvent()注册事件名称,否者不会转发到这里
         * 如果没有对应的的类型在此出现,则改Handle对Event事件到此为止,不再派发,防止造成事件死循环
         * @param type MyEvent事件的类型
         * @param func  对应的call back function,不包含onEvent前缀
         */
        public addHandleEvent(eventType:string, funcName:string):void {
            //console.log("ReceiveGroup this=" + egret.getQualifiedClassName(this) + ", addHandleEvent=" + type + ", funcName=" + funcName);
            easy.MessageControler.addEvent(eventType)
            this.METHOD_DEF[eventType] = funcName;
        }

        /**
         * 收到界面弱事件通知
         * @param event
         */
        public receiveEvent(event:MyEvent):void {
            var sp:egret.DisplayObject = null;
            for(var i:number = 0; i < this._itemContainer.numChildren;i++){
                sp = this._itemContainer.getChildAt(i);
                if (sp["refresh"]){
                    sp["refresh"]();
                }
            }
        }

        /**
         * 点击开始
         * @param event
         */
        public onTouchBeginEvent(event:egret.TouchEvent) : void {
            if (!this._itemDatas || this._itemDatas.length == 0) return;
            this._isDragBegin = true;
            this._isMoveBegin = false;
            this._lastTimeNum = 0;
            this._moveCount = 0;
            this._dragBeginPoint.x = event.stageX;
            this._dragBeginPoint.y = event.stageY;
            this._dragLastTime = egret.getTimer();
            easy.HeartBeat.removeListener(this, this.onAutoScroll);
            //console.log("this._isDragBegin=" + this._isDragBegin + ", x=" + this._dragBeginPoint.x + ", y=" + this._dragBeginPoint.y)
        }

        /**
         * 点击移动
         * @param event
         */
        public onTouchMoveEvent(event:egret.TouchEvent) : void {
            if (!this._itemDatas || this._itemDatas.length == 0 || !this._isDragBegin) return;
            //console.log("onTouchMoveEvent x=" + event.stageX + ", y=" + event.stageY)
            if (this._isDragBegin) {
                this._isMoveBegin = true;
                this._moveCount ++;
                this.moveItemUIPosition(event.stageX - this._dragBeginPoint.x, event.stageY - this._dragBeginPoint.y);
            }
            if (this._direction == Style.VERTICAL) {//yv值
                this._autoScrollGap = event.stageY - this._dragBeginPoint.y;
                if (event.stageY <= this.getGlobalXY().y || event.stageY >= this.getGlobalXY().y + this.height) {//超出范围
                    this.onTouchEndEvent(event);
                    return;
                }
            } else {
                this._autoScrollGap = event.stageX - this._dragBeginPoint.x;
                if (event.stageX <= this.getGlobalXY().x || event.stageX >= this.getGlobalXY().x + this.width) {//超出范围
                    this.onTouchEndEvent(event);
                    return;
                }
            }
            this._lastTimeNum =  egret.getTimer() - this._dragLastTime;
            this._dragBeginPoint.x = event.stageX;
            this._dragBeginPoint.y = event.stageY;
            this._dragLastTime = egret.getTimer();
        }
        public onTouchReleaseOutsideEvent(event:egret.TouchEvent) : void {
            //this._isDragBegin = false;
            //this._isMoveBegin = false;
            //if (!this._fixed)this.checkUIFreeback();
            this.onTouchEndEvent(event);
            //console.log("onTouchReleaseOutsideEvent");
        }

        /**
         * 点击结束
         * @param event
         */
        public onTouchEndEvent(event:egret.TouchEvent) : void {
            //console.log("onTouchEndEvent this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd);
            if (this._isDragBegin && (!this._isMoveBegin || (this._moveCount < 4 && Math.abs(event.stageX-this._dragBeginPoint.x) < 5 && Math.abs(event.stageY-this._dragBeginPoint.y) < 5))) {//单击处理
                //console.log("onTouchEndEvent tap!!");
                var sp:egret.DisplayObject = null;
                for(var i:number = 0; i < this._itemContainer.numChildren;i++){
                    sp = this._itemContainer.getChildAt(i);
                    if (sp.x < event.localX && sp.y < event.localY && sp.x + sp.width > event.localX && sp.y + sp.height > event.localY){
                        try{
                            this.selected = sp["_data"];
                            break;
                        } catch(e) {

                        }
                    }
                }
                this._isDragBegin = false;
                this._isMoveBegin = false;
                return;
            }
            this._isDragBegin = false;
            this._isMoveBegin = false;
            //console.log("000timer=" + this._lastTimeNum + ", gap.value=" + this._autoScrollGap);
            //Debug.log = "timer=" + this._lastTimeNum;
            if (this._lastTimeNum < 40 && (this._dataIndexBegin > 0 && this._autoScrollGap > 0 || this._itemDatas && this._dataIndexEnd < this._itemDatas.length - 1 && this._autoScrollGap < 0)) {
                //console.log("111timer=" + timer);
                //时间越短,倍数越大
                //Debug.log = "_autoScrollGap=" + this._autoScrollGap + ", caculte=" + (this._autoScrollGap / this._lastTimeNum);
                this._autoScrollGap = (this._autoScrollGap / this._lastTimeNum)*10;
                //启用加速滑动的方式
                easy.HeartBeat.addListener(this, this.onAutoScroll);
                return;
            }
            this.checkUIFreeback();
        }

        private onAutoScroll():void {
            if (this._direction == Style.VERTICAL) {//yv值
                this.moveItemUIPosition(0, this._autoScrollGap);
            } else {
                this.moveItemUIPosition(this._autoScrollGap, 0);
            }
            this._autoScrollGap -= this._autoScrollGap/20;
            if (Math.abs(this._autoScrollGap) < 0.5 || this._dataIndexBegin == 0 || this._dataIndexEnd >= this._itemDatas.length - 1){
                easy.HeartBeat.removeListener(this, this.onAutoScroll);
                this.checkUIFreeback();
            }
        }

        /**
         * 检测是否需要回弹
         */
        private checkUIFreeback():void {
            //console.log("checkUIFreeback 000 this._dataIndexEnd=" + this._dataIndexEnd);
            if (this._itemContainer.numChildren > 0 && this._itemDatas && this._itemDatas.length > 0 && (this._dataIndexBegin == 0 || this._dataIndexEnd >= this._itemDatas.length - 1)){
                //console.log("checkUIFreeback 111")
                var pos:number = 0;
                if (this._dataIndexBegin == 0) {
                    if (this._direction == Style.VERTICAL) {//yv值
                        pos = this._itemContainer.getChildAt(0).y;
                    } else {
                        pos = this._itemContainer.getChildAt(0).x;
                    }
                    if (pos < 0){
                        //计算最后的边界
                        if (this._direction == Style.VERTICAL) {//yv值
                            pos = this._itemContainer.getChildAt(this._itemContainer.numChildren -1).y +  this._itemContainer.getChildAt(this._itemContainer.numChildren -1).height - this._itemContainer.height;
                        } else {
                            pos = this._itemContainer.getChildAt(this._itemContainer.numChildren -1).x +  this._itemContainer.getChildAt(this._itemContainer.numChildren -1).width - this._itemContainer.width;
                        }
                        if (pos > 0){
                            pos = 0;
                        }
                    }
                } else if (this._dataIndexEnd >= this._itemDatas.length-1) {
                    if (this._direction == Style.VERTICAL) {//yv值
                        pos = this._itemContainer.getChildAt(this._itemContainer.numChildren -1).y +  this._itemContainer.getChildAt(this._itemContainer.numChildren -1).height - this._itemContainer.height;
                    } else {
                        pos = this._itemContainer.getChildAt(this._itemContainer.numChildren -1).x +  this._itemContainer.getChildAt(this._itemContainer.numChildren -1).width - this._itemContainer.width;
                    }
                }
                if (pos != 0) {
                    for (var i:number = 0; i < this._itemContainer.numChildren; i++){
                        if (this._direction == Style.VERTICAL) {//yv值
                            egret.Tween.get(this._itemContainer.getChildAt(i)).to({y: this._itemContainer.getChildAt(i).y - pos}, 100);
                        } else {
                            egret.Tween.get(this._itemContainer.getChildAt(i)).to({x: this._itemContainer.getChildAt(i).x - pos}, 100);
                        }
                    }
                }
            }
        }

        /**
         * 移出render显示
         * @param render
         */
        private  removeRender(render:egret.DisplayObject):void {
            if (!render) return;
            for(var key in this._dataIndexToRender){
                if (this._dataIndexToRender[key] == render) {
                    delete this._dataIndexToRender[key];
                    break;
                }
            }
            try{
                render["data"] = null;
            } catch (e){
            }
            try{
                render["list"] = null;
            } catch (e){
            }
            if (render && render.parent) render.parent.removeChild(render);
            easy.ObjectPool.recycleClass(render, "list_" + this.name);
        }
        /**
         * 对整体render进行位移,并补足空出的位置
         * @param xv
         * @param yv
         */
        private moveItemUIPosition(xv:number, yv:number):void {
            //console.log("moveItemUIPosition this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd + ", x=" + xv + ", y=" + yv)
            var itemRederer:egret.Sprite = null;
            var optNum:number = 0;
            for(var i:number = this._itemContainer.numChildren - 1; i >= 0; i--){
                itemRederer = <egret.Sprite>this._itemContainer.getChildAt(i);
                if (this._direction == Style.VERTICAL){//yv值
                    if (!this._fixed)itemRederer.y += yv;
                    if (this._dataIndexBegin == 0 && yv >= 0 || this._dataIndexEnd == this._itemDatas.length - 1 && yv < 0) {
                        continue;
                    }
                    if (this._fixed)itemRederer.y += yv;
                    //补充一个
                    if (yv < 0 && this._dataIndexEnd < this._itemDatas.length - 1) {//^向上
                        if (this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).y + itemRederer.height + this._gap < this._itemContainer.height) {
                            optNum = this.addUIItem(this._dataIndexEnd+1, false);
                            this._dataIndexEnd += optNum;
                            //console.log("moveItemUIPosition 00000 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                        if ((itemRederer.y + itemRederer.height) < 0) {
                            this.removeRender(this._itemContainer.getChildAt(i));
                            //console.log("remove 000 index.value=" + this._dataIndexBegin);
                            this._dataIndexBegin ++;
                            //console.log("moveItemUIPosition 11111 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                    } else if (this._dataIndexBegin > 0){//v向下
                        if (this._itemContainer.getChildAt(0).y - this._gap > 0) {
                            optNum = this.addUIItem(this._dataIndexBegin - this._line, true);
                            this._dataIndexBegin -= optNum;
                            //console.log("moveItemUIPosition 22222 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                        if (itemRederer.y > this._itemContainer.height) {
                            this.removeRender(this._itemContainer.getChildAt(i));
                            //console.log("remove 111 index.value=" + this._dataIndexEnd);
                            this._dataIndexEnd --;
                            //console.log("moveItemUIPosition 33333 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                    }
                } else {//xv值
                    if (!this._fixed)itemRederer.x += xv;
                    if (this._dataIndexBegin == 0 && xv >= 0 || this._dataIndexEnd == this._itemDatas.length - 1 && xv < 0) {
                        continue;
                    }
                    if (this._fixed)itemRederer.x += xv;
                    //补充一个
                    if (xv < 0 && this._dataIndexEnd < this._itemDatas.length - 1) {//^向左
                        if (this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).x + itemRederer.width + this._gap < this._itemContainer.width) {
                            optNum = this.addUIItem(this._dataIndexEnd+1, false);
                            this._dataIndexEnd += optNum;
                            //console.log("moveItemUIPosition 4444 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                        if ((itemRederer.x + itemRederer.width) < 0) {
                            this.removeRender(this._itemContainer.getChildAt(i));
                            this._dataIndexBegin ++;
                            //console.log("moveItemUIPosition 5555 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                    } else if (this._dataIndexBegin > 0){//v向右
                        if (this._itemContainer.getChildAt(0).x - this._gap > 0) {
                            optNum = this.addUIItem(this._dataIndexBegin - this.line, true);
                            this._dataIndexBegin -= optNum;
                            //console.log("moveItemUIPosition 6666 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                        if (itemRederer.x > this._itemContainer.width) {
                            this.removeRender(this._itemContainer.getChildAt(i));
                            this._dataIndexEnd --;
                            //console.log("moveItemUIPosition 7777 this._dataIndexBegin=" + this._dataIndexBegin + ", this._dataIndexEnd=" + this._dataIndexEnd)
                        }
                    }
                }
            }
        }

        /**
         * 添加一个节点
         * @param dataIndex 数据的下标
         * @param topPlace true:添加在最前面,添加在最后面
         */
        private addUIItem(dataIndex:number, topPlace:boolean):number {
            //console.log("addUIItem dataIndex=" + dataIndex + ", topPlace=" + topPlace + ", _dataIndexEnd=" + this._dataIndexEnd + ", _dataIndexBegin=" + this._dataIndexBegin);
            if (!this._itemDatas || dataIndex < 0 || dataIndex >= this._itemDatas.length) {
                return 0;
            }
            var indexAdd:number = 0;
            //console.log("addUIItem 000");
            //if (this._dataIndexToRender["" + dataIndex]) return indexAdd;
            //console.log("addUIItem 1111");
            var yPos:number = 0;
            var xPos:number = 0;
            while(indexAdd < this._line) {
                if (!this._itemDatas || dataIndex < 0 || dataIndex >= this._itemDatas.length) break;
                var displayItemUI:egret.Sprite = easy.ObjectPool.getByClass(this._itemRenderer, "list_" + this.name);
                if (!displayItemUI["isAddedToStage"]){
                    this._itemContainer.addChild(displayItemUI);
                    this._itemContainer.removeChild(displayItemUI);
                }
                if (displayItemUI && displayItemUI["validateNow"]) displayItemUI["validateNow"]();
                try{
                    displayItemUI["data"] = this._itemDatas[dataIndex];
                }catch(e){
                }
                try{
                    displayItemUI["list"] = this;
                }catch(e){
                }
                if (this._autoSize){
                    if (this._direction == Style.VERTICAL){
                        displayItemUI.width = (this._itemContainer.width - (this._line-1)*this._gap)/this._line;
                    } else {
                        displayItemUI.height = (this._itemContainer.height - (this._line-1)*this._gap)/this._line;
                    }
                }
                if (this._direction == Style.VERTICAL){
                    xPos = (displayItemUI.width + this._lineGap)*indexAdd;
                    if (this._itemContainer.numChildren > 0 && indexAdd == 0) {
                        if (topPlace){
                            yPos = this._itemContainer.getChildAt(0).y;
                            yPos = yPos - (this._gap + displayItemUI.height);
                            //console.log("000=" + yPos + ", indexAdd=" + indexAdd);
                        } else {
                            yPos = this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).y;
                            yPos += (this._gap + this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).height)*(indexAdd+1);
                            //console.log("111=" + yPos + ", indexAdd=" + indexAdd);
                        }
                    }
                    if (yPos > this._itemContainer.height || yPos < - displayItemUI.height){
                        this.removeRender(displayItemUI);
                        return indexAdd;
                    }
                    displayItemUI.y = yPos;
                    displayItemUI.x = xPos;
                } else {
                    yPos = (displayItemUI.height + this._lineGap)*indexAdd;
                    //console.log("yPos=" + yPos + ", indexAdd=" + indexAdd);
                    if (this._itemContainer.numChildren > 0 && indexAdd == 0) {
                        if (topPlace){
                            xPos = this._itemContainer.getChildAt(0).x;
                            xPos = xPos - (this._gap + displayItemUI.width);
                            //console.log("000=" + xPos + ", indexAdd=" + indexAdd);
                        } else {
                            xPos = this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).x;
                            xPos += (this._gap + this._itemContainer.getChildAt(this._itemContainer.numChildren - 1).width)*(indexAdd+1);
                            //console.log("111=" + xPos + ", indexAdd=" + indexAdd);
                        }
                    }
                    if (xPos > this._itemContainer.width || xPos < - displayItemUI.width){
                        this.removeRender(displayItemUI);
                        return indexAdd;
                    }
                    displayItemUI.x = xPos;
                    displayItemUI.y = yPos;
                }
                if (topPlace) {
                    this._itemContainer.addChildAt(displayItemUI, 0);
                } else {
                    this._itemContainer.addChild(displayItemUI);
                }

                this._dataIndexToRender["" + dataIndex] = displayItemUI;
                indexAdd ++;
                //console.log("addUIItem indexAdd=" + indexAdd + ", dataIndex=" + dataIndex + ", x=" + xPos + ", y=" + yPos + ", _dataIndexEnd=" + this._dataIndexEnd + ", _dataIndexBegin=" + this._dataIndexBegin);
                dataIndex ++;
            }
            if (dataIndex >= this._itemDatas.length && indexAdd > 0){//已经到底,没有数据了
                //console.log("list.data.end.call");
                if (this._data_end_func_call)this._data_end_func_call.call(this._data_end_func_this);
            }
            return indexAdd;
        }

        public set data(value:any){
            this._data = value;
            this._itemDatas = null;
            this._dataIndexToRender = {};
            this.setItemContainerSize();
            //清空显示
            var displayItemUI:egret.Sprite = null;
            while(this._itemContainer.numChildren > 0) {
                displayItemUI = <egret.Sprite>this._itemContainer.removeChildAt(0);
                if (displayItemUI["data"])displayItemUI["data"] = null;
                easy.ObjectPool.recycleClass(displayItemUI, "list_" + this.name);
            }
            if (this._data instanceof Array){
                //进行首次填充
                this._itemDatas = <Array<any>>this._data;
                //console.log("set data.length=" + this._itemDatas.length + ", data=" + this._itemDatas);
                if (this._itemDatas.length == 0) return;
                this._dataIndexBegin = 0;
                var placeValue:number = 0;//占据的位置
                var addNum:number = this.addUIItem(this._dataIndexBegin, false);
                this._dataIndexEnd = addNum;
                while(addNum != 0 && this._dataIndexEnd < this._itemDatas.length) {
                    addNum = this.addUIItem(this._dataIndexEnd, false);
                    this._dataIndexEnd += addNum;
                    //console.log("dataIndexEnd=" + this._dataIndexEnd + ", addNum=" + addNum);
                }
                this._dataIndexEnd --;//起始是从0开始,减去一个下标
                //console.log("setData dataIndexBegin=" + this._dataIndexBegin + ", dataIndexEnd=" + this._dataIndexEnd)
            }
        }

        /**
         * 最佳滚动数据
         * @param value
         */
        public append(datas:Array<any>):void {
            if (datas){
                this._itemDatas = this._itemDatas.concat(datas);
            }
        }
        /**
         * Draws the visual ui of the component.
         */
        public draw():void{
            super.draw();
            this.setItemContainerSize();
        }
        private setItemContainerSize():void {
            this._itemContainer.x = this._marginLeft;
            this._itemContainer.y = this._marginTop;
            this._itemContainer.width = this.width - this._marginLeft - this._marginRight;
            this._itemContainer.height = this.height - this._marginTop - this._marginBottom;
            this._itemContainer.scrollRect.width = this._itemContainer.width;
            this._itemContainer.scrollRect.height = this._itemContainer.height;
        }
        public setHorizontalLayout(){
            this.layout = Style.HORIZONTAL;
        }
        public setVerticalLayout(){
            this.layout = Style.VERTICAL;
        }

        public set layout(direct:string) {
            this._direction = direct;
            this.invalidate();
        }

        public get layout():string {
            return this._direction;
        }
        public set selected(item:any){
            //console.log("selectedItem item=" + item)
            var sp:egret.DisplayObject = null;
            this._selected = item;
            for(var i:number = 0; i < this._itemContainer.numChildren;i++){
                sp = this._itemContainer.getChildAt(i);
                if (sp["selected"]) sp["selected"] = false;
                try{
                    if (sp["_data"] == item ){
                        sp["selected"] = true;
                    }
                } catch(e) {
                }
            }
        }
        public get selected():any {
            return this._selected;
        }

        /**
         * 获取选择对象的index
         * @returns {number}
         */
        public get selectedIndex():number {
            if (this._selected){
                return this._data.indexOf(this._selected)
            }
            return -1
        }
        public get itemRenderer():any{
            return this._itemRenderer;
        }

        /**
         * 设置itemRenderer
         * @param value
         */
        public set itemRenderer(value:any){
            if (this._itemRenderer != value) {
                this._itemRenderer = value;
                this.invalidate();
            }
        }
        public get autoSize():boolean {
            return this._autoSize;
        }

        /**
         * 设置自动大小
         * @param value
         */
        public set autoSize(value:boolean) {
            if (this._autoSize != value) {
                this._autoSize = value;
                this.invalidate();
            }
        }
        public get marginTop():number {
            return this._marginTop;
        }

        /**
         * 设置顶边距
         * @param value
         */
        public set marginTop(value:number) {
            if (this._marginTop != value){
                this._marginTop = value;
                this.invalidate();
            }
        }

        public get marginBottom():number {
            return this._marginBottom;
        }

        /**
         * 设置底边距
         * @param value
         */
        public set marginBottom(value:number) {
            if (this._marginBottom != value) {
                this._marginBottom = value;
                this.invalidate();
            }
        }

        public get marginLeft():number {
            return this._marginLeft;
        }

        /**
         * 设置左边距
         * @param value
         */
        public set marginLeft(value:number) {
            this._marginLeft = value;
            this.invalidate();
        }

        public get marginRight():number {
            return this._marginRight;
        }

        /**
         * 设置右边距
         * @param value
         */
        public set marginRight(value:number) {
            if (this._marginRight = value){
                this._marginRight = value;
                this.invalidate();
            }
        }
        public get gap():number {
            return this._gap;
        }
        /**
         * 设置item render的间距
         */
        public set gap(value:number) {
            this._gap = value;
            this.invalidate();
        }

        public get line():number {
            return this._line;
        }
        /**
         * 设置render的排数,默认是1
         */
        public set line(value:number) {
            this._line = value;
            if (this._line < 1) this._line = 1;
            this.invalidate();
        }

        public get lineGap():number {
            return this._lineGap;
        }
        /**
         * 设置无滚动元素的时候,禁止背景滚动
         */
        public set fixed(value:boolean) {
            if (this._fixed != value){
                this._fixed = value;
                this.invalidate();
            }
        }
        public get fixed():boolean {
            return this._fixed;
        }
        /**
         * 设置render的排数,默认是1
         */
        public set lineGap(value:number) {
            this._lineGap = value;
            if (this._lineGap < 0) this._lineGap = 0;
            this.invalidate();
        }

        /**
         * 设置滚动数据结束的通知
         * @param func
         * @param thisObj
         */
        public setDataEndCall(func:any, thisObj:any):void {
            this._data_end_func_call = func;
            this._data_end_func_this = thisObj;
        }
	}
}