# TOPTEN Offline Intelligence — Concept Demo

레거시 POS 환경에서 회원 QR, 상품 바코드, 영수증 확인, 포인트 적립을 연결하고 본사에서 Customer 360과 캠페인 기회로 활용하는 흐름을 보여주는 인터랙티브 데모입니다.

## Demo story

1. `Store Capture`에서 데모 회원을 스캔합니다.
2. 구매 상품을 선택해 상품 태그 이벤트를 만듭니다.
3. 영수증을 확인하고 구매 및 포인트 적립을 완료합니다.
4. `Overview`, `Customer 360`, `Campaign Opportunity`, `Data Quality`에서 반영 결과를 확인합니다.
5. `AI Decision Lab`에서 가상 데이터를 기반으로 OpenAI Analyst와 Gemini Challenger의 독립 분석, 합의·불일치 비교, 사람 승인 흐름을 실행합니다.

## AI Decision Lab

- 사전 정의된 가상 데이터와 응답을 사용하는 `SIMULATED DUAL-MODEL` 데모입니다.
- OpenAI와 Gemini가 같은 AIRIS 근거를 서로의 답을 보지 않고 병렬 분석합니다.
- Consensus Gate가 수치, 근거, 권고, 신뢰도를 비교합니다.
- 불일치 또는 신뢰도 80% 미만은 운영자 검토로 보냅니다.
- 승인 버튼은 AIQUA 캠페인 초안만 만들며 실제 메시지는 발송하지 않습니다.
- 실제 구축 시 모델 API 키는 서버에 보관하고 익명·집계 데이터만 전달합니다.

## Scope

- 모든 고객, 거래, 성과 수치는 가상 데이터입니다.
- 스캔·영수증·포인트 화면은 커스텀 연동 계층의 개념 예시입니다.
- AIRIS는 수집 이후의 데이터 통합, ID 연결, Customer 360, 분석을 담당하는 것으로 표현했습니다.
- OpenAI·Gemini 분석은 Appier 표준 제품 기능을 단정하는 것이 아니라, AIRIS 근거 데이터와 외부 모델을 결합하는 운영 아키텍처의 개념 예시입니다.
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
