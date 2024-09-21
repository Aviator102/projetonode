const puppeteer = require('puppeteer');
const axios = require('axios');

// Configurações do Baserow
const token = 'PUWrEOrsL8THti1rgmnTwPlio0udsZuh';  // Seu token de API
const table_id = 359943;  // ID da tabela no Baserow
const url_baserow = `https://api.baserow.io/api/database/rows/table/${table_id}/?user_field_names=true`;

// Função para inserir resultado na tabela do Baserow
async function inserirResultadoBaserow(valor, hora) {
  try {
    const response = await axios.post(url_baserow, {
      valor: valor,
      hora: hora,
    }, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      console.log('Resultado inserido no Baserow com sucesso!');
    } else {
      console.log(`Erro ao inserir no Baserow. Código: ${response.status}, Resposta: ${response.data}`);
    }
  } catch (error) {
    console.error('Erro ao inserir no Baserow:', error);
  }
}

// Função principal para capturar os resultados
async function capturarResultados() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Acessa a página de login
  await page.goto('https://m.vaidebet.com/ptb/games/casino/detail/normal/7787');
  
  // Preenche os campos de login
  await page.type('#username', 'joseAviatorr');
  await page.type('#password', 'Aviator102030!');

  // Clica no botão de login
  await Promise.all([
    page.click('button.btn.login-btn'),
    page.waitForNavigation(),
  ]);

  // Acessa o iframe do jogo
  const iframe = await page.$('iframe');
  const frame = await iframe.contentFrame();

  // Captura os resultados da página
  const resultados = await frame.evaluate(() => {
    const elementos = Array.from(document.querySelectorAll('.class-para-resultados'));
    return elementos.map(el => el.innerText.replace('x', ''));
  });

  await browser.close();

  return resultados;
}

// Função para o loop de captura e inserção de resultados no Baserow
async function loop() {
  const novosResultados = await capturarResultados();

  if (novosResultados && novosResultados.length > 0) {
    for (const resultado of novosResultados) {
      const horaAtual = new Date().toLocaleTimeString('pt-BR');
      console.log(`Resultado: ${resultado} | Hora: ${horaAtual}`);
      await inserirResultadoBaserow(resultado, horaAtual);
    }
  }
}

// Inicia o loop de captura de resultados
setInterval(loop, 10000);  // Executa a cada 10 segundos
