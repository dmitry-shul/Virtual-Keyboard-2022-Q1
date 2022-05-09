import { ENcaseDown, ENshiftKey, ENcaps, ENshiftCaps, RUcaseDown, RUshiftKey, RUcaps, RUshiftCaps, eventCodes } from "./keys.js";

const body = document.querySelector("body");

let AllButtons;
let textarea;
let keysBtn;
let tab;
let space;
let enter;
let del;
let backspace;
let cursorPos = 0;
let beforeCursor;
let afterCursor;
let ctrl;
let data_code;

let CAPS_LOCK;
let SHIFT;
let LANGUAGE;

let keys; //выбранная раскладка клавиш
let languageEN;
let shiftPress = false;
let caps_lock_active = false;


//local storage set
function setLocalStorage() {
	localStorage.setItem('keyboard_lang', languageEN);
}
//window.addEventListener('beforeunload', setLocalStorage);

//local storage get
function getLocalStorage() {
	if(!localStorage.getItem('keyboard_lang')) {
		languageEN = true;
		localStorage.setItem('keyboard_lang', languageEN);
	} else if(localStorage.getItem('keyboard_lang')) {
		languageEN = localStorage.getItem('keyboard_lang') === "false" ? false : true;
	}
	
	createContainer();
}
window.addEventListener('load', getLocalStorage);

//создание контейнера
function createContainer() {
  let container = 
  `<div class="container">
    <textarea name="textarea" id="textarea" class="textarea" cols="30" rows="10" autofocus></textarea>
    <div class="keyboard"></div>
		<div class="info">Клавиатура создана в операционной системе Windows</div>
    <div class="info">Для переключения языка нажмите кнопку En/Ru или нажмите Shift и затем Ctrl</div>
  </div>`;

  body.insertAdjacentHTML('afterbegin', container);

  changeKeys();
}

//создание кнопок
function createButtons() {
  let keyboard = document.querySelector(".keyboard");
	let IDeventCodes = 0;

  keyboard.innerText = "";

  keys.forEach((arr, index) => {
    let row = `<div class="keyboard__row row${index+1}"></div>`;

    keyboard.insertAdjacentHTML('beforeend', row);

    let keyboard__row = document.querySelector(`.row${index+1}`);

    arr.forEach((i, arrIndex) => {
      let k = "";

      k = i === "&larr;" ? "backspace" 
      : i === "Tab" ? "tab"
      : i === "Del" ? "del"
      : i === "CapsLock" ? "caps_lock"
      : i === "ENTER" ? "enter"
      : i === "Shift" ? "shift"
      : i === "Ctrl" ? "ctrl"
      : i === "En" ? "language"
      : i === "Ru" ? "language"
      : i === "Alt" ? "alt"
      : i === "" ? "space" : "";

      let button = `<div class="keyboard__btn ${k === "" ? "keyBtn" : k}" data-code="${eventCodes.flat(Infinity)[IDeventCodes]}">${i}</div>`;

			IDeventCodes++;

      keyboard__row.insertAdjacentHTML('beforeend', button);
    });
  });

  returnSelectors();

  //отслеживание нажатия CAPS_LOCK, SHIFT, LANGUAGE
  CAPS_LOCK.addEventListener("click", () => (caps_lock_active = !caps_lock_active, changeKeys()));
  SHIFT.forEach(sh => sh.addEventListener("click", () => (shiftPress = !shiftPress, changeKeys())));
  LANGUAGE.addEventListener("click", () => (languageEN = !languageEN, setLocalStorage(), changeKeys()));
}

//изменение раскладки
function changeKeys() {
  if(languageEN === true && shiftPress === false && caps_lock_active === false) {keys = ENcaseDown;}
  if(languageEN === true && shiftPress === true && caps_lock_active === false) {keys = ENshiftKey;}
  if(languageEN === true && shiftPress === false && caps_lock_active === true) {keys = ENcaps;}
  if(languageEN === true && shiftPress === true && caps_lock_active === true) {keys = ENshiftCaps;}

  if(languageEN === false && shiftPress === false && caps_lock_active === false) {keys = RUcaseDown;}
  if(languageEN === false && shiftPress === true && caps_lock_active === false) {keys = RUshiftKey;}
  if(languageEN === false && shiftPress === false && caps_lock_active === true) {keys = RUcaps;}
  if(languageEN === false && shiftPress === true && caps_lock_active === true) {keys = RUshiftCaps;}

  createButtons(); 
  switchColorBtn();
  offShift();
}

//подсвечивает нажатый SHIFT, CAPS_LOCK
function switchColorBtn() {
  if(shiftPress) {
    SHIFT.forEach(sh => sh.classList.add("keyboard__btn_active"));
  } else {
    SHIFT.forEach(sh => sh.classList.remove("keyboard__btn_active"));
  }
  if(caps_lock_active) {
    CAPS_LOCK.classList.add("keyboard__btn_active");
  } else {
    CAPS_LOCK.classList.remove("keyboard__btn_active");
  }
}

