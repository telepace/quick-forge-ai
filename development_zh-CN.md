# 快速锻造AI - 开发

## Docker Compose

* 使用Docker Compose启动本地栈：

```bash
docker compose watch
```

* 现在你可以打开浏览器并与这些URL交互：

使用Docker构建的前端，根据路径处理路由：http://localhost:5173

基于OpenAPI的JSON基于web API：http://localhost:8000

来自OpenAPI后端的自动交互文档，使用Swagger UI：http://localhost:8000/docs

数据库web管理：http://localhost:8080

Traefik UI，查看路由如何被代理处理：http://localhost:8090

**注意**：第一次启动你的栈时，可能需要一分钟才能准备好。因为后端等待数据库准备好并配置一切。你可以检查日志来监控它。

要检查日志，运行（在另一个终端）：

```bash
docker compose logs
```

要检查特定服务的日志，添加服务的名称，例如：

```bash
docker compose logs backend
```

## 本地开发

Docker Compose文件配置了每个服务在`localhost`的不同端口上可用。

对于后端和前端，它们使用与其本地开发服务器相同的端口，因此，后端在`http://localhost:8000`，前端在`http://localhost:5173`。

这样，你可以关闭Docker Compose中的某个服务，并启动其本地开发服务器，并且一切都会继续工作，因为它们都使用相同的端口。

例如，你可以停止Docker Compose中的`frontend`服务，在另一个终端运行：

```bash
docker compose stop frontend
```

然后启动本地前端开发服务器：

```bash
cd frontend
npm run dev
```

或者你可以停止`backend` Docker Compose服务：

```bash
docker compose stop backend
```

然后你可以运行后端的本地开发服务器：

```bash
cd backend
fastapi dev app/main.py
```

## 使用nip.io/nip.io

当你启动Docker Compose栈时，默认情况下它使用`localhost`，每个服务（后端、前端、adminer等）都在不同的端口上。

当你部署到生产环境（或预演环境）时，它将每个服务部署在不同的子域名下，例如`api.example.com`用于后端和`dashboard.example.com`用于前端。

在关于[部署](deployment.md)的指南中，你可以阅读关于Traefik的配置，Traefik是负责根据子域名传输流量到每个服务的组件。

如果你想测试一切是否在本地工作，你可以编辑本地的`.env`文件，并更改：

```dotenv
DOMAIN=127.0.0.1.nip.io
```

这将被Docker Compose文件用于配置服务的基础域名。

Traefik将使用这来传输流量到`api.127.0.0.1.nip.io`到后端，并传输流量到`dashboard.127.0.0.1.nip.io`到前端。

域名`127.0.0.1.nip.io`是一个特殊的域名，它（包括所有子域名）被配置为指向`127.0.0.1`。这样你可以用于本地开发。

更新后，重新运行：

```bash
docker compose watch
```

当部署到生产环境（例如）时，主Traefik是在Docker Compose文件之外配置的。对于本地开发，有一个包含在`docker-compose.override.yml`中的Traefik，只是为了让你测试域名是否按预期工作，例如`api.127.0.0.1.nip.io`和`dashboard.127.0.0.1.nip.io`。

## Docker Compose文件和环境变量

有一个主`docker-compose.yml`文件，包含了整个栈的所有配置，它会被`docker compose`自动使用。

还有一个`docker-compose.override.yml`文件，用于开发的覆盖配置，例如将源代码作为卷装载。它会被`docker compose`自动用于在`docker-compose.yml`之上应用覆盖配置。

这些Docker Compose文件使用包含配置的`.env`文件，将其注入到容器中的环境变量中。

它们还使用在脚本中设置的环境变量，这些变量在调用`docker compose`命令之前被设置。

更改变量后，确保你重启了栈：

```bash
docker compose watch
```

## .env文件

`.env`文件是包含所有配置、生成的密钥和密码等的文件。

根据你的工作流程，你可能想从Git中排除它，例如如果你的项目是公开的。在这种情况下，你需要确保你的CI工具在构建或部署你的项目时能够获取它。

一种方法是将每个环境变量添加到你的CI/CD系统中，并更新`docker-compose.yml`文件，以读取那个特定的环境变量，而不是读取`.env`文件。

## 预提交和代码linting

我们使用一个名为[pre-commit](https://pre-commit.com/)的工具进行代码linting和格式化。

当你安装它时，它会在git提交前运行。这样它确保了代码在提交前是一致的和格式化的。

你可以在项目的根目录找到一个文件`.pre-commit-config.yaml`，其中包含配置。

#### 自动运行pre-commit

`pre-commit`已经是项目的依赖项之一，但你也可以全局安装它，按照[官方pre-commit文档](https://pre-commit.com/)。

在安装了`pre-commit`工具并且它可用后，你需要在本地存储库中“安装”它，以便在每次提交前自动运行。

使用`uv`，你可以这样做：

```bash
❯ uv run pre-commit install
pre-commit installed at .git/hooks/pre-commit
```

现在，每当你尝试提交，例如：

```bash
git commit
```

...pre-commit将运行，并检查和格式化你即将提交的代码，并会要求你使用git再次添加（阶段）修改后的文件，然后才能提交。

然后你可以`git add`修改后的文件，并现在你可以提交。

#### 手动运行pre-commit钩子

你也可以手动在所有文件上运行`pre-commit`，你可以使用`uv`以：

```bash
❯ uv run pre-commit run --all-files
check for added large files..............................................Passed
check toml...............................................................Passed
check yaml...............................................................Passed
ruff.....................................................................Passed
ruff-format..............................................................Passed
eslint...................................................................Passed
prettier.................................................................Passed
```

## URLs

生产或预演URL将使用这些相同的路径，但使用你的域名。

### 开发URL

本地开发的开发URL。

前端：http://dashboard.127.0.0.1.nip.io

后端：http://api.127.0.0.1.nip.io

交互式文档（Swagger UI）：http://api.127.0.0.1.nip.io/docs

替代文档（ReDoc）：http://api.127.0.0.1.nip.io/redoc

Adminer：http://localhost:8080

Traefik UI：http://localhost:8090

MailCatcher：http://localhost:1080

### 配置了`localhost.nip.io`的开发URL

本地开发的开发URL。

前端：http://dashboard.localhost.nip.io

后端：http://api.localhost.nip.io

交互式文档（Swagger UI）：http://api.localhost.nip.io/docs

替代文档（ReDoc）：http://api.localhost.nip.io/redoc

Adminer：http://localhost.nip.io:8080

Traefik UI：http://localhost.nip.io:8090

MailCatcher：http://localhost.nip.io:1080