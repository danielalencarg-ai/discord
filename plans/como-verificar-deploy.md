# Como verificar se o deploy foi feito no Railway

## 1. Acesse o painel do Railway
- Abra [railway.app](https://railway.app) no navegador.
- Faça login com a mesma conta que você usou para criar o projeto do bot.

## 2. Encontre o projeto
- Na página inicial (Dashboard), clique no projeto do bot (provavelmente chamado "discord" ou similar).

## 3. Navegue até a aba **Deployments**
- No menu lateral esquerdo, clique em **Deployments** (ou "Implantações").
- Você verá uma lista de todos os deploys realizados, ordenados do mais recente para o mais antigo.

## 4. Identifique o deploy mais recente
- Procure um deploy com a mensagem de commit **"Adiciona contador de tempo no painel (startTime, formatação, atualização automática)"**.
- O status pode ser:
  - `QUEUED` – aguardando na fila.
  - `BUILDING` – construindo a imagem (pode levar alguns minutos).
  - `DEPLOYING` – implantando no ambiente.
  - `SUCCESS` – deploy concluído com sucesso.
  - `FAILED` – houve um erro (clique para ver os logs).

## 5. Verifique os logs
- Clique no deploy para expandir e ver os logs detalhados.
- Role para baixo para ver as mensagens de build e runtime.
- Se houver erros (ex: `npm install` falhou, sintaxe inválida), eles aparecerão aqui.

## 6. Confirme que o bot está online
- Na aba **Metrics** ou **Logs**, você pode ver os logs em tempo real do bot.
- Se o bot estiver rodando, você verá mensagens como `✅ Bot online! Logado como ...`.
- Se o bot cair, os logs mostrarão erros de conexão.

## 7. Teste manualmente no Discord
- Vá para um canal do seu servidor Discord e digite `!painel`.
- Se o bot responder com o painel atualizado (com o contador ⏱️), o deploy foi bem‑sucedido.

## O que fazer se o deploy não aparecer?
- **Verifique a conexão do repositório**: Na aba **Settings** > **Git**, confirme que o repositório correto está vinculado.
- **Disparar um deploy manual**: No canto superior direito da aba **Deployments**, clique em **Manual Deploy** e selecione a branch `main`.
- **Analisar variáveis de ambiente**: Na aba **Variables**, certifique‑se de que `TOKEN_DO_BOT` está definido corretamente.

## Tempo estimado
- Um deploy no Railway geralmente leva **2‑5 minutos** para ser concluído (dependendo do tamanho do projeto).
- Se após 10 minutos o status ainda estiver `QUEUED`, pode haver uma fila de jobs; aguarde mais um pouco.

## Dica
Você pode receber notificações de deploy por e‑mail ou no Discord configurando webhooks nas **Settings** > **Notifications**.

**Boa verificação!** 🚀