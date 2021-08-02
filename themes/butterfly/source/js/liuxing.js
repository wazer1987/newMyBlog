// var header = document.getElementsByClassName('full_page')
var header = document.getElementById('page-header')
var div = document.createElement('div')
div.style.position = 'relative'
div.style.top = '30%'
var qiu = `<div class="night">
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
            <div class="shooting_star"></div>
           </div>
           `
div.innerHTML = qiu
// header.length !== 0 ? header[0].appendChild(div) :''
header.appendChild(div)