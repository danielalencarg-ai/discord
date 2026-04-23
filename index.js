require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

if (!process.env.TOKEN_DO_BOT) {
    throw new Error('TOKEN_DO_BOT não configurado. Defina a variável de ambiente antes de iniciar o bot.');
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const jogadoresAtivos = new Map();
const panelMessages = new Map(); // channelId -> messageId
const rankingMessages = new Map(); // channelId -> messageId
const selecoesPendentes = new Map(); // userId -> { site, action }
const redeEmojis = {
    'ChampionPoker': '♠️',
    '888Poker': '♥️',
    'PokerStars': '♦️',
    'Poker King': '♣️'
};
const redes = ['ChampionPoker', '888Poker', 'PokerStars', 'Poker King'];

const tempoJogadoresPath = path.join(__dirname, 'tempo_jogadores.json');
const nickSalasPath = path.join(__dirname, 'nick_salas.json');
const buyinsSalvosPath = path.join(__dirname, 'buyins_salvos.json');
let temposAcumulados = {};
let nicksSalas = {};
let buyinsSalvos = {};

function obterNomeExibicao(userId) {
    for (const guild of client.guilds.cache.values()) {
        const member = guild.members.cache.get(userId);
        if (member) {
            return member.displayName || member.user?.username || `<@${userId}>`;
        }
    }
    return `<@${userId}>`;
}

// Carregar dados existentes
try {
    if (fs.existsSync(tempoJogadoresPath)) {
        const data = fs.readFileSync(tempoJogadoresPath, 'utf8');
        temposAcumulados = JSON.parse(data);
    }
} catch (error) {
    console.error('Erro ao carregar tempos acumulados:', error);
}

try {
    if (fs.existsSync(nickSalasPath)) {
        const data = fs.readFileSync(nickSalasPath, 'utf8');
        nicksSalas = JSON.parse(data);
    }
} catch (error) {
    console.error('Erro ao carregar nicks de sala:', error);
}

try {
    if (fs.existsSync(buyinsSalvosPath)) {
        const data = fs.readFileSync(buyinsSalvosPath, 'utf8');
        buyinsSalvos = JSON.parse(data);
    }
} catch (error) {
    console.error('Erro ao carregar buy-ins salvos:', error);
}

function gerarPainelEmbed() {
    const embed = new EmbedBuilder()
        .setColor('#5865F2') // Discord blurple
        .setTitle('🎰 ELITE TEAM POKER - JOGADORES EM GRIND PRODUZINDO MONEY !!! 🎰')
        .setDescription(null)
        .setThumbnail('attachment://logo.jpg') // logo local
        .setFooter({ text: 'Elite Team Poker • Bot', iconURL: 'attachment://logo.jpg' })
        .setTimestamp();

    let listaAtivos = '';
    if (jogadoresAtivos.size === 0) {
        listaAtivos = '*Nenhum jogador nas mesas no momento.*';
    } else {
        const entries = [];
        const emojis = ['🟢', '🔵', '🟡', '🟣', '🟠', '⚫', '⚪'];
        let index = 0;
        jogadoresAtivos.forEach((dados, userId) => {
            const emoji = emojis[index % emojis.length];
            const siteEmoji = redeEmojis[dados.site] || '🌐';
            const tempo = dados.startTime ? formatarDuracao(Date.now() - dados.startTime) : '0s';
            const nome = dados.nickSala || dados.displayName || obterNomeExibicao(userId);
            entries.push(`${emoji} **${nome}** | ${siteEmoji} **${dados.site}** | 💰 **${dados.buyin}** | ⏱️ **${tempo}**`);
            index++;
        });
        listaAtivos = entries.join('\n\n'); // double line spacing
    }

    // Truncate if exceeds 1024 characters (embed field value limit)
    if (listaAtivos.length > 1024) {
        listaAtivos = listaAtivos.substring(0, 1021) + '...';
    }

    embed.addFields({ name: `🟢 Jogadores Ativos (${jogadoresAtivos.size})`, value: listaAtivos });
    return embed;
}

function extrairValorBuyin(str) {
    const match = str.match(/[+-]?\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
}

function formatarDuracao(ms) {
    const segundos = Math.floor(ms / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    if (horas > 0) {
        return `${horas}h ${minutos % 60}m`;
    } else if (minutos > 0) {
        return `${minutos}m ${segundos % 60}s`;
    } else {
        return `${segundos}s`;
    }
}

function salvarTempos() {
    try {
        fs.writeFileSync(tempoJogadoresPath, JSON.stringify(temposAcumulados, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao salvar tempos acumulados:', error);
    }
}

function salvarNicksSalas() {
    try {
        fs.writeFileSync(nickSalasPath, JSON.stringify(nicksSalas, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao salvar nicks de sala:', error);
    }
}

function salvarBuyinsSalvos() {
    try {
        fs.writeFileSync(buyinsSalvosPath, JSON.stringify(buyinsSalvos, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao salvar buy-ins salvos:', error);
    }
}

function obterNickSala(userId) {
    return nicksSalas[userId] || null;
}

function obterBuyinSalvo(userId) {
    return buyinsSalvos[userId] || null;
}

function obterNomeRelatorio(userId, dados) {
    return (dados && dados.nickSala) || nicksSalas[userId] || (dados && dados.displayName) || obterNomeExibicao(userId);
}

function gerarStatsEmbed() {
    const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('📊 Estatísticas dos Jogadores Ativos')
        .setThumbnail('attachment://logo.jpg')
        .setFooter({ text: 'Elite Team Poker • Bot', iconURL: 'attachment://logo.jpg' })
        .setTimestamp();

    const totalJogadores = jogadoresAtivos.size;
    let somaTotal = 0;
    jogadoresAtivos.forEach((dados) => {
        somaTotal += extrairValorBuyin(dados.buyin);
    });
    const media = totalJogadores > 0 ? somaTotal / totalJogadores : 0;

    embed.addFields(
        { name: '🟢 Total de Jogadores Ativos', value: totalJogadores.toString(), inline: true },
        { name: '💰 Soma Total dos Buy‑ins', value: `$${somaTotal.toFixed(2)}`, inline: true },
        { name: '📈 Buy‑in Médio', value: `$${media.toFixed(2)}`, inline: true }
    );

    // Lista de jogadores ativos (mesmo formato do painel)
    let listaAtivos = '';
    if (totalJogadores === 0) {
        listaAtivos = '*Nenhum jogador ativo no momento.*';
    } else {
        const entries = [];
        const emojis = ['🟢', '🔵', '🟡', '🟣', '🟠', '⚫', '⚪'];
        let index = 0;
        jogadoresAtivos.forEach((dados, userId) => {
            const emoji = emojis[index % emojis.length];
            const siteEmoji = redeEmojis[dados.site] || '🌐';
            const nome = dados.nickSala || dados.displayName || obterNomeExibicao(userId);
            entries.push(`${emoji} **${nome}** | ${siteEmoji} **${dados.site}** | 💰 **${dados.buyin}**`);
            index++;
        });
        listaAtivos = entries.join('\n\n');
        // Truncate if exceeds 1024 characters (embed field value limit)
        if (listaAtivos.length > 1024) {
            listaAtivos = listaAtivos.substring(0, 1021) + '...';
        }
    }

    embed.addFields({ name: '🎰 Jogadores Ativos', value: listaAtivos });
    return embed;
}

function gerarRelatorioEmbed() {
    const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('📊 RELATÓRIO DE TEMPO TOTAL')
        .setThumbnail('attachment://logo.jpg')
        .setFooter({ text: 'Elite Team Poker • Bot', iconURL: 'attachment://logo.jpg' })
        .setTimestamp();

    // Converter objeto em array e ordenar por totalMs decrescente
    const entries = Object.entries(temposAcumulados);
    if (entries.length === 0) {
        embed.addFields({ name: '📭 Nenhum dado acumulado', value: 'Ainda não há sessões registradas.' });
        return embed;
    }

    const sorted = entries.sort((a, b) => b[1].totalMs - a[1].totalMs);
    const medalhas = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    let lista = '';
    sorted.forEach(([userId, dados], index) => {
        const medalha = index < medalhas.length ? medalhas[index] : `${index + 1}️⃣`;
        const tempoFormatado = formatarDuracao(dados.totalMs);
        const nome = obterNomeRelatorio(userId, dados);
        lista += `${medalha} **${nome}** – ${tempoFormatado} (${dados.sessoes} sess${dados.sessoes !== 1 ? 'ões' : 'ão'})\n\n`;
    });

    // Truncar se exceder 1024 caracteres
    if (lista.length > 1024) {
        lista = lista.substring(0, 1021) + '...';
    }

    embed.addFields({ name: '🏆 Ranking de Tempo Total', value: lista });
    return embed;
}

function gerarBotoes() {
    const buttonsRede = redes.map(rede =>
        new ButtonBuilder()
            .setCustomId('btn_rede_' + rede)
            .setLabel(rede)
            .setEmoji(redeEmojis[rede])
            .setStyle(ButtonStyle.Primary)
    );
    const rowRede = new ActionRowBuilder().addComponents(...buttonsRede);

    const buttonsAcao = [
        new ButtonBuilder()
            .setCustomId('btn_nick_sala')
            .setLabel('Nick Sala')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('btn_sair')
            .setLabel('Encerrar Sessão')
            .setEmoji('🔴')
            .setStyle(ButtonStyle.Danger)
    ];
    const rowAcao = new ActionRowBuilder().addComponents(...buttonsAcao);

    return [rowRede, rowAcao];
}

async function atualizarTodosPaineis() {
    panelMessages.forEach(async (messageId, channelId) => {
        try {
            const channel = await client.channels.fetch(channelId);
            const message = await channel.messages.fetch(messageId);
            await message.edit({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
        } catch (error) {
            // Painel deletado, remover do mapa
            panelMessages.delete(channelId);
        }
    });
}

async function atualizarTodosRankings() {
    rankingMessages.forEach(async (messageId, channelId) => {
        try {
            const channel = await client.channels.fetch(channelId);
            const message = await channel.messages.fetch(messageId);
            await message.edit({ embeds: [gerarRelatorioEmbed()], files: ['logo.jpg'] });
        } catch (error) {
            // Ranking deletado, remover do mapa
            rankingMessages.delete(channelId);
        }
    });
}

client.once(Events.ClientReady, (c) => {
    console.log(`✅ Bot online! Logado como ${c.user.tag}`);
    setInterval(async () => {
        try {
            await atualizarTodosPaineis();
        } catch (error) {
            console.error('Erro ao atualizar painéis:', error);
        }
        try {
            await atualizarTodosRankings();
        } catch (error) {
            console.error('Erro ao atualizar rankings:', error);
        }
    }, 60000); // 60 segundos
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (message.content === '!painel') {
        const channelId = message.channel.id;
        const existingMessageId = panelMessages.get(channelId);
        if (existingMessageId) {
            try {
                const panelMessage = await message.channel.messages.fetch(existingMessageId);
                await panelMessage.edit({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
                await message.delete().catch(() => {});
                return;
            } catch (error) {
                // Message likely deleted, remove from map and send new
                panelMessages.delete(channelId);
            }
        }
        // Send new panel and store its ID
        const panelMessage = await message.channel.send({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
        panelMessages.set(channelId, panelMessage.id);
        await message.delete().catch(() => {});
    } else if (message.content === '!stats') {
        await message.channel.send({ embeds: [gerarStatsEmbed()], files: ['logo.jpg'] });
        await message.delete().catch(() => {});
    } else if (message.content === '!relatorio') {
        const channelId = message.channel.id;
        const existingRankingId = rankingMessages.get(channelId);
        if (existingRankingId) {
            try {
                const rankingMessage = await message.channel.messages.fetch(existingRankingId);
                await rankingMessage.edit({ embeds: [gerarRelatorioEmbed()], files: ['logo.jpg'] });
                await message.delete().catch(() => {});
                return;
            } catch (error) {
                // Message likely deleted, remove from map and send new
                rankingMessages.delete(channelId);
            }
        }
        // Send new ranking and store its ID
        const rankingMessage = await message.channel.send({ embeds: [gerarRelatorioEmbed()], files: ['logo.jpg'] });
        rankingMessages.set(channelId, rankingMessage.id);
        await message.delete().catch(() => {});
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('btn_rede_')) {
            const selectedSite = interaction.customId.replace('btn_rede_', '');
            // Check if player is already active
            if (jogadoresAtivos.has(interaction.user.id)) {
                // Player is active → update site directly
                const dados = jogadoresAtivos.get(interaction.user.id);
                dados.site = selectedSite;
                jogadoresAtivos.set(interaction.user.id, dados);
                // Refresh panel
                const channelId = interaction.channelId;
                const panelMessageId = panelMessages.get(channelId);
                if (panelMessageId) {
                    try {
                        const panelMessage = await interaction.channel.messages.fetch(panelMessageId);
                        await panelMessage.edit({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
                    } catch (error) {
                        panelMessages.delete(channelId);
                        const newPanel = await interaction.channel.send({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
                        panelMessages.set(channelId, newPanel.id);
                    }
                }
            } else {
                // Player not active → store pending selection and show modal
                selecoesPendentes.set(interaction.user.id, { site: selectedSite, action: 'grind' });
                const modal = new ModalBuilder().setCustomId('modal_grind').setTitle('\u200b');
                const inputBuyin = new TextInputBuilder()
                    .setCustomId('input_buyin')
                    .setLabel('\u200b')
                    .setPlaceholder(obterBuyinSalvo(interaction.user.id) ? `Último: ${obterBuyinSalvo(interaction.user.id)}` : 'Ex: $50, $10')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);
                modal.addComponents(new ActionRowBuilder().addComponents(inputBuyin));
                await interaction.showModal(modal);
            }
        }
        if (interaction.customId === 'btn_nick_sala') {
            selecoesPendentes.set(interaction.user.id, { action: 'nick_sala' });
            const modal = new ModalBuilder().setCustomId('modal_nick_sala').setTitle('\u200b');
            const inputNick = new TextInputBuilder()
                .setCustomId('input_nick_sala')
                .setLabel('\u200b')
                .setPlaceholder(obterNickSala(interaction.user.id) || 'Ex: João, Mesa 12, Grinder X')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(40);
            modal.addComponents(new ActionRowBuilder().addComponents(inputNick));
            await interaction.showModal(modal);
        }
        if (interaction.customId === 'btn_sair') {
            // Acumular tempo da sessão
            const dados = jogadoresAtivos.get(interaction.user.id);
            if (dados && dados.startTime) {
                const duracao = Date.now() - dados.startTime;
                const userId = interaction.user.id;
                if (!temposAcumulados[userId]) {
                    temposAcumulados[userId] = { totalMs: 0, sessoes: 0 };
                }
                temposAcumulados[userId].totalMs += duracao;
                temposAcumulados[userId].sessoes += 1;
                temposAcumulados[userId].nickSala = dados.nickSala || temposAcumulados[userId].nickSala || null;
                temposAcumulados[userId].displayName = dados.displayName || temposAcumulados[userId].displayName || null;
                temposAcumulados[userId].lastBuyin = dados.buyin || temposAcumulados[userId].lastBuyin || null;
                salvarTempos();
            }
            jogadoresAtivos.delete(interaction.user.id);
            await interaction.update({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
            try {
                await atualizarTodosRankings();
            } catch (error) {
                console.error('Erro ao atualizar rankings:', error);
            }
        }
    }
    if (interaction.isModalSubmit() && interaction.customId === 'modal_grind') {
        const pending = selecoesPendentes.get(interaction.user.id);
        if (!pending || pending.action !== 'grind') {
            await interaction.reply({ content: '\u200b', flags: 64 });
            try {
                await interaction.deleteReply();
            } catch (error) {
                // Ignore
            }
            return;
        }
        let buyin = interaction.fields.getTextInputValue('input_buyin');
        // Sanitize buy‑in: remove newlines and limit length
        buyin = buyin.replace(/\n/g, '').substring(0, 50);
        buyinsSalvos[interaction.user.id] = buyin;
        salvarBuyinsSalvos();
        jogadoresAtivos.set(interaction.user.id, {
            site: pending.site,
            buyin: buyin,
            startTime: Date.now(),
            displayName: interaction.member?.displayName || interaction.user.globalName || interaction.user.username,
            nickSala: obterNickSala(interaction.user.id)
        });
        selecoesPendentes.delete(interaction.user.id);
        
        // Atualizar painel principal
        const channelId = interaction.channelId;
        const panelMessageId = panelMessages.get(channelId);
        if (panelMessageId) {
            try {
                const panelMessage = await interaction.channel.messages.fetch(panelMessageId);
                await panelMessage.edit({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
            } catch (error) {
                // Painel deletado, enviar novo
                panelMessages.delete(channelId);
                const newPanel = await interaction.channel.send({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
                panelMessages.set(channelId, newPanel.id);
            }
        } else {
            // Criar novo painel (não deveria acontecer)
            const newPanel = await interaction.channel.send({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
            panelMessages.set(channelId, newPanel.id);
        }
        
        await interaction.reply({ content: '\u200b', flags: 64 });
        try {
            await interaction.deleteReply();
        } catch (error) {
            // Ignore
        }
    }
    if (interaction.isModalSubmit() && interaction.customId === 'modal_nick_sala') {
        const pending = selecoesPendentes.get(interaction.user.id);
        if (!pending || pending.action !== 'nick_sala') {
            await interaction.reply({ content: '\u200b', flags: 64 });
            try {
                await interaction.deleteReply();
            } catch (error) {
                // Ignore
            }
            return;
        }

        let nickSala = interaction.fields.getTextInputValue('input_nick_sala');
        nickSala = nickSala.replace(/\n/g, '').trim().substring(0, 40);

        if (!nickSala) {
            await interaction.reply({ content: '\u200b', flags: 64 });
            try {
                await interaction.deleteReply();
            } catch (error) {
                // Ignore
            }
            return;
        }

        nicksSalas[interaction.user.id] = nickSala;
        salvarNicksSalas();
        selecoesPendentes.delete(interaction.user.id);

        if (!temposAcumulados[interaction.user.id]) {
            temposAcumulados[interaction.user.id] = { totalMs: 0, sessoes: 0 };
        }
        temposAcumulados[interaction.user.id].nickSala = nickSala;
        salvarTempos();

        const dadosAtivos = jogadoresAtivos.get(interaction.user.id);
        if (dadosAtivos) {
            dadosAtivos.nickSala = nickSala;
            jogadoresAtivos.set(interaction.user.id, dadosAtivos);
        }

        const channelId = interaction.channelId;
        const panelMessageId = panelMessages.get(channelId);
        if (panelMessageId) {
            try {
                const panelMessage = await interaction.channel.messages.fetch(panelMessageId);
                await panelMessage.edit({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
            } catch (error) {
                panelMessages.delete(channelId);
                const newPanel = await interaction.channel.send({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
                panelMessages.set(channelId, newPanel.id);
            }
        }

        try {
            await atualizarTodosRankings();
        } catch (error) {
            console.error('Erro ao atualizar rankings:', error);
        }

        await interaction.reply({ content: '\u200b', flags: 64 });
        try {
            await interaction.deleteReply();
        } catch (error) {
            // Ignore
        }
    }
});

client.login(process.env.TOKEN_DO_BOT);
