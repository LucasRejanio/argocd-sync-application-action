<img alt="GitHub Actions" src="https://img.shields.io/badge/github%20actions%20-%232671E5.svg?&style=for-the-badge&logo=github%20actions&logoColor=white"/>

# Argocd Sync Application Action
This action has the objective of simplify sync application in the argocd

## Inputs

| Name | Description | Default | Required |
|--- |--- |--- | --- |
| environment-prefix | Environment prefix (dev, stg or prod) | Null | True |
| argocd-host | The environment from workflow | Null | True |
| argocd-application | Declar to set args for build | Null | True |

## Example usage

```yaml
- name: Argocd Sync Application
  uses: will-bank/argocd-sync-application-action@main
  with:
    environment-prefix: ${{ needs.build.outputs.environment-prefix }}
    argocd-host: ${{ needs.build.outputs.argocd-host }}
    argocd-application: ${{ needs.build.outputs.application-name }}
```
