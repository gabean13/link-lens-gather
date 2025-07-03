
interface LinkAnalysisResult {
  title: string;
  description: string;
  summary: string;
  image: string;
  tags: string[];
  folder: string;
  content?: string;
}

export class LinkAnalyzer {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchPageContent(url: string): Promise<string> {
    try {
      // CORS 문제로 직접 fetch가 어려우므로 프록시 서비스 사용
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        // HTML에서 텍스트만 추출
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // 불필요한 요소 제거
        const elementsToRemove = doc.querySelectorAll('script, style, nav, header, footer, aside');
        elementsToRemove.forEach(el => el.remove());
        
        // 메인 콘텐츠 추출
        const content = doc.body?.textContent || doc.textContent || '';
        return content.replace(/\s+/g, ' ').trim().slice(0, 3000); // 3000자로 제한
      }
      
      throw new Error('페이지 내용을 가져올 수 없습니다');
    } catch (error) {
      console.error('페이지 내용 가져오기 실패:', error);
      // 페이지 내용을 가져올 수 없는 경우 URL만 사용
      return `웹사이트: ${url}`;
    }
  }

  async analyzeWithGemini(url: string, content: string): Promise<LinkAnalysisResult> {
    const prompt = `
다음 웹페이지를 분석해서 JSON 형태로 결과를 제공해주세요:

URL: ${url}
내용: ${content}

다음 형식으로 JSON을 반환해주세요:
{
  "title": "페이지의 적절한 제목 (한국어, 최대 100자)",
  "description": "페이지 내용을 요약한 설명 (한국어, 최대 200자)",
  "summary": "페이지의 핵심 내용을 3-4줄로 요약 (한국어)",
  "tags": ["관련", "태그", "배열", "최대", "5개"],
  "folder": "적절한 폴더 분류 (개발/코딩, 디자인/UI-UX, 뉴스/트렌드, 학습/교육, 블로그/아티클, 도구/서비스, 비즈니스/마케팅, 라이프스타일, 기타 중 하나)"
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.
`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('API 응답에서 텍스트를 찾을 수 없습니다');
      }

      // JSON 파싱
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(cleanedText);
      
      // 기본 이미지 설정 (URL 기반)
      const domain = new URL(url).hostname.toLowerCase();
      let defaultImage = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop';
      
      if (domain.includes('github')) {
        defaultImage = 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=200&fit=crop';
      } else if (domain.includes('youtube')) {
        defaultImage = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop';
      } else if (domain.includes('blog') || domain.includes('medium')) {
        defaultImage = 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop';
      }

      return {
        ...analysis,
        image: defaultImage,
        content: content.slice(0, 1000) // 미리보기용 컨텐츠
      };
    } catch (error) {
      console.error('Gemini API 분석 실패:', error);
      throw new Error(`AI 분석 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  async analyzeUrl(url: string): Promise<LinkAnalysisResult> {
    const content = await this.fetchPageContent(url);
    return await this.analyzeWithGemini(url, content);
  }
}
