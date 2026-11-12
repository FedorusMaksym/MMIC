var $96470dae6a164cc7$exports = {};
const $96470dae6a164cc7$var$t = document.getElementById('track');
const $96470dae6a164cc7$var$step = ()=>$96470dae6a164cc7$var$t.querySelector('.card').offsetWidth + 5;
document.querySelector('.prev').onclick = ()=>$96470dae6a164cc7$var$t.scrollBy({
        left: -$96470dae6a164cc7$var$step()
    });
document.querySelector('.next').onclick = ()=>$96470dae6a164cc7$var$t.scrollBy({
        left: $96470dae6a164cc7$var$step()
    });


//# sourceMappingURL=location.e9890310.js.map
