# Ingress Configuration Guide

For detailed setup instructions, refer to the [official NGINX Ingress Controller documentation](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start).

## Install the NGINX Ingress Controller

Run the following command to install or upgrade the ingress-nginx controller:

```sh
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

If you encounter issues with the repository, update it with:

```sh
helm repo update
```

After just run
```sh
helm [install|upgrade] devops-frontend ./helm
```

## Common Issues

By default, Next.js does not use a base path. When accessing `/`, you may be redirected to `/pessoas` if that's your app's routing behavior and the ingress is set to forward `/` correctly. However, if you want to expose your app under a path prefix (such as `/frontend`) with your ingress setup, you must also set the `basePath` configuration in your Next.js `next.config.js` to match (e.g., `basePath: '/frontend'`) so that routing works as expected.
