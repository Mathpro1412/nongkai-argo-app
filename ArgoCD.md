# 🚀 Welcome to Argo CD

This guide provides step-by-step instructions to install **Argo CD**, a declarative GitOps continuous delivery tool for Kubernetes.


## 🛠️ Prerequisites

- Kubernetes Cluster
- `kubectl` CLI
- `argocd` CLI *(optional)*


## 📦 Installation Steps

### 1. Create the Argo CD Namespace

```bash
kubectl create namespace argocd
```

### 2. Install Argo CD Using the Official Manifests

```
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 3. Verify the Argo CD Pods

```
kubectl get pods -n argocd
```

### 4. Expose the Argo CD API Server (for Local Access)

```
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### 5. Get the Initial Admin Password

```
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
```

### 6. Add SSH Credentials for Private Git Repository Access

To allow Argo CD to access your **private Git repository via SSH**, follow these steps:

   - **Generate an SSH Key:**
     Run the following command to generate a new SSH key pair:

     ```bash
     ssh-keygen -t ed25519 -C "argocd@your-org" -f argocd_ssh_key
     ```

     This will create:
        - `argocd_ssh_key` — the **private key**
        - `argocd_ssh_key.pub` — the **public key**

   - **Add the SSH Public Key to Your Git Repository:**
     Add `argocd_ssh_key.pub` as a **Deploy Key** to your Git repository:

- **Add the SSH Public Key to Your Git Repository:**
     Go to the following file in your repo:
     [argocd-repo-creds.yaml](https://github.com/jumpbox-academy/argocd-levis/blob/main/02_repo-credential/argocd-repo-creds.yaml)
     Paste the content of `argocd_ssh_key` (private key) into the `sshPrivateKey:` field:
     
    ```yaml
    sshPrivateKey: |
    -----BEGIN OPENSSH PRIVATE KEY-----
    ...your key here...
    -----END OPENSSH PRIVATE KEY-----
    ```
    
    - **Apply the Secret to the Cluster:**
    ```bash
    kubectl apply -f argocd-repo-creds.yaml
    ```

# ✅ Step-by-Step: Expose Argo CD via Ingress

### 1. Install an Ingress Controller (e.g., NGINX Ingress)
If you're running a **bare-metal or self-hosted cluster**, install the NGINX Ingress Controller using:
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/baremetal/deploy.yaml
```
### 2. Change Service Type to LoadBalancer
By default, the **ingress-nginx-controller** service is of type **ClusterIP.**
Update it to ***LoadBalancer** so traffic can reach it from outside:

```
kubectl edit svc ingress-nginx-controller -n ingress-nginx
```

change this line:

```yaml
spec:
  type: LoadBalancer
```

### 3. Create Ingress Resource for Argo CD
```yaml
sshPrivateKey: |
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd
  namespace: argocd
spec:
  ingressClassName: nginx
  rules:
  - host: jojo.saritrat   #  <-------  Replace with your domain --------
    http:
      paths:
      - backend:
          service:
            name: argocd-server
            port:
              number: 80
        path: /
        pathType: Prefix
```

Apply the resource:

```
kubectl apply -f argocd-ingress.yaml
```

### 4. Map Domain to Ingress Node IP
Get the IP of your Kubernetes node:
```
kubectl get nodes -o wide
```
Then map the IP to your domain (for local testing, edit /etc/hosts):
```
<YOUR_NODE_IP> argocd.example.com
```
### 5. Configure Argo CD to Run Without TLS (Optional for Local Ingress)

To allow Argo CD to be accessed via Ingress over HTTP (without HTTPS/TLS), you can disable TLS on the `argocd-server` by setting:

Go to the file in your repo: [argocd-cmd-params-cm.yaml](https://github.com/jumpbox-academy/argocd-levis/blob/main/01_installation/02_argocd-cmd-params-cm.yaml) Save the above YAML content into a file named **argocd-cmd-params-cm.yaml.**


- Apply the ConfigMap to your Kubernetes cluster:
    ```
    kubectl apply -f argocd-cmd-params-cm.yaml
    ```
- Restart the Argo CD server deployment to apply the changes:
    ```
    kubectl rollout restart deployment argocd-server -n argocd
    ```

### 6. Access Argo CD

You can now visit:
```
https://jojo.saritrat
```

### 🎉 Welcome to Argo CD

![Welcome to Argo CD](48377fd3-fc66-4d87-8982-15718132d05e.jpeg)