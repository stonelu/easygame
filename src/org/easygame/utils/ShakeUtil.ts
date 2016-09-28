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
    export class ShakeUtil {
        public static RandomDirecitonShake:string="RandomDirecitonShake";//随机方向振动
        public static SpecialDirecitonShake:string="SpecialDirecitonShake";//指定方向振动
        public static AngleUnit:number=Math.PI/180;
        public static DegreeUnit:number=180/Math.PI;
        
        private static SC_SHAKE_DATA_DIC:any={};
        /**
         * 振动指定的显示对象
         * 
         * <br />
         * 演示：
         * <br />
         * <p>
         * var disObj:Displayany=...;//显示对象<br />
         * var duration:number=500;//持续500毫秒的时间<br />
         * var amplitude:number=100;//振幅：100<br />
         * var shakeModel:string=Utils.SpecialDirecitonShake;//振动方式：指定方向<br />
         * var shakeDirection:number=90;//单位：度，往垂直向下的方向振动<br />
         * var recoverX:number=0;//振动完后恢复的X，Y位置<br />
         * var recoverY:number=0;<br />
         * var shakeOffsetX:number=2;//振动时的X，Y方向偏移动<br />
         * var shakeOffsetY:number=2;<br />
         * //调用振动API<br />
         * Utils.shake(disObj,duration,amplitude,shakeModel,shakeDirection,recoverX,recoverY,shakeOffsetX,shakeOffsetY);<br />
         * </p>
         * 
         * @param disObj 指定显示对象
         * @param duration 持续时间
         * @param amplitude 振幅
         * @param directionModel 振动模式(随机方向振动：ShakeUtils.RandomDirecitonShake；指定方向振动：ShakeUtils.SpecialDirecitonShake)
         * @param direction 振动方向(当振动模式为：随机模式时，该值可以是任意值)
         * @param recoverX 振动后，恢复的X位置，默认为0
         * @param recoverY 振动后，恢复的Y位置，默认为0
         * 	@param shakeOffsetX 振动时的X方向偏移动，默认为2
         * @param shakeOffsetY 振动时的Y方向偏移动，默认为2
         * @example 下面例子是通过print函数输出信息。
         * <listing version="3.0">
         * var disObj:Displayany=...;//显示对象
         * var duration:number=500;//持续500毫秒的时间
         * var amplitude:number=100;//振幅：100
         * var shakeModel:string=Utils.SpecialDirecitonShake;//振动方式：指定方向
         * var shakeDirection:number=90;//单位：度，往垂直向下的方向振动
         * var recoverX:number=0;//振动完后恢复的X，Y位置
         * var recoverY:number=0;
         * var shakeOffsetX:number=2;//振动时的X，Y方向偏移动
         * var shakeOffsetY:number=2;
         * //调用振动API
         * Utils.shake(disObj,duration,amplitude,shakeModel,shakeDirection,recoverX,recoverY,shakeOffsetX,shakeOffsetY);
         * </listing>
         */
        public static shake(
            disObj:any,
            duration:number,
            amplitude:number,
            directionModel:string,
            direction:number,
            recoverX:number=0,
            recoverY:number=0,
            shakeOffsetX:number=2,
            shakeOffsetY:number=2
        ):void {
            var data:any = {};
            if(ShakeUtil.SC_SHAKE_DATA_DIC.hasOwnProperty(disObj)) {
                data=ShakeUtil.SC_SHAKE_DATA_DIC[disObj];
            } else {
                ShakeUtil.SC_SHAKE_DATA_DIC[disObj] = data;
            }
            
            data.disObj=disObj;
            data.duration=duration;
            data.amplitude=amplitude;
            data.directionModel=directionModel;
            data.direction=direction;
            data.recoverX=recoverX;
            data.recoverY=recoverY;
            data.shakeOffsetX=shakeOffsetX;
            data.shakeOffsetY=shakeOffsetY;
            data.startShakeTime=egret.getTimer();
            data.vx=data.vx?data.vx:0;
            data.vy=data.vy?data.vy:0;
            
            disObj.removeEventListener(egret.Event.ENTER_FRAME,ShakeUtil.onEnterFrameHandler, ShakeUtil);
            disObj.addEventListener(egret.Event.ENTER_FRAME,ShakeUtil.onEnterFrameHandler, ShakeUtil);
        }
        
        private static clamp(value:number,min:number,max:number):number {
            if(value<min)value=min;
            else if(value>max)value=max;
            return value;
        }
        
        private static onEnterFrameHandler(e:any):void {
            var disObj:any=e.target as any;
            
            var data:any=ShakeUtil.SC_SHAKE_DATA_DIC[disObj];
            
            var duration:number=data.duration;
            var amplitude:number=data.amplitude;
            var directionModel:string=data.directionModel;
            var direction:number=data.direction;
            var recoverX:number=data.recoverX;
            var recoverY:number=data.recoverY;
            var shakeOffsetX:number=data.shakeOffsetX;
            var shakeOffsetY:number=data.shakeOffsetY;
            var vx:number=data.vx;
            var vy:number=data.vy;
            
            if((egret.getTimer()-data.startShakeTime)<duration) {
                var offsetX:number=Math.random()*shakeOffsetX-(shakeOffsetX/2);
                var offsetY:number=Math.random()*shakeOffsetY-(shakeOffsetY/2);
                
                var p:egret.Point;
                if(directionModel == ShakeUtil.SpecialDirecitonShake) {
                    p= egret.Point.polar(amplitude,direction*ShakeUtil.AngleUnit);
                } else {
                    p=egret.Point.polar(amplitude,Math.random()*360*ShakeUtil.AngleUnit);
                }
                
                var vx0:number=Math.random()*p.x+(p.x/2);
                var vy0:number=Math.random()*p.y+(p.y/2);
                //				vx+=((100-60)*vx0+(2*60*vx))/(100+60);
                //				vy+=((100-60)*vy0+(2*60*vy))/(100+60);
                vx+=(40*vx0+(120*vx))/160;
                vy+=(40*vy0+(120*vy))/160;
                //				_vy=.25*_vy;//透视，俯视45度
                vx+=offsetX;//加上抖动偏移量
                vy+=offsetY;
                var waveX:number=Math.abs(p.x/2);
                var waveY:number=Math.abs(p.y/2);
                vx=ShakeUtil.clamp(vx,-waveX,waveX);
                vy=ShakeUtil.clamp(vy,-waveY,waveY);
                disObj.x=recoverX+vx;
                disObj.y=recoverY+vy;
            }
            var dx:number=recoverX - disObj.x;
            var dy:number=recoverY -disObj.y;
            vx+=dx*3;
            vy+=dy*3;
            vx*=.3;
            vy*=.3;
            disObj.x+=vx;
            disObj.y+=vy;
            
            if(Math.abs(dx)<0.1)disObj.x=recoverX;
            if(Math.abs(dy)<0.1)disObj.y=recoverY;
            if(dx==0&&dy==0) {
                var tdata:any=ShakeUtil.SC_SHAKE_DATA_DIC[disObj];
                delete ShakeUtil.SC_SHAKE_DATA_DIC[disObj];
                tdata=null;
                disObj.removeEventListener(egret.Event.ENTER_FRAME,ShakeUtil.onEnterFrameHandler, ShakeUtil);
            }
            
            data.vx=vx;
            data.vy=vy;
        }
    }
}