# ============================================
# Seed de Produtos no KitBox (via API)
# Salva uma cópia em scripts/seed-products.ps1
# Uso:
#   - padrão (idempotente):  cole e execute
#   - apagar tudo e recriar: cole e execute com a flag -ClearFirst
# ============================================

param([switch]$ClearFirst)

# --- Função util: obter URL da API a partir do frontend/.env.local se existir ---
function Get-ApiUrl {
  $envPath = Join-Path $PSScriptRoot "frontend\.env.local"
  if (-not (Test-Path $envPath)) {
    # tenta relativo ao diretório atual, caso esteja rodando de outro lugar
    $envPath = "frontend\.env.local"
  }
  if (Test-Path $envPath) {
    try {
      $lines = Get-Content $envPath -Raw | Out-String
      $m = [regex]::Match($lines, '(?m)^\s*NEXT_PUBLIC_API_URL\s*=\s*(.+?)\s*$')
      if ($m.Success) { return $m.Groups[1].Value.Trim() }
    } catch { }
  }
  return "http://localhost:5238"
}

$api = Get-ApiUrl

Write-Host "`nAPI: $api" -ForegroundColor Cyan

# --- Sanity check /health ---
try {
  $h = Invoke-RestMethod "$api/health" -TimeoutSec 5
  if ($h.status -ne "ok") { throw "health check não retornou ok" }
  Write-Host "Health OK ($($h.utc))" -ForegroundColor Green
} catch {
  Write-Host "Não consegui conversar com a API em $api/health. Suba o backend e tente de novo." -ForegroundColor Red
  return
}

# --- Catálogo base (ajuste à vontade) ---
$catalog = @(
  @{ name="Colar Minimalista de Prata"; description="Prata 925";            category="Colares";   price=129.90; quantity=20 }
  @{ name="Pulseira Couro Preto";        description="Couro legítimo";      category="Pulseiras"; price=89.90;  quantity=15 }
  @{ name="Anel Solitário Dourado";      description="Folheado 18k";        category="Anéis";     price=159.90; quantity=25 }
  @{ name="Brinco Argola Aço";           description="Aço inox";            category="Brincos";   price=49.90;  quantity=30 }
  @{ name="Relógio Sport";               description="Cronômetro";          category="Relógios";  price=299.90; quantity=12 }
  @{ name="Gargantilha Pérola";          description="Pérolas naturais";    category="Colares";   price=349.00; quantity=8  }
  @{ name="Anel Ônix";                   description="Pedra ônix";          category="Anéis";     price=129.00; quantity=9  }
  @{ name="Pulseira Prata Fina";         description="Prata 925";           category="Pulseiras"; price=139.00; quantity=11 }
  @{ name="Brinco Gotinha";              description="Banho ouro 18k";      category="Brincos";   price=79.00;  quantity=4  }
  @{ name="Relógio Minimal";             description="Pulseira silicone";   category="Relógios";  price=189.90; quantity=22 }
)

# --- Helpers ---
function Count-ByName([string]$name) {
  try {
    $q = [uri]::EscapeDataString($name)
    $resp = Invoke-RestMethod "$api/products?page=1&pageSize=1&name=$q"
    return [int]$resp.total
  } catch { return 0 }
}

function Delete-AllProducts {
  Write-Host "`nApagando todos os produtos..." -ForegroundColor Yellow
  $page = 1
  $pageSize = 100
  $deleted = 0

  while ($true) {
    try {
      $resp = Invoke-RestMethod "$api/products?page=$page&pageSize=$pageSize"
    } catch {
      break
    }
    if (-not $resp.items -or $resp.items.Count -eq 0) { break }

    foreach ($it in $resp.items) {
      try {
        Invoke-RestMethod "$api/products/$($it.id)" -Method DELETE | Out-Null
        $deleted++
      } catch {
        Write-Host "Falha ao deletar id=$($it.id): $($_.Exception.Message)" -ForegroundColor Red
      }
    }
    if (($page * $pageSize) -ge $resp.total) { break }
    $page++
  }

  Write-Host "Removidos: $deleted" -ForegroundColor Yellow
}

# --- (Opcional) limpar antes ---
if ($ClearFirst) {
  Delete-AllProducts
}

# --- Criar faltantes (idempotente) ---
$created = 0
$skipped = 0

foreach ($p in $catalog) {
  if ((Count-ByName $p.name) -gt 0) {
    $skipped++
    continue
  }

  $body = [pscustomobject]@{
    name        = [string] $p.name
    description = [string] $p.description
    category    = [string] $p.category
    price       = [decimal]$p.price
    quantity    = [int]    $p.quantity
  } | ConvertTo-Json -Depth 3

  try {
    Invoke-RestMethod "$api/products" -Method POST -ContentType "application/json" -Body $body | Out-Null
    $created++
  } catch {
    Write-Host "Falhou criar: $($p.name) -> $($_.Exception.Message)" -ForegroundColor Red
  }
}

Write-Host "`nCriados: $created | Já existiam: $skipped" -ForegroundColor Cyan

# --- Listar para conferência ---
try {
  $resp = Invoke-RestMethod "$api/products?page=1&pageSize=100&sortBy=name&sortDir=asc"
  $resp.items | Format-Table name, category, price, quantity
  Write-Host "Total no banco: $($resp.total)`n" -ForegroundColor Green
} catch {
  Write-Host "Não consegui listar os produtos no final. API está de pé?" -ForegroundColor Red
}

# --- Salvar uma cópia reutilizável do script ---
try {
  $scriptsDir = Join-Path $PWD "scripts"
  if (-not (Test-Path $scriptsDir)) { New-Item -ItemType Directory -Path $scriptsDir | Out-Null }
  $selfPath = Join-Path $scriptsDir "seed-products.ps1"
  $myContent = $MyInvocation.MyCommand.ScriptBlock.ToString()
  $myContent | Set-Content -Path $selfPath -Encoding UTF8
  Write-Host "Script salvo em: $selfPath" -ForegroundColor DarkGray
} catch {
  Write-Host "Não consegui salvar a cópia em scripts/seed-products.ps1 (sem impacto)." -ForegroundColor DarkGray
}

