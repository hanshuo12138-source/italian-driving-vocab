# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import hashlib
import os
import re
import secrets
import shutil
import sqlite3
from html import escape, unescape
from datetime import datetime
from pathlib import Path
from textwrap import dedent
from typing import Any

import pandas as pd
import streamlit as st

from i18n import LANGUAGE_OPTIONS, t
from db import (
    create_user,
    create_persistence_marker,
    delete_persistence_marker,
    get_analytics_summary,
    get_due_review_word_ids,
    get_persistence_markers,
    get_user_role,
    init_db,
    log_app_event,
    load_user_state,
    record_flashcard_result,
    record_review_result,
    schedule_initial_review,
    save_user_state,
    set_user_role,
    set_word_membership,
    update_user_password,
    user_exists,
    verify_user_password,
)


BASE_DIR = Path(__file__).resolve().parent
WORDS_PATH = BASE_DIR / "words.csv"
ADS_PATH = BASE_DIR / "ads.json"
DOCS_DIR = BASE_DIR / "docs"
PRIVACY_POLICY_PATH = DOCS_DIR / "PRIVACY_POLICY.md"
TERMS_OF_SERVICE_PATH = DOCS_DIR / "TERMS_OF_SERVICE.md"
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "app.db"
DB_EXISTED_BEFORE_INIT = DB_PATH.exists()
STATE_PATH = DATA_DIR / "user_state.json"
USERS_DIR = DATA_DIR / "users"
ACCOUNTS_PATH = DATA_DIR / "accounts.json"
ADMIN_LOG_PATH = DATA_DIR / "admin_logs.jsonl"
VALID_ROLES = {"user", "admin", "super_admin"}

REQUIRED_COLUMNS = {"chapter", "italian", "chinese"}
OPTIONAL_COLUMNS = [
    "pronunciation",
    "example_it",
    "example_zh",
    "note",
    "image",
    "source_name",
    "source_url",
    "license_note",
    "copyright_status",
    "word_id",
]
ADMIN_WORDS_REQUIRED_COLUMNS = [
    "chapter",
    "italian",
    "chinese",
    "pronunciation",
    "example_it",
    "example_zh",
    "note",
    "image",
    "word_id",
]


st.set_page_config(
    page_title="意大利驾照理论词汇",
    page_icon="🚘",
    layout="wide",
    initial_sidebar_state="expanded",
)


