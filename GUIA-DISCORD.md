# Guia Passo a Passo: Configurar o Bot no Discord Developer Portal

Este guia explica como configurar o bot no Discord Developer Portal, gerar o link de convite e colocá‑lo no seu servidor.

**📝 Nota sobre idioma:** Se o seu Discord Developer Portal estiver em português, alguns termos podem aparecer traduzidos. Ao longo do guia, indicaremos os equivalentes em português entre parênteses.

---

## 1. Acessar o Discord Developer Portal

1. Abra o navegador e vá para [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. Faça login com sua conta do Discord (a mesma que você usa no servidor onde o bot será adicionado)

---

## 2. Criar uma Nova Aplicação

1. Clique no botão **"New Application"** (canto superior direito)
2. Dê um nome para a aplicação (ex: "Elite Team Poker Bot")
3. Clique em **"Create"**

---

## 3. Adicionar um Bot à Aplicação

1. No menu lateral esquerdo, clique em **"Bot"**
2. Clique no botão **"Add Bot"** (confirme com "Yes, do it!")
3. Agora você verá a seção do bot com o nome, ícone e token.

**Importante:** O token do bot já foi inserido automaticamente no arquivo `.env` do projeto. Não compartilhe esse token com ninguém.

---

## 4. Configurar as Intents (Permissões de Funcionalidade)

O bot precisa de certas permissões para ler mensagens e interagir.

**Nota:** As intents são configuradas na página **"Bot"**, não na seção **"OAuth2"**. A OAuth2 é usada apenas para gerar o link de convite.

**Se o seu Discord Developer Portal estiver em português:**
- **"Bot"** pode aparecer como **"Robô"**
- **"Privileged Gateway Intents"** pode ser **"Intents Privilegiados do Gateway"**
- **"MESSAGE CONTENT INTENT"** pode estar como **"INTENT DE CONTEÚDO DE MENSAGEM"**
- **"Save Changes"** é **"Salvar Alterações"**

1. Na mesma página **"Bot"**, desça até a seção **"Privileged Gateway Intents"**
2. Ative as três intents abaixo:
   - ✅ **SERVER MEMBERS INTENT** (não é obrigatório, mas pode ser útil)
   - ✅ **MESSAGE CONTENT INTENT** (**obrigatório** para o comando `!painel`)
   - ✅ **PRESENCE INTENT** (não é necessário, pode deixar desativado)
3. **Não se esqueça de clicar no botão "Save Changes"** no final da página.

---

## 5. Copiar o Token (Opcional – já está no .env)

Se precisar recriar o token:

1. Na seção **"Bot"**, clique em **"Reset Token"** (somente se o token atual tiver vazado)
2. Copie o novo token (aparece em uma caixa de texto)
3. Substitua o valor no arquivo `.env` do projeto pela nova string.

---

## 6. Gerar o Link de Convite (OAuth2)

Para adicionar o bot ao seu servidor, gere um link de convite com as permissões certas.

1. No menu lateral, clique em **"OAuth2"** → **"URL Generator"**
2. Em **"Scopes"**, marque a caixa **`bot`**
3. Em **"Bot Permissions"**, selecione as permissões necessárias:
   - `View Channels`
   - `Send Messages`
   - `Embed Links`
   - `Read Message History`
   - `Use Slash Commands` (opcional)
   - `Use External Emojis` (opcional)
4. A página gerará uma URL no final da tela (parecida com `https://discord.com/api/oauth2/authorize?client_id=...`)

5. **Copie essa URL** e abra‑a no navegador.
6. Escolha o servidor onde deseja adicionar o bot e clique em **"Authorize"**.
7. Conclua o captcha (se aparecer).

---

## 7. Executar o Bot Localmente

Agora que o bot está no servidor, você precisa executar o código para que ele fique online.

1. Abra o terminal (Prompt de Comando, PowerShell ou VS Code Terminal) na pasta do projeto (`c:/Users/danie/OneDrive/Área de Trabalho/discord`)
2. Certifique‑se de que as dependências estão instaladas:
   ```bash
   npm install
   ```
3. Inicie o bot com um dos comandos abaixo:
   ```bash
   npm start
   ```
   ou
   ```bash
   node index.js
   ```
4. Você verá a mensagem **"✅ Bot online! Logado como [nome do bot]"** no terminal.

**Pronto!** O bot já está funcionando e respondendo ao comando `!painel`.

---

## 8. Testar o Bot

1. Vá para qualquer canal de texto do seu servidor (onde o bot tenha permissão)
2. Digite:
   ```
   !painel
   ```
3. O bot enviará o painel de status com os botões **🟢 Entrar no Grind** e **🔴 Encerrar Sessão**.
4. Clique nos botões e preencha o formulário para ver a atualização em tempo real.

---

## 9. Manter o Bot Online

Se você fechar o terminal, o bot para de funcionar. Para deixá‑lo online 24h, você pode:

- **Usar um serviço de hospedagem** como Heroku, Railway, Replit, ou um VPS
- **Rodar em uma máquina local** que fique sempre ligada (ex: um PC antigo)
- **Usar um processo em segundo plano** com `pm2` (instale com `npm install -g pm2` e execute `pm2 start index.js`)

---

## Solução de Problemas Comuns

### O bot não responde ao `!painel`
- Verifique se a intent **MESSAGE CONTENT** está ativada no Discord Developer Portal
- Confirme se o bot tem permissão para ver e enviar mensagens no canal

### Token inválido
- Certifique‑se de que o token no arquivo `.env` está exatamente igual ao token do portal (sem espaços extras)
- Se o token foi resetado, atualize o `.env` e reinicie o bot

### O modal não aparece ao clicar no botão verde
- O bot precisa da permissão **Embed Links** e **Use External Emojis**
- Verifique se a versão do `discord.js` está correta (a versão instalada é a 14.x)

### O bot desconecta depois de alguns minutos
- Isso ocorre se a conexão com a internet cair ou se o processo for interrompido
- Considere usar `pm2` para reinício automático

---

## Recursos Úteis

- [Documentação do Discord.js](https://discord.js.org)
- [Discord Developer Portal](https://discord.com/developers)
- [Guia de Intents](https://discordjs.guide/popular-topics/intents.html)

---

Se ainda tiver dúvidas, peça ajuda a um desenvolvedor ou consulte a comunidade do Discord.js.

**Divirta‑se com o seu bot de poker!** 🎰🃏