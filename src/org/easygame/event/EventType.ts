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

	export class EventType {
        public static SOCKET_CONNECT:string = "SOCKET_CONNECT";//socket连接完成
        public static SOCKET_DISCONNECT_ERROR:string = "SOCKET_DISCONNECT_ERROR";//socket异常
        public static SOCKET_DISCONNECT:string = "SOCKET_DISCONNECT";//socket连接断开
		public static SOCKET_SEND_SHOW:string = "SOCKET_SEND_SHOW";//socket发送数据显示等待框
		public static SOCKET_SEND_HIDE:string = "SOCKET_SEND_HIDE";//socket发送数据隐藏等待框
		public static SOCKET_SEND_TIMEOUT:string = "SOCKET_SEND_TIMEOUT";//socket发送超时
        
        public static STAGE_RESIZE:string = "STAGE_RESIZE";//屏幕尺寸变化
        public static UI_CONFIG_VOLUME:string = "UI_CONFIG_VOLUME";//声音开关
        public static UI_CONFIG_FULLSCREEN:string = "UI_CONFIG_FULLSCREEN";//全屏信号
        public static UI_LOADER_COMPLETED:string = "UI_LOADER_COMPLETED";//loader下载完成事件
        //动画播放事件
        public static MOVIEWCLIP_PLAY:string = "MOVIEWCLIP_PLAY";//动画播放事件
        public static MOVIEWCLIP_PLAY_END:string = "MOVIEWCLIP_PLAY_END";//动画播放事件
        //debug模式事件
		public static UI_DEBUG_OPEN:string="DEBUG_UI_OPEN";  //debug ui的开启
		public static UI_DEBUG_CLOSE:string="DEBUG_UI_CLOSE";  //debug ui的关闭
        
        public static VOLUME_CHANGED:string = "VOLUME_CHANGED";//音乐开关改变
        
        public static RESOURCE_DOWNLOADED:string = "RESOURCE_DOWNLOADED";//资源下载完成{id:id, group:group}
		public static RESOURCE_PROGRESS:string = "RESOURCE_PROGRESS";//资源下载进度通知
		public static PROJECT_RES_DOWNLOADED:string = "PROJECT_RES_DOWNLOADED";//项目公用资源加载完成

		public static GUIDE_FREEDBACK:string="GUIDE_FREEDBACK";  //通知新手导航管理器专用
		public static GUIDE_END:string="GUIDE_END";  //新手导航向结束
		public static GUIDE_SIMULATE:string="GUIDE_SIMULATE";  //新手导航模拟
		//view enter事件{data=class name}
		public static VIEW_ENTER:string = "VIEW_ENTER";
		//view outer事件{data=class name}
		public static VIEW_OUTER:string = "VIEW_OUTER";
		//win enter事件{data=class name}
		public static WIN_ENTER:string = "WIN_ENTER";
		//win outer事件{data=class name}
		public static WIN_OUTER:string = "WIN_OUTER";

		/**
		 * 新手引导-{"type":0,可接受任务；1,可完成任务。} 
		 */		
		public static GUIDE_TASK_TALKING_NOTIFY:string = "GUIDE_TASK_TALKING_NOTIFY";//任务对话通知
        /**
         * 新手导航参数通知,参数为定制内容
         */        
		public static GUIDE_PARAM_NOTIFY:string = "GUIDE_PARAM_NOTIFY";//新手导航参数通知
		/**
		 * 新手引导-对话面板关闭. 
		 */
		public static GUIDE_WIN_CLOSE_NOTIFY:string = "GUIDE_WIN_CLOSE_NOTIFY";
		public static GUIDE_TASK_CLOSE_NOTIFY:string = "GUIDE_TASK_CLOSE_NOTIFY";
        /**
         * 停止新手引导播放 
         */        
		public static GUIDE_STOP_ITEM:string = "GUIDE_STOP_ITEM";
		
		
		/**
		 * 剧情模式 {"action":value}
		 */		
		public static STORY_TALKING:string = "STORY_TALKING";
		/**
		 * 剧情结束. 
		 */		
		public static STORY_END:string = "STORY_END";

		//guide产生的event执行事件通知
		public static GUIDE_EVENT_EXE:string = "GUIDE_EVENT_EXE";
		//guide 事件执行完毕
		public static GUIDE_EVENT_END:string = "GUIDE_EVENT_END";
        //剧情章节结束
		public static GUIDE_CHAPTER_END:string = "GUIDE_CHAPTER_END";
        //声音结束
        public static SOUND_COMPLETE:string = "SOUND_COMPLETE";
		public static SOUND_STOP:string = "SOUND_STOP";
		//视频结束
		public static VIDEO_END:string = "VIDEO_END";
    }
}