def apply_theme() -> None:
    st.markdown(
        dedent("""
        <style>
        :root {
            --bg: #f3f6f3;
            --panel: #fffefa;
            --panel-soft: #f8faf6;
            --ink: #16211f;
            --muted: #60706c;
            --line: #dfe6df;
            --line-strong: #c9d6cf;
            --blue: #3769d6;
            --teal: #197c68;
            --coral: #c85a42;
            --amber: #b98518;
            --sidebar: #111b18;
            --sidebar-soft: #1b2a25;
        }

        .stApp {
            background:
                linear-gradient(180deg, #e7f0eb 0, #f3f6f3 320px, #f8faf6 100%);
            color: var(--ink);
        }

        .main .block-container {
            max-width: 1180px;
            padding-top: 34px;
            padding-bottom: 56px;
        }

        [data-testid="stSidebar"] {
            background: linear-gradient(180deg, var(--sidebar) 0, #16221f 58%, #101715 100%);
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 18px 0 45px rgba(22, 33, 31, 0.18);
        }

        [data-testid="stSidebar"] * {
            color: #eaf4f0;
        }

        [data-testid="stSidebar"] h1,
        [data-testid="stSidebar"] h2,
        [data-testid="stSidebar"] h3,
        [data-testid="stSidebar"] label,
        [data-testid="stSidebar"] p,
        [data-testid="stSidebar"] span,
        [data-testid="stSidebar"] div[data-testid="stMarkdownContainer"] {
            color: #eaf4f0;
        }

        [data-testid="stSidebar"] small,
        [data-testid="stSidebar"] [data-testid="stCaptionContainer"],
        [data-testid="stSidebar"] [data-testid="stCaptionContainer"] * {
            color: #b8c8c1;
        }

        [data-testid="stSidebar"] input,
        [data-testid="stSidebar"] textarea,
        [data-testid="stSidebar"] div[data-baseweb="input"] input {
            background: #ffffff;
            color: #0f241e !important;
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 8px;
        }

        [data-testid="stSidebar"] input::placeholder,
        [data-testid="stSidebar"] textarea::placeholder {
            color: #7a8a83 !important;
            opacity: 1;
        }

        [data-testid="stSidebar"] [data-testid="stCheckbox"] label,
        [data-testid="stSidebar"] [data-testid="stCheckbox"] label *,
        [data-testid="stSidebar"] [data-testid="stRadio"] label,
        [data-testid="stSidebar"] [data-testid="stRadio"] label * {
            color: #eaf4f0 !important;
        }

        [data-testid="stSidebar"] [data-testid="stCheckbox"] span,
        [data-testid="stSidebar"] [data-testid="stRadio"] span {
            color: #eaf4f0 !important;
        }

        [data-testid="stSidebar"] [data-testid="stSelectbox"] label,
        [data-testid="stSidebar"] [data-testid="stSelectbox"] label * {
            color: #eaf4f0 !important;
        }

        [data-testid="stSidebar"] [data-testid="stSelectbox"] div[data-baseweb="select"],
        [data-testid="stSidebar"] [data-testid="stSelectbox"] div[data-baseweb="select"] * {
            color: #0f241e !important;
        }

        [data-testid="stSidebar"] [data-testid="stSelectbox"] div[data-baseweb="select"] > div {
            background: #ffffff;
            border-color: rgba(255, 255, 255, 0.25);
        }

        [data-testid="stSidebar"] details,
        [data-testid="stSidebar"] details summary,
        [data-testid="stSidebar"] details summary *,
        [data-testid="stSidebar"] [data-testid="stExpander"],
        [data-testid="stSidebar"] [data-testid="stExpander"] * {
            color: #eaf4f0 !important;
        }

        [data-testid="stSidebar"] div[data-testid="stForm"] {
            background: var(--sidebar-soft);
            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 8px;
            padding: 14px 12px 12px;
        }

        [data-testid="stSidebar"] div[data-testid="stAlert"] {
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        [data-testid="stSidebar"] div[data-testid="stButton"] > button,
        [data-testid="stSidebar"] div[data-testid="stFormSubmitButton"] > button {
            background: #f4f7f5;
            color: #0f241e !important;
            border: 1px solid rgba(255, 255, 255, 0.24);
            border-radius: 8px;
            box-shadow: none;
        }

        [data-testid="stSidebar"] div[data-testid="stButton"] > button *,
        [data-testid="stSidebar"] div[data-testid="stFormSubmitButton"] > button * {
            color: #0f241e !important;
        }

        [data-testid="stSidebar"] div[data-testid="stButton"] > button:hover,
        [data-testid="stSidebar"] div[data-testid="stFormSubmitButton"] > button:hover {
            background: #ffffff;
            color: #0f241e !important;
            border-color: rgba(255, 255, 255, 0.42);
        }

        [data-testid="stSidebar"] div[data-testid="stButton"] > button:hover *,
        [data-testid="stSidebar"] div[data-testid="stFormSubmitButton"] > button:hover * {
            color: #0f241e !important;
        }

        [data-testid="stSidebar"] div[data-testid="stButton"] > button:disabled,
        [data-testid="stSidebar"] div[data-testid="stFormSubmitButton"] > button:disabled,
        [data-testid="stSidebar"] button:disabled {
            background: rgba(255, 255, 255, 0.18) !important;
            color: rgba(255, 255, 255, 0.65) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            opacity: 1 !important;
        }

        [data-testid="stSidebar"] div[data-testid="stButton"] > button:disabled *,
        [data-testid="stSidebar"] div[data-testid="stFormSubmitButton"] > button:disabled *,
        [data-testid="stSidebar"] button:disabled * {
            color: rgba(255, 255, 255, 0.65) !important;
        }

        [data-testid="stSidebar"] hr {
            border-color: rgba(255, 255, 255, 0.10);
        }

        [data-testid="stSidebar"] .logged-in-sidebar-marker {
            display: none;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stSelectbox"] {
            margin-bottom: 2px;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stSelectbox"] label {
            font-size: 0.76rem;
            margin-bottom: 0;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stSelectbox"] div[data-baseweb="select"] > div {
            min-height: 34px;
            padding-top: 1px;
            padding-bottom: 1px;
        }

        [data-testid="stSidebar"] .compact-account-title {
            margin: 8px 0 5px;
            color: #cfe0d9;
            font-size: 0.82rem;
            font-weight: 800;
            letter-spacing: 0.02em;
        }

        [data-testid="stSidebar"] .compact-login-card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.13);
            border-radius: 8px;
            padding: 7px 9px;
            margin-bottom: 6px;
            color: #dcebe5;
            font-size: 0.82rem;
            line-height: 1.35;
        }

        [data-testid="stSidebar"] .compact-login-card strong {
            color: #ffffff;
            font-weight: 800;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stExpander"] {
            margin: 2px 0 4px;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) details summary {
            min-height: 30px;
            padding: 4px 6px;
            font-size: 0.84rem;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) div[data-testid="stButton"] > button {
            min-height: 32px;
            padding: 5px 10px;
            font-size: 0.84rem;
        }

        [data-testid="stSidebar"] .learning-nav-title {
            margin: 18px 0 10px;
            padding-top: 4px;
            color: #f5fbff;
            font-size: 1.18rem;
            font-weight: 800;
            letter-spacing: 0;
        }

        [data-testid="stSidebar"] .learning-nav-title::after {
            content: "";
            display: block;
            width: 44px;
            height: 3px;
            margin-top: 7px;
            border-radius: 999px;
            background: #2f6bff;
            box-shadow: 0 0 16px rgba(47, 107, 255, 0.48);
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stRadio"] div[role="radiogroup"] {
            display: flex;
            flex-direction: column;
            gap: 7px;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stRadio"] label {
            width: 100%;
            min-height: 40px;
            background: rgba(255, 255, 255, 0.045);
            border: 1px solid rgba(255, 255, 255, 0.075);
            border-radius: 11px;
            padding: 10px 12px;
            color: #c9d6e8 !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
            transition: background 120ms ease, border-color 120ms ease, transform 120ms ease, box-shadow 120ms ease;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stRadio"] label:hover {
            background: rgba(255, 255, 255, 0.085);
            border-color: rgba(147, 184, 255, 0.32);
            transform: translateY(-1px);
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stRadio"] label:has(input:checked) {
            background: #2f5bff;
            border-color: rgba(153, 184, 255, 0.85);
            box-shadow: inset 4px 0 0 #8fb3ff, 0 12px 24px rgba(47, 91, 255, 0.24);
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stRadio"] label > div:first-child,
        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stRadio"] label input {
            display: none;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stRadio"] label * {
            color: #c9d6e8 !important;
            font-weight: 700;
            line-height: 1.18;
        }

        [data-testid="stSidebar"]:has(.logged-in-sidebar-marker) [data-testid="stRadio"] label:has(input:checked) * {
            color: #ffffff !important;
            font-weight: 820;
        }

        h1, h2, h3, .stMarkdown h1, .stMarkdown h2, .stMarkdown h3 {
            color: var(--ink);
            letter-spacing: 0;
        }

        .hero-panel {
            position: relative;
            overflow: hidden;
            background:
                linear-gradient(135deg, #132520 0%, #1d3d35 48%, #2c426c 100%);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 8px;
            padding: 28px;
            box-shadow: 0 24px 70px rgba(22, 33, 31, 0.22);
            margin-bottom: 18px;
        }

        .hero-panel::after {
            content: "";
            position: absolute;
            inset: auto 0 0 0;
            height: 5px;
            background: linear-gradient(90deg, var(--teal), var(--amber), var(--coral), var(--blue));
        }

        .hero-kicker {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #cde8dc;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.02em;
            margin-bottom: 10px;
        }

        .hero-kicker::before {
            content: "";
            width: 24px;
            height: 2px;
            background: var(--amber);
            border-radius: 999px;
        }

        .app-title {
            color: #f8fbf7;
            font-size: 34px;
            line-height: 1.2;
            font-weight: 900;
            letter-spacing: 0;
            margin: 0 0 8px;
        }

        .app-subtitle {
            color: rgba(248, 251, 247, 0.76);
            font-size: 15px;
            max-width: 680px;
            margin: 0;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 24px 0 14px;
            color: var(--ink);
            font-size: 21px;
            font-weight: 900;
        }

        .section-title::before {
            content: "";
            width: 7px;
            height: 22px;
            border-radius: 999px;
            background: linear-gradient(180deg, var(--teal), var(--blue));
        }

        .metric-row {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
            margin: 18px 0 20px;
        }

        .metric-card,
        .chapter-card,
        .word-card,
        .flash-card {
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: 8px;
            box-shadow: 0 16px 38px rgba(22, 33, 31, 0.08);
        }

        .metric-card {
            position: relative;
            overflow: hidden;
            padding: 16px 17px;
        }

        .metric-card::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: var(--teal);
        }

        .metric-card:nth-child(2)::before {
            background: var(--blue);
        }

        .metric-card:nth-child(3)::before {
            background: var(--coral);
        }

        .metric-card:nth-child(4)::before {
            background: var(--amber);
        }

        .metric-label {
            color: var(--muted);
            font-size: 13px;
            margin-bottom: 4px;
        }

        .metric-value {
            color: var(--ink);
            font-size: 28px;
            font-weight: 900;
        }

        .chapter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
        }

        .chapter-card {
            position: relative;
            overflow: hidden;
            padding: 19px;
            min-height: 158px;
            transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }

        .chapter-card:hover {
            transform: translateY(-2px);
            border-color: var(--line-strong);
            box-shadow: 0 22px 48px rgba(22, 33, 31, 0.13);
        }

        .chapter-card::after {
            content: "";
            position: absolute;
            right: 0;
            top: 0;
            width: 72px;
            height: 100%;
            background: linear-gradient(180deg, rgba(55, 105, 214, 0.08), rgba(25, 124, 104, 0.08));
        }

        .chapter-topline {
            position: relative;
            z-index: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .chapter-name {
            font-size: 18px;
            font-weight: 900;
        }

        .pill {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 12px;
            font-weight: 800;
            background: #eaf3ef;
            color: var(--teal);
            white-space: nowrap;
        }

        .small-muted {
            color: var(--muted);
            font-size: 13px;
        }

        .progress-track {
            height: 9px;
            border-radius: 999px;
            background: #e6ece6;
            overflow: hidden;
            margin: 16px 0 8px;
            border: 1px solid rgba(22, 33, 31, 0.04);
        }

        .progress-fill {
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, var(--teal), var(--blue), var(--amber));
        }

        .word-card {
            padding: 18px 18px 16px;
            margin-bottom: 13px;
            border-left: 4px solid var(--teal);
            transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .word-card:hover {
            border-color: var(--blue);
            box-shadow: 0 20px 44px rgba(22, 33, 31, 0.11);
        }

        .word-title {
            font-size: 22px;
            font-weight: 900;
            margin-bottom: 4px;
        }

        .word-layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 104px;
            gap: 16px;
            align-items: start;
        }

        .sign-image {
            width: 96px;
            height: 96px;
            object-fit: contain;
            background: #ffffff;
            border: 1px solid var(--line);
            border-radius: 8px;
            padding: 8px;
            box-shadow: inset 0 0 0 1px rgba(22, 33, 31, 0.03);
        }

        .word-translation {
            color: #2b3b38;
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 8px;
        }

        .example {
            color: var(--muted);
            background: var(--panel-soft);
            border-left: 3px solid var(--blue);
            border-radius: 0 8px 8px 0;
            padding: 10px 12px;
            margin-top: 10px;
            font-size: 14px;
        }

        .flash-card {
            position: relative;
            overflow: hidden;
            padding: 42px 28px;
            min-height: 360px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background:
                linear-gradient(160deg, #fffefa 0%, #f6fbf7 56%, #edf5fb 100%);
            border: 1px solid var(--line-strong);
        }

        .flash-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--teal), var(--amber), var(--coral), var(--blue));
        }

        .flash-word {
            color: var(--ink);
            font-size: 48px;
            line-height: 1.15;
            font-weight: 900;
            margin-bottom: 10px;
        }

        .flash-image {
            width: 132px;
            height: 132px;
            object-fit: contain;
            background: #ffffff;
            border: 1px solid var(--line);
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 16px;
        }

        .flash-chinese {
            font-size: 29px;
            font-weight: 900;
            color: var(--teal);
            margin: 12px 0 6px;
        }

        .badge-line {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 10px;
        }

        .badge {
            border: 1px solid #d9e4dd;
            border-radius: 999px;
            padding: 3px 8px;
            color: #37534c;
            font-size: 12px;
            font-weight: 800;
            background: #f2f7f3;
        }

        div[data-testid="stButton"] > button {
            border-radius: 8px;
            border: 1px solid #c9d6cf;
            background: #fffefa;
            color: var(--ink);
            font-weight: 800;
            min-height: 40px;
            box-shadow: 0 8px 18px rgba(22, 33, 31, 0.06);
        }

        div[data-testid="stButton"] > button[kind="primary"] {
            background: linear-gradient(135deg, var(--teal), var(--blue));
            border-color: transparent;
            color: #ffffff;
        }

        div[data-baseweb="select"] > div,
        div[data-testid="stTextInput"] input {
            border-radius: 8px;
            border-color: var(--line-strong);
        }

        div[data-testid="stAlert"] {
            border-radius: 8px;
        }

        @media (max-width: 760px) {
            .main .block-container {
                padding-top: 22px;
            }

            .hero-panel {
                padding: 22px 18px;
            }

            .app-title {
                font-size: 28px;
            }

            .metric-row {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .flash-word {
                font-size: 34px;
            }

            .flash-chinese {
                font-size: 23px;
            }

            .word-layout {
                grid-template-columns: minmax(0, 1fr);
            }

            .sign-image {
                width: 88px;
                height: 88px;
            }
        }
        </style>
        """),
        unsafe_allow_html=True,
    )


def make_legacy_word_id(row: pd.Series) -> str:
    return f"{row['chapter']}::{row['italian']}".strip().lower()


