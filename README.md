<img src="./assets/argocd-logo.png" width="100">

# Argocd Sync Application Action
This action has the objective of simplify sync application in the argocd

## Inputs

| Name | Description | Default | Required |
|--- |--- |--- | --- |
| environment | Environment to run the action. | Null | True |
| argocd-host | ArgoCD access endpoint. | Null | True |
| argocd-user | ArgoCD access user. | Null | True |
| argocd-password | ArgoCD access password. | Null | True |
| argocd-application | Application to sync in the ArgoCD. | Null | True |

## Example usage

```yaml

- name: Argocd Sync Application
  uses: ${{ env.ORGANIZATION_OR_USER }}/argocd-sync-application-action@main
  with:
    environment: ${{ env.ENVIRONMENT }}
    argocd-host: ${{ env.YOUR_ARGOCD_HOST }}
    argocd-user: ${{ env.YOUR_ARGOCD_USER }}
    argocd-password: ${{ secrets.YOUR_ARGOCD_PASSWORD }}
    argocd-application: ${{ env.YOUR_ARGOCD_APPLICATION }}
```
