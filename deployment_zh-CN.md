# 快速锻造AI - 部署

您可以使用Docker Compose将项目部署到远程服务器上。

此项目期望您拥有一个Traefik代理来处理与外部世界的通信和HTTPS证书。

您可以使用CI/CD（持续集成和持续部署）系统来自动部署，已经有了使用GitHub Actions进行部署的配置。

但是，您需要先配置一些事情。 🤓

## 准备

* 准备好一个远程服务器，并确保它可用。
* 配置域名的DNS记录，使其指向您刚创建的服务器的IP。
* 为您的域名配置通配符子域名，这样您就可以为不同的服务拥有多个子域名，例如`*.fastapi-project.example.com`。这将有助于访问不同的组件，如`dashboard.fastapi-project.example.com`、`api.fastapi-project.example.com`、`traefik.fastapi-project.example.com`、`adminer.fastapi-project.example.com`等。同时也适用于`staging`环境，例如`dashboard.staging.fastapi-project.example.com`、`adminer.staging..fastapi-project.example.com`等。
* 在远程服务器上安装和配置[Docker](https://docs.docker.com/engine/install/)(Docker Engine，而不是Docker Desktop)。

## 公共Traefik

我们需要一个Traefik代理来处理入站连接和HTTPS证书。

您只需要执行以下步骤一次。

### Traefik Docker Compose

* 创建一个远程目录来存储您的Traefik Docker Compose文件：

```bash
mkdir -p /root/code/traefik-public/
```

将Traefik Docker Compose文件复制到您的服务器上。您可以在本地终端运行`rsync`命令来完成：

```bash
rsync -a docker-compose.traefik.yml root@your-server.example.com:/root/code/traefik-public/
```

### Traefik公共网络

这个Traefik将期望一个名为`traefik-public`的Docker“公共网络”来与您的栈进行通信。

这样，您将拥有一个单一的公共Traefik代理，它处理与外部世界的通信（HTTP和HTTPS），然后在其后面，您可以拥有一个或多个栈，每个栈都有不同的域名，即使它们在同一个服务器上。

在远程服务器上运行以下命令来创建一个名为`traefik-public`的Docker“公共网络”：

```bash
docker network create traefik-public
```

### Traefik环境变量

Traefik Docker Compose文件在启动之前需要在您的终端中设置一些环境变量。您可以在远程服务器中运行以下命令来完成：

* 创建HTTP Basic Auth的用户名，例如：

```bash
export USERNAME=admin
```

* 创建一个环境变量，用于HTTP Basic Auth的密码，例如：

```bash
export PASSWORD=quickforgeai
```

* 使用openssl生成HTTP Basic Auth密码的“哈希”版本，并将其存储在一个环境变量中：

```bash
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
```

要验证哈希密码是否正确，您可以打印它：

```bash
echo $HASHED_PASSWORD
```

* 创建一个环境变量，用于您的服务器的域名，例如：

```bash
export DOMAIN=fastapi-project.example.com
```

* 创建一个环境变量，用于Let's Encrypt的邮箱，例如：

```bash
export EMAIL=admin@example.com
```

**注意**：您需要设置一个不同的邮箱，`@example.com`的邮箱不会起作用。

### 启动Traefik Docker Compose

转到远程服务器中您复制的Traefik Docker Compose文件所在的目录：

```bash
cd /root/code/traefik-public/
```

现在，环境变量已设置，`docker-compose.traefik.yml`文件已就位，您可以通过运行以下命令来启动Traefik Docker Compose：

```bash
docker compose -f docker-compose.traefik.yml up -d
```

## 部署快速锻造AI

现在您已经有了Traefik，您可以使用Docker Compose部署快速锻造AI。

**注意**：您可能想跳到关于使用GitHub Actions进行连续部署的部分。

## 环境变量

您需要首先设置一些环境变量。

设置`ENVIRONMENT`，默认为`local`（用于开发），但是在部署到服务器时，您将使用类似`staging`或`production`的值：

```bash
export ENVIRONMENT=production
```

设置`DOMAIN`，默认为`localhost`（用于开发），但是在部署时，您将使用自己的域名，例如：

```bash
export DOMAIN=fastapi-project.example.com
```

您可以设置多个变量，例如：

* `PROJECT_NAME`：项目的名称，用于API文档和电子邮件。
* `STACK_NAME`：栈的名称，用于Docker Compose标签和项目名称，这应该与`staging`、`production`等不同。您可以使用相同的域名，替换点号为破折号，例如`fastapi-project-example-com`和`staging-fastapi-project-example-com`。
* `BACKEND_CORS_ORIGINS`：允许的CORS来源列表，逗号分隔。
* `SECRET_KEY`：快速锻造AI的秘密密钥，用于签名令牌。
* `FIRST_SUPERUSER`：第一个超级用户的邮箱，这个超级用户将是可以创建新用户的用户。
* `FIRST_SUPERUSER_PASSWORD`：第一个超级用户的密码。
* `SMTP_HOST`：用于发送电子邮件的SMTP服务器主机，这将来自您的电子邮件提供商（例如Mailgun、Sparkpost、Sendgrid等）。
* `SMTP_USER`：用于发送电子邮件的SMTP服务器用户。
* `SMTP_PASSWORD`：用于发送电子邮件的SMTP服务器密码。
* `EMAILS_FROM_EMAIL`：用于发送电子邮件的邮箱账户。
* `POSTGRES_SERVER`：PostgreSQL服务器的主机名。您可以保留默认的`db`，由同一个Docker Compose提供。您通常不需要更改这项，除非您使用第三方提供商。
* `POSTGRES_PORT`：PostgreSQL服务器的端口。您可以保留默认。您通常不需要更改这项，除非您使用第三方提供商。
* `POSTGRES_PASSWORD`：Postgres密码。
* `POSTGRES_USER`：Postgres用户，您可以保留默认。
* `POSTGRES_DB`：用于此应用程序的数据库名称。您可以保留默认的`app`。
* `SENTRY_DSN`：Sentry的DSN，如果您使用它。

## GitHub Actions环境变量

有几个环境变量只用于GitHub Actions，您可以配置：

* `LATEST_CHANGES`：用于GitHub Action [latest-changes](https://github.com/tiangolo/latest-changes)以自动添加基于合并的PR的发布说明。它是一个个人访问令牌，详见文档。
* `SMOKESHOW_AUTH_KEY`：用于处理和发布代码覆盖率使用[Smokeshow](https://github.com/samuelcolvin/smokeshow)，按照他们的说明创建一个（免费的）Smokeshow密钥。

### 生成秘密密钥

`.env`文件中的一些环境变量的默认值为`quickforgeai`。

您需要用秘密密钥替换它们，生成秘密密钥可以运行以下命令：

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

复制内容，并用作密码/秘密密钥。并再次运行以生成另一个安全密钥。

### 使用Docker Compose部署

环境变量已就位，您可以使用Docker Compose部署：

```bash
docker compose -f docker-compose.yml up -d
```

对于生产环境，您不想在`docker-compose.override.yml`中有覆盖项，这就是为什么我们明确指定`docker-compose.yml`作为要使用的文件。

## 连续部署（CD）

您可以使用GitHub Actions来自动部署项目。 😎

您可以有多个环境部署。

已经配置了两个环境，`staging`和`production`。 🚀

### 安装GitHub Actions Runner

* 在您的远程服务器上，为GitHub Actions创建一个用户：

```bash
sudo adduser github
```

* 为`github`用户添加Docker权限：

```bash
sudo usermod -aG docker github
```

* 暂时切换到`github`用户：

```bash
sudo su - github
```

* 进入`github`用户的主目录：

```bash
cd
```

* [按照官方指南安装GitHub Action自托管运行器](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners#adding-a-self-hosted-runner-to-a-repository)。

* 当被问及标签时，添加一个环境标签，例如`production`。您也可以后续添加标签。

安装完成后，指南将告诉您运行一个命令来启动运行器。然而，这将在您终止该进程或如果您与服务器的本地连接丢失时停止。

为了确保它在启动时运行并继续运行，您可以将其安装为服务。要做到这一点，退出`github`用户并返回到`root`用户：

```bash
exit
```

在您这样做后，您将回到前一个用户，并回到属于该用户的目录。

在您能够回到`github`用户目录之前，您需要成为`root`用户（您可能已经是）：

```bash
sudo su
```

* 作为`root`用户，进入`github`用户主目录中的`actions-runner`目录：

```bash
cd /home/github/actions-runner
```

* 使用用户`github`安装自托管运行器作为服务：

```bash
./svc.sh install github
```

* 启动服务：

```bash
./svc.sh start
```

* 检查服务的状态：

```bash
./svc.sh status
```

您可以在官方指南中阅读更多关于它的信息：[配置自托管运行器应用程序作为服务](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service)。

### 设置秘密

在您的存储库中，配置您需要的环境变量的秘密，包括上述描述的`SECRET_KEY`等。按照[官方GitHub指南设置存储库秘密](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)。

当前的GitHub Actions工作流程期望这些秘密：

* `DOMAIN_PRODUCTION`
* `DOMAIN_STAGING`
* `STACK_NAME_PRODUCTION`
* `STACK_NAME_STAGING`
* `EMAILS_FROM_EMAIL`
* `FIRST_SUPERUSER`
* `FIRST_SUPERUSER_PASSWORD`
* `POSTGRES_PASSWORD`
* `SECRET_KEY`
* `LATEST_CHANGES`
* `SMOKESHOW_AUTH_KEY`

## GitHub Action部署工作流程

在`.github/workflows`目录中已经配置了GitHub Action部署工作流程，用于部署到环境（GitHub Actions运行器带有标签）：

* `staging`：在推送（或合并）到`master`分支时。
* `production`：在发布版本时。

如果您需要添加额外的环境，您可以使用这些作为起点。

## URL

将`fastapi-project.example.com`替换为您的域名。

### 主Traefik仪表盘

Traefik UI：`https://traefik.fastapi-project.example.com`

### 生产环境

前端：`https://dashboard.fastapi-project.example.com`

后端API文档：`https://api.fastapi-project.example.com/docs`

后端API基础URL：`https://api.fastapi-project.example.com`

Adminer：`https://adminer.fastapi-project.example.com`

### 测试环境

前端：`https://dashboard.staging.fastapi-project.example.com`

后端API文档：`https://api.staging.fastapi-project.example.com/docs`

后端API基础URL：`https://api.staging.fastapi-project.example.com`

Adminer：`https://adminer.staging.fastapi-project.example.com`
