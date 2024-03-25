// Ottieni elementi dal DOM
const startBtn = document.getElementById("start-btn"); // Pulsante di avvio
const canvas = document.getElementById("canvas"); // Canvas di gioco
const startScreen = document.querySelector(".start-screen"); // Schermata iniziale
const checkpointScreen = document.querySelector(".checkpoint-screen"); // Schermata di checkpoint
const checkpointMessage = document.querySelector(".checkpoint-screen > p"); // Messaggio nella schermata di checkpoint
const ctx = canvas.getContext("2d"); // Contesto del canvas
canvas.width = innerWidth; // Imposta la larghezza del canvas alla larghezza della finestra
canvas.height = innerHeight; // Imposta l'altezza del canvas all'altezza della finestra
const gravity = 0.5; // Gravità applicata al giocatore
let isCheckpointCollisionDetectionActive = true; // Controllo attivo della collisione con i checkpoint

// Funzione per calcolare le dimensioni proporzionali
const proportionalSize = (size) => {
  return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
}

// Classe per creare il giocatore
class Player {
  constructor() {
    this.position = {
      x: proportionalSize(10), // Posizione iniziale x
      y: proportionalSize(400), // Posizione iniziale y
    };
    this.velocity = {
      x: 0, // Velocità iniziale x
      y: 0, // Velocità iniziale y
    };
    this.width = proportionalSize(40); // Larghezza del giocatore
    this.height = proportionalSize(40); // Altezza del giocatore
  }
  draw() {
    ctx.fillStyle = "#99c9ff"; // Colore del giocatore
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Disegna il giocatore sul canvas
  }
  
  update() {
    this.draw(); // Disegna il giocatore
    this.position.x += this.velocity.x; // Aggiorna la posizione x in base alla velocità
    this.position.y += this.velocity.y; // Aggiorna la posizione y in base alla velocità

    // Controlla la collisione con il bordo inferiore del canvas
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = gravity;
      }
      this.velocity.y += gravity; // Applica la gravità
    } else {
      this.velocity.y = 0; // Ferma il giocatore quando raggiunge il bordo inferiore
    }

    // Impedisce al giocatore di uscire dal canvas sui lati
    if (this.position.x < this.width) {
      this.position.x = this.width;
    }

    if (this.position.x >= canvas.width - 2 * this.width) {
      this.position.x = canvas.width - 2 * this.width;
    }
  }
}

// Classe per creare le piattaforme
class Platform {
  constructor(x, y) {
    this.position = {
      x,
      y,
    };
    this.width = 200; // Larghezza della piattaforma
    this.height = proportionalSize(40); // Altezza della piattaforma
  }
  draw() {
    ctx.fillStyle = "#acd157"; // Colore della piattaforma
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Disegna la piattaforma sul canvas
  }
}

// Classe per creare i checkpoint
class CheckPoint {
  constructor(x, y, z) {
    this.position = {
      x,
      y,
    };
    this.width = proportionalSize(40); // Larghezza del checkpoint
    this.height = proportionalSize(70); // Altezza del checkpoint
    this.claimed = false; // Stato del checkpoint (non reclamato)
  };

  draw() {
    ctx.fillStyle = "#f1be32"; // Colore del checkpoint
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Disegna il checkpoint sul canvas
  }
  claim() {
    this.width = 0; // Rendi il checkpoint invisibile dopo la rivendicazione
    this.height = 0;
    this.position.y = Infinity;
    this.claimed = true; // Segna il checkpoint come reclamato
  }
};
// Creazione del giocatore
const player = new Player();

// Posizioni delle piattaforme
const platformPositions = [
  { x: 500, y: proportionalSize(450) },
  { x: 700, y: proportionalSize(400) },
  { x: 850, y: proportionalSize(350) },
  { x: 900, y: proportionalSize(350) },
  { x: 1050, y: proportionalSize(150) },
  { x: 2500, y: proportionalSize(450) },
  { x: 2900, y: proportionalSize(400) },
  { x: 3150, y: proportionalSize(350) },
  { x: 3900, y: proportionalSize(450) },
  { x: 4200, y: proportionalSize(400) },
  { x: 4400, y: proportionalSize(200) },
  { x: 4700, y: proportionalSize(150) },
];

// Creazione delle piattaforme
const platforms = platformPositions.map(
  (platform) => new Platform(platform.x, platform.y)
);

// Posizioni dei checkpoint
const checkpointPositions = [
  { x: 1170, y: proportionalSize(80), z: 1 },
  { x: 2900, y: proportionalSize(330), z: 2 },
  { x: 4800, y: proportionalSize(80), z: 3 },
];

const checkpoints = checkpointPositions.map(
  (checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z)
);

