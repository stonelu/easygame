/**
 * Created by Administrator on 2016-06-20.
 */
module easy{
    export class TweenEffect{
        /**
         * 设置对象注册点
         * @param object
         * @param anchorX
         * @param anchorY
         */
        public static setAnchorXY(object:easy.BaseGroup,anchorX:number = 0.5,anchorY:number = 0.5):void{
            object.anchorEnabled = true;
            object.x += (anchorX - object.anchorX) * object.scaleX * object.width;
            object.y += (anchorY - object.anchorY) * object.scaleY * object.height;
            object.anchorX = anchorX;
            object.anchorY = anchorY;
        }
        /**
         * 从小到大
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static magnifyEffect(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> = [
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "alpha": 1
                    }
                }
            ];
            object.scaleX = object.scaleY = object.alpha = 0;
            var total:number = total ? total : 300;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 重置元素
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static restoreEffect(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =  [
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1,
                        "skewX": 0,
                        "skewY": 0,
                        "scaleX": 1,
                        "scaleY": 1,
                        "rotation": 0
                    }
                }
            ];
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 从大到小淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static shrinkEffect(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> = [
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 0,
                        "scaleY": 0,
                        "alpha": 0
                    }
                }
            ];
            object.scaleX = object.scaleY = object.alpha = 1;
            var total:number = total ? total : 300;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 左右飘动，alpha忽隐忽现
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static flutterEffect(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> = [
                {
                    "percent": 0.25,
                    "attr": {
                        "alpha": 0,
                        "anchorX": 1
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "alpha": 1,
                        "anchorX": 0
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "alpha": 0,
                        "anchorX": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1,
                        "anchorX": 0
                    }
                }
            ];
            object.anchorX = object.alpha = 0;
            var total:number = total ? total : 6000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向右下角轻微缩小，再返回
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static flutterPositionEffect(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> = [
                {
                    "percent": 0.4,
                    "attr": {
                        "anchorX": -0.3,
                        "anchorY": -0.2,
                        "scaleX": 0.9,
                        "scaleY": 0.9,
                        "alpha": 0.7
                    }
                },
                {
                    "percent": 0.8,
                    "attr": {
                        "anchorX": -0.2,
                        "anchorY": -0.1,
                        "scaleX": 0.95,
                        "scaleY": 0.95,
                        "alpha": 0.9
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorX": 0,
                        "anchorY": 0,
                        "scaleX": 1,
                        "scaleY": 1,
                        "alpha": 1
                    }
                }
            ];
            object.anchorX = object.anchorY = 0;
            object.scaleX = object.scaleY = object.alpha = 1;
            var total:number = total ? total : 6000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 淡入
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeInEffect(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> = [
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 0;
            var total:number = total ? total : 500;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }

        /**
         * 左侧淡入
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeInLeft(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1,
                        "anchorOffsetX": 0
                    }
                }
            ];
            object.alpha = 0;
            object.anchorOffsetX = 50;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }

        /**
         * 右侧淡入
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeInRight(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1,
                        "anchorOffsetX": 0
                    }
                }
            ];
            object.alpha = 0;
            object.anchorOffsetX = - 50;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 下侧淡入
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeInUp(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1,
                        "anchorOffsetY": 0
                    }
                }
            ];
            object.alpha = 0;
            object.anchorOffsetY = - 50;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }

        /**
         * 下侧淡入
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeInDown(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1,
                        "anchorOffsetY": 0
                    }
                }
            ];
            object.alpha = 0;
            object.anchorOffsetY = 50;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeOut(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 0,
                    }
                }
            ];
            object.alpha = 1;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 左侧淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeOutLeft(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 0,
                        "anchorOffsetX": 50
                    }
                }
            ];
            object.alpha = 1;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 左侧淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeOutRight(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 0,
                        "anchorOffsetX": - 50
                    }
                }
            ];
            object.alpha = 1;
            object.anchorOffsetX = 0;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 下侧淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeOutDown(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 0,
                        "anchorOffsetY": - 50
                    }
                }
            ];
            object.alpha = 1;
            object.anchorOffsetY = 0;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 下侧淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static fadeOutUp(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 0,
                        "anchorOffsetY": 50
                    }
                }
            ];
            object.alpha = 1;
            object.anchorOffsetY = 0;
            var total:number = total ? total : 800;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 左右快速晃动
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static shake(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.22,
                    "attr": {
                        "anchorX": 0.1
                    }
                },
                {
                    "percent": 0.44,
                    "attr": {
                        "anchorX": -0.1
                    }
                },
                {
                    "percent": 0.66,
                    "attr": {
                        "anchorX": 0.1
                    }
                },
                {
                    "percent": 0.88,
                    "attr": {
                        "anchorX": -0.1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorX": 0
                    }
                }
            ];
            var total:number = total ? total : 450;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向上压扁
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static skip(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.25,
                    "attr": {
                        "scaleY": 0.8
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "scaleY": 1.2
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "scaleY": 0.8
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "scaleY": 1
                    }
                }
            ];
            object.scaleY = 1;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向下淡化再复位，最终alpha为透明
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static arrowDown(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.5,
                    "attr": {
                        "alpha": 1,
                        "anchorY": -0.5
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 0.3,
                        "anchorY": 0
                    }
                }
            ];
            object.alpha = 1;
            object.anchorY = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向上淡化再复位
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static arrowUp(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.5,
                    "attr": {
                        "alpha": 0.3,
                        "anchorY": 0.5
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1,
                        "anchorY": 0
                    }
                }
            ];
            object.alpha = 1;
            object.anchorY = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向右淡化再复位
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static arrowRight(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.5,
                    "attr": {
                        "alpha": 0.3,
                        "anchorX": -0.5
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1,
                        "anchorX": 0
                    }
                }
            ];
            object.alpha = 1;
            object.anchorX = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向左淡化再复位
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static arrowLeft(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.5,
                    "attr": {
                        "alpha": 1,
                        "anchorX": 0.5
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 0.3,
                        "anchorX": 0
                    }
                }
            ];
            object.alpha = 1;
            object.anchorX = 0;
            easeFunName = "backIn";
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 忽隐忽现
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static flash(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.25,
                    "attr": {
                        "alpha": 0.4
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "alpha": 0.9
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "alpha": 0.2
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 1;
            var total:number = total ? total : 2000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 忽隐忽现入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static flashIn(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.25,
                    "attr": {
                        "alpha": 0
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "alpha": 0
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 1;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 忽隐忽现退场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static flashOut(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            object.anchorEnabled = true;
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.25,
                    "attr": {
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "alpha": 0
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "alpha": 0
                    }
                }
            ];
            object.alpha = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 旋转一周
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rotation(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            total = total ? total : 1000;
            if(easeFunName){
                var easeFun:Function = eval("egret.Ease." + easeFunName);
            }else{
                easeFun = null;
            }
            egret.Tween.get(object,{loop:isLoop}).wait(delay).to({rotation:object.rotation + 360},total,easeFun);
        }
        /**
         * 旋转入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rotationIn(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            total = total ? total : 500;
            if(easeFunName){
                var easeFun:Function = eval("egret.Ease." + easeFunName);
            }else{
                easeFun = null;
            }
            object.rotation = object.scaleX = object.scaleY = object.alpha = 0;
            egret.Tween.get(object,{loop:isLoop}).wait(delay).to({rotation:object.rotation + 360,scaleX:1,scaleY:1,alpha:1},total,easeFun);
        }
        /**
         * 旋转退场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rotationOut(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            total = total ? total : 500;
            if(easeFunName){
                var easeFun:Function = eval("egret.Ease." + easeFunName);
            }else{
                easeFun = null;
            }
            object.rotation = 0;
            object.scaleX = object.scaleY = object.alpha = 1;
            egret.Tween.get(object,{loop:isLoop}).wait(delay).to({rotation:object.rotation + 360,scaleX:0,scaleY:0,alpha:0},total,easeFun);
        }
        /**
         * 从左旋转入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rotationInLeft(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            total = total ? total : 500;
            if(easeFunName){
                var easeFun:Function = eval("egret.Ease." + easeFunName);
            }else{
                easeFun = null;
            }
            object.rotation = 30;
            object.alpha = 0;
            egret.Tween.get(object,{loop:isLoop}).wait(delay).to({rotation:0,alpha:1},total,easeFun);
        }
        /**
         * 从右旋转入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rotationInRight(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            total = total ? total : 500;
            if(easeFunName){
                var easeFun:Function = eval("egret.Ease." + easeFunName);
            }else{
                easeFun = null;
            }
            object.rotation = - 30;
            object.alpha = 0;
            egret.Tween.get(object,{loop:isLoop}).wait(delay).to({rotation:0,alpha:1},total,easeFun);
        }
        /**
         * 向左侧旋转淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rotationOutLeft(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            total = total ? total : 500;
            if(easeFunName){
                var easeFun:Function = eval("egret.Ease." + easeFunName);
            }else{
                easeFun = null;
            }
            object.rotation = 0;
            object.alpha = 1;
            egret.Tween.get(object,{loop:isLoop}).wait(delay).to({rotation:30,alpha:0},total,easeFun);
        }
        /**
         * 向右侧旋转淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rotationOutRight(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            total = total ? total : 500;
            if(easeFunName){
                var easeFun:Function = eval("egret.Ease." + easeFunName);
            }else{
                easeFun = null;
            }
            object.rotation = 0;
            object.alpha = 1;
            egret.Tween.get(object,{loop:isLoop}).wait(delay).to({rotation:- 30,alpha:0},total,easeFun);
        }
        /**
         * 微微放大晃动再复位
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static scaleOutRock(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> =[
                {
                    "percent": 0.1,
                    "attr": {
                        "scaleY": 0.9,
                        "scaleX": 0.9,
                        "rotation": -3
                    }
                },
                {
                    "percent": 0.2,
                    "attr": {
                        "scaleY": 0.9,
                        "scaleX": 0.9,
                        "rotation": -3
                    }
                },
                {
                    "percent": 0.3,
                    "attr": {
                        "scaleY": 1.1,
                        "scaleX": 1.1,
                        "rotation": 3
                    }
                },
                {
                    "percent": 0.4,
                    "attr": {
                        "scaleY": 1.1,
                        "scaleX": 1.1,
                        "rotation": -3
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "scaleY": 1.1,
                        "scaleX": 1.1,
                        "rotation": 3
                    }
                },
                {
                    "percent": 0.6,
                    "attr": {
                        "scaleY": 1.1,
                        "scaleX": 1.1,
                        "rotation": -3
                    }
                },
                {
                    "percent": 0.7,
                    "attr": {
                        "scaleY": 1.1,
                        "scaleX": 1.1,
                        "rotation": 3
                    }
                },
                {
                    "percent": 0.8,
                    "attr": {
                        "scaleY": 1.1,
                        "scaleX": 1.1,
                        "rotation": 3
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "scaleY": 1,
                        "scaleX": 1,
                        "rotation": 0
                    }
                }
            ];
            object.scaleX = object.scaleY = 1;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 橡皮圈晃动
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rubberBand(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            var attr:Array<any> = [
                {
                    "percent": 0.3,
                    "attr": {
                        "scaleX": 1.25,
                        "scaleY": 0.75
                    }
                },
                {
                    "percent": 0.4,
                    "attr": {
                        "scaleX": 0.75,
                        "scaleY": 1.25
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "scaleX": 1.15,
                        "scaleY": 0.85
                    }
                },
                {
                    "percent": 0.65,
                    "attr": {
                        "scaleX": 0.95,
                        "scaleY": 1.05
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "scaleX": 1.05,
                        "scaleY": 0.95
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1
                    }
                }
            ];
            object.scaleX = object.scaleY = 1;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向上侧微弹
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounce(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.4,
                    "attr": {
                        "anchorY": 0.1
                    }
                },
                {
                    "percent": 0.43,
                    "attr": {
                        "anchorY": 0.2
                    }
                },
                {
                    "percent": 0.7,
                    "attr": {
                        "anchorY": 0.1
                    }
                },
                {
                    "percent": 0.8,
                    "attr": {
                        "anchorY": 0
                    }
                },
                {
                    "percent": 0.9,
                    "attr": {
                        "anchorY": 0.04
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorY": 0
                    }
                }
            ];
            object.anchorY = 0;
            var total:number = total ? total : 500;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 放大微微晃动
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceIn(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.2,
                    "attr": {
                        "scaleX": 1.1,
                        "scaleY": 1.1
                    }
                },
                {
                    "percent": 0.4,
                    "attr": {
                        "scaleX": 0.9,
                        "scaleY": 0.9
                    }
                },
                {
                    "percent": 0.6,
                    "attr": {
                        "scaleX": 1.03,
                        "scaleY": 1.03,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.8,
                    "attr": {
                        "scaleX": 0.97,
                        "scaleY": 0.97
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 0;
            object.scaleX = object.scaleY = 0.3;
            var total:number = total ? total : 500;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 从下侧晃动入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceInDown(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.6,
                    "attr": {
                        "anchorOffsetY":25,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "anchorOffsetY":-10,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.9,
                    "attr": {
                        "anchorOffsetY":5,
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorOffsetY":0,
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 0;
            object.anchorOffsetY = - 3000;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 从下侧晃动入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceInUp(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.6,
                    "attr": {
                        "anchorOffsetY":25,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "anchorOffsetY":-10,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.9,
                    "attr": {
                        "anchorOffsetY":5,
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorOffsetY":0,
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 0;
            object.anchorOffsetY = 3000;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 从左侧晃动入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceInLeft(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.6,
                    "attr": {
                        "anchorOffsetX":25,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "anchorOffsetX":-10,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.9,
                    "attr": {
                        "anchorOffsetX":5,
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorOffsetX":0,
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 0;
            object.anchorOffsetX = - 3000;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 从右侧晃动入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceInRight(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.6,
                    "attr": {
                        "anchorOffsetX":25,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "anchorOffsetX":-10,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.9,
                    "attr": {
                        "anchorOffsetX":5,
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorOffsetX":0,
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 0;
            object.anchorOffsetX = 3000;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 微微放大再缩小淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceOut(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.2,
                    "attr": {
                        "scaleX": 0.9,
                        "scaleY": 0.9
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "scaleX": 1.1,
                        "scaleY": 1.1
                    }
                },
                {
                    "percent": 0.55,
                    "attr": {
                        "scaleX": 1.1,
                        "scaleY": 1.1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 0.3,
                        "scaleY": 0.3,
                        "alpha": 0
                    }
                }
            ];
            object.alpha = object.scaleX = object.scaleY = 1;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向上侧快速出场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceOutUp(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.2,
                    "attr": {
                        "anchorOffsetY":25,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.40,
                    "attr": {
                        "anchorOffsetY":-20,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.45,
                    "attr": {
                        "anchorOffsetY":-20,
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorOffsetY":2000,
                        "alpha": 0
                    }
                }
            ];
            object.alpha = 1;
            object.anchorOffsetY = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向下侧快速出场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceOutDown(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.2,
                    "attr": {
                        "anchorOffsetY":-10,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.40,
                    "attr": {
                        "anchorOffsetY":20,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.45,
                    "attr": {
                        "anchorOffsetY":20,
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorOffsetY":-2000,
                        "alpha": 0
                    }
                }
            ];
            object.alpha = 1;
            object.anchorOffsetY = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向左侧快速出场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceOutLeft(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.2,
                    "attr": {
                        "anchorOffsetX":-25,
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorOffsetX":2000,
                        "alpha": 0
                    }
                }
            ];
            object.alpha = 1;
            object.anchorOffsetX = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向右侧快速出场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static bounceOutRight(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.2,
                    "attr": {
                        "anchorOffsetX":25,
                        "alpha": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorOffsetX":-2000,
                        "alpha": 0
                    }
                }
            ];
            object.alpha = 1;
            object.anchorOffsetX = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 摇摆
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static swing(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.2,
                    "attr": {
                        "rotation": 15
                    }
                },
                {
                    "percent": 0.4,
                    "attr": {
                        "rotation": -10
                    }
                },
                {
                    "percent": 0.6,
                    "attr": {
                        "rotation": 5
                    }
                },
                {
                    "percent": 0.8,
                    "attr": {
                        "rotation": -5
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "rotation": 0
                    }
                }
            ];
            object.rotation = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 微微放大到正常
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static scaleIn(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 0;
            object.scaleX = object.scaleY = 1.2;
            var total:number = total ? total : 500;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 正常到微微放大淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static scaleOut(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1.2,
                        "scaleY": 1.2,
                        "alpha": 0
                    }
                }
            ];
            object.alpha = 1;
            object.scaleX = object.scaleY = 1;
            var total:number = total ? total : 500;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 从大到小入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static scaleInBig(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "alpha": 1
                    }
                }
            ];
            object.alpha = 0;
            object.scaleX = object.scaleY = 3;
            var total:number = total ? total : 500;
            easeFunName = "quadIn";
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 从小到大淡出
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static scaleOutBig(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 3,
                        "scaleY": 3,
                        "alpha": 0
                    }
                }
            ];
            object.alpha = 1;
            object.scaleX = object.scaleY = 1;
            var total:number = total ? total : 500;
            easeFunName = "quadIn";
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 从右侧斜切入场
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rightSpeedIn(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.6,
                    "attr": {
                        "skewX": 20,
                        "alpha": 1,
                        "anchorX": -0.4
                    }
                },
                {
                    "percent": 0.8,
                    "attr": {
                        "skewX": -5,
                        "alpha": 1,
                        "anchorX": -0.2
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "skewX": 0,
                        "alpha": 1,
                        "anchorX": 0
                    }
                }
            ];
            object.skewX = object.alpha = 0;
            object.anchorX = - 1;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 微微放大再复位
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static pluse(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.5,
                    "attr": {
                        "scaleX": 1.1,
                        "scaleY": 1.1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1
                    }
                }
            ];
            object.scaleX = object.scaleY = 1;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 微微摇摆
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static rotationFlash(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.25,
                    "attr": {
                        "rotation": 5
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "rotation": -5
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "rotation": 0
                    }
                }
            ];
            object.rotation = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 呼吸效果
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static breath(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.25,
                    "attr": {
                        "scaleX": 0.92,
                        "scaleY": 0.92,
                        "alpha": 0.7
                    }
                },
                {
                    "percent": 0.5,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "alpha": 1
                    }
                },
                {
                    "percent": 0.75,
                    "attr": {
                        "scaleX": 0.92,
                        "scaleY": 0.92,
                        "alpha": 0.7
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "alpha": 1
                    }
                }
            ];
            object.scaleX = object.scaleY = object.alpha = 1;
            var total:number = total ? total : 5000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向上快速移动再复原
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static shiftUp(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.5,
                    "attr": {
                        "anchorY": 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorY": 0
                    }
                }
            ];
            object.anchorY = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向下快速移动再复原
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static shiftDown(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.5,
                    "attr": {
                        "anchorY": - 1
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "anchorY": 0
                    }
                }
            ];
            object.anchorY = 0;
            var total:number = total ? total : 1000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }
        /**
         * 向上移动，放大 再复原
         * @param object 要做效果的对象
         * @param delay  延迟播放的时间
         * @param total  动画总时间
         * @param easeFunName 缓动方程
         * @param isLoop 是否循环
         */
        public static jump(object:easy.BaseGroup,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false):void{
            egret.Tween.removeTweens(object);
            object.anchorEnabled = true;
            var attr:Array<any> = [
                {
                    "percent": 0.4,
                    "attr": {
                        "scaleX": 1.1,
                        "scaleY": 0.9,
                        "anchorY":0.8
                    }
                },
                {
                    "percent": 0.55,
                    "attr": {
                        "scaleX": 1.8,
                        "scaleY": 0.2,
                        "anchorY":0.9
                    }
                },
                {
                    "percent": 0.65,
                    "attr": {
                        "scaleX": 0.6,
                        "scaleY": 1.4,
                        "anchorY":0.3
                    }
                },
                {
                    "percent": 1,
                    "attr": {
                        "scaleX": 1,
                        "scaleY": 1,
                        "anchorY":0
                    }
                }
            ];
            object.anchorY = 0;
            object.scaleX = object.scaleY = 1;
            var total:number = total ? total : 2000;
            TweenEffect.start(object,attr,delay,total,easeFunName,isLoop);
        }

