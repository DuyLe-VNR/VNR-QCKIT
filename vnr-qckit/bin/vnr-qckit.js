#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const COMMANDS = ['qc_pre.md', 'qc_generate.md']
const INTERNAL = ['qc_setup.md', 'qc_basepage.md']
const PLUGIN_DIR = '.claude/commands/vnr-qckit'

function help() {
  console.log(`
vnr-qckit — Claude Code slash commands for VNR Playwright QC

Usage:
  vnr-qckit install     Copy commands into .claude/commands/vnr-qckit/
  vnr-qckit uninstall   Remove .claude/commands/vnr-qckit/
  vnr-qckit status      Show install status

Commands added after install:
  /vnr-qckit:qc_pre        — QC preflight: verify setup, crawl URLs, generate url-aliases.md
  /vnr-qckit:qc_generate   — Generate Playwright test cases from spec

Internal skills (called automatically, not exposed as slash commands):
  qc_setup               — Install Playwright + Chromium, create playwright.config.ts
  qc_basepage            — Create or update BasePage.ts
`)
}

function resolve(...parts) {
  return path.resolve(process.cwd(), ...parts)
}

function install() {
  const srcDir = path.join(__dirname, '..', 'commands')
  const destDir = resolve(PLUGIN_DIR)

  if (!fs.existsSync(srcDir)) {
    console.error(`Error: source commands folder not found at ${srcDir}`)
    process.exit(1)
  }

  fs.mkdirSync(destDir, { recursive: true })

  let installed = 0
  for (const file of COMMANDS) {
    const src = path.join(srcDir, file)
    const dest = path.join(destDir, file)
    if (!fs.existsSync(src)) {
      console.warn(`  SKIP  ${file} (not found in package)`)
      continue
    }
    fs.copyFileSync(src, dest)
    console.log(`  OK    ${file}  [slash command]`)
    installed++
  }

  for (const file of INTERNAL) {
    const src = path.join(srcDir, file)
    const dest = path.join(destDir, file)
    if (!fs.existsSync(src)) {
      console.warn(`  SKIP  ${file} (not found in package)`)
      continue
    }
    fs.copyFileSync(src, dest)
    console.log(`  OK    ${file}  [internal]`)
  }

  console.log(`\nInstalled ${installed} public command(s) + ${INTERNAL.length} internal skill(s) → ${PLUGIN_DIR}/`)
  console.log('\nRestart Claude Code to pick up the new commands.')
  console.log('Then use:')
  console.log('  /vnr-qckit:qc_pre')
  console.log('  /vnr-qckit:qc_generate')
}

function uninstall() {
  const destDir = resolve(PLUGIN_DIR)
  if (!fs.existsSync(destDir)) {
    console.log('vnr-qckit is not installed (folder not found).')
    return
  }
  fs.rmSync(destDir, { recursive: true, force: true })
  console.log(`Removed ${PLUGIN_DIR}/`)
}

function status() {
  const destDir = resolve(PLUGIN_DIR)
  if (!fs.existsSync(destDir)) {
    console.log('Status: NOT INSTALLED')
    console.log(`Expected location: ${PLUGIN_DIR}/`)
    return
  }
  console.log('Status: INSTALLED')
  console.log(`Location: ${PLUGIN_DIR}/`)
  console.log('\nSlash commands:')
  for (const file of COMMANDS) {
    const exists = fs.existsSync(path.join(destDir, file))
    console.log(`  ${exists ? 'OK  ' : 'MISS'} ${file}`)
  }
  console.log('\nInternal skills:')
  for (const file of INTERNAL) {
    const exists = fs.existsSync(path.join(destDir, file))
    console.log(`  ${exists ? 'OK  ' : 'MISS'} ${file}`)
  }
}

const cmd = process.argv[2]
switch (cmd) {
  case 'install':   install();   break
  case 'uninstall': uninstall(); break
  case 'status':    status();    break
  default:          help();      break
}
