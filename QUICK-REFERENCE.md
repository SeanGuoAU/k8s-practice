# Quick Reference Guide

## Executive Summary

Complete AWS ALB and Kubernetes Ingress configuration with GitOps-based automated deployment.

## Deployment Architecture

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

## Deployment Steps (Simplified)

### 1. Preparation Phase
```bash
cd infra/environments/uat
terraform apply
# Record: terraform output alb_controller_role_arn
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

## Key File Locations

| Purpose | File |
|------|------|
| ALB Controller IAM Configuration | `infra/environments/uat/main.tf` (Lines 78-177) |
| ALB Controller Helm Chart | `helm/aws-load-balancer-controller/` |
| Frontend Ingress Configuration | `helm/values-uat.yaml` (Lines 1-14) |
| Deployment Script | `deploy-alb-and-frontend.sh` |
| Check Script | `check-deployment.sh` |

## Common Commands

```bash
# View ALB Controller Status
kubectl get deployment aws-load-balancer-controller -n kube-system
kubectl logs -f deployment/aws-load-balancer-controller -n kube-system

# View Frontend Status
kubectl get deployment frontend -n default
kubectl get pods -n default

# Get ALB Address
kubectl get ingress frontend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# View Argo CD Applications
kubectl get applications -n argocd
kubectl describe application frontend-uat -n argocd

# Sync Applications
argocd app sync frontend-uat
argocd app sync aws-load-balancer-controller
```

## Quick Troubleshooting Checks

```bash
# 1. ALB Controller Unable to Start?
kubectl describe pod -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller
kubectl logs -f -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# Check:
# - 角色 ARN 正确？
# - 集群名称匹配？

# 2. Ingress Missing ALB Address?
kubectl describe ingress frontend -n default
# Wait 2-3 minutes for ALB creation

# 3. Frontend Pod Cannot Connect to Backend?
kubectl logs -f deployment/frontend -n default

# 4. Argo CD Application Cannot Sync?
kubectl describe application frontend-uat -n argocd
# 检查同步状态和错误信息
```

## Configuration Changes

### Change Frontend Hostname
编辑 `helm/values-uat.yaml`：
```yaml
ingress:
  hosts:
    - host: "your-domain.com"  # 改这里
```

### Change Cluster Name
1. Update Terraform: `cluster_name` in `infra/environments/uat/uat.tfvars`
2. 运行 `terraform apply`
3. 更新 `helm/aws-load-balancer-controller/values-uat.yaml` 中的 `clusterName`

### Adjust Replica Count
Edit `helm/aws-load-balancer-controller/values-uat.yaml`:
```yaml
aws-load-balancer-controller:
  replicaCount: 3  # 改这里
```

## Monitoring Metrics

Key monitoring items:
- ALB Controller pod count and status
- Frontend pod ready count
- Ingress ALB address assignment status
- Argo CD application sync status
- Security group rules (ALB should allow ingress/egress traffic)

## Frequently Asked Questions

### Q: How to rollback to previous version?
```bash
# View history
kubectl rollout history deployment/frontend -n default

# Rollback to previous version
kubectl rollout undo deployment/frontend -n default

# Or rollback via Git, Argo CD will auto-sync
git revert <commit-sha>
git push
```

### Q: How to add HTTPS?
Requires certificate configuration. Add to `helm/values-uat.yaml`:
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

### Q: What if ALB address changes?
ALB address is assigned by AWS and should not change. If a fixed address is needed, create a DNS record in Route53 pointing to the ALB.
ALB 地址由 AWS 分配，不应该改变。如果需要固定地址，应该在 Route53 中创建 DNS 记录指向 ALB。

## Next Steps

✅ Current setup is complete, frontend is now accessible
→ For production environment, refer to `helm/values-prod.yaml` configuration
→ For more applications, use the same pattern (Helm + Argo CD) for deployment
