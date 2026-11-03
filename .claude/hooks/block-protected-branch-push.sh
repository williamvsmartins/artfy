#!/usr/bin/env bash
set -euo pipefail
input="$(cat)"
cmd="$(echo "$input" | jq -r '.tool_input.command // empty')"

if ! echo "$cmd" | grep -qE '(^|[;&|[:space:]])git[[:space:]]+push([[:space:]]|$)'; then
  echo '{}'
  exit 0
fi

# Isolate everything after "git push" and drop flags, keeping positional args
# (typically: [remote] [refspec]).
push_args="$(echo "$cmd" | grep -oE 'git[[:space:]]+push.*' | sed -E 's/^git[[:space:]]+push//')"
positional=()
for t in $push_args; do
  case "$t" in
    -*) ;; # skip flags like -u/--force/--delete (best-effort heuristic)
    *) positional+=("$t") ;;
  esac
done
refspec="${positional[1]:-}"

if [ -n "$refspec" ] && [ "$refspec" != "HEAD" ]; then
  # refspec may be "local:remote" or just "branch" — the push target is
  # whatever comes after the last colon (or the whole thing if no colon).
  branch="${refspec##*:}"
else
  # No explicit target branch (or "HEAD") — git pushes the current branch.
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
fi

if echo "$branch" | grep -qE '^main$'; then
  reason="BLOQUEADO: push direto na branch '$branch' não é permitido neste repositório. Crie uma branch de feature e abra um Pull Request."
  jq -n --arg reason "$reason" '{hookSpecificOutput:{hookEventName:"PreToolUse", permissionDecision:"deny", permissionDecisionReason:$reason}}'
else
  echo '{}'
fi
