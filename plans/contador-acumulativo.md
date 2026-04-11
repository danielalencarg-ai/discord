# Contador acumulativo de tempo por jogador

## Objetivo
Acumular o tempo total de grind de cada jogador, somando a duração de cada sessão ao finalizá‑la. Exibir um relatório com a lista de jogadores e seus tempos totais.

## Requisitos funcionais
1. **Armazenamento persistente** – os tempos acumulados devem sobreviver a reinicializações do bot.
2. **Acumulação por sessão** – quando um jogador encerra a sessão (botão "Encerrar Sessão"), a duração da sessão atual é adicionada ao seu total.
3. **Relatório** – comando `!relatorio` que exibe um embed com a lista de jogadores ordenada por tempo total (formato legível: horas/minutos).
4. **Reset opcional** – eventualmente poderá ser necessário resetar os acumulados (não solicitado, mas pode ser considerado).

## Escopo técnico
- **Persistência**: arquivo JSON (`tempo_jogadores.json`) no mesmo diretório do bot.
- **Estrutura de dados**:
  ```json
  {
    "userId1": {
      "totalMs": 12345678,
      "sessoes": 5,
      "lastUpdated": "2026-04-11T01:00:00.000Z"
    },
    "userId2": {
      "totalMs": 98765432,
      "sessoes": 3
    }
  }
  ```
- **Processo**:
  - Ao iniciar o bot, carregar o arquivo JSON em um objeto `temposAcumulados`.
  - Quando um jogador encerra a sessão:
    - Calcular `duracao = Date.now() - startTime`.
    - Adicionar `duracao` ao `temposAcumulados[userId].totalMs` (criar entrada se não existir) e incrementar `sessoes`.
    - Salvar o arquivo JSON.
  - Comando `!relatorio`:
    - Ler `temposAcumulados`, ordenar por `totalMs` decrescente.
    - Formatar cada entrada como `**<@userId>** – Xh Ym (N sessões)`.
    - Enviar embed.

## Impacto no código atual
- **Variáveis globais**: adicionar `temposAcumulados` (Map ou objeto) carregado do arquivo.
- **Funções auxiliares**:
  - `carregarTempos()`: lê o arquivo JSON e retorna objeto.
  - `salvarTempos()`: escreve o objeto no arquivo.
  - `formatarTempoTotal(ms)`: converte milissegundos para horas/minutos (ex: `5h 30m`).
- **Modificação no handler do botão "Encerrar Sessão"**:
  - Antes de remover o jogador de `jogadoresAtivos`, calcular duração e acumular.
  - Chamar `salvarTempos()`.
- **Novo handler de comando `!relatorio`**:
  - Adicionar no evento `MessageCreate` (similar a `!painel` e `!stats`).

## Riscos
- **Concorrência**: se dois jogadores encerrarem ao mesmo tempo, pode haver conflito de escrita. Solução: usar uma fila de escrita ou escrever síncrono (fs.writeFileSync) que é rápido.
- **Corrupção de arquivo**: se o bot crashar durante a escrita, o JSON pode ficar inválido. Mitigar com backup antes de escrever.
- **Performance**: ler/gravar arquivo a cada encerramento é aceitável para baixo volume.

## Próximos passos
1. Decidir estrutura final do JSON.
2. Implementar funções de carga/salvamento.
3. Integrar com o encerramento de sessão.
4. Criar comando `!relatorio`.
5. Testar localmente.
6. Atualizar documentação.

## Alternativas
- Usar banco de dados SQLite (mais robusto, mas mais complexo).
- Usar a memória do Railway (volátil) e aceitar perda de dados em redeploys.

Recomendo começar com arquivo JSON por simplicidade, mas considerar migração para SQLite se o volume crescer.