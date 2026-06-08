# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import hashlib
import secrets
import shutil
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "app.db"
ACCOUNTS_PATH = DATA_DIR / "accounts.json"
USERS_DIR = DATA_DIR / "users"
DB_EXISTED_BEFORE_INIT = DB_PATH.exists()
VALID_ROLES = {"user", "admin", "super_admin"}
STATE_KEYS = {"favorites", "difficult", "learned", "wrong"}
REVIEW_INTERVALS = {
    1: 1,
    2: 3,
    3: 7,
    4: 15,
}


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def today_iso() -> str:
    return datetime.now().date().isoformat()


def tomorrow_iso() -> str:
    return (datetime.now().date() + timedelta(days=1)).isoformat()


def review_interval_days(level: int) -> int:
    return REVIEW_INTERVALS.get(level, 30)


def normalize_username(username: str) -> str:
    return username.strip().lower()


def hash_password(password: str, salt: str) -> str:
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        120_000,
    )
    return digest.hex()


def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    create_tables()
    migrate_accounts_json_if_needed()


def create_tables() -> None:
    with get_connection() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                salt TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user'
                    CHECK(role IN ('user', 'admin', 'super_admin')),
                created_at TEXT NOT NULL,
                updated_at TEXT,
                last_login_at TEXT,
                is_active INTEGER NOT NULL DEFAULT 1
            );

            CREATE TABLE IF NOT EXISTS remember_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL,
                expires_at TEXT,
                revoked_at TEXT,
                user_agent TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_remember_tokens_user_id
                ON remember_tokens(user_id);

            CREATE TABLE IF NOT EXISTS user_word_status (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                word_id TEXT NOT NULL,
                is_favorite INTEGER NOT NULL DEFAULT 0,
                is_difficult INTEGER NOT NULL DEFAULT 0,
                is_learned INTEGER NOT NULL DEFAULT 0,
                is_wrong INTEGER NOT NULL DEFAULT 0,
                review_level INTEGER NOT NULL DEFAULT 0,
                next_review_date TEXT,
                last_reviewed_at TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, word_id)
            );

            CREATE INDEX IF NOT EXISTS idx_user_word_status_user_id
                ON user_word_status(user_id);

            CREATE TABLE IF NOT EXISTS flashcard_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                word_id TEXT NOT NULL,
                seen INTEGER NOT NULL DEFAULT 0,
                known INTEGER NOT NULL DEFAULT 0,
                unknown INTEGER NOT NULL DEFAULT 0,
                last_seen TEXT,
                updated_at TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, word_id)
            );

            CREATE INDEX IF NOT EXISTS idx_flashcard_stats_user_id
                ON flashcard_stats(user_id);

            CREATE TABLE IF NOT EXISTS admin_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                admin_user_id INTEGER,
                admin_username TEXT NOT NULL,
                role TEXT,
                action TEXT NOT NULL,
                detail TEXT,
                target_type TEXT,
                target_id TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(admin_user_id) REFERENCES users(id) ON DELETE SET NULL
            );

            CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at
                ON admin_logs(created_at);

            CREATE TABLE IF NOT EXISTS app_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                username TEXT,
                event_type TEXT NOT NULL,
                detail TEXT,
                page TEXT,
                word_id TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
            );

            CREATE INDEX IF NOT EXISTS idx_app_events_event_type
                ON app_events(event_type);

            CREATE INDEX IF NOT EXISTS idx_app_events_created_at
                ON app_events(created_at);

            CREATE TABLE IF NOT EXISTS persistence_test (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_key TEXT NOT NULL,
                test_value TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            """
        )
        existing_columns = {
            str(row["name"])
            for row in connection.execute("PRAGMA table_info(user_word_status)").fetchall()
        }
        if "is_wrong" not in existing_columns:
            connection.execute(
                "ALTER TABLE user_word_status ADD COLUMN is_wrong INTEGER NOT NULL DEFAULT 0"
            )
        if "review_level" not in existing_columns:
            connection.execute(
                "ALTER TABLE user_word_status ADD COLUMN review_level INTEGER NOT NULL DEFAULT 0"
            )
        if "next_review_date" not in existing_columns:
            connection.execute(
                "ALTER TABLE user_word_status ADD COLUMN next_review_date TEXT"
            )
        if "last_reviewed_at" not in existing_columns:
            connection.execute(
                "ALTER TABLE user_word_status ADD COLUMN last_reviewed_at TEXT"
            )


def backup_file_if_exists(path: str | Path) -> Path | None:
    source = Path(path)
    if not source.exists() or not source.is_file():
        return None

    backup_dir = DATA_DIR / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = backup_dir / f"{source.name}.{timestamp}.bak"
    shutil.copy2(source, backup_path)
    return backup_path


def users_count() -> int:
    with get_connection() as connection:
        row = connection.execute("SELECT COUNT(*) FROM users").fetchone()
        return int(row[0]) if row else 0


def get_user(username: str) -> sqlite3.Row | None:
    username = normalize_username(username)
    if not username:
        return None

    with get_connection() as connection:
        return connection.execute(
            """
            SELECT id, username, salt, password_hash, role, created_at,
                   updated_at, last_login_at, is_active
            FROM users
            WHERE username = ?
            """,
            (username,),
        ).fetchone()


def get_user_id(username: str) -> int | None:
    user = get_user(username)
    if not user:
        return None
    return int(user["id"])


def user_exists(username: str) -> bool:
    return get_user(username) is not None


def clean_role(role: Any) -> str:
    role_text = str(role or "user")
    return role_text if role_text in VALID_ROLES else "user"


def get_user_role(username: str) -> str:
    user = get_user(username)
    if not user:
        return "user"
    return clean_role(user["role"])


def create_user(username: str, password: str, role: str = "user") -> bool:
    username = normalize_username(username)
    if not username:
        return False

    salt = secrets.token_hex(16)
    created_at = now_iso()
    try:
        with get_connection() as connection:
            connection.execute(
                """
                INSERT INTO users (
                    username, salt, password_hash, role, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    username,
                    salt,
                    hash_password(password, salt),
                    clean_role(role),
                    created_at,
                    created_at,
                ),
            )
        return True
    except sqlite3.IntegrityError:
        return False


