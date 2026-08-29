$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dir = Join-Path $root "images\slides"
$out = Join-Path $root "js\slides.js"

if (-not (Test-Path -LiteralPath $dir)) {
  Write-Error "images\slides フォルダがありません: $dir"
  exit 1
}

$names = Get-ChildItem -LiteralPath $dir -File |
  Where-Object { $_.Extension -match '^\.(jpe?g|png|gif|webp|bmp|avif)$' } |
  Sort-Object @{ Expression = { [regex]::Replace($_.Name, '\d+', { param($m) $m.Value.PadLeft(6, '0') }) } } |
  ForEach-Object { $_.Name }

if ($names.Count -eq 0) {
  Write-Error "images\slides に画像(jpg/png/gif/webp/bmp/avif)がありません。"
  exit 1
}

$list = ($names | ForEach-Object { "  '$_'" }) -join ",`r`n"
$content = "// このファイルは update-slides.ps1 を実行すると自動生成されます`r`nconst SLIDES = [`r`n$list`r`n];`r`n"

[System.IO.File]::WriteAllText($out, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "更新しました: $($names.Count) 枚の画像 -> $out"