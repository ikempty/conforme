(() => {
  const input = document.getElementById("siteSearch");
  const btn = document.getElementById("searchBtn");
  const line = document.getElementById("resultLine");

  // 検索UIが無いページでは何もしない
  if (!input || !btn) return;

  const page = document.body?.dataset?.page || "";

  /* ---------------------------
     utility
  --------------------------- */
  function norm(s){
    return (s || "")
      .replace(/[‐-‒–—−ー－]/g, "-")   // ハイフン統一
      .replace(/[\u3000\u00A0]/g, " ") // スペース統一
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function say(msg){
    if (line) line.textContent = msg || "";
  }

  /* ---------------------------
     routing rules
  --------------------------- */
  const RULES = {

    /* ===== index ===== */
    index: (q) => {
      if (q === "過去の体験") {
        return { go: "archive.html" };
      }
      return { msg: "該当する情報は見つかりませんでした。" };
    },

    /* ===== archive ===== */
    archive: (q) => {
      const map = {
        "arc-2601-04-si-113": "menu-01.html",
        "arc-2601-05-ve-019": "menu-02.html",
        "arc-2509-05-no-042": "menu-03.html",
      };

      const m = q.match(/arc-\d{4}-\d{2}-[a-z]{2}-\d{3}/);
      const key = m ? m[0] : q;

      if (map[key]) return { go: map[key] };
      return { msg: "参照番号が一致しません。" };
    },

    /* ===== menu pages ===== */
    menu: (q) => {
      const current = document.body?.dataset?.page || "";

      // 正解ルート：menu-01 だけ
      if (current === "menu-01") {
        if (q === "mn-2601-si-07") {
          return { go: "fit.html" };
        }
        return { msg: "該当する記録が見つかりません。" };
      }

      // menu-02 / menu-03 はすべて拒否
      return { msg: "参照権限がありません。" };
    },

    /* ===== fit ===== */
    fit: (q) => {
      if (q === "登録経緯" || q === "registration history") {
        return { go: "history.html" };
      }
      return { msg: "一致する参照がありません。" };
    },

    /* ===== history ===== */
    history: (q) => {
      if (q === "register" || q === "reg") {
        return { go: "register.html" };
      }
      return { msg: "アクセスが許可されていません。" };
    },

    /* ===== register / goal ===== */
    register: () => ({ msg: "このページでは検索は使用できません。" }),
    goal: () => ({ msg: "" })
  };

  /* ---------------------------
     router
  --------------------------- */
  function route(){
    const q = norm(input.value);
    say("");
    if (!q) return;

    // menu-01 / 02 / 03 は menu として扱う
    const key = page.startsWith("menu") ? "menu" : page;
    const handler = RULES[key];

    if (!handler) {
      say("該当する情報は見つかりませんでした。");
      return;
    }

    const res = handler(q);
    if (res?.go) {
      window.location.href = res.go;
      return;
    }
    if (res?.msg) say(res.msg);
  }

  btn.addEventListener("click", route);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") route();
  });
})();
