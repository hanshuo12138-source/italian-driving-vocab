# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import hashlib
import secrets
from html import escape
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd
import streamlit as st


BASE_DIR = Path(__file__).parent
WORDS_PATH = BASE_DIR / "words.csv"
DATA_DIR = BASE_DIR / "data"
STATE_PATH = DATA_DIR / "user_state.json"
USERS_DIR = DATA_DIR / "users"
ACCOUNTS_PATH = DATA_DIR / "accounts.json"

REQUIRED_COLUMNS = {"chapter", "italian", "chinese"}
OPTIONAL_COLUMNS = ["pronunciation", "example_it", "example_zh", "note"]


st.set_page_config(
    page_title="意大利驾照理论词汇",
    page_icon="🚘",
    layout="wide",
    initial_sidebar_state="expanded",
)


def apply_theme() -> None:
    st.markdown(
        """
        <style>
        :root {
            --bg: #f6f8fb;
            --panel: #ffffff;
            --ink: #182230;
            --muted: #667085;
            --line: #e4e7ec;
            --blue: #2f6fed;
            --teal: #12b886;
            --coral: #ff6b6b;
            --amber: #f59f00;
        }

        .stApp {
            background:
                linear-gradient(180deg, #eef5ff 0, #f6f8fb 230px, #f6f8fb 100%);
            color: var(--ink);
        }

        [data-testid="stSidebar"] {
            background: #ffffff;
            border-right: 1px solid var(--line);
        }

        .app-title {
            font-size: 28px;
            line-height: 1.2;
            font-weight: 800;
            letter-spacing: 0;
            margin: 4px 0 6px;
        }

        .app-subtitle {
            color: var(--muted);
            font-size: 15px;
            margin-bottom: 16px;
        }

        .metric-row {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
            margin: 18px 0 22px;
        }

        .metric-card,
        .chapter-card,
        .word-card,
        .flash-card {
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 8px;
            box-shadow: 0 10px 28px rgba(16, 24, 40, 0.06);
        }

        .metric-card {
            padding: 14px 16px;
        }

        .metric-label {
            color: var(--muted);
            font-size: 13px;
            margin-bottom: 4px;
        }

        .metric-value {
            color: var(--ink);
            font-size: 24px;
            font-weight: 800;
        }

        .chapter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 14px;
        }

        .chapter-card {
            padding: 18px;
            min-height: 150px;
        }

        .chapter-topline {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .chapter-name {
            font-size: 18px;
            font-weight: 800;
        }

        .pill {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 700;
            background: #e7f5ff;
            color: #1c64d1;
            white-space: nowrap;
        }

        .small-muted {
            color: var(--muted);
            font-size: 13px;
        }

        .progress-track {
            height: 8px;
            border-radius: 999px;
            background: #edf2f7;
            overflow: hidden;
            margin: 16px 0 8px;
        }

        .progress-fill {
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, var(--blue), var(--teal));
        }

        .word-card {
            padding: 16px;
            margin-bottom: 12px;
        }

        .word-title {
            font-size: 22px;
            font-weight: 850;
            margin-bottom: 4px;
        }

        .word-translation {
            color: #344054;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .example {
            color: var(--muted);
            border-left: 3px solid #9ec5fe;
            padding-left: 10px;
            margin-top: 8px;
            font-size: 14px;
        }

        .flash-card {
            padding: 34px 24px;
            min-height: 330px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }

        .flash-word {
            font-size: 44px;
            line-height: 1.15;
            font-weight: 900;
            margin-bottom: 10px;
        }

        .flash-chinese {
            font-size: 28px;
            font-weight: 850;
            color: #1c64d1;
            margin: 12px 0 6px;
        }

        .badge-line {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 10px;
        }

        .badge {
            border: 1px solid var(--line);
            border-radius: 999px;
            padding: 3px 8px;
            color: var(--muted);
            font-size: 12px;
            background: #fff;
        }

        div[data-testid="stButton"] > button {
            border-radius: 8px;
            border: 1px solid #d0d5dd;
            font-weight: 700;
        }

        div[data-testid="stButton"] > button[kind="primary"] {
            background: var(--blue);
            border-color: var(--blue);
        }

        @media (max-width: 760px) {
            .metric-row {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .flash-word {
                font-size: 34px;
            }

            .flash-chinese {
                font-size: 23px;
            }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def make_word_id(row: pd.Series) -> str:
    return f"{row['chapter']}::{row['italian']}".strip().lower()


def h(value: Any) -> str:
    return escape(str(value), quote=True)


@st.cache_data(show_spinner=False)
def load_words() -> pd.DataFrame:
    if not WORDS_PATH.exists():
        st.error("没有找到 words.csv。请在项目根目录放入词库文件。")
        st.stop()

    words = pd.read_csv(WORDS_PATH).fillna("")
    words.columns = [column.strip() for column in words.columns]
    missing = REQUIRED_COLUMNS - set(words.columns)
    if missing:
        st.error(f"words.csv 缺少列：{', '.join(sorted(missing))}")
        st.stop()

    for column in OPTIONAL_COLUMNS:
        if column not in words.columns:
            words[column] = ""

    words["chapter"] = words["chapter"].astype(str).str.strip()
    words["italian"] = words["italian"].astype(str).str.strip()
    words["chinese"] = words["chinese"].astype(str).str.strip()
    words = words[(words["chapter"] != "") & (words["italian"] != "")]
    words["word_id"] = words.apply(make_word_id, axis=1)
    return words.reset_index(drop=True)


def default_state() -> dict[str, Any]:
    return {
        "favorites": [],
        "difficult": [],
        "learned": [],
        "stats": {},
    }


def normalize_username(username: str) -> str:
    return username.strip().lower()


def state_path_for_user(username: str) -> Path:
    digest = hashlib.sha256(normalize_username(username).encode("utf-8")).hexdigest()[:16]
    return USERS_DIR / f"{digest}.json"


def load_accounts() -> dict[str, Any]:
    DATA_DIR.mkdir(exist_ok=True)
    if not ACCOUNTS_PATH.exists():
        return {}

    try:
        with ACCOUNTS_PATH.open("r", encoding="utf-8") as file:
            return json.load(file)
    except (json.JSONDecodeError, OSError):
        return {}


def save_accounts(accounts: dict[str, Any]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    with ACCOUNTS_PATH.open("w", encoding="utf-8") as file:
        json.dump(accounts, file, ensure_ascii=False, indent=2)


def hash_password(password: str, salt: str) -> str:
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        120_000,
    )
    return digest.hex()


def create_account(username: str, password: str) -> tuple[bool, str]:
    username = normalize_username(username)
    if len(username) < 3:
        return False, "用户名至少需要 3 个字符。"
    if len(password) < 6:
        return False, "密码至少需要 6 个字符。"

    accounts = load_accounts()
    if username in accounts:
        return False, "这个用户名已经存在，请直接登录或换一个用户名。"

    salt = secrets.token_hex(16)
    accounts[username] = {
        "salt": salt,
        "password_hash": hash_password(password, salt),
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    save_accounts(accounts)
    return True, username


def authenticate(username: str, password: str) -> bool:
    username = normalize_username(username)
    account = load_accounts().get(username)
    if not account:
        return False

    expected_hash = account.get("password_hash", "")
    salt = account.get("salt", "")
    if not expected_hash or not salt:
        return False
    return secrets.compare_digest(hash_password(password, salt), expected_hash)


def render_auth_sidebar() -> str | None:
    current_user = st.session_state.get("auth_user")
    st.sidebar.title("账户")
    if current_user:
        st.sidebar.success(f"已登录：{current_user}")
        if st.sidebar.button("退出登录", use_container_width=True):
            st.session_state.pop("auth_user", None)
            st.rerun()
        return str(current_user)

    mode = st.sidebar.radio("账户操作", ["登录", "创建账户"])
    with st.sidebar.form("account_form"):
        username = st.text_input("用户名", placeholder="例如：mario2026")
        password = st.text_input("密码", type="password")
        submitted = st.form_submit_button(mode, use_container_width=True)

    if submitted:
        username = normalize_username(username)
        if mode == "创建账户":
            ok, message = create_account(username, password)
            if ok:
                st.session_state["auth_user"] = message
                st.rerun()
            st.sidebar.error(message)
        elif authenticate(username, password):
            st.session_state["auth_user"] = username
            st.rerun()
        else:
            st.sidebar.error("用户名或密码不正确。")

    st.sidebar.info("创建账户后，你的收藏、生词本和学习进度会和密码绑定。")
    return None


def load_state(state_path: Path) -> dict[str, Any]:
    DATA_DIR.mkdir(exist_ok=True)
    USERS_DIR.mkdir(exist_ok=True)
    if not state_path.exists():
        state = default_state()
        state["_state_path"] = str(state_path)
        return state

    try:
        with state_path.open("r", encoding="utf-8") as file:
            state = json.load(file)
    except (json.JSONDecodeError, OSError):
        state = default_state()
        state["_state_path"] = str(state_path)
        return state

    merged = default_state()
    merged.update({key: state.get(key, value) for key, value in merged.items()})
    merged["_state_path"] = str(state_path)
    return merged


def save_state(state: dict[str, Any]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    USERS_DIR.mkdir(exist_ok=True)
    state_path = Path(state.get("_state_path", STATE_PATH))
    public_state = {key: value for key, value in state.items() if not key.startswith("_")}
    with state_path.open("w", encoding="utf-8") as file:
        json.dump(public_state, file, ensure_ascii=False, indent=2)


def state_set(state: dict[str, Any], key: str) -> set[str]:
    return set(state.get(key, []))


def set_membership(state: dict[str, Any], key: str, word_id: str, enabled: bool) -> None:
    values = state_set(state, key)
    if enabled:
        values.add(word_id)
    else:
        values.discard(word_id)
    state[key] = sorted(values)
    save_state(state)


def mark_seen(state: dict[str, Any], word_id: str, result: str) -> None:
    stats = state.setdefault("stats", {})
    item = stats.setdefault(word_id, {"seen": 0, "known": 0, "unknown": 0, "last_seen": ""})
    item["seen"] = int(item.get("seen", 0)) + 1
    if result == "known":
        item["known"] = int(item.get("known", 0)) + 1
        set_membership(state, "learned", word_id, True)
        set_membership(state, "difficult", word_id, False)
    elif result == "unknown":
        item["unknown"] = int(item.get("unknown", 0)) + 1
        set_membership(state, "difficult", word_id, True)
    item["last_seen"] = datetime.now().isoformat(timespec="seconds")
    save_state(state)


def render_header() -> None:
    st.markdown('<div class="app-title">意大利驾照理论词汇</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="app-subtitle">按章节学习、闪卡复习、收藏重点词，并把所有进度保存在本地。</div>',
        unsafe_allow_html=True,
    )


def render_metrics(words: pd.DataFrame, state: dict[str, Any]) -> None:
    favorites = state_set(state, "favorites")
    difficult = state_set(state, "difficult")
    learned = state_set(state, "learned")
    total = len(words)
    progress = round(len(learned) / total * 100) if total else 0

    st.markdown(
        f"""
        <div class="metric-row">
            <div class="metric-card">
                <div class="metric-label">词汇总数</div>
                <div class="metric-value">{total}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">已掌握</div>
                <div class="metric-value">{len(learned)}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">生词本</div>
                <div class="metric-value">{len(difficult)}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">收藏</div>
                <div class="metric-value">{len(favorites)}</div>
            </div>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:{progress}%"></div></div>
        <div class="small-muted">总体掌握进度 {progress}%</div>
        """,
        unsafe_allow_html=True,
    )


def render_word_card(row: pd.Series, state: dict[str, Any], key_prefix: str) -> None:
    word_id = row["word_id"]
    favorites = state_set(state, "favorites")
    difficult = state_set(state, "difficult")
    learned = state_set(state, "learned")
    badges = []
    if word_id in learned:
        badges.append('<span class="badge">已掌握</span>')
    if word_id in difficult:
        badges.append('<span class="badge">生词</span>')
    if word_id in favorites:
        badges.append('<span class="badge">收藏</span>')
    example_html = ""
    if row["example_it"] or row["example_zh"]:
        example_html = f'<div class="example">{h(row["example_it"])}<br>{h(row["example_zh"])}</div>'
    note_html = ""
    if row["note"]:
        note_html = f'<div class="small-muted" style="margin-top:8px;">{h(row["note"])}</div>'

    st.markdown(
        f"""
        <div class="word-card">
            <div class="word-title">{h(row['italian'])}</div>
            <div class="word-translation">{h(row['chinese'])}</div>
            <div class="small-muted">{h(row['chapter'])}</div>
            {example_html}
            {note_html}
            <div class="badge-line">{''.join(badges)}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    col1, col2, col3 = st.columns(3)
    with col1:
        label = "取消收藏" if word_id in favorites else "收藏"
        if st.button(label, key=f"{key_prefix}-fav-{word_id}", use_container_width=True):
            set_membership(state, "favorites", word_id, word_id not in favorites)
            st.rerun()
    with col2:
        label = "移出生词本" if word_id in difficult else "加入生词本"
        if st.button(label, key=f"{key_prefix}-diff-{word_id}", use_container_width=True):
            set_membership(state, "difficult", word_id, word_id not in difficult)
            st.rerun()
    with col3:
        label = "标记未掌握" if word_id in learned else "标记掌握"
        if st.button(label, key=f"{key_prefix}-learn-{word_id}", use_container_width=True):
            set_membership(state, "learned", word_id, word_id not in learned)
            if word_id not in learned:
                set_membership(state, "difficult", word_id, False)
            st.rerun()


def render_home(words: pd.DataFrame, state: dict[str, Any]) -> None:
    render_header()
    render_metrics(words, state)
    st.subheader("章节")

    learned = state_set(state, "learned")
    chapter_html = ['<div class="chapter-grid">']
    for chapter, chapter_words in words.groupby("chapter", sort=False):
        total = len(chapter_words)
        learned_count = sum(word_id in learned for word_id in chapter_words["word_id"])
        progress = round(learned_count / total * 100) if total else 0
        sample = "、".join(chapter_words["italian"].head(3))
        chapter_html.append(
            f"""
            <div class="chapter-card">
                <div class="chapter-topline">
                    <div class="chapter-name">{h(chapter)}</div>
                    <span class="pill">{total} 词</span>
                </div>
                <div class="small-muted">{h(sample)}</div>
                <div class="progress-track"><div class="progress-fill" style="width:{progress}%"></div></div>
                <div class="small-muted">已掌握 {learned_count}/{total}</div>
            </div>
            """
        )
    chapter_html.append("</div>")
    st.markdown("".join(chapter_html), unsafe_allow_html=True)
    st.info("从左侧切换到“章节学习”可进入具体章节。")


def render_chapter(words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.header("章节学习")
    chapters = list(words["chapter"].drop_duplicates())
    selected = st.selectbox("选择章节", chapters)
    chapter_words = words[words["chapter"] == selected]
    st.caption(f"{selected} · {len(chapter_words)} 个词")

    for _, row in chapter_words.iterrows():
        render_word_card(row, state, "chapter")


def get_flash_pool(words: pd.DataFrame, state: dict[str, Any], chapter: str, source: str) -> pd.DataFrame:
    pool = words if chapter == "全部章节" else words[words["chapter"] == chapter]
    if source == "只看生词":
        pool = pool[pool["word_id"].isin(state_set(state, "difficult"))]
    elif source == "只看收藏":
        pool = pool[pool["word_id"].isin(state_set(state, "favorites"))]
    elif source == "未掌握优先":
        learned = state_set(state, "learned")
        unlearned = pool[~pool["word_id"].isin(learned)]
        pool = unlearned if not unlearned.empty else pool
    return pool.reset_index(drop=True)


def render_flashcards(words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.header("闪卡模式")
    col1, col2 = st.columns([2, 1])
    with col1:
        chapter = st.selectbox("练习范围", ["全部章节", *list(words["chapter"].drop_duplicates())])
    with col2:
        source = st.selectbox("词卡来源", ["未掌握优先", "全部单词", "只看生词", "只看收藏"])

    pool = get_flash_pool(words, state, chapter, source)
    if pool.empty:
        st.warning("这个范围里暂时没有词。可以先去章节里加入生词或收藏。")
        return

    session_key = f"flash_index::{chapter}::{source}"
    reveal_key = f"flash_reveal::{chapter}::{source}"
    st.session_state.setdefault(session_key, 0)
    st.session_state.setdefault(reveal_key, False)
    if st.session_state[session_key] >= len(pool):
        st.session_state[session_key] = 0

    index = st.session_state[session_key]
    row = pool.iloc[index]
    progress_text = f"{index + 1}/{len(pool)}"
    if st.session_state[reveal_key]:
        answer_html = (
            f'<div class="flash-chinese">{h(row["chinese"])}</div>'
            f'<div class="example">{h(row["example_it"])}<br>{h(row["example_zh"])}</div>'
        )
    else:
        answer_html = '<div class="small-muted">先在心里作答，再翻开答案</div>'

    st.markdown(
        f"""
        <div class="flash-card">
            <div class="small-muted">{h(row['chapter'])} · {progress_text}</div>
            <div class="flash-word">{h(row['italian'])}</div>
            <div class="small-muted">{h(row['pronunciation'])}</div>
            {answer_html}
        </div>
        """,
        unsafe_allow_html=True,
    )

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        if st.button("显示答案", type="primary", use_container_width=True):
            st.session_state[reveal_key] = True
            st.rerun()
    with col2:
        if st.button("认识", use_container_width=True):
            mark_seen(state, row["word_id"], "known")
            st.session_state[session_key] = (index + 1) % len(pool)
            st.session_state[reveal_key] = False
            st.rerun()
    with col3:
        if st.button("不熟", use_container_width=True):
            mark_seen(state, row["word_id"], "unknown")
            st.session_state[session_key] = (index + 1) % len(pool)
            st.session_state[reveal_key] = False
            st.rerun()
    with col4:
        if st.button("下一张", use_container_width=True):
            st.session_state[session_key] = (index + 1) % len(pool)
            st.session_state[reveal_key] = False
            st.rerun()


def render_collection(words: pd.DataFrame, state: dict[str, Any], kind: str) -> None:
    title = "生词本" if kind == "difficult" else "收藏夹"
    st.header(title)
    ids = state_set(state, kind)
    items = words[words["word_id"].isin(ids)]
    if items.empty:
        st.info(f"{title} 还是空的。")
        return

    for _, row in items.iterrows():
        render_word_card(row, state, kind)


def render_search(words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.header("搜索单词")
    query = st.text_input("输入意大利语、中文、例句或章节关键词", placeholder="例如: precedenza / 优先 / 标志")
    if not query.strip():
        st.caption("输入关键词后会实时搜索 words.csv。")
        return

    normalized = query.strip().lower()
    searchable_columns = ["chapter", "italian", "chinese", "example_it", "example_zh", "note"]
    mask = pd.Series(False, index=words.index)
    for column in searchable_columns:
        mask = mask | words[column].astype(str).str.lower().str.contains(normalized, regex=False)

    results = words[mask]
    st.caption(f"找到 {len(results)} 个结果")
    if results.empty:
        st.warning("没有匹配结果。")
        return

    for _, row in results.iterrows():
        render_word_card(row, state, "search")


def main() -> None:
    apply_theme()
    words = load_words()

    username = render_auth_sidebar()
    if not username:
        render_header()
        st.info("请先在左侧登录或创建账户。登录后会自动读取你的收藏、生词本和学习进度。")
        return

    state_path = state_path_for_user(username)
    state = load_state(state_path)
    state["username"] = username

    st.sidebar.title("学习")
    page = st.sidebar.radio(
        "导航",
        ["首页", "章节学习", "闪卡模式", "生词本", "收藏夹", "搜索"],
        label_visibility="collapsed",
    )
    st.sidebar.divider()
    st.sidebar.caption(f"词库：{WORDS_PATH.name}")
    st.sidebar.caption(f"当前账户：{username}")
    st.sidebar.caption(f"进度文件：{state_path.relative_to(BASE_DIR)}")

    if page == "首页":
        render_home(words, state)
    elif page == "章节学习":
        render_chapter(words, state)
    elif page == "闪卡模式":
        render_flashcards(words, state)
    elif page == "生词本":
        render_collection(words, state, "difficult")
    elif page == "收藏夹":
        render_collection(words, state, "favorites")
    elif page == "搜索":
        render_search(words, state)


if __name__ == "__main__":
    main()
