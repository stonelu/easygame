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
    export class MessageControler {
        private static _handles:Array<IHandle> = [];
        private static _eventHandles:Array<string> = [];

        /**
         * 添加数据处理的Handle
         * 逻辑处理模块,需要添加Handle,以便方便的在view刷新前,有限得到数据,预先处理数据
         * @param handle
         */
        public static addHandle(handle:IHandle):void {
            if (handle != null && MessageControler._handles.indexOf(handle) < 0 )MessageControler._handles.push(handle);
        }

        /**
         * 添加弱事件处理
         * 只有注册的时间,当前的view才能收到
         * @param eventName
         */
        public static addEvent(eventName:string):void {
            if (MessageControler._eventHandles.indexOf(eventName) < 0) MessageControler._eventHandles.push(eventName);
        }

        /**
         * MyEvent事件派发
         * @param event
         */
        public static receiveEvent(event:MyEvent):void {
            //console.log("MessageControl onEventData=" + event.type)
            if (MessageControler._eventHandles.indexOf(event.type) >= 0){
                ViewManager.receiveEvent(event);
                var i:number = 0;
                for (i = 0; i < MessageControler._handles.length; i++) {
                    MessageControler._handles[i].receiveEvent(event);
                }
            }
        }

        /**
         * 协议事件派发
         * @param pkt
         */
        public static receivePacket(pkt:any):void {
            //console.log("MessageHandle onPacketData=" + egret.getQualifiedClassName(pkt));
            //优先处理数据的handle
            var i:number = 0;
            for (i = 0; i < MessageControler._handles.length; i++) {
                MessageControler._handles[i].receivePacket(pkt);
            }
            //界面刷新
            ViewManager.receivePacket(pkt);
        }
    }
}