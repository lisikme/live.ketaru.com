import disnake as discord
from disnake.ext import commands as cmd
from disnake.ext.commands import Cog
from app import client as app # type: ignore

logs = 925935049206014062

def event(): end = Cog.listener(); return end

class Guild(cmd.Cog):
    @event()
    async def on_guild_join(self, guild: discord.Guild):
        box = discord.Embed(description=(
            f'### Добавлен на сервер!\n'
            f'```elm\n'
            f'Server: "{guild.name}"\n'
            f'Members: {guild.member_count}\n\n'
            f'ServerID: {guild.id}\n'
            f'OwnerIP: {guild.owner_id}\n\n'
            f'Guilds: {len(app.guilds)}'
            f'                                                                        ```'
        ), color=0x00ff00)
        if guild.icon == None:
            logo = 'https://i.imgur.com/QVf1fLJ.png'
        else:
            logo = guild.icon
        box.set_thumbnail(url=logo)
        await app.get_channel(logs).send(embed=box)

    @event()
    async def on_guild_remove(self, guild: discord.Guild):
        box = discord.Embed(description=(
            f'### Удалён с сервера!\n'
            f'```elm\n'
            f'Server: "{guild.name}"\n'
            f'Members: {guild.member_count}\n\n'
            f'ServerID: {guild.id}\n'
            f'OwnerIP: {guild.owner_id}\n\n'
            f'Guilds: {len(app.guilds)}'
            f'                                                                        ```'
        ), color=0xff0000)
        if guild.icon == None:
            logo = 'https://i.imgur.com/QVf1fLJ.png'
        else:
            logo = guild.icon
        box.set_thumbnail(url=logo)
        await app.get_channel(logs).send(embed=box)


def setup(app: cmd.Bot):
    app.add_cog(Guild(app))