HTML_RESIDUAL_PATTERN = re.compile(r"</?(?:div|span)(?:\s+[^>]*)?>", re.IGNORECASE)


def clean_display_text(value: Any) -> str:
    text = str(value or "")
    for _ in range(2):
        text = unescape(text)
    return HTML_RESIDUAL_PATTERN.sub("", text).strip()


def h(value: Any) -> str:
    return escape(clean_display_text(value), quote=True)


def image_src(value: Any) -> str:
    src = clean_display_text(value)
    if not src or "<" in src or ">" in src:
        return ""
    lowered = src.lower()
    if lowered.startswith(("http://", "https://", "assets/", "images/")):
        return src
    return ""


def render_html(html: str) -> None:
    if hasattr(st, "html"):
        st.html(html)
    else:
        st.markdown(html, unsafe_allow_html=True)


def parse_date(value: Any) -> datetime.date | None:
    text = str(value or "").strip()
    if not text:
        return None
    try:
        return datetime.fromisoformat(text).date()
    except ValueError:
        return None


def current_language() -> str:
    language = str(st.session_state.get("language", "zh"))
    return language if language in LANGUAGE_OPTIONS else "zh"


def tr(key: str, **kwargs: Any) -> str:
    text = t(key, current_language())
    return text.format(**kwargs) if kwargs else text


def render_language_selector() -> None:
    st.session_state.setdefault("language", "zh")
    labels = {code: label for code, label in LANGUAGE_OPTIONS.items()}
    selected_label = st.sidebar.selectbox(
        tr("language"),
        list(labels.values()),
        index=list(labels).index(current_language()),
    )
    for code, label in labels.items():
        if label == selected_label:
            st.session_state["language"] = code
            break


CSV_ENCODING_FALLBACKS = ("utf-8-sig", "utf-8", "gb18030", "gbk", "latin1")


def read_csv_with_fallback(source: Any) -> tuple[pd.DataFrame, str]:
    last_error: Exception | None = None
    for encoding in CSV_ENCODING_FALLBACKS:
        try:
            if hasattr(source, "seek"):
                source.seek(0)
            return pd.read_csv(source, encoding=encoding), encoding
        except UnicodeDecodeError as exc:
            last_error = exc
        except Exception as exc:
            last_error = exc
            if encoding == CSV_ENCODING_FALLBACKS[-1]:
                break
    raise RuntimeError(str(last_error) if last_error else "unknown CSV decoding error")


@st.cache_data(show_spinner=False)
def load_words() -> pd.DataFrame:
    if not WORDS_PATH.exists():
        st.error(tr("words_missing"))
        st.stop()

    try:
        words, encoding = read_csv_with_fallback(WORDS_PATH)
    except Exception as exc:
        st.error("词库文件读取失败，请检查 words.csv 编码。")
        st.caption(f"最后错误：{exc}")
        st.stop()
    if encoding == "latin1":
        st.warning("words.csv 使用 latin1 兜底编码读取成功，建议后续统一转换为 UTF-8。")
    words = words.fillna("")
    words.columns = [column.strip() for column in words.columns]
    missing = REQUIRED_COLUMNS - set(words.columns)
    if missing:
        st.error(tr("words_missing_columns", columns=", ".join(sorted(missing))))
        st.stop()

    for column in OPTIONAL_COLUMNS:
        if column not in words.columns:
            words[column] = ""

    words["chapter"] = words["chapter"].astype(str).str.strip()
    words["italian"] = words["italian"].astype(str).str.strip()
    words["chinese"] = words["chinese"].astype(str).str.strip()
    words = words[(words["chapter"] != "") & (words["italian"] != "")]
    words["legacy_word_id"] = words.apply(make_legacy_word_id, axis=1)
    words["word_id"] = words["word_id"].astype(str).str.strip()
    missing_word_id = words["word_id"] == ""
    words.loc[missing_word_id, "word_id"] = words.loc[missing_word_id, "legacy_word_id"]
    return words.reset_index(drop=True)


@st.cache_data(show_spinner=False)
def load_ads() -> list[dict[str, Any]]:
    if not ADS_PATH.exists():
        return []

    try:
        with ADS_PATH.open("r", encoding="utf-8") as file:
            ads = json.load(file)
    except (json.JSONDecodeError, OSError):
        return []

    if not isinstance(ads, list):
        return []
    return [ad for ad in ads if isinstance(ad, dict)]


def ad_is_active(ad: dict[str, Any]) -> bool:
    if ad.get("active") is not True:
        return False

    today = datetime.now().date()
    start_date = parse_date(ad.get("start_date"))
    end_date = parse_date(ad.get("end_date"))
    if start_date and today < start_date:
        return False
    if end_date and today > end_date:
        return False
    return True


def active_ads_for_slot(slot_name: str) -> list[dict[str, Any]]:
    return [
        ad for ad in load_ads()
        if str(ad.get("slot", "")).strip() == slot_name and ad_is_active(ad)
    ]


def show_ad(slot_name: str) -> None:
    ads = active_ads_for_slot(slot_name)
    if not ads:
        return

    ad = ads[0]
    ad_id = str(ad.get("id", "")).strip()
    title = str(ad.get("title", "")).strip()
    description = str(ad.get("description", "")).strip()
    image = str(ad.get("image", "")).strip()
    link = str(ad.get("link", "")).strip()
    category = str(ad.get("category", "")).strip()
    username = str(st.session_state.get("auth_user", "")) or None

    view_key = f"ad_view::{slot_name}::{ad_id}"
    if ad_id and not st.session_state.get(view_key):
        safe_log_event(
            "ad_view",
            username=username,
            detail={"slot": slot_name, "ad_id": ad_id, "category": category},
        )
        st.session_state[view_key] = True

    with st.container():
        render_html(
            dedent(f"""
            <div class="word-card" style="padding:14px;margin-top:14px;">
                <div class="small-muted">{h(tr("ad_label"))}</div>
                <div class="word-title" style="font-size:18px;">{h(title)}</div>
                <div class="small-muted">{h(description)}</div>
            </div>
            """)
        )
        if image:
            st.image(image, use_container_width=True)
        if link:
            if st.button(tr("ad_more"), key=f"ad-click-{slot_name}-{ad_id}", use_container_width=True):
                safe_log_event(
                    "ad_click",
                    username=username,
                    detail={"slot": slot_name, "ad_id": ad_id, "category": category},
                )
                st.session_state[f"ad_link_ready::{slot_name}::{ad_id}"] = True
            if st.session_state.get(f"ad_link_ready::{slot_name}::{ad_id}"):
                st.link_button(tr("ad_open_link"), link, use_container_width=True)


def default_state() -> dict[str, Any]:
    return {
        "favorites": [],
        "difficult": [],
        "learned": [],
        "wrong": [],
        "stats": {},
    }


def normalize_username(username: str) -> str:
    return username.strip().lower()


def configured_admin_username() -> str:
    username = os.environ.get("ADMIN_USERNAME", "")
    if not username:
        try:
            username = st.secrets.get("ADMIN_USERNAME", "")
        except Exception:
            username = ""
    return normalize_username(str(username))


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


def account_role(username: str) -> str:
    username = normalize_username(username)
    if username and username == configured_admin_username():
        return "super_admin"

    return get_user_role(username)


def set_configured_admin_role(username: str) -> None:
    username = normalize_username(username)
    if not username or username != configured_admin_username():
        return

    if user_exists(username) and get_user_role(username) != "super_admin":
        set_user_role(username, "super_admin")


def is_admin(username: str) -> bool:
    return account_role(username) in {"admin", "super_admin"}


def current_user_is_admin() -> bool:
    return is_admin(str(st.session_state.get("auth_user", "")))


def require_admin() -> str:
    username = str(st.session_state.get("auth_user", ""))
    if not is_admin(username):
        st.error(tr("admin_denied"))
        st.stop()
    return normalize_username(username)


def log_admin_action(username: str, action: str, detail: str) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    entry = {
        "username": normalize_username(username),
        "role": account_role(username),
        "action": action,
        "detail": detail,
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    with ADMIN_LOG_PATH.open("a", encoding="utf-8") as file:
        file.write(json.dumps(entry, ensure_ascii=False) + "\n")


def safe_log_event(
    event_type: str,
    username: str | None = None,
    detail: dict[str, Any] | None = None,
) -> None:
    try:
        log_app_event(event_type, username=username, detail=detail)
    except Exception:
        return


def hash_password(password: str, salt: str) -> str:
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        120_000,
    )
    return digest.hex()


def remember_token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def save_remember_token(username: str) -> str:
    username = normalize_username(username)
    accounts = load_accounts()
    account = accounts.get(username)
    if not account:
        if not user_exists(username):
            return ""
        account = {"remember_tokens": []}
        accounts[username] = account

    token = secrets.token_urlsafe(32)
    tokens = account.setdefault("remember_tokens", [])
    tokens.append(
        {
            "token_hash": remember_token_hash(token),
            "created_at": datetime.now().isoformat(timespec="seconds"),
        }
    )
    account["remember_tokens"] = tokens[-5:]
    save_accounts(accounts)
    return token


def revoke_remember_token(username: str, token: str) -> None:
    username = normalize_username(username)
    if not username or not token:
        return

    accounts = load_accounts()
    account = accounts.get(username)
    if not account:
        return

    token_hash = remember_token_hash(token)
    account["remember_tokens"] = [
        item for item in account.get("remember_tokens", []) if item.get("token_hash") != token_hash
    ]
    save_accounts(accounts)


