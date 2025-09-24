# AI Assistant Reference Guide

## 🚨 CRITICAL: Read This First

**Before making ANY changes to this project, AI assistants MUST read this reference guide.**

## 📋 Quick Reference Commands

Use these commands to ensure proper AI workflow:

### Primary Command
```
AI_INIT
```
**What it does:** Forces AI to read knowledge base, check existing files, and provide accurate project status.

### Alternative Commands
```
STATUS        - Quick project status check
DEV_MODE      - Development mode activation
FRESH_START   - Force fresh start (use sparingly)
```

## 📚 Knowledge Base Files

AI must read these files in order:
1. `.ai-knowledge-base.md` - Complete project context and status
2. `.ai-instructions.md` - Critical workflow instructions
3. `.ai-command.md` - Command reference
4. `README.md` - Project documentation

## 🏗️ Project Structure

- **Type**: Single Next.js 15.5.3 app
- **Location**: `mile-sync-app/` directory
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT tokens
- **Deployment**: Vercel
- **UI**: React 19, TypeScript, Tailwind CSS

## ✅ Current Status

### Already Set Up:
- ✅ Project structure in `mile-sync-app/`
- ✅ Package.json with dependencies
- ✅ `.env.local` file (needs Supabase credentials)
- ✅ README.md documentation
- ✅ API route structure
- ✅ Basic pages (home, login, dashboard)
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup

### Needs Configuration:
- 🔧 Supabase credentials in `.env.local`
- 🔧 Database connection testing
- 🔧 Development server startup

## 🚫 Common Mistakes to Avoid

- ❌ Don't suggest separate backend/frontend setup
- ❌ Don't create files that already exist
- ❌ Don't assume project needs initial setup
- ❌ Don't start from scratch when work is done
- ❌ Don't skip reading existing files first

## 🔄 Proper Workflow

1. **Read knowledge base files first**
2. **Check existing project structure**
3. **Verify current configuration**
4. **Only suggest what's actually missing**
5. **Build on existing work**

## 📁 Key Files to Check

- `mile-sync-app/.env.local` - Environment config (EXISTS)
- `mile-sync-app/package.json` - Dependencies (CONFIGURED)
- `mile-sync-app/src/app/` - Next.js structure
- `README.md` - Documentation

## 🚀 Quick Start Commands

```bash
cd mile-sync-app
npm install
npm run dev
```

## 🔐 Environment Setup

The `.env.local` file exists but needs actual Supabase credentials:
```env
DATABASE_URL=postgresql://postgres:[ACTUAL_PASSWORD]@db.[ACTUAL_PROJECT].supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 🎯 Demo Account
- Email: demo@milesync.com
- Password: demo123

## 📞 How to Use This Reference

### For New AI Sessions:
1. Copy this file content
2. Paste it as context for the AI
3. Use `AI_INIT` command to start

### For Troubleshooting:
1. Point AI to this reference
2. Use `STATUS` command for quick check
3. Ensure AI reads existing files first

### For Development:
1. Use `DEV_MODE` command
2. Ensure AI follows workflow rules
3. Verify AI builds on existing work

## 🎯 Success Indicators

AI is working correctly when:
- ✅ Reads existing files before suggesting changes
- ✅ Builds on existing setup work
- ✅ Only suggests what's actually missing
- ✅ Respects completed configuration
- ✅ Provides accurate project status

## 📝 Last Updated
September 2024 - MileSync Project Setup Complete

---

**Remember: Always use `AI_INIT` to start any AI session with this project!**