def set_user_role(username: str, role: str) -> None:
    username = normalize_username(username)
    if not username:
        return

    with get_connection() as connection:
        connection.execute(
            """
            UPDATE users
            SET role = ?, updated_at = ?
            WHERE username = ?
            """,
            (clean_role(role), now_iso(), username),
        )


def verify_user_password(username: str, password: str) -> bool:
    user = get_user(username)
    if not user or not int(user["is_active"]):
        return False

    expected_hash = str(user["password_hash"] or "")
    salt = str(user["salt"] or "")
    if not expected_hash or not salt:
        return False

    try:
        password_hash = hash_password(password, salt)
    except ValueError:
        return False

    ok = secrets.compare_digest(password_hash, expected_hash)
    if ok:
        with get_connection() as connection:
            connection.execute(
                """
                UPDATE users
                SET last_login_at = ?, updated_at = ?
                WHERE username = ?
                """,
                (now_iso(), now_iso(), normalize_username(username)),
            )
    return ok


def update_user_password(
    username: str,
    current_password: str,
    new_password: str,
) -> tuple[bool, str]:
    user = get_user(username)
    if not user or not int(user["is_active"]):
        return False, "invalid_current_password"

    username = normalize_username(username)
    current_hash = str(user["password_hash"] or "")
    current_salt = str(user["salt"] or "")
    if not current_hash or not current_salt:
        return False, "invalid_current_password"

    try:
        submitted_current_hash = hash_password(current_password, current_salt)
        submitted_new_hash_with_old_salt = hash_password(new_password, current_salt)
    except ValueError:
        return False, "invalid_current_password"

    if not secrets.compare_digest(submitted_current_hash, current_hash):
        return False, "invalid_current_password"

    if secrets.compare_digest(submitted_new_hash_with_old_salt, current_hash):
        return False, "same_password"

    new_salt = secrets.token_hex(16)
    new_hash = hash_password(new_password, new_salt)
    with get_connection() as connection:
        connection.execute(
            """
            UPDATE users
            SET salt = ?, password_hash = ?, updated_at = ?
            WHERE username = ?
            """,
            (new_salt, new_hash, now_iso(), username),
        )
    return True, "ok"


