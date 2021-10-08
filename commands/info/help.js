const { Message, Client, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
let config = require('../../settings/config.json');
let ee = require('../../settings/embed.json')
const { readdirSync } = require("fs");


module.exports = {
    name: "help",
    aliases: ['hilfe'],
    permissions: ["SEND_MESSAGES"],
    description: "Shows all available bot commands, In button form.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, prefix) => {
        try {
            if (!args[0]) {
                let categories = [];

                let ignored = ["owner"];

                const emo = {
                    info: "❓",
                    other: "🔰"

                };

                readdirSync("./commands/info").forEach((dir) => {
                    if (ignored.includes(dir.toLowerCase())) return;
                    const name = `${dir.toUpperCase()}`;
                    let cats = new Object();

                    cats = {
                        name: name,
                        value: `\`${prefix}help ${dir.toLowerCase()}\``,
                        inline: true,
                    };

                    categories.push(cats);
                });

                const embed = new MessageEmbed()
                    .setTitle(`\`\`🔰 Hilfsmenü \`\``)
                    .setDescription(`\`\`❗ Mein Prefix ist: ${prefix} \`\`\n \`\`\` Discord.js v13 Bot Vorlage  \`\`\` \n  [🔴 Lade mich ein](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`)
                    .addFields(categories)
                    .setFooter(
                        `${message.author.tag}`,
                        message.author.displayAvatarURL({
                            dynamic: true,
                        })
                    )
                    .setTimestamp()
                    .setThumbnail(
                        client.user.displayAvatarURL({
                            dynamic: true,
                        })
                    )
                    .setColor(ee.embed_color);

                return message.channel.send({ embeds: [embed] });
            } else {
                let cots = [];
                let catts = [];

                readdirSync("./commands/").forEach((dir) => {
                    if (dir.toLowerCase() !== args[0].toLowerCase()) return;
                    const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                        file.endsWith(".js")
                    );

                    const cmds = commands.map((command) => {
                        let file = require(`../../commands/${dir}/${command}`);

                        if (!file.name) return "No command name.";

                        let name = file.name.replace(".js", "");

                        let des = `${client.commands.get(name).description}`;

                        let obj = {
                            cname: `\`${name}\``,
                            des,
                        };

                        return obj;
                    });

                    let dota = new Object();

                    cmds.map((co) => {
                        dota = {
                            name: `${cmds.length === 0 ? "In progress." : co.cname}`,
                            value: co.des ? co.des : "No Description",
                            inline: true,
                        };
                        catts.push(dota);
                    });

                    cots.push(dir.toLowerCase());
                });

                // console.log(cots);

                const command =
                    client.commands.get(args[0].toLowerCase()) ||
                    client.commands.find(
                        (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                    );

                if (cots.includes(args[0].toLowerCase())) {
                    const combed = new MessageEmbed()
                        .setTitle(
                            `__${args[0].charAt(0).toUpperCase() + args[0].slice(1)
                            } Commands!__`
                        )
                        .setDescription(
                            `Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n`
                        )
                        .addFields(catts)
                        .setColor(ee.embed_color);

                    return message.channel.send({ embeds: [combed] });
                }

                if (!command) {
                    const embed = new MessageEmbed()
                        .setTitle(
                            `Invalid command! Use \`${prefix}help\` for all of my commands!`
                        )
                        .setColor("RED");
                    return message.channel.send({ embeds: [embed] });
                }

                const embed = new MessageEmbed()
                    .setTitle("Command Details:")
                    .addField(
                        "Command:",
                        command.name ? `\`${command.name}\`` : "No name for this command."
                    )
                    .addField(
                        "Aliases:",
                        command.aliases
                            ? `\`${command.aliases.join("` `")}\``
                            : "No aliases for this command."
                    )
                    .addField(
                        "Usage:",
                        command.usage
                            ? `\`${prefix}${command.name} ${command.usage}\``
                            : `\`${prefix}${command.name}\``
                    )
                    .addField(
                        "Command Description:",
                        command.description
                            ? command.description
                            : "No description for this command."
                    )
                    .setFooter(
                        `Requested by ${message.author.tag}`,
                        message.author.displayAvatarURL({
                            dynamic: true,
                        })
                    )
                    .setTimestamp()
                    .setColor(ee.embed_color);
                return message.channel.send({ embeds: [embed] });
            }
        } catch (e) {
            console.log(e);
        }
    },
};