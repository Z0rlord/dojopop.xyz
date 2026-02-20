# HashiCorp Vault Setup for Dojo Pop

## Why Vault?

- Centralized secret management
- Dynamic credentials (auto-rotate database passwords)
- Audit logging
- Access control by environment (dev/staging/prod)

## Quick Start

### 1. Install Vault (on your Hetzner VPS)

```bash
# Download and install
wget https://releases.hashicorp.com/vault/1.18.3/vault_1.18.3_linux_amd64.zip
unzip vault_1.18.3_linux_amd64.zip
sudo mv vault /usr/local/bin/

# Verify
vault version
```

### 2. Start Vault Server

```bash
# Create config
cat > vault-config.hcl << EOF
storage "file" {
  path = "/opt/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = true  # Enable TLS in production!
}

ui = true
EOF

# Create data directory
sudo mkdir -p /opt/vault/data

# Start Vault
vault server -config=vault-config.hcl
```

### 3. Initialize Vault

```bash
# In another terminal
export VAULT_ADDR='http://localhost:8200'

# Initialize (save the unseal keys and root token!)
vault operator init -key-shares=5 -key-threshold=3

# Unseal (run 3 times with different keys)
vault operator unseal <unseal-key-1>
vault operator unseal <unseal-key-2>
vault operator unseal <unseal-key-3>

# Login with root token
vault login <root-token>
```

### 4. Create Dojo Pop Secrets

```bash
# Enable KV secrets engine
vault secrets enable -path=dojopop kv-v2

# Add production secrets
vault kv put dojopop/production \
  DATABASE_URL="postgresql://..." \
  NEXTAUTH_SECRET="..." \
  RESEND_API_KEY="..." \
  CROSSMINT_SECRET_KEY="..."

# Add staging secrets
vault kv put dojopop/staging \
  DATABASE_URL="postgresql://..." \
  NEXTAUTH_SECRET="..."
```

### 5. Create Policies

```bash
# Production policy
cat > dojopop-prod.hcl << EOF
path "dojopop/production/*" {
  capabilities = ["read"]
}
EOF

vault policy write dojopop-production dojopop-prod.hcl

# Create AppRole for Netlify
vault auth enable approle

vault write auth/approle/role/netlify \
  token_policies="dojopop-production" \
  token_ttl=1h \
  token_max_ttl=4h
```

### 6. Get Credentials for Netlify

```bash
# Get Role ID
vault read auth/approle/role/netlify/role-id

# Get Secret ID
vault write -f auth/approle/role/netlify/secret-id
```

## Netlify Integration

Add to Netlify build command:

```bash
# Install Vault CLI
wget https://releases.hashicorp.com/vault/1.18.3/vault_1.18.3_linux_amd64.zip
unzip vault_1.18.3_linux_amd64.zip

# Fetch secrets
export VAULT_ADDR='https://your-vault-server:8200'
vault write auth/approle/login role_id=$VAULT_ROLE_ID secret_id=$VAULT_SECRET_ID

# Load secrets into environment
export DATABASE_URL=$(vault kv get -field=DATABASE_URL dojopop/production)
# ... etc

# Build
npm run build
```

## For Now: Simple Approach

Until Vault is ready, use Netlify's built-in environment variables:

1. Go to Netlify dashboard → Site settings → Environment variables
2. Add each variable from .env.example
3. Or use the Netlify CLI to import:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link site
netlify link

# Import env vars
netlify env:import .env
```

## Migration Path

1. **Now:** Use Netlify env vars (quickest)
2. **Soon:** Set up Vault on Hetzner
3. **Later:** Migrate all secrets to Vault
4. **Production:** Use Vault + dynamic database credentials
