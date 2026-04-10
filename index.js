require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const jogadoresAtivos = new Map();
const panelMessages = new Map(); // channelId -> messageId
const selecoesPendentes = new Map(); // userId -> { site }
const redeEmojis = {
    'ChampionPoker': '♠️',
    '888Poker': '♥️',
    'PokerStars': '♦️',
    'Poker King': '♣️'
};
const redes = ['ChampionPoker', '888Poker', 'PokerStars', 'Poker King'];

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
            entries.push(`${emoji} **<@${userId}>** | ${siteEmoji} **${dados.site}** | 💰 **${dados.buyin}**`);
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
            entries.push(`${emoji} **<@${userId}>** | ${siteEmoji} **${dados.site}** | 💰 **${dados.buyin}**`);
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

function gerarBotoes() {
    // Network buttons + Encerrar Sessão in a single row
    const buttons = redes.map(rede =>
        new ButtonBuilder()
            .setCustomId('btn_rede_' + rede)
            .setLabel(rede)
            .setEmoji(redeEmojis[rede])
            .setStyle(ButtonStyle.Primary)
    );
    // Add Encerrar Sessão button
    buttons.push(
        new ButtonBuilder()
            .setCustomId('btn_sair')
            .setLabel('Encerrar Sessão')
            .setEmoji('🔴')
            .setStyle(ButtonStyle.Danger)
    );
    const row = new ActionRowBuilder().addComponents(...buttons);
    return [row];
}


client.once(Events.ClientReady, (c) => console.log(`✅ Bot online! Logado como ${c.user.tag}`));

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
                selecoesPendentes.set(interaction.user.id, { site: selectedSite });
                const modal = new ModalBuilder().setCustomId('modal_grind').setTitle('\u200b');
                const inputBuyin = new TextInputBuilder().setCustomId('input_buyin').setLabel('\u200b').setPlaceholder('Ex: $50, $10').setStyle(TextInputStyle.Short).setRequired(true);
                modal.addComponents(new ActionRowBuilder().addComponents(inputBuyin));
                await interaction.showModal(modal);
            }
        }
        if (interaction.customId === 'btn_sair') {
            jogadoresAtivos.delete(interaction.user.id);
            await interaction.update({ embeds: [gerarPainelEmbed()], components: gerarBotoes(), files: ['logo.jpg'] });
        }
    }
    if (interaction.isModalSubmit() && interaction.customId === 'modal_grind') {
        const pending = selecoesPendentes.get(interaction.user.id);
        if (!pending) {
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
        jogadoresAtivos.set(interaction.user.id, {
            site: pending.site,
            buyin: buyin
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
});

client.login(process.env.TOKEN_DO_BOT);