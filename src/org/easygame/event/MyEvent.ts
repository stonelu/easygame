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
    export class MyEvent {
        public callStack:string = null;
        public type:string = null;
        public datas:Object = {};

        /**
         * <p>事件基类构造函数,包含一个参数</p>
         * @param type 事件类型
         */
        public constructor(typeValue:string) {
            this.type = typeValue;
        }

        /**
         *  <p>添加单个对象到结果集中</p>
         *  @param value 要添加的对象
         */

        public addItem(property:string, value:any):void {
            this.datas[property] = value;
        }

        /**
         * 获取property对应的内容
         * @param property
         * @returns {null}
         */
        public getItem(property:string):any {
            if (this.datas.hasOwnProperty(property)){
                return this.datas[property];
            }
            return null;
        }

        /**
         * 查询是否携带了proprty名称的数据
         * @param property
         * @returns {boolean}
         */
        public hasItem(property:string):any {
            return this.datas.hasOwnProperty(property);
        }

        /**
         * 回收对象到对象池中
         */
        public destory():void {
            this.callStack = null;
            for (var item in this.datas) {
                delete this.datas[item];
            }
        }

        /**
         * 删除property名称的数据
         * @param proprty
         */
        public removeItem(property:string):boolean {
            if (this.datas.hasOwnProperty(property)){
                delete this.datas[property];
                return true;
            }
            return false;
        }

        /**
         * 派发event对象
         */
        public send():void {
            EventManager.dispatchEvent(this);
        }

        /**
         * 从对象池中获取一个type类型的event对象
         * @param type
         * @returns {MyEvent}
         */
        public static getEvent(type:string):MyEvent {
            return EventManager.getEvent(type);
        }

        /**
         * 快捷发送一个type类型的event事件
         * @param type
         */
        public static sendEvent(type:string, param:any = null):void {
            EventManager.dispatch(type, param);
        }
    }
}