#!/bin/sh
set -e
git add .
git commit -m "Разделить стили журнала на CSS Modules" -m "Colocated module.css для компонентов, shared для кнопок и панелей. Добавить docs/code-style-and-cursor-prompts.md и обновить AGENTS.md."
git push origin main
