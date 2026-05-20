#!/bin/bash
# ─── Haikyuu!! Character Image Helper ────────────────
# วิธีใช้: bash download-images.sh
#
# หมายเหตุ: Haikyuu Fandom Wiki บล็อค Direct Download
# ให้ดาวน์โหลดรูปด้วยตัวเองจาก:
#   https://haikyuu.fandom.com/wiki/<ชื่อตัวละคร>
# แล้ววางไฟล์ตาม path ด้านล่าง
# ─────────────────────────────────────────────────────

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Haikyuu!! Image Setup Guide            ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "📁 วางรูปตาม path ต่อไปนี้:"
echo ""
echo "🟠 Karasuno — images/characters/karasuno/"
echo "   hinata.jpg      → Shoyo Hinata"
echo "   kageyama.jpg    → Tobio Kageyama"
echo "   tsukishima.jpg  → Kei Tsukishima"
echo "   nishinoya.jpg   → Yu Nishinoya"
echo "   tanaka.jpg      → Ryunosuke Tanaka"
echo "   asahi.jpg       → Asahi Azumane"
echo "   daichi.jpg      → Daichi Sawamura"
echo "   sugawara.jpg    → Koushi Sugawara"
echo "   yamaguchi.jpg   → Tadashi Yamaguchi"
echo ""
echo "🔵 Aoba Johsai — images/characters/aoba-johsai/"
echo "   oikawa.jpg      → Tooru Oikawa"
echo "   iwaizumi.jpg    → Hajime Iwaizumi"
echo ""
echo "🔴 Nekoma — images/characters/nekoma/"
echo "   kuroo.jpg       → Tetsurou Kuroo"
echo "   kenma.jpg       → Kenma Kozume"
echo "   lev.jpg         → Lev Haiba"
echo ""
echo "⚫ Fukurodani — images/characters/fukurodani/"
echo "   bokuto.jpg      → Kotaro Bokuto"
echo "   akaashi.jpg     → Keiji Akaashi"
echo ""
echo "🟣 Shiratorizawa — images/characters/shiratorizawa/"
echo "   ushijima.jpg    → Wakatoshi Ushijima"
echo "   tendou.jpg      → Satori Tendou"
echo ""
echo "⚪ Inarizaki — images/characters/inarizaki/"
echo "   atsumu.jpg      → Atsumu Miya"
echo "   osamu.jpg       → Osamu Miya"
echo "   suna.jpg        → Rintaro Suna"
echo ""
echo "🔷 Others — images/characters/others/"
echo "   sakusa.jpg      → Kiyoomi Sakusa"
echo ""
echo "─────────────────────────────────────────────────"
echo "💡 แนะนำ: ค้นหาใน Google Images หรือ"
echo "   https://haikyuu.fandom.com/wiki/Haikyuu!!_Wiki"
echo ""
echo "✅ หากไม่มีรูป เว็บจะแสดง emoji placeholder อัตโนมัติ"
echo "   (ออกแบบให้ทำงานได้ดีทั้งมีและไม่มีรูป)"
echo ""

# แสดงสถานะรูปปัจจุบัน
echo "📊 สถานะรูปปัจจุบัน:"
TOTAL=0
FOUND=0
declare -A IMAGES=(
  ["images/characters/karasuno/hinata.jpg"]="Hinata"
  ["images/characters/karasuno/kageyama.jpg"]="Kageyama"
  ["images/characters/karasuno/tsukishima.jpg"]="Tsukishima"
  ["images/characters/karasuno/nishinoya.jpg"]="Nishinoya"
  ["images/characters/karasuno/tanaka.jpg"]="Tanaka"
  ["images/characters/karasuno/asahi.jpg"]="Asahi"
  ["images/characters/karasuno/daichi.jpg"]="Daichi"
  ["images/characters/karasuno/sugawara.jpg"]="Sugawara"
  ["images/characters/karasuno/yamaguchi.jpg"]="Yamaguchi"
  ["images/characters/aoba-johsai/oikawa.jpg"]="Oikawa"
  ["images/characters/aoba-johsai/iwaizumi.jpg"]="Iwaizumi"
  ["images/characters/nekoma/kuroo.jpg"]="Kuroo"
  ["images/characters/nekoma/kenma.jpg"]="Kenma"
  ["images/characters/nekoma/lev.jpg"]="Lev"
  ["images/characters/fukurodani/bokuto.jpg"]="Bokuto"
  ["images/characters/fukurodani/akaashi.jpg"]="Akaashi"
  ["images/characters/shiratorizawa/ushijima.jpg"]="Ushijima"
  ["images/characters/shiratorizawa/tendou.jpg"]="Tendou"
  ["images/characters/inarizaki/atsumu.jpg"]="Atsumu"
  ["images/characters/inarizaki/osamu.jpg"]="Osamu"
  ["images/characters/inarizaki/suna.jpg"]="Suna"
  ["images/characters/others/sakusa.jpg"]="Sakusa"
)

DIR="$(cd "$(dirname "$0")" && pwd)"
for path in "${!IMAGES[@]}"; do
  TOTAL=$((TOTAL+1))
  fullpath="$DIR/$path"
  if [ -f "$fullpath" ] && [ -s "$fullpath" ]; then
    echo "  ✓ ${IMAGES[$path]}"
    FOUND=$((FOUND+1))
  else
    echo "  ✗ ${IMAGES[$path]} (${path})"
  fi
done

echo ""
echo "  มีรูป $FOUND / $TOTAL ตัวละคร"
echo ""