def migrate_accounts_json_if_needed(path: str | Path = ACCOUNTS_PATH) -> int:
    accounts_path = Path(path)
    if users_count() > 0 or not accounts_path.exists():
        return 0

    try:
        with accounts_path.open("r", encoding="utf-8") as file:
            accounts = json.load(file)
    except (json.JSONDecodeError, OSError):
        return 0

    if not isinstance(accounts, dict):
        return 0

    backup_file_if_exists(accounts_path)
    migrated = 0
    with get_connection() as connection:
        for raw_username, account in accounts.items():
            if not isinstance(account, dict):
                continue

            username = normalize_username(str(raw_username))
            salt = str(account.get("salt", ""))
            password_hash = str(account.get("password_hash", ""))
            if not username or not salt or not password_hash:
                continue

            created_at = str(account.get("created_at") or now_iso())
            role = clean_role(account.get("role", "user"))
            cursor = connection.execute(
                """
                INSERT OR IGNORE INTO users (
                    username, salt, password_hash, role, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (username, salt, password_hash, role, created_at, now_iso()),
            )
            migrated += int(cursor.rowcount > 0)
    return migrated


def default_user_state() -> dict[str, Any]:
    return {
        "favorites": [],
        "difficult": [],
        "learned": [],
        "wrong": [],
        "stats": {},
    }


def clean_word_id(value: Any) -> str:
    return str(value or "").strip()


def clean_word_id_list(values: Any) -> list[str]:
    if not isinstance(values, list):
        return []
    cleaned = {clean_word_id(value) for value in values}
    cleaned.discard("")
    return sorted(cleaned)


def clean_int(value: Any) -> int:
    try:
        return max(0, int(value))
    except (TypeError, ValueError):
        return 0


def normalize_state(raw_state: Any) -> dict[str, Any]:
    state = default_user_state()
    if not isinstance(raw_state, dict):
        return state

    for key in STATE_KEYS:
        state[key] = clean_word_id_list(raw_state.get(key, []))

    raw_stats = raw_state.get("stats", {})
    if isinstance(raw_stats, dict):
        for raw_word_id, item in raw_stats.items():
            word_id = clean_word_id(raw_word_id)
            if not word_id or not isinstance(item, dict):
                continue
            state["stats"][word_id] = {
                "seen": clean_int(item.get("seen", 0)),
                "known": clean_int(item.get("known", 0)),
                "unknown": clean_int(item.get("unknown", 0)),
                "last_seen": str(item.get("last_seen", "")),
            }
    return state


def user_has_learning_state(user_id: int) -> bool:
    with get_connection() as connection:
        status_row = connection.execute(
            "SELECT 1 FROM user_word_status WHERE user_id = ? LIMIT 1",
            (user_id,),
        ).fetchone()
        stats_row = connection.execute(
            "SELECT 1 FROM flashcard_stats WHERE user_id = ? LIMIT 1",
            (user_id,),
        ).fetchone()
    return bool(status_row or stats_row)


def user_state_json_migration_done(username: str) -> bool:
    username = normalize_username(username)
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT 1
            FROM app_events
            WHERE username = ?
              AND event_type = 'user_state_json_migrated'
            LIMIT 1
            """,
            (username,),
        ).fetchone()
    return bool(row)


def mark_user_state_json_migration(username: str, detail: dict[str, Any]) -> None:
    log_app_event("user_state_json_migrated", username=username, detail=detail)


def load_legacy_user_state(path: str | Path) -> dict[str, Any]:
    state_path = Path(path)
    try:
        with state_path.open("r", encoding="utf-8") as file:
            return normalize_state(json.load(file))
    except (json.JSONDecodeError, OSError):
        return default_user_state()


def migrate_user_state_json_if_needed(
    username: str,
    legacy_state_path: str | Path | None = None,
) -> int:
    username = normalize_username(username)
    user_id = get_user_id(username)
    if user_id is None or legacy_state_path is None:
        return 0

    state_path = Path(legacy_state_path)
    if not state_path.exists() or user_state_json_migration_done(username):
        return 0

    if user_has_learning_state(user_id):
        mark_user_state_json_migration(
            username,
            {
                "legacy_state_path": str(state_path),
                "status": "skipped_existing_sqlite_state",
            },
        )
        return 0

    try:
        backup_path = backup_file_if_exists(state_path)
    except OSError:
        return 0

    legacy_state = load_legacy_user_state(state_path)
    save_user_state(username, legacy_state)
    migrated_count = (
        len(legacy_state["favorites"])
        + len(legacy_state["difficult"])
        + len(legacy_state["learned"])
        + len(legacy_state["stats"])
    )
    mark_user_state_json_migration(
        username,
        {
            "legacy_state_path": str(state_path),
            "backup_path": str(backup_path) if backup_path else "",
            "status": "migrated",
            "migrated_items": migrated_count,
        },
    )
    return migrated_count


