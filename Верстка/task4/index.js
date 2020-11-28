document.getElementById('pig1-1')
    .addEventListener('click', () => swipe('left'));
document.getElementById('pig1-2')
    .addEventListener('click', () => swipe('up'));
document.getElementById('pig1-3')
    .addEventListener('click', () => swipe('right'));
document.getElementById('pig2-1')
    .addEventListener('click', () => swipe('left'));
document.getElementById('pig2-2')
    .addEventListener('click', () => swipe('up'));
document.getElementById('pig2-3')
    .addEventListener('click', () => swipe('right'));
document.getElementById('pig3-1')
    .addEventListener('click', () => swipe('left'));
document.getElementById('pig3-2')
    .addEventListener('click', () => swipe('up'));
document.getElementById('pig3-3')
    .addEventListener('click', () => swipe('right'));
document.getElementById('pig4-1')
    .addEventListener('click', () => swipe('left'));
document.getElementById('pig4-2')
    .addEventListener('click', () => swipe('up'));
document.getElementById('pig4-3')
    .addEventListener('click', () => swipe('right'));
document.getElementById('pig5-1')
    .addEventListener('click', () => swipe('left'));
document.getElementById('pig5-2')
    .addEventListener('click', () => swipe('up'));
document.getElementById('pig5-3')
    .addEventListener('click', () => swipe('right'));
document.getElementById('pig6-1')
    .addEventListener('click', () => swipe('left'));
document.getElementById('pig6-2')
    .addEventListener('click', () => swipe('up'));
document.getElementById('pig6-3')
    .addEventListener('click', () => swipe('right'));
document.getElementById('pig7-2')
    .addEventListener('click', () => swipe('up'));
document.getElementById('pig7-1')
    .addEventListener('click', () => swipe('left'));
document.getElementById('pig7-3')
    .addEventListener('click', () => swipe('right'));


function swipe(action) {
    let pigs = document.getElementsByClassName('piggy');
    let pig = pigs.item(pigs.length - 1);
    switch (action) {
        case 'left': {
            pig.style.boxShadow = `0 0 20px red`;
            break;
        }
        case 'right': {
            pig.style.boxShadow = `0 0 20px deeppink`;
            break;
        }
        case 'up': {
            pig.style.boxShadow = `0 0 20px goldenrod`;
            break;
        }
    }
    setTimeout(function () {
        pig.remove();
    }, 700);
}