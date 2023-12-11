# ———————————— Импорт библиотек Python —————————————
from conf import * #type: ignore
import disnake as discord
from disnake import ApplicationCommandInteraction as aci
from disnake.ext import commands as cmd, commands
from disnake.utils import get
from disnake import FFmpegPCMAudio, VoiceClient
import asyncio
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from app import client as app # type: ignore
import ssl
import os
ssl._create_default_https_context = ssl._create_unverified_context
import requests as req
from rich import print #type: ignore
from rich.console import Console #type: ignore
print = Console().print
import json
from configparser import ConfigParser; cfg = ConfigParser()
cfg.read('conf.ini', encoding='utf-8')
AppTag = 'Radio KetaRu'
data = req.get('https://live.ketaru.com/list.js').text
data1 = req.get('https://live.ketaru.com/error.js').text
class HOST():
    serv  = eval(data[data.find('[', 1):])
    error = eval(data1[data1.find('[', 1):])
# ——————————— Статус выполнения команды ————————————
class INFO:
    ON    = 'Подключено'
    RECON = 'Переподключено'
    EDIT  = 'Изменено'
    OFF   = 'Отключено'
    CLOSE = 'Без изменений'
    FAIL  = 'Ошибка'
    BETA  = 'Подключено (ранний доступ)'
    snow  = 'ᅠᅠᅠᅠᅠᅠᅠ'
class IMG:
    green = 'https://i.imgur.com/y5YzTYI.png'
    red   = 'https://i.imgur.com/W8hlsQj.png'
class STAT:
    on    = 1014255927643357304
    off   = 1014255889508745266
# ——————————————— Цвета для консоли ————————————————
from rich import print #type: ignore
from rich.console import Console; cn = Console() #type: ignore
class ColorFormat: # цвета
    Красный      = '[bold red]'     # 🔴| Красный
    ЯркоКрасный  = '[bold #E32636]' # 🔴| Ярко красный
    Зелёный      = '[bold green]'   # 🟢| Зелёный
    Синий        = '[bold blue]'    # 🔵| Синий
    Голубой      = '[bold #00FF7F]' # 🔵| Голубой
    Белый        = '[bold white]'   # ⚪| Белый
    Желтый       = '[bold #FFFF00]' # 🟡| Жёлтый
    СветлоЖёлтый = '[bold yellow]'  # 🟡| Светло жёлтый
    Серый        = '[bold #808080]' # ⚙️| Сервый
# —————————————— Форматирование даты ———————————————
import datetime
class DataTime:
    Data = '{:16}'.format(f'{datetime.datetime.now():%d.%m.%Y}')
    Time = '{:16}'.format(f'{datetime.datetime.now():%H:%M:%S}')
# ———————————— Цвета для Embed Discord —————————————
class colors:
    hide   = 0x2b2d31 # Невидемый
    gold   = 0xf1c40f # Жёлтый
    orange = 0xe67e22 # Оранжевый
    red    = 0xe74c3c # Красный
# ————————————— Пак стикеров для бота ——————————————
class STIKERS:
    ID_Load = 1006963203349164042
# ——————————— Конфигурация радиостанций ————————————
class FFmpeg:
    options={
        'options': '-vn',
        'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5'}
def FMList(tags = -1):
    ID = 0
    if tags == -1: return HOST.serv
    if tags < 0: ID = 0
    if tags >= 1: ID = ((tags-1)*4)
    try:
        NAME  = HOST.serv[ID+0]
        IMAGE = HOST.serv[ID+1]
        URL   = HOST.serv[ID+2]
        STATS = HOST.serv[ID+3]
    except:
        NAME  = HOST.error[0]
        URL   = HOST.error[1]
        IMAGE = HOST.error[2]
        STATS = HOST.error[3]
    return NAME, URL, IMAGE, STATS
def tags(x):
    lists_v1=[]; x=x*25; tag = {}
    st, en = (stt:=x-25), x
    for id in range(st+1, en+1):
        stt+=1
        temp = f'{str(stt)} ➔ '+FMList(int(id))[0], str(id)
        lists_v1.append(temp); tag = {k: v for k, v in lists_v1}
    return tag


