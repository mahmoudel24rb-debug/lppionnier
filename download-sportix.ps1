# download-sportix.ps1
# Aspire un site Framer publie (HTML + assets) et reecrit toutes les URLs
# pour obtenir une copie 100% locale et editable.
# Usage : .\download-sportix.ps1  (ou -BaseUrl / -OutDir pour un autre site)

param(
  [string]$BaseUrl = 'https://sportix-template.framer.website',
  [string]$OutDir  = (Join-Path $PSScriptRoot 'sportix-local')
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
# Hotes sur lesquels Framer heberge les assets (images, fonts, modules JS, CSS)
$assetHostsPattern = 'https://(?:framerusercontent\.com|app\.framerstatic\.com|framer\.com/m|fonts\.gstatic\.com|fonts\.googleapis\.com)[A-Za-z0-9_\-./%?=&+;~:@]*'
$textExtensions = @('.js', '.mjs', '.css', '.svg', '.json', '.html', '.txt')
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Get-UrlBytes {
  param([string]$Url)
  $lastError = $null
  for ($i = 1; $i -le 3; $i++) {
    $wc = New-Object System.Net.WebClient
    $wc.Headers['User-Agent'] = $UA
    try { return $wc.DownloadData($Url) }
    catch { $lastError = $_; Start-Sleep -Milliseconds 500 }
    finally { $wc.Dispose() }
  }
  throw $lastError
}

function Get-ShortHash {
  param([string]$Text)
  $md5 = [Security.Cryptography.MD5]::Create()
  try { return ([BitConverter]::ToString($md5.ComputeHash([Text.Encoding]::UTF8.GetBytes($Text))) -replace '-', '').Substring(0, 8).ToLower() }
  finally { $md5.Dispose() }
}

$assetLocal   = @{}  # url -> chemin relatif local (assets/<host>/<chemin>)
$assetText    = @{}  # url -> contenu texte (reecrit en phase 2)
$assetQueue   = New-Object System.Collections.Queue
$failedAssets = New-Object System.Collections.ArrayList

# On conserve l'arborescence d'origine sous assets/<host>/ pour que les
# imports RELATIFS entre modules JS Framer continuent de fonctionner.
function Add-Asset {
  param([string]$Url)
  if ($assetLocal.ContainsKey($Url)) { return }
  try { $uri = [Uri]$Url } catch { return }
  $segments = @($uri.AbsolutePath.Trim('/') -split '/' | Where-Object { $_ -ne '' } | ForEach-Object {
    ([Uri]::UnescapeDataString($_) -replace '[^A-Za-z0-9._-]', '_')
  })
  if ($segments.Count -eq 0) { $segments = @('index') }
  $leaf = $segments[-1]
  if ($leaf.Length -gt 100) { $leaf = $leaf.Substring($leaf.Length - 100) }
  if ($uri.Query) {
    # meme image declinee en plusieurs tailles (?scale-down-to=...) -> fichiers distincts
    $ext  = [IO.Path]::GetExtension($leaf)
    $stem = if ($ext) { $leaf.Substring(0, $leaf.Length - $ext.Length) } else { $leaf }
    $leaf = '{0}_q{1}{2}' -f $stem, (Get-ShortHash $uri.Query), $ext
  }
  if ($uri.Host -eq 'fonts.googleapis.com' -and $leaf -notmatch '\.css$') { $leaf += '.css' }
  $segments[-1] = $leaf
  # URL "prefixe" se terminant par / (base concatenee au runtime par le JS) :
  # on la mappe pour la reecriture mais il n'y a rien a telecharger
  if ($uri.AbsolutePath.EndsWith('/')) {
    $assetLocal[$Url] = ((@('assets', $uri.Host) + $segments) -join '/') + '/'
    return
  }
  $assetLocal[$Url] = (@('assets', $uri.Host) + $segments) -join '/'
  $assetQueue.Enqueue($Url)
}

function Save-LocalFile {
  param([string]$Rel, [byte[]]$Bytes, [string]$Text)
  $full = Join-Path $OutDir ($Rel -replace '/', '\')
  $dir = Split-Path $full -Parent
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  # NB: un [string] non fourni vaut '' (jamais $null) -> tester la presence du parametre
  if ($PSBoundParameters.ContainsKey('Text')) { [IO.File]::WriteAllText($full, $Text, $utf8NoBom) }
  else { [IO.File]::WriteAllBytes($full, $Bytes) }
}

function Get-PageFileName {
  param([string]$Path)
  $trimmed = $Path.Trim('/')
  if ($trimmed -eq '') { return 'index.html' }
  return (($trimmed -replace '[^A-Za-z0-9/_-]', '_') -replace '/', '--') + '.html'
}

# ---------- Phase 1 : crawl des pages ----------
$baseTrim = $BaseUrl.TrimEnd('/')
$baseEsc  = [regex]::Escape($baseTrim)
$pageMap  = @{ '/' = 'index.html' }
$pageHtml = @{}
$pageQueue = New-Object System.Collections.Queue
$pageQueue.Enqueue('/')

# Le sitemap donne la liste complete des pages (les liens du menu ne suffisent pas toujours)
try {
  $sitemap = [Text.Encoding]::UTF8.GetString((Get-UrlBytes "$baseTrim/sitemap.xml"))
  foreach ($m in [regex]::Matches($sitemap, '<loc>\s*([^<]+?)\s*</loc>')) {
    try { $loc = [Uri]$m.Groups[1].Value } catch { continue }
    if ($loc.Host -ne ([Uri]$BaseUrl).Host) { continue }
    $p = $loc.AbsolutePath
    if ($p -ne '/') { $p = '/' + $p.Trim('/') }
    if (-not $pageMap.ContainsKey($p)) { $pageMap[$p] = Get-PageFileName $p; $pageQueue.Enqueue($p) }
  }
  Write-Host ("Sitemap : {0} page(s) trouvee(s)" -f $pageMap.Count)
}
catch { Write-Host 'Pas de sitemap.xml, decouverte via les liens uniquement.' }

while ($pageQueue.Count -gt 0) {
  $path = $pageQueue.Dequeue()
  $url = if ($path -eq '/') { "$baseTrim/" } else { $baseTrim + $path }
  Write-Host "Page : $path"
  try { $html = [Text.Encoding]::UTF8.GetString((Get-UrlBytes $url)) }
  catch { Write-Warning "Echec page $path : $($_.Exception.Message)"; continue }
  $html = $html -replace '&amp;', '&'
  $pageHtml[$path] = $html

  foreach ($m in [regex]::Matches($html, 'href="(?:' + $baseEsc + ')?(/[^"#?]*)"')) {
    $p = $m.Groups[1].Value
    if ($p -match '\.[A-Za-z0-9]+$') { continue }  # fichiers (sitemap.xml, etc.)
    if ($p -ne '/') { $p = '/' + $p.Trim('/') }
    if (-not $pageMap.ContainsKey($p)) { $pageMap[$p] = Get-PageFileName $p; $pageQueue.Enqueue($p) }
  }
  foreach ($m in [regex]::Matches($html, $assetHostsPattern)) { Add-Asset $m.Value }
}

# ---------- Phase 2 : telechargement recursif des assets ----------
# Les modules JS importent d'autres modules par URL absolue : on scanne
# chaque fichier texte telecharge pour decouvrir de nouveaux assets.
$done = 0
while ($assetQueue.Count -gt 0) {
  $aurl = $assetQueue.Dequeue()
  $rel = $assetLocal[$aurl]
  $ext = [IO.Path]::GetExtension($rel).ToLower()
  try { $bytes = Get-UrlBytes $aurl }
  catch { [void]$failedAssets.Add($aurl); Write-Warning "Echec asset : $aurl"; continue }
  if ($textExtensions -contains $ext) {
    $text = [Text.Encoding]::UTF8.GetString($bytes)
    foreach ($m in [regex]::Matches($text, $assetHostsPattern)) { Add-Asset $m.Value }
    # les modules JS Framer importent aussi des chunks par chemin RELATIF
    if ($ext -eq '.mjs' -or $ext -eq '.js') {
      $baseUri = [Uri]$aurl
      foreach ($m in [regex]::Matches($text, '["''`](\.{1,2}/[^"''`\s]+?\.(?:mjs|js))["''`]')) {
        try { Add-Asset (New-Object Uri($baseUri, $m.Groups[1].Value)).AbsoluteUri } catch {}
      }
      # donnees CMS Framer : new URL('./x.framercms', '<base>.js') puis /modules/ -> /cms/
      foreach ($m in [regex]::Matches($text, 'new URL\([`''"](\.[^`''"]+?\.framercms)[`''"],\s*[`''"](https://framerusercontent\.com/[^`''"]+?)[`''"]\)')) {
        try {
          $cms = (New-Object Uri((New-Object Uri($m.Groups[2].Value)), $m.Groups[1].Value)).AbsoluteUri
          Add-Asset ($cms -replace '/modules/', '/cms/')
        } catch {}
      }
    }
    $assetText[$aurl] = $text
  }
  else {
    Save-LocalFile -Rel $rel -Bytes $bytes
  }
  $done++
  if ($done % 25 -eq 0) { Write-Host ("  {0} assets telecharges, {1} en attente..." -f $done, $assetQueue.Count) }
}
Write-Host ("Assets : {0} telecharges, {1} echec(s)" -f $done, $failedAssets.Count)

# ---------- Phase 3 : reecriture des URLs ----------
# Les URLs les plus longues d'abord (une URL avec ?query contient l'URL sans query)
$urlsByLength = @($assetLocal.Keys | Sort-Object { $_.Length } -Descending)

# Dans les JS/CSS : chemins ABSOLUS depuis la racine du serveur ("/assets/...").
# Ils sont valides a la fois pour les imports ESM et pour les URLs injectees
# dans le DOM (img src, fonts...), contrairement aux chemins relatifs au module.
foreach ($aurl in @($assetText.Keys)) {
  $text = $assetText[$aurl]
  foreach ($u in $urlsByLength) {
    if ($text.IndexOf($u) -ge 0) { $text = $text.Replace($u, '/' + $assetLocal[$u]) }
  }
  Save-LocalFile -Rel $assetLocal[$aurl] -Text $text
}

$pagesByLength = @($pageMap.Keys | Sort-Object { $_.Length } -Descending)
foreach ($path in @($pageHtml.Keys)) {
  $html = $pageHtml[$path]
  foreach ($u in $urlsByLength) {
    if ($html.IndexOf($u) -ge 0) { $html = $html.Replace($u, './' + $assetLocal[$u]) }
  }
  foreach ($p in $pagesByLength) {
    $f = './' + $pageMap[$p]
    if ($p -eq '/') {
      $html = $html.Replace('href="' + $baseTrim + '/"', 'href="' + $f + '"')
      $html = $html.Replace('href="' + $baseTrim + '"', 'href="' + $f + '"')
      $html = $html.Replace('href="/"', 'href="' + $f + '"')
    }
    else {
      $html = $html.Replace('href="' + $baseTrim + $p + '/"', 'href="' + $f + '"')
      $html = $html.Replace('href="' + $baseTrim + $p + '"', 'href="' + $f + '"')
      $html = $html.Replace('href="' + $p + '/"', 'href="' + $f + '"')
      $html = $html.Replace('href="' + $p + '"', 'href="' + $f + '"')
    }
  }
  # analytics (Framer + Google) : inutiles en local, et gtag.js BLOQUE le
  # parseur HTML si le reseau le fait trainer -> page jamais hydratee
  $html = [regex]::Replace($html, '<script[^>]*(?:events\.framer\.com|googletagmanager\.com|google-analytics\.com)[^>]*>\s*</script>', '')
  # Deux shims pour le fonctionnement hors serveur Framer :
  # 1. new URL(x, '/assets/...') exige une base absolue -> prefixe location.origin
  # 2. les requetes CMS 'x.framercms?range=a-b,c-d' attendent la concatenation
  #    de tranches d'octets -> on emule ce protocole cote client
  $urlShim = '<script>(function(){var N=window.URL;window.URL=new Proxy(N,{construct:function(T,a){if(typeof a[1]==="string"&&a[1].charAt(0)==="/"&&a[1].charAt(1)!=="/"){a[1]=location.origin+a[1]}return new T(a[0],a[1])}});var F=window.fetch;window.fetch=function(input,init){try{var u=typeof input==="string"?input:(input&&typeof input.url==="string"?input.url:String(input));var m=u.match(/^([^?]*\.framercms)\?(?:.*&)?range=([^&]*)/);if(m){var ranges=decodeURIComponent(m[2]).split(",").map(function(p){var q=p.split("-");return[parseInt(q[0],10),parseInt(q[1],10)]});return F(m[1]).then(function(res){return res.arrayBuffer()}).then(function(buf){var src=new Uint8Array(buf),total=0;ranges.forEach(function(r){total+=r[1]-r[0]+1});var out=new Uint8Array(total),off=0;ranges.forEach(function(r){out.set(src.subarray(r[0],r[1]+1),off);off+=r[1]-r[0]+1});return new Response(out,{status:200})})}}catch(e){}return F.apply(this,arguments)};})();</script>'
  $html = $html -replace '<head>', ('<head>' + $urlShim)
  Save-LocalFile -Rel $pageMap[$path] -Text $html
}

Write-Host ''
Write-Host ('Termine ! {0} page(s) et {1} asset(s) dans : {2}' -f $pageHtml.Count, $assetLocal.Count, $OutDir)
if ($failedAssets.Count -gt 0) {
  Write-Host 'Assets en echec :'
  $failedAssets | ForEach-Object { Write-Host "  $_" }
}
Write-Host ''
Write-Host 'Pour lancer le site en local (necessaire pour les animations JS) :'
Write-Host "  cd `"$OutDir`""
Write-Host '  npx serve .          (ou : python -m http.server 8000)'
