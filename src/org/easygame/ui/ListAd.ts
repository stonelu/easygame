module easy{
    export class ListAd extends Group{

        public static ALIGN_BOTTOM:string = "bottom";//底部对齐
        public static ALIGN_CENTER:string = "center";//中间对齐

        public static SCROLL_UP:string = "up";
        public static SCROLL_DOWN:string = "down";
        public static SCROLL_LEFT:string = "left";
        public static SCROLL_RIGHT:string = "right";
        /**
         * 消息和方法的映射关系表
         */
        private METHOD_DEF:Object = {};
        private _dataItems:Array<any> = [];
        private _itemContainer:easy.Group = null;
        private _itemRenderer:any = easy.DefaultRenderer;
        private _itemIndexToRender:any = null;
        private _speed:number = 150;//滚动动画时间
        private _delay:number = 3000;//触发下次滚动的间隔
        private _align:string = ListAd.ALIGN_BOTTOM;//对齐方式
        private _gapFactor:number = 1;
        private _direction:string = ListAd.SCROLL_LEFT;//滚动方向
        private _firstGapWidth:number = 0;//层级间距
        private _scaleFactor:number = 0.1;//层级差异系数
        private _maxTextureWidth:number = 0;
        private _maxTextureHeight:number = 0;
        private _totalLength:number = 0;
        private _middleIndex:number = 0;//当前展示的item标识
        private _middleItemX:number = 0;//当前展示的itemX坐标
        private _middleItemY:number = 0;//当前展示的itemY坐标
        private _firstItemIndex:number = 0;//最前端的item的下标
        private _gap:number = 2;//render对象折叠间隔
        private _stop:boolean = false;
        public constructor(drawDelay:boolean = false){
            super(drawDelay);
        }
        public createChildren():void{
            super.createChildren();
            this.setSize(300,300);
            this._itemContainer = new easy.Group();
            this.addChild(this._itemContainer);
            this._itemContainer.showBg = false;
            this._itemContainer.setSize(this.width,this.height);
            this._itemContainer.horizontalEnabled = true;
            this._itemContainer.verticalEnabled = true;
            this.addHandleEvent(EventType.RESOURCE_DOWNLOADED, "onMyEventResDownloaded");
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

       public set data(value:any){
           if(!value)return;
           this._data = value;
           this._dataItems = null;
           this._itemIndexToRender = {};
           //清空显示
           var displayItemUI:egret.Sprite = null;
           while(this._itemContainer.numChildren > 0) {
               displayItemUI = <egret.Sprite>this._itemContainer.removeChildAt(0);
               if (displayItemUI["data"])displayItemUI["data"] = null;
               easy.ObjectPool.recycleClass(displayItemUI, "listad_" + this.name);
           }
           //if(!this._scaleFactor)this._scaleFactor = 0.1;
           if(value instanceof Array){
               this._dataItems = <Array<any>>value;
               if(this._dataItems.length == 0)return;
               this._totalLength = this._dataItems.length;
               if(this._totalLength % 2 == 0){
                   this._middleIndex = this._totalLength / 2;
               }else if(this._totalLength % 2 == 1){
                   this._middleIndex = (this._totalLength - 1) / 2;
               }
               this._firstItemIndex = 0;
               var addNum:number = 0;
               while(addNum < this._totalLength){
                   this.addItem(addNum);
                   addNum ++;
               }
               if(this._dataItems.length <= 3){

               }else{
                   //this.refreshTree();
               }
           }
       }
        public get data():any{
            return this._data;
        }
        /**
         * 展示的元素少于等于3个时启用
         */
        private reserveModel():void{

        }
        /**
         * 初始化添加item
         * @param index
         */
        private addItem(index:number):void{
            var item:easy.DefaultRenderer = easy.ObjectPool.getByClass(this._itemRenderer,"listad_" + this.name);
            //var item:easy.Group = easy.ObjectPool.getByClass(easy.Group);
            item.setSize(200,200);
            item.anchorX = 0.5;
            item.anchorY = 0.5;
            this._itemContainer.addChild(item);
            this._itemContainer.removeChild(item);
            if (item && item["validateNow"]) item["validateNow"]();
            if(!this._firstGapWidth)this._firstGapWidth = item.width / 2;
            //var label:easy.Label = new easy.Label();
            //item.addChild(label);
            //label.color = 0xff00ff;
            //label.autoSize = false;
            //label.width = 150;
            //label.height = 150;
            //label.fontSize = 100;
            //label.horizontalEnabled = true;
            //label.verticalEnabled = true;
            //label.showBg = false;
            //label.text = "" + index;

            this._middleItemX = this._itemContainer.width / 2;
            this._middleItemY = this._itemContainer.height / 2;
            if(Math.abs(index - this._middleIndex) <= 1){
                if(index - this._middleIndex == - 1){
                    this._itemContainer.addChild(item);
                    item.x = (index - this._middleIndex ) * this._firstGapWidth + this._middleItemX;
                }else if(index == this._middleIndex){
                    this._itemContainer.addChild(item);
                    item.x = this._middleItemX;
                } else if(index - this._middleIndex == 1){
                    this._itemContainer.addChildAt(item,1);
                    item.x = this._middleItemX + (index - this._middleIndex) * this._firstGapWidth;
                    item.bgColor = 0x000000;
                }
                item.scaleY = (1 - Math.abs(index - this._middleIndex) * this._scaleFactor);
                item.alpha = (1 - Math.abs(index - this._middleIndex) * this._scaleFactor);
                item.y = Math.abs(index - this._middleIndex) * this._scaleFactor * item.height * item.anchorY * this._gapFactor + this._middleItemY;
            }
            item.data = this._dataItems[index];

            this._itemIndexToRender["" + index] = item;
        }
        /**
         *开始滚动
         */
        public start():void {
            if (this._delayIndex2)egret.clearTimeout(this._delayIndex2);
            var oldX:number = 0;
            var oldY:number = 0;
            var oldScaleY:number = 0;
            var oldAlpha:number = 0;
            var height:number = 0;
            var anchorY:number = 0;
            var moveIndex1:number = 0;
            var moveIndex2:number = 0;
            var moveIndex3:number = 0;
            var moveArray:Array<number> = [];
            moveIndex1 = this._middleIndex - 1;
            if (moveIndex1 < 0)moveIndex1 = this._totalLength - 1;
            moveIndex2 = this._middleIndex;
            moveIndex3 = this._middleIndex + 1;
            if (moveIndex3 == this._totalLength)moveIndex3 = 0;
            moveArray = [moveIndex1, moveIndex2, moveIndex3];
            for (var i:number = 0; i < moveArray.length; i++) {
                oldX = this._itemIndexToRender["" + moveArray[i]].x;
                oldY = this._itemIndexToRender["" + moveArray[i]].y;
                oldScaleY = this._itemIndexToRender["" + moveArray[i]].scaleY;
                oldAlpha = this._itemIndexToRender["" + moveArray[i]].alpha;
                height = this._itemIndexToRender["" + moveArray[i]].height;
                anchorY = this._itemIndexToRender["" + moveArray[i]].anchorY;
                if (this._direction == "left") {
                    this._destroyIndex = moveIndex1;
                    if (i == 0) {
                        egret.Tween.get(this._itemIndexToRender["" + moveArray[i]]).to({
                            x: oldX + this._firstGapWidth,
                            y: oldY + this._scaleFactor * height * anchorY * this._gapFactor,
                            scaleY: oldScaleY - this._scaleFactor,
                            alpha: 0
                        }, this._speed)
                    } else if (i == 1) {
                        egret.Tween.get(this._itemIndexToRender["" + moveArray[i]]).to({
                            x: oldX - this._firstGapWidth,
                            y: oldY + this._scaleFactor * height * anchorY * this._gapFactor,
                            scaleY: oldScaleY - this._scaleFactor,
                            alpha: oldAlpha - this._scaleFactor
                        }, this._speed)
                    } else if (i == 2) {
                        egret.Tween.get(this._itemIndexToRender["" + moveArray[i]]).to({
                            x: oldX - this._firstGapWidth,
                            y: oldY - this._scaleFactor * height * anchorY * this._gapFactor,
                            scaleY: oldScaleY + this._scaleFactor,
                            alpha: oldAlpha + this._scaleFactor
                        }, this._speed)
                    }

                } else if (this._direction == "right") {
                    this._destroyIndex = moveIndex3;
                    if (i == 0) {
                        egret.Tween.get(this._itemIndexToRender["" + moveArray[i]]).to({
                            x: oldX + this._firstGapWidth,
                            y: oldY - this._scaleFactor * height * anchorY * this._gapFactor,
                            scaleY: oldScaleY + this._scaleFactor,
                            alpha: oldAlpha + this._scaleFactor
                        }, this._speed)
                    } else if (i == 1) {
                        egret.Tween.get(this._itemIndexToRender["" + moveArray[i]]).to({
                            x: oldX + this._firstGapWidth,
                            y: oldY + this._scaleFactor * height * anchorY * this._gapFactor,
                            scaleY: oldScaleY - this._scaleFactor,
                            alpha: oldAlpha - this._scaleFactor
                        }, this._speed)
                    } else if (i == 2) {
                        egret.Tween.get(this._itemIndexToRender["" + moveArray[i]]).to({
                            x: oldX - this._firstGapWidth,
                            y: oldY - this._scaleFactor * height * anchorY * this._gapFactor,
                            scaleY: oldScaleY + this._scaleFactor,
                            alpha: 0
                        }, this._speed)
                    }

                }
            }
            if(this._direction == "left"){
                this._middleIndex++;
                if (this._middleIndex == this._totalLength)this._middleIndex = 0;
            }else if(this._direction == "right"){
                this._middleIndex --;
                if(this._middleIndex < 0)this._middleIndex = this._totalLength - 1;
            }
            this.addNewItem(this._direction);
            this._delayIndex1 = egret.setTimeout(this.refreshTree, this, this._speed);
        }
        public stop():void{
            for(var key in this._itemIndexToRender){
                egret.Tween.removeTweens(this._itemIndexToRender[key]);
            }
            if(this._delayIndex1)egret.clearTimeout(this._delayIndex1);
            if(this._delayIndex2)egret.clearTimeout(this._delayIndex2);
        }
        /**
         * 添加一个新的元素
         * @param type
         * @param index
         */
        private addNewItem(type:string,index:number = this._middleIndex):void{
            if(type == "left"){
                index ++;
                if(index == this._totalLength)index = 0;
            }else if(type == "right"){
                index --;
                if(index < 0)index = this._totalLength - 1;
            }
            var item = this._itemIndexToRender["" + index];
            this._itemContainer.addChildAt(item,1);
            item.alpha = 0;
            item.anchorX = 0.5;
            item.anchorY = 0.5;
            item.scaleY = 1;
            item.x = this._middleItemX;
            item.y = this._middleItemY;
            item.bgColor = 0x000000;
            item.data = item._data;
            if(type == "left"){
                egret.Tween.get(item).to({x:item.x + this._firstGapWidth,y:item.y + this._scaleFactor * item.height * item.anchorY * this._gapFactor ,scaleY:1 - this._scaleFactor,alpha:1 - this._scaleFactor},this._speed)
            }else if(type == "right"){
                egret.Tween.get(item).to({x:item.x - this._firstGapWidth,y:item.y + this._scaleFactor * item.height * item.anchorY * this._gapFactor ,scaleY:1 - this._scaleFactor,alpha:1 - this._scaleFactor},this._speed)
            }
        }
        private _delayIndex1:number = 0;
        private _delayIndex2:number = 0;
        private _destroyIndex:number = 0;
        /**
         *  滚动一次结束 调整item层次
         */
        private refreshTree():void{
            for(var key in  this._itemIndexToRender){
                egret.Tween.removeTweens(this._itemIndexToRender[key]);
            }
            if(this._delayIndex1)egret.clearTimeout(this._delayIndex1);
            this._itemIndexToRender["" + this._destroyIndex].removeFromParent();
            this._itemContainer.addChildAt(this._itemIndexToRender["" + this._middleIndex],this._totalLength);
            this._delayIndex2 = egret.setTimeout(this.start,this,this._delay);
        }
        public get direction():string{
            return this._direction;
        }
        public set direction(value:string){
            if(!value)return;
            this._direction = value;
        }
        public get align():string{
            return this._align;
        }
        public set align(value:string){
            if(value == "bottom"){
                this._align = value;
                this._gapFactor = 1;
            }else if(value == "center"){
                this._align = value;
                this._gapFactor = 0.2;
            }else{
                return;
            }
        }
        public get speed():number{
            return this._speed;
        }
        public set speed(value:number){
            if(!value || value <= 0)return;
            this._speed = value;
        }
        public get delay():number{
            return this._delay;
        }
        public set delay(value:number){
            if(!value || value <= 0)return;
            this._delay = value;
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
        public set scaleFactor(value:number){
            this._scaleFactor = value;
        }
        public get scaleFactor():number{
            return this._scaleFactor;
        }
        public set firstGapWidth(value:number){
            if(value)this._firstGapWidth = value;
        }
        public get firstGapWidth():number{
            return this._firstGapWidth;
        }
    }
}