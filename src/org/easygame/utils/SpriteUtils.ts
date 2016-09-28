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
     * 集中ui操作的一些常用方法
     */
    export class SpriteUtils {

        /**
         * 用target的图形,在src的图形上镂空/擦除,返回擦除后的材质
         * @param src
         * @param target
         */
        public static earse(src:egret.DisplayObject, target:egret.DisplayObject):egret.Texture{
            var container:egret.DisplayObjectContainer = easy.ObjectPool.getByClass(egret.DisplayObjectContainer);
            var targetImg:egret.Bitmap = easy.ObjectPool.getByClass(egret.Bitmap, "earse");
            targetImg.blendMode = egret.BlendMode.ERASE;
            var texture1:egret.RenderTexture = easy.ObjectPool.getByClass(egret.RenderTexture);
            texture1.drawToTexture(target);
            targetImg.texture = texture1;

            container.addChild(src);
            container.addChild(targetImg);

            //绘制成材质
            var texture2:egret.RenderTexture = new egret.RenderTexture();
            texture2.drawToTexture(container);

            //回收对象
            container.removeChildren();
            easy.ObjectPool.recycleClass(container);

            targetImg.blendMode = egret.BlendMode.NORMAL;
            targetImg.texture = null;
            easy.ObjectPool.recycleClass(targetImg, "earse");

            return texture2;
        }
    }
}