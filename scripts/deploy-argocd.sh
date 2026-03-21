#!/bin/bash
# Deploy Argo CD to EKS using Helm
set -e

NAMESPACE="argocd"
CHART_VERSION="7.3.2"

echo "===== Deploying Argo CD ====="

# 1. Add Helm repo
echo "[1/5] Adding Argo CD Helm repository..."
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

# 2. Create namespace
echo "[2/5] Creating namespace: $NAMESPACE"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# 3. Install Argo CD
echo "[3/5] Installing Argo CD (version $CHART_VERSION)..."
helm upgrade --install argocd argo/argo-cd \
  --namespace $NAMESPACE \
  --version $CHART_VERSION \
  --set configs.params."server\.insecure"=true \
  --set server.service.type=LoadBalancer \
  --set server.ingress.enabled=true \
  --set server.ingress.ingressClassName=alb \
  --set 'server.ingress.annotations.kubernetes\.io/ingress\.class=alb' \
  --set 'server.ingress.annotations.alb\.ingress\.kubernetes\.io/scheme=internet-facing' \
  --set 'server.ingress.annotations.alb\.ingress\.kubernetes\.io/target-type=ip' \
  --set 'server.ingress.annotations.alb\.ingress\.kubernetes\.io/listen-ports=[{"HTTP":80}]' \
  --set 'server.ingress.annotations.alb\.ingress\.kubernetes\.io/healthcheck-path=/healthz' \
  --set applicationSet.enabled=true \
  --set repoServer.autoscaling.enabled=true \
  --set repoServer.autoscaling.minReplicas=2

# 4. Wait for rollout
echo "[4/5] Waiting for Argo CD to be ready..."
kubectl rollout status deployment/argocd-server -n $NAMESPACE --timeout=5m

# 5. Create frontend-uat Application
echo "[5/5] Creating frontend-uat Application..."
kubectl apply -f k8s/frontend-uat-app.yaml

echo ""
echo "===== Deployment complete ====="
echo ""
echo "Get initial admin password:"
echo "  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d && echo"
echo ""
echo "Get Argo CD UI address:"
echo "  kubectl get ingress -n argocd"
echo ""
echo "Open the ADDRESS in your browser. Username: admin"
