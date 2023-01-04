# application-log-to-slack
`CloudWatch`에 로그 그룹에 구독 필터 트리거를 설정

## 환경
- Rumtime: Node.js 14.x (x86_64)
- Handler: index.handler
- Memory: 128MB
- timeout: 3초

## 필터 패턴
- 애플리케이션이 남기는 로그에 따라 다름 
    - 보통은 로그 레벨을 지정 (ex. `INFO`, `ERROR`, `DEBUG`)

## Reference
- https://southouse.tistory.com/22