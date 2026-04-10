# Guia de Implantação – Bot Discord no Railway (Hosting Gratuito)

Este guia explica como colocar o bot Discord online usando a plataforma [Railway](https://railway.app/). O Railway oferece um plano gratuito sem necessidade de cartão de crédito, ideal para bots pequenos.

## Pré‑requisitos

- Conta no [GitHub](https://github.com) com o repositório do bot já criado (exemplo: `https://github.com/username/discord`).
- O token do bot salvo no arquivo `.env` (localmente). Você precisará dele durante a implantação.
- Git instalado no seu computador (para fazer push das alterações, se necessário).

## Passo 1 – Atualizar o repositório GitHub

Certifique‑se de que todas as alterações locais estão commitadas e enviadas (push) para o GitHub.

```bash
git add .
git commit -m "Preparando para deploy no Railway"
git push origin main
```

**Nota:** Substitua `main` pelo nome da branch que você usa.

## Passo 2 – Criar conta no Railway

1. Acesse [railway.app](https://railway.app) e clique em **Start a New Project**.
2. Faça login com sua conta GitHub (recomendado) para facilitar a integração.

## Passo 3 – Criar um novo projeto

1. No dashboard do Railway, clique em **New Project**.
2. Escolha a opção **Deploy from GitHub repo**.
3. Autorize o Railway a acessar seu GitHub, se solicitado.
4. Selecione o repositório do bot (ex.: `username/discord`).

O Railway automaticamente detectará que é um projeto Node.js e iniciará a implantação. A primeira implantação pode falhar porque ainda não definimos a variável de ambiente do token.

## Passo 4 – Configurar a variável de ambiente

1. No dashboard do projeto, clique na aba **Variables**.
2. Adicione uma nova variável com:
   - **Key:** `TOKEN_DO_BOT`
   - **Value:** o token real do seu bot (copie do arquivo `.env` local).
3. Clique em **Add**.

**Importante:** Nunca compartilhe o token publicamente. O Railway mantém as variáveis seguras.

## Passo 5 – (Opcional) Ajustar configurações do serviço

Por padrão, o Railway cria um serviço do tipo **Web Service**. Como o bot Discord é um worker (não responde a requisições HTTP), você pode alterar o tipo para **Worker**:

1. Na aba **Settings** do serviço, procure a opção **Service Type**.
2. Mude de **Web Service** para **Worker**.
3. Salve as alterações.

Isso evita que o Railway espere que o bot exponha uma porta HTTP.

## Passo 6 – Reimplantar

Após adicionar a variável de ambiente (e alterar o tipo de serviço, se desejado), a implantação será automaticamente refeita. Caso não ocorra, você pode disparar uma implantação manualmente:

1. Na aba **Deployments**, clique em **Manual Deploy** → **Deploy Now**.

## Passo 7 – Verificar logs

Na aba **Logs** do projeto, você verá a saída do bot. Procure a mensagem:

```
✅ Bot online! Logado como NomeDoBot#1234
```

Se aparecer algum erro (ex.: token inválido, falta de permissões), corrija a variável de ambiente e reimplante.

## Passo 8 – Testar o bot no Discord

No seu servidor Discord, use os comandos `!painel` e `!stats` para verificar se o bot está respondendo.

## Manutenção e Atualizações

- **Atualizar o código:** Basta fazer push para a branch conectada ao Railway (ex.: `main`). A implantação contínua irá atualizar o bot automaticamente.
- **Reiniciar o bot:** Na aba **Settings** do serviço, use a opção **Restart**.
- **Monitorar uso:** O plano gratuito tem limites de uso (500 horas/mês, 1GB de RAM). Fique dentro desses limites para evitar interrupções.

## Solução de Problemas Comuns

| Problema | Possível causa | Solução |
|----------|----------------|---------|
| Bot não inicia | Token ausente ou inválido | Verifique a variável `TOKEN_DO_BOT` e reimplante. |
| Bot desconecta após alguns minutos | O serviço foi configurado como Web Service (expectativa de porta HTTP) | Altere o tipo de serviço para **Worker**. |
| Logs mostram `Error: Cannot find module` | Dependências não instaladas | O Railway executa `npm install` automaticamente. Se falhar, verifique se o `package.json` está correto. |
| Bot online mas não responde | Intents do Discord não habilitadas | No Discord Developer Portal, ative **MESSAGE CONTENT**, **GUILDS**, **GUILD_MESSAGES**. |

## Alternativas de Hospedagem

Se o Railway não atender suas necessidades, considere:

- **[Render](https://render.com)** – também tem plano gratuito (requer cartão de crédito para serviços web).
- **[Fly.io](https://fly.io)** – oferece créditos iniciais gratuitos.
- **[Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)** – VPS gratuito (mais complexo de configurar).

## Recursos

- [Documentação do Railway](https://docs.railway.app/)
- [Guia do Discord.js](https://discordjs.guide/)
- [Código deste bot](https://github.com/username/discord)

---

**Dúvidas?** Consulte a pasta `plans/` ou abra uma issue no repositório.