def revoke_all_remember_tokens(username: str) -> None:
    username = normalize_username(username)
    if not username:
        return

    accounts = load_accounts()
    account = accounts.get(username)
    if not account:
        return

    account["remember_tokens"] = []
    save_accounts(accounts)


def authenticate_remember_token(username: str, token: str) -> bool:
    username = normalize_username(username)
    account = load_accounts().get(username)
    if not account or not token:
        return False

    token_hash = remember_token_hash(token)
    return any(
        secrets.compare_digest(item.get("token_hash", ""), token_hash)
        for item in account.get("remember_tokens", [])
    )


def create_account(username: str, password: str) -> tuple[bool, str]:
    username = normalize_username(username)
    if len(username) < 3:
        return False, tr("username_too_short")
    if len(password) < 6:
        return False, tr("password_too_short")
    if username == configured_admin_username():
        return False, tr("reserved_username")

    if user_exists(username):
        return False, tr("username_exists")

    if create_user(username, password, role="user"):
        safe_log_event("user_register", username=username)
        return True, username
    return False, tr("username_exists")


def authenticate(username: str, password: str) -> bool:
    username = normalize_username(username)
    ok = verify_user_password(username, password)
    if ok:
        set_configured_admin_role(username)
        safe_log_event("user_login", username=username)
    return ok


def query_param_value(key: str) -> str:
    value = st.query_params.get(key, "")
    if isinstance(value, list):
        return str(value[0]) if value else ""
    return str(value)


def restore_login_from_query() -> None:
    if st.session_state.get("auth_user"):
        return

    username = query_param_value("user")
    token = query_param_value("remember")
    if username and token and authenticate_remember_token(username, token):
        username = normalize_username(username)
        set_configured_admin_role(username)
        st.session_state["auth_user"] = username
        safe_log_event("user_login", username=username, detail={"method": "remember"})


def load_markdown_doc(filename: str) -> str:
    path = DOCS_DIR / filename
    try:
        resolved_path = path.resolve()
        resolved_path.relative_to(DOCS_DIR.resolve())
        if not resolved_path.exists():
            return "文档文件不存在，请联系管理员。"
        return resolved_path.read_text(encoding="utf-8")
    except Exception as exc:
        return f"暂时无法加载该文档，请稍后再试。错误信息：{exc}"


def render_legal_document(document: str) -> None:
    docs = {
        "privacy": PRIVACY_POLICY_PATH.name,
        "terms": TERMS_OF_SERVICE_PATH.name,
    }
    filename = docs.get(document)
    if not filename:
        st.warning(tr("legal_doc_missing"))
        return
    st.markdown(load_markdown_doc(filename))


def render_public_legal_links() -> None:
    st.sidebar.divider()
    st.sidebar.caption(tr("legal_documents"))
    if st.sidebar.button(tr("privacy_policy"), key="public_privacy_policy", use_container_width=True):
        st.session_state["public_legal_page"] = "privacy"
    if st.sidebar.button(tr("terms_of_service"), key="public_terms_of_service", use_container_width=True):
        st.session_state["public_legal_page"] = "terms"
    if st.session_state.get("public_legal_page") in {"privacy", "terms"}:
        if st.sidebar.button("返回登录/首页", key="public_legal_back", use_container_width=True):
            st.session_state.pop("public_legal_page", None)
            st.rerun()


