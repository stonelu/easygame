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
    export class ReportShop {
        public id:number = 0;//商店编号
        public orderId:string = "";//订单号,对账
        public name:string = "";    //付费点
        public rmb:number = 0;     //费用
        public type:string = "";     //类型
        //结果
        public state:string = "";//订单状态
        public msg:string = "";//订单返回描述

        public ext1:string = "";//备用1
        public ext2:string = "";//备用2

        public constructor() {
        }
        /**
         * 生成统计的form数据
         * @param obj
         */
        public getReportData():any {
            var obj:any = {};
            obj.sid = this.id; //商店编号
            obj.un = this.name;  //付费点
            obj.rmb =  this.rmb;//人民币
            obj.tp = this.type;//类型

            obj.oid = this.orderId;//订单号
            obj.st = this.state;//订单状态
            obj.msg = this.msg;//订单返回描述
            obj.e1 = this.ext1;//备用1
            obj.e2 = this.ext2;//备用2
            for (var key in this){
                if (key != "id" && key != "name" && key != "rmb" && key != "type" && key != "getReportData" && key != "__class__") {
                    obj[key] = this[key];
                }
            }
            return obj;
        }
    }
}