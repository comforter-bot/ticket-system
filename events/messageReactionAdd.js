const Event = require('../../structures/Event');
const { MessageEmbed } = require('discord.js');
const dateFormat = require('dateformat');

module.exports = class extends Event {

async run(reaction, user) {

    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
  
    let message = reaction.message;
    if(!message) return;
    if(user.bot) return;
  
    let logsChannel = message.guild.channels.cache.find(c => c.id === '778301848716705882');
  
    let already = new MessageEmbed()
    .setColor('#ff0000')
    .setAuthor(`Error`)
    .setDescription(`You already have a ticket open.`);
  
    let success = new MessageEmbed()
      .setDescription(`Dear ${user.username},`)
      .addField('Devil will be with you shortly.', [
      'Thank you for trusting us.'
      ])
      .setColor("#7915b3");

    let qembed = new MessageEmbed()
      .setTitle('Information Gathering')
      .addField('Please answer these questions so Devil knows more about you.', [
        '- Have you been diagnosed with anything? If so, list them.',
        '- Are your struggles from childhood trauma or any other trauma?',
        '- Have you been struggling with insecurities?',
        '- Are these issues you\'ve been dealing with going on for a longer time?',
        '- Do you wish for your problems to be dealt with to live a happier life?',
        '\u200b'
        ]);
    
    if(message.embeds.length === 1 && message.embeds[0].title === 'Talk Privately' && message.embeds[0].description === 'To create a ticket react with 📩'){
      if(reaction.emoji.name === "📩"){
        if(!message.guild.channels.cache.find(c => c.name === `ticket-${user.tag}`)){
  
          let role = message.guild.roles.cache.find(r => r.name === "Tickets Team");
          if(!role) {
            message.guild.roles.create({data:{name: "Ticket Support", permissions: 0}, reason: 'Staff need this role to view tickets.'});
            message.channel.send(`Please react again.`).then(m => m.delete({timeout: 5000}).catch(e => {}));
            reaction.users.remove(user.id);
            return;
          }
          let category = message.guild.channels.cache.find(c => c.name == "tickets" && c.type == "category");
          if(!category) category = await message.guild.channels.create("tickets", {type: "category", position: 1});
  
          let permsToHave = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']
  
          message.guild.channels.create(`ticket-${user.tag}`, { permissionOverwrites:[
            {
              deny: 'VIEW_CHANNEL',
              id: message.guild.id
            },
            {
              allow: permsToHave,
              id: user.id
            },
            {
              allow: permsToHave,
              id: role.id
            },
          ],
          parent: category.id,
          reason: `Support Ticket`,
          topic: `**ID:** ${user.id} -- **Tag:** ${user.tag} | h!close`
        }).then(async (channel) => {
  
          let createdEmbed = new MessageEmbed()
          .setAuthor(`📝 | Ticket Opened`)
          .setTimestamp()
          .setColor('#11ff00')
          .setFooter(`Tickets Log`, this.client.user.displayAvatarURL())
          .setDescription(`A user has opened a ticket.`)
          .addField(`Information`, `**User:** \`${user.tag}\`\n**ID:** \`${user.id}\`\n**Ticket:** ${channel}\n**Date:** \`${dateFormat(new Date(), "dd/mm/yyyy - HH:MM:ss")}\``);
  
          if(logsChannel) logsChannel.send(createdEmbed);
          await channel.send(`${user}`, {embed: success})
          channel.send(qembed);
        });
        reaction.users.remove(user.id);
        return;
      } else {
        reaction.users.remove(user.id);
        return;
        }
      } else {
        reaction.users.remove(user.id);
      }
    }
  }
};
