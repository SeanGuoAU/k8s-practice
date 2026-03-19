# 配置完成清单

本文件汇总了所有对 ALB 和 Ingress 配置的更改。

## ✅ 已完成的配置

### 1. 基础设施 (Terraform)

- [x] **EKS 模块输出**
  - 文件：`infra/modules/eks/outputs.tf`
  - 添加：OIDC Provider ARN 和 OIDC Issuer URL 输出
  
- [x] **UAT 环境 ALB Controller IAM 角色**
  - 文件：`infra/environments/uat/main.tf`
  - 添加：
    - ALB Controller 的 IAM IRSA 信任策略
    - ALB Controller 的权限策略（ELBv2、EC2、WAF、Tags、Logs 权限）
    - IAM 角色附加
  - 文件：`infra/environments/uat/outputs.tf`
  - 添加：ALB Controller 角色 ARN 和 EKS OIDC Issuer 输出

### 2. Helm Charts

- [x] **AWS Load Balancer Controller Chart**
  - 目录：`helm/aws-load-balancer-controller/`
  - 已创建文件：
    - `Chart.yaml` - Chart 定义（依赖官方 AWS LBC Chart 2.10.1）
    - `values.yaml` - 默认值和可配置选项
    - `values-uat.yaml` - UAT 环境特定配置
    - `README.md` - ALB Controller 部署说明

- [x] **前端 Ingress 配置**
  - 文件：`helm/templates/ingress.yaml` - 已存在，无需改动
  - 文件：`helm/values-uat.yaml`
  - 更新内容：
    - `ingress.enabled: true` - 启用 Ingress
    - `ingress.className: alb` - 指定使用 ALB Controller
    - ALB 注解：scheme、target-type、listen-ports 等
    - 主机配置：`frontend-uat.example.com`
    - 增强的健康检查配置

### 3. Kubernetes 清单

- [x] **ALB Controller Application**
  - 文件：`k8s/aws-load-balancer-controller-uat-app.yaml`
  - 创建 Argo CD Application 资源用于部署 ALB Controller

- [x] **前端 Application**
  - 文件：`k8s/frontend-uat-app.yaml` - 已存在，无需改动

### 4. 部署脚本

- [x] **主部署脚本**
  - 文件：`deploy-alb-and-frontend.sh`
  - 功能：
    - 自动部署 ALB Controller
    - 自动部署前端
    - 轮询等待 ALB 地址
    - 显示访问信息

- [x] **检查脚本**
  - 文件：`check-deployment.sh`
  - 功能：
    - 检查所有部署状态
    - 显示 ALB 地址
    - 收集诊断信息

### 5. 文档

- [x] **ALB & Ingress 设置指南**
  - 文件：`ALB-INGRESS-SETUP.md`
  - 内容：完整部署流程、故障排除、验证方法

- [x] **GitOps 部署指南更新**
  - 文件：`GitOps-Guide.md`
  - 更新内容：添加 ALB Controller 部署步骤

## 📋 需要手动配置的部分

### 1. Terraform 部署后

在 `infra/environments/uat/` 目录运行：

```bash
terraform init
terraform apply

# 记录输出的 ALB Controller 角色 ARN
terraform output alb_controller_role_arn
```

### 2. 更新 ALB Controller 角色 ARN

编辑 `helm/aws-load-balancer-controller/values-uat.yaml`：

```yaml
aws-load-balancer-controller:
  serviceAccount:
    annotations:
      # 替换为实际的角色 ARN（来自上面的 terraform output）
      eks.amazonaws.com/role-arn: "arn:aws:iam::YOUR_ACCOUNT_ID:role/k8s-practice-uat-alb-controller"
```

### 3. 部署流程

```bash
# 第一次：部署 Argo CD
./deploy-argocd.sh

# 第二次：部署 ALB Controller 和前端
./deploy-alb-and-frontend.sh

# 验证部署
./check-deployment.sh
```

## 🔄 配置文件关系图

```
Terraform (IAM 角色)
    ↓
    └─ ALB Controller Role ARN
         ↓
         Helm Chart (values-uat.yaml) 
             ↓
             Argo CD Application
                 ↓
                 部署到 kube-system

Helm Chart (frontend)
    ├─ Ingress (ALB Controller 将其转换为 AWS ALB)
    ├─ Service (ClusterIP)
    └─ Deployment
         ↓
         Argo CD Application
             ↓
             部署到 default namespace
```

## 🎯 主要配置点

| 配置项 | 文件 | 值 |
|--------|------|-----|
| 集群名称 | `helm/aws-load-balancer-controller/values-uat.yaml` | `k8s-practice-uat` |
| ALB Scheme | `helm/values-uat.yaml` | `internet-facing` |
| Target Type | `helm/values-uat.yaml` | `ip` |
| 前端主机 | `helm/values-uat.yaml` | `frontend-uat.example.com` |
| Ingress Class | `helm/values-uat.yaml` | `alb` |
| IAM Role IRSA | `helm/aws-load-balancer-controller/values-uat.yaml` | `arn:aws:iam::ACCOUNT_ID:role/...` |

## 📊 部署验证检查表

- [ ] Terraform `terraform apply` 成功
- [ ] 获取并记录 ALB Controller 角色 ARN
- [ ] 更新 `values-uat.yaml` 中的角色 ARN
- [ ] 部署 Argo CD：`./deploy-argocd.sh`
- [ ] ALB Controller pods 运行中：`kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller`
- [ ] 前端 pods 运行中：`kubectl get pods -n default -l app=frontend`
- [ ] Ingress ALB 地址已分配：`kubectl get ingress -n default`
- [ ] 可以访问前端 URL

## 🚀 快速开始

```bash
# 1. 部署基础设施
cd infra/environments/uat
terraform apply
ALB_ROLE_ARN=$(terraform output -raw alb_controller_role_arn)
cd ../../..

# 2. 更新配置
sed -i "s|arn:aws:iam::ACCOUNT_ID:role/k8s-practice-uat-alb-controller|$ALB_ROLE_ARN|g" \
  helm/aws-load-balancer-controller/values-uat.yaml

# 3. 部署
./deploy-argocd.sh
./deploy-alb-and-frontend.sh

# 4. 验证
./check-deployment.sh
```

## 📚 更多信息

- 详细的部署说明：[ALB-INGRESS-SETUP.md](ALB-INGRESS-SETUP.md)
- GitOps 流程：[GitOps-Guide.md](GitOps-Guide.md)
- ALB Controller 文档：[helm/aws-load-balancer-controller/README.md](helm/aws-load-balancer-controller/README.md)
