# resizing-images
`Cloudfront`와 `Lambda@Edge`를 연동하여 실시간 이미지 리사이징 구현

## 환경
- Rumtime: Node.js 12.x (x86_64)
- Handler: index.handler
- Memory: 256MB (메모리 추가 시 response 속도 개선)
- timeout: 15초

## 설정
- `Lambda`에 소스 업로드 전에 `npm install sharp` 실행
    - `Mac m1`의 경우에는 `--platform=linux --arch=x64` 옵션 추가
- 압축 파일로 소스 업로드 시에 람다에서 핸들러를 루트 경로에서 읽어 오기 때문에 `zip -r lambda.zip .` 명령어로 압축
- `Cloudfront`의 `behavior > Function associations > Origin response`에서 람다 엣지 실행
- 람다 엣지의 경우에는 `Lambda Layers`를 설정할 수 없음

## Reference
- https://heropy.blog/2019/07/21/resizing-images-cloudfrount-lambda/