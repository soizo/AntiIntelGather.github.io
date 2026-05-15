var VERT_PUNCT_MAP = {
  "，": "︐",
  "、": "︑",
  "。": "︒",
  "：": "︓",
  "；": "︔",
  "！": "︕",
  "？": "︖",
  "…": "︙",
  "—": "︱",
  "（": "︵",
  "）": "︶",
  "｛": "︷",
  "｝": "︸",
  "〔": "︹",
  "〕": "︺",
  "【": "︻",
  "】": "︼",
  "《": "︽",
  "》": "︾",
  "〈": "︿",
  "〉": "﹀",
  "「": "﹁",
  "」": "﹂",
  "『": "﹃",
  "』": "﹄"
};

var HORIZ_PUNCT_MAP = {};
for (var key in VERT_PUNCT_MAP) {
  HORIZ_PUNCT_MAP[VERT_PUNCT_MAP[key]] = key;
}

var NO_COL_START = "，、。．：；！？）〕】》〉」』…—·︐︑︒︓︔︕︖︙︱︶︸︺︼︾﹀﹂﹄";
var NO_COL_END = "（〔【《〈「『︵︷︹︻︽︿﹁﹃";

function halfToFull(text) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if (code === 32) {
      result += String.fromCharCode(12288);
    } else if (code >= 33 && code <= 126) {
      result += String.fromCharCode(code + 65248);
    } else {
      result += text.charAt(i);
    }
  }
  return result;
}

function fullToHalf(text) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if (code === 12288) {
      result += String.fromCharCode(32);
    } else if (code >= 65281 && code <= 65374) {
      result += String.fromCharCode(code - 65248);
    } else {
      result += text.charAt(i);
    }
  }
  return result;
}

function toVertPunct(text) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var ch = text.charAt(i);
    result += VERT_PUNCT_MAP[ch] || ch;
  }
  return result;
}

function toHorizPunct(text) {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var ch = text.charAt(i);
    result += HORIZ_PUNCT_MAP[ch] || ch;
  }
  return result;
}

function processText(text) {
  var fullWidth = document.getElementById("optFullWidth").checked;
  var vertPunct = document.getElementById("optVertPunct").checked;
  if (fullWidth) text = halfToFull(text);
  if (vertPunct) text = toVertPunct(text);
  return text;
}

function reverseProcessText(text) {
  var vertPunct = document.getElementById("optVertPunct").checked;
  var fullWidth = document.getElementById("optFullWidth").checked;
  if (vertPunct) text = toHorizPunct(text);
  if (fullWidth) text = fullToHalf(text);
  return text;
}

function isNoStart(ch) {
  return NO_COL_START.indexOf(ch) !== -1;
}

function isNoEnd(ch) {
  return NO_COL_END.indexOf(ch) !== -1;
}

function smartSplit(text, targetLen) {
  if (text.length === 0) return [text];
  var cols = [];
  var i = 0;
  while (i < text.length) {
    var end = Math.min(i + targetLen, text.length);

    while (end > i + 1 && isNoEnd(text.charAt(end - 1))) {
      end--;
    }

    while (end < text.length && isNoStart(text.charAt(end))) {
      end++;
    }

    if (end <= i) end = i + 1;

    cols.push(text.substring(i, end));
    i = end;
  }
  return cols;
}

function getOption() {
  if (document.getElementById("byChars").checked) return "byChars";
  if (document.getElementById("byLines").checked) return "byLines";
}

function splitByChars(seg, lineLength) {
  seg = processText(seg);
  return smartSplit(seg, lineLength);
}

function splitByLines(seg, numLines) {
  seg = processText(seg);
  var baseLen = Math.ceil(seg.length / numLines);
  if (baseLen === 0) baseLen = 1;
  return smartSplit(seg, baseLen);
}

function toggleDirection() {
  var isRevert = document.getElementById("toHorizontal").checked;
  document.getElementById("textChoice").style.display = isRevert ? "none" : "";
}

