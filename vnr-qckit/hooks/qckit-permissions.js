#!/usr/bin/env node
/**
 * vnr-qckit PermissionRequest hook
 *
 * Đọc danh sách allow rules từ .claude/settings.local.json của project.
 * Nếu tool + input khớp rule → tự cấp quyền, không hỏi user.
 *
 * Được gọi bởi mọi skill trong plugin vnr-qckit:
 *   qc_pre, qc_setup, qc_basepage, qc_generate, qc_init_component, qc_user_flow
 *
 * Hoạt động:
 *   1. Đọc stdin → JSON { tool_name, tool_input }
 *   2. Đọc .claude/settings.local.json → permissions.allow[]
 *   3. Khớp rule → output { permissionDecision: "allow" }
 *   4. Không khớp → không output gì → Claude hỏi user như bình thường
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Đường dẫn settings — đọc từ nhiều nguồn và merge
const PLUGIN_DIR = path.resolve(__dirname, '..');
const SETTINGS_PATHS = [
  path.join(process.cwd(), '.claude', 'settings.local.json'),
  path.join(process.cwd(), '.claude', 'settings.json'),
  path.join(PLUGIN_DIR, '.claude', 'settings.local.json'),
];

function loadAllowRules() {
  const rules = [];
  for (const settingsPath of SETTINGS_PATHS) {
    try {
      if (fs.existsSync(settingsPath)) {
        const content = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        const allow = content?.permissions?.allow || [];
        rules.push(...allow);
      }
    } catch (_) {}
  }
  // Dedup
  return [...new Set(rules)];
}

/**
 * Kiểm tra tool + input có khớp rule không.
 *
 * Rule formats:
 *   "Read"              → match mọi Read call
 *   "Bash(npx *)"       → match Bash với command bắt đầu bằng "npx "
 *   "Bash(node *)"      → prefix wildcard
 *   "Write(.specify/**)"→ path glob đơn giản
 */
function matchesRule(rule, toolName, toolInput) {
  const parenIdx = rule.indexOf('(');

  // Rule không có argument → match theo tool name
  if (parenIdx === -1) {
    return rule === toolName;
  }

  const ruleToolName = rule.slice(0, parenIdx);
  if (ruleToolName !== toolName) return false;

  // Lấy pattern bên trong ngoặc, bỏ dấu ngoặc đóng cuối
  const pattern = rule.slice(parenIdx + 1, rule.length - 1);

  // Lấy giá trị cần match từ tool_input
  const inputValue = extractInputValue(toolName, toolInput);
  if (inputValue === null) return false;

  return matchPattern(pattern, inputValue);
}

function extractInputValue(toolName, toolInput) {
  if (!toolInput) return null;
  switch (toolName) {
    case 'Bash':       return toolInput.command || null;
    case 'Read':       return toolInput.file_path || null;
    case 'Write':      return toolInput.file_path || null;
    case 'Edit':       return toolInput.file_path || null;
    case 'Glob':       return toolInput.pattern || toolInput.path || null;
    case 'Grep':       return toolInput.path || toolInput.pattern || null;
    case 'WebFetch':   return toolInput.url || null;
    case 'WebSearch':  return toolInput.query || '';
    case 'Skill':      return toolInput.skill || null;
    default:           return JSON.stringify(toolInput);
  }
}

function matchPattern(pattern, value) {
  if (!pattern || !value) return false;

  // Chuẩn hoá path: đổi backslash thành forward slash
  const normValue = value.replace(/\\/g, '/');
  const normPattern = pattern.replace(/\\/g, '/');

  // WebFetch domain pattern: "domain:xxx.com"
  if (normPattern.startsWith('domain:')) {
    const domain = normPattern.slice(7);
    try { return new URL(normValue).hostname.endsWith(domain); } catch (_) { return false; }
  }

  // Double-wildcard glob: ** — convert sang regex
  if (normPattern.includes('**')) {
    // Bước 1: escape regex chars (trừ *)
    const escaped = normPattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    // Sau escape: ** trở thành \*\* (vì * không bị escape, nhưng / và . bị escape)
    // Thực ra * không nằm trong char class escape nên vẫn là **, ta replace trực tiếp
    const withGlob = escaped
      .replace(/\*\*/g, '.*')    // ** → .* (match mọi path kể cả /)
      .replace(/\*/g, '[^/]*');  // * còn lại → [^/]*
    const regexStr = '^' + withGlob;
    try { return new RegExp(regexStr).test(normValue); } catch (_) { return false; }
  }

  // Single wildcard ends with *  → prefix match
  if (normPattern.endsWith('*')) {
    const prefix = normPattern.slice(0, -1).replace(/^"/, '').replace(/"$/, '');
    return normValue.startsWith(prefix);
  }

  // Exact match (strip surrounding quotes nếu có)
  const clean = normPattern.replace(/^"/, '').replace(/"$/, '');
  return normValue === clean || normValue === normPattern;
}

async function main() {
  // Đọc stdin
  let rawInput = '';
  const rl = readline.createInterface({ input: process.stdin, terminal: false });
  for await (const line of rl) {
    rawInput += line;
  }

  if (!rawInput.trim()) process.exit(0);

  let input;
  try {
    input = JSON.parse(rawInput);
  } catch (_) {
    process.exit(0);
  }

  const toolName = input.tool_name;
  const toolInput = input.tool_input || {};

  if (!toolName) process.exit(0);

  const allowRules = loadAllowRules();

  const matched = allowRules.some(rule => {
    try { return matchesRule(rule, toolName, toolInput); } catch (_) { return false; }
  });

  if (matched) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PermissionRequest',
        permissionDecision: 'allow',
        permissionDecisionReason: 'vnr-qckit: matched allow rule in settings.local.json',
      }
    }));
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