//выключает SHIFT после нажатия любой кнопки
function offShift() {
  let arr = Object.values(AllButtons);
  arr = arr.filter(i => i.classList[1] !== "caps_lock" &&  i.classList[1] !== "alt" && i.classList[1] !== "shift");

  arr.forEach(btn => btn.addEventListener("click", () => {
    shiftPress = false;
    changeKeys();
  }));
}

//держит фокус в textarea
function textareaFocus() {
  AllButtons.forEach(btn => btn.addEventListener("click", () => {
    textarea.focus();
  }));
}

//находит все элементы после из создания
function returnSelectors() {
  CAPS_LOCK = document.querySelector(".caps_lock");
  SHIFT = document.querySelectorAll(".shift");
  LANGUAGE = document.querySelector(".language");

  AllButtons = document.querySelectorAll(".keyboard__btn");
  textarea = document.querySelector(".textarea");
  keysBtn = document.querySelectorAll(".keyBtn");
  tab = document.querySelector(".tab");
  space = document.querySelector(".space");
  enter = document.querySelector(".enter");
  del = document.querySelector(".del");
  backspace = document.querySelector(".backspace");
  ctrl = document.querySelectorAll(".ctrl");
	data_code = document.querySelectorAll('[data-code]');

  textareaFocus();
  textareaWrite();
  shiftCtrlLanguage();
}

//добавление символов в textarea
function textareaWrite() {
  keysBtn.forEach(btn => btn.addEventListener("click", () => {
    beforeAfterCursor();
    textarea.value = beforeCursor + btn.textContent + afterCursor;
    selectionStartEnd();
  }));

  tab.addEventListener("click", () => {
    beforeAfterCursor();
    textarea.value = beforeCursor + "  " + afterCursor;
    textarea.selectionStart = cursorPos+2;
    textarea.selectionEnd = cursorPos+2;
  });

  space.addEventListener("click", () => {
    beforeAfterCursor();
    textarea.value = beforeCursor + " " + afterCursor;
    selectionStartEnd();
  });

  enter.addEventListener("click", () => {
    beforeAfterCursor();
    textarea.value = beforeCursor + '\r\n' + afterCursor;
    selectionStartEnd();
  });

  del.addEventListener("click", () => {
    beforeAfterCursor();
    textarea.value = beforeCursor + afterCursor.slice(1, beforeCursor.length);
    textarea.selectionStart = cursorPos;
    textarea.selectionEnd = cursorPos;
  });

  backspace.addEventListener("click", () => {
    beforeAfterCursor();
    textarea.value = beforeCursor.slice(0, (beforeCursor.length - 1)) + afterCursor;
    textarea.selectionStart = cursorPos-1;
    textarea.selectionEnd = cursorPos-1;
  });

  textarea.addEventListener("click", () => {
    beforeAfterCursor();
  });
}

//присваевает значение места курсора
function beforeAfterCursor() {
  cursorPos = getCursorPos(textarea);
  beforeCursor = textarea.value.slice(0, cursorPos);
  afterCursor = textarea.value.slice(cursorPos, textarea.value.length);
}

//устанавливает курсор
function selectionStartEnd() {
  textarea.selectionStart = cursorPos+1;
  textarea.selectionEnd = cursorPos+1;
}

//определяет положение курсора
function getCursorPos(obj) {
  obj.focus();
  if(obj.selectionStart) return obj.selectionStart;
  else if (document.selection) {
       var sel = document.selection.createRange();
       var clone = sel.duplicate();
       sel.collapse(true);
       clone.moveToElementText(obj);
       clone.setEndPoint('EndToEnd', sel);
       return clone.text.length;
  }
  return 0;
}

//изменения языка shift + ctrl
function shiftCtrlLanguage() {
  if(shiftPress === true) {
    ctrl.forEach(btn => btn.addEventListener("click", () => {
      languageEN = !languageEN;
			setLocalStorage();
      changeKeys();
    }));
  }
}

//нажатия на клавиатуру
document.addEventListener('keydown', (event) => {
	data_code.forEach(i => {
		i.dataset.code == event.code ? i.classList.add("key_isPress") : i;
	});

	if(shiftPress === true) {
		event.code == "ControlLeft" || event.code == "ControlRight" 
		? (languageEN = !languageEN, setLocalStorage())
		: event.code;
	}
	
	event.code == "ShiftLeft" || event.code == "ShiftRight" 
	? (shiftPress = !shiftPress)
	: (shiftPress = false);

	if(event.code == "CapsLock") {
		caps_lock_active == false ? caps_lock_active = true : caps_lock_active = false;
	}
	
});

//отпускание клавишь клавиатуры
document.addEventListener('keyup', (event) => {
  data_code.forEach(i => {
		i.classList.remove("key_isPress");
	});
	changeKeys();
});

