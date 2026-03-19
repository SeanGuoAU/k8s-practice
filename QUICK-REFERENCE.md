# 快速参考指南

## 执行摘要

已配置完整的 AWS ALB 和 Kubernetes Ingress，支持通过 GitOps 自动部署。

## 部署架构

```
┌─────────────────┐
│  Git Repository │
│  (This Repo)    │
└────────┬────────┘
         │
         ├─ helm/aws-load-balancer-controller/  ── Helm Chart for ALB Controller
         ├─ helm/templates/ingress.yaml         ── Frontend Ingress template
         ├─ k8s/aws-load-balancer-controller-uat-app.yaml  ── Argo CD App
         ├─ k8s/frontend-uat-app.yaml           ── Argo CD App
         ├─ infra/environments/uat/main.tf      ── ALB Controller IAM Role
         └─ deploy-alb-and-frontend.sh
         
         │
         ├─ Terraform ──────────────────────────┐
         │   └─ Creates ALB Controller IAM Role │
         │   └─ Outputs roles ARN               │
         │                                      │
         ├─ Argo CD (deployed to EKS)          │
         │   ├─ aws-load-balancer-controller   │
         │   │   └─ kube-system namespace      │
         │   │   └─ Manages ALB creation       │
         │   │                                 │
         │   └─ frontend-uat                   │
         │       └─ default namespace          │
         │       └─ Service (ClusterIP)        │
         │       └─ Deployment + Pods          │
         │       └─ Ingress → ALB Creation     │
         │                                      │
         └─ AWS ALB (Internet-facing)◄─────────┘
             │
             └─ Users can access frontend
```

## 部署步骤（简化版）

### 1. 准备阶段
```bash
cd infra/environments/uat
terraform apply
# 记录: terraform output alb_controller_role_arn
cd ../../..
```

### 2. 配置阶段
编辑 `helm/aws-load-balancer-controller/values-uat.yaml`，替换 `ACCOUNT_ID` 为实际账户 ID

### 3. 部署阶段
```bash
./deploy-argocd.sh          # 一次性
./deploy-alb-and-frontend.sh # 部署 ALB Controller 和前端
```

### 4. 验证阶段
```bash
./check-deployment.sh
```

## 关键文件位置

| 目标 | 文件 |
|------|------|
| ALB Controller IAM 配置 | `infra/environments/uat/main.tf` (第 78-177 行) |
| ALB Controller Helm Chart | `helm/aws-load-balancer-controller/` |
| Frontend Ingress 配置 | `helm/values-uat.yaml` (第 1-14 行) |
| 部署脚本 | `deploy-alb-and-frontend.sh` |
| 检查脚本 | `check-deployment.sh` |

## 常见命令

```bash
# 查看 ALB Controller 状态
kubectl get deployment aws-load-balancer-controller -n kube-system
kubectl logs -f deployment/aws-load-balancer-controller -n kube-system

# 查看前端状态
kubectl get deployment frontend -n default
kubectl get pods -n default

# 获取 ALB 地址
kubectl get ingress frontend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# 查看 Argo CD 应用
kubectl get applications -n argocd
kubectl describe application frontend-uat -n argocd

# 同步应用
argocd app sync frontend-uat
argocd app sync aws-load-balancer-controller
```

## 故障排除快速检查

```bash
# 1. ALB Controller 无法启动？
kubectl describe pod -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller
kubectl logs -f -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# 检查点：
# - 角色 ARN 正确？
# - 集群名称匹配？

# 2. Ingress 没有 ALB 地址？
kubectl describe ingress frontend -n default
# 等待 2-3 分钟让 ALB 创建

# 3. 前端 Pod 无法连接到后端？
kubectl logs -f deployment/frontend -n default

# 4. Argo CD 应用无法同步？
kubectl describe application frontend-uat -n argocd
# 检查同步状态和错误信息
```

## 配置修改

### 更改前端主机名
编辑 `helm/values-uat.yaml`：
```yaml
ingress:
  hosts:
    - host: "your-domain.com"  # 改这里
```

### 更改集群名称
1. 更新 Terraform：`infra/environments/uat/uat.tfvars` 中的 `cluster_name`
2. 运行 `terraform apply`
3. 更新 `helm/aws-load-balancer-controller/values-uat.yaml` 中的 `clusterName`

### 调整副本数
编辑 `helm/aws-load-balancer-controller/values-uat.yaml`：
```yaml
aws-load-balancer-controller:
  replicaCount: 3  # 改这里
```

## 监控指标

关键的监控项：
- ALB Controller pods 数量和状态
- 前端 pods 就绪数量
- Ingress ALB 地址是否已分配
- Argo CD 应用同步状态
- 安全组规则（ALB 应允许进出流量）

## 常见问题

### Q: 如何回滚到之前的版本？
```bash
# 查看历史
kubectl rollout history deployment/frontend -n default

# 回滚到上一个版本
kubectl rollout undo deployment/frontend -n default

# 或通过 Git 回滚，Argo CD 会自动同步
git revert <commit-sha>
git push
```

### Q: 如何添加 HTTPS？
需要配置证书。在 `helm/values-uat.yaml` 中添加：
```yaml
ingress:
  tls:
    - secretName: frontend-tls
      hosts:
        - frontend-uat.example.com
  annotations:
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP":80},{"HTTPS":443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
```

### Q: ALB 地址变了怎么办？
ALB 地址由 AWS 分配，不应该改变。如果需要固定地址，应该在 Route53 中创建 DNS 记录指向 ALB。

## 下一步

✅ 当前已设置完毕，可以访问前端
→ 若需生产环境，参考 `helm/values-prod.yaml` 配置
→ 若需更多应用，使用相同模式（Helm + Argo CD）部署
