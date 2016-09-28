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
    export class DateUtil{
        /**
         * 两个时间的差值
         * @param startTime 毫秒
         * @param endTime 毫秒
         * return 返回格式化好的差值,格式化到秒
         */
        public static getDateDiff(startTime:number, endTime:number):string {
            var difArr:Array<number> = DateUtil.getDateDiffArr(startTime, endTime);
            var str:string = "";
            if (difArr[0] > 0) str += difArr[0] + "天";
            if (difArr[1] > 0) str += difArr[1] + "小时";
            if (difArr[2] > 0) str += difArr[2] + "分";
            if (difArr[3] > 0) str += difArr[3] + "秒";
            return str;
        }

        /**
         * 两个时间的差值
         * @param startTime 毫秒
         * @param endTime 毫秒
         * @returns {number[天,小时,分,秒]}
         */
        public static getDateDiffArr(startTime:number, endTime:number):Array<number> {
            var diffValue:number = Math.abs(endTime - startTime);
            //计算出相差天数
            var days=Math.floor(diffValue/(24*3600*1000));
            //console.log("datas=" + days);

            //计算出小时数
            var leave1=diffValue%(24*3600*1000);    //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000));
            //console.log("leave1=" + leave1);
            //console.log("hours=" + hours);

            //计算相差分钟数
            var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000));
            //console.log("leave2=" + leave2);
            //console.log("minutes=" + minutes);

            //计算相差秒数
            var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
            var seconds=Math.round(leave3/1000);
            //console.log("leave3=" + leave3);
            //console.log("seconds=" + seconds);
            return [days, hours, minutes, seconds];
        }


        /**
         * 格式化时间
         * @param timer
         * @param formate  ":"  00:00  "."  00:00
         * @returns {string}
         */
        public static formatTime(timer:number, formate:string = ":"):string {
            var str:string = "";
            var minute:number = Math.floor(timer/60);
            if (minute < 10) {
                str = "0" + minute;
            } else {
                str = "" + minute;
            }
            str += formate;
            var second:number = Math.floor(timer%60);
            if (second < 10){
                str += "0" + second;
            } else {
                str += "" + second;
            }
            return str;
        }

        /**
         * 将 Date 转化为指定格式的String
         * @param date
         * @param fmt "yyyy-M-d h:m:s.S" ==> 2006-7-2 8:9:4.18   "yyyy-MM-dd hh:mm:ss.S" ==> 2006-07-02 08:09:04.423
         * @returns {string}
         */
        public static dateFormat(date:Date, fmt:string):string {
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }
}