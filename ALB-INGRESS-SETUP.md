# ALB 与 Ingress 配置指南

本文档说明如何配置并部署 AWS Load Balancer Controller 和前端 Ingress。

## 完整部署流程

### 第一步：创建基础设施（Terraform）

首先确保 EKS 集群已通过 Terraform 部署并且 ALB Controller IAM 角色已创建：

```bash
cd infra/environments/uat

# 如果还没有初始化
terraform init

# 查看即将应用的变更
terraform plan

# 应用配置
terraform apply

# 获取 ALB Controller 角色 ARN（重要！）
terraform output alb_controller_role_arn
```

**保存输出的 ALB Controller 角色 ARN**，下一步需要使用。

### 第二步：更新 ALB Controller Helm Values

使用第一步获得的 ARN 更新 ALB Controller 配置：

```bash
# 编辑文件
vim helm/aws-load-balancer-controller/values-uat.yaml
```

找到这一行并替换为实际的 ARN：

```yaml
eks.amazonaws.com/role-arn: "arn:aws:iam::YOUR_ACCOUNT_ID:role/k8s-practice-uat-alb-controller"
```

例如：
```yaml
eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/k8s-practice-uat-alb-controller"
```

### 第三步：部署 Argo CD

如果还没有部署 Argo CD，请运行：

```bash
chmod +x deploy-argocd.sh
./deploy-argocd.sh

# 获取初始密码
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

### 第四步：部署 ALB Controller 和前端

运行部署脚本自动部署所有必要组件：

```bash
chmod +x deploy-alb-and-frontend.sh
./deploy-alb-and-frontend.sh
```

这个脚本会：
1. 创建 AWS Load Balancer Controller Application
2. 创建 Frontend Application
3. 等待部署完成
4. 显示前端访问 URL

### 第五步（可选）：手动部署

如果更喜欢手动部署，可以逐步执行：

```bash
# 部署 ALB Controller
kubectl apply -f k8s/aws-load-balancer-controller-uat-app.yaml

# 等待 ALB Controller 就绪
kubectl rollout status deployment/aws-load-balancer-controller -n kube-system --timeout=5m

# 部署前端
kubectl apply -f k8s/frontend-uat-app.yaml

# 等待前端就绪
kubectl rollout status deployment/frontend -n default --timeout=5m

# 获取 Ingress ALB 地址（等待 2-3 分钟）
kubectl get ingress -n default
```

## 验证部署

```bash
# 运行检查脚本
chmod +x check-deployment.sh
./check-deployment.sh
```

或者手动检查：

```bash
# 检查 ALB Controller 
kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# 检查前端 pods
kubectl get pods -n default -l app=frontend

# 检查 Ingress
kubectl get ingress -n default

# 获取 ALB 地址
kubectl get ingress frontend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# 检查 Argo CD Applications
kubectl get applications -n argocd
```

## 故障排除

### ALB Controller Pod 无法启动

**问题**：ALB Controller pods 一直处于 CrashLoopBackOff 或 Pending

**检查步骤**：

```bash
# 查看 pod 事件
kubectl describe pod -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# 查看日志
kubectl logs -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# 常见原因：
# 1. 角色 ARN 不正确 - 检查 values-uat.yaml
# 2. IAM 权限不足 - 检查 infra/environments/uat/main.tf 中的权限策略
# 3. 集群名称不匹配 - clusterName 必须与 Terraform 中的集群名一致
```

### Ingress 无法获得 ALB 地址

**问题**：`kubectl get ingress` 显示 HOSTNAME/ADDRESS 为空

**等待时间**：ALB 创建通常需要 2-3 分钟

```bash
# 持续检查
kubectl get ingress -n default -w

# 查看详细信息
kubectl describe ingress frontend -n default

# 查看事件
kubectl get events -n default --sort-by='.lastTimestamp'
```

### ALB Controller 权限错误

**错误日志中出现**：`Failed to create load balancer`, `Access Denied` 等

**排查**：

```bash
# 1. 确认 role ARN 正确
kubectl get sa aws-load-balancer-controller -n kube-system -o jsonpath='{.metadata.annotations.eks\.amazonaws\.com/role-arn}'

# 2. 在 AWS 检查角色策略
aws iam list-attached-role-policies --role-name k8s-practice-uat-alb-controller

# 3. 查看详细的 IAM 策略
aws iam get-role-policy --role-name k8s-practice-uat-alb-controller --policy-name aws-load-balancer-controller-policy
```

## 重要配置文件

| 文件 | 说明 |
|------|------|
| `infra/environments/uat/main.tf` | 创建 ALB Controller IAM 角色和权限 |
| `helm/aws-load-balancer-controller/Chart.yaml` | ALB Controller Helm Chart 定义 |
| `helm/aws-load-balancer-controller/values-uat.yaml` | ALB Controller UAT 配置（需要更新 ARN") |
| `helm/values-uat.yaml` | 前端 Ingress 配置 |
| `k8s/aws-load-balancer-controller-uat-app.yaml` | Argo CD Application 定义 |
| `k8s/frontend-uat-app.yaml` | 前端 Argo CD Application 定义 |

## 访问前端

部署完成后，使用以下方式访问前端：

```bash
# 获取 ALB 地址
ALB_ADDRESS=$(kubectl get ingress frontend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Frontend URL: http://$ALB_ADDRESS"
```

### 配置 DNS 或本地 hosts

**选项 1：使用 Route53（推荐）**
- 在 Route53 中创建 A 记录指向 ALB 地址

**选项 2：编辑本地 /etc/hosts**
```bash
# 在 /etc/hosts 添加
<ALB_ADDRESS> frontend-uat.example.com
```

会根据 `helm/values-uat.yaml` 中配置的主机名进行路由。

## 下一步

- [GitOps-Guide.md](GitOps-Guide.md) - 了解 CI/CD 流程
- [README.md](README.md) - 整体项目说明
- [helm/aws-load-balancer-controller/README.md](helm/aws-load-balancer-controller/README.md) - ALB Controller 详细文档