db = './temp/guilds.json'
# ——————————————— Подкючение плагина ———————————————
class Radio(commands.Cog):
    def __init__(self, client: commands.Bot):
        self.client = client; client = self.client
        self.app = client; app = self.client



    # @cmd.Cog.listener()
    # async def on_ready(self):
    #     data = {}
    #     for guild in app.guilds:
    #         try:
    #             with open(db, "r", encoding="utf8") as f:
    #                 data = json.load(f)
    #             url = tags[data[str(guild.id)][1]['Last_RadioID']]['Url']
    #             channel = app.get_channel(int(data[str(guild.id)][1]['Last_VoiceID']))
    #             voice = await channel.connect()
    #             await guild.change_voice_state(channel = channel, self_deaf=True)
    #             voice.play(FFmpegPCMAudio(url, **FFmpeg.options))
    #         except Exception as e:
    #             #print(e)
    #             pass
    #     pass



    @cmd.slash_command(name='fm1', description=f'{AppTag} ➔ Выбрать радиостанцию (1/25)')
    async def _play1(self, ctx: aci, type: str=cmd.Param(name="название", choices = tags(1))): #type: ignore
        guild = ctx.guild; user = eval('ctx.author.voice'); app = self.client
        bots = eval('get(app.voice_clients, guild = guild)')
        emoji = self.client.get_emoji(STIKERS.ID_Load)
# ———————————— Фоматирование информации ————————————
        Name = FMList(int(type))[0]
        Url = FMList(int(type))[1]
        Image = 'http://live.ketaru.com/'+FMList(int(type))[2]
# ————————————————— Готовые модули —————————————————
        def Аудио(Url: str):
            return vc.play(FFmpegPCMAudio(Url, **FFmpeg.options)) # type: ignore
        def embed_not_user(title: str, description: str, color):
            GUI = discord.Embed(title=title, description=description, color=color)
            GUI.set_author(name = self.client.user.name, icon_url = self.client.user.avatar)
            return GUI
        def embed_play(title: str, status: str, status_icon: str, logo: str, color):
            GUI = discord.Embed(title=title, color=color)
            GUI.set_author(name='{:40}ᅠ'.format(self.client.user.name), icon_url=app.user.avatar)
            GUI.set_thumbnail(url=logo)
            GUI.set_footer(icon_url = status_icon, text=status)
            return GUI
# ———————————— Пользователь не в канале ————————————
        if not user:
            STATS = f'Пользователь не в канале'
            GUI = embed_not_user(title='Вы не в голосовом канале', description='Для того что-бы использовать бота, зайдите в головой канал', color=colors.gold)
            await ctx.send(embed=GUI)
# ———————————————————— Собщения ————————————————————
        else:
            await ctx.send(con := f'{emoji} ` Подключение... `')
            url_check = True
# —————————————— Проверка радиостанцй ——————————————
            try:
                urlopen(Request(Url))
            except HTTPError as e: # Ошибка кода
                code = e.code
                if e.code == 400: code = f'{e.code} | Некорректно'; pass
                if e.code == 403: code = f'{e.code} | Нет доступа'; pass
                if e.code == 404: code = f'{e.code} | Не найдено'; pass
                if e.code == 500: code = f'{e.code} | Ошибка сервера'; pass
                GUI = embed_play(title=Name, logo=Image, status=(STATS := f'Error: {code}'), status_icon=IMG.red, color=colors.red)
                await ctx.edit_original_response(f'{emoji} ` Подключение... `', embed=GUI)
                url_check = False
            except URLError as e: # Ошибка ссылки
                code = e.reason; STATS = f'Error: {code}'
                GUI = embed_play(title=Name, logo=Image, status=(STATS := f'Error: {code}'), status_icon=IMG.red, color=colors.red)
                await ctx.edit_original_response(con, embed=GUI)
                url_check = False
            except Exception:
                code = 'Радиостанция недоступна'; STATS = f'Error: {code}'
                GUI = embed_play(title=Name, logo=Image, status=(STATS := f'{code}'), status_icon=IMG.red, color=colors.red)
                await ctx.edit_original_response(con, embed=GUI)
                url_check = False
            if url_check == True:
# ————————————————— Бот не в канале ————————————————
                if not bots:
                    vc = await user.channel.connect(reconnect=True); Аудио(Url)
                    await eval('guild.change_voice_state')(channel = user.channel, self_deaf=True)
                    GUI = embed_play(title=Name, logo=Image, status=(STATS := INFO.ON), status_icon=IMG.green, color=colors.hide)
                    await ctx.edit_original_response(con, embed=GUI)
