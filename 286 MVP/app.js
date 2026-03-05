

(function () {
  var screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));
  var current = 0;

  function getScreenIndexById(id) {
    for (var i = 0; i < screens.length; i++) {
      if (screens[i].id === id) return i;
    }
    return 0;
  }

  function showScreen(index) {
    if (index < 0) index = 0;
    if (index >= screens.length) index = screens.length - 1;

    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove("is-active");
    }
    screens[index].classList.add("is-active");
    current = index;

    if (screens[index].id === "screen-result") {
      updateResult();
    }

    var h = screens[index].querySelector("h1, h2");
    if (h) {
      h.setAttribute("tabindex", "-1");
      h.focus();
    }
  }

  function getCheckedValue(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  function labelForValue(group, value) {
    var map = {
      mood: { tired:"Tired", anxious:"Anxious", calm:"Calm", excited:"Excited" },
      atm: { quiet:"Quiet", focus:"Focused", relax:"Relaxed" },
      sound: { rnb:"R&B", classical:"Classical", rock:"Rock", white:"White Noise" }
    };
    if (map[group] && map[group][value]) return map[group][value];
    return value || "";
  }

  function promptForMood(mood) {
    switch (mood) {
      case "tired": return "Try a tiny reset: water + stretch + 3 deep breaths before your next step.";
      case "anxious": return "Shrink the task: what’s the next 5-minute action you can do right now?";
      case "calm": return "Keep it simple: choose one small task, finish it, then take a short break.";
      case "excited": return "Use the energy: do the hardest part first for 10 minutes, then reassess.";
      default: return "Start small and be kind to yourself.";
    }
  }

  function updateResult() {
    var mood = getCheckedValue("mood");
    var atm = getCheckedValue("atm");
    var sound = getCheckedValue("sound");

    var outMood = document.getElementById("outMood");
    var outAtm = document.getElementById("outAtm");
    var outSound = document.getElementById("outSound");
    var outPrompt = document.getElementById("outPrompt");

    if (outMood) outMood.textContent = labelForValue("mood", mood);
    if (outAtm) outAtm.textContent = labelForValue("atm", atm);
    if (outSound) outSound.textContent = labelForValue("sound", sound);
    if (outPrompt) outPrompt.textContent = promptForMood(mood);
  }

  // Start button
  var btnStart = document.getElementById("btnStart");
  if (btnStart) {
    btnStart.addEventListener("click", function () {
      showScreen(getScreenIndexById("screen-mood"));
    });
  }

  // Back pills
  document.addEventListener("click", function (e) {
    var t = e.target;

    while (t && t !== document.body) {
      if (t.hasAttribute && t.hasAttribute("data-back")) {
        e.preventDefault();
        showScreen(current - 1);
        return;
      }
      t = t.parentNode;
    }
  });

  // Auto-advance on selection (clicking a pill sets radio => change event)
  function autoAdvanceOnChange(groupName, nextScreenId) {
    var inputs = document.querySelectorAll('input[name="' + groupName + '"]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("change", function () {
        showScreen(getScreenIndexById(nextScreenId));
      });
    }
  }

  autoAdvanceOnChange("mood", "screen-atmosphere");
  autoAdvanceOnChange("atm", "screen-sound");
  autoAdvanceOnChange("sound", "screen-result");

  // Restart on result screen
  var btnRestart = document.getElementById("btnRestart");
  if (btnRestart) {
    btnRestart.addEventListener("click", function () {
      showScreen(getScreenIndexById("screen-intro"));
    });
  }

// new
// ---- Hover-to-preview music (single shared audio player) ----
var previewAudio = new Audio();
previewAudio.preload = "none"; // change to "metadata" if you want faster starts
previewAudio.volume = 0.6;

var audioUnlocked = false;

// After any user click, browsers are more likely to allow play()
document.addEventListener("click", function () {
  audioUnlocked = true;
}, { once: true });

function stopPreview() {
  try {
    previewAudio.pause();
    previewAudio.currentTime = 0;
  } catch (e) {}
}

function playPreview(src) {
  if (!src) return;

  // If audio isn't unlocked yet, don't fight the browser.
  if (!audioUnlocked) return;

  // If switching tracks, reset
  if (previewAudio.src.indexOf(src) === -1) {
    previewAudio.src = src;
  }

  // Start from beginning every hover
  try { previewAudio.currentTime = 0; } catch (e) {}

  var p = previewAudio.play();
  if (p && typeof p.catch === "function") {
    p.catch(function () {
      // If blocked, just silently fail (common in Chrome)
    });
  }
}

// Only apply to music pills (screen-sound)
var musicScreen = document.getElementById("screen-sound");
if (musicScreen) {
  var musicPills = musicScreen.querySelectorAll(".pillBtn[data-preview]");

  for (var i = 0; i < musicPills.length; i++) {
    (function (pill) {
      pill.addEventListener("mouseenter", function () {
        var src = pill.getAttribute("data-preview");
        playPreview(src);
      });

      pill.addEventListener("mouseleave", function () {
        stopPreview();
      });

      // For keyboard users: focus/blur preview too
      pill.addEventListener("focusin", function () {
        var src = pill.getAttribute("data-preview");
        playPreview(src);
      });

      pill.addEventListener("focusout", function () {
        stopPreview();
      });
    })(musicPills[i]);
  }
}
	
	
//	
	
  showScreen(getScreenIndexById("screen-intro"));
})();