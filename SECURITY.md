# 🔒 Security Guidelines

## Environment Variables Protection

### ✅ What's Protected
- All `.env*` files are in `.gitignore`
- API keys are never committed to git
- Firebase credentials are kept local only
- Database connection strings are environment-based

### 🔑 API Keys Management
- **Gemini API Key**: Stored in `.env.local` only
- **Firebase Config**: Stored in `.env` and `.env.local`
- **Never commit**: Real API keys to version control

### 📁 File Structure
```
.env.local          # Your actual API keys (NEVER commit)
.env.example        # Template with placeholder values (safe to commit)
.env.example.gemini # Gemini-specific template (safe to commit)
```

### 🛡️ Security Checklist
- [ ] `.env.local` contains real API keys
- [ ] `.env.example*` files only contain placeholders
- [ ] All sensitive files are in `.gitignore`
- [ ] No API keys in tracked files
- [ ] Regular API key rotation

### 🔍 Security Check
Run the security check script:
```bash
./security-check.sh
```

### 🚨 If API Keys Are Exposed
1. **Immediately revoke** the exposed keys
2. **Generate new keys** from the respective services
3. **Update** your `.env.local` file
4. **Remove** the keys from git history if needed:
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
   ```

### 📋 Environment Variables Required
```bash
# Gemini AI
VITE_GEMINI_API_KEY=your_actual_gemini_key_here

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 🔄 Best Practices
1. **Never hardcode** API keys in source code
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** (every 90 days recommended)
4. **Monitor usage** of your API keys
5. **Set up alerts** for unusual API usage
6. **Use different keys** for development and production

### 🚀 Production Deployment
- Use your hosting platform's environment variable system
- Never deploy with `.env.local` files
- Set up proper secrets management
- Enable API key restrictions where possible