# Como Criar um Repositório no GitHub (para iniciantes)

Se você ainda não tem um repositório GitHub para o bot, siga estes passos para criar um.

## Passo 1 – Acessar o GitHub

1. Abra o navegador e vá para [github.com](https://github.com).
2. Faça login com sua conta (se ainda não tiver, crie uma conta gratuita).

## Passo 2 – Criar novo repositório

1. No canto superior direito, clique no ícone **+** (mais) e selecione **New repository**.

2. Preencha os campos:

   - **Repository name:** `discord` (ou outro nome de sua preferência)
   - **Description:** (opcional) “Bot Discord para gestão de grind de poker”
   - **Public** (deixe marcado, repositórios públicos são gratuitos)
   - **Private** (só marque se quiser que ninguém veja o código)

3. **NÃO** marque a opção “Initialize this repository with a README” (já temos arquivos localmente).

4. Clique em **Create repository**.

## Passo 3 – Copiar a URL do repositório

Após criar, você será redirecionado para uma página com a URL do repositório. A URL terá este formato:

```
https://github.com/seuusuario/discord
```

**Copie essa URL** (é a que precisamos para conectar o código local).

## Passo 4 – Conectar o código local ao repositório (se ainda não fez)

Se você já seguiu o guia [`plans/github-setup.md`](plans/github-setup.md) e configurou o Git local, pode pular esta etapa.

Caso contrário, abra o terminal na pasta do bot (`c:/Users/danie/OneDrive/Área de Trabalho/discord`) e execute:

```bash
git init
git remote add origin https://github.com/seuusuario/discord.git
```

Substitua `seusuario/discord` pela sua URL real.

## Passo 5 – Fazer o primeiro commit e push

Continue com os passos do guia [`plans/github-setup.md`](plans/github-setup.md) a partir do **Passo 3**.

## Dúvidas frequentes

**Posso usar um repositório que já existe?**  
Sim, desde que ele esteja vazio (sem arquivos conflitantes). Se já houver arquivos, você pode sobrescrevê‑los ou fazer merge manual.

**Esqueci o nome do meu repositório, como descubro?**  
No GitHub, clique em sua foto de perfil → **Your repositories**. Lá aparecerá a lista de todos os seus repositórios.

**A URL que você pediu é a mesma que aparece no navegador?**  
Sim, é exatamente a que aparece na barra de endereços quando você está vendo o repositório.

---

Depois de criar o repositório e ter a URL, volte aqui e me informe a URL para que eu possa finalizar o push.