# ——————————————— Соханение действий ———————————————
                else:
                    lastfm = {"Last_RadioID": type, "Last_VoiceID": ctx.author.voice.channel.id, "Last_AuthorID": ctx.author.id} # type: ignore
                    try:
                        with open(db, "r", encoding="utf8") as f: data = json.load(f); data[str(ctx.guild.id)][1] = lastfm # type: ignore
                        with open(db, "w", encoding="utf8") as f: json.dump(data, f, indent=4, ensure_ascii=False)
                    except:
                        with open(db, "r", encoding="utf8") as f: data = json.load(f); data[str(ctx.guild.id)] = [ctx.guild.name, lastfm] # type: ignore
                        with open(db, "w", encoding="utf8") as f: json.dump(data, f, indent=4, ensure_ascii=False)
# ——— Бот и пользователь в одном каналев канале ————
                    if user.channel == bots.channel:
                        vc: VoiceClient = bots; vc.stop(); Аудио(Url)
                        await eval('guild.change_voice_state')(channel = user.channel, self_deaf=True)
                        GUI = embed_play(title=Name, logo=Image, status=(STATS := INFO.EDIT), status_icon=IMG.green, color=colors.hide)
                        await ctx.edit_original_response(con, embed=GUI)
# ———————— Бот в другом каналеесть в канале ————————
                    else:
                        move = VoiceClient(client=app, channel=user.channel)
                        vc = await eval('move.move_to(user.channel)')
                        vc: VoiceClient = bots; vc.stop(); Аудио(Url)
                        await eval('guild.change_voice_state')(channel = user.channel, self_deaf=True)
                        GUI = embed_play(title=Name, logo=Image, status=(STATS := INFO.RECON), status_icon=IMG.green, color=colors.hide)
                        await ctx.edit_original_response(con, embed=GUI)



    @cmd.slash_command(name='fm2', description=f'{AppTag} ➔ Выбрать радиостанцию (26/50)')
    async def _play2(self, ctx: aci, type: str=cmd.Param(name="название", choices = tags(2))): # type: ignore
        guild = ctx.guild; user = eval('ctx.author.voice'); app = self.client
        bots = eval('get(app.voice_clients, guild = guild)')
        emoji = self.client.get_emoji(STIKERS.ID_Load)
# ———————————— Фоматирование информации ————————————
        Name = FMList(int(type))[0]
        Url = FMList(int(type))[1]
        Image = 'http://live.ketaru.com/'+FMList(int(type))[2]
# ————————————————— Готовые модули —————————————————
        def Аудио(Url: str):
            return vc.play(FFmpegPCMAudio(Url, **FFmpeg.options)) # type: ignore
        def embed_not_user(title: str, description: str, color):
            GUI = discord.Embed(title=title, description=description, color=color)
            GUI.set_author(name = self.client.user.name, icon_url = self.client.user.avatar)
            return GUI
        def embed_play(title: str, status: str, status_icon: str, logo: str, color):
            GUI = discord.Embed(title=title, color=color)
            GUI.set_author(name='{:40}ᅠ'.format(self.client.user.name), icon_url=app.user.avatar)
            GUI.set_thumbnail(url=logo)
            GUI.set_footer(icon_url = status_icon, text=status)
            return GUI
# ———————————— Пользователь не в канале ————————————
        if not user:
            STATS = f'Пользователь не в канале'
            GUI = embed_not_user(title='Вы не в голосовом канале', description='Для того что-бы использовать бота, зайдите в головой канал', color=colors.gold)
            await ctx.send(embed=GUI)
# ———————————————————— Собщения ————————————————————
        else:
            await ctx.send(con := f'{emoji} ` Подключение... `')
            url_check = True
