# AWS Load Balancer Controller Helm Chart

This chart deploys the AWS Load Balancer Controller on Amazon EKS using IRSA (IAM Roles for Service Accounts).

## Prerequisites

1. The ALB Controller IAM role must be created (done via Terraform)
2. The cluster name must be set correctly
3. The role ARN annotation must match the actual IAM role ARN

## Installation

```bash
# Add the AWS EKS charts repository
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# Install the chart
helm install aws-load-balancer-controller \
  ./aws-load-balancer-controller \
  --namespace kube-system \
  --values values.yaml \
  --values values-uat.yaml
```

## Via Argo CD

Create an Application resource:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: aws-load-balancer-controller
  namespace: argocd
spec:
  destination:
    server: https://kubernetes.default.svc
    namespace: kube-system
  project: default
  source:
    repoURL: https://github.com/SeanGuoAU/k8s-practice.git
    targetRevision: main
    path: helm/aws-load-balancer-controller
    helm:
      valueFiles:
        - values.yaml
        - values-uat.yaml
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Verification

```bash
# Check the deployment
kubectl get deployment -n kube-system aws-load-balancer-controller

# Check the pods
kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller

# View logs
kubectl logs -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller -f
```
