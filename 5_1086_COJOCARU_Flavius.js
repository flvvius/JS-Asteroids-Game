const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const FPS = 30;
const dimensiuneNava = 30;
const vitezaDeplasare = 6;
const vitezaRotire = 360; // grade
const DIMENSIUNE_ASTEROID = 100;
const arataCerc = false;
const DURATA_EXPLOZIE = 0.3;
const INVINCIBILITATE_NAVA = 3;
const BLINK_NAVA = 0.1;
const NR_MAX_RACHETE = 3;
const VITEZA_RACHETE = 500;
const DIST_MAX = 0.6;

let VITEZA_ASTEROIZI = 200;
let NR_ASTEROIZI = 5;
let nrVieti = 3;
let gameOver = false;
let puncte = 0;
let level = 1;

const creazaNava = () => {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: dimensiuneNava / 2,
        directie: 90 / 180 * Math.PI,
        rotatie: 0,
        seDeplaseaza: false,
        deplasare: {
            x: 0,
            y: 0
        },
        sus: false,
        jos: false,
        stanga: false,
        dreapta: false,
        timpExplozie: 0,
        blinkNum: Math.ceil(INVINCIBILITATE_NAVA / BLINK_NAVA),
        blinkTime: Math.ceil(BLINK_NAVA * FPS),
        poateLansaRacheta: true,
        rachete: []
    }
}


let navaSpatiala = creazaNava();

let asteroizi = [];

document.addEventListener("keydown", (e) => {

    switch(e.key) {
        case "z":
            navaSpatiala.rotatie = vitezaRotire / 180 * Math.PI / FPS;
            break;
        case "x":
            lanseazaRacheta();
            break;
        case "c":
            navaSpatiala.rotatie = -vitezaRotire / 180 * Math.PI / FPS;
            break;
        case "ArrowUp":
            navaSpatiala.seDeplaseaza = true;
            navaSpatiala.sus = true;
            break;
        case "ArrowDown":
            navaSpatiala.seDeplaseaza = true;
            navaSpatiala.jos = true;
            break;
        case "ArrowLeft":
            navaSpatiala.seDeplaseaza = true;
            navaSpatiala.stanga = true;
            break;
        case "ArrowRight":
            navaSpatiala.seDeplaseaza = true;
            navaSpatiala.dreapta = true;
            break;
    }
});
document.addEventListener("keyup", (e) => {

    switch(e.key) {
        case "z":
            navaSpatiala.rotatie = 0;
            break;
        case "x":
            navaSpatiala.poateLansaRacheta = true;
            break;
        case "c":
            navaSpatiala.rotatie = 0;
            break;
        case "ArrowUp":
            navaSpatiala.seDeplaseaza = false;
            navaSpatiala.sus = false;
            break;
        case "ArrowDown":
            navaSpatiala.seDeplaseaza = false;
            navaSpatiala.jos = false;
            break;
        case "ArrowLeft":
            navaSpatiala.seDeplaseaza = false;
            navaSpatiala.stanga = false;
            break;
        case "ArrowRight":
            navaSpatiala.seDeplaseaza = false;
            navaSpatiala.dreapta = false;
            break;
    }
});

const lanseazaRacheta = () => {

    if (navaSpatiala.poateLansaRacheta && navaSpatiala.rachete.length < NR_MAX_RACHETE) {
         navaSpatiala.rachete.push({
            x: navaSpatiala.x + navaSpatiala.radius * Math.cos(navaSpatiala.directie),
            y: navaSpatiala.y - navaSpatiala.radius * Math.sin(navaSpatiala.directie),
            xv: VITEZA_RACHETE * Math.cos(navaSpatiala.directie) / FPS,
            yv: -VITEZA_RACHETE * Math.sin(navaSpatiala.directie) / FPS,
            dist: 0
         })
    }

    navaSpatiala.poateLansaRacheta = false;
}

const creazaAsteroizi = () => {
    asteroizi = [];
    let x, y;
    for (let i = 0; i < NR_ASTEROIZI; i++) {
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        } while (distantaDintrePuncte(navaSpatiala.x, navaSpatiala.y, x, y) < DIMENSIUNE_ASTEROID * 2 + navaSpatiala.radius);
        
        asteroizi.push(creazaAsteroidNou(x, y));
    }
}

