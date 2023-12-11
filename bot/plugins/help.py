import disnake as discord, disnake
from disnake.ext import commands as cmd, commands

class sitker:
    EFFECT   = 1009529007227818004
    STATS    = 1009525772802859168
    SUPPORT  = 1009525914075410442
    PARTNER  = 1009568769376522322
    CMD      = 1009525045237928027
    BETA     = 1009527977849135256
    SLASH    = 1009528358914236438
    CREATIVE = 1009567574306082847

    SERVER   = 1016852321784832071
    ADD      = 1016852257876213761
    SITE     = 1016852186807939083
    WEB      = 1016852784815013968
class url:
    add_bot  = f'&scope=bot&permissions=8&scope=applications.commands%20bot'
    site     = f'https://apps.ketaru.com/radio'
    server   = f'https://discord.gg/5BM4XD3qxM'
    donat    = f'https://www.donationalerts.com/r/aled_project'
    web      = f'https://live.ketaru.com'
class Help(commands.Cog):
    def __init__(self, client: commands.Bot):
        self.client = client


    @cmd.slash_command(description='Radio KetaRu ➔ Информация о боте')
    async def help(self, inter: disnake.ApplicationCommandInteraction):
        EFX = self.client.get_emoji(sitker.EFFECT)
        AR1 = self.client.get_emoji(sitker.STATS)
        AR2 = self.client.get_emoji(sitker.SUPPORT)
        AR3 = self.client.get_emoji(sitker.PARTNER)
        AR4 = self.client.get_emoji(sitker.CMD)
        TA1 = self.client.get_emoji(sitker.SLASH)
        TA2 = self.client.get_emoji(sitker.BETA)
        BU1 = self.client.get_emoji(sitker.SERVER)
        BU2 = self.client.get_emoji(sitker.ADD)
        BU3 = self.client.get_emoji(sitker.SITE)
        BU4 = self.client.get_emoji(sitker.WEB)


        Guilds = f'{len(self.client.guilds)}                    '
        GUI = disnake.Embed(
            title='',
            description=(
f'''
** **
{AR1} **Статистика:**
{EFX} ` Серверов    ` ➔ ` {Guilds[:10]}`
'''
f'''
{AR2} **Обратная связь:**
{EFX} ` Разработчик ` ➔ ***lisik.me***
{EFX} ` Донат       ` ➔ [` Отправить `]({url.donat})
'''
# f'''
# {AR3} **Партнёры:**
# '''
f'''
{AR4} **Команды:**
{EFX} ` /fm1        ` ➔ Включить радиостанцию (1/25)
{EFX} ` /fm2        ` ➔ Включить радиостанцию (26/50)
{EFX} ` /stop       ` ➔ Остановить радиостанцию
{EFX} ` /list       ` ➔ Список радиостанций
{EFX} ` /fredback   ` ➔ Оставить отзыв {TA2}
'''),
        color=0x2b2d31
        )
        GUI.set_author(name=self.client.user.name, icon_url=self.client.user.avatar)
        GUI.set_thumbnail(url=self.client.user.avatar)
        components =[
            [
            disnake.ui.Button(
                style=disnake.ButtonStyle.link,
                url=url.server,
                label='Discord проекта',
                emoji=BU1),
            disnake.ui.Button(
                style=disnake.ButtonStyle.link,
                url=f'https://discord.com/oauth2/authorize?client_id={self.client.user.id}{url.add_bot}',
                label='Добавить бота',
                emoji=BU2),
            ],
            [
            disnake.ui.Button(
                style=disnake.ButtonStyle.link,
                url=url.site,
                label='Сайт проекта',
                emoji=BU3),
            disnake.ui.Button(
                style=disnake.ButtonStyle.link,
                url=url.web,
                label='Сайт Radio KetaRu',
                emoji=BU4),
            ]
        ]
        await inter.response.send_message(embed=GUI, components=components)

def setup(client: commands.Bot): client.add_cog(Help(client))
