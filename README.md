# Bot Discord - Elite Team Poker 🎰

Bot para gerenciar sessões de grind do time de poker, com painel dinâmico e interações via botões.

## Funcionalidades

- Comando `!painel` para exibir o painel de status
- Botão **🟢 Entrar no Grind** – abre um formulário para informar site e buy-in
- Botão **🔴 Encerrar Sessão** – remove o jogador do painel
- Lista em tempo real dos jogadores ativos com site e buy-in
- Painel atualizado automaticamente após cada interação

## Pré-requisitos

- Node.js 16.9.0 ou superior
- Conta de desenvolvedor no Discord
- Variável de ambiente `TOKEN_DO_BOT` configurada com o token do bot

## Instalação

1. Clone este repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd discord
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o token do bot:
   - Crie ou edite o arquivo `.env`
   - Defina `TOKEN_DO_BOT` com o token real do seu bot

4. Execute o bot:
   ```bash
   node index.js
   ```

## Configuração do Bot no Discord Developer Portal

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação e adicione um bot
3. Na seção **Bot**, ative as seguintes intents:
   - `GUILDS`
   - `GUILD_MESSAGES`
   - `MESSAGE_CONTENT`
4. Copie o token do bot e defina a variável `TOKEN_DO_BOT` no `.env`
5. Convide o bot para seu servidor usando a URL de convite gerada (com escopo `bot` e permissões adequadas)

## Uso

1. No canal desejado, digite `!painel`
2. O bot enviará o painel com os botões
3. Os jogadores clicam no botão verde para informar site e buy‑in
4. O painel é atualizado automaticamente
5. Para sair, clique no botão vermelho

## Estrutura de Arquivos

```
discord/
├── index.js          # Código principal do bot
├── package.json      # Dependências e scripts
├── .env              # Variáveis de ambiente locais
├── .env.example      # Exemplo sem segredo
├── .gitignore        # Arquivos ignorados pelo Git
└── README.md         # Este arquivo
```

## Dependências

- `discord.js` ^14.15.3 – API do Discord
- `dotenv` ^16.4.5 – Gerenciamento de variáveis de ambiente

## Notas

- Os dados dos jogadores são armazenados em memória (perdidos ao reiniciar o bot)
- O bot precisa da permissão **View Channels**, **Send Messages** e **Embed Links**
- Para produção, considere adicionar persistência com um banco de dados

## Suporte

Em caso de dúvidas, consulte a [documentação do Discord.js](https://discord.js.org) ou entre em contato com o desenvolvedor.

---

Desenvolvido para o **Elite Team Poker** 🃏
