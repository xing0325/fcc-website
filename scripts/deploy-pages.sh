#!/bin/bash
# One-shot GitHub Pages deploy: create repo (first run), push main,
# publish out/ to gh-pages, enable Pages. Rerun any time to redeploy.
set -euo pipefail
cd "$(dirname "$0")/.."

OWNER=$(gh api user -q .login)
REPO=fcc-website

# 1. repo + main
if ! gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source . --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
  git push -u origin main
fi

# 2. fresh export
DEPLOY_TARGET=pages npx next build
node scripts/postexport-pages.mjs out /$REPO
touch out/.nojekyll

# 3. publish out/ as gh-pages (throwaway history)
cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "deploy $(date +%Y-%m-%d_%H%M)"
git push -f "https://github.com/$OWNER/$REPO.git" gh-pages
cd ..
rm -rf out/.git

# 4. enable Pages on gh-pages root (409 = already enabled)
gh api -X POST "repos/$OWNER/$REPO/pages" \
  -f "source[branch]=gh-pages" -f "source[path]=/" >/dev/null 2>&1 || true

echo "✓ deployed — https://$OWNER.github.io/$REPO/ (Pages 首次构建约 1-2 分钟)"