        /**
         * 左右快速摇摆，暂停
         * @param object
         * @param angle
         * @param dutation
         * @param isLoop
         */
        public static rock(object:easy.BaseGroup,angle:number = 25,dutation:number = 200,isLoop:boolean = false):void{
            var _beginRotation:number = object.rotation;
            egret.Tween.get(object,{loop:isLoop}).to({rotation:angle + _beginRotation},dutation).to({rotation:_beginRotation},dutation).to({rotation:_beginRotation - angle},dutation)
            .to({rotation:_beginRotation},dutation).to({rotation:angle + _beginRotation},dutation).to({rotation:_beginRotation},dutation).to({rotation:_beginRotation - angle},dutation)
            .to({rotation:_beginRotation},dutation).wait(2000);
        }
        /**
         * 上下 左右浮动
         * @param object
         * @param duration
         * @param space
         * @param isLoop
         * @param direction 1上下浮动 其他
         */
        public static fly(object:easy.BaseGroup, duration:number = 500,space:number = 3, isLoop:boolean = true,direction:number = 1):void{
            var _oldX,_oldY;
            _oldX = object.x;
            _oldY = object.y;
            if(direction == 1){
                egret.Tween.get(object,{loop:isLoop}).to({y:(_oldY + space)},duration).to({y:_oldY},duration).to({y:(_oldY - space)},duration).to({y:_oldY},duration);
            }else{
                egret.Tween.get(object,{loop:isLoop}).to({x:(_oldX + space)},duration).to({x:_oldX},duration).to({x:(_oldX - space)},duration).to({x:_oldX},duration);
            }

        }
        /**
         * 具体的动画实现
         * @param object
         * @param attr
         * @param delay
         * @param total
         * @param easeFunName
         * @param isLoop
         */
        private static start(object:easy.BaseGroup,attr:Array<any>,delay:number = 0,total:number = 0,easeFunName:string = "",isLoop:boolean = false){
            egret.Tween.removeTweens(object);
            var index:number = 0;
            var attr:Array<any> = attr;
            var total:number = total;
            var tweenTime:number = 0;
            if(easeFunName){
                var easeFun:Function = eval("egret.Ease." + easeFunName);
            }else{
                easeFun = null;
            }

            setTimeout(function loop(){
                if(index >= attr.length){
                    if(isLoop){
                        index = 0;
                    }else{
                        return;
                    }
                }
                if(index > 0){
                    tweenTime = (attr[index]["percent"]  - attr[index - 1]["percent"]) * total;
                }else{
                    tweenTime = attr[index]["percent"] * total;
                }
                egret.Tween.get(object).to(attr[index]["attr"],tweenTime ,easeFun).call(loop,this);
                index ++;
            },delay)
        }

    }
}