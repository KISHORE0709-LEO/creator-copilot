#!/bin/bash

echo "🔒 Security Check for Creator Copilot"
echo "===================================="

# Check if any .env files are tracked in git
echo "1. Checking for tracked environment files..."
TRACKED_ENV=$(git ls-files | grep -E "\.(env|key|pem|crt)$" | grep -v "vite-env.d.ts")
if [ -z "$TRACKED_ENV" ]; then
    echo "✅ No sensitive environment files are tracked in git"
else
    echo "❌ WARNING: Found tracked environment files:"
    echo "$TRACKED_ENV"
fi

# Check if any API keys are in tracked files
echo ""
echo "2. Checking for API keys in tracked files..."
API_KEYS=$(git ls-files -z | xargs -0 grep -l "AIza" 2>/dev/null | grep -v ".env.example")
if [ -z "$API_KEYS" ]; then
    echo "✅ No API keys found in tracked files"
else
    echo "❌ WARNING: Found potential API keys in:"
    echo "$API_KEYS"
fi

# Check .gitignore coverage
echo ""
echo "3. Checking .gitignore coverage..."
if grep -q "\.env" .gitignore && grep -q "\*\.env" .gitignore; then
    echo "✅ Environment files are properly ignored"
else
    echo "❌ WARNING: .gitignore may not cover all environment files"
fi

# Check for Firebase config exposure
echo ""
echo "4. Checking Firebase configuration..."
FIREBASE_EXPOSED=$(git ls-files | grep -E "(firebase\.json|\.firebaserc)" | head -1)
if [ -z "$FIREBASE_EXPOSED" ]; then
    echo "✅ Firebase config files are not tracked"
else
    echo "⚠️  Firebase config files are tracked (this may be intentional)"
fi

echo ""
echo "🔒 Security check complete!"
echo ""
echo "IMPORTANT REMINDERS:"
echo "- Never commit .env files"
echo "- Keep API keys in .env.local only"
echo "- Regularly rotate API keys"
echo "- Use environment variables in production"