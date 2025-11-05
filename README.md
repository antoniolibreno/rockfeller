## Links Úteis
- **Repositório do Sanity no GitHub:** https://github.com/antoniolibreno/sanity-rockfeller
- **Documentação do Projeto:** [https://docs.google.com/document/d/1IdAJWIq6qyB4R9irDEIZaj65IVJ8dmDAbtXvEgwK4mQ/edit?usp=sharing](https://docs.google.com/document/d/1IdAJWIq6qyB4R9irDEIZaj65IVJ8dmDAbtXvEgwK4mQ/edit?usp=sharing)

## Configuração Inicial (Faça isso apenas na primeira vez)
Configure suas credenciais globais no Git para que seus commits sejam atribuídos corretamente.

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

**Dica:** Use o mesmo email cadastrado no GitHub para evitar problemas de autenticação.

## Clonando o Repositório (Faça isso apenas na primeira vez)
Baixe o repositório para o seu computador local.

```bash
git clone https://github.com/antoniolibreno/sanity.git
cd sanity
```

## Atualizando o Repositório Local
Antes de começar a trabalhar, sempre atualize sua cópia local para evitar conflitos.

```bash
git fetch  # Baixa as atualizações remotas sem aplicar
git pull   # Aplica as atualizações no branch atual
```

**Dica:** Execute isso toda vez que for trabalhar no projeto para sincronizar com as alterações da equipe.

## Trabalhando com Branches
Branches ajudam a isolar alterações e evitar bagunçar o branch principal (geralmente `main` ou `master`).

### Mudando para uma Branch Existente
```bash
git checkout nome-da-branch
```

### Criando uma Nova Branch
Crie uma branch nova para cada feature ou correção.

```bash
git checkout -b nome-da-branch
```

**Regra da Equipe:** Ao criar uma branch, avise no grupo do WhatsApp com o nome da branch e um breve resumo do que você vai fazer (ex: "Criei branch 'feature-login' para implementar o login").

## Adicionando e Commitando Alterações
Após editar arquivos, adicione-os ao staging e crie um commit.

### Adicionando Alterações
```bash
git add .  # Adiciona todos os arquivos alterados (use com cuidado!)
```

Ou adicione arquivos específicos:
```bash
git add caminho/do/arquivo.ext
```

### Criando um Commit
```bash
git commit -m "Mensagem descritiva do commit"
```

**Dica:** Use mensagens claras e concisas, como "Adiciona funcionalidade de login" ou "Corrige bug no formulário".

## Verificando o Status
Veja o estado atual do seu repositório (arquivos alterados, staged, etc.).

```bash
git status
```

## Enviando Alterações para o Repositório Remoto
Após commits locais, envie para o GitHub.

```bash
git push
```

Se for a primeira vez enviando uma branch nova:
```bash
git push -u origin nome-da-branch
```

**Após Push:** Avise no grupo do WhatsApp: qual branch, o que foi alterado (breve comentário) e se precisa de review.

## Boas Práticas
- **Sempre comece com `git fetch` e `git status`:** Isso garante que você está atualizado e vê o que foi alterado localmente.
- **Resetando Alterações Indesejadas:** Se `git status` mostrar arquivos que você não quer, resete:
  ```bash
  git reset --hard
  ```
  **Cuidado:** Isso descarta alterações locais não commitadas!
- **Evite Conflitos:** Atualize (`git pull`) antes de pushar. Se houver conflitos, resolva manualmente.
- **Commits Pequenos:** Faça commits frequentes e atômicos (uma mudança por commit).
- **Pull Requests:** Para merges no branch principal, crie um Pull Request no GitHub e avise a equipe para review.
- **Segurança:** Não commite senhas ou dados sensíveis. Use `.gitignore` para ignorar arquivos desnecessários.