def load_user_state(
    username: str,
    legacy_state_path: str | Path | None = None,
) -> dict[str, Any]:
    username = normalize_username(username)
    migrate_user_state_json_if_needed(username, legacy_state_path)
    user_id = get_user_id(username)
    state = default_user_state()
    if user_id is None:
        return state

    with get_connection() as connection:
        status_rows = connection.execute(
            """
            SELECT word_id, is_favorite, is_difficult, is_learned, is_wrong
            FROM user_word_status
            WHERE user_id = ?
            """,
            (user_id,),
        ).fetchall()
        stats_rows = connection.execute(
            """
            SELECT word_id, seen, known, unknown, last_seen
            FROM flashcard_stats
            WHERE user_id = ?
            """,
            (user_id,),
        ).fetchall()

    for row in status_rows:
        word_id = str(row["word_id"])
        if int(row["is_favorite"]):
            state["favorites"].append(word_id)
        if int(row["is_difficult"]):
            state["difficult"].append(word_id)
        if int(row["is_learned"]):
            state["learned"].append(word_id)
        if int(row["is_wrong"]):
            state["wrong"].append(word_id)

    for key in STATE_KEYS:
        state[key] = sorted(set(state[key]))

    for row in stats_rows:
        state["stats"][str(row["word_id"])] = {
            "seen": int(row["seen"] or 0),
            "known": int(row["known"] or 0),
            "unknown": int(row["unknown"] or 0),
            "last_seen": str(row["last_seen"] or ""),
        }

    return state


def upsert_word_status(
    connection: sqlite3.Connection,
    user_id: int,
    word_id: str,
    *,
    is_favorite: int | None = None,
    is_difficult: int | None = None,
    is_learned: int | None = None,
    is_wrong: int | None = None,
) -> None:
    now = now_iso()
    connection.execute(
        """
        INSERT OR IGNORE INTO user_word_status (
            user_id, word_id, created_at, updated_at
        )
        VALUES (?, ?, ?, ?)
        """,
        (user_id, word_id, now, now),
    )

    updates: list[str] = []
    values: list[Any] = []
    if is_favorite is not None:
        updates.append("is_favorite = ?")
        values.append(int(bool(is_favorite)))
    if is_difficult is not None:
        updates.append("is_difficult = ?")
        values.append(int(bool(is_difficult)))
    if is_learned is not None:
        updates.append("is_learned = ?")
        values.append(int(bool(is_learned)))
    if is_wrong is not None:
        updates.append("is_wrong = ?")
        values.append(int(bool(is_wrong)))
    if not updates:
        return

    updates.append("updated_at = ?")
    values.append(now)
    values.extend([user_id, word_id])
    connection.execute(
        f"""
        UPDATE user_word_status
        SET {", ".join(updates)}
        WHERE user_id = ? AND word_id = ?
        """,
        values,
    )


