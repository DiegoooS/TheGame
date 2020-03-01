//HTML elements
const player = document.querySelector('.player');
const playerFlyZone = document.querySelector('.player__fly__area');
const enemyFlyZone = document.querySelector('.enemy__fly__area');
const enemyRow = document.querySelector('.enemy__row');
const gameMap = document.querySelector('.game__map');
const scoreBox = document.querySelector('.player__score__row');
const playerHealthBarProgress = document.querySelector('.health__bar__progress');
const gameOverBox = document.querySelector('.game__over');
const menu = document.querySelector('.menu');
const startGameButton = document.querySelector('.start__game');
let enemy = document.querySelectorAll('.enemy');

//Game Variables
bossLife = 0;
let score = 0;
let playerHealth = 100;

//Sounds
const shootSound = document.querySelector('.shootSound');
const blastSound = document.querySelector('.shipBlastSound');
const enemyShootSound = document.querySelector('.enemy__shoot__sound');
const playerHittedSound = document.querySelector('.player__hitted__sound');
const audioTheme_1 = document.querySelector('.battle_theme_sound_1');
audioTheme_1.volume = 0.5;

//Intervals
let intervals;
let starInterval;
let enemyAnimationInterval;

//FUNCTIONS
function startGame() {
    shootSound.currentTime = 0;
    shootSound.play();

    menu.style.display = 'none';
    gameMap.style.display = 'flex';

    audioTheme_1.currentTime = 0;
    audioTheme_1.loop = true;
    audioTheme_1.play();

    wave = 1;
    waveGenerator();
    intervals = setInterval(intervalConstroller, 10);
    starInterval = setInterval(starGenerator, 500);
}

let = playerPosition = 0;
let isMoving = {};
function movement() {
    if (isMoving[37])
    {
        if (player.offsetLeft > 0) playerPosition -=15;
        player.classList.add('turn__left');
    }

    if (isMoving[39]) {
        if (player.offsetLeft < playerFlyZone.offsetWidth - 100) playerPosition += 15;
        player.classList.add('turn__right');
    }

    player.style.left = `${playerPosition}px`;
    setTimeout(movement, 30);
};
movement();

function intervalConstroller() {
    shootAnimation();
    startStarAnimation();
    enemyShoot();
    enemyShootAnimation();
}

let shouldPlayerShoot = true;
function shoot(e) {
    if (gameMap.style.display == 'flex') {
        if (e.code === 'Space' && shouldPlayerShoot)
        {
            shootSound.currentTime = 0;
            shootSound.play();
    
            const bullet = document.createElement("span");
            bullet.classList.add('bullet');
            bullet.style.top = enemyFlyZone.offsetHeight + "px";
            bullet.style.left = (player.offsetLeft + (player.offsetWidth / 2)) - 2 + "px";
            gameMap.appendChild(bullet);
            shouldPlayerShoot = false;
        }
    }
}

function shootAnimation() {
    let bullets = document.querySelectorAll('.bullet');
    bullets.forEach(bullet => {
        bullet.style.top = bullet.offsetTop - 35 + 'px';
        //Check if end of map reached
        if (bullet.offsetTop <= 0) {
            bullet.parentNode.removeChild(bullet);
        }
        
        checkIfEnemyHitted(bullet);
    });
}

function checkIfEnemyHitted(bullet) {
    enemy.forEach(enemyShip => {
        enemy = document.querySelectorAll('.enemy');
        if (bullet.parentNode != null && (bullet.offsetTop <= (enemyShip.offsetHeight + enemyShip.offsetTop) && (bullet.offsetLeft >= (enemyShip.offsetLeft + enemyRow.offsetLeft) && bullet.offsetLeft <= (enemyShip.offsetWidth + enemyShip.offsetLeft + enemyRow.offsetLeft)))){
            blastSound.currentTime = 0;
            blastSound.play();
            if (enemyShip.classList.contains('boss')) {
                bossLife -= 1;
                bullet.parentNode.removeChild(bullet);
                console.log(bossLife);
                if (bossLife <= 0) {
                    clearInterval(enemyAnimationInterval);
                    score += 50;
                    scoreBox.innerHTML = `score: ${score}`;
                    enemyShip.parentNode.removeChild(enemyShip);
                    enemy = document.querySelectorAll('.enemy');

                    gameOver();
                }
            } else {
                score += 10;
                scoreBox.innerHTML = `score: ${score}`;
                bullet.parentNode.removeChild(bullet);
                enemyShip.parentNode.removeChild(enemyShip);
                enemy = document.querySelectorAll('.enemy');
            }
            if (enemy.length === 0) {
                clearInterval(enemyAnimationInterval);
                enemyRow.style.top = `-115px`;
                wave++;
                waveGenerator();
            }
        }
    })
}