# —————————————— Проверка радиостанцй ——————————————
            try:
                urlopen(Request(Url))
            except HTTPError as e: # Ошибка кода
                code = e.code
                if e.code == 400: code = f'{e.code} | Некорректно'; pass
                if e.code == 403: code = f'{e.code} | Нет доступа'; pass
                if e.code == 404: code = f'{e.code} | Не найдено'; pass
                if e.code == 500: code = f'{e.code} | Ошибка сервера'; pass
                GUI = embed_play(title=Name, logo=Image, status=(STATS := f'Error: {code}'), status_icon=IMG.red, color=colors.red)
                await ctx.edit_original_response(f'{emoji} ` Подключение... `', embed=GUI)
                url_check = False
            except URLError as e: # Ошибка ссылки
                code = e.reason; STATS = f'Error: {code}'
                GUI = embed_play(title=Name, logo=Image, status=(STATS := f'Error: {code}'), status_icon=IMG.red, color=colors.red)
                await ctx.edit_original_response(con, embed=GUI)
                url_check = False
            except Exception:
                code = 'Радиостанция недоступна'; STATS = f'Error: {code}'
                GUI = embed_play(title=Name, logo=Image, status=(STATS := f'{code}'), status_icon=IMG.red, color=colors.red)
                await ctx.edit_original_response(con, embed=GUI)
                url_check = False
            if url_check == True:
# ————————————————— Бот не в канале ————————————————
                if not bots:
                    vc = await user.channel.connect(reconnect=True); Аудио(Url)
                    await eval('guild.change_voice_state')(channel = user.channel, self_deaf=True)
                    GUI = embed_play(title=Name, logo=Image, status=(STATS := INFO.ON), status_icon=IMG.green, color=colors.hide)
                    await ctx.edit_original_response(con, embed=GUI)
# ——————————————— Соханение действий ———————————————
                else:
                    lastfm = {"Last_RadioID": type, "Last_VoiceID": ctx.author.voice.channel.id, "Last_AuthorID": ctx.author.id} # type: ignore
                    try:
                        with open(db, "r", encoding="utf8") as f: data = json.load(f); data[str(ctx.guild.id)][1] = lastfm # type: ignore
                        with open(db, "w", encoding="utf8") as f: json.dump(data, f, indent=4, ensure_ascii=False)
                    except:
                        with open(db, "r", encoding="utf8") as f: data = json.load(f); data[str(ctx.guild.id)] = [ctx.guild.name, lastfm] # type: ignore
                        with open(db, "w", encoding="utf8") as f: json.dump(data, f, indent=4, ensure_ascii=False)
# ——— Бот и пользователь в одном каналев канале ————
                    if user.channel == bots.channel:
                        vc: VoiceClient = bots; vc.stop(); Аудио(Url)
                        await eval('guild.change_voice_state')(channel = user.channel, self_deaf=True)
                        GUI = embed_play(title=Name, logo=Image, status=(STATS := INFO.EDIT), status_icon=IMG.green, color=colors.hide)
                        await ctx.edit_original_response(con, embed=GUI)
# ———————— Бот в другом каналеесть в канале ————————
                    else:
                        move = VoiceClient(client=app, channel=user.channel)
                        vc = await eval('move.move_to(user.channel)')
                        vc: VoiceClient = bots; vc.stop(); Аудио(Url)
                        await eval('guild.change_voice_state')(channel = user.channel, self_deaf=True)
                        GUI = embed_play(title=Name, logo=Image, status=(STATS := INFO.RECON), status_icon=IMG.green, color=colors.hide)
                        await ctx.edit_original_response(con, embed=GUI)



    @cmd.slash_command(name='stop', description=f'{AppTag} ➔ Остановить радиостанцию')
    async def _stop(self, ctx: aci):
        guild = ctx.guild; user = eval('ctx.author.voice'); app = self.client
        bots = eval('get(app.voice_clients, guild = guild)')
        emoji = self.client.get_emoji(STIKERS.ID_Load)
        try:
            with open(db, "r", encoding="utf8") as f: data = json.load(f)
            data[str(ctx.guild.id)][1] = { # type: ignore
                "Last_RadioID": "none",
                "Last_VoiceID": "none",
                "Last_AuthorID": "none"}
            with open(db, "w", encoding="utf8") as f: json.dump(data, f, indent=4, ensure_ascii=False)
        except:
            with open(db, "r", encoding="utf8") as f: data = json.load(f)
            data[str(ctx.guild.id)] = [ctx.guild.name, { # type: ignore
                "Last_RadioID": "none",
                "Last_VoiceID": "none",
                "Last_AuthorID": "none"}]
            with open(db, "w", encoding="utf8") as f: json.dump(data, f, indent=4, ensure_ascii=False)
        def embed_stop(title: str, status: str, color):
            GUI = discord.Embed(title=title, color=color)
            GUI.set_footer(text=status)
            return GUI
        def embed_not_user(title: str, description: str, color):
            GUI = discord.Embed(title=title, description=description, color=color)
            GUI.set_author(name = self.client.user.name, icon_url = self.client.user.avatar)
            return GUI
