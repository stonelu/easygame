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

	export class BinaryHeap {
        public a:Array<Object> = new Array<Object>();
        public justMinFun:Function = function(x:any, y:any):boolean {
            return this.x < this.y;
        };
        
        public constructor(justMinFun:Function = null){
            this.a.push(-1);
            if (justMinFun != null)
                this.justMinFun = justMinFun;
        }
        
        public ins(value:any):void {
            var p:number = this.a.length;
            this.a[p] = value;
            var pp:number = p >> 1;
            while (p > 1 && this.justMinFun(this.a[p], this.a[pp])){
                var temp:any = this.a[p];
                this.a[p] = this.a[pp];
                this.a[pp] = temp;
                p = pp;
                pp = p >> 1;
            }
        }
        
        public pop():any {
            var min:any = this.a[1];
            this.a[1] = this.a[this.a.length - 1];
            this.a.pop();
            var p:number = 1;
            var l:number = this.a.length;
            var sp1:number = p << 1;
            var sp2:number = sp1 + 1;
            while (sp1 < l){
                if (sp2 < l){
                    var minp:number = this.justMinFun(this.a[sp2], this.a[sp1]) ? sp2 : sp1;
                } else {
                    minp = sp1;
                }
                if (this.justMinFun(this.a[minp], this.a[p])){
                    var temp:any = this.a[p];
                    this.a[p] = this.a[minp];
                    this.a[minp] = temp;
                    p = minp;
                    sp1 = p << 1;
                    sp2 = sp1 + 1;
                } else {
                    break;
                }
            }
            return min;
        }
    }
}