const distantaDintrePuncte = (x1, y1, x2, y2) => {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

const creazaAsteroidNou = (x, y) => {
    const asteroid = {
        x: x,
        y: y,
        xv: Math.random() * VITEZA_ASTEROIZI / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * VITEZA_ASTEROIZI / FPS * (Math.random() < 0.5 ? 1 : -1),
        radius: DIMENSIUNE_ASTEROID / 6,
        directie: Math.random() * Math.PI * 2,
        rezistenta: Math.floor(Math.random() * 4) + 1
    };
    return asteroid;
}

creazaAsteroizi();

let vietiText = document.querySelector('#vieti');
let gameOverText = document.querySelector('h1');
let btnRestart = document.querySelector('button');
let puncteText = document.querySelector('#puncte');
let levelText = document.querySelector('#level')

btnRestart.addEventListener('click', () => {
    gameOver = false;
    nrVieti = 3;
    gameOverText.style.display = 'none';
    btnRestart.style.display = 'none';
    creazaAsteroizi();
    puncte = 0;
    level = 1;
})

const updateGame = () => {

    vietiText.textContent = `Numar vieti: ${nrVieti}`;
    puncteText.textContent = `Puncte: ${puncte}`;
    levelText.textContent = `Level: ${level}`;

    if (gameOver === true) {
        gameOverText.style.display = 'block';
        btnRestart.style.display = 'block';
        return;
    }

    if (asteroizi.length === 0) {
        level++;
        VITEZA_ASTEROIZI += 30;
        NR_ASTEROIZI += 1;
        creazaAsteroizi();
    }

    if (puncte >= 5000 && nrVieti < 3) {
        puncte -= 5000;
        nrVieti++;
    }

    let isBlinking = navaSpatiala.blinkNum % 2 == 0;
    let explodeaza = navaSpatiala.timpExplozie > 0;

    // background
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // nava spatiala - triunghi
    if (!explodeaza) {
        if (isBlinking && !navaSpatiala.gameOver) {
            context.strokeStyle = 'white';
            context.lineWidth = dimensiuneNava / 20;
            context.beginPath();
            context.moveTo(
                navaSpatiala.x + navaSpatiala.radius * Math.cos(navaSpatiala.directie),
                navaSpatiala.y - navaSpatiala.radius * Math.sin(navaSpatiala.directie)
            );
            context.lineTo(
                navaSpatiala.x - navaSpatiala.radius * (Math.cos(navaSpatiala.directie) + Math.sin(navaSpatiala.directie)),
                navaSpatiala.y + navaSpatiala.radius * (Math.sin(navaSpatiala.directie) - Math.cos(navaSpatiala.directie))
            )
            context.lineTo(
                navaSpatiala.x - navaSpatiala.radius * (Math.cos(navaSpatiala.directie) - Math.sin(navaSpatiala.directie)),
                navaSpatiala.y + navaSpatiala.radius * (Math.sin(navaSpatiala.directie) + Math.cos(navaSpatiala.directie))
            )
            context.closePath();
            context.stroke();   
        } 
        
        if (navaSpatiala.blinkNum > 0) {
            navaSpatiala.blinkTime--;

            if (navaSpatiala.blinkTime == 0) {
                navaSpatiala.blinkTime = Math.ceil(BLINK_NAVA * FPS);
                navaSpatiala.blinkNum--;
            }
        }

    } else {
        context.fillStyle = "darkred";
        context.beginPath();
        context.arc(navaSpatiala.x, navaSpatiala.y, navaSpatiala.radius * 1.7, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = "red";
        context.beginPath();
        context.arc(navaSpatiala.x, navaSpatiala.y, navaSpatiala.radius * 1.4, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = "orange";
        context.beginPath();
        context.arc(navaSpatiala.x, navaSpatiala.y, navaSpatiala.radius * 1.1, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(navaSpatiala.x, navaSpatiala.y, navaSpatiala.radius * 0.8, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = "white";
        context.beginPath();
        context.arc(navaSpatiala.x, navaSpatiala.y, navaSpatiala.radius * 0.4, 0, Math.PI * 2, false);
        context.fill();
    }

    const explodeazaNava = () => {
        navaSpatiala.timpExplozie = Math.ceil(DURATA_EXPLOZIE * FPS);
    }

    let ax, ay, ar, lx, ly;
    for (let i = asteroizi.length - 1; i >= 0; i--) {
        ax = asteroizi[i].x;
        ay = asteroizi[i].y;
        ar = asteroizi[i].radius * asteroizi[i].rezistenta;

        for (let j = navaSpatiala.rachete.length - 1; j >= 0; j--) {
            lx = navaSpatiala.rachete[j].x;
            ly = navaSpatiala.rachete[j].y;

            if (distantaDintrePuncte(ax, ay, lx, ly) < ar) {
                navaSpatiala.rachete.splice(j, 1);
                asteroizi[i].rezistenta--;
                puncte += 50;
                if (asteroizi[i].rezistenta === 0) {
                    asteroizi.splice(i, 1);
                    puncte += 100;
                }
                
                break;
            }
        }
    }


    if (!explodeaza) {
        if (navaSpatiala.blinkNum == 0) {
            for (let i = 0; i < asteroizi.length; i++) {
                if (distantaDintrePuncte(navaSpatiala.x, navaSpatiala.y, asteroizi[i].x, asteroizi[i].y) < navaSpatiala.radius + asteroizi[i].radius * asteroizi[i].rezistenta) {
                    explodeazaNava();
                    nrVieti--;
                    if (nrVieti === 0) {
                        gameOver = true;
                    }
                    break;
                }
            }
        }
        
        navaSpatiala.directie += navaSpatiala.rotatie;
    
        navaSpatiala.x += navaSpatiala.deplasare.x;
        navaSpatiala.y += navaSpatiala.deplasare.y;
    } else {
        navaSpatiala.timpExplozie--;

        if (navaSpatiala.timpExplozie === 0) {
            navaSpatiala = creazaNava();
        }
    }
    


    if (navaSpatiala.seDeplaseaza) {
        if (navaSpatiala.sus) {
            navaSpatiala.deplasare.y = -vitezaDeplasare;
        }
        if (navaSpatiala.jos) {
            navaSpatiala.deplasare.y = vitezaDeplasare;
        }
        if (navaSpatiala.dreapta) {
            navaSpatiala.deplasare.x = vitezaDeplasare;
        }
        if (navaSpatiala.stanga) {
            navaSpatiala.deplasare.x = -vitezaDeplasare;
        } 
    } else {
        navaSpatiala.deplasare.x -= navaSpatiala.deplasare.x / FPS * 2;
        navaSpatiala.deplasare.y -= navaSpatiala.deplasare.y / FPS * 2;
    }

    // nava - marginea ecranului
    if (navaSpatiala.x < 0 - navaSpatiala.radius) {
        navaSpatiala.x = canvas.width + navaSpatiala.radius;
    } else if (navaSpatiala.x > canvas.width + navaSpatiala.radius) {
        navaSpatiala.x = 0 - navaSpatiala.radius;
    } else if (navaSpatiala.y < 0 - navaSpatiala.radius) {
        navaSpatiala.y = canvas.height + navaSpatiala.radius;
    } else if (navaSpatiala.y > canvas.height + navaSpatiala.radius) {
        navaSpatiala.y = 0 - navaSpatiala.radius;
    }

    for (let i = 0; i < navaSpatiala.rachete.length; i++) {
        context.fillStyle = 'salmon';
        context.beginPath();
        context.arc(navaSpatiala.rachete[i].x, navaSpatiala.rachete[i].y, dimensiuneNava / 15, 0, Math.PI * 2, false);
        context.fill();
    }

    for (let i = navaSpatiala.rachete.length - 1; i >= 0; i--) {

        if (navaSpatiala.rachete[i].dist > DIST_MAX * canvas.width) {
            navaSpatiala.rachete.splice(i, 1);
            continue;
        }

        navaSpatiala.rachete[i].dist += Math.sqrt(Math.pow(navaSpatiala.rachete[i].xv, 2) + Math.pow(navaSpatiala.rachete[i].yv, 2));

        navaSpatiala.rachete[i].x += navaSpatiala.rachete[i].xv;
        navaSpatiala.rachete[i].y += navaSpatiala.rachete[i].yv;

        if (navaSpatiala.rachete[i].x < 0) {
            navaSpatiala.rachete[i].x = canvas.width;
        } else if (navaSpatiala.rachete[i].x > canvas.width) {
            navaSpatiala.rachete[i].x = 0;
        }
        if (navaSpatiala.rachete[i].y < 0) {
            navaSpatiala.rachete[i].y = canvas.height;
        } else if (navaSpatiala.rachete[i].y > canvas.height) {
            navaSpatiala.rachete[i].y = 0;
        }
    } 

    if (arataCerc) {
        context.strokeStyle = "lime";
        context.beginPath();
        context.arc(navaSpatiala.x, navaSpatiala.y, navaSpatiala.radius, 0, Math.PI * 2, false);
        context.stroke();
    }

    // asteroizi
    context.strokeStyle = "slategrey";
    context.lineWidth = dimensiuneNava / 20;
    for (let i = 0; i < asteroizi.length; i++) {
        let x = asteroizi[i].x;
        let y = asteroizi[i].y;
        let radius = asteroizi[i].radius;
        let rezistenta = asteroizi[i].rezistenta;
        // console.log(x, y, radius);


        let culoare;
        if (rezistenta === 4) {
            culoare = '#454240'
        } else if (rezistenta === 3) {
            culoare = '#403328'
        } else if (rezistenta === 2) {
            culoare = '#402812';
        } else {
            culoare = '#2e1701';
        }

        context.fillStyle = culoare;
        context.beginPath();
        context.arc(x, y, radius * rezistenta, 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();
        context.stroke();

        context.font = '18px Arial';
        context.fillStyle = 'white';
        let textX = x - context.measureText(rezistenta).width / 2;
        let textY = y + 5;

        context.fillText(rezistenta, textX, textY);


        asteroizi[i].x += asteroizi[i].xv;
        asteroizi[i].y += asteroizi[i].yv;

        if (asteroizi[i].x < 0 - asteroizi[i].radius) {
            asteroizi[i].x = canvas.width + asteroizi[i].radius;
        } else
        if (asteroizi[i].x > canvas.width + asteroizi[i].radius) {
            asteroizi[i].x = 0 - asteroizi[i].radius;
        }

        if (asteroizi[i].y < 0 - asteroizi[i].radius) {
            asteroizi[i].y = canvas.height + asteroizi[i].radius;
        } else
        if (asteroizi[i].y > canvas.height + asteroizi[i].radius) {
            asteroizi[i].y = 0 - asteroizi[i].radius;
        }
    }

}

setInterval(updateGame, 1000 / FPS);