def save_user_state(username: str, state: dict[str, Any]) -> None:
    username = normalize_username(username)
    user_id = get_user_id(username)
    if user_id is None:
        return

    normalized = normalize_state(state)
    favorites = set(normalized["favorites"])
    difficult = set(normalized["difficult"])
    learned = set(normalized["learned"])
    wrong = set(normalized["wrong"])
    all_status_ids = favorites | difficult | learned | wrong

    with get_connection() as connection:
        connection.execute("DELETE FROM user_word_status WHERE user_id = ?", (user_id,))
        connection.execute("DELETE FROM flashcard_stats WHERE user_id = ?", (user_id,))
        for word_id in sorted(all_status_ids):
            upsert_word_status(
                connection,
                user_id,
                word_id,
                is_favorite=int(word_id in favorites),
                is_difficult=int(word_id in difficult),
                is_learned=int(word_id in learned),
                is_wrong=int(word_id in wrong),
            )

        now = now_iso()
        for word_id, item in normalized["stats"].items():
            connection.execute(
                """
                INSERT INTO flashcard_stats (
                    user_id, word_id, seen, known, unknown, last_seen, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_id,
                    word_id,
                    clean_int(item.get("seen", 0)),
                    clean_int(item.get("known", 0)),
                    clean_int(item.get("unknown", 0)),
                    str(item.get("last_seen", "")),
                    now,
                ),
            )


def set_word_membership(username: str, key: str, word_id: str, enabled: bool) -> None:
    username = normalize_username(username)
    word_id = clean_word_id(word_id)
    user_id = get_user_id(username)
    if user_id is None or not word_id or key not in STATE_KEYS:
        return

    kwargs = {
        "is_favorite": None,
        "is_difficult": None,
        "is_learned": None,
        "is_wrong": None,
    }
    if key == "favorites":
        kwargs["is_favorite"] = int(enabled)
    elif key == "difficult":
        kwargs["is_difficult"] = int(enabled)
    elif key == "learned":
        kwargs["is_learned"] = int(enabled)
    elif key == "wrong":
        kwargs["is_wrong"] = int(enabled)

    with get_connection() as connection:
        upsert_word_status(connection, user_id, word_id, **kwargs)


def schedule_initial_review(username: str, word_id: str) -> None:
    username = normalize_username(username)
    word_id = clean_word_id(word_id)
    user_id = get_user_id(username)
    if user_id is None or not word_id:
        return

    with get_connection() as connection:
        upsert_word_status(connection, user_id, word_id)
        connection.execute(
            """
            UPDATE user_word_status
            SET review_level = 0,
                next_review_date = ?,
                updated_at = ?
            WHERE user_id = ? AND word_id = ?
            """,
            (tomorrow_iso(), now_iso(), user_id, word_id),
        )


def record_review_result(username: str, word_id: str, result: str) -> dict[str, Any] | None:
    username = normalize_username(username)
    word_id = clean_word_id(word_id)
    user_id = get_user_id(username)
    if user_id is None or not word_id:
        return None

    now = now_iso()
    with get_connection() as connection:
        upsert_word_status(connection, user_id, word_id)
        row = connection.execute(
            """
            SELECT review_level
            FROM user_word_status
            WHERE user_id = ? AND word_id = ?
            """,
            (user_id, word_id),
        ).fetchone()
        current_level = clean_int(row["review_level"] if row else 0)

        if result == "known":
            next_level = current_level + 1
            interval_days = review_interval_days(next_level)
            next_review_date = (datetime.now().date() + timedelta(days=interval_days)).isoformat()
        else:
            next_level = 0
            next_review_date = tomorrow_iso()

        connection.execute(
            """
            UPDATE user_word_status
            SET review_level = ?,
                next_review_date = ?,
                last_reviewed_at = ?,
                updated_at = ?
            WHERE user_id = ? AND word_id = ?
            """,
            (next_level, next_review_date, now, now, user_id, word_id),
        )
    return {
        "review_level": next_level,
        "next_review_date": next_review_date,
        "last_reviewed_at": now,
    }


def get_due_review_word_ids(username: str) -> list[str]:
    username = normalize_username(username)
    user_id = get_user_id(username)
    if user_id is None:
        return []

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT word_id
            FROM user_word_status
            WHERE user_id = ?
              AND next_review_date IS NOT NULL
              AND next_review_date != ''
              AND next_review_date <= ?
            ORDER BY next_review_date ASC, updated_at ASC
            """,
            (user_id, today_iso()),
        ).fetchall()
    return [str(row["word_id"]) for row in rows]


def record_flashcard_result(username: str, word_id: str, result: str) -> None:
    username = normalize_username(username)
    word_id = clean_word_id(word_id)
    user_id = get_user_id(username)
    if user_id is None or not word_id:
        return

    seen_increment = 1
    known_increment = 1 if result == "known" else 0
    unknown_increment = 1 if result == "unknown" else 0
    last_seen = now_iso()
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO flashcard_stats (
                user_id, word_id, seen, known, unknown, last_seen, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id, word_id) DO UPDATE SET
                seen = seen + excluded.seen,
                known = known + excluded.known,
                unknown = unknown + excluded.unknown,
                last_seen = excluded.last_seen,
                updated_at = excluded.updated_at
            """,
            (
                user_id,
                word_id,
                seen_increment,
                known_increment,
                unknown_increment,
                last_seen,
                last_seen,
            ),
        )


def log_app_event(
    event_type: str,
    username: str | None = None,
    detail: Any | None = None,
) -> None:
    try:
        normalized_username = normalize_username(username or "") or None
        user_id = get_user_id(normalized_username) if normalized_username else None
        if detail is None:
            detail_text = None
        elif isinstance(detail, str):
            detail_text = detail
        else:
            detail_text = json.dumps(detail, ensure_ascii=False, sort_keys=True)

        with get_connection() as connection:
            connection.execute(
                """
                INSERT INTO app_events (
                    user_id, username, event_type, detail, created_at
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (user_id, normalized_username, event_type, detail_text, now_iso()),
            )
    except Exception:
        return


