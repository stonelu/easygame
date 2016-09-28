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

	export class Grid {
        private _startNode:Node = null;
        private _endNode:Node = null;
        private _nodes:Array<Array<Node>> = null;
        private _numCols:number = 0;
        private _numRows:number = 0;
        private _cellSize:number = 20;
        
        private type:number = 0;
        
        private _straightCost:number = 1.0;
        private _diagCost:number = Math.SQRT2;
        
        public constructor(gridData:Array<any>, cellSize:number = 0){
            this._numRows = gridData.length;
            this._numCols = gridData[0].length;
            this._cellSize = cellSize;
            this._nodes = new Array<Array<Node>>();
            
            for (var i:number = 0; i < this._numCols; i++){
                this._nodes[i] = new Array<Node>();
                for (var j:number = 0; j < this._numRows; j++){
                    this._nodes[i][j] = new Node(i, j, gridData[j][i]);
                    this._nodes[i][j].point.x = i * this._cellSize + this._cellSize/2;
                    this._nodes[i][j].point.y = j * this._cellSize + this._cellSize/2;
                }
            }
        }
        
        public get cellSize():number {
            return this._cellSize;
        }

        /**
         *
         * @param	type	0四方向 1八方向 2跳棋
         */
        public calculateLinks(type:number = 0):void {
            this.type = type;
            for (var i:number = 0; i < this._numCols; i++){
                for (var j:number = 0; j < this._numRows; j++){
                    this.initNodeLink(this._nodes[i][j], type);
                }
            }
        }
        
        public getType():number {
            return this.type;
        }
        
        /**
         *
         * @param	node
         * @param	type	0八方向 1四方向 2跳棋
         */
        private initNodeLink(node:Node, type:number = 0):void {
            var startX:number = Math.max(0, node.row - 1);
//            var endX:int = Math.min(numCols - 1, node.row);
            var endX:number = Math.min(this.numCols - 1, node.row + 1);
            
            var startY:number = Math.max(0, node.column - 1);
//            var endY:int = Math.min(numRows - 1, node.column);
            var endY:number = Math.min(this.numRows - 1, node.column + 1);
            
            node.links = new Array<Link>();
            for (var i:number = startX; i <= endX; i++){
                for (var j:number = startY; j <= endY; j++){
                    var test:Node = this.getNode(i, j);
                    if (test == node || !test.walkable){
                        continue;
                    }
                    if (type != 2 && i != node.row && j != node.column){
                        var test2:Node = this.getNode(node.row, j);
                        if (!test2.walkable){
                            continue;
                        }
                        test2 = this.getNode(i, node.column);
                        if (!test2.walkable){
                            continue;
                        }
                    }
                    var cost:number = this._straightCost;
                    if (!((node.row == test.row) || (node.column == test.column))){
                        if (type == 1){
                            continue;
                        }
                        if (type == 2 && (node.row - test.row) * (node.column - test.column) == 1){
                            continue;
                        }
                        if (type == 2){
                            cost = this._straightCost;
                        } else {
                            cost = this._diagCost;
                        }
                    }
                    node.links.push(new Link(test, cost));
                }
            }
        }
        
        public getNode(x:number, y:number = 0):Node {
            return this._nodes[x][y];
        }
        
        public setEndNode(x:number, y:number = 0):void {
            this._endNode = this._nodes[x][y];
        }
        
        public setStartNode(x:number, y:number = 0):void {
            this._startNode = this._nodes[x][y];
        }
        
        public setWalkable(x:number, y:number, value:boolean):void {
            this._nodes[x][y].walkable = value;
        }
        
        public get endNode():Node {
            return this._endNode;
        }
        
        public get numCols():number {
            return this._numCols;
        }
        
        public get numRows():number {
            return this._numRows;
        }
        
        public get startNode():Node {
            return this._startNode;
        }
    }
}