const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;


const player = new Player({x:50,y:0},characters.samurai);


let enemy = null;

const socket = io('http://localhost:3000', { transports : ['websocket'] });
// const socket = io('http://192.168.31.26:3000', { transports : ['websocket'] });
socket.emit('player-enter',{position:player.position});
function update_player(socket){
    socket.emit('update-player',{
        position:player.position,
        dir: player.dir,
        speed: player.speed,
        attack:player.attack,
        takehit:player.takehit,
        fall: player.fall,
        jump_speed: player.jump_speed
    });
}
function animate(){
    const animationId = window.requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(100,200,200,0.6)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    player.update(ctx,enemy,0);
    // setTimeout(() => update_player(socket),100);
    update_player(socket);
    if(enemy) enemy.update(ctx,player,1);
}

animate();
let last_key = '';
window.addEventListener('keypress',(e) => {
    // console.log(player.frame);
    if(e.key == "w"){
        player.fall = true;
        player.jump_speed = 12;
        last_key = 'w';
    }
    else if(e.key == 'a'){
        player.dir = -1;
        player.speed = 5;
        last_key = 'a';
    }
    else if(e.key == 'd'){
        player.dir = 1;
        player.speed = 5;
        last_key = 'd';
    }
    else if(e.key == ' '){
        player.attack = true;
        // player.switchsprite('attack1');
    }
    // if(e.key === 'ArrowUp'){
    //     console.log("hello there");
    //     enemy.fall = true;
    //     enemy.jump_speed = 12;
    //     last_key = 'ArrowUp';
    // }
    // else if(e.key === 'ArrowLeft'){
    //     enemy.dir = -1;
    //     enemy.speed = 5;
    //     last_key = 'ArrowLeft';
    // }
    // else if(e.key === 'ArrowRight'){
    //     enemy.dir = 1;
    //     enemy.speed = 5;
    //     last_key = 'ArrowRight';
    // }
    // else if(e.key == 'ArrowDown') enemy.attack = true;
});

window.addEventListener('keyup',(e) => {
    if(e.key == 'a' && (last_key == 'a' || last_key == 'w') ||  e.key == 'd' && (last_key == 'd' || last_key == 'w')){
        player.speed = 0;
    }
    // if(e.key == 'ArrowLeft' && (last_key == 'ArrowLeft' || last_key == 'ArrowUp') || e.key == 'ArrowRight' && (last_key == 'ArrowRight' || last_key == 'ArrowUp')){
    //     enemy.speed = 0;
    // }
    // if(e.key == ' ') player.attack = false;
    // if(e.key == 'ArrowDown') enemy.attack = false;
});

socket.on('player-enter',(data) => {
    enemy = new Player(data.position, characters.samurai);
    socket.emit('add-first-player',{
        position: player.position,
        dir: player.dir,
        speed: player.speed,
        attack: player.attack,
        takehit: player.takehit,
        health: player.health
    })
})
socket.on('player-left', () => {
    enemy = null;
})
socket.on('add-first-player',(data) => {
    enemy = new Player(data.position,characters.samurai);
    enemy.dir = data.dir;
    enemy.speed = data.speed;
    enemy.attack = data.attack;
    enemy.takehit = data.takehit;
    enemy.health = data.health;
})
socket.on('update-enemy',(data) => {
    if(enemy != null && data != null){
        enemy.position = data.position;
        enemy.dir = data.dir;
        enemy.speed = data.speed;
        enemy.jump_speed = data.jump_speed;
        enemy.fall = data.fall;
        enemy.attack = data.attack;
        enemy.takehit = data.takehit;
        // enemy.last_sprite = data.last_sprite;
    }
    // enemy.last_sprite = data.last_sprite;
    // enemy.health = data.health;
})


