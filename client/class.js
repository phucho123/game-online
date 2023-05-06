class Player{
    constructor(position,sprites){
        this.position = position;
        this.speed = 0;
        this.dir = 1;
        this.gravity = 0.18;
        this.jump_speed = 0;
        this.fall = false;
        this.sprites = sprites;
        for(const sprite in this.sprites){
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].src;
        }
        this.image = this.sprites.idle.image;
        this.max_frame = this.sprites.idle.frame;
        this.hold = this.sprites.idle.hold;
        this.image.onload = () => {
            this.width = this.image.width/this.max_frame*2.5;
            this.height = this.image.height*2.5;
            // console.log(this.width,this.height);
        }
        this.el = 0;
        this.frame = 0;
        this.attack = false;
        // this.setAttackfalse = false;
        this.takehit = false;
        // this.setTakehitfalse = false;
        this.last_sprite = 'idle';
        this.health = 100;
    }
    flip(ctx){
        ctx.save();
        ctx.translate(this.position.x+this.width,this.position.y);
        ctx.scale(-1,1);
        ctx.drawImage(
            this.image,
            this.image.width/this.max_frame*this.frame,
            0,
            this.image.width/this.max_frame,
            this.image.height,
            0,
            0,
            this.image.width/this.max_frame*2.5,
            this.image.height*2.5
        );
        ctx.restore();
    }
    draw(ctx,is_enemy){
        // ctx.beginPath();
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.position.x,this.position.y,this.width,this.height);
        this.draw_healthbar(ctx,is_enemy);
        this.animation(ctx);
    }
    moverment(){
        // console.log(this.position);
        if(this.health <= 0) return;
        if(this.position.y+this.height < 576) this.fall = true;
        if(this.fall) this.jump_speed-=this.gravity;
        this.position.y -= this.jump_speed;
        if(this.position.y <= 0){
            this.position.y = 0;
            this.jump_speed = 0;
        }
        if(this.position.y+this.height > 576){
            this.fall = false;
            this.jump_speed = 0;
            this.position.y = 576-this.height;
        }
        this.position.x+=this.speed*this.dir;
        if(this.position.x < 0) this.position.x = 0;
        else if(this.position.x + this.width >=1024) this.position.x = 1024-this.width;
    }
    update(ctx,enemy,is_enemy){
        if(this.attack && this.frame >= this.max_frame-1) this.attack = false;
        this.moverment();
        this.draw(ctx,is_enemy);
        this.attacker(enemy);
    }
    animation(ctx){
        if(this.last_sprite == 'takehit' && this.frame >= this.max_frame-1) this.takehit = false;
        if(this.health <= 0) this.switchsprite('death');
        else if(this.takehit){
            this.switchsprite('takehit');
        }
        else if(this.attack){
            this.switchsprite('attack1');
        }
        else if(this.speed != 0){
            this.switchsprite('run');
        }
        else{ 
            this.switchsprite('idle');
        }
        this.el++;
        if(this.el >= this.hold){
            // if(this.takehit && this.frame == this.max_frame-1) this.setTakehitfalse = true;
            // if(this.takehit && this.setAttackfalse) this.takehit = false;

            // if(this.frame == this.max_frame-1 && this.attack) this.setAttackfalse = true;
            // if(this.attack && this.setAttackfalse){
            //     this.setAttackfalse = false;
            //     this.attack = false;
            // }
            if(this.health <= 0){
                if(this.frame < this.max_frame-1) this.frame++;
            }
            else{
                this.frame = (this.frame+1)%this.max_frame;
            }
            this.el = 0;
        }
        if(this.dir == -1){
            this.flip(ctx);
        }
        else{
            ctx.drawImage(
                this.image,
                this.image.width/this.max_frame*this.frame,
                0,
                this.image.width/this.max_frame,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width/this.max_frame*2.5,
                this.image.height*2.5
            );
        }
    }
    attacker(enemy){
        if(!enemy) return;
        if(this.health <= 10) return;
        const x = this.width/2+this.position.x-enemy.width/2-enemy.position.x;
        const y = this.height/2+this.position.y-enemy.height/2-enemy.position.y;
        const dst = Math.sqrt(x*x+y*y);
        let dir = false;
        if(this.dir == 1 && enemy.position.x > this.position.x || this.dir == -1 && enemy.position.x < this.position.x){
            dir = true;
        }
        if(dst <= 200 && this.attack && dir){
            enemy.health-=0.7;
            console.log("attack",enemy.health);
            enemy.takehit = true;
        }
    }
    switchsprite(sprite){
        if(this.last_sprite == sprite) return;
        if(this.last_sprite != sprite && this.last_sprite == 'attack1' && this.frame < this.max_frame-1) return;
        switch (sprite) {
            case 'idle':
                this.image = this.sprites.idle.image;
                this.max_frame = this.sprites.idle.frame;
                this.hold = this.sprites.idle.hold;
                this.last_sprite = 'idle';
                break;
            case 'run':
                this.image = this.sprites.run.image;
                this.max_frame = this.sprites.run.frame;
                this.hold = this.sprites.run.hold;
                this.last_sprite = 'run';
                break;
            case 'attack1':
                this.image = this.sprites.attack1.image;
                this.max_frame = this.sprites.attack1.frame;
                this.hold = this.sprites.attack1.hold;
                this.last_sprite = 'attack1';
                break;
            case 'takehit':
                this.image = this.sprites.takehit.image;
                this.max_frame = this.sprites.takehit.frame;
                this.hold = this.sprites.takehit.hold;
                this.last_sprite = 'takehit';
                break;
            case 'death':
                this.image = this.sprites.death.image;
                this.max_frame = this.sprites.death.frame;
                this.hold = this.sprites.death.hold;
                this.last_sprite = 'death';
                break;
            default:
                this.image = this.sprites.idle.image;
                this.max_frame = this.sprites.idle.frame;
                this.hold = this.sprites.idle.hold;
                this.last_sprite = 'idle';
                break;
        }
        this.el = 0;
        this.frame = 0;
    }
    draw_healthbar(ctx,is_enemy){
        if(!is_enemy){
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.fillRect(10,10,400,50);
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.fillRect(10,10,400*(this.health > 0 ? this.health : 0)/100,50);
            ctx.closePath();
        }
        else{
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.fillRect(1024-410,10,400,50);
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.fillRect(1024-410,10,400*(this.health > 0 ? this.health : 0)/100,50);
            ctx.closePath();
        }
    }
}
