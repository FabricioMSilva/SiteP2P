#!/usr/bin/env pwsh

<#
.SYNOPSIS
    ✅ Verificador Final - Integração PIX Banco EFI
.DESCRIPTION
    Valida se tudo foi implementado corretamente
.EXAMPLE
    # No PowerShell (admin):
    .\verify-pix-setup.ps1
#>

Write-Host "`n" -ForegroundColor Green
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  ✅ VERIFICADOR FINAL - INTEGRAÇÃO PIX BANCO EFI             ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

$checks = @{
    "Arquivo route.ts"              = "app/api/pix/route.ts"
    "Componente Modal PIX"           = "components/PixModal.tsx"
    "Serviço PIX"                   = "lib/pixService.ts"
    "Variáveis de Ambiente"         = ".env.local"
    "Documentação Setup"             = "EFI_PIX_SETUP.md"
    "Guia Certificado"              = "PIX_CERTIFICATE_GUIDE.md"
    "QuickStart"                    = "QUICK_START_PIX.md"
    "Script de Teste"               = "test-pix.js"
    "Resumo Implementação"          = "IMPLEMENTATION_COMPLETE.md"
    "Início (Você está aqui)"       = "START_HERE_PIX.md"
}

Write-Host "📋 CHECKLIST DE ARQUIVOS CRIADOS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$missingFiles = @()
foreach ($check in $checks.GetEnumerator()) {
    $path = $check.Value
    if (Test-Path $path) {
        Write-Host "✅ $($check.Key)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($check.Key) - FALTANDO" -ForegroundColor Red
        $missingFiles += $check.Key
    }
}

Write-Host "`n"

if ($missingFiles.Count -eq 0) {
    Write-Host "✅ TODOS OS ARQUIVOS FOI CRIADOS COM SUCESSO!" -ForegroundColor Green
} else {
    Write-Host "❌ FALTAM $($missingFiles.Count) ARQUIVOS!" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
}

Write-Host "`n"
Write-Host "📦 DEPENDÊNCIAS INSTALADAS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$required = @("axios", "qrcode", "framer-motion", "next", "react")
$jsonContent = Get-Content -Path "package.json" | ConvertFrom-Json

foreach ($dep in $required) {
    if ($jsonContent.dependencies.$dep -or $jsonContent.devDependencies.$dep) {
        Write-Host "✅ $dep" -ForegroundColor Green
    } else {
        Write-Host "❌ $dep - FALTANDO" -ForegroundColor Red
    }
}

Write-Host "`n"
Write-Host "🔐 CONFIGURAÇÃO BANCO EFI" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if (Test-Path ".env.local") {
    $envContent = Get-Content -Path ".env.local"
    
    $checks_env = @{
        "EFI_PROD_CLIENT_ID"    = "Produção - Client ID"
        "EFI_PROD_CLIENT_SECRET"= "Produção - Client Secret"
        "EFI_HOMOLOG_CLIENT_ID" = "Homologação - Client ID"
        "EFI_HOMOLOG_CLIENT_SECRET" = "Homologação - Client Secret"
        "NEXT_PUBLIC_PIX_KEY"   = "Chave PIX para Receber"
    }
    
    foreach ($check in $checks_env.GetEnumerator()) {
        if ($envContent -match $check.Key) {
            Write-Host "✅ $($check.Value)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($check.Value) - NÃO CONFIGURADO" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ .env.local não encontrado!" -ForegroundColor Red
}

Write-Host "`n"
Write-Host "📁 ESTRUTURA DE PASTAS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$folders = @(
    ("app/api/pix", "API PIX")
    ("components", "Componentes")
    ("lib", "Utilitários")
    ("certs", "Certificados (⚠️ CRIAR MANUALMENTE)")
)

foreach ($folder in $folders) {
    if ($folder[0] -eq "certs") {
        if (Test-Path $folder[0]) {
            Write-Host "✅ $($folder[1]) - Pasta criada" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($folder[1]) - CRIAR PASTA MANUALMENTE" -ForegroundColor Yellow
        }
    } else {
        if (Test-Path $folder[0]) {
            Write-Host "✅ $($folder[1])" -ForegroundColor Green
        } else {
            Write-Host "❌ $($folder[1]) - FALTANDO" -ForegroundColor Red
        }
    }
}

Write-Host "`n"
Write-Host "🚀 PRÓXIMOS PASSOS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host @"
1️⃣  Criar pasta: mkdir certs
2️⃣  Copiar: producao-825472-IPtv.p12 → ./certs/
3️⃣  Editar: .env.local (colocar chave PIX)
4️⃣  Rodar: npm run dev
5️⃣  Testar: npm run test:pix
6️⃣  Abrir: http://localhost:3000 e clicar em um plano

"@ -ForegroundColor Cyan

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "`n"

Write-Host "📚 LEIA A DOCUMENTAÇÃO" -ForegroundColor Green
Write-Host "  → START_HERE_PIX.md (comece aqui!)" -ForegroundColor Cyan
Write-Host "  → QUICK_START_PIX.md (guia rápido)" -ForegroundColor Cyan
Write-Host "  → EFI_PIX_SETUP.md (técnico)" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "✅ Verificação concluída!" -ForegroundColor Green
Write-Host "`n"
