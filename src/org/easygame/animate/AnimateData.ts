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
     * 动画数据
     */
    export class AnimateData {
        public id:string = null;//数据id
        public frame:number = 0;//帧数
        public _json:any = null;//材质json定义

        public width:number = 0;
        public height:number = 0;
        public _spriteSheet:egret.SpriteSheet = null;
        public textures:Array<AnimateTexture> = null;//通用动画材质
        public textureDict:any = null;
        private _type:string = AnimateData.TYPE_EFFECT;
        public _merge:boolean = true;//材质是否是合并输出的

        public static TYPE_ACTOR:string = "actor";//人物动画材质
        public static TYPE_EFFECT:string = "effect";//普通动画效果

        public constructor(name:string) {
            this.id = name;
            var jsonData:any = RES.getRes(name + "_animate_json");
            if (jsonData != null) {
                this.textureDict = {};
                this.id = jsonData.id;
                this.frame = jsonData.frame;
                this._type = jsonData.type;
                if (jsonData.merge) this._merge = (jsonData.merge == "true");
                var animateTexture:AnimateTexture = null;
                if (this._merge){
                    this._spriteSheet = new egret.SpriteSheet(RES.getRes(name + "_animate_img"));
                }
                if (jsonData.type == "actor") {
                    var textureArr:Array<AnimateTexture> = null;
                    for (var key in jsonData.texture){
                        textureArr = [];
                        this.textureDict[key] = textureArr;
                        for(var i = 0; i < jsonData.texture[key].length; i++) {
                            animateTexture = new easy.AnimateTexture();
                            animateTexture.width = jsonData.texture[key][i].w;
                            animateTexture.height = jsonData.texture[key][i].h;
                            animateTexture.id = jsonData.texture[key][i].id;
                            if (animateTexture.width > this.width) this.width = animateTexture.width;
                            if (animateTexture.height > this.height) this.height = animateTexture.height;
                            if (jsonData.texture[key][i].f) {
                                animateTexture.frame = jsonData.texture[key][i].f;
                            }else {
                                animateTexture.frame = this.frame;
                            }
                            animateTexture.x = jsonData.texture[key][i].ox;
                            animateTexture.y = jsonData.texture[key][i].oy;
                            if (this._merge) {
                                animateTexture.offsetX = jsonData.texture[key][i].x;
                                animateTexture.offsetY = jsonData.texture[key][i].y;
                                animateTexture.texutre = this._spriteSheet.createTexture(key + "_" + i, animateTexture.offsetX, animateTexture.offsetY, animateTexture.width, animateTexture.height);
                            } else {
                                animateTexture.resId = jsonData.texture[key][i].l;
                                animateTexture.texutre = RES.getRes(animateTexture.resId);
                            }
                            textureArr.push(animateTexture);
                        }
                    }
                } else {
                    this.textures = [];
                    for(var i = 0; i < jsonData.texture.length; i++) {
                        animateTexture = new easy.AnimateTexture();
                        animateTexture.width = jsonData.texture[i].w;
                        animateTexture.height = jsonData.texture[i].h;
                        animateTexture.id = jsonData.texture[i].id;
                        if (animateTexture.width > this.width) this.width = animateTexture.width;
                        if (animateTexture.height > this.height) this.height = animateTexture.height;
                        if (jsonData.texture[i].f) {
                            animateTexture.frame = jsonData.texture[i].f;
                        }else {
                            animateTexture.frame = this.frame;
                        }
                        animateTexture.x = jsonData.texture[i].ox;
                        animateTexture.y = jsonData.texture[i].oy;
                        if (this._merge) {
                            animateTexture.offsetX = jsonData.texture[i].x;
                            animateTexture.offsetY = jsonData.texture[i].y;
                            animateTexture.texutre = this._spriteSheet.createTexture(this.id + "_" + i, animateTexture.offsetX, animateTexture.offsetY, animateTexture.width, animateTexture.height);
                        } else {
                            animateTexture.resId = jsonData.texture[i].l;
                            animateTexture.texutre = RES.getRes(animateTexture.resId);
                        }

                        this.textures.push(animateTexture);
                    }
                }
            }
        }

        /**
         * 获取通用动画材质数据
         */
        public getTexture(index:number):AnimateTexture {
            if (index >= 0 && index < this.textures.length){
                return this.textures[index];
            }
            return null;
        }

        /**
         * 获取人物动画材质
         * @param direction
         * @param index
         * @returns {null}
         */
        public getTextureActor(direction:string, index:number):AnimateTexture {
            if (this.textureDict[direction] && index >= 0) {
                if (index < this.textureDict[direction].length){
                    return this.textureDict[direction][index];
                }
            }
            return null;
        }
    }
}