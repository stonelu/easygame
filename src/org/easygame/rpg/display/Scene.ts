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
module easy.rpg {

	export class Scene extends ReceiveGroup {
        public controls:Array<ActorCtrl> = [];//在场景中的所有对象
        public displayControls:Array<ActorCtrl> = [];//需要显示渲染的列表
        public map:Map = null;//地图显示
        public camera:Camera = null;//摄像视图
        public _displayContainer:BaseGroup = null;//显示渲染对象的层
        public _effectContainer:BaseGroup = null;//显示特效的层,和map一样大小

        //场景预设定的长宽
        public sceneWidth:number = 0;
        public sceneHeight:number = 0;

        //地图之上,人物之下的一个层次
        //private _overMapContainer:DisplayObjectContainer = new DisplayObjectContainer();
        
        public constructor(mapInfo:any) {
            super();
            this.setMapInfo(mapInfo);
            this.touchEnabled = true;
            this.showBg = true;
            this.touchNonePixel = true;
        }
        public createChildren():void {
            super.createChildren();
            this._displayContainer = new easy.BaseGroup();
            this.addChild(this._displayContainer);

            this._displayContainer.x = 0;
            this._displayContainer.y = 0;
            this.touchEnabled = true;
        }
        //初始化地图信息
        private setMapInfo(mapInfo:any):void {
            console.log("Scene setMapInfo id=" + mapInfo.id)
            this.map = easy.ObjectPool.getObject("map_" + mapInfo.id, false);
            if (!this.map) {
                this.map = new Map(mapInfo);
                easy.ObjectPool.setObject("map_" + this.map._id, this.map);
                //设置场景的可视范围
                if (this.camera == null){
                    this.camera = new easy.rpg.Camera(this);
                }
                this.camera.setMap(this.map);
                //设置场景的大小
                this.sceneWidth = mapInfo.scene_width;
                this.sceneHeight = mapInfo.scene_height;

            }
            this.addChildAt(this.map, 0);
        }

        /**
         * 添加角色
         * @param actor
         */
        public addActor(actor:Actor):void {
            this.controls.push(actor._ctrl);
        }

        /**
         * 添加特效
         * 会添加到特效层
         * 驱动和消失,都由AnimateManager的动画对象来控制,这里只是负责显示
         */
        public addAnimate(animate:IAnimate):void {
            if (this._effectContainer == null) {
                this._effectContainer = new easy.BaseGroup();
                this.addChild(this._effectContainer);
                this._effectContainer.setSize(this.width, this.height);
                //this._effectContainer.scrollRect = this.map._cameraRect;
            }
            this._effectContainer.addChild(animate.getDisplay());
        }
        /**
         * 根据entity的id,取control对象
         */  
        public getActorById(id:number):easy.rpg.ActorCtrl {
            for (var i:number = 0; i < this.controls.length; i++) {
                if (this.controls[i].id == id) {
                    return this.controls[i];
                }
            }
            return null;
        }

