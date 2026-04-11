# Como Executar o Bot – Resumo Rápido

Siga estes passos para colocar o bot online no seu servidor.

---

## 1. Preparação

- Você já tem o token do bot no arquivo `.env` (foi preenchido automaticamente)
- As dependências já estão instaladas (pasta `node_modules`)

---

## 2. Configurar o Bot no Discord Developer Portal

**Se você ainda não configurou o bot no portal, siga o guia detalhado:** [`GUIA-DISCORD.md`](GUIA-DISCORD.md)

Resumo rápido:

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma aplicação e adicione um bot
3. Ative as intents **MESSAGE CONTENT**, **GUILDS**, **GUILD_MESSAGES**
4. Gere um link de convite com as permissões:
   - `View Channels`
   - `Send Messages`
   - `Embed Links`
   - `Read Message History`
5. Adicione o bot ao seu servidor usando o link

---

## 3. Executar o Bot

Abra o terminal na pasta do projeto (`c:/Users/danie/OneDrive/Área de Trabalho/discord`) e execute:

```bash
npm start
```

Ou, se preferir:

```bash
node index.js
```

**Você verá a mensagem:** `✅ Bot online! Logado como [nome do bot]`

Isso significa que o bot está conectado ao Discord e pronto para uso.

---

## 4. Testar

1. Vá para qualquer canal de texto do seu servidor
2. Digite:
   ```
   !painel
   ```
3. O bot enviará o painel de status com os botões **🟢 Entrar no Grind** e **🔴 Encerrar Sessão**
   - O painel agora exibe um contador de tempo (⏱️) ao lado de cada jogador, mostrando há quanto tempo ele está na sessão. O contador é atualizado automaticamente a cada minuto.
4. Clique nos botões e preencha o formulário para ver a atualização em tempo real

---

## 5. Manter o Bot Online

- Para deixar o bot rodando 24h, use um serviço de hospedagem (Heroku, Railway, Replit) ou execute em uma máquina que fique sempre ligada.
- Uma opção simples é usar o **PM2** (gerenciador de processos):
  ```bash
  npm install -g pm2
  pm2 start index.js
  pm2 save
  pm2 startup
  ```

---

## Arquivos Importantes

- [`index.js`](index.js) – código do bot
- [`.env`](.env) – token do bot (já preenchido)
- [`package.json`](package.json) – configuração do projeto
- [`README.md`](README.md) – documentação completa
- [`GUIA-DISCORD.md`](GUIA-DISCORD.md) – guia detalhado de configuração no portal

---

## Dúvidas?

Consulte a documentação do [Discord.js](https://discord.js.org) ou peça ajuda a um desenvolvedor.

**Bom grind!** 🎰🃏