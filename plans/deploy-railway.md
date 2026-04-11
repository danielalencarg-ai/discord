# Deploy das alterações no Railway

## Contexto
O bot está hospedado no Railway com deploy automático a partir de um repositório GitHub. As modificações no código (`index.js` e `COMO-EXECUTAR.md`) já foram aplicadas localmente. Para que as alterações entrem em produção, você precisa enviá‑las para o repositório remoto.

## Passos

### 1. Verificar alterações locais
Execute no terminal (na pasta do projeto):
```bash
git status
```
Deve listar os arquivos modificados:
- `index.js`
- `COMO-EXECUTAR.md`
- possivelmente `plans/contador-tempo-bot.md` (novo)

### 2. Adicionar os arquivos ao stage
```bash
git add index.js COMO-EXECUTAR.md
```
(Opcional) Se quiser incluir o arquivo de plano:
```bash
git add plans/contador-tempo-bot.md
```

### 3. Criar um commit
```bash
git commit -m "Adiciona contador de tempo no painel (startTime, formatação, atualização automática)"
```

### 4. Enviar para o repositório remoto
```bash
git push origin main
```
(Substitua `main` pelo nome da branch que está usando, se for diferente.)

### 5. Verificar a conexão do Railway
- Acesse [railway.app](https://railway.app) e entre no projeto do bot.
- Na aba **Settings** > **Git**, confirme que o repositório está conectado.
- Na aba **Deployments**, o deploy automático deve ser ativado (geralmente está).

### 6. Monitorar o deploy
- Após o push, o Railway iniciará automaticamente um novo deploy.
- Acompanhe o log na aba **Deployments**; o status deve passar de `BUILDING` para `DEPLOYING` e finalmente `SUCCESS`.
- Se ocorrer algum erro, verifique os logs para identificar problemas (ex: erros de sintaxe, dependências).

### 7. Testar o bot online
- No Discord, use o comando `!painel` em um canal onde o bot tem permissão.
- Clique em uma rede para iniciar uma sessão e verifique se o contador de tempo aparece ao lado do jogador.
- Aguarde cerca de 1 minuto para confirmar que o painel está sendo atualizado automaticamente.

## Observações importantes
- O intervalo de atualização está definido para **60 segundos**. Durante o deploy, o bot será reiniciado e todos os jogadores ativos serão perdidos (dados em memória).
- Se o bot não responder após o deploy, verifique se o token do Discord ainda está válido na variável de ambiente `TOKEN_DO_BOT` no Railway.
- Caso encontre erros, consulte os logs do Railway e ajuste o código conforme necessário.

## Rollback (se necessário)
Se a nova funcionalidade causar problemas, você pode reverter para o commit anterior:
```bash
git revert HEAD
git push origin main
```
Ou, no Railway, faça um deploy manual de uma versão anterior.

## Suporte
Em caso de dúvidas, consulte a documentação do [Railway](https://docs.railway.app) ou peça ajuda a um desenvolvedor.

**Bom grind!** 🎰⏱️