function revertVertical() {
  var raw = document.getElementById("userText").value;
  if (raw === "") return;

  var rows = raw.split("\n");
  while (rows.length > 0 && rows[rows.length - 1] === "") {
    rows.pop();
  }
  if (rows.length === 0) return;

  var numCols = 0;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].length > numCols) numCols = rows[i].length;
  }
  for (var i = 0; i < rows.length; i++) {
    while (rows[i].length < numCols) {
      rows[i] += String.fromCharCode(12288);
    }
  }

  var lines = [];
  for (var c = 0; c < numCols; c++) {
    var line = "";
    for (var row = 0; row < rows.length; row++) {
      line += rows[row].charAt(numCols - 1 - c);
    }
    line = line.replace(/[　]+$/, "");
    line = reverseProcessText(line);
    lines.push(line);
  }

  var el = document.getElementById("output");
  el.value = lines.join("\n");
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
  el.scrollLeft = el.scrollWidth;
}

function myFunction() {
  if (document.getElementById("toHorizontal").checked) {
    revertVertical();
    return;
  }

  var raw = document.getElementById("userText").value;
  if (raw === "") return;

  var segments = raw.split("\n");
  var choice = getOption();
  var allCols = [];

  for (var s = 0; s < segments.length; s++) {
    var seg = segments[s];
    if (seg === "") {
      allCols.push(processText(" "));
      continue;
    }

    var cols;
    if (choice === "byChars") {
      var rawVal = document.getElementById("lineLength").value.trim().toLowerCase();
      var lineLength = (rawVal === "inf" || rawVal === "infinity") ? seg.length : parseInt(rawVal);
      if (isNaN(lineLength) || lineLength <= 0) return;
      cols = splitByChars(seg, lineLength);
    } else {
      var rawVal = document.getElementById("lines").value.trim().toLowerCase();
      var numLines = (rawVal === "inf" || rawVal === "infinity") ? seg.length : parseInt(rawVal);
      if (isNaN(numLines) || numLines <= 0) return;
      cols = splitByLines(seg, numLines);
    }

    for (var c = 0; c < cols.length; c++) {
      allCols.push(cols[c]);
    }
  }

  var maxLen = 0;
  for (var i = 0; i < allCols.length; i++) {
    if (allCols[i].length > maxLen) maxLen = allCols[i].length;
  }
  for (var i = 0; i < allCols.length; i++) {
    while (allCols[i].length < maxLen) {
      allCols[i] += String.fromCharCode(12288);
    }
  }

  var addZwsp = document.getElementById("optZwsp").checked;
  var output = "";
  for (var row = 0; row < maxLen; row++) {
    var line = "";
    for (var col = allCols.length - 1; col >= 0; col--) {
      line += allCols[col].charAt(row);
    }
    if (addZwsp) {
      var lastNonBlank = line.length;
      while (lastNonBlank > 0 && line.charCodeAt(lastNonBlank - 1) === 12288) {
        lastNonBlank--;
      }
      if (lastNonBlank < line.length) {
        line = line + String.fromCharCode(0x200B);
      }
    }
    output += line + "\n";
  }

  var el = document.getElementById("output");
  el.value = output;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
  el.scrollLeft = el.scrollWidth;
}

function copyOutput() {
  var text = document.getElementById("output").value;
  if (!text) return;
  navigator.clipboard.writeText(text);
}

function liveUpdate() {
  if (document.getElementById("optLive").checked) myFunction();
}

document.addEventListener("DOMContentLoaded", function() {
  var triggers = ["userText", "lineLength", "lines"];
  for (var i = 0; i < triggers.length; i++) {
    document.getElementById(triggers[i]).addEventListener("input", liveUpdate);
  }
  var checkboxes = ["optFullWidth", "optVertPunct", "optZwsp", "optLive"];
  for (var i = 0; i < checkboxes.length; i++) {
    document.getElementById(checkboxes[i]).addEventListener("change", liveUpdate);
  }
  var radios = document.querySelectorAll('input[name="textChoice"], input[name="direction"]');
  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", liveUpdate);
  }
});
