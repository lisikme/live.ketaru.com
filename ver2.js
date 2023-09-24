$(function() {
  var fontSize = 12;
  var imgScales = { small: 0.25, normal: 0.50, large: 1.00 }

  function setFontSize(fontSize) {
    var zoomLevel = 'normal';
    if (fontSize <= 9)
      zoomLevel = 'small';
    else if (fontSize >= 15)
      zoomLevel = 'large';
    var imgScale = imgScales[zoomLevel];
    $('#root').css('font-size', fontSize + 'pt');
    $('#root').removeClass('zoom-small zoom-normal zoom-large');
    $('#root').addClass('zoom-' + zoomLevel);    
    $('img.scalable').each(function() {
      $(this).css('width', this.naturalWidth * imgScale);
      $(this).css('height', this.naturalHeight * imgScale);
    });
  }
  $('#plus').on('click', function() {
    setFontSize(++fontSize);
  });
  $('#minus').on('click', function() {
    setFontSize(--fontSize);
  });
});

$(function () {
  var playerTrack=$("#player-track"),
    bgArtwork=$("#bg-artwork"),bgArtworkUrl,
    albumName=$("#album-name"),
    trackName=$("#track-name"),
    albumArt=$("#album-art"),
    sArea=$("#s-area"),
    seekBar=$("#seek-bar"),
    trackTime=$("#track-time"),
    insTime=$("#ins-time"),
    sHover=$("#s-hover"),
    playPauseButton=$("#play-pause-button"),
    i=playPauseButton.find("i"),
    tProgress=$("#current-time"),
    tTime=$("#track-length"),
    seekT,seekLoc,seekBarPos,cM,ctMinutes,ctSeconds,curMinutes,curSeconds,durMinutes,durSeconds,playProgress,bTime,nTime=0,buffInterval=null,tFlag=false,
    // trackNames=[
    //   "Играет", "Играет", "Играет", "Играет", "Играет",
    //   "Играет", "Играет", "Играет", "Играет", "Играет",
    //   "Играет", "Играет", "Играет", "Играет", "Играет",
    //   "Играет", "Играет", "Играет", "Играет", "Играет",
    //   "Играет", "Играет", "Играет", "Играет", "Играет",
    // ],
    fm_list=[ // Название Трека
      "FlyFox",
      "https://m.ketaru.com:8000/ketaruweb",
      "img/golive.png",
      "Играет (Только в Discord)",
      
      "TNT Radio",
      "https://tntradio.hostingradio.ru:8027/tntradio128.mp3",
      "img/tnt.png",
      "Играет",
      
      "Remix FM",
      "https://rmx.amgradio.ru/RemixFM",
      "img/remix.png",
      "Играет",
      
      "DFM",
      "https://dfm.hostingradio.ru/dfm128.mp3",
      "img/dfm.png",
      "Играет",
      
      "Like FM",
      "https://pub0301.101.ru:8443/stream/air/mp3/256/219",
      "img/like.png",
      "Играет",
      
      "Хайп FM",
      "https://hfm.amgradio.ru/HypeFM",
      "img/hype.png",
      "Играет",
      
      "Love Radio",
      "https://www.liveradio.es/dfmsaransk.sv-veter.ru:8095/love_saransk?128",
      "img/love.png",
      "Играет",
      
      "EuropaPlus",
      "https://ep256.hostingradio.ru:8052/europaplus256.mp3",
      "img/ep.png",
      "Играет",
      
      "EuropaPlus New",
      "https://europaplus.hostingradio.ru:8014/ep-new128.mp3",
      "img/ep_new.png",
      "Играет",
      
      "EuropaPlus Lisht",
      "https://europaplus.hostingradio.ru:8014/ep-light128.mp3",
      "img/ep_light.png",
      "Играет",
      
      "EuropaPlus Top40",
      "https://europaplus.hostingradio.ru:8014/ep-top256.mp3",
      "img/ep_top40.png",
      "Играет",
      
      "Свежее радио",
      "https://epdop.hostingradio.ru:8033/fresh64.aac",
      "img/ep_fresh.png",
      "Играет",
      
      "Хит FM",
      "https://hitfm.hostingradio.ru/hitfm96.aacp",
      "img/hit.png",
      "Играет",
      
      "Energy FM",
      "https://pub0102.101.ru:8443/stream/air/mp3/256/99",
      "img/nrg.png",
      "Играет",
      
      // "Radmir FM",
      // "http://listen7.myradio24.com/nazarik",
      // "img/radmir.png",
      // "Играет",
      
      "МУЗ Радио",
      "https://online-3.gkvr.ru:8001/muztvradio_original_128.mp3", 
      "img/muz.png",
      "Играет",
      
      "Радио SRP",
      "https://a7.radioheart.ru:8066/RH6629",
      "img/srp.png",
      "Играет",
      
      "Relax FM",
      "https://pub0301.101.ru:8443/stream/air/mp3/256/200",
      "img/relax.png",
      "Играет",
      
      "Русское Радио",
      "https://rusradio.hostingradio.ru/rusradio96.aacp",
      "img/rus.png",
      "Играет",
      
      "Юмор FM",
      "https://ic5.101.ru:8000/v5_1",
      "img/umor.png",
      "Играет",
      
      "Новое радио",
      "https://stream.newradio.ru/novoe96.aacp",
      "img/newradio.png",
      "Играет",
      
      "Radio Record",
      "https://radiorecord.hostingradio.ru/rr_main96.aacp",
      "img/record.png",
      "Играет",
      
      "Radio Record Phonk",
      "https://radiorecord.hostingradio.ru/phonk96.aacp",
      "img/record_phonk.png",
      "Играет",
      
      "Radio Record Remix",
      "https://radiorecord.hostingradio.ru/rmx96.aacp",
      "img/record_remix.png",
      "Играет",
      
      "Radio Record Trap",
      "https://radiorecord.hostingradio.ru/trap96.aacp",
      "img/record_trap.png",
      "Играет",
      
      "Radio Record Lo-Fi",
      "https://radiorecord.hostingradio.ru/lofi96.aacp",
      "img/record_lofi.png",
      "Играет",
      
      "Radio Record Rock",
      "https://radiorecord.hostingradio.ru/rock96.aacp",
      "img/record_rock.png",
      "Играет",
    ],
    playPreviousTrackButton=$("#play-previous"),playNextTrackButton=$("#play-next"),currIndex=-1;

  function playPause() {
    setTimeout(function () {
      audio.volume = document.querySelector('.range-input .value div').textContent/100
      if (audio.paused) {
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
        i.attr("class", "fas fa-pause");
        audio.play();
        // audio.volume=0.50;
      } else {
        playerTrack.removeClass("active");
        albumArt.removeClass("active");
        clearInterval(buffInterval);
        albumArt.removeClass("buffering");
        i.attr("class", "fas fa-play");
        audio.pause();
      }
    }, 300);
  }
  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());
    sHover.width(seekT);
    cM = seekLoc / 60;
    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
    if (ctMinutes < 0 || ctSeconds < 0) return;
    if (ctMinutes < 0 || ctSeconds < 0) return;
    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;
    if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
    else insTime.text(ctMinutes + ":" + ctSeconds);
    insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }
  function hideHover() {
    sHover.width(0);
    insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
  }
  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }
  function updateCurrTime() {
    nTime = new Date();
    nTime = nTime.getTime();
    if (!tFlag) {
      tFlag = true;
      trackTime.addClass("active");
    }
  }
  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
      else albumArt.removeClass("buffering");
      bTime = new Date();
      bTime = bTime.getTime();
    }, 3000);
  }
  function selectTrack(flag) {
    if (flag == 0 || flag == 1) ++currIndex;
    else --currIndex;
    if (currIndex > -1 && currIndex < fm_list.length) {
      if (flag == 0) i.attr("class", "fa fa-play");
      else {
        albumArt.removeClass("buffering");
        i.attr("class", "fa fa-pause");
      }
      seekBar.width(0);
      trackTime.removeClass("active");
      
      currAlbum = fm_list[currIndex+Number("0")]; // Radio Name
      audio.src = fm_list[currIndex+Number("5")]; // Radio Server
      currImage = './'+fm_list[currIndex+Number("2")]; // Radio Image
      currTrackName = fm_list[currIndex+Number("3")]; // Radio Status
      
      
      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();
      if (flag != 0) {
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");
        clearInterval(buffInterval);
        checkBuffering();
      }
      $("#album-name").hide(200, function() {
        $(this).html(currAlbum).show(200);
      });
      $("#track-name").hide(200, function() {
        $(this).html(currTrackName).show(200);
      });
      // albumName.text(currAlbum);
      trackName.text(currTrackName);
      document.querySelector('img.active').src = currImage;
      bgArtwork.css({ "background-image": "url(" + currImage + ")" });
    } else {
      if (flag == 0 || flag == 1) --currIndex;
      else ++currIndex;
    }
  }
  function initPlayer() {
    audio = new Audio();
    selectTrack(0);
    audio.loop = false;
    playPauseButton.on("click", playPause);
    sArea.mousemove(function (event) {
      showHover(event);
    });
    sArea.mouseout(hideHover);
    sArea.on("click", playFromClickedPos);
    $(audio).on("timeupdate", updateCurrTime);
    playPreviousTrackButton.on("click", function () {
      selectTrack(-3);
    });
    playNextTrackButton.on("click", function () {
      selectTrack(3);
    });
  }
  initPlayer();
});
// ---------------------------------------------------------------------------------------
document.querySelector('.range-input .value div').innerHTML = default_vol
document.querySelector(".range-input input").value = default_vol;
document.querySelector(".range-input input").step = step_vol;

