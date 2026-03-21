#!/bin/bash
# Check status of entire deployment

set -e

echo "🔍 Kubernetes Deployment Status Check"
echo ""

# Color definitions
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # Reset color

check_status() {
    local name=$1
    local namespace=$2
    local resource=$3
    
    local status=$(kubectl get $resource -n $namespace --no-headers=true 2>/dev/null | head -1)
    if [ -z "$status" ]; then
        echo -e "${RED}❌${NC} $name: Not found"
        return 1
    else
        echo -e "${GREEN}✅${NC} $name: Found"
        echo "   $status"
        return 0
    fi
}

echo "1. Argo CD"
echo "==========="
check_status "Argo CD Namespace" "argocd" "pod" || true
echo ""

echo "2. AWS Load Balancer Controller"
echo "==============================="
check_status "ALB Controller Deployment" "kube-system" "deployment/aws-load-balancer-controller" || true
check_status "ALB Controller Pods" "kube-system" "pod -l app.kubernetes.io/name=aws-load-balancer-controller" || true
echo ""

echo "3. Frontend"
echo "==========="
check_status "Frontend Deployment" "default" "deployment/frontend" || true
check_status "Frontend Pods" "default" "pod -l app=frontend" || true
echo ""

echo "4. Frontend Ingress"
echo "==================="
if kubectl get ingress -n default --no-headers=true 2>/dev/null | grep -q "frontend"; then
    echo -e "${GREEN}✅${NC} Frontend Ingress: Found"
    INGRESS=$(kubectl get ingress frontend -n default -o jsonpath='{.items[0]}' 2>/dev/null || echo "")
    if [ ! -z "$INGRESS" ]; then
        echo "   Ingress Name: $(kubectl get ingress frontend -n default -o jsonpath='{.metadata.name}')"
        ALB_ADDRESS=$(kubectl get ingress frontend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
        if [ -z "$ALB_ADDRESS" ]; then
            echo -e "   ${YELLOW}⏳ ALB Address: Provisioning...${NC}"
        else
            echo -e "   ${GREEN}🌐 ALB Address: http://$ALB_ADDRESS${NC}"
        fi
    fi
else
    echo -e "${RED}❌${NC} Frontend Ingress: Not found"
fi
echo ""

echo "5. Argo CD Applications"
echo "======================"
if kubectl get application -n argocd --no-headers=true 2>/dev/null | grep -q "aws-load-balancer-controller"; then
    echo -e "${GREEN}✅${NC} ALB Controller Application: Found"
else
    echo -e "${YELLOW}⚠️${NC} ALB Controller Application: Not found"
fi

if kubectl get application -n argocd --no-headers=true 2>/dev/null | grep -q "frontend-uat"; then
    echo -e "${GREEN}✅${NC} Frontend Application: Found"
else
    echo -e "${YELLOW}⚠️${NC} Frontend Application: Not found"
fi
echo ""

echo "6. Quick Diagnostics"
echo "===================="
echo ""
echo "ALB Controller logs (last 5 lines):"
kubectl logs -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller --tail=5 2>/dev/null || echo "No logs available"
echo ""

echo "Frontend logs (last 5 lines):"
kubectl logs -n default -l app=frontend --tail=5 2>/dev/null || echo "No logs available"
echo ""

echo "📝 Common troubleshooting commands:"
echo ""
echo "1. Check ALB Controller:"
echo "   kubectl describe deployment aws-load-balancer-controller -n kube-system"
echo ""
echo "2. Check Frontend:"  
echo "   kubectl describe deployment frontend -n default"
echo ""
echo "3. Check Ingress:"
echo "   kubectl describe ingress frontend -n default"
echo ""
echo "4. Check Argo CD sync status:"
echo "   kubectl describe application aws-load-balancer-controller -n argocd"
echo "   kubectl describe application frontend-uat -n argocd"
echo ""
