# 🚀 Installing Argo CD on Kubernetes

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



