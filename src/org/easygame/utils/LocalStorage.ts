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
    export class LocalStorage {
        /**
         * 保存数据
         * @param key 数据的标示
         * @param value 要存储的数据
         */
        public static set(key:string, value:string):boolean {
            return egret.localStorage.setItem(LocalStorage.getStorageName() + key, value);
        }
        /**
         * 保存number数据
         * @param key 数据的标示
         * @param value 要存储的数据
         */
        public static setNumber(key:string, value:number):void {
            LocalStorage.set(key, "" + value);
        }
        /**
         * 保存boolean数据
         * @param key 数据的标示
         * @param value 要存储的数据
         */
        public static setBoolean(key:string, value:boolean):void {
            LocalStorage.set(key, value?"1":"0");
        }
        /**
         * 获取条数据
         * @param key 数据的标示
         */
        public static get(key:string):string {
            return egret.localStorage.getItem(LocalStorage.getStorageName() + key);
        }
        /**
         * 获取number数据
         * @param key 数据的标示
         */
        public static getNumber(key:string):number {
            var value:string = egret.localStorage.getItem(LocalStorage.getStorageName() + key);
            if (StringUtil.isUsage(value)){
                var num:number = parseFloat(value);
                if (!isNaN(num)) {
                    return num;
                }
            }
            return 0;
        }
        /**
         * 获取int数据
         * @param key 数据的标示
         */
        public static getInt(key:string):number {
            var value:string = egret.localStorage.getItem(LocalStorage.getStorageName() + key);
            if (StringUtil.isUsage(value)){
                var num:number = parseInt(value);
                if (!isNaN(num)) {
                    return num;
                }
            }
            return 0;
        }
        /**
         * 获取boolean数据
         * @param key 数据的标示
         */
        public static getBoolean(key:string):boolean {
            var value:string = egret.localStorage.getItem(LocalStorage.getStorageName() + key);
            if (StringUtil.isUsage(value) && (value == "1" || value == "true")){
                return true;
            }
            return false;
        }
        /**
         * 删除一条数据
         * @param moduleName 模块的名称
         * @param key 数据的标示
         */
        public static remvoe(key:string):void {
            egret.localStorage.removeItem(LocalStorage.getStorageName() + key);
        }

        private static _storageName:string = "";

        /**
         * 获取存储名称
         * @returns {string}
         */
        private static getStorageName():string {
            if (LocalStorage._storageName == ""){
                LocalStorage._storageName = (ResManager._projectName != ""?ResManager._projectName:GlobalSetting.APP_NAME) + "_";
            }
            return LocalStorage._storageName;
        }
    }
}