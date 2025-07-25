import importlib.util
from pathlib import Path

PARSER_PATH = Path(__file__).parent / "bb_language_parser.py"
spec = importlib.util.spec_from_file_location("bb_parser", PARSER_PATH)
bb_parser = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bb_parser)

samples = [
    "새 프로젝트 설계 구조 정리해줘",
    "급하게 커밋해야 해",
    "주석 좀 달아줄래?",
    "이번 변경사항 뭐 바뀌었나?",
    "브레인스토밍 아이디어 줘",
    "문서 가이드 업데이트해 줘",
]

print("\n=== 테스트 결과 ===")
for s in samples:
    intent, score = bb_parser.BBLanguageParser()._analyze_intent(s)
    print(f"{s:<25} → {intent.name:<10}  {score:.2f}")
