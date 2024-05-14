const dropdownBtn = document.getElementById("btn");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("arrow");

// Toggle dropdown function
const toggleDropdown = function () {
  dropdownMenu.classList.toggle("show");
  toggleArrow.classList.toggle("arrow");
};

// Toggle dropdown open/close when dropdown button is clicked
dropdownBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  toggleDropdown();
});

// Close dropdown when dom element is clicked
document.documentElement.addEventListener("click", function () {
  if (dropdownMenu.classList.contains("show")) {
    toggleDropdown();
  }
});



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


function doSomething(x) {
  // Действия, которые выполняются при клике
  // alert('Кнопка нажата!');
  var currIndex = (x * 5)-6
  var fff = document.querySelector('.number').innerHTML
  console.log(`Нажмите ${x} ${fff}`)
  if (x < fff){
    // document.querySelector('#play-previous').click()
    var i = 0
    var rt = (fff-x)
    for (i=0; i<rt; i++) {
      document.querySelector('#play-previous').click()
    }
  }
  if (x > fff){
    var i = 0
    var rt = (x-fff)
    console.log(rt)
    for (i=0; i<rt; i++) {
      document.querySelector('#play-next').click()
    }
  }

}
$(function () {
  // var img = document.createElement("img");
  // img.src = `${fm_list[5]}`;
  // img.textContent = `${fm_list[5]}`;
  // document.body.appendChild(img);
  
  var result = ''; var i = -4; do {i += 5; {
    // var img = document.createElement("img");
    // img.src = `${fm_list[i]}`;
    // img.style = `display: none`;
    // document.body.appendChild(img);
    // document.head.appendChild(img);
    
    var sell = document.createElement('a');
    sell.setAttribute("onclick",`event.preventDefault(); doSomething(${((i-1)/5)+1})`);
    sell.innerHTML = (`<img id=immm src="./${fm_list[i]}"><span id=names>${fm_list[i-1]}</span><span id=stat>${fm_list[i+2]}</span> <span id=nums>${((i-1)/5)+1}</span>`)
    const box = document.getElementById('dropdown');
    box.appendChild(sell);
    // document.head.appendChild(sell);
    
  }
} while (i < (fm_list.length-5));

// document.write(result);

var playerTrack=$("#player-track"),
    bgback=$("#bg-artwork"),
    bglogo=$("#album-art"),
    bglogobg=$("#album-art-bg"),
    bgArtworkUrl,
    albumName=$("#album-name"),
    trackName=$("#track-name"),
    albumArt=$("#album-art"),
    albumArtBg=$("#album-art-bg"),
    idfm=$("#idfm"),
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
    playPreviousTrackButton=$("#play-previous"),playNextTrackButton=$("#play-next"),currIndex=-1;
    
    let url = new URL(window.location.href)
    let par = new URLSearchParams(url.search);
    const select = par.get("id");
    console.log(select)
    if (`${select}` === `null`) {
      console.log(`${select}`.replace('null', '1'))
      var currIndex = (1 * 5)-6;
    }
    else {
      var currIndex = (select * 5)-6
    }
    
    function playPause() {
      setTimeout(function () {
        audio.volume = document.querySelector('.range-input .value div').textContent/100
        if (audio.paused) {
          playerTrack.addClass("active");
          albumArt.addClass("active");
          idfm.addClass("active");
          checkBuffering();
          i.attr("class", "fas fa-pause");
          audio.play();
          // audio.volume=0.50;
        } else {
          playerTrack.removeClass("active");
          albumArt.removeClass("active");
          idfm.removeClass("active");
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
  var rl1 = $("#album-name")
  function checkBuffering(){
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime == 0 || bTime - nTime > 1000){
        rl1.addClass("buff");
        rl1.removeClass("buffa");
      }
      else {
        rl1.removeClass("buff");
        rl1.addClass("buffa");
        bTime = new Date();
        bTime = bTime.getTime();
      }
    }, 1000);
  }
  function selectTrack(flag) {
    if (flag == 0 || flag == 1) currIndex++;
    else currIndex--;
    if (currIndex > -1 && currIndex < fm_list.length) {
      if (flag == 0) {
        i.attr("class", "fa fa-play")
      }
      else {
        rl1.removeClass("buff");
        i.attr("class", "fa fa-pause");
      }
      seekBar.width(0);
      trackTime.removeClass("active");
      currAlbum = fm_list[currIndex+Number("0")]; // Radio Name
      currImage = fm_list[currIndex+Number("1")]; // Radio Image
      audio.src = fm_list[currIndex+Number("2")]; // Radio Server
      currTrack = fm_list[currIndex+Number("3")]; // Radio Status
      currID = (currIndex/5)+1;                   // Radio ID
      
      
      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();
      if (flag != 0) {
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");
        idfm.addClass("active");
        clearInterval(buffInterval);
        checkBuffering();
      }
      $("#album-name").hide(200, function() {
        $(this).html(currAlbum).show(200);
      });
      $("#track-name").hide(200, function() {
        $(this).html(currTrack).show(200);
      });
      // albumName.text(currAlbum);
      
      trackName.text(currTrack);
      idfm.text(currID);
      // document.querySelector('img.active').src = './'+currImage;
      bgback.css({ "background-image": "url(" + './'+currImage + ")" });
      bglogo.css({ "background-image": "url(" + './'+currImage + ")" });
      bglogobg.css({ "background-image": "url(" + './'+currImage + ")" });
    } else {
      if (flag == 0 || flag == 1) currIndex++;
      else ++currIndex;
    }
  }
  function initPlayer() {
    audio = new Audio();
    selectTrack(0);
    audio.loop = true;
    playPauseButton.on("click", playPause);
    sArea.mousemove(function (event) {
      showHover(event);
    });
    sArea.mouseout(hideHover);
    sArea.on("click", playFromClickedPos);
    $(audio).on("timeupdate", updateCurrTime);
    playPreviousTrackButton.on("click", function () {
      let i = 0;
      for (; i < 5; i++) {
        selectTrack(-1);
      }
    });
    playNextTrackButton.on("click", function () {
      let i = 0;
      let g = 5;
      if (currIndex <= fm_list.length-(g*2)){
        for (; i < g; i++) {
          selectTrack(1);
        }};
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
  