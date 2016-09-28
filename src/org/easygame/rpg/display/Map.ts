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

	export class Map extends easy.Group{
        public _id:number = 0;
        public _mapId:number = 0;//地图id
        public _mapWidth:number = 0;//地图宽
        public _mapHeight:number = 0;//地图高
        public _sceneWidth:number = 0;//场景宽
        public _sceneHeight1:number = 0;//场景高
        private _type:string = ".jpg";//图片类型
        public _row:number = 0;
        public _column:number = 0;
        public _hCircle:number = 0;//横向下载的圈数
        public _vCircle:number = 0;//纵向下载的圈数
        public _blockWidth:number = 0;
        public _blockHeight:number = 0;
        public _enterPoint:egret.Point = null;
        public _info:any = null;

        public _cameraRect:egret.Rectangle = null;

        public _gridShape:egret.Shape = null;
        public _cellSize:number = 20;
        public _thumbReady:boolean = false;//缩略图是否准备完毕

        public offsetMap:egret.Point = null;//地图坐标偏移值,在冻结视图状态使用

        private astar:AStar = null;
        private grid:Grid = null;
        public cellSize:number = 25;

        private _isDisplay:boolean = false;//处于显示状态
        private _bitmapContainer:egret.DisplayObjectContainer = null;//显示对象容器
        private _bitmap:egret.Bitmap = null;

        public constructor(mapInfo:Object) {
			super();

            this.offsetMap = new egret.Point();
            this._cameraRect = new egret.Rectangle();
            this._bitmapContainer = new egret.DisplayObjectContainer();
            this.addChild(this._bitmapContainer);
            this._bitmap = new egret.Bitmap();
            this._bitmapContainer.addChild(this._bitmap);
            this._bitmapContainer.scrollRect = this._cameraRect;

            this._enterPoint = new egret.Point();
            //初始化数据
            this.setMapInfo(mapInfo);
            this.showBg = false;
            this.touchEnabled = false;
        }

        /**
         * 设置地图的数据
         * @param mapInfo
         */
        public setMapInfo(mapInfo:any):void {
            if(mapInfo) {
                this._info = mapInfo;
                this._id = mapInfo.id;
                this._mapId = mapInfo.map;
                this._mapWidth = parseInt(mapInfo.width);
                this._mapHeight = parseInt(mapInfo.height);
                this._sceneWidth =  parseInt(mapInfo.scene_width);
                //this._sceneHeight = parseInt(mapInfo.scene_height);
                this._row = mapInfo.row;
                this._column = mapInfo.column;
                this._enterPoint.x = mapInfo.x;
                this._enterPoint.y = mapInfo.y;
                //this._cellSize = mapInfo.cell;
                //this._blockWidth = mapInfo.blockWidth;
                //this._blockHeight = mapInfo.blockHeight;

                this._bitmapContainer.width = this._mapWidth;
                this._bitmapContainer.height = this._mapHeight;

                this._bitmap.texture = RES.getRes("map_img_" + this._mapId);

                //设置寻路点信息
                this.grid = ObjectPool.getObject("map_grid_" + mapInfo.id, false);
                //console.log("map grid=" + this.grid);
                if (!this.grid){
                    var gridDef:any = RES.getRes("map_grid_" + mapInfo.id);
                    if (gridDef) {
                        this.cellSize = gridDef.cell;
                        //console.log("map gridDef=" + gridDef + ", cell=" + this.cellSize);
                        this.grid = new Grid(gridDef.grid, this.cellSize);
                        this.grid.calculateLinks();
                        easy.ObjectPool.setObject("map_grid_" + mapInfo.id, this.grid);
                    }
                }
                if (this.astar == null) this.astar = new easy.rpg.AStar();
            }
        }
        /**
         * 增量移动摄像头
         */  
        public moveCameraStep(xValue:number, yValue:number):void {
            //console.log("map moveCameraStep xValue=" + xValue + ", yValue=" + yValue);
            if (xValue != 0) {
                this._cameraRect.x += xValue;
                if (this._cameraRect.x < 0) this._cameraRect.x = 0;
                if (this._cameraRect.x + this._cameraRect.width > this._bitmapContainer.width)  this._cameraRect.x = this._bitmapContainer.width - this._cameraRect.width;

            }
            if (yValue != 0) {
                this._cameraRect.y += yValue;
                if (this._cameraRect.y < 0) this._cameraRect.y = 0;
                if (this._cameraRect.y + this._cameraRect.height > this._bitmapContainer.height)  this._cameraRect.y = this._bitmapContainer.height - this._cameraRect.height;
            }
            //console.log("map moveCameraStep con.x=" + this._bitmapContainer.x + ", con.y=" + this._bitmapContainer.y + ", rect.x=" + this._cameraRect.x + ", rect.y=" + this._cameraRect.y + ", rect.w=" + this._cameraRect.width + ", rect.h=" + this._cameraRect.height)
            //this.showCameraMap();
        }
        /**
         * 移动摄像头
         */
        public moveCamera(x:number, y:number):void {
            if (x != 0) {
                this._cameraRect.x = x;
                if (this._cameraRect.x < 0) this._cameraRect.x = 0;
                if (this._cameraRect.x + this._cameraRect.width > this._bitmapContainer.width)  this._cameraRect.x = this._bitmapContainer.width - this._cameraRect.width;

            }
            if (y != 0) {
                this._cameraRect.y = y;
                if (this._cameraRect.y < 0) this._cameraRect.y = 0;
                if (this._cameraRect.y + this._cameraRect.height > this._bitmapContainer.height)  this._cameraRect.y = this._bitmapContainer.height - this._cameraRect.height;
            }
            //this.console.log("MapDisplay.moveCamera(" + this._cameraRect.x + ", " + this._cameraRect.x + ")");
        }
        /**
         * 设置摄像跟踪数据
         */  
        public setCamera(w:number , h:number, point:egret.Point = null):void {
            //if (!egret.NumberUtils.isNumber(w)) {
            //    //console.log("Map.setCamera widht is not a number!!!!");
            //}
            //if (!egret.NumberUtils.isNumber(h)) {
            //    console.log("Map.setCamera height is not a number!!!!");
            //}
            this._cameraRect.width = w;
            this._cameraRect.height = h;
            //console.log("Map.setCamera(" + this._cameraRect.width +", " + this._cameraRect.height + ")");

            if (point){
                this.enterPoint = point;
            } else {
                this.enterPoint = this.enterPoint;
            }
            //this._hCircle = Math.ceil((this._cameraRect.height/2)/this._blockHeight) + 1;
            //this._vCircle = Math.ceil((this._cameraRect.width/2)/this._blockWidth) + 1;
        }
        /**
         * 设置地图进入点
         */  
        public set enterPoint(enterValue:egret.Point) {
            if (enterValue) this._enterPoint = enterValue;
            if (this._cameraRect.width == 0 || this._cameraRect.height == 0) return;
            var xPoint:number = this._enterPoint.x - this._cameraRect.width/2;
            var yPoint:number = this._enterPoint.y - this._cameraRect.height/2;
            if (xPoint < 0) xPoint = 0;
            if (yPoint < 0) yPoint = 0;
            if (xPoint > this._mapWidth - this._cameraRect.width) xPoint = this._mapWidth - this._cameraRect.width;
            if (yPoint > this._mapHeight - this._cameraRect.height) yPoint = this._mapHeight - this._cameraRect.height;
            this.moveCamera(xPoint, yPoint);
        }
        
        /**
         * 摄像头显示区域以及坐标
         */  
        public get cameraRect():egret.Rectangle {
            return this._cameraRect;
        }
        /**
         * 地图总高度
         */  
        public get mapHeight():number{
            return this._mapHeight;
        }
        /**
         * 地图总宽度
         */  
        public get mapWidth():number{
            return this._mapWidth;
        }
        /**
         * 把map坐标转换成屏幕坐标
         * @param point map坐标值
         */ 
        public toScreen(point:egret.Point, targetPoint:egret.Point):void{
            targetPoint.x = point.x - this._cameraRect.x + this.offsetMap.x
            targetPoint.y = point.y - this._cameraRect.y + this.offsetMap.y;
        }
        /**
         * 由屏幕左边转换成地图坐标
         * @param x 屏幕x坐标值
         * @param y 屏幕y坐标值
         */  
        public toMap(x:number, y:number, targetPoint?:egret.Point):egret.Point{
            var xpos:number =this._cameraRect.x + x ;
            var ypos:number = this._cameraRect.y + y;
            xpos = Math.min(xpos, this.mapWidth);
            ypos = Math.min(ypos, this.mapHeight);
            if (targetPoint != null) {
                targetPoint.x = xpos;
                targetPoint.y = ypos;
                return targetPoint;
            }
            return new egret.Point(xpos, ypos);
        }
        /**
         * 显示格子号
         */
        public showGrid(grid:Grid):void {
            if (this._gridShape == null) {
                this._gridShape = new egret.Shape();
                this._gridShape.x = 0;
                this._gridShape.y = 0;
            }
            this._gridShape.graphics.clear();
            this._gridShape.graphics.lineStyle(1, 0x30ff60, 0.5);
            var gridRow:number = Math.round(this._mapHeight/this._cellSize);
            var gridColumn:number = Math.round(this._mapWidth/this._cellSize);
            var i:number = 0;
            var j:number = 0 ;
            for (i = 0; i < gridRow; i++) {
                //划线
                this._gridShape.graphics.moveTo(0, i * this._cellSize);
                this._gridShape.graphics.lineTo(this._mapWidth, i * this._cellSize);
            }
            for (j = 0; j < gridColumn; j++) {
                //划线
                this._gridShape.graphics.moveTo(j * this._cellSize, 0);
                this._gridShape.graphics.lineTo(j * this._cellSize, this._mapHeight);
            }
            for (i = 0; i < gridColumn; i++) {
                for (j = 0; j < gridRow; j++) {
                    //写字
                    if (grid.getNode(i,j).walkable){
                        if (grid.getNode(i,j).data == 1) {
                            this._gridShape.graphics.moveTo(i * this._cellSize + this._cellSize/2, j * this._cellSize + this._cellSize/2 - 1);
                            this._gridShape.graphics.lineTo(i * this._cellSize + this._cellSize/2, j * this._cellSize + this._cellSize/2 + 1);
                        } else {
                            var textField:egret.TextField = new egret.TextField();
                            textField.text = "" + grid.getNode(i,j).data;
                            textField.width = this._cellSize;
                            textField.height = this._cellSize;
                            //var bitmapData:BitmapData = new BitmapData(this._cellSize, this._cellSize, true, 0);
                            //bitmapData.draw(textField);
                            //this._gridShape.graphics.beginBitmapFill(bitmapData);
                            //this._gridShape.graphics.drawRect(i * this._cellSize, j * this._cellSize, this._cellSize, this._cellSize);
                            //this._gridShape.graphics.endFill();
                        }
                    } else {
                        this._gridShape.graphics.beginFill(0x00f0f0, 0.3);
                        this._gridShape.graphics.drawRect(i * this._cellSize, j * this._cellSize, this._cellSize, this._cellSize);
                        this._gridShape.graphics.endFill();
                    }
                }
            }
            this._gridShape.graphics.endFill();
            this._gridShape.width = this._mapWidth;
            this._gridShape.height = this._mapHeight;
            this._bitmapContainer.addChild(this._gridShape);
        }
        public get mapId():number {
            return this._mapId;
        }

        public get enterPoint():egret.Point {
            return this._enterPoint;
        }
        /**
         * 进入场景
         */  
        public enter():void {
            this._isDisplay = true;
        }

        /**
         * 出场景
         */
        public outer():void {
            this._isDisplay = false;
        }
        //测试路径时候通过
        public findPath(source:egret.Point, target:egret.Point):Array<egret.Point> {
            if (source.x == target.x && source.y == target.y) {
                return null;
            }
            var startNode:Node = this.getNode(source);
            var endNode:Node = this.getNode(target);
            var targetPoint:egret.Point = target;
            var srcPoint:egret.Point = source;
            if (!startNode.walkable) {
                startNode = this.getNearShortNode(startNode);
                if (startNode)srcPoint = startNode.point;
            }
            if (!endNode.walkable) {
                endNode = this.getNearShortNode(endNode, srcPoint);
                if (endNode)targetPoint = endNode.point;
            }
            if (endNode.walkable) {
                this.grid.setStartNode(startNode.row, startNode.column);
                this.grid.setEndNode(endNode.row, endNode.column);
                if (this.astar.findPath(this.grid)){
                    //平滑处理
                    return this.floydPath(srcPoint, targetPoint, this.astar.path);
                }
            }
            return null;
        }
        /**
         * 查找最近的可行走的格子
         * srcNode 目标格子
         * testPoint 测量距离的point
         * @return
         */
        private getNearShortNode(srcNode:Node, testPoint:egret.Point = null):Node{
            if (!srcNode.walkable){
                //计算最近的格子
                var loopMax:number = 50;//最多循环100次
                var loopIndex:number = 0;
                var xOrg:number =  srcNode.row;
                var yOrg:number =  srcNode.column;
                var nodeFound:Array<Node> = new Array<Node>();
                var tempNode:Node = null;
                while(loopIndex < loopMax) {
                    loopIndex ++;
                    if ((xOrg - loopIndex) >= 0) {
                        if ((yOrg - loopIndex) >= 0) tempNode = this.grid.getNode(xOrg - loopIndex, yOrg - loopIndex);
                        if (srcNode.walkable) nodeFound.push(tempNode);
                        tempNode = this.grid.getNode(xOrg - loopIndex, yOrg);
                        if (tempNode.walkable) nodeFound.push(tempNode);
                        if ((yOrg + loopIndex) < this.grid.numRows ) tempNode = this.grid.getNode(xOrg - loopIndex, yOrg + loopIndex);
                        if (tempNode.walkable) nodeFound.push(tempNode);
                    }

                    if ((yOrg + loopIndex) < this.grid.numRows ) tempNode = this.grid.getNode(xOrg, yOrg + loopIndex);
                    if (tempNode.walkable) nodeFound.push(tempNode);

                    if ((xOrg + loopIndex) < this.grid.numCols ) {
                        if ((yOrg - loopIndex) >= 0) tempNode = this.grid.getNode(xOrg + loopIndex, yOrg - loopIndex);
                        if (tempNode.walkable) nodeFound.push(tempNode);
                        tempNode = this.grid.getNode(xOrg + loopIndex, yOrg);
                        if (tempNode.walkable) nodeFound.push(tempNode);
                        if ((yOrg + loopIndex) < this.grid.numRows ) tempNode = this.grid.getNode(xOrg + loopIndex, yOrg + loopIndex);
                        if (tempNode.walkable) nodeFound.push(tempNode);
                    }

                    if ((yOrg - loopIndex) >= 0) tempNode = this.grid.getNode(xOrg, yOrg - loopIndex);
                    if (tempNode.walkable) nodeFound.push(tempNode);
                    if (nodeFound.length > 0 ) break;
                }
                //测试找到的路点,测量和玩家的直线距离,最近的那个点就是要寻路行走的点
                var distanceOld:number = 0;
                var distanceNew:number = 0;
                var targetPoint:egret.Point = testPoint;
                tempNode = null;
                if (testPoint == null) targetPoint = srcNode.point;
                for (var i:number = 0; i < nodeFound.length; i++) {
                    distanceNew = egret.Point.distance(targetPoint, new egret.Point(nodeFound[i].row, nodeFound[i].column));
                    if (distanceOld == 0) {
                        distanceOld = distanceNew;
                    }
                    if (distanceNew <= distanceOld) tempNode = nodeFound[i];
                }
                return tempNode;
            }
            return srcNode;
        }
        private floydPath(source:egret.Point, target:egret.Point, nodes:Array<Node>):Array<egret.Point> {
            /** 弗洛伊德路径平滑处理 **/
            var floydPath:Array<Node> = nodes.concat();
            var len:number = floydPath.length;
            var i:number = 0;
            if (len > 2) {
                //遍历路径数组中全部路径节点，合并在同一直线上的路径节点
                //假设有1,2,3,三点，若2与1的横、纵坐标差值分别与3与2的横、纵坐标差值相等则
                //判断此三点共线，此时可以删除中间点2
                var vector:Node = new Node(0, 0, 1);
                var tempVector:Node = new Node(0, 0, 1);
                this.floydVector(vector, floydPath[len - 1], floydPath[len - 2]);
                for (i = len - 3; i >= 0; i--) {
                    this.floydVector(tempVector, floydPath[i + 1], floydPath[i]);
                    if (vector.row == tempVector.row && vector.column == tempVector.column) {
                        floydPath.splice(i + 1, 1);
                    } else {
                        vector.row = tempVector.row;
                        vector.column = tempVector.column;
                    }
                }
            }
            len = floydPath.length;
            //合并共线节点后进行第二步，消除拐点操作。算法流程如下：
            //使用两点之间的样本数值,不停的测试直线上的节点是不是可行走区域
            if (len > 2) {
                for (i = len - 3; i >= 0; i--) {
                    if (!this.hasBarrier(floydPath[i + 2], floydPath[i])) {
                        floydPath.splice(i + 1, 1);
                    }
                }
            }
            var result:Array<egret.Point> = new Array<egret.Point>();
            result.push(source);
            for (i = 1; i < floydPath.length - 1; i++) {
                result.push(floydPath[i].point);
            }
            result.push(target);
            floydPath.length = 0;
            return result;
        }
        /**
         * 判断两节点之间是否存在障碍物
         * @param node1
         * @param node2
         * @return
         */
        private hasBarrier(node1:Node, node2:Node):boolean{
            var d:number = Math.abs(egret.Point.distance(node1.point, node2.point));
            var index:number = 1;
            var grid:number = this.cellSize/2;
            var gridPoint:egret.Point = null;
            var gridNode:Node = null;
            //取样点
            //while(index*grid<d){
            //    gridPoint = egret.Point.interpolate(node1.point, node2.point, index*grid/d);
            //    gridNode = this.getNode(gridPoint);
            //    if (!gridNode.walkable) return true;
            //    index ++;
            //}
            return false;
        }
        private floydVector(target:Node, n1:Node, n2:Node):void {
            target.row = n1.row - n2.row;
            target.column = n1.column - n2.column;
        }
        //路点格子
        public getNode(mapPoint:egret.Point):Node {
            var xpos:number = Math.floor(mapPoint.x / this.cellSize);
            var ypos:number = Math.floor(mapPoint.y / this.cellSize);
            xpos = Math.min(xpos, this.grid.numCols - 1);
            xpos = Math.max(xpos, 0);
            ypos = Math.min(ypos, this.grid.numRows - 1);
            ypos = Math.max(ypos, 0);
            return this.grid.getNode(xpos, ypos);
        }
    }
}