#!/usr/bin/env bash
# Seeds a demo vendor end-to-end through the api-gateway (:8080).
set -e
GW=${GW:-http://localhost:8080}
echo "Creating vendor..."
VID=$(curl -s -X POST $GW/api/vendors -H 'Content-Type: application/json' \
  -d '{"name":"Sharma Chaat Bhandar","cuisine":"chaat","lat":12.9726,"lng":77.5946,"source":"COMMUNITY_ADDED"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])")
echo "vendor=$VID"
curl -s -X POST $GW/api/status/$VID/go-live -H 'Content-Type: application/json' -d '{"lat":12.9726,"lng":77.5946}' >/dev/null
curl -s -X POST $GW/api/menu/$VID -H 'Content-Type: application/json' \
  -d '{"items":[{"name":"Pani Puri","price":30,"special":true},{"name":"Bhel","price":40}]}' >/dev/null
curl -s -X POST $GW/api/reviews/$VID -H 'Content-Type: application/json' -d '{"userId":"u1","rating":5,"comment":"Best!"}' >/dev/null
echo "Combined feed:"
curl -s "$GW/api/search/nearby?lat=12.9716&lng=77.5946&radiusKm=3" | python3 -m json.tool
