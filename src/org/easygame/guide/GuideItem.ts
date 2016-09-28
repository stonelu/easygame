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

    export class GuideItem {
        public static MASK_NONE:string = "none";//无遮罩
        public static MASK_NORMAL:string = "guide";//通用遮罩
        public static MASK_CROPPING:string = "cropping";//遮幅
        //ID编号
        public id:string = null;
        //节点名称
        public name:string = null;
        //描述
        public desc:string = null;
        //节点类型
        public type:string = null;
        //章节
        public chapter:string = null;
        //目标
        public target:string = null;
        //下一帧
        public next_frame:string = null;
        //下一帧延迟
        public next_delay:number = 0;
        //对话内容
        public text:string = null;
        //点击次数
        public click_num:number = 0;
        //任意点击
        public click_stage:number = 1;
        //旁白
        public aside:boolean = false;
        //水平对齐
        public h_align:string = null;
        //水平偏移量
        public h_pos:number = 0;
        //竖直对齐
        public v_align:string = null;
        //竖直偏移量
        public v_pos:number = 0;
        //肖像id
        public icon:string = null;
        //icon偏移x
        public oxIcon:number = 0;
        //icon偏移y
        public oyIcon:number = 0;
        //win偏移x
        public oxWin:number = 0;
        //win偏移y
        public oyWin:number = 0;
        //肖像k=v数据
        public data:string = null;
        //显示名称
        public nick:string = null;
        //头像镜像
        public mirror:number = 0;
        //显示方式
        public txt_model:string = null;
        //显示速度
        public txt_frame:number = 0;
        //遮罩方式
        public mask:string = null;
        //选项
        public opts:string = null;
        //事件数据
        public event_data:string = null;
        //事件条件
        public event_condition:string = null;

        //新手的句柄
        public handle_type:string = null;
        public handle_path:string = null;
        public handle_data:string = null;
        //handle设定
        //新手的焦点
        public focus_color:string = null;
        public focus_stress:number = 0;
        public focus_gap:number = 0;
        public focus_x:number = 0;
        public focus_y:number = 0;
        public focus_data:string = null;

        public constructor(){
        }

        /**
         * 转义特殊的字符
         */
        public escapeChars():void {
            //name
            this.name = StringUtil.replace(this.name, "{~D!}", ",");
            this.name = StringUtil.replace(this.name, "{~N!}", "\n");
            //nick
            this.nick = StringUtil.replace(this.nick, "{~D!}", ",");
            this.nick = StringUtil.replace(this.nick, "{~N!}", "\n");
            //text
            this.text = StringUtil.replace(this.text, "{~D!}", ",");
            this.text = StringUtil.replace(this.text, "{~N!}", "\n");
            //focuse
            this.focus_color = StringUtil.replace(this.focus_color, "{~D!}", ",");
        }
    }
}