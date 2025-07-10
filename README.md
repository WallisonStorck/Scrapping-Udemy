# 📊 Udemy Sales Tracker (Web Scraping with Puppeteer)

Este projeto realiza web scraping de páginas de cursos na Udemy com o objetivo de acompanhar a **evolução de vendas** ao longo do tempo. Ele automatiza a coleta de dados como título do curso, número de vendas e timestamp da coleta, armazenando essas informações localmente em arquivos JSON.

## 🚀 Objetivo

Monitorar o crescimento de cursos na Udemy para extrair insights de mercado como:

- Quais cursos estão vendendo mais
- Quantas vendas foram feitas desde a última coleta
- Evolução de vendas ao longo de dias e horas
- Informações que podem embasar estratégias para **vender cursos próprios**

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **Puppeteer** – para automação de navegação e scraping no navegador
- **fs (File System)** – para leitura e escrita de arquivos locais
- **path** – para criação de caminhos compatíveis entre sistemas operacionais

---

## ✅ Funcionalidades já implementadas

- [x] Abertura automática do navegador com Puppeteer
- [x] Acesso a uma lista de URLs de cursos na Udemy
- [x] Captura do título do curso
- [x] Captura da quantidade atual de alunos matriculados
- [x] Armazenamento dos dados em um arquivo `.json` para cada curso
- [x] Comparação com o dado anterior para calcular:
  - Novas vendas desde a última coleta
  - Diferença de tempo (dias e horas)
- [x] Criação automática de diretório `data` para armazenar os dados

---

## 📁 Estrutura dos Dados Salvos

Cada arquivo JSON tem a seguinte estrutura:

```json
{
  "nextID": 3,
  "data": [
    {
      "id": 1,
      "titleCourse": "Curso Exemplo",
      "salesQuantity": 1200,
      "timestamp": "2025-07-10 10:30:45"
    },
    {
      "id": 2,
      "titleCourse": "Curso Exemplo",
      "salesQuantity": 1250,
      "timestamp": "2025-07-11 10:40:00",
      "salesAmount": {
        "newSales": 50,
        "inDays": 1,
        "inHours": 0
      }
    }
  ]
}
```

---

## 📌 Como executar

1. Instale as dependências:

```bash
npm install puppeteer
```

2. Execute o script com:

```bash
node index.js
```

O navegador será aberto automaticamente (modo não-headless), visitará os cursos definidos na lista `courseUrls`, extrairá os dados e salvará em arquivos JSON na pasta `data`.

---

## 📅 Próximas melhorias

- [ ] Adicionar suporte a scraping autenticado (para cursos próprios com dados mais detalhados)
- [ ] Gerar gráficos automáticos (usando Chart.js, Plotly ou Google Charts)
- [ ] Exportar relatórios para `.csv` ou Excel
- [ ] Interface web simples para visualizar os dados
- [ ] Agendamento de coletas automáticas com `node-cron`
- [ ] Detecção de mudanças estruturais nos seletores e fallback automático

---

## 🧠 Possíveis insights futuros

- Comparativo semanal entre cursos concorrentes
- Lucro estimado por curso (baseado em preço \* número de alunos)
- Identificação de sazonalidade nas vendas
- Determinação de padrões de sucesso entre os cursos mais vendidos

---

## 📍 Autor

**Wallison Storck**  
Desenvolvedor e professor universitário  
Contato: [storck779@gmail.com](mailto:storck779@gmail.com)

---

## 📄 Licença

Este projeto é de uso pessoal e acadêmico.
