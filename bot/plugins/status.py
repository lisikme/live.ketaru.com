import disnake as discord
from disnake.ext import commands as cmd, commands
import random
import aiohttp
import asyncio

class статус:
    # ————————————————————— Статус —————————————————————
    Статус = "💖 {} ➔ /help"
    Шарды = 0
    # —————————————————— Режим статус ——————————————————
    Режим = 2
    #   1 = Онлайн
    #   2 = Неактивен
    #   3 = Не беспокоить
    #   4 = Офлайн

class VareHost:
    setting = True
    url = 'https://api.server-discord.com/v2/bots/{}/stats'
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyMTgzODAzODU4MDA4NDc3NyIsInBlcm1zIjowLCJpYXQiOjE2NDQ5MDU5MjZ9.V3UdILdfpcXzG4j7lsk4PZFE_7vf7vjePmjePNtUGYs'
class Boticord:
    setting = False
    url = 'https://api.boticord.top/v2/stats'
    token = ''

class Status(cmd.Cog):
    def __init__(self, app: discord.Client):
        self.app = app

    @cmd.Cog.listener()
    async def on_ready(self):
        app = self.app; Статус = статус.Статус; Режим = статус.Режим; Шарды = статус.Шарды; ID = app.user.id
        if Режим == 1: Режим = discord.Status.online
        if Режим == 2: Режим = discord.Status.idle
        if Режим == 3: Режим = discord.Status.dnd
        if Режим == 4: Режим = discord.Status.offline
        await app.change_presence(activity = discord.Activity(
            type = discord.ActivityType.listening,
            name = Статус.format(len(app.guilds))), status = Режим) # type: ignore

    async def on_guild_join(self, guild: discord.Guild):
        app = self.app; Статус = статус.Статус; Режим = статус.Режим; Шарды = статус.Шарды; ID = app.user.id
        if Режим == 1: Режим = discord.Status.online
        if Режим == 2: Режим = discord.Status.idle
        if Режим == 3: Режим = discord.Status.dnd
        if Режим == 4: Режим = discord.Status.offline
        await app.change_presence(activity = discord.Activity(
            type = discord.ActivityType.listening,
            name = Статус.format(len(app.guilds))), status = Режим) # type: ignore

    async def on_guild_remove(self, guild: discord.Guild):
        app = self.app; Статус = статус.Статус; Режим = статус.Режим; Шарды = статус.Шарды; ID = app.user.id
        if Режим == 1: Режим = discord.Status.online
        if Режим == 2: Режим = discord.Status.idle
        if Режим == 3: Режим = discord.Status.dnd
        if Режим == 4: Режим = discord.Status.offline
        await app.change_presence(activity = discord.Activity(
            type = discord.ActivityType.listening,
            name = Статус.format(len(app.guilds))), status = Режим) # type: ignore


def setup(app: cmd.Bot):
    app.add_cog(Status(app))
