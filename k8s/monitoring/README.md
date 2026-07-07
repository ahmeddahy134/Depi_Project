# Monitoring Namespace

Deployed via Helm (Section 9 of the handbook), not raw manifests:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm install prometheus prometheus-community/prometheus -n monitoring
helm install grafana grafana/grafana -n monitoring
```

Dashboards are exported as JSON into `monitoring/grafana-dashboards/` at the repo root
and provisioned automatically via the Grafana sidecar.