const animate = () => {
  requestAnimationFrame(animate); // richiede il prossimo frame per l'animazione
  ctx.clearRect(0, 0, canvas.width, canvas.height); // pulisce il canvas per il prossimo frame

  platforms.forEach((platform) => {
    platform.draw(); // disegna ogni piattaforma
  });

  checkpoints.forEach(checkpoint => {
    checkpoint.draw(); // disegna ogni checkpoint
  });

  player.update(); // aggiorna la posizione e la velocità del giocatore

  // gestisce la velocità del giocatore in base ai tasti premuti
  if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
    player.velocity.x = 5;
  } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    // muove piattaforme e checkpoint se i tasti sinistro o destro sono premuti
    if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive) {
      platforms.forEach((platform) => {
        platform.position.x -= 5; // muove le piattaforme a sinistra
      });

      checkpoints.forEach((checkpoint) => {
        checkpoint.position.x -= 5; // muove i checkpoint a sinistra
      });
    
    } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive) {
      platforms.forEach((platform) => {
        platform.position.x += 5; // muove le piattaforme a destra
      });

      checkpoints.forEach((checkpoint) => {
        checkpoint.position.x += 5; // muove i checkpoint a destra
      });
    }
  }

  // rilevamento delle collisioni con le piattaforme
  platforms.forEach((platform) => {
    const collisionDetectionRules = [
      player.position.y + player.height <= platform.position.y,
      player.position.y + player.height + player.velocity.y >= platform.position.y,
      player.position.x >= platform.position.x - player.width / 2,
      player.position.x <=
        platform.position.x + platform.width - player.width / 3,
    ];

    // se tutte le regole di collisione sono vere, ferma la caduta del giocatore
    if (collisionDetectionRules.every((rule) => rule)) {
      player.velocity.y = 0;
      return;
    }

    // ulteriori regole di rilevamento per la collisione con le piattaforme
    const platformDetectionRules = [
      player.position.x >= platform.position.x - player.width / 2,
      player.position.x <=
        platform.position.x + platform.width - player.width / 3,
      player.position.y + player.height >= platform.position.y,
      player.position.y <= platform.position.y + platform.height,
    ];

    // applica la gravità se il giocatore è sopra una piattaforma
    if (platformDetectionRules.every(rule => rule)) {
      player.position.y = platform.position.y + player.height;
      player.velocity.y = gravity;
    };
  });

  // rilevamento delle collisioni con i checkpoint
  checkpoints.forEach((checkpoint, index, checkpoints) => {
    const checkpointDetectionRules = [
      player.position.x >= checkpoint.position.x,
      player.position.y >= checkpoint.position.y,
      player.position.y + player.height <=
        checkpoint.position.y + checkpoint.height,
      isCheckpointCollisionDetectionActive,
      player.position.x - player.width <=
        checkpoint.position.x - checkpoint.width + player.width * 0.9,
      index === 0 || checkpoints[index - 1].claimed === true,
    ];

    // rivendica il checkpoint se tutte le regole sono vere
    if (checkpointDetectionRules.every((rule) => rule)) {
      checkpoint.claim();

      // gestisce l'arrivo all'ultimo checkpoint
      if (index === checkpoints.length - 1) {
        isCheckpointCollisionDetectionActive = false;
         showCheckpointScreen("You reached the final checkpoint!");
        movePlayer("ArrowRight", 0, false);
      }else if(player.position.x >= checkpoint.position.x && player.position.x <= checkpoint.position.x + 40) {
        showCheckpointScreen("You reached a checkpoint!") 
      }
    };
  });
}

const keys = {
  rightKey: {
    pressed: false // tasto destro non premuto
  },
  leftKey: {
    pressed: false // tasto sinistro non premuto
  }
};

// gestisce il movimento del giocatore in base ai tasti premuti
const movePlayer = (key, xVelocity, isPressed) => {
  if (!isCheckpointCollisionDetectionActive) {
    player.velocity.x = 0;
    player.velocity.y = 0;
    return;
  }

  // applica la velocità in base al tasto premuto
  switch (key) {
    case "ArrowLeft":
      keys.leftKey.pressed = isPressed;
      player.velocity.x -= xVelocity;
      break;
    case "ArrowUp":
    case " ":
    case "Spacebar":
      player.velocity.y -= 8; // salto
      break;
    case "ArrowRight":
      keys.rightKey.pressed = isPressed;
      player.velocity.x += xVelocity;
  }
}

const startGame = () => {
  canvas.style.display = "block"; // mostra il canvas
  startScreen.style.display = "none"; // nasconde la schermata di avvio
  animate(); // inizia l'animazione
}

// mostra la schermata dei checkpoint
const showCheckpointScreen = (msg) => {
  checkpointScreen.style.display = "block"; // mostra la schermata dei checkpoint
  checkpointMessage.textContent = msg; // imposta il messaggio dei checkpoint
  if (isCheckpointCollisionDetectionActive) {
    setTimeout(() => (checkpointScreen.style.display = "none"), 2000); // nasconde la schermata dopo 2 secondi
  }
};

// gestori per l'avvio del gioco e l'interazione tramite tastiera
startBtn.addEventListener("click", startGame);

window.addEventListener("keydown", ({ key }) => {
  movePlayer(key, 8, true); // gestisce la pressione dei tasti
});

window.addEventListener("keyup", ({ key }) => {
  movePlayer(key, 0, false); // gestisce il rilascio dei tasti
});
