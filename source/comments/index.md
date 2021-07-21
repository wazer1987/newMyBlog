---
title: 留言板
top_img: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2Fbffd33d4ce328c370e6dcdb8d5ca197bbba90f8d.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1611650956&t=928103e50286adc3b9497fa145db9edc
date: 2020-12-27 16:41:53
description: 你想说什么 我告诉你呀 饭可以乱吃 话不要乱说哦～～
---
<!-- https://www.bootcdn.cn/botui/ -->
<link href="https://cdn.bootcss.com/botui/0.3.9/botui-theme-default.css" rel="stylesheet">
<link href="https://cdn.bootcss.com/botui/0.3.9/botui.min.css" rel="stylesheet">
{% raw %}
<!-- 因为vue和botui更新导至bug,现将对话移至js下的botui中配置 -->
<div class="entry-content">
  <div class="moe-mashiro" style="text-align:center; font-size: 50px; margin-bottom: 20px;"> 北城韩雨✨ </div>
  <div id="hello-mashiro" class="popcontainer" style="min-height: 300px; padding: 2px 6px 4px; border-radius: 10px;">
    <center>
    <p>
    </p>
    <h4>
    与&nbsp;<ruby>北城韩雨&nbsp;<rp>
    （</rp>
    <rt>
        </rt>
    <rp>
    ）</rp>
    </ruby>
    对话中....</h4>
    <p>
    </p>
    </center>
    <bot-ui></botui>
   </div>
</div>
<script src="/js/botui.js"></script>
<script>
bot_ui_ini()
var bg = document.getElementsByClassName('botui-container')
bg[0].style.backgroundColor = 'transparent'
</script>
{% endraw %}