def create_persistence_marker(test_key: str, test_value: str) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO persistence_test (test_key, test_value, created_at)
            VALUES (?, ?, ?)
            """,
            (str(test_key).strip(), str(test_value).strip(), now_iso()),
        )


def get_persistence_markers() -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, test_key, test_value, created_at
            FROM persistence_test
            ORDER BY id DESC
            """
        ).fetchall()
    return [dict(row) for row in rows]


def delete_persistence_marker(id: int) -> None:
    with get_connection() as connection:
        connection.execute(
            "DELETE FROM persistence_test WHERE id = ?",
            (int(id),),
        )


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
        with get_connection() as connection:
            table_names = {
                str(row["name"])
                for row in connection.execute(
                    """
                    SELECT name
                    FROM sqlite_master
                    WHERE type = 'table'
                    """
                ).fetchall()
            }
            count_tables = {
                "users": "users_count",
                "user_word_status": "user_word_status_count",
                "remember_tokens": "remember_tokens_count",
            }
            for table_name, key in count_tables.items():
                if table_name in table_names:
                    row = connection.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()
                    status[key] = int(row[0]) if row else 0
    except Exception as exc:
        status["ok"] = False
        status["error"] = str(exc)
    return status


def get_analytics_summary() -> dict[str, Any]:
    try:
        today_prefix = datetime.now().date().isoformat() + "%"
        with get_connection() as connection:
            total_users = connection.execute("SELECT COUNT(*) FROM users").fetchone()[0]
            total_events = connection.execute("SELECT COUNT(*) FROM app_events").fetchone()[0]
            active_users_today = connection.execute(
                """
                SELECT COUNT(DISTINCT username)
                FROM app_events
                WHERE created_at LIKE ?
                  AND username IS NOT NULL
                  AND username != ''
                """,
                (today_prefix,),
            ).fetchone()[0]
            event_counts = {
                str(row["event_type"]): int(row["count"])
                for row in connection.execute(
                    """
                    SELECT event_type, COUNT(*) AS count
                    FROM app_events
                    GROUP BY event_type
                    """
                ).fetchall()
            }
            chapter_rows = connection.execute(
                """
                SELECT detail
                FROM app_events
                WHERE event_type = 'chapter_view'
                  AND detail IS NOT NULL
                """
            ).fetchall()

        chapter_counts: dict[str, int] = {}
        for row in chapter_rows:
            try:
                detail = json.loads(str(row["detail"]))
            except (TypeError, json.JSONDecodeError):
                continue
            chapter = str(detail.get("chapter", "")).strip()
            if chapter:
                chapter_counts[chapter] = chapter_counts.get(chapter, 0) + 1

        top_chapters = sorted(
            chapter_counts.items(),
            key=lambda item: item[1],
            reverse=True,
        )[:10]
        return {
            "ok": True,
            "total_users": int(total_users),
            "active_users_today": int(active_users_today),
            "total_events": int(total_events),
            "top_chapters": top_chapters,
            "search_count": int(event_counts.get("word_search", 0)),
            "flashcard_count": int(event_counts.get("flashcard_start", 0)),
            "favorite_count": int(event_counts.get("favorite_add", 0))
            + int(event_counts.get("favorite_remove", 0)),
            "unknown_count": int(event_counts.get("unknown_add", 0))
            + int(event_counts.get("unknown_remove", 0)),
            "event_counts": event_counts,
        }
    except Exception as exc:
        return {
            "ok": False,
            "error": str(exc),
            "total_users": 0,
            "active_users_today": 0,
            "total_events": 0,
            "top_chapters": [],
            "search_count": 0,
            "flashcard_count": 0,
            "favorite_count": 0,
            "unknown_count": 0,
            "event_counts": {},
        }
