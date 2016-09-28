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
     * 这个是一个点对点的事件派发管理器
     * 系统的逻辑事件和协议事件,都会经过这里派发出去
     * 集中控制的好处是,可以插入一些预处理,过滤和控制流程
     */
    export class EventManager {
        /**
         * 协议的的事件,会自动加一个前缀
         * @type {string}
         */
        public static PREFIX:string = "PKT_";
        /**
         * 协议事件的监听列表
         * @type {{}}
         */
        public static packetEventList:Object = {};//server event list
        /**
         * 逻辑时间的监听列表
         * @type {{}}
         */
        private static commEventList:Object = {};//comm event list
        /**
         * 事件回收池
         */
        private static eventCachePool:Object = {};
        /**
         * 需要发送的事件列表
         * 用来解耦同步调用
         */
        private static eventSendCacheList:Array<MyEvent> = [];

        /**
         * 协议回收池
         */
        public static packetCachePool:Object = {};
        /**
         * 需要发送的协议列表
         * 用来解耦同步调用
         */
        private static packetSendCacheList:Array<any> = [];

        //packet工厂类
        public static packetFactory:any = null;
        /**
         * 取得一个对应id的协议包
         * @param messageId 命令id号
         * @param clientSide true:客户端协议,false:服务器端协议(针对客户端和服务器端的id号一样的情况)
         */
        public static getPacket(messageId:number, clientSide:boolean = true):any {
            var packetArray:Array<any> = EventManager.packetCachePool[(clientSide ? "c_" : "s_") + messageId];
            if (packetArray == null) {
                packetArray = new Array<any>();
                EventManager.packetCachePool[(clientSide ? "c_" : "s_") + messageId] = packetArray;
            }
            if (packetArray.length == 0 && EventManager.packetFactory) {
                return EventManager.packetFactory.createPacket(messageId, clientSide);
            }
            return packetArray.shift();
        }

        public static releasePacket(packet:any):void {
            var packetArray:Array<any> = EventManager.packetCachePool[(packet.clientSide ? "c_" : "s_") + packet.header.messageId];
            if (packetArray == null) {
                packetArray = new Array<any>();
                EventManager.packetCachePool[(packet.clientSide ? "c_" : "s_") + packet.header.messageId] = packetArray;
            }
            //清理残余数据
            packet.destory();
            packetArray.push(packet);
        }
        /**
         * 获取一个type类型的事件对象
         * 如果事件对象池中有回收的同类型事件对象,优先使用
         * @param type
         * @returns {*}
         */
        public static getEvent(type:string):MyEvent {
            var eventArray:Array<MyEvent> = EventManager.eventCachePool[type];
            if (eventArray == null) {
                eventArray = [];
                EventManager.eventCachePool[type] = eventArray;
            }
            if (eventArray.length == 0) {
                return new MyEvent(type);
            }
            return eventArray.pop();
        }

        /**
         * 释放一个时间对象回事件对象池
         * @param e
         */
        public static releaseEvent(e:MyEvent):void {
            var eventArray:Array<MyEvent> = EventManager.eventCachePool[e.type];
            if (eventArray == null) {
                eventArray = [];
                EventManager.eventCachePool[e.type] = eventArray;
            }
            //清理残余数据
            e.destory();
            eventArray.push(e);
        }

        /**
         * <p>添加packet包事件响应service</p>
         * @param serverId 服务器id
         * @param service  服务器id对应的响应service
         */
        public static addPacketEvent(messageId:number, response:Function, thisArg:any):void {
            if (response == null || EventManager.isContainerPacketEventListener(messageId, response, thisArg)) return;
            var serverList:Array<any> = null;
            serverList = EventManager.packetEventList[EventManager.PREFIX + messageId];
            if (serverList == null) {
                serverList = new Array<Function>();
                EventManager.packetEventList[EventManager.PREFIX + messageId] = serverList;
            }
            serverList.push({func:response, owner:thisArg});
        }

        public static removePacketEvent(messageId:number, response:Function, thisArg:any):void {
            if (response == null || !EventManager.isContainerPacketEventListener(messageId, response, thisArg)) return;
            var listenerList:Array<Function> = EventManager.packetEventList[EventManager.PREFIX + messageId];
            if (listenerList)
                for (var i:number = 0; i < listenerList.length; i++) {
                    if (listenerList[i]["func"] == response && listenerList[i]["owner"] == thisArg) {
                        listenerList.splice(i, 1);
                        break;
                    }
                }
        }

        //同一事件类型,是否包含相同的响应方法
        private static isContainerPacketEventListener(messageId:number, response:Function, thisArg:any):boolean {
            var listenerList:Array<Function> = EventManager.packetEventList[EventManager.PREFIX + messageId];
            if (listenerList != null) {
                for (var i:number = 0; i < listenerList.length; i++) {
                    if (listenerList[i]["func"] == response && listenerList[i]["owner"] == thisArg) {
                        return true;
                    }
                }
            }
            return false;
        }

        /**
        *  <p>派发packet事件响应到service<br>
        *  再由service对注册其中的方法进行派发</p>
        *  @param packet 要派发的包实例
        */
        public static dispactchPacket(packet:any):void {
            if (packet != null) {
                this.packetSendCacheList.push(packet);
                HeartBeat.addListener(EventManager, EventManager.onFireDispactchPacket);
            };
        }

        /**
         * 队列派发协议
         */
        private static onFireDispactchPacket():void {
            if (EventManager.packetSendCacheList.length > 0 ){
                var packet:any = EventManager.packetSendCacheList.shift();
                //console.log("@@@@@@dispactchPacket=" + egret.getQualifiedClassName(packet));
                //优先handle处理数据
                MessageControler.receivePacket(packet);
                var serverList:Array<Function> = EventManager.packetEventList[EventManager.PREFIX + packet.header.messageId];
                if (serverList != null) {
                    var length:number = serverList.length;
                    for (var i:number = 0; i < length; i++) {
                        var service:Function = serverList[i];
                        serverList[i]["func"].call(serverList[i]["owner"], packet);
                    }
                    EventManager.releasePacket(packet);
                }
            }
            if (this.packetSendCacheList.length == 0 ){
                HeartBeat.removeListener(EventManager, EventManager.onFireDispactchPacket);
            }
        }

        /**
         * 无参数的事件快捷派发
         * @param type 事件的类型
         */
        public static dispatch(type:string, param:any = null):void {
            var myEvent:MyEvent = EventManager.getEvent(type);
            if (param) {
                var value:any = null;
                for (var key in param){
                    //console.log(key + "=" + data[key]);
                    if (key != "__class__" && key != "hashCode" && key != "__types__" && key != "__proto__") {
                        value = param[key];
                        if (!(value instanceof  Function)) {
                            myEvent.addItem(key, value);
                        }
                    }
                }
            }
            EventManager.dispatchEvent(myEvent);
        }

        /**
         * 事件派发
         * @param event 要派发的事件对象
         */
        public static dispatchEvent(e:MyEvent):void {
            if (e != null){
                EventManager.eventSendCacheList.push(e);
                HeartBeat.addListener(EventManager, EventManager.onFiredispatchEvent);
            }
        }

        /**
         * 队列派发事件
         * @param e
         */
        private static onFiredispatchEvent():void {
            if(EventManager.eventSendCacheList.length > 0 ){
                var e:MyEvent = EventManager.eventSendCacheList.shift();
                MessageControler.receiveEvent(e);
                var listenerList:Array<any> = EventManager.commEventList[e.type];
                if (listenerList != null) {
                    for (var i:number = listenerList.length - 1; i >= 0; i--) {
                        listenerList[i]["func"].call(listenerList[i]["owner"], e);
                    }
                }
                EventManager.releaseEvent(e);
            }
            if (EventManager.eventSendCacheList.length  == 0) {
                HeartBeat.removeListener(EventManager, EventManager.onFiredispatchEvent);
            }
        }

        /**
         * 移除事件监听
         * @param eventType 事件的类型
         * @param respone 对应的call back function
         * @param thisArg 方法所在的this对象
         */
        public static removeEventListener(eventType:string, response:Function, thisArg:any):void {
            var listenerList:Array<Function> = EventManager.commEventList[eventType];
            if (listenerList != null) {
                for (var i:number = 0; i < listenerList.length; i++) {
                    if (listenerList[i]["func"] == response && listenerList[i]["owner"] == thisArg) {
                        listenerList.splice(i, 1);
                        break;
                    }
                }
            }
        }

        /**
         * 添加时间监听
         * @param eventType 事件的类型
         * @param respone 对应的call back function
         * @param thisArg 方法所在的this对象
         */
        public static addEventListener(eventType:string, response:Function, thisArg:any):void {
            if (response == null || EventManager.isContainerEventListener(eventType, response, thisArg)) return;
            var listenerList:Array<any> = EventManager.commEventList[eventType];
            if (listenerList == null) {
                listenerList = new Array<any>();
                EventManager.commEventList["" + eventType] = listenerList;
            }
            listenerList.push({func: response, owner: thisArg});
        }

        /**
         * 同样的事件监听是否已经存在,防止二次添加
         * @param eventType 事件的类型
         * @param respone  对应的call back function
         * @param thisArg  方法所在的this对象
         * @returns {boolean}  true:已经存在, false:不存在
         */
        private static isContainerEventListener(eventType:string, response:Function, thisArg:any):boolean {
            var listenerList:Array<any> = EventManager.commEventList["" + eventType];
            if (listenerList != null) {
                for (var i:number = 0; i < listenerList.length; i++) {
                    if (listenerList[i]["func"] == response && listenerList[i]["owner"] == thisArg) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}