def render_sidebar_author_note() -> None:
    st.sidebar.divider()
    st.sidebar.markdown(
        """
        <div style="
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 8px;
            padding: 14px 13px;
            margin-top: 4px;
            line-height: 1.62;
        ">
            <div style="font-weight: 700; color: #EAF4F0; margin-bottom: 8px;">联系邮箱</div>
            <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 14px;">hanshuo12138@gmail.com</div>
            <div style="font-weight: 700; color: #EAF4F0; margin-bottom: 8px;">作者的话</div>
            <div style="color: #DDE9E4; font-size: 0.92rem;">
                本程序是一个面向在意大利生活的外国人的驾照理论词汇学习工具，希望能帮助大家更轻松地理解意大利语考试词汇，提高备考效率。<br><br>
                目前项目仍处于测试阶段，现阶段免费开放使用。<br>
                如果你在使用过程中发现错误、显示问题，或者有任何改进建议，欢迎发送邮件告诉我。<br>
                感谢大家的支持与反馈，在下感激不尽！
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_change_password_form(username: str) -> None:
    with st.sidebar.expander(tr("change_password")):
        with st.form("change_password_form"):
            current_password = st.text_input(tr("current_password"), type="password")
            new_password = st.text_input(tr("new_password"), type="password")
            confirm_new_password = st.text_input(tr("confirm_new_password"), type="password")
            submitted = st.form_submit_button(tr("change_password_submit"), use_container_width=True)

        if not submitted:
            return

        if len(new_password) < 8:
            st.error(tr("new_password_too_short"))
            return
        if new_password != confirm_new_password:
            st.error(tr("new_password_mismatch"))
            return

        ok, reason = update_user_password(username, current_password, new_password)
        if ok:
            revoke_all_remember_tokens(username)
            safe_log_event(
                "password_changed",
                username=username,
                detail={"remember_tokens_cleared": True},
            )
            st.session_state["password_changed_notice"] = True
            st.query_params.clear()
            st.session_state.pop("auth_user", None)
            st.rerun()

        if reason == "same_password":
            st.error(tr("new_password_same"))
        elif reason == "invalid_current_password":
            st.error(tr("current_password_invalid"))
        else:
            st.error(tr("password_change_failed"))


def render_auth_sidebar() -> str | None:
    restore_login_from_query()
    current_user = st.session_state.get("auth_user")
    if current_user:
        st.sidebar.markdown('<div class="logged-in-sidebar-marker"></div>', unsafe_allow_html=True)
        st.sidebar.markdown(
            f"""
            <div class="compact-account-title">{escape(tr("account"))}</div>
            <div class="compact-login-card">
                已登录：<strong>{escape(str(current_user))}</strong>
            </div>
            """,
            unsafe_allow_html=True,
        )
        render_change_password_form(str(current_user))
        if st.sidebar.button(tr("logout"), use_container_width=True):
            revoke_remember_token(str(current_user), query_param_value("remember"))
            st.query_params.clear()
            st.session_state.pop("auth_user", None)
            st.rerun()
        return str(current_user)

    st.sidebar.title(tr("account"))
    auth_modes = {
        tr("login"): "login",
        tr("create_account"): "create_account",
    }
    if st.session_state.pop("password_changed_notice", False):
        st.sidebar.success(tr("password_change_success_relogin"))
    mode_label = st.sidebar.radio(tr("account_action"), list(auth_modes))
    with st.sidebar.form("account_form"):
        username = st.text_input(tr("username"), placeholder=tr("username_placeholder"))
        password = st.text_input(tr("password"), type="password")
        remember_me = st.checkbox(tr("remember_me"), value=True)
        terms_agreed = True
        if auth_modes[mode_label] == "create_account":
            terms_agreed = st.checkbox(tr("accept_terms_privacy"))
        submitted = st.form_submit_button(mode_label, use_container_width=True)

    if submitted:
        username = normalize_username(username)
        if auth_modes[mode_label] == "create_account":
            if not terms_agreed:
                st.sidebar.error(tr("terms_required"))
            else:
                ok, message = create_account(username, password)
                if ok:
                    st.session_state["auth_user"] = message
                    if remember_me:
                        token = save_remember_token(message)
                        if token:
                            st.query_params["user"] = message
                            st.query_params["remember"] = token
                    st.rerun()
                st.sidebar.error(message)
        elif authenticate(username, password):
            st.session_state["auth_user"] = username
            if remember_me:
                token = save_remember_token(username)
                if token:
                    st.query_params["user"] = username
                    st.query_params["remember"] = token
            else:
                st.query_params.clear()
            st.rerun()
        else:
            st.sidebar.error(tr("login_failed"))

    st.sidebar.info(tr("remember_tip"))
    render_public_legal_links()
    render_sidebar_author_note()
    return None


def load_state(username: str, state_path: Path) -> dict[str, Any]:
    state = load_user_state(username, legacy_state_path=state_path)
    merged = default_state()
    merged.update({key: state.get(key, value) for key, value in merged.items()})
    merged["_state_path"] = str(state_path)
    merged["username"] = normalize_username(username)
    return merged


def save_state(state: dict[str, Any]) -> None:
    username = normalize_username(str(state.get("username", "")))
    if username:
        save_user_state(username, state)


def state_set(state: dict[str, Any], key: str) -> set[str]:
    return set(state.get(key, []))


def legacy_word_id_maps(words: pd.DataFrame) -> tuple[dict[str, str], dict[str, str]]:
    legacy_to_stable: dict[str, str] = {}
    stable_to_legacy: dict[str, str] = {}
    if "legacy_word_id" not in words.columns:
        return legacy_to_stable, stable_to_legacy

    for _, row in words.iterrows():
        legacy_id = str(row.get("legacy_word_id", "")).strip()
        stable_id = str(row.get("word_id", "")).strip()
        if legacy_id and stable_id and legacy_id != stable_id:
            legacy_to_stable[legacy_id] = stable_id
            stable_to_legacy[stable_id] = legacy_id
    return legacy_to_stable, stable_to_legacy


def apply_legacy_word_id_compatibility(state: dict[str, Any], words: pd.DataFrame) -> dict[str, Any]:
    legacy_to_stable, stable_to_legacy = legacy_word_id_maps(words)
    if not legacy_to_stable:
        state["_word_id_to_legacy"] = {}
        return state

    for key in ["favorites", "difficult", "learned", "wrong"]:
        values = state_set(state, key)
        for legacy_id, stable_id in legacy_to_stable.items():
            if legacy_id in values:
                values.add(stable_id)
        state[key] = sorted(values)

    stats = state.get("stats", {})
    if isinstance(stats, dict):
        for legacy_id, stable_id in legacy_to_stable.items():
            if legacy_id in stats and stable_id not in stats:
                stats[stable_id] = stats[legacy_id]
        state["stats"] = stats

    state["_word_id_to_legacy"] = stable_to_legacy
    return state


def map_legacy_ids_to_stable(ids: list[str], words: pd.DataFrame) -> list[str]:
    legacy_to_stable, _ = legacy_word_id_maps(words)
    mapped = []
    for word_id in ids:
        mapped.append(legacy_to_stable.get(word_id, word_id))
    return sorted(set(mapped))


def set_membership(state: dict[str, Any], key: str, word_id: str, enabled: bool) -> None:
    values = state_set(state, key)
    related_ids = {word_id}
    legacy_id = dict(state.get("_word_id_to_legacy", {})).get(word_id)
    if legacy_id:
        related_ids.add(legacy_id)
    was_enabled = any(item in values for item in related_ids)
    if enabled:
        values.update(related_ids)
    else:
        for item in related_ids:
            values.discard(item)
    state[key] = sorted(values)
    for item in related_ids:
        set_word_membership(str(state.get("username", "")), key, item, enabled)
    if key in {"difficult", "wrong"} and enabled and not was_enabled:
        for item in related_ids:
            schedule_initial_review(str(state.get("username", "")), item)
    event_type = ""
    if key == "favorites":
        event_type = "favorite_add" if enabled else "favorite_remove"
    elif key == "difficult":
        event_type = "unknown_add" if enabled else "unknown_remove"
    if event_type and was_enabled != enabled:
        safe_log_event(
            event_type,
            username=str(state.get("username", "")),
            detail={"word_id": word_id},
        )


def mark_seen(
    state: dict[str, Any],
    word_id: str,
    result: str,
    italian: str = "",
) -> None:
    stats = state.setdefault("stats", {})
    item = stats.setdefault(word_id, {"seen": 0, "known": 0, "unknown": 0, "last_seen": ""})
    item["seen"] = int(item.get("seen", 0)) + 1
    if result == "known":
        item["known"] = int(item.get("known", 0)) + 1
        set_membership(state, "learned", word_id, True)
    elif result == "unknown":
        item["unknown"] = int(item.get("unknown", 0)) + 1
        set_membership(state, "wrong", word_id, True)
    item["last_seen"] = datetime.now().isoformat(timespec="seconds")
    record_flashcard_result(str(state.get("username", "")), word_id, result)
    if result in {"known", "unknown"}:
        safe_log_event(
            f"flashcard_{result}",
            username=str(state.get("username", "")),
            detail={"word_id": word_id, "italian": italian},
        )


def render_header() -> None:
    render_html(
        dedent(f"""
        <div class="hero-panel">
            <div class="hero-kicker">Patente B · Teoria</div>
            <div class="app-title">{h(tr("hero_title"))}</div>
            <div class="app-subtitle">{h(tr("hero_subtitle"))}</div>
        </div>
        """)
    )


def render_metrics(words: pd.DataFrame, state: dict[str, Any]) -> None:
    favorites = state_set(state, "favorites")
    difficult = state_set(state, "difficult")
    learned = state_set(state, "learned")
    total = len(words)
    progress = round(len(learned) / total * 100) if total else 0

    render_html(
        dedent(f"""
        <div class="metric-row">
            <div class="metric-card">
                <div class="metric-label">{h(tr("total_words"))}</div>
                <div class="metric-value">{total}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">{h(tr("learned"))}</div>
                <div class="metric-value">{len(learned)}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">{h(tr("difficult_words"))}</div>
                <div class="metric-value">{len(difficult)}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">{h(tr("favorite"))}</div>
                <div class="metric-value">{len(favorites)}</div>
            </div>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:{progress}%"></div></div>
        <div class="small-muted">{h(tr("overall_progress", progress=progress))}</div>
        """)
    )


def render_word_card(row: pd.Series, state: dict[str, Any], key_prefix: str) -> None:
    word_id = row["word_id"]
    favorites = state_set(state, "favorites")
    difficult = state_set(state, "difficult")
    learned = state_set(state, "learned")
    badges = []
    if word_id in learned:
        badges.append(f'<span class="badge">{h(tr("badge_learned"))}</span>')
    if word_id in difficult:
        badges.append(f'<span class="badge">{h(tr("badge_difficult"))}</span>')
    if word_id in favorites:
        badges.append(f'<span class="badge">{h(tr("badge_favorite"))}</span>')
    example_html = ""
    if row["example_it"] or row["example_zh"]:
        example_html = f'<div class="example">{h(row["example_it"])}<br>{h(row["example_zh"])}</div>'
    note_html = ""
    if row["note"]:
        note_html = f'<div class="small-muted" style="margin-top:8px;">{h(row["note"])}</div>'
    image_html = ""
    image_url = image_src(row.get("image", ""))
    if image_url:
        image_html = f'<img class="sign-image" src="{h(image_url)}" alt="{h(row["italian"])}" />'

    render_html(
        dedent(f"""
        <div class="word-card">
            <div class="word-layout">
                <div>
                    <div class="word-title">{h(row['italian'])}</div>
                    <div class="word-translation">{h(row['chinese'])}</div>
                    <div class="small-muted">{h(row['chapter'])}</div>
                    {example_html}
                    {note_html}
                    <div class="badge-line">{''.join(badges)}</div>
                </div>
                {image_html}
            </div>
        </div>
        """)
    )

    col1, col2, col3 = st.columns(3)
    with col1:
        label = tr("unfavorite") if word_id in favorites else tr("favorite")
        if st.button(label, key=f"{key_prefix}-fav-{word_id}", use_container_width=True):
            set_membership(state, "favorites", word_id, word_id not in favorites)
            st.rerun()
    with col2:
        label = tr("remove_difficult") if word_id in difficult else tr("add_difficult")
        if st.button(label, key=f"{key_prefix}-diff-{word_id}", use_container_width=True):
            set_membership(state, "difficult", word_id, word_id not in difficult)
            st.rerun()
    with col3:
        label = tr("mark_unlearned") if word_id in learned else tr("mark_learned")
        if st.button(label, key=f"{key_prefix}-learn-{word_id}", use_container_width=True):
            set_membership(state, "learned", word_id, word_id not in learned)
            if word_id not in learned:
                set_membership(state, "difficult", word_id, False)
            st.rerun()


def render_home(words: pd.DataFrame, state: dict[str, Any]) -> None:
    render_header()
    show_ad("home_top")
    render_metrics(words, state)
    render_html(f'<div class="section-title">{h(tr("chapters"))}</div>')

    learned = state_set(state, "learned")
    chapter_html = ['<div class="chapter-grid">']
    for chapter, chapter_words in words.groupby("chapter", sort=False):
        total = len(chapter_words)
        learned_count = sum(word_id in learned for word_id in chapter_words["word_id"])
        progress = round(learned_count / total * 100) if total else 0
        sample = "、".join(chapter_words["italian"].head(3))
        chapter_html.append(
            dedent(f"""
            <div class="chapter-card">
                <div class="chapter-topline">
                    <div class="chapter-name">{h(chapter)}</div>
                    <span class="pill">{h(tr("words_count", count=total))}</span>
                </div>
                <div class="small-muted">{h(sample)}</div>
                <div class="progress-track"><div class="progress-fill" style="width:{progress}%"></div></div>
                <div class="small-muted">{h(tr("learned_count", learned=learned_count, total=total))}</div>
            </div>
            """)
        )
    chapter_html.append("</div>")
    render_html("".join(chapter_html))


def render_chapter(words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.header(tr("chapter_learning"))
    chapters = list(words["chapter"].drop_duplicates())
    selected = st.selectbox(tr("select_chapter"), chapters)
    chapter_log_key = f"chapter_view::{state.get('username', '')}"
    if st.session_state.get(chapter_log_key) != selected:
        safe_log_event(
            "chapter_view",
            username=str(state.get("username", "")),
            detail={"chapter": selected},
        )
        st.session_state[chapter_log_key] = selected
    chapter_words = words[words["chapter"] == selected]
    st.caption(tr("items_count", title=selected, count=len(chapter_words)))

    for _, row in chapter_words.iterrows():
        render_word_card(row, state, "chapter")


def get_flash_pool(words: pd.DataFrame, state: dict[str, Any], chapter: str, source: str) -> pd.DataFrame:
    pool = words if chapter == "全部章节" else words[words["chapter"] == chapter]
    if source == "只看生词":
        pool = pool[pool["word_id"].isin(state_set(state, "difficult"))]
    elif source == "只看错词":
        pool = pool[pool["word_id"].isin(state_set(state, "wrong"))]
    elif source == "只看收藏":
        pool = pool[pool["word_id"].isin(state_set(state, "favorites"))]
    elif source == "未掌握优先":
        learned = state_set(state, "learned")
        unlearned = pool[~pool["word_id"].isin(learned)]
        pool = unlearned if not unlearned.empty else pool
    return pool.reset_index(drop=True)


def render_flashcards(words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.header(tr("flashcards"))
    col1, col2 = st.columns([2, 1])
    with col1:
        all_chapters_label = tr("all_chapters")
        chapter_label = st.selectbox(tr("practice_range"), [all_chapters_label, *list(words["chapter"].drop_duplicates())])
        chapter = "全部章节" if chapter_label == all_chapters_label else chapter_label
    with col2:
        source_options = {
            tr("unlearned_first"): "未掌握优先",
            tr("all_words"): "全部单词",
            tr("only_difficult"): "只看生词",
            tr("only_wrong"): "只看错词",
            tr("only_favorites"): "只看收藏",
        }
        source_label = st.selectbox(tr("card_source"), list(source_options))
        source = source_options[source_label]

    pool = get_flash_pool(words, state, chapter, source)
    if pool.empty:
        st.warning(tr("empty_flash_pool"))
        return

    flash_log_key = f"flashcard_start::{state.get('username', '')}"
    flash_signature = f"{chapter}::{source}"
    if st.session_state.get(flash_log_key) != flash_signature:
        safe_log_event(
            "flashcard_start",
            username=str(state.get("username", "")),
            detail={"chapter": chapter, "source": source, "pool_size": int(len(pool))},
        )
        st.session_state[flash_log_key] = flash_signature

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
        answer_html = f'<div class="small-muted">{h(tr("answer_hint"))}</div>'
    image_html = ""
    image_url = image_src(row.get("image", ""))
    if image_url:
        image_html = f'<img class="flash-image" src="{h(image_url)}" alt="{h(row["italian"])}" />'

    render_html(
        dedent(f"""
        <div class="flash-card">
            <div class="small-muted">{h(row['chapter'])} · {progress_text}</div>
            {image_html}
            <div class="flash-word">{h(row['italian'])}</div>
            <div class="small-muted">{h(row['pronunciation'])}</div>
            {answer_html}
        </div>
        """)
    )

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        if st.button(tr("show_answer"), type="primary", use_container_width=True):
            st.session_state[reveal_key] = True
            st.rerun()
    with col2:
        if st.button(tr("known"), use_container_width=True):
            mark_seen(state, row["word_id"], "known", italian=str(row["italian"]))
            st.session_state[session_key] = (index + 1) % len(pool)
            st.session_state[reveal_key] = False
            st.rerun()
    with col3:
        if st.button(tr("unknown"), use_container_width=True):
            mark_seen(state, row["word_id"], "unknown", italian=str(row["italian"]))
            st.session_state[session_key] = (index + 1) % len(pool)
            st.session_state[reveal_key] = False
            st.rerun()
    with col4:
        if st.button(tr("next_card"), use_container_width=True):
            st.session_state[session_key] = (index + 1) % len(pool)
            st.session_state[reveal_key] = False
            st.rerun()

    show_ad("flashcard_bottom")


def render_today_review(words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.header(tr("today_review"))
    username = str(state.get("username", ""))
    due_ids = map_legacy_ids_to_stable(get_due_review_word_ids(username), words)
    due_words = words[words["word_id"].isin(due_ids)].reset_index(drop=True)

    if due_words.empty:
        st.info(tr("no_due_reviews"))
        return

    st.caption(tr("due_review_count", count=len(due_words)))
    review_key = "today_review_index"
    reveal_key = "today_review_reveal"
    st.session_state.setdefault(review_key, 0)
    st.session_state.setdefault(reveal_key, False)
    if st.session_state[review_key] >= len(due_words):
        st.session_state[review_key] = 0

    index = st.session_state[review_key]
    row = due_words.iloc[index]
    if st.session_state[reveal_key]:
        answer_html = (
            f'<div class="flash-chinese">{h(row["chinese"])}</div>'
            f'<div class="example">{h(row["example_it"])}<br>{h(row["example_zh"])}</div>'
        )
    else:
        answer_html = f'<div class="small-muted">{h(tr("answer_hint"))}</div>'
    image_html = ""
    image_url = image_src(row.get("image", ""))
    if image_url:
        image_html = f'<img class="flash-image" src="{h(image_url)}" alt="{h(row["italian"])}" />'

    render_html(
        dedent(f"""
        <div class="flash-card">
            <div class="small-muted">{h(row['chapter'])} · {h(tr("review_progress", current=index + 1, total=len(due_words)))}</div>
            {image_html}
            <div class="flash-word">{h(row['italian'])}</div>
            <div class="small-muted">{h(row['pronunciation'])}</div>
            {answer_html}
        </div>
        """)
    )

    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button(tr("show_answer"), key="today-review-show", type="primary", use_container_width=True):
            st.session_state[reveal_key] = True
            st.rerun()
    with col2:
        if st.button(tr("known"), key="today-review-known", use_container_width=True):
            record_review_result(username, row["word_id"], "known")
            record_flashcard_result(username, row["word_id"], "known")
            safe_log_event(
                "review_known",
                username=username,
                detail={"word_id": row["word_id"], "italian": str(row["italian"])},
            )
            st.session_state[reveal_key] = False
            st.rerun()
    with col3:
        if st.button(tr("unknown"), key="today-review-unknown", use_container_width=True):
            record_review_result(username, row["word_id"], "unknown")
            record_flashcard_result(username, row["word_id"], "unknown")
            safe_log_event(
                "review_unknown",
                username=username,
                detail={"word_id": row["word_id"], "italian": str(row["italian"])},
            )
            st.session_state[reveal_key] = False
            st.rerun()


def render_collection(words: pd.DataFrame, state: dict[str, Any], kind: str) -> None:
    title = tr("difficult_words") if kind == "difficult" else tr("favorites")
    st.header(title)
    ids = state_set(state, kind)
    items = words[words["word_id"].isin(ids)]
    if items.empty:
        st.info(tr("empty_collection", title=title))
        return

    for _, row in items.iterrows():
        render_word_card(row, state, kind)


def render_wrong_review(review_words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.subheader(tr("wrong_review"))
    if review_words.empty:
        st.info(tr("wrong_words_empty"))
        return

    review_key = "wrong_review_index"
    reveal_key = "wrong_review_reveal"
    st.session_state.setdefault(review_key, 0)
    st.session_state.setdefault(reveal_key, False)
    if st.session_state[review_key] >= len(review_words):
        st.info(tr("wrong_review_done"))
        st.session_state[review_key] = 0
        st.session_state[reveal_key] = False
        return

    index = st.session_state[review_key]
    row = review_words.iloc[index]
    answer_html = (
        f'<div class="flash-chinese">{h(row["chinese"])}</div>'
        f'<div class="example">{h(row["example_it"])}<br>{h(row["example_zh"])}</div>'
        if st.session_state[reveal_key]
        else f'<div class="small-muted">{h(tr("answer_hint"))}</div>'
    )
    image_html = ""
    image_url = image_src(row.get("image", ""))
    if image_url:
        image_html = f'<img class="flash-image" src="{h(image_url)}" alt="{h(row["italian"])}" />'

    render_html(
        dedent(f"""
        <div class="flash-card">
            <div class="small-muted">{h(row['chapter'])} · {index + 1}/{len(review_words)}</div>
            {image_html}
            <div class="flash-word">{h(row['italian'])}</div>
            <div class="small-muted">{h(row['pronunciation'])}</div>
            {answer_html}
        </div>
        """)
    )

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        if st.button(tr("show_answer"), key="wrong-review-show", type="primary", use_container_width=True):
            st.session_state[reveal_key] = True
            st.rerun()
    with col2:
        if st.button(tr("known"), key="wrong-review-known", use_container_width=True):
            mark_seen(state, row["word_id"], "known", italian=str(row["italian"]))
            st.session_state[review_key] += 1
            st.session_state[reveal_key] = False
            st.rerun()
    with col3:
        if st.button(tr("unknown"), key="wrong-review-unknown", use_container_width=True):
            mark_seen(state, row["word_id"], "unknown", italian=str(row["italian"]))
            st.session_state[review_key] += 1
            st.session_state[reveal_key] = False
            st.rerun()
    with col4:
        if st.button(tr("remove_wrong"), key="wrong-review-remove", use_container_width=True):
            set_membership(state, "wrong", row["word_id"], False)
            st.session_state[review_key] += 1
            st.session_state[reveal_key] = False
            st.rerun()


def render_wrong_words(words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.header(tr("wrong_words"))
    wrong_ids = state_set(state, "wrong")
    wrong_words = words[words["word_id"].isin(wrong_ids)]
    if wrong_words.empty:
        st.info(tr("wrong_words_empty"))
        return

    chapters = [tr("wrong_filter_all"), *list(wrong_words["chapter"].drop_duplicates())]
    selected_chapter = st.selectbox(tr("select_chapter"), chapters)
    filtered = wrong_words
    if selected_chapter != tr("wrong_filter_all"):
        filtered = wrong_words[wrong_words["chapter"] == selected_chapter]

    if st.button(tr("start_wrong_review"), type="primary", use_container_width=True):
        st.session_state["wrong_review_active"] = True
        st.session_state["wrong_review_index"] = 0
        st.session_state["wrong_review_reveal"] = False
        st.rerun()

    if st.session_state.get("wrong_review_active"):
        render_wrong_review(filtered.reset_index(drop=True), state)

    st.subheader(tr("wrong_words"))
    for _, row in filtered.iterrows():
        render_word_card(row, state, "wrong")
        if st.button(tr("remove_wrong"), key=f"wrong-remove-{row['word_id']}", use_container_width=True):
            set_membership(state, "wrong", row["word_id"], False)
            st.rerun()


def render_search(words: pd.DataFrame, state: dict[str, Any]) -> None:
    st.header(tr("search_words"))
    query = st.text_input(tr("search_label"), placeholder=tr("search_placeholder"))
    if not query.strip():
        st.caption(tr("search_hint"))
        return

    normalized = query.strip().lower()
    searchable_columns = ["chapter", "italian", "chinese", "example_it", "example_zh", "note"]
    mask = pd.Series(False, index=words.index)
    for column in searchable_columns:
        mask = mask | words[column].astype(str).str.lower().str.contains(normalized, regex=False)

    results = words[mask]
    search_log_key = f"word_search::{state.get('username', '')}"
    if st.session_state.get(search_log_key) != normalized:
        safe_log_event(
            "word_search",
            username=str(state.get("username", "")),
            detail={"query_length": len(normalized), "result_count": int(len(results))},
        )
        st.session_state[search_log_key] = normalized
    st.caption(tr("search_results", count=len(results)))
    if results.empty:
        st.warning(tr("no_search_results"))
        return

    for _, row in results.iterrows():
        render_word_card(row, state, "search")


def image_source_counts(values: pd.Series) -> dict[str, int]:
    normalized = values.fillna("").astype(str).str.strip()
    is_empty = normalized == ""
    is_remote = normalized.str.lower().str.startswith(("http://", "https://"))
    is_local = (~is_empty) & (~is_remote)
    return {
        "empty": int(is_empty.sum()),
        "remote": int(is_remote.sum()),
        "local": int(is_local.sum()),
    }


def analyze_uploaded_words_csv(uploaded_file: Any) -> tuple[pd.DataFrame, dict[str, Any]]:
    uploaded_file.seek(0)
    preview_df, _encoding = read_csv_with_fallback(uploaded_file)
    preview_df = preview_df.fillna("")
    preview_df.columns = [str(column).strip() for column in preview_df.columns]

    missing_columns = [
        column for column in ADMIN_WORDS_REQUIRED_COLUMNS if column not in preview_df.columns
    ]
    chapter_count = (
        int(preview_df["chapter"].astype(str).str.strip().replace("", pd.NA).dropna().nunique())
        if "chapter" in preview_df.columns
        else 0
    )
    if "image" in preview_df.columns:
        image_counts = image_source_counts(preview_df["image"])
    else:
        image_counts = {"empty": int(len(preview_df)), "remote": 0, "local": 0}

    duplicate_count = 0
    duplicate_rows = pd.DataFrame()
    if "chapter" in preview_df.columns and "italian" in preview_df.columns:
        duplicate_key = (
            preview_df["chapter"].astype(str).str.strip().str.lower()
            + "::"
            + preview_df["italian"].astype(str).str.strip().str.lower()
        )
        duplicate_mask = duplicate_key.duplicated(keep=False) & (duplicate_key != "::")
        duplicate_count = int(duplicate_mask.sum())
        duplicate_rows = preview_df.loc[duplicate_mask, ["chapter", "italian"]].head(20)

    analysis = {
        "row_count": int(len(preview_df)),
        "chapter_count": chapter_count,
        "missing_columns": missing_columns,
        "missing_column_count": int(len(missing_columns)),
        "image_empty_count": image_counts["empty"],
        "image_remote_count": image_counts["remote"],
        "image_local_count": image_counts["local"],
        "duplicate_count": duplicate_count,
        "duplicate_rows": duplicate_rows,
    }
    return preview_df, analysis


def count_words_file(path: Path) -> int:
    if not path.exists():
        return 0
    try:
        words_df, _encoding = read_csv_with_fallback(path)
        return int(len(words_df))
    except Exception:
        return 0


def backup_words_csv(words_path: Path = WORDS_PATH) -> Path:
    DATA_DIR.mkdir(exist_ok=True)
    backup_dir = DATA_DIR / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = backup_dir / f"words_{timestamp}.csv"
    shutil.copy2(words_path, backup_path)
    return backup_path


def validate_words_import(analysis: dict[str, Any]) -> list[str]:
    errors = []
    if analysis["missing_columns"]:
        errors.append("字段不完整。")
    if analysis["duplicate_count"] > 0:
        errors.append("存在 chapter + italian 重复的词条。")
    if analysis["row_count"] == 0:
        errors.append("CSV 中没有词条。")
    return errors


def import_words_csv(
    preview_df: pd.DataFrame,
    analysis: dict[str, Any],
    words_path: Path = WORDS_PATH,
) -> dict[str, Any]:
    errors = validate_words_import(analysis)
    if errors:
        raise ValueError("；".join(errors))

    original_count = count_words_file(words_path)
    backup_path = backup_words_csv(words_path)
    temp_path = words_path.with_name(f".{words_path.name}.tmp")
    prepared_df = preview_df[ADMIN_WORDS_REQUIRED_COLUMNS].fillna("")

    try:
        prepared_df.to_csv(temp_path, index=False, encoding="utf-8")
        os.replace(temp_path, words_path)
    except Exception:
        if temp_path.exists():
            temp_path.unlink()
        raise

    return {
        "original_count": original_count,
        "new_count": int(len(prepared_df)),
        "backup_path": str(backup_path),
        "imported_at": datetime.now().isoformat(timespec="seconds"),
    }


def render_admin_backend() -> None:
    username = require_admin()
    st.header(tr("admin_backend"))
    st.caption(tr("admin_backend_caption"))
    render_persistence_test_area(username)

    uploaded_file = st.file_uploader(tr("upload_csv"), type=["csv"])
    if uploaded_file is None:
        st.info(tr("upload_csv_hint"))
        return

    try:
        preview_df, analysis = analyze_uploaded_words_csv(uploaded_file)
    except Exception as exc:
        st.error(tr("csv_read_failed", error=exc))
        log_admin_action(
            username,
            "preview_words_csv_upload_failed",
            json.dumps(
                {
                    "filename": uploaded_file.name,
                    "error": str(exc),
                },
                ensure_ascii=False,
            ),
        )
        return

    log_signature = (
        f"{username}:{uploaded_file.name}:{getattr(uploaded_file, 'size', 0)}:"
        f"{analysis['row_count']}:{analysis['missing_column_count']}"
    )
    if st.session_state.get("last_admin_preview_log") != log_signature:
        log_admin_action(
            username,
            "preview_words_csv_upload",
            json.dumps(
                {
                    "filename": uploaded_file.name,
                    "row_count": analysis["row_count"],
                    "chapter_count": analysis["chapter_count"],
                    "missing_columns": analysis["missing_columns"],
                },
                ensure_ascii=False,
            ),
        )
        st.session_state["last_admin_preview_log"] = log_signature

    import_errors = validate_words_import(analysis)
    if analysis["missing_columns"]:
        st.warning(tr("missing_fields_warning"))
        st.write(tr("missing_fields"), "、".join(analysis["missing_columns"]))
    elif analysis["duplicate_count"] > 0:
        st.warning(tr("duplicate_warning"))
    else:
        st.success(tr("ready_to_import"))

    col1, col2, col3, col4 = st.columns(4)
    col1.metric(tr("row_count"), analysis["row_count"])
    col2.metric(tr("chapter_count"), analysis["chapter_count"])
    col3.metric(tr("missing_field_count"), analysis["missing_column_count"])
    col4.metric(tr("duplicate_count"), analysis["duplicate_count"])

    col4, col5, col6 = st.columns(3)
    col4.metric(tr("image_empty"), analysis["image_empty_count"])
    col5.metric(tr("image_remote"), analysis["image_remote_count"])
    col6.metric(tr("image_local"), analysis["image_local_count"])

    if analysis["duplicate_count"] > 0:
        st.subheader(tr("duplicate_preview"))
        st.dataframe(analysis["duplicate_rows"], use_container_width=True)

    st.subheader(tr("preview_first_20"))
    st.dataframe(preview_df.head(20), use_container_width=True)

    st.divider()
    if import_errors:
        st.button(tr("confirm_import"), disabled=True, use_container_width=True)
        st.caption(tr("fix_before_import"))
        return

    st.warning(tr("import_warning"))
    if st.button(tr("confirm_import"), type="primary", use_container_width=True):
        try:
            result = import_words_csv(preview_df, analysis)
        except Exception as exc:
            st.error(tr("import_failed", error=exc))
            log_admin_action(
                username,
                "import_words_csv_failed",
                json.dumps(
                    {
                        "filename": uploaded_file.name,
                        "error": str(exc),
                        "attempted_at": datetime.now().isoformat(timespec="seconds"),
                    },
                    ensure_ascii=False,
                ),
            )
            return

        log_admin_action(
            username,
            "import_words_csv_confirmed",
            json.dumps(
                {
                    "filename": uploaded_file.name,
                    "imported_at": result["imported_at"],
                    "original_count": result["original_count"],
                    "new_count": result["new_count"],
                    "backup_path": result["backup_path"],
                },
                ensure_ascii=False,
            ),
        )
        load_words.clear()
        st.success(tr("import_success", old=result["original_count"], new=result["new_count"]))
        st.info(tr("backup_saved", path=result["backup_path"]))
        st.rerun()


def get_database_persistence_status() -> dict[str, Any]:
    status: dict[str, Any] = {
        "db_path": str(DB_PATH),
        "db_exists": DB_PATH.exists(),
        "db_existed_before_init": DB_EXISTED_BEFORE_INIT,
        "db_size_bytes": DB_PATH.stat().st_size if DB_PATH.exists() else 0,
        "users_count": 0,
        "user_word_status_count": 0,
        "remember_tokens_count": 0,
        "ok": True,
        "error": "",
    }
    if not DB_PATH.exists():
        return status

    try:
        connection = sqlite3.connect(DB_PATH)
        try:
            table_names = {
                str(row[0])
                for row in connection.execute(
                    """
                    SELECT name
                    FROM sqlite_master
                    WHERE type = 'table'
                    """
                ).fetchall()
            }
            for table_name, key in {
                "users": "users_count",
                "user_word_status": "user_word_status_count",
                "remember_tokens": "remember_tokens_count",
            }.items():
                if table_name in table_names:
                    row = connection.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()
                    status[key] = int(row[0]) if row else 0
        finally:
            connection.close()
    except Exception as exc:
        status["ok"] = False
        status["error"] = str(exc)
    return status


def render_persistence_test_area(username: str) -> None:
    st.divider()
    st.subheader("数据持久性测试")
    st.caption("用于测试本地或 Streamlit Cloud 重新启动后 data/app.db 是否仍然保留。")

    db_status = get_database_persistence_status()
    db_exists = bool(db_status["db_exists"])
    col1, col2 = st.columns(2)
    col1.caption(f"数据库路径：{db_status['db_path']}")
    col1.caption(f"当前服务器时间：{datetime.now().isoformat(timespec='seconds')}")
    col2.metric("数据库文件存在", "是" if db_exists else "否")
    col2.metric("本次启动前已存在", "是" if db_status["db_existed_before_init"] else "否")

    metrics = st.columns(4)
    metrics[0].metric("数据库文件大小", f"{db_status['db_size_bytes']} bytes")
    metrics[1].metric("users 账号数量", db_status["users_count"])
    metrics[2].metric("学习记录数量", db_status["user_word_status_count"])
    metrics[3].metric("remember_tokens 数量", db_status["remember_tokens_count"])

    if not db_status["ok"]:
        st.warning(f"读取数据库状态失败：{db_status['error']}")

    if not db_exists:
        st.error("当前本地数据库不存在，账号和学习记录不可用。")
        st.info(
            "说明：data/ 已被 .gitignore 排除，不会上传 GitHub。"
            "换项目目录、重新部署、重新拉代码时，账号不会自动跟随。"
        )
        return

    if not db_status["db_existed_before_init"]:
        st.warning(
            "本次应用启动前没有发现 data/app.db。应用启动时可能已经自动创建了一个新的空数据库。"
            "如果你之前注册过账号，但这里 users 数量为 0，通常表示当前运行目录没有原来的 data/app.db，"
            "不是系统自动清空了旧账号。"
        )

    st.info(
        "提示：data/ 已被 .gitignore 排除，不会上传 GitHub。换项目目录、重新部署、重新拉代码时，"
        "账号和学习记录不会自动跟随。请勿公开上传 data/app.db、密码哈希、salt 或 remember token。"
    )

    with st.form("persistence_marker_form"):
        test_key = st.text_input("测试 key", value=f"deploy-test-{datetime.now().date().isoformat()}")
        test_value = st.text_input("测试 value", value="created before restart/redeploy")
        submitted = st.form_submit_button("创建测试记录", use_container_width=True)

    if submitted:
        if test_key.strip() and test_value.strip():
            create_persistence_marker(test_key, test_value)
            log_admin_action(
                username,
                "create_persistence_marker",
                json.dumps(
                    {
                        "test_key": test_key,
                        "created_at": datetime.now().isoformat(timespec="seconds"),
                    },
                    ensure_ascii=False,
                ),
            )
            st.success("测试记录已创建。")
            st.rerun()
        else:
            st.warning("测试 key 和 value 都不能为空。")

    try:
        markers = get_persistence_markers()
    except Exception as exc:
        st.warning(f"读取测试记录失败：{exc}")
        return

    st.write("当前测试记录")
    if not markers:
        st.info("还没有测试记录。")
        return

    st.dataframe(pd.DataFrame(markers), use_container_width=True)
    marker_options = {
        f"#{marker['id']} · {marker['test_key']} · {marker['created_at']}": marker["id"]
        for marker in markers
    }
    selected_marker = st.selectbox("选择要删除的测试记录", list(marker_options))
    if st.button("删除选中的测试记录", use_container_width=True):
        marker_id = marker_options[selected_marker]
        delete_persistence_marker(marker_id)
        log_admin_action(
            username,
            "delete_persistence_marker",
            json.dumps(
                {
                    "marker_id": marker_id,
                    "deleted_at": datetime.now().isoformat(timespec="seconds"),
                },
                ensure_ascii=False,
            ),
        )
        st.success("测试记录已删除。")
        st.rerun()


def render_admin_stats() -> None:
    require_admin()
    st.header(tr("analytics"))
    st.caption(tr("analytics_caption"))

    summary = get_analytics_summary()
    if not summary.get("ok"):
        st.warning(tr("analytics_unavailable"))
        st.caption(str(summary.get("error", "")))
        return

    col1, col2, col3 = st.columns(3)
    col1.metric(tr("total_users"), summary["total_users"])
    col2.metric(tr("active_users_today"), summary["active_users_today"])
    col3.metric(tr("total_events"), summary["total_events"])

    col4, col5, col6, col7 = st.columns(4)
    col4.metric(tr("search_count"), summary["search_count"])
    col5.metric(tr("flashcard_count"), summary["flashcard_count"])
    col6.metric(tr("favorite_count"), summary["favorite_count"])
    col7.metric(tr("unknown_count"), summary["unknown_count"])

    st.subheader(tr("top_chapters"))
    top_chapters = summary.get("top_chapters", [])
    if not top_chapters:
        st.info(tr("no_chapter_data"))
        return

    st.dataframe(
        pd.DataFrame(top_chapters, columns=[tr("chapter_column"), tr("views_column")]),
        use_container_width=True,
    )


def main() -> None:
    apply_theme()
    try:
        init_db()
    except Exception as exc:
        st.error(tr("db_unavailable"))
        st.caption(str(exc))
        return

    words = load_words()

    render_language_selector()
    username = render_auth_sidebar()
    if not st.session_state.get("app_open_logged"):
        safe_log_event("app_open", username=str(username) if username else None)
        st.session_state["app_open_logged"] = True
    if not username:
        public_page = st.session_state.get("public_legal_page")
        if public_page in {"privacy", "terms"}:
            render_legal_document(str(public_page))
        else:
            render_header()
            st.info(tr("login_required"))
        return

    state_path = state_path_for_user(username)
    state = load_state(username, state_path)
    state = apply_legacy_word_id_compatibility(state, words)

    st.sidebar.markdown(
        f'<div class="learning-nav-title">{escape(tr("learning"))}</div>',
        unsafe_allow_html=True,
    )
    page_options = {
        tr("home"): "home",
        tr("chapter_learning"): "chapter",
        tr("flashcards"): "flashcards",
        tr("today_review"): "today_review",
        tr("difficult_words"): "difficult",
        tr("wrong_words"): "wrong",
        tr("favorites"): "favorites",
        tr("search"): "search",
        tr("privacy_policy"): "privacy",
        tr("terms_of_service"): "terms",
    }
    if current_user_is_admin():
        page_options[tr("admin_backend")] = "admin"
        page_options[tr("analytics")] = "analytics"
    page_label = st.sidebar.radio(
        "导航",
        list(page_options),
        label_visibility="collapsed",
    )
    page = page_options[page_label]
    render_sidebar_author_note()
    show_ad("sidebar_bottom")

    if page == "home":
        render_home(words, state)
    elif page == "chapter":
        render_chapter(words, state)
    elif page == "flashcards":
        render_flashcards(words, state)
    elif page == "today_review":
        render_today_review(words, state)
    elif page == "difficult":
        render_collection(words, state, "difficult")
    elif page == "wrong":
        render_wrong_words(words, state)
    elif page == "favorites":
        render_collection(words, state, "favorites")
    elif page == "search":
        render_search(words, state)
    elif page == "privacy":
        render_legal_document("privacy")
    elif page == "terms":
        render_legal_document("terms")
    elif page == "admin":
        render_admin_backend()
    elif page == "analytics":
        render_admin_stats()


if __name__ == "__main__":
    main()
