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
    export class HttpUtil{
        public static postData(url:string, data:string, func:any, thisFunc:any):void {
            var request:egret.URLRequest = new egret.URLRequest(url);
            var loader:egret.URLLoader = new egret.URLLoader();
            request.method = egret.URLRequestMethod.POST;
            if (easy.StringUtil.isUsage(data)) request.data = new egret.URLVariables(data);
            loader.addEventListener(egret.Event.COMPLETE, function(event:egret.Event){
                var loader:egret.URLLoader = <egret.URLLoader>event.target;
                func.call(thisFunc, loader.data);
            }, HttpUtil);
            loader.load(request);
        }
        public static getData(url:string, data:string, func:any, thisFunc:any):void {
            var request:egret.URLRequest = new egret.URLRequest(url);
            var loader:egret.URLLoader = new egret.URLLoader();
            request.method = egret.URLRequestMethod.GET;
            if (easy.StringUtil.isUsage(data)) request.data = new egret.URLVariables(data);
            loader.addEventListener(egret.Event.COMPLETE, function(event:egret.Event){
                var loader:egret.URLLoader = <egret.URLLoader>event.target;
                func.call(thisFunc, loader.data);
            }, HttpUtil);
            loader.load(request);
        }
    }
}