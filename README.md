# Configurar o Git - LER O FINAL DO README!!!

## Configuração inicial - fazer isso somente na primeira vez
```bash
git config --global user.name "SEU-NOME"
git config --global user.email "seu@exemplo.com"
```

---

## Clonar repositório - fazer isso somente na primeira vez
```bash
git clone https://github.com/usuario/repositorio.git
cd repositorio
```

---

## Atualizar repositório local
```bash
git fetch
git pull

Toda vez que for acessar o arquivo pega e executa esse código para ver se teve alguma outra alteração feita, se tiver, da um 'git pull' para puxar ele
```

---

## Mudar de branch
```bash
git checkout nome-da-branch
```

## Criar nova branch
```bash
git checkout -b nome-da-branch

Resumidamente, se for fazer alguma alteração, cria uma nova branch, comenta no WhatsApp que criou uma nova branch + o nome dela e boa
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

---

## Ver status
```bash
git status
```

## Enviar alterações para o repositório remoto
```bash
git push
```

# Feitas as alterações, manda mensagem dentro do grupo do WhatsApp dizendo qual branch foi criada, o que fez de alteração (um breve comentário sobre) para termos esse controle.
## Uma boa prática para ser feita é sempre executar o 'git fetch' antes de qualquer coisa e também um 'git status'. Caso você dê 'git status' e tenha algum arquivo que você não queira iniciar a codificação com, execute 'git reset --hard' para resetar e começar sem nenhum arquivo previamente alterado.

# QUALQUER DÚVIDA PODE MANDAR MENSAGEM!!