let css = getComputedStyle(document.documentElement)
let bar_start = css.getPropertyValue('--bar_color_start')
let bar_end = css.getPropertyValue('--bar_color_end')

let sliderEl = document.querySelector("#range")
let sliderValue = document.querySelector(".value")
let tempSliderValue = default_vol; 
let progress = (tempSliderValue / sliderEl.max) * 100;
sliderEl.style.background = `linear-gradient(to right, ${bar_start} ${progress}%, ${bar_end} ${progress}%)`;
// ---------------------------------------------------------------------------------------


let rangeInput = document.querySelector(".range-input input");
let rangeValue = document.querySelector(".range-input .value div");
let start = parseFloat(rangeInput.min);
let end = parseFloat(rangeInput.max);
let step = parseFloat(rangeInput.step);
let value = parseFloat(rangeInput.value);
rangeInput.addEventListener("input",function(){
    let val = parseFloat(rangeInput.value);
    audio.volume = val/100
    
    document.querySelector('.range-input .value div').innerHTML = val
    
});

sliderEl.addEventListener("input", (event) => {
  let tempSliderValue = event.target.value; 
  let progress = (tempSliderValue / sliderEl.max) * 100;
  sliderEl.style.background = `linear-gradient(to right, ${bar_start} ${progress}%, ${bar_end} ${progress}%)`;
})
