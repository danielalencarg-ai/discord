# Como Enviar os Arquivos sem Git (via GitHub Web)

Como o Git não está instalado no seu computador, você pode enviar os arquivos diretamente pelo site do GitHub.

## Passo 1 – Acesse seu repositório

Vá para `https://github.com/username/discord` (substitua `username` pelo seu nome de usuário).

## Passo 2 – Clique em **Add file** → **Upload files**

No canto superior direito do repositório, há um botão verde **Add file**. Clique nele e escolha **Upload files**.

## Passo 3 – Arraste os arquivos da pasta do bot

Abra o explorador de arquivos do Windows e vá para a pasta do bot:

`c:/Users/danie/OneDrive/Área de Trabalho/discord`

Selecione **todos os arquivos e pastas** exceto:

- `node_modules/` (não é necessário enviar)
- `.env` (contém seu token secreto – **NÃO envie este arquivo**)
- `test_config.txt` (arquivo de teste, pode ignorar)
- Qualquer outro arquivo temporário.

**Arquivos que devem ser enviados:**

- `index.js`
- `package.json`
- `package-lock.json`
- `logo.jpg`
- `Procfile`
- `railway.json`
- `.gitignore`
- `COMO-EXECUTAR.md`
- `GUIA-DISCORD.md`
- `README.md`
- Pasta `plans/` (com os guias dentro)

## Passo 4 – Faça commit diretamente no GitHub

Após arrastar os arquivos, role a página para baixo e preencha:

- **Commit message:** `Bot Discord pronto para deploy no Railway`
- **Branch:** `main` (ou a branch padrão do seu repositório)

Clique em **Commit changes**.

## Passo 5 – Verifique se tudo foi enviado

Recarregue a página do repositório e confira se todos os arquivos aparecem.

## Próximo passo

Agora que o código está no GitHub, siga o [guia de implantação no Railway](plans/deployment-guide-railway.md) para colocar o bot online.

## Instalar Git (opcional, mas recomendado)

Para futuras atualizações, é mais prático ter o Git instalado. Você pode baixá‑lo em [git‑scm.com](https://git‑scm.com/download/win) e instalar com as opções padrão.

Depois da instalação, abra um novo terminal e execute `git --version` para confirmar.