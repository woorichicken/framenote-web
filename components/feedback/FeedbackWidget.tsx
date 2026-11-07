'use client';
// feedback-kit 배선 (부착 타입: global — 홈페이지 방문자 전원).
// 빠뜨리면 조용히 실패하는 것(webContextProviders · getDiagnostics · webDiagnosticsOptions · props 고정)을 모두 넣었다.
import { useEffect, useMemo, useState } from 'react';
import {
  buildReport, createLassoAdapter, FeedbackQueue, sharedDiagnostics, uuidv4,
  type ReportParts,
} from '@solhun/feedback-kit-core';
import {
  captureWebScreenshot, createWebStorage, FeedbackKit as Widget,
  webContextProviders, webDiagnosticsOptions,
} from '@solhun/feedback-kit-web';

const ENDPOINT = process.env.NEXT_PUBLIC_DP_FEEDBACK_URL ?? '';
const TOKEN = process.env.NEXT_PUBLIC_DP_FEEDBACK_KEY ?? '';

export default function FeedbackWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ENDPOINT || !TOKEN) return;
    // 진단은 위젯보다 먼저 설치하고, 위젯 자신의 전송은 진단에서 뺀다.
    sharedDiagnostics.install(webDiagnosticsOptions({ excludeMatcher: (req) => req.url.startsWith(ENDPOINT) }));
    setReady(true);
    return () => sharedDiagnostics.uninstall();
  }, []);

  // props 는 한 번만 만든다 — 인라인 함수로 넘기면 위젯이 매 렌더 다시 만들어져 쓰던 코멘트가 사라진다.
  const wiring = useMemo(() => {
    if (!ENDPOINT || !TOKEN) return null;
    const storage = createWebStorage();
    const sessionId = uuidv4();
    return {
      queue: new FeedbackQueue({ storage, adapter: createLassoAdapter({ endpoint: ENDPOINT, token: TOKEN }) }),
      createReport: (parts: ReportParts) =>
        buildReport(parts, {
          app: 'framenote-web', platform: 'web', sessionId, storage,
          ...webContextProviders(),
          getDiagnostics: () => sharedDiagnostics.snapshot(),
        }),
      getPathname: () => window.location.pathname,
    };
  }, []);

  if (!wiring || !ready) return null;
  return (
    <Widget
      queue={wiring.queue}
      createReport={wiring.createReport}
      capture={captureWebScreenshot}
      getPathname={wiring.getPathname}
      defaultMode="pick"
    />
  );
}
