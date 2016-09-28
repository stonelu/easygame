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
     * 新手执行管理器
     */
    export class GuideExecuteManager {
        private _condition:string = "befor";//befor after
        private _item:GuideItem = null;
        private _currentClz:any = null;//当前窗口类
        //剧情结束的时候,需要回调的无参数function
        private _completeCallFunc:Function = null;//
        private _completeCallFuncThis:any = null;//
        public constructor(){
            EventManager.addEventListener(easy.EventType.GUIDE_EVENT_END, this.onMyEventGuideExecuteEnd, this);
        }

        /**
         * 事件执行完毕
         * @param myEvent
         */
        private onMyEventGuideExecuteEnd(myEvent:MyEvent):void {
            if (this._item && this._item.id == myEvent.getItem("item_id")) {
                if (this._condition == "befor"){
                    GuideManager.playItem(this._item, this._currentClz, this._completeCallFunc, this._completeCallFuncThis, false)
                } else {
                    GuideManager.currentItem = this._item;
                    GuideManager._completeCallFunc = this._completeCallFunc;
                    GuideManager._completeCallFuncThis = this._completeCallFuncThis;
                    GuideManager.currentClz = this._currentClz;
                    GuideManager.playNextItem(false);
                }
                this._item = null;
                this._completeCallFunc = null;
                this._completeCallFuncThis = null;
                this._currentClz = null;
            }
        }

        /**
         * 节点前执行事件
         * @returns {boolean}
         */
        public executeBefor(item:GuideItem, clz:any = null, completeCallFunc:Function = null, thisFunc:any = null):void {
            if (easy.StringUtil.isUsage(item.event_data)){
                this._condition = "befor";
                this._item = item;
                this._completeCallFunc = completeCallFunc;
                this._completeCallFuncThis = thisFunc;
                this._currentClz = clz;
                var myEvent:MyEvent = MyEvent.getEvent(easy.EventType.GUIDE_EVENT_EXE);
                myEvent.addItem("event_data", item.event_data);
                myEvent.addItem("item_id", item.id);
                myEvent.send();
            }
        }
        /**
         * 节点后执行事件
         * @returns {boolean}
         */
        public executeAfter(item:GuideItem, clz:any = null, completeCallFunc:Function = null, thisFunc:any = null):void {
            if (easy.StringUtil.isUsage(item.event_data)){
                this._condition = "after";
                this._item = item;
                this._completeCallFunc = completeCallFunc;
                this._completeCallFuncThis = thisFunc;
                this._currentClz = clz;
                var myEvent:MyEvent = MyEvent.getEvent(easy.EventType.GUIDE_EVENT_EXE);
                myEvent.addItem("event_data", item.event_data);
                myEvent.addItem("item_id", item.id);
                myEvent.send();
            }
        }
    }
}