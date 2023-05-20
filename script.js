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
    albums=[ // Название Трека
      "GoLiveFM",
      "TNT Radio",
      "Remix FM",
      "DFM",
      "Like FM",

      "Хайп FM",
      "Love Radio",
      "MuzTV",
      "EuropaPlus",
      "EuropaPlus New",

      "EuropaPlus Lisht",
      "EuropaPlus Top40",
      "Свежее радио",
      "Хит FM",
      "Radio Free Music",

      "Energy FM",
      "Radmir FM",
      "Радио SRP",
      "Relax FM",
      "Radio Record",

      "Radio Record Phonk",
      "Radio Record Remix",
      "Русское Радио",
      "Юмор FM",
      "Новое радио",
    ],
    trackNames=[
      "Играет", "Играет", "Играет", "Играет", "Играет",
      "Играет", "Играет", "Играет", "Играет", "Играет",
      "Играет", "Играет", "Играет", "Играет", "Играет",
      "Играет", "Играет", "Играет", "Играет", "Играет",
      "Играет", "Играет", "Играет", "Играет", "Играет",
    ],
    trackUrl=[
      "http://s0.radioheart.ru:8000/livegolive",
      "http://tntradio.hostingradio.ru:8027/tntradio128.mp3?radiostatistica=tntmusic.ru",
      "http://rmx.amgradio.ru/RemixFM",
      "http://dfm.hostingradio.ru/dfm128.mp3",
      "http://ic4.101.ru:8000/v12_1",

      "http://hfm.amgradio.ru/HypeFM",
      "https://microit2.n340.com:8443/bmK1m0QZsfbArN6R_12_love_128",
      "https://online-3.gkvr.ru:8000/muztvradio_original_128.mp3",
      "http://ep256.hostingradio.ru:8052/europaplus256.mp3",
      "http://emg02.hostingradio.ru/ep-new128.mp3",

      "http://emg02.hostingradio.ru/ep-light128.mp3",
      "http://eptop128server.streamr.ru:8033/eptop128",
      "http://emg02.hostingradio.ru/fresh64.aac",
      "http://hitfm.hostingradio.ru/hitfm128.mp3",
      "http://radio-holding.ru:9000/rfm",
      
      "http://pub0302.101.ru:8000/stream/reg/mp3/128/region_energy_84",
      "http://listen7.myradio24.com/nazarik",
      "http://a7.radioheart.ru:8066/RH6629",
      "https://pub0301.101.ru:8443/stream/air/mp3/256/200",
      "http://radiorecord.hostingradio.ru/rr_main96.aacp",
      
      "http://radiorecord.hostingradio.ru/phonk96.aacp",
      "http://radiorecord.hostingradio.ru/rmx96.aacp",
      "http://online-1.gkvr.ru:8000/rusradio96.aac",
      "http://ic5.101.ru:8000/v5_1",
      "http://icecast.newradio.cdnvideo.ru/newradio2",
    ],
    active=[
      "img/golive.png",
      "img/tnt.png",
      "img/remix.png",
      "img/dfm.png",
      "img/like.png",
      
      "img/hype.png",
      "img/love.png",
      "img/muz.png",
      "img/ep.png",
      "img/ep_new.png",

      "img/ep_light.png",
      "img/ep_top40.png",
      "img/ep_fresh.png",
      "img/hit.png",
      "img/rfm.png",
      
      "img/nrg.png",
      "img/radmir.png",
      "img/srp.png",
      "img/relax.png",
      "img/record.png",
      
      "img/record_phonk.png",
      "img/record_remix.png",
      "img/rus.png",
      "img/umor.png",
      "img/newradio.png",
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
    if (currIndex > -1 && currIndex < albums.length) {
      if (flag == 0) i.attr("class", "fa fa-play");
      else {
        albumArt.removeClass("buffering");
        i.attr("class", "fa fa-pause");
      }
      seekBar.width(0);
      trackTime.removeClass("active");
      tProgress.text("00:00");
      tTime.text("00:00");
      currAlbum = albums[currIndex];
      currImage = './'+active[currIndex];
      currTrackName = trackNames[currIndex];
      audio.src = trackUrl[currIndex];
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
      selectTrack(-1);
    });
    playNextTrackButton.on("click", function () {
      selectTrack(1);
    });
  }
  initPlayer();
});

document.querySelector('.range-input .value div').innerHTML = default_vol
document.querySelector(".range-input input").value = default_vol;
document.querySelector(".range-input input").step = step_vol;

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