# ———————————— Пользователь не в канале ————————————
        if not user:
            STATS = f'Пользователь не в канале'
            GUI = embed_not_user(title='Вы не в голосовом канале', description='Для того что-бы использовать бота, зайдите в головой канал', color=colors.gold)
            await ctx.send(embed=GUI)
            return
# ————————————————— Бот не в канале ————————————————
        else:
            if not bots:
                GUI = embed_stop(title='Отключение радиостанции не требуется', status=(STATS := INFO.CLOSE), color=colors.gold)
                await ctx.send(embed=GUI)
# ——— Бот и пользователь в одном каналев канале ————
            else:
                if user.channel == bots.channel:
                    GUI = embed_stop(title='Радиостанция отключена', status=(STATS := INFO.OFF), color=colors.hide)
                    vc: VoiceClient = bots; vc.stop()
                    await vc.disconnect()
                    await ctx.send(embed=GUI)
# ————————————— Бот в другом канале ————————————————
                else:
                    GUI = embed_stop(title='Радиостанция отключена', status=(STATS := INFO.OFF), color=colors.hide)
                    vc: VoiceClient = bots; vc.stop()
                    await vc.disconnect()
                    await ctx.send(embed=GUI)



    @cmd.slash_command(name='list', description=f'{AppTag} ➔ Список радиостанций')
    async def _check(self, ctx: aci, type: str=cmd.Param(name="название", choices = ['Проверка ➔ /fm1', 'Проверка ➔ /fm2'])):
        st=en = 0
        if type == 'Проверка ➔ /fm1':
            st, en = (stt:=1), 25
        if type == 'Проверка ➔ /fm2':
            st, en = (stt:=26), 50
        await ctx.response.defer()
        servers=[]; code=end = ''
        for id in range(st, en+1):
            temp = FMList(id)[0], str(id)
            servers.append(temp)
            Name = FMList(id)[0]
            Url = FMList(id)[1]
            try:
                urlopen(Request(Url)); url_check = True
            except HTTPError as e: # Ошибка кода
                code = e.code; url_check = False
            except URLError as e: # Ошибка ссылки
                code = e.reason; url_check = False
            except Exception as e:
                code = 000; url_check = False
            if code == 400: code = '[1;40;31m[1;37m[1;36m{:20} [0m'.format(f'{code} - Некорректно'); pass
            if code == 403: code = '[1;40;31m[1;37m[1;36m{:20} [0m'.format(f'{code} - Нет доступа'); pass
            if code == 404: code = '[1;40;31m[1;37m[1;36m{:20} [0m'.format(f'{code} - Не найдено'); pass
            if code == 500: code = '[1;40;31m[1;37m[1;36m{:20} [0m'.format(f'{code} - Ошибка сервера'); pass
            if code == 000: code = '[1;40;31m[1;37m[1;36m{:20} [0m'.format(f'Недоступно'); pass
            if '[WinError 10061]' in str(code): code = '[1;40;33m {:20} [0m'.format('Оффлайн'); pass
            else: code = '[1;40;31m[1;37m[1;36m {:20} [0m'.format(f'{code}')
            if url_check == True: code = '[1;40;32m {:20} [0m'.format('Онлайн')
            end += ('[2;45;37m {:3} [0m [2;45;37m {:20} [0m {:20}\n'.format(id, Name, code))
        ecode = (
            '```ansi\n'
            '[2;40m {:3} [0m [2;40m {:20} [0m [2;40m {:20} [0m\n'
            '[2;30m---------------------------------------------------[0m\n'
            '{}'
            '```').format('ID', 'Название', 'Статус', end)
        embeds = discord.Embed(title='Список радиостанций', description=ecode, color=colors.hide)
        embeds.set_footer(text=type.replace('Проверка ➔ ', 'Провереный список ➔ '))
        await ctx.send(embed=embeds) # type: ignore



# —————————————————— Запус бота ————————————————————
def setup(client: cmd.Bot):
    client.add_cog(Radio(client))