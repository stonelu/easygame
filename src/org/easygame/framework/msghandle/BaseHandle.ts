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
    /**
     * 数据集中处理
     */
    export class BaseHandle implements IHandle{
        public METHOD_DEF:Object = {};//消息和方法的映射关系表
        public EVENT_DEF:Array<string> = [];
        public constructor() {
            this.initWeekListener();
        }

        /**
         * 初始化弱监听
         * 子类可以覆写这个,添加数据
         */
        public initWeekListener():void {

        }

        /**
         * 添加事件的处理
         * 如果没有对应的的类型在此出现,则改Handle对Event事件到此为止,不再派发,防止造成事件死循环
         * @param type MyEvent事件的类型
         */
        public addHandleEvent(type:string, funcName:string):void {
            if (this.EVENT_DEF.indexOf(type) < 0) {
                this.EVENT_DEF.push(type);
                this.METHOD_DEF[type] = funcName;
            }
        }

        /**
         * 添加协议处理的Handle,注意,functName的名称,前缀onPacket不包含
         * @param msgId packet协议号
         * @param func  对应的call back function,不包含onPacket前缀
         */
        public addHandlePacket(msgId:number, funcName:string):void {
            this.METHOD_DEF[""+msgId] = funcName;
            //console.log("BaseHandle ADD METHOD_DEF=" + msgId + ", funcName=" + funcName);
        }

        /**
         * 接收到服务器的控制信号
         * call function的时候,会自动前缀onPacket
         * @param packet
         */
        public receivePacket(packet:any):void {
            //console.log("BaseHandle onPacketData=" + egret.getQualifiedClassName(this) + ", has=" + this.METHOD_DEF.hasOwnProperty("" + packet.header.messageId));
            if (this.METHOD_DEF.hasOwnProperty("" + packet.header.messageId))this["onPacket" + this.METHOD_DEF["" + packet.header.messageId]].call(this, packet);
        }

        /**
         * 事件派发
         * call function的时候,会自动前缀onEvent
         * @param event
         */
        public receiveEvent(event:MyEvent):void {
            if (this.EVENT_DEF.indexOf(event.type) >= 0) {
                if (this.METHOD_DEF.hasOwnProperty(event.type)) this["onEvent" + this.METHOD_DEF[event.type]].call(this, event);
            }
        }
    }
}