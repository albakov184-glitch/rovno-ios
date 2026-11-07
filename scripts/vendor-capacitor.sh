#!/usr/bin/env bash
# Скачивает готовые бинарники Capacitor (Capacitor.xcframework, Cordova.xcframework)
# заранее, с повторами и проверкой контрольных сумм, и подключает их как локальный
# Swift-пакет. Так сборка не зависает, если Xcode не может скачать их сам.
# Запускать после каждого `npx cap sync ios`.
set -euo pipefail
cd "$(dirname "$0")/.."

VER=$(node -p "require('@capacitor/ios/package.json').version")
DIR=vendor/capacitor-swift-pm
BASE="https://github.com/ionic-team/capacitor-swift-pm"

if [ ! -f "$DIR/.ok-$VER" ]; then
  mkdir -p "$DIR"
  MANIFEST=$(curl -fsSL --retry 6 --retry-all-errors --connect-timeout 20 --max-time 60 "https://raw.githubusercontent.com/ionic-team/capacitor-swift-pm/$VER/Package.swift")
  for n in Capacitor Cordova; do
    want=$(printf '%s\n' "$MANIFEST" | grep -A2 "name: \"$n\"" | sed -n 's/.*checksum: "\([0-9a-f]*\)".*/\1/p')
    curl -fL --retry 6 --retry-all-errors --connect-timeout 20 --max-time 300 -o "$DIR/$n.zip" "$BASE/releases/download/$VER/$n.xcframework.zip"
    got=$(shasum -a 256 "$DIR/$n.zip" | cut -d' ' -f1)
    [ "$got" = "$want" ] || { echo "Контрольная сумма $n не совпала: $got != $want"; exit 1; }
    (cd "$DIR" && unzip -qo "$n.zip")
    [ -d "$DIR/$n.xcframework" ] || { echo "В архиве нет $n.xcframework"; ls -la "$DIR"; exit 1; }
  done
  cat > "$DIR/Package.swift" <<'SWIFT'
// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "capacitor-swift-pm",
    products: [
        .library(name: "Capacitor", targets: ["Capacitor"]),
        .library(name: "Cordova", targets: ["Cordova"])
    ],
    targets: [
        .binaryTarget(name: "Capacitor", path: "Capacitor.xcframework"),
        .binaryTarget(name: "Cordova", path: "Cordova.xcframework")
    ]
)
SWIFT
  touch "$DIR/.ok-$VER"
  echo "Capacitor $VER скачан"
fi

# ios/App/CapApp-SPM and node_modules/@capacitor/<plugin> are both three levels below the repo root
for f in ios/App/CapApp-SPM/Package.swift node_modules/@capacitor/*/Package.swift; do
  [ -f "$f" ] || continue
  perl -0pi -e 's#\.package\(url:\s*"https://github\.com/ionic-team/capacitor-swift-pm\.git",[^)]*\)#.package(name: "capacitor-swift-pm", path: "../../../vendor/capacitor-swift-pm")#g' "$f"
done
grep -l 'vendor/capacitor-swift-pm' ios/App/CapApp-SPM/Package.swift node_modules/@capacitor/*/Package.swift
