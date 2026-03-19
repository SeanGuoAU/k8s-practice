#!/bin/bash
# Deploy ALB Controller and configure Ingress for frontend

set -e

NAMESPACE_ARGOCD="argocd"
NAMESPACE_KUBE_SYSTEM="kube-system"
NAMESPACE_DEFAULT="default"

echo "🚀 Deploying AWS Load Balancer Controller and Frontend Ingress..."
echo ""

# Step 1: Check if Argo CD is running
echo "1️⃣  Checking if Argo CD is deployed..."
if kubectl get namespace $NAMESPACE_ARGOCD &> /dev/null; then
    echo "✅ Argo CD namespace exists"
else
    echo "❌ Argo CD namespace not found. Please run deploy-argocd.sh first"
    exit 1
fi

# Step 2: Deploy ALB Controller via Argo CD
echo ""
echo "2️⃣  Deploying AWS Load Balancer Controller..."
kubectl apply -f k8s/aws-load-balancer-controller-uat-app.yaml
echo "✅ ALB Controller Application submitted to Argo CD"

# Step 3: Wait for ALB Controller deployment
echo ""
echo "3️⃣  Waiting for ALB Controller to be ready (this may take 2-3 minutes)..."
kubectl rollout status deployment/aws-load-balancer-controller -n $NAMESPACE_KUBE_SYSTEM --timeout=5m || {
    echo "⚠️  ALB Controller deployment in progress. Check status with:"
    echo "   kubectl get pods -n $NAMESPACE_KUBE_SYSTEM -l app.kubernetes.io/name=aws-load-balancer-controller"
}

# Step 4: Deploy Frontend Application
echo ""
echo "4️⃣  Deploying Frontend Application with Ingress..."
kubectl apply -f k8s/frontend-uat-app.yaml
echo "✅ Frontend Application submitted to Argo CD"

# Step 5: Wait for frontend deployment
echo ""
echo "5️⃣  Waiting for Frontend to be ready..."
kubectl rollout status deployment/frontend -n $NAMESPACE_DEFAULT --timeout=5m || {
    echo "⚠️  Frontend deployment in progress. Check status with:"
    echo "   kubectl get pods -n $NAMESPACE_DEFAULT"
}

# Step 6: Wait for Ingress ALB provisioning
echo ""
echo "6️⃣  Waiting for ALB to be provisioned (this may take 2-3 minutes)..."
for i in {1..30}; do
    INGRESS_ADDRESS=$(kubectl get ingress frontend -n $NAMESPACE_DEFAULT -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
    if [ ! -z "$INGRESS_ADDRESS" ]; then
        echo "✅ ALB provisioned successfully!"
        break
    fi
    echo "⏳ Waiting... ($i/30)"
    sleep 10
done

# Step 7: Display access information
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Frontend Access Information:"
echo ""
INGRESS_ADDRESS=$(kubectl get ingress frontend -n $NAMESPACE_DEFAULT -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "NOT_READY_YET")
if [ "$INGRESS_ADDRESS" = "NOT_READY_YET" ]; then
    echo "⚠️  ALB is still being provisioned. Try again in a few moments:"
    echo "   kubectl get ingress -n $NAMESPACE_DEFAULT"
else
    echo "🌐 Frontend URL: http://$INGRESS_ADDRESS"
    echo ""
    echo "Note: Make sure to update DNS or add entry to /etc/hosts if needed"
fi

echo ""
echo "📊 Verify deployments:"
echo ""
echo "ALB Controller status:"
echo "   kubectl get deployment -n $NAMESPACE_KUBE_SYSTEM aws-load-balancer-controller"
echo ""
echo "Frontend status:"
echo "   kubectl get deployment -n $NAMESPACE_DEFAULT frontend"
echo ""
echo "Ingress status:"
echo "   kubectl get ingress -n $NAMESPACE_DEFAULT"
echo ""
echo "Argo CD Applications:"
echo "   kubectl get applications -n $NAMESPACE_ARGOCD"
