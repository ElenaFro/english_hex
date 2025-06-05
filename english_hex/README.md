# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# запуск проекта
npm run dev

### Git
сохранить изменения в мастере
git add . 
git commit -m "комментарии" 
git push -u origin main

сохранить изменения в ветке
git add . 
git commit -m "комментарии" 
git push origin имя ветки

Создать новую ветку можно с помощью команды 
git branch <название ветки>

Переключиться на ветку main:
  git checkout main 

Обновите ветку main, чтобы учесть последние изменения из удаленного репозитория: 
 git pull origin main 

Переключиться обратно на вашу ветку:  git checkout ваша_ветка 


### Для слияния вашей ветки в основную ветку (main) в Git, вам нужно выполнить следующие шаги:

1. git checkout main
2. git pull origin main
3. git merge merged-branch. где merged-branch — имя сливаемой ветки. Сливаемой веткой считается та, из которой берутся изменения.
4. Если во время слияния возникли конфликты, вам нужно будет разрешить их вручную. Для этого откройте файлы с конфликтами, разрешите их.
5. добавьте изменения в индекс с помощью 
git add . 
6. завершите слияние с помощью 
git commit -m "комментарии" 
7. После разрешения всех конфликтов и завершения слияния, выполните команду  git push origin main , чтобы отправить изменения ветки  main  на удаленный сервер. 
 
Это завершит процесс слияния веток в Git и обновит ветку  main  на удаленном сервере.


### создать и перейти на новую ветку
git checkout -b elena 

### сделать копию ветки с именем "elena" в Git
git checkout -b elena_copy elena
Эта команда создаст новую ветку с именем "elena_copy" и скопирует содержимое ветки "elena" в эту новую ветку.