var header = document.getElementById('page-header')
var div = document.createElement('div')
var qiu = `
<div class="container">
    <div class="cube cube--1">
        <div class="side side--back">
            <div class="side__inner"></div>
        </div>
        <div class="side side--left">
            <div class="side__inner"></div>
        </div>
        <div class="side side--right">
            <div class="side__inner"></div>
        </div>
        <div class="side side--top">
            <div class="side__inner"></div>
        </div>
        <div class="side side--bottom">
            <div class="side__inner"></div>
        </div>
        <div class="side side--front">
            <div class="side__inner"></div>
        </div>
    </div>
    
    <div class="cube cube--2">
        <div class="side side--back">
            <div class="side__inner"></div>
        </div>
        <div class="side side--left">
            <div class="side__inner"></div>
        </div>
        <div class="side side--right">
            <div class="side__inner"></div>
        </div>
        <div class="side side--top">
            <div class="side__inner"></div>
        </div>
        <div class="side side--bottom">
            <div class="side__inner"></div>
        </div>
        <div class="side side--front">
            <div class="side__inner"></div>
        </div>
    </div>
    
    <div class="cube cube--3">
        <div class="side side--back">
            <div class="side__inner"></div>
        </div>
        <div class="side side--left">
            <div class="side__inner"></div>
        </div>
        <div class="side side--right">
            <div class="side__inner"></div>
        </div>
        <div class="side side--top">
            <div class="side__inner"></div>
        </div>
        <div class="side side--bottom">
            <div class="side__inner"></div>
        </div>
        <div class="side side--front">
            <div class="side__inner"></div>
        </div>
    </div>
</div>`
div.innerHTML = qiu
header.appendChild(div)