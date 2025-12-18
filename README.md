▶️ Run Locally (Python)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

uvicorn app.main:app --reload


기본 주소: http://127.0.0.1:8000

기본 콘텐츠: app/content/portfolio.md

🐳 Run with Docker
Build Image
docker build -t portfolio .

Run Container
docker run --rm -p 8000:8000 \
  -e PROFILE_NAME="Messier333" \
  portfolio


기본 주소: http://localhost:8000

환경변수로 프로필 이름 설정 가능

🐳 Run with Docker Compose (Recommended)
services:
  portfolio:
    build: .
    container_name: portfolio
    ports:
      - "8000:8000"
    environment:
      PROFILE_NAME: "Messier333"
      CONTENT_DIR: "/docs"
      DEFAULT_MD: "portfolio.md"
    volumes:
      - ./app/content:/docs:ro
    restart: unless-stopped

docker compose up -d --build


./app/content 폴더의 Markdown 파일을 컨테이너에 마운트

콘텐츠 수정 시 이미지 재빌드 불필요

코드와 콘텐츠 분리 구조