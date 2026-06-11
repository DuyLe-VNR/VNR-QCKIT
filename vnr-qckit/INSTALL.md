# Cài đặt vnr-qckit

## Cài từ local path

```bash
# Bước 1: Thêm marketplace
claude plugin marketplace add D:/SourceCode/AutomationProcess/vnr-qckit

# Bước 2: Install plugin vào project
claude plugin install vnr-qckit@vnr-qckit --scope project

# Bước 3: Reload trong Claude Code
/reload-plugins
```

## Cài từ GitHub (sau khi push repo lên)

```bash
claude plugin marketplace add your-org/vnr-qckit
claude plugin install vnr-qckit@vnr-qckit --scope project
```

## Scope options

| Scope | Ý nghĩa |
| --- | --- |
| `--scope project` | Lưu vào `.claude/settings.json` — shared với team qua git |
| `--scope user` | Lưu vào `~/.claude/` — chỉ cho bạn, mọi project |
| `--scope local` | Lưu local, không commit vào git |

## Commands sau khi cài

```
/vnr-qckit:qc_pre        — QC preflight setup
/vnr-qckit:qc_basepage   — Tạo/cập nhật BasePage.ts
```

## Gỡ cài đặt

```bash
claude plugin uninstall vnr-qckit@vnr-qckit --scope project
```
