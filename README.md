# README — Guia Básico de Git

Este documento mostra apenas os comandos essenciais para configurar, clonar, atualizar, fazer commits e enviar alterações com Git.

---

## Configuração inicial
```bash
git config --global user.name "SEU-NOME"
git config --global user.email "seu@exemplo.com"
```

---

## Clonar repositório
```bash
git clone https://github.com/usuario/repositorio.git
cd repositorio
```

---

## Atualizar repositório local
```bash
git fetch
git pull
```

---

## Mudar de branch
```bash
git checkout nome-da-branch
```

---

## Ver status
```bash
git status
```

---

## Adicionar alterações
```bash
git add .
```

---

## Criar commit
```bash
git commit -m "mensagem do commit"
```

---

## Enviar alterações para o repositório remoto
```bash
git push
```

