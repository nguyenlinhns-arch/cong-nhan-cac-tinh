(() => {
  "use strict";

  const VOICE_LANG = "vi-VN";
  const PRIVACY_NOTE = "Trình duyệt xử lý giọng nói; website không lưu âm thanh hay câu hỏi.";
  let activeRecognition = null;
  let activeSpeech = null;

  function setButtonState(button, active, label) {
    button.setAttribute("aria-pressed", String(active));
    button.textContent = label;
  }

  function voiceErrorMessage(code) {
    if (code === "not-allowed" || code === "service-not-allowed") return "Chưa được cấp quyền micro. Bạn vẫn có thể gõ câu hỏi.";
    if (code === "no-speech") return "Chưa nghe rõ. Hãy bấm lại và nói gần micro hơn.";
    if (code === "audio-capture") return "Thiết bị chưa nhận được micro.";
    if (code === "network") return "Nhận giọng nói đang gián đoạn. Hãy thử lại hoặc gõ câu hỏi.";
    return "Chưa nhận được câu hỏi. Hãy thử lại hoặc gõ trực tiếp.";
  }

  function setupVoiceSearch(dialog) {
    if (dialog.dataset.voiceSearchReady) return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const form = dialog.querySelector(".tl-search-dialog__form");
    const input = form?.querySelector("input[type='search']");
    if (!Recognition || !form || !input) {
      dialog.dataset.voiceSearchReady = "unsupported";
      return;
    }

    dialog.dataset.voiceSearchReady = "true";
    const controls = document.createElement("div");
    controls.className = "tl-voice-controls";
    controls.dataset.voiceSearchControls = "true";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tl-voice-search-button";
    button.dataset.voiceSearch = "true";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Nói câu hỏi để tìm thông tin");
    button.textContent = "🎙 Nói để tìm";
    const status = document.createElement("span");
    status.className = "tl-voice-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.textContent = PRIVACY_NOTE;
    controls.append(button, status);
    form.querySelector('[data-load-voice="search"]')?.closest(".tl-voice-entry")?.remove();
    form.append(controls);

    let recognition = null;
    let listening = false;
    let received = false;

    const finish = () => {
      listening = false;
      activeRecognition = null;
      setButtonState(button, false, "🎙 Nói để tìm");
      if (!received && status.textContent === "Hãy nói câu hỏi của bạn…") status.textContent = PRIVACY_NOTE;
    };

    button.addEventListener("click", () => {
      if (listening && recognition) {
        recognition.stop();
        status.textContent = "Đã dừng nghe. Bạn có thể bấm lại hoặc gõ câu hỏi.";
        return;
      }

      activeRecognition?.abort?.();
      recognition = new Recognition();
      recognition.lang = VOICE_LANG;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      received = false;
      recognition.onstart = () => {
        listening = true;
        activeRecognition = recognition;
        setButtonState(button, true, "● Đang nghe…");
        status.textContent = "Hãy nói câu hỏi của bạn…";
      };
      recognition.onresult = (event) => {
        const transcript = String(event.results?.[0]?.[0]?.transcript || "").trim().slice(0, 160);
        if (!transcript) return;
        received = true;
        input.value = transcript;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        status.textContent = "Đã nhận câu hỏi. Câu trả lời đang hiển thị bên dưới.";
      };
      recognition.onerror = (event) => {
        received = true;
        status.textContent = voiceErrorMessage(event.error);
      };
      recognition.onend = finish;
      try {
        recognition.start();
      } catch (_) {
        status.textContent = "Micro đang bận. Hãy thử lại hoặc gõ câu hỏi.";
        finish();
      }
    });

    dialog.addEventListener("close", () => recognition?.abort?.());
  }

  function briefSpeechText(dialog) {
    const facts = [...dialog.querySelectorAll(".tl-search-result")]
      .map((card) => {
        const title = card.querySelector("strong")?.textContent?.trim() || "";
        const description = card.querySelector("span")?.textContent?.trim() || "";
        return [title, description].filter(Boolean).join(". ");
      })
      .filter(Boolean);
    return ["Tóm tắt tuyển thợ mỏ.", ...facts, "Bạn có thể tự kiểm tra điều kiện, đăng ký ngay hoặc hỏi qua Zalo."].join(" ");
  }


  function answerSpeechText(panel) {
    const title = panel.querySelector("strong")?.textContent?.trim() || "";
    const text = [...panel.children].find((element) => element.tagName === "SPAN")?.textContent?.trim() || "";
    return [title, text].filter(Boolean).join(". ");
  }

  function setupSearchAnswerReadAloud(dialog) {
    if (dialog.dataset.searchAnswerReadAloudReady) return;
    const synth = window.speechSynthesis;
    const Utterance = window.SpeechSynthesisUtterance;
    const grid = dialog.querySelector(".tl-search-results__grid");
    if (!synth || typeof Utterance !== "function" || !grid) {
      dialog.dataset.searchAnswerReadAloudReady = "unsupported";
      return;
    }

    dialog.dataset.searchAnswerReadAloudReady = "true";
    let activeButton = null;
    let activeLive = null;

    const reset = (message = "Có thể nghe câu trả lời mà không cần đọc.") => {
      if (activeButton) setButtonState(activeButton, false, "🔊 Nghe câu trả lời");
      if (activeLive) activeLive.textContent = message;
      activeButton = null;
      activeLive = null;
      activeSpeech = null;
    };

    const stop = (message = "Đã dừng giọng đọc.") => {
      synth.cancel();
      reset(message);
    };

    const attach = () => {
      if (activeButton && !activeButton.isConnected) stop("Câu trả lời đã thay đổi.");
      grid.querySelectorAll("[data-search-answer]").forEach((panel) => {
        if (panel.querySelector("[data-answer-read-aloud]")) return;
        const wrap = document.createElement("div");
        wrap.className = "tl-voice-answer-wrap";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tl-voice-read-button";
        button.dataset.answerReadAloud = "true";
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", "Nghe câu trả lời đang hiển thị");
        button.textContent = "🔊 Nghe câu trả lời";
        const live = document.createElement("span");
        live.className = "tl-voice-status";
        live.setAttribute("role", "status");
        live.setAttribute("aria-live", "polite");
        live.textContent = "Có thể nghe câu trả lời mà không cần đọc.";
        wrap.append(button, live);
        panel.querySelector('[data-load-voice="answer"]')?.remove();
        const actions = panel.querySelector(".tl-search-empty__actions");
        panel.insertBefore(wrap, actions || null);

        button.addEventListener("click", () => {
          if (button.getAttribute("aria-pressed") === "true") {
            stop();
            return;
          }
          synth.cancel();
          reset();
          const text = answerSpeechText(panel);
          if (!text) {
            live.textContent = "Chưa có câu trả lời để đọc.";
            return;
          }
          const utterance = new Utterance(text);
          utterance.lang = VOICE_LANG;
          utterance.rate = 0.94;
          utterance.pitch = 1;
          const vietnameseVoice = synth.getVoices().find((voice) => String(voice.lang || "").toLowerCase().startsWith("vi"));
          if (vietnameseVoice) utterance.voice = vietnameseVoice;
          activeButton = button;
          activeLive = live;
          activeSpeech = utterance;
          utterance.onstart = () => {
            if (activeSpeech !== utterance) return;
            setButtonState(button, true, "■ Dừng nghe");
            live.textContent = "Đang đọc câu trả lời…";
          };
          utterance.onend = () => { if (activeSpeech === utterance) reset("Đã đọc xong câu trả lời."); };
          utterance.onerror = () => { if (activeSpeech === utterance) reset("Thiết bị chưa phát được giọng đọc. Câu trả lời vẫn hiển thị phía trên."); };
          synth.speak(utterance);
        });
      });
    };

    attach();
    new MutationObserver(attach).observe(grid, { childList: true, subtree: true });
    dialog.addEventListener("close", () => {
      if (activeButton) stop();
    });
  }

  function setupBriefReadAloud(dialog) {
    if (dialog.dataset.briefReadAloudReady) return;
    const synth = window.speechSynthesis;
    const Utterance = window.SpeechSynthesisUtterance;
    const statusLine = dialog.querySelector(".tl-search-status");
    if (!synth || typeof Utterance !== "function" || !statusLine) {
      dialog.dataset.briefReadAloudReady = "unsupported";
      return;
    }

    dialog.dataset.briefReadAloudReady = "true";
    const wrap = document.createElement("div");
    wrap.className = "tl-voice-read-wrap";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tl-voice-read-button";
    button.dataset.briefReadAloud = "true";
    button.setAttribute("aria-pressed", "false");
    button.textContent = "🔊 Nghe tóm tắt";
    const live = document.createElement("span");
    live.className = "tl-voice-status";
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    live.textContent = "Có thể nghe toàn bộ 6 thông tin mà không cần đọc.";
    wrap.append(button, live);
    dialog.querySelector('[data-load-voice="brief"]')?.closest(".tl-voice-entry")?.remove();
    statusLine.insertAdjacentElement("afterend", wrap);

    const reset = (message = "Có thể nghe toàn bộ 6 thông tin mà không cần đọc.") => {
      activeSpeech = null;
      setButtonState(button, false, "🔊 Nghe tóm tắt");
      live.textContent = message;
    };

    const stop = () => {
      synth.cancel();
      reset("Đã dừng giọng đọc.");
    };

    button.addEventListener("click", () => {
      if (button.getAttribute("aria-pressed") === "true") {
        stop();
        return;
      }
      synth.cancel();
      const utterance = new Utterance(briefSpeechText(dialog));
      utterance.lang = VOICE_LANG;
      utterance.rate = 0.94;
      utterance.pitch = 1;
      const vietnameseVoice = synth.getVoices().find((voice) => String(voice.lang || "").toLowerCase().startsWith("vi"));
      if (vietnameseVoice) utterance.voice = vietnameseVoice;
      utterance.onstart = () => {
        activeSpeech = utterance;
        setButtonState(button, true, "■ Dừng nghe");
        live.textContent = "Đang đọc tóm tắt tuyển thợ mỏ…";
      };
      utterance.onend = () => reset("Đã đọc xong. Bạn có thể chọn bước tiếp theo bên dưới.");
      utterance.onerror = () => reset("Thiết bị chưa phát được giọng đọc. Bạn vẫn có thể xem 6 thẻ tóm tắt.");
      synth.speak(utterance);
    });

    dialog.addEventListener("close", () => {
      if (activeSpeech) stop();
    });
  }

  function init(root = document) {
    root.querySelectorAll?.("dialog.tl-search-dialog").forEach((dialog) => {
      if (dialog.classList.contains("tl-worker-brief-dialog")) setupBriefReadAloud(dialog);
      else {
        setupVoiceSearch(dialog);
        setupSearchAnswerReadAloud(dialog);
      }
    });
  }

  function activate(dialog, mode) {
    if (!dialog) return;
    if (mode === "brief") {
      setupBriefReadAloud(dialog);
      dialog.querySelector("[data-brief-read-aloud]")?.click();
      return;
    }
    if (mode === "answer") {
      setupSearchAnswerReadAloud(dialog);
      dialog.querySelector("[data-answer-read-aloud]")?.click();
      return;
    }
    setupVoiceSearch(dialog);
    dialog.querySelector("[data-voice-search]")?.click();
  }

  window.ThayLinhVoiceAssist = Object.freeze({ init, activate });
})();
