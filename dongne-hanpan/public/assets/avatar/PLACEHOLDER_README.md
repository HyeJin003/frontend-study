# Avatar Asset 폴더 구조

```
public/assets/avatar/
├── male/
│   ├── FASHIONISTA/   body.png  head.png  top.png  bottom.png  shoes.png  accessory.png
│   ├── NORMAL/        body.png  head.png  top.png  bottom.png  shoes.png
│   └── TERRORIST/     body.png  head.png  top.png  bottom.png  shoes.png
├── female/
│   └── (동일 구조)
└── items/
    └── {productId}/   top.png  (상점에서 구매한 아이템 이미지)
```

## 이미지 규격
- 포맷: PNG (투명 배경 필수)
- 권장 사이즈: 512×512px (정사각형)
- 캐릭터 실제 영역: 하단 중앙 기준, 전신이 80% 이내에 들어오도록
- 각 레이어는 동일한 캔버스 크기여야 z-index 합성이 정확함

## 현재 상태
AI 이미지 생성 대기 중 — 이미지 없으면 해당 레이어 자동 스킵 (AvatarLayer onError 처리)
