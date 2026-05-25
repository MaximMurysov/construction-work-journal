#!/bin/sh
set -e
git add .
git commit -m "Рефакторинг журнала: хуки, утилиты и UI-компоненты" -m "Разделены типы, API, form-utils, useJournal и мелкие компоненты формы и таблицы."
git push origin main