        /**
         * 进入场景
         */  
        public enter():void {
            easy.HeartBeat.addListener(this, this.onHeartBeat);
            if (this.map)this.map.enter();
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventTouchTap, this, true);
            //console.log("addEventListener TOUCH_TAP");
        }
        /**
         * 出场景
         */
        public outer():void {
            if (this.map)this.map.outer();
            //移除呼吸
            easy.HeartBeat.removeListener(this, this.onHeartBeat);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventTouchTap, this, true);
            //console.log("1111111111111111removeEventListener TOUCH_TAP");
            //清除寻路信息
            //移除鼠标点击
            //this.removeEventListener(MouseEvent.CLICK, this.onEventMouseClick);
            //if (this.isGridPath) {
            //    //主城
            //    for (var i:number = this.controls.length - 1; i >= 0 ; i--) {
            //        if (this.controls[i] instanceof CharacterControl) {
            //            (<CharacterControl><any> (this.controls[i])).setPlayerStand();
            //            this.removeChild(this.controls[i].view);
            //        }
            //    }
            //} else {
            //    //战斗
            //    AnimateManager.clearAnimate();//清除所有特效
            //    //清除
            //    this.cleanAllMovieObject();
            //}
            //this.clean();
            //this.onChangeResDownloadToMix();
        }
        /**
         * 清除场景的人物
         */  
        public cleanAllMovieObject():void {
            //trace("Scene.cleanAllMovieObject()");
            for (var i:number = this.displayControls.length - 1; i >= 0 ; i--) {
                if (this.displayControls[i].actor) this.displayControls[i].actor.removeFromParent();
            }
            this.controls.length = 0;
            this.displayControls.length = 0;
        }
        /**
         * 鼠标点击响应
         */
        public onEventTouchTap(event:egret.TouchEvent):void {
            //console.log("111111111onEventTouchTap target=" + egret.getQualifiedClassName(event.target) + ", curr.target=" + egret.getQualifiedClassName(event.currentTarget))
            this.camera.onEventMouseClick(event);
        }
        /**
         * 设置地图格子是否可行走
         * @param col 列号, 0开始
         * @param row 行号, 0开始
         * @param value true:可行走, false:不可行走
         * 
         */        
        public setMapWalkable(col:number, row:number, value:boolean):void {
            //if (this.grid) this.grid.setWalkable(col, row, value);
        }
        /**
         * 设置摄像头焦点
         */  
        public set cameraFoucs(actor:Actor) {
            if (this.camera)this.camera.focusActor = actor;
        }
        public get cameraFoucs():Actor {
            if (this.camera) return this.camera.focusActor;
            return null;
        }
        /**************************************************
         **********          显示渲染相关         **********
         **************************************************/
        /**
         * 呼吸
         */
        private _siftCount:number = 0;
        public onHeartBeat():void {
            //console.log("Sence.HB ctrl.lenght=" + this.controls.length);
            var i:number = 0;
            this._siftCount++;
            if (this._siftCount > 30){//比较复杂,定期运行,减少计算量
                this._siftCount = 0;
                this.siftDisplayControl();
            }
			var item:ActorCtrl = null;
			for (i = 0; i < this.controls.length; i++) {
				item = this.controls[i];
				item.onHeartBeat();
                this.map.toScreen(item.gameData._mapXY, item.gameData._screenXY)
			}
            //数值变化
            for (i = 0; i < this.displayControls.length; i++) {
                item = this.displayControls[i];
                //if (item.gameData.isInvalidate){
                //    //console.log("isInvalidate=" + item.id)
                //    this.onAlphaCheck();
                //}
                item.onHBChangeData();
            }

			//深度排序
			this.depthCount ++;
			if (this.depthCount >= 30) {//比较复杂,定期运行,减少计算量
				this.depthCount = 0;
				this.depthSortDisplay();
			}
            console.log("Sence.HB displayControls.lenght=" + this.displayControls.length);
        }
        //深度排序
        private depthCount:number = 0;
        private depthSortDisplay():void {
            this.displayControls.sort(this.sortOnPosition);
            var item:ActorCtrl = null;
            var len:number = this.displayControls.length;
            for (var i:number = 0; i < len; i++) {
                item = this.displayControls[i];
                if (null == item.actor.parent) item.enter();
                this._displayContainer.addChild(item.actor);
            }
        }
        //深度交换
        private sortOnPosition(a:ActorCtrl, b:ActorCtrl):number {
            if (a.gameData.mapXY.y > b.gameData.mapXY.y) return 1;
            if (a.gameData.mapXY.y < b.gameData.mapXY.y) return -1;
            return 0;
        }
		//检测遮挡透明
		private onAlphaCheck():void{
			var node:Node = null;
			var length:number = this.displayControls.length;
			for(var i:number = 0;i < length;i++){
				var item:ActorCtrl = this.displayControls[i];
                item.isDisplay = true;
				//node = this.getNode(item.data.mapXY);
				//if (this.isGridPath && node.walkable && !(item instanceof NPCControl)) {
				//	if (node.data == 1){
				//		if(1 != item.view.alpha) item.view.alpha = 1;
				//	} else if (node.data == 2){
				//		if(0.5 != item.view.alpha) item.view.alpha = 0.5;
				//	} else{
				//		item.view.alpha = node.data/10;
				//	}
				//} else {
				//	if(1 != item.view.alpha) item.view.alpha = 1;
				//}
			}
		}
		//筛选可视的显示对象
		private siftDisplayControl():void{
            var item:ActorCtrl = null;
            this.displayControls.length = 0;
            var selectedItem:ActorCtrl = null;
            //var globalPoint:egret.Point = new egret.Point(GlobalSetting.STAGE.mouseX, GlobalSetting.STAGE.mouseY);
            for (var i:number = 0; i < this.controls.length; i++) {
                item = this.controls[i];
                //item.selected = false;
                //检测是否在显示区域内
                if ((item.gameData._screenXY.x > 0 && item.gameData._screenXY.y > 0 &&  item.gameData._screenXY.x < this.width && item.gameData._screenXY.y < this.height)
                    || (item.gameData._screenXY.x + item.gameData._width/2 > 0 && item.gameData._screenXY.y + item.gameData._height/2 > 0 &&  item.gameData._screenXY.x + item.gameData._width/2 < this.width && item.gameData._screenXY.y + item.gameData._height/2 < this.height)
                ){
                    //console.log("11111")
					if (RpgSetting.SHOW_OTHER_PLAYER && item.gameData.type == RpgSetting.ACTOR_TYPE_PLAYER){
                        //console.log("22222")
                        this.displayControls.push(item);
                    } else if (item.gameData.type == RpgSetting.ACTOR_TYPE_NPC){
                        //console.log("33333")
                        this.displayControls.push(item);
                    } else if (item.actor.parent){
                        //console.log("44444")
                        //不显示玩家的情况下,玩家要移除
                        item.actor.removeFromParent();
                        item.outer();
                    }
                } else if (item.actor.parent){
                    //console.log("55555")
                    item.actor.removeFromParent();
					item.outer();
				}
				//是否选中
				//if (this.isGridPath && item.hitTest(globalPoint)){
				//	selectedItem = item;
				//	//trace("hitTest item=" + item.data.data.id + ", x=" + globalPoint.x + ", y=" + globalPoint.y + ", item.x=" + item.data.screenXY.x + ", item.y=" + item.data.screenXY.y + ", item.w=" + item.data.width + ", item.h=" + item.data.height);
				//}
			}
			//if (this.isGridPath && selectedItem) {
			//	selectedItem.selected = true;
			//} else {
			//	Mouse.cursor = MouseCursor.AUTO;
			//}
		}
        /**
         * 获取点击位置的物品列表
         */  
        public getControlUnderPoint(xGlobal:number, yGlobal:number = 0):Array<number> {
            var result:Array<number> = new Array<number>();
            var i:number = 0;
            for (i = 0; i < this.displayControls.length; i++) {
                if (this.displayControls[i].actor.hitTestPoint(xGlobal, yGlobal)) {
                    result.push(this.displayControls[i].id);
                }
            }
            return result;
        }
        /**
         * <p>设置场景大小</p>
         * @param w 宽度
         * @param h 长度
         */
        public setSize(w:number, h:number):void {
            console.log("Scene.setSize(" + w +", " + h + ")");
            super.setSize(w, h);
            if (this.camera) this.camera.setSize(w, h);
            this._displayContainer.setSize(w, h)
            if (this._effectContainer)this._effectContainer.setSize(w, h)
        }
        /**
         * 设置地图位移坐标值
         * 在副本战斗中按固定尺寸冻结视图中使用
         * @param offset 地图偏移的坐标值
         */        
//        public setMapOffset(offset:Point):void {
//            if (offset) {
////                trace("Scene.setMapOffset(offset) x=" + offset.x + ", y=" + offset.y);
//                this.map.offsetMap = offset;
//            } else {
////                trace("Scene.setMapOffset(offset) offset=null");
//                this.map.offsetMap.x = 0 ;
//                this.map.offsetMap.y = 0 ;
//            }
//        }

//
//        public get isGridPath():boolean {
//            return this._isGridPath;
//        }
//
//        public set isGridPath(value:boolean) {
//            this._isGridPath = value;
//        }
        /**
         * 显示地图格子
         */       
        public showGrid():void {
            //if (this.grid && this.map)this.map.showGrid(this.grid);
        }
        //public getMapBitmapData():BitmapData {
        //    return this.map.getCurrentBitmapData();
        //}
        public findPath(source:egret.Point, target:egret.Point):Array<egret.Point> {
            //console.log("Scene findPath");
            return this.map.findPath(source, target);
        }
    }
}