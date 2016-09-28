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
    export class UUID {
        /**
         * 生成一个36位长度的uuid标识
         * @returns {string}
         */
        public static newUUID():string {
            var new4Data = () => {
                var max:number = Math.pow(16, 4) - 1;
                var newNum:number = Math.floor(Math.random() * max);
                var newNumToStr:string = newNum.toString(16);
                while (newNumToStr.length < 4) {
                    newNumToStr = "0" + newNumToStr;
                }
                return newNumToStr;
            };

            var data1:string = new4Data() + new4Data();
            var data2:string = new4Data();
            var data3:string = new4Data();
            var data4:string = new4Data();
            var data5:string = new4Data() + new4Data() + new4Data();

            return data1 + "-" + data2 + "-" + data3 + "-" + data4 + "-" + data5;
        }

        /**
         * 获取url中的参数值
         * @param name
         * @returns {*}
         */
        public static getUrlByName(name:string):string {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            if (location) {
                var r = location.search.substr(1).match(reg);
                if (r != null) {
                    return decodeURI(decodeURIComponent(decodeURI(r[2])));
                }
            }
            return "";
        }
    }
}