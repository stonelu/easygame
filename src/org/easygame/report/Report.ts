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
    export class Report {
        private static _loader:egret.URLLoader = null;
        public static _isInit:boolean = false;
        /**
         * channel 渠道
         * ver 版本
         * device 设备
         * time 时间
         * token 随机值
         */
        public static _baseInfo:Object = null;

        /**
         * 通用统计信息
         */
        public static send(data:any, sufixUrl:string = "", token:string = ""):void {
            if (!GlobalSetting.REPORT) {
                return;
            }
            if (!Report._isInit){
                console.log("[error]:report not init!")
                return;
            }
            if (Report._baseInfo == null) {
                console.log("[error]:report not ready!")
                return;
            }
            if (Report._loader == null){
                Report._loader = new egret.URLLoader();
                Report._loader.dataFormat = egret.URLLoaderDataFormat.BINARY;
            }
            if (token && token.length > 0){
                Report._baseInfo["tk"] = Math.round(Math.random()*99999999);//随机token
            } else {
                Report._baseInfo["tk"] = token;//随机token
            }
            Report._baseInfo["ti"] = Date.now();

            var varData:egret.URLVariables = new egret.URLVariables();
            varData.variables = {};

            if(data["getReportData"]) {
                data = data.getReportData();
            }

            for (var key in data){
                //console.log(key + "=" + data[key]);
                if (key != "__class__") {
                    varData.variables[key] = data[key];
                }

            }
            for (var key in Report._baseInfo){
                //console.log(key + "==" + Report._baseInfo[key]);
                if (key != "__class__") {
                    varData.variables[key] = Report._baseInfo[key];
                }
            }

            var req:egret.URLRequest = new egret.URLRequest();
            req.data = varData;//
            req.method = egret.URLRequestMethod.POST;
            req.url = GlobalSetting.REPORT_URL + sufixUrl;
            Report._loader.load(req);
            console.log("[repor]:" + JSON.stringify(req.data));
        }
    }
}