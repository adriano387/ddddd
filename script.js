document.getElementById('presente').onclick = function(){
  document.getElementById('telaPresente').classList.add('hidden');
  document.getElementById('conteudo').classList.remove('hidden');
  window.scrollTo(0,0);
};

const motivos = [
  "Tipo o Patrick Jane, eu observei tudo e descobri: seu sorriso é meu lugar favorito.",
  "Você tem o sorriso mais lindo que eu já vi.",
  "Conversar com você é a melhor parte do meu dia.",
  "Você tem um jeito que ninguém mais tem.",
  "Você me faz querer ser melhor.",
  "Seu riso é viciante.",
  "Você é linda sem nem tentar.",
  "Quando você tá perto, tudo fica mais leve.",
  "Todo dia com você é mais divertido.",
  "Você é meu lugar favorito no mundo."
];

let div = document.getElementById('motivos');
motivos.forEach((m, i) => {
  let b = document.createElement('button');
  b.className = 'botao-motivo';
  b.innerText = 'Motivo ' + (i+1) + ' 💗';
  b.onclick = () => {
    document.getElementById('motivoTexto').innerText = m;
    document.getElementById('popup').classList.remove('hidden');
  };
  div.appendChild(b);
});

function fecharPopup(){
  document.getElementById('popup').classList.add('hidden');
}

document.getElementById('popup').onclick = function(e){
  if(e.target.id === 'popup'){ fecharPopup(); }
};

function telaCheia(){
  document.getElementById('cardJogo').classList.add('tela-cheia');
  document.getElementById('btnSair').classList.remove('hidden');
  if(document.documentElement.requestFullscreen){
    document.documentElement.requestFullscreen();
  }
}
function sairTelaCheia(){
  document.getElementById('cardJogo').classList.remove('tela-cheia');
  document.getElementById('btnSair').classList.add('hidden');
  if(document.exitFullscreen && document.fullscreenElement){
    document.exitFullscreen();
  }
}

let canvas = document.getElementById('jogo');
let ctx = canvas.getContext('2d');
let box = 20;
let cobra, direcao, coracao, pontos, jogoInterval, jogando;

function criarCoracao(){
  coracao = {
    x: Math.floor(Math.random() * 15) * box,
    y: Math.floor(Math.random() * 15) * box
  };
}

function desenhar(){
  ctx.fillStyle = '#fff0f6';
  ctx.fillRect(0, 0, 300, 300);
  ctx.font = '20px Arial';
  ctx.fillText('💗', coracao.x, coracao.y + 18);
  cobra.forEach((parte, index) => {
    ctx.fillStyle = index === 0 ? '#ff4d8d' : '#ff8fb8';
    ctx.fillRect(parte.x, parte.y, box-2, box-2);
    if(index === 0){
      ctx.fillStyle = 'white';
      ctx.fillRect(parte.x+4, parte.y+4, 4, 4);
      ctx.fillRect(parte.x+12, parte.y+4, 4, 4);
    }
  });
  let cabeca = {x: cobra[0].x, y: cobra[0].y};
  if(direcao === 'left') cabeca.x -= box;
  if(direcao === 'right') cabeca.x += box;
  if(direcao === 'up') cabeca.y -= box;
  if(direcao === 'down') cabeca.y += box;
  if(cabeca.x < 0 || cabeca.x >= 300 || cabeca.y < 0 || cabeca.y >= 300 || cobra.some(p => p.x === cabeca.x && p.y === cabeca.y)){
    clearInterval(jogoInterval);
    jogando = false;
    document.getElementById('msgJogo').innerText = 'Fim do jogo! Você pegou ' + pontos + ' corações, Evelly! Aperta Jogar de novo 💗';
    return;
  }
  cobra.unshift(cabeca);
  if(cabeca.x === coracao.x && cabeca.y === coracao.y){
    pontos++;
    document.getElementById('placar').innerText = pontos;
    criarCoracao();
  } else {
    cobra.pop();
  }
}

function comecarJogo(){
  cobra = [{x: 140, y: 140}, {x: 120, y: 140}, {x: 100, y: 140}];
  direcao = 'right';
  pontos = 0;
  jogando = true;
  document.getElementById('placar').innerText = '0';
  document.getElementById('msgJogo').innerText = 'Vai, Evelly! Desliza o dedo 💗';
  criarCoracao();
  clearInterval(jogoInterval);
  jogoInterval = setInterval(desenhar, 150);
}

function mudarDirecao(nova){
  if(nova === 'left' && direcao !== 'right') direcao = 'left';
  if(nova === 'right' && direcao !== 'left') direcao = 'right';
  if(nova === 'up' && direcao !== 'down') direcao = 'up';
  if(nova === 'down' && direcao !== 'up') direcao = 'down';
}

let startX = 0, startY = 0;
canvas.addEventListener('touchstart', function(e){
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, {passive:true});

canvas.addEventListener('touchend', function(e){
  let endX = e.changedTouches[0].clientX;
  let endY = e.changedTouches[0].clientY;
  let dx = endX - startX;
  let dy = endY - startY;
  if(Math.abs(dx) > Math.abs(dy)){
    if(dx > 20) mudarDirecao('right');
    if(dx < -20) mudarDirecao('left');
  } else {
    if(dy > 20) mudarDirecao('down');
    if(dy < -20) mudarDirecao('up');
  }
}, {passive:true});

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowLeft') mudarDirecao('left');
  if(e.key === 'ArrowRight') mudarDirecao('right');
  if(e.key === 'ArrowUp') mudarDirecao('up');
  if(e.key === 'ArrowDown') mudarDirecao('down');
});