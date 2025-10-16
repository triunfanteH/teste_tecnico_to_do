# Projeto To-Do Kanban (To-Do List)

![Screenshot da Aplicação](https://i.imgur.com/caK9JgQ.png)

Um projeto que era para ser um To-Do mas acabou virando um kanban. Projeto feito para o teste do seguinte link

https://github.com/tecnologia-pguest/teste/tree/main

---
## ✨ Funcionalidades

### Gestão de Colunas
- **Criar Colunas:** Adicione novas colunas dinamicamente ao quadro para personalizar seu fluxo de trabalho.
- **Renomear Colunas:** Edite o nome de qualquer coluna clicando diretamente no título.
- **Excluir Colunas:** Remova colunas, com uma validação que impede a exclusão se ela contiver tarefas.

### Gestão de Tarefas
- **Criar Tarefas:** Adicione novas tarefas em qualquer coluna através de um formulário em modal.
- **Visualizar e Editar Tarefas:** Clique em uma tarefa para ver seus detalhes (datas de criação/atualização) e editar seu título, descrição ou movê-la para outra coluna.
- **Excluir Tarefas:** Remova tarefas individualmente de forma rápida.

---

## 💻 Tecnologias Utilizadas

- **Backend:** Laravel 12 / PHP 8.3
- **Banco de Dados:** PostgreSQL 16
- **Frontend:** Blade, Vanilla JavaScript (ES6+), CSS3
- **Ambiente de Desenvolvimento:** Docker, Docker Compose


##  Melhorias:
- **ID da task**
- **Arrasta e solta das task entre as colunas**
---

## 🚀 Instalação e Execução

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento localmente.

### Pré-requisitos
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone git@github.com:triunfanteH/teste_tecnico_to_do.git 
    cd teste_tecnico_to_do
    ```

2.  **Configuração do Ambiente Docker:**
    Este projeto usa um arquivo `.env` na raiz para configurar as permissões de usuário dentro do container Docker, evitando problemas de permissão de arquivos no Linux.

    - **Descubra seu User ID e Group ID:**
      ```bash
      echo "UID=$(id -u)" > .env
      echo "GID=$(id -g)" >> .env
      ```
    - O comando acima criará um arquivo `.env` com seu `UID` e `GID` locais (geralmente `1000`).

3.  **Configuração do Ambiente Laravel:**
    O Laravel precisa de seu próprio arquivo de configuração.

    - **Copie o arquivo de exemplo:**
      ```bash
      cp src/.env.example src/.env
      ```

    - **Construa e suba os containers Docker:**
    Este comando irá construir a imagem customizada do PHP e iniciar todos os serviços (app, nginx, db) em segundo plano.
      ```bash
      docker compose up -d --build
      ```

    - **Instale as dependências do Composer:**
      ```bash
      docker compose exec -w /var/www/html/src app composer install
      ```

    - **Gere a chave da aplicação:**
      ```bash
      docker compose run --rm -w /var/www/html/src app php artisan key:generate
      ```

5.  **Execute as Migrations do Banco de Dados:**
    Este comando criará todas as tabelas necessárias (`columns`, `tasks`, `sessions`, etc.) no banco de dados PostgreSQL.
    ```bash
    docker compose exec -w /var/www/html/src app php artisan migrate
    ```
    - (Confirme se necessário)


7.  **Pronto!**
    A aplicação está rodando. Acesse em seu navegador:
    **[http://localhost:8080](http://localhost:8080)**

---

## 📝 API Endpoints

A aplicação é servida por uma API RESTful. Os principais endpoints são:

| Método  | URL                     | Descrição                      |
| :------ | :---------------------- | :----------------------------- |
| `GET`   | `/api/v1/columns`       | Lista todas as colunas e suas tarefas. |
| `POST`  | `/api/v1/columns`       | Cria uma nova coluna.          |
| `PUT`   | `/api/v1/columns/{id}`  | Atualiza o nome de uma coluna. |
| `DELETE`| `/api/v1/columns/{id}`  | Exclui uma coluna.             |
| `POST`  | `/api/v1/tasks`         | Cria uma nova tarefa.          |
| `GET`   | `/api/v1/tasks/{id}`    | Obtém os detalhes de uma tarefa. |
| `PUT`   | `/api/v1/tasks/{id}`    | Atualiza uma tarefa.           |
| `DELETE`| `/api/v1/tasks/{id}`    | Exclui uma tarefa.             |