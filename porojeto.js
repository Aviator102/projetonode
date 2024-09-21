const puppeteer = require('puppeteer');
const axios = require('axios');

// Configurações do Baserow
const token = 'PUWrEOrsL8THti1rgmnTwPlio0udsZuh';
const table_id = 359943;
const url_baserow = `https://api.baserow.io/api/database/rows/table/${table_id}/?user_field_names=true`;

// Função para inserir resultado na tabela do Baserow
async function inserirResultadoBaserow(valor, hora) {
  const dados_para_inserir = {
    valor: valor,
    hora: hora
  };

  try {
    const response = await axios.post(url_baserow, dados_para_inserir, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Resultado inserido no Baserow com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir no Baserow:', error.response ? error.response.data : error.message);
  }
}

// Função principal para capturar os resultados
async function capturarResultados() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://m.vaidebet.com/ptb/games/casino/detail/normal/7787');

  // Preenche os campos de login
  await page.waitForSelector('#username');
  await page.type('#username', 'joseAviatorr');

  await page.waitForSelector('#password');
  await page.type('#password', 'Aviator102030!');

  // Clica no botão de login
  await page.click('button.btn.login-btn');
  await page.waitForTimeout(5000); // Espera o carregamento da página pós-login

  const resultados = [];

  // Loop para capturar e inserir resultados
  while (true) {
    // Aguarda o carregamento do iframe
    await page.waitForSelector('iframe');

    const iframe = await page.frames().find(frame => frame.url().includes('casino-details'));
    await iframe.waitForSelector('div:nth-child(1)'); // Ajuste o seletor conforme necessário

    const novos_resultados = await iframe.evaluate(() => {
      const resultados = Array.from(document.querySelectorAll('div:nth-child(1)')).map(el => el.innerText);
      return resultados.filter(r => !r.includes('x')).slice(0, 10); // Ajuste conforme necessário
    });

    // Insere os novos resultados
    for (const resultado of novos_resultados) {
      const horaAtual = new Date().toLocaleTimeString('pt-BR');
      console.log(`Resultado: ${resultado} | Hora: ${horaAtual}`);
      await inserirResultadoBaserow(resultado, horaAtual);
    }

    await page.waitForTimeout(10000); // Espera 10 segundos antes de buscar novos resultados
  }

  await browser.close();
}

// Inicia a captura de resultados
capturarResultados();
