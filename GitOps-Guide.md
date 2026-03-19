# Single-Repo GitOps Deployment Guide

## Architecture

```
Code push (Git)
    ↓
CI Pipeline: build + push image to ECR
    ↓
Sync Config: update image.tag in values-uat.yaml
    ↓
Git commit + push
    ↓
Argo CD detects change → auto deploy
```

---

## Deployment Steps

### 1. Deploy Argo CD to EKS (one-time setup)

```bash
cd /home/sean/k8s-practice
chmod +x deploy-argocd.sh
./deploy-argocd.sh
```

This script will:
- Add the Argo CD Helm repository
- Create the `argocd` namespace
- Install Argo CD with ALB Ingress
- Wait for the rollout to complete
- Create the `frontend-uat` Application

### 2. Verify Argo CD is running

```bash
# Check Argo CD pods
kubectl get pods -n argocd

# Get Ingress address (wait ~2 min for ALB to provision)
kubectl get ingress -n argocd

# Open in browser: http://<ALB_ADDRESS>
```

### 3. Get initial admin password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

Username: `admin`

### 4. Deploy AWS Load Balancer Controller

The ALB Controller is required for Ingress resources to work.

```bash
# Apply the AWS Load Balancer Controller Application
kubectl apply -f k8s/aws-load-balancer-controller-uat-app.yaml

# Wait for deployment
kubectl rollout status deployment/aws-load-balancer-controller -n kube-system --timeout=5m

# Verify the ALB Controller is running
kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller
```

### 5. Create Frontend Application

```bash
kubectl apply -f k8s/frontend-uat-app.yaml
```

### 6. Verify Application sync

```bash
# Check Application status
kubectl get application -n argocd

# View details
kubectl describe application frontend-uat -n argocd

# Check frontend deployment
kubectl get deployment -n default

# Check Ingress (wait ~2 min for ALB to provision)
kubectl get ingress -n default

# Get ALB address
kubectl get ingress frontend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

---

## Workflow Walkthrough

### Scenario: Push new code

1. **Push to main**
```bash
git push origin main
```

2. **GitHub Actions triggers automatically** (Frontend CI & Push workflow)
   - `ci` job: lint + type-check
   - `build-and-scan` job: build Docker image, run Grype CVE scan
   - `push-image` job: push image to ECR (tag = commit SHA)
   - `sync-config` job: **key step** — updates `image.tag` in `values-uat.yaml` and commits back to Git

3. **Argo CD detects the change**
   - Polls the repo, finds `values-uat.yaml` changed
   - Automatically runs `helm upgrade --install`
   - App is live within 1-2 minutes

4. **Verify deployment**
```bash
kubectl get pods -n default
kubectl get deployment frontend -n default -o yaml | grep image
```

---

## Key Files

| File | Purpose |
|------|---------|
| `deploy-argocd.sh` | One-time Argo CD deployment script |
| `k8s/frontend-uat-app.yaml` | Argo CD Application for frontend |
| `k8s/aws-load-balancer-controller-uat-app.yaml` | Argo CD Application for ALB Controller |
| `.github/workflows/frontend-ci-cd.yml` | CI pipeline + auto sync-config job |
| `helm/frontend/values-uat.yaml` | Frontend UAT environment values (auto-updated by CI) |
| `helm/aws-load-balancer-controller/values-uat.yaml` | ALB Controller configuration |
| `infra/environments/uat/main.tf` | Terraform to create ALB Controller IAM role |

---

## FAQ

### Q: How do I trigger a manual sync?
```bash
argocd app sync frontend-uat
```

### Q: How do I view sync logs?
```bash
# Argo CD repo server logs
kubectl logs -f deployment/argocd-repo-server -n argocd

# Frontend rollout status
kubectl rollout status deployment/frontend -n default
```

### Q: How do I roll back to a previous version?
```bash
# Find previous commit
git log --oneline helm/frontend/values-uat.yaml | head -5

# Revert the tag update
git revert <commit_sha>
git push

# Argo CD will auto-sync to the reverted state
```

### Q: Can I make manual changes to the cluster?
Yes, but they will be overwritten on the next sync. Argo CD enforces the Git state.
If you need to pause auto-sync temporarily, disable it in the Argo CD UI or via:
```bash
argocd app set frontend-uat --sync-policy none
```

---

## Next Steps

1. **Multi-environment**: Add `k8s/frontend-prod-app.yaml` pointing to `values-prod.yaml`
2. **Notifications**: Integrate Slack or email alerts for sync events
3. **RBAC**: Create dedicated ServiceAccounts and roles for Argo CD
4. **Secret management**: Integrate Sealed Secrets or AWS Secrets Manager
