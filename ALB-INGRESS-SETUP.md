# AWS Load Balancer Controller and Ingress Configuration Guide

This document explains how to deploy the AWS Load Balancer Controller and configure frontend Ingress.

## Complete Deployment Process

### Step 1: Create Infrastructure (Terraform)

First, ensure the EKS cluster is deployed via Terraform and the ALB Controller IAM role is created:

```bash
cd infra/environments/uat

# Initialize if not already done
terraform init

# Review planned changes
terraform plan

# Apply configuration
terraform apply

# Get ALB Controller role ARN (IMPORTANT!)
terraform output alb_controller_role_arn
```

**Save the ALB Controller role ARN output**, as you'll need it in the next step.

### Step 2: Update ALB Controller Helm Values

Use the ARN from Step 1 to update the ALB Controller configuration:

```bash
# Edit the file
vim helm/aws-load-balancer-controller/values-uat.yaml
```

Find this line and replace it with the actual ARN:

```yaml
eks.amazonaws.com/role-arn: "arn:aws:iam::YOUR_ACCOUNT_ID:role/k8s-practice-uat-alb-controller"
```

Example:
```yaml
eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/k8s-practice-uat-alb-controller"
```

### Step 3: Deploy Argo CD

If Argo CD hasn't been deployed yet, run:

```bash
chmod +x deploy-argocd.sh
./deploy-argocd.sh

# Get initial password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

### Step 4: Deploy ALB Controller and Frontend

Run the deployment script to automatically deploy all necessary components:

```bash
chmod +x deploy-alb-and-frontend.sh
./deploy-alb-and-frontend.sh
```

This script will:
1. Create AWS Load Balancer Controller Application
2. Create Frontend Application  
3. Wait for deployment to complete
4. Display frontend access URL

### Step 5 (Optional): Manual Deployment

If you prefer manual deployment, execute steps sequentially:

```bash
# Deploy ALB Controller
kubectl apply -f k8s/aws-load-balancer-controller-uat-app.yaml

# Wait for ALB Controller to be ready
kubectl rollout status deployment/aws-load-balancer-controller -n kube-system --timeout=5m

# Deploy frontend
kubectl apply -f k8s/frontend-uat-app.yaml

# Wait for frontend to be ready
kubectl rollout status deployment/frontend -n default --timeout=5m

# Get Ingress ALB address (wait 2-3 minutes)
kubectl get ingress -n default
```

## Verify Deployment

```bash
# Run the check script
chmod +x check-deployment.sh
./check-deployment.sh
```

Or check manually:

```bash
# Check ALB Controller
kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# Check frontend pods
kubectl get pods -n default -l app=frontend

# Check Ingress
kubectl get ingress -n default

# Get ALB address
kubectl get ingress frontend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# Check Argo CD Applications
kubectl get applications -n argocd
```

## Troubleshooting

### ALB Controller Pod Unable to Start

**Issue**: ALB Controller pods remain in CrashLoopBackOff or Pending state

**Troubleshooting steps**:

```bash
# View pod events
kubectl describe pod -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# View logs
kubectl logs -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# Common causes:
# 1. Incorrect role ARN - Check values-uat.yaml
# 2. Insufficient IAM permissions - Check infra/environments/uat/main.tf permissions policy
# 3. Cluster name mismatch - clusterName must match the Terraform cluster name
```

### Ingress Unable to Get ALB Address

**Issue**: `kubectl get ingress` shows empty HOSTNAME/ADDRESS

**Wait time**: ALB creation typically takes 2-3 minutes

```bash
# Watch continuously
kubectl get ingress -n default -w

# View detailed information
kubectl describe ingress frontend -n default

# View events
kubectl get events -n default --sort-by='.lastTimestamp'
```

### ALB Controller Permission Errors

**Error in logs**: `Failed to create load balancer`, `Access Denied`, etc.

**Troubleshooting**:

```bash
# 1. Confirm role ARN is correct
kubectl get sa aws-load-balancer-controller -n kube-system -o jsonpath='{.metadata.annotations.eks\.amazonaws\.com/role-arn}'

# 2. Check role policies in AWS
aws iam list-attached-role-policies --role-name k8s-practice-uat-alb-controller

# 3. View detailed IAM policy
aws iam get-role-policy --role-name k8s-practice-uat-alb-controller --policy-name aws-load-balancer-controller-policy
```

## Important Configuration Files

| File | Purpose |
|------|------|
| `infra/environments/uat/main.tf` | Create ALB Controller IAM role and permissions |
| `helm/aws-load-balancer-controller/Chart.yaml` | ALB Controller Helm Chart definition |
| `helm/aws-load-balancer-controller/values-uat.yaml` | ALB Controller UAT configuration (ARN update needed) |
| `helm/values-uat.yaml` | Frontend Ingress configuration |
| `k8s/aws-load-balancer-controller-uat-app.yaml` | Argo CD Application definition |
| `k8s/frontend-uat-app.yaml` | Frontend Argo CD Application definition |

## Access Frontend

After deployment, use the following to access the frontend:

```bash
# Get ALB address
ALB_ADDRESS=$(kubectl get ingress frontend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Frontend URL: http://$ALB_ADDRESS"
```

### Configure DNS or Local Hosts

**Option 1: Use Route53 (Recommended)**
- Create an A record in Route53 pointing to the ALB address

**Option 2: Edit local /etc/hosts**
```bash
# Add to /etc/hosts
<ALB_ADDRESS> frontend-uat.example.com
```

Routing will be based on the hostname configured in `helm/values-uat.yaml`.

## Next Steps

- [GitOps-Guide.md](GitOps-Guide.md) - Learn about the CI/CD process
- [README.md](README.md) - Overall project documentation
- [helm/aws-load-balancer-controller/README.md](helm/aws-load-balancer-controller/README.md) - Detailed ALB Controller documentation
