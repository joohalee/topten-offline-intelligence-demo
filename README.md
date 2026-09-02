# TOPTEN Offline Intelligence — Concept Demo

레거시 POS 환경에서 회원 QR, 상품 바코드, 영수증 확인, 포인트 적립을 연결하고 본사에서 Customer 360과 캠페인 기회로 활용하는 흐름을 보여주는 인터랙티브 데모입니다.

## Demo story

1. `Store Capture`에서 데모 회원을 스캔합니다.
2. 구매 상품을 선택해 상품 태그 이벤트를 만듭니다.
3. 영수증을 확인하고 구매 및 포인트 적립을 완료합니다.
4. `Overview`, `Customer 360`, `Campaign Opportunity`, `Data Quality`에서 반영 결과를 확인합니다.

## Scope

- 모든 고객, 거래, 성과 수치는 가상 데이터입니다.
- 스캔·영수증·포인트 화면은 커스텀 연동 계층의 개념 예시입니다.
- AIRIS는 수집 이후의 데이터 통합, ID 연결, Customer 360, 분석을 담당하는 것으로 표현했습니다.
- 실제 결제 금액, 취소, 반품은 기존 POS 원장과 T+1 배치로 대사하는 구조입니다.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```
