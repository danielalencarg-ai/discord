# Como Subir o Código para o GitHub

Este guia explica como enviar (push) o código do bot Discord para o seu repositório GitHub, para que o Railway possa acessá‑lo.

## Pré‑requisitos

- Git instalado no computador ([baixe aqui](https://git-scm.com/downloads)).
- Conta no GitHub com o repositório já criado (você disse que tem: `https://github.com/username/discord`).
- O código do bot está na pasta `c:/Users/danie/OneDrive/Área de Trabalho/discord`.

## Passo 1 – Verificar se a pasta já é um repositório Git

Abra o terminal (cmd, PowerShell ou Git Bash) na pasta do bot e execute:

```bash
git status
```

- Se mostrar uma lista de arquivos modificados, a pasta já é um repositório Git e está vinculada a um repositório remoto. Pule para o **Passo 3**.
- Se mostrar `fatal: not a git repository`, você precisa inicializar o Git e conectar ao repositório remoto. Continue no **Passo 2**.

## Passo 2 – Inicializar o Git e vincular ao repositório remoto

Execute os seguintes comandos no terminal (dentro da pasta do bot):

```bash
git init
git remote add origin https://github.com/username/discord.git
```

Substitua `username/discord` pela URL real do seu repositório.

## Passo 3 – Adicionar todos os arquivos e fazer commit

```bash
git add .
git commit -m "Bot Discord pronto para deploy no Railway"
```

## Passo 4 – Enviar (push) para o GitHub

Se este é o primeiro push (a branch `main` ainda não existe no remoto), use:

```bash
git branch -M main
git push -u origin main
```

Se já havia commits anteriores e você apenas está atualizando, use:

```bash
git push origin main
```

**Nota:** Caso sua branch padrão tenha outro nome (ex.: `master`), substitua `main` pelo nome correto.

## Passo 5 – Verificar no GitHub

Acesse `https://github.com/username/discord` no navegador e confirme que os arquivos aparecem (especialmente `index.js`, `package.json`, `Procfile`, `railway.json`, `logo.jpg`).

## Próximo passo

Agora que o código está no GitHub, siga o [guia de implantação no Railway](plans/deployment-guide-railway.md) para colocar o bot online.

## Problemas comuns

| Problema | Solução |
|----------|---------|
| `git push` pede usuário/senha | Use um token de acesso pessoal (PAT) como senha. [Veja como criar um PAT](https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). |
| `error: failed to push some refs` | Execute `git pull origin main --allow-unrelated-histories` antes de fazer push novamente. |
| Arquivos grandes (logo.jpg) não sobem | Verifique se o `.gitignore` não está ignorando `*.jpg`. |
| Não consigo acessar o repositório remoto | Confirme a URL com `git remote -v`. Corrija com `git remote set-url origin https://github.com/username/discord.git`. |

## Dúvidas?

Consulte a [documentação do Git](https://git-scm.com/doc) ou peça ajuda em fóruns de desenvolvimento.