function starGenerator() {
    const star = document.createElement("span");
    star.classList.add('star');
    star.style.marginLeft = Math.floor(Math.random() * playerFlyZone.offsetWidth) + 'px';
    star.style.height = Math.floor(Math.random() * 5) + 2  + 'px';
    star.style.width = Math.floor(Math.random() * 7) + 2  + 'px';
    star.style.top = 0 + 'px';
    gameMap.appendChild(star);
}

function startStarAnimation(){
    let stars = document.querySelectorAll('.star');
    stars.forEach(oneStar => {
        oneStar.style.top = oneStar.offsetTop + 5200 + "px";
        if (oneStar.offsetTop >= gameMap.offsetHeight - 1) oneStar.parentNode.removeChild(oneStar);
    });
}

//Level Construction    
function enemyGenerator(positionX, positionY) {
    const enemyElement = document.createElement("div");
    enemyElement.classList.add('enemy');
    enemyElement.style.left = `${positionX}px`;
    enemyElement.style.top = `${positionY}px`;
    enemyRow.appendChild(enemyElement);
    enemy = document.querySelectorAll('.enemy');
}

function bossGenerator(positionX, positionY) {
    const bossElement = document.createElement("div");
    bossElement.classList.add('enemy');
    bossElement.classList.add('boss');
    bossElement.style.left = `${positionX}px`;
    bossElement.style.top = `${positionY}px`;
    enemyRow.appendChild(bossElement);
    enemy = document.querySelectorAll('.enemy');
}

let enemyMoving = true;
let enemyAnimationSpeed = 2;
function enemyAnimation() {
        if (enemyRow.offsetTop < 15) {
            enemyRow.style.top = enemyRow.offsetTop + 9 + "px";
        }

        if (enemyMoving) {
            enemyRow.style.left = enemyRow.offsetLeft - enemyAnimationSpeed + "px";
            if (enemyRow.offsetLeft <= -100) enemyMoving = !enemyMoving;
        } else {
            enemyRow.style.left = enemyRow.offsetLeft + enemyAnimationSpeed + "px";
            if (enemyRow.offsetLeft >= 100) enemyMoving = !enemyMoving;
        }
}

let chanceOfEnemyShoot = 1000;
function enemyShoot() {
    enemy.forEach(enemyShootingGenerator => {
        let isShooting = Math.floor(Math.random() * chanceOfEnemyShoot);

        if (isShooting === 15) {
            enemyShootSound.currentTime = 0;
            enemyShootSound.play();

            const enemyBullet = document.createElement('span');
            enemyBullet.classList.add('enemy__bullet');
            enemyBullet.style.top = enemyShootingGenerator.offsetTop + enemyShootingGenerator.offsetHeight + 'px';
            enemyBullet.style.left = ((enemyShootingGenerator.offsetLeft + enemyRow.offsetLeft) + (enemyShootingGenerator.offsetWidth / 2)) - 2 + "px";
            gameMap.appendChild(enemyBullet);
        }
    }); 
}

function enemyShootAnimation() {
    enemyBullets = document.querySelectorAll('.enemy__bullet');
    enemyBullets.forEach(enemyBulletAnimation => {
        enemyBulletAnimation.style.top = enemyBulletAnimation.offsetTop + 5 + 'px';

        if (enemyBulletAnimation.offsetTop >= gameMap.offsetHeight) enemyBulletAnimation.parentNode.removeChild(enemyBulletAnimation);
        checkIfPlayerHittes(enemyBulletAnimation);
    });
}

function checkIfPlayerHittes(enemyRocket) {
    if((enemyRocket.offsetTop >= player.offsetTop) && ((enemyRocket.offsetLeft >= player.offsetLeft) && (enemyRocket.offsetLeft <= (player.offsetLeft + player.offsetWidth)))) {
        enemyRocket.parentNode.removeChild(enemyRocket);

        playerHittedSound.currentTime = 0;
        playerHittedSound.play();

        playerHealth -= 15;
        if (playerHealth <= 0) {
            playerHealth = 0;
            gameOver();
        } 
        playerHealthBarProgress.style.width = `${playerHealth}%`;

        
    }
}

function gameOver() {
    clearInterval(intervals);
    clearInterval(starInterval);
    clearInterval(enemyAnimationInterval);
    gameMap.style.display = 'none';
    gameOverBox.style.display = 'flex';

    //put audio off
    audioTheme_1.loop = false;
    audioTheme_1.pause();
    audioTheme_1.currentTime = 0;
}


//WAVES
function enemyWave(numberOfRows, enemySpeed = 2, enemyChance = 1000 , setPositionY = 15 , startPositionY = -315) {
    enemyAnimationSpeed = enemySpeed;
    chanceOfEnemyShoot = enemyChance;

    let positionX = -400;
    //set enemies for animation
    enemyRow.style.top = `${startPositionY}px`;
    //Timeout to prevent from showing enemies before animation
    setTimeout(generate, 1000);
    function generate() {
        enemyAnimationInterval = setInterval(enemyAnimation, 10);
        for (let i = 0; i < 5 ; i++) {
        let positionY = setPositionY;
        for (let j = 0; j < numberOfRows ; j++) {
            enemyGenerator(enemyFlyZone.offsetWidth / 2 + positionX, positionY);
            positionY += 100;
        }
        positionX += 200;
    }
    }
}

function bossWave(enemySpeed = 2, enemyChance = 1000 , setPositionY = 15 , startPositionY = -315, lifeOfBoss = 50) {
    enemyAnimationSpeed = enemySpeed;
    chanceOfEnemyShoot = enemyChance;
    bossLife = lifeOfBoss;

    //set enemies for animation
    enemyRow.style.top = `${startPositionY}px`;

    setTimeout(generate, 1000);
    function generate() {
        enemyAnimationInterval = setInterval(enemyAnimation, 10);
        let positionY = setPositionY;
        bossGenerator(enemyFlyZone.offsetWidth / 2 - 150, positionY);
    }
}

//WAVES END

let wave;
function waveGenerator() {
    if (wave === 1) enemyWave(1 , 2 , 1000 , 15 , -115);
    if (wave === 2) enemyWave(2);
    if (wave === 3) enemyWave(3);
    if (wave === 4) enemyWave(3);
    if (wave === 5) enemyWave(4 , 3);
    if (wave === 6) enemyWave(5, 4);
    if (wave === 7) enemyWave(2 , 10 , 500);
    if (wave === 8) enemyWave(2 , 10 , 400);
    if (wave === 9) enemyWave(3 , 10 , 500);
    if (wave === 10) enemyWave(1 , 10, 400 , 515 , -115 );
    if (wave === 11) enemyWave(1 , 10, 400 , 415 , -115 );
    if (wave === 12) enemyWave(1 , 13, 200 , 315 , -115 );
    if (wave === 13) enemyWave(2 , 15, 200 , 215 , -115 );
    if (wave === 14) bossWave(7, 20 , 115 , -115, 25 );
}

window.addEventListener('keydown', (e) => {
    isMoving[e.keyCode || e.which] = true;
});

window.addEventListener('keyup', (e) => {
    isMoving[e.keyCode|| e.which] = false;
    player.classList.remove('turn__left', 'turn__right');
});
window.addEventListener('keydown', shoot);
//prevent player from rapid fire
window.addEventListener('keyup' , () => {
    shouldPlayerShoot = true;
});

startGameButton.addEventListener('click', startGame );