import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BellRing,
  Bot,
  Boxes,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Clock3,
  Database,
  ExternalLink,
  Fingerprint,
  FileSearch,
  Gauge,
  Gift,
  GitCompareArrows,
  LayoutDashboard,
  Link2,
  LoaderCircle,
  LockKeyhole,
  Menu,
  MessageSquareText,
  PackageCheck,
  QrCode,
  ReceiptText,
  RefreshCw,
  ScanBarcode,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  WalletCards,
  Zap,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type NavKey = 'overview' | 'ai' | 'capture' | 'customer' | 'campaign' | 'quality'
type Product = { id: string; name: string; category: string; color: string; price: number; code: string }

const products: Product[] = [
  { id: 'p1', name: '쿨에어 크루넥 티', category: '티셔츠', color: '오프화이트', price: 15900, code: 'MSD2TS1201' },
  { id: 'p2', name: '와이드 데님 팬츠', category: '데님', color: '인디고', price: 39900, code: 'MSD3DP2002' },
  { id: 'p3', name: '베이직 옥스포드 셔츠', category: '셔츠', color: '라이트 블루', price: 29900, code: 'MSD2WS3104' },
  { id: 'p4', name: '라이트 윈드 재킷', category: '아우터', color: '차콜', price: 49900, code: 'MSD4JP4107' },
]

const navItems: { key: NavKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'ai', label: 'AI Decision Lab', icon: BrainCircuit },
  { key: 'capture', label: 'Store Capture', icon: ScanBarcode },
  { key: 'customer', label: 'Customer 360', icon: UserRound },
  { key: 'campaign', label: 'Campaign Opportunity', icon: Target },
  { key: 'quality', label: 'Data Quality', icon: ShieldCheck },
]

const trendData = [
  { day: '8/27', identified: 45, member: 37 },
  { day: '8/28', identified: 47, member: 39 },
  { day: '8/29', identified: 50, member: 41 },
  { day: '8/30', identified: 52, member: 43 },
  { day: '8/31', identified: 55, member: 46 },
  { day: '9/1', identified: 57, member: 48 },
  { day: '9/2', identified: 61, member: 51 },
]

const storeData = [
  { name: '강남점', rate: 72, volume: 1832 },
  { name: '홍대점', rate: 64, volume: 1564 },
  { name: '명동점', rate: 59, volume: 1942 },
  { name: '잠실점', rate: 55, volume: 1410 },
  { name: '부산점', rate: 43, volume: 1268 },
]

const opportunities = [
  { title: '태그 후 미구매 리타겟팅', audience: '18,420', lift: '+12.8%', channel: '앱푸시 · 카카오', desc: '상품 태그는 있었지만 24시간 내 구매가 없는 고객', tone: 'red' },
  { title: '오프라인 신규 → 온라인 전환', audience: '9,850', lift: '+9.4%', channel: '앱푸시 · 이메일', desc: '최근 30일 첫 매장 구매 후 온라인 행동이 없는 고객', tone: 'blue' },
  { title: '데님 구매자 크로스셀', audience: '7,310', lift: '+7.1%', channel: 'AI 개인화 추천', desc: '데님 구매 후 14일 내 상의 탐색 신호가 있는 고객', tone: 'violet' },
]

const aiScenarios = [
  {
    id: 'identity',
    label: '매장 식별률 원인',
    query: '최근 7일 회원 식별률이 가장 낮은 매장과 원인을 분석하고, 다음 행동을 제안해줘.',
    openai: {
      confidence: 92,
      finding: '부산점 식별률은 43.0%로 전사 평균 61.3%보다 18.3%p 낮습니다. 18시 이후 회원 QR 스캔 누락률이 주간 대비 31% 높습니다.',
      action: '저녁 근무조에 QR 스캔 안내를 강화하고 비회원 영수증의 모바일 회원증 전환을 A/B 테스트합니다.',
    },
    gemini: {
      confidence: 88,
      finding: '부산점 저녁 시간대 이상은 확인되지만 직원 운영 문제로 단정하기 어렵습니다. 같은 시간 POS 영수증 매칭 지연이 평균 2.1시간 발생했습니다.',
      action: 'QR 운영 개선과 함께 POS 배치 지연을 분리 측정해야 원인 오판을 막을 수 있습니다.',
    },
    consensus: '부산점 2주 파일럿: 근무조별 QR 스캔율과 POS 매칭 지연을 동시에 측정하고, 비회원 영수증에 가입 인센티브를 노출합니다.',
    audience: '부산점 최근 30일 비식별 구매 11,840건',
    agreement: '부산점과 저녁 시간대가 우선 개선 대상이라는 점에 합의',
    disagreement: '주원인이 매장 운영인지 POS 지연인지 추가 검증 필요',
  },
  {
    id: 'tag',
    label: '태그 후 미구매',
    query: '상품 태그 후 구매하지 않은 고객 중 지금 캠페인으로 전환 가능성이 높은 대상을 찾아줘.',
    openai: {
      confidence: 90,
      finding: '최근 7일 태그 후 미구매는 8,620명이며 쿨에어 크루넥 티가 2,140명으로 가장 큽니다. 24시간 내 재방문 고객의 전환 가능성이 높습니다.',
      action: '24시간 내 앱푸시와 카카오 메시지로 조회 상품 기반 리타겟팅을 권장합니다.',
    },
    gemini: {
      confidence: 94,
      finding: '재고 부족·최근 반품·수신 미동의 고객을 제외하면 실제 실행 가능 대상은 6,480명입니다. 전체 8,620명 발송은 과대 타기팅입니다.',
      action: '재고 보유 매장 반경과 동의 상태를 적용한 6,480명으로 대상을 축소해야 합니다.',
    },
    consensus: '실행 가능 고객 6,480명을 대상으로 할인 없는 코디 콘텐츠와 10% 쿠폰을 50:50 테스트합니다.',
    audience: '동의·재고·빈도 제한 통과 6,480명',
    agreement: '쿨에어 상품군과 24시간 이내 재접촉이 최우선이라는 점에 합의',
    disagreement: '원시 대상 8,620명과 실행 가능 대상 6,480명의 정의 차이',
  },
  {
    id: 'omni',
    label: '오프라인→온라인',
    query: '첫 오프라인 구매 후 온라인 구매로 전환할 가능성이 높은 고객군과 최적 액션을 알려줘.',
    openai: {
      confidence: 87,
      finding: '최근 30일 첫 오프라인 구매 고객 9,850명이 온라인 미구매 상태입니다. 구매 후 3일 이내 앱 방문군의 예상 전환율은 18.6%입니다.',
      action: '첫 구매 48시간 후 온라인 전용 코디 추천과 무료배송 혜택을 제안합니다.',
    },
    gemini: {
      confidence: 91,
      finding: '9,850명 중 마케팅 동의, 앱 설치, 최근 온라인 휴면 기준을 모두 충족하는 고객은 7,940명입니다. 무료배송은 고가치군에 한정해야 합니다.',
      action: '예측 LTV 상위 30%에는 무료배송, 나머지에는 개인화 콘텐츠만 제안합니다.',
    },
    consensus: '실행 가능 7,940명을 LTV로 분기해 혜택 비용을 통제하고 10% 대조군으로 증분 매출을 측정합니다.',
    audience: '온라인 미구매·수신 동의 고객 7,940명',
    agreement: '구매 후 48시간과 앱 방문 신호가 핵심 전환 시점이라는 점에 합의',
    disagreement: '무료배송 혜택의 전체 적용 여부는 비용 실험 필요',
  },
]

const currency = (value: number) => new Intl.NumberFormat('ko-KR').format(value)

function Logo() {
  return (
    <div className="logo-lockup">
      <div className="logo-mark">10</div>
      <div>
        <strong>TOPTEN</strong>
        <span>OFFLINE INTELLIGENCE</span>
      </div>
    </div>
  )
}

function ConceptBadge() {
  return <span className="concept-badge"><Sparkles size={12} /> CONCEPT DEMO</span>
}

function App() {
  const [active, setActive] = useState<NavKey>('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [memberScanned, setMemberScanned] = useState(false)
  const [selected, setSelected] = useState<Product[]>([])
  const [purchaseComplete, setPurchaseComplete] = useState(false)
  const [agentAnswer, setAgentAnswer] = useState('')

  const subtotal = selected.reduce((sum, item) => sum + item.price, 0)
  const points = Math.floor(subtotal * 0.01)

  const resetCapture = () => {
    setMemberScanned(false)
    setSelected([])
    setPurchaseComplete(false)
  }

  const toggleProduct = (product: Product) => {
    if (purchaseComplete) return
    setSelected((current) => current.some((p) => p.id === product.id)
      ? current.filter((p) => p.id !== product.id)
      : [...current, product])
  }

  const navigate = (key: NavKey) => {
    setActive(key)
    setMobileNav(false)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="메뉴 닫기"><X /></button>
        <Logo />
        <div className="sidebar-context">
          <span>Workspace</span>
          <button><Building2 size={15} /> TOPTEN HQ <ChevronDown size={14} /></button>
        </div>
        <nav>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} className={active === key ? 'active' : ''} onClick={() => navigate(key)}>
              <Icon size={19} /> {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <div className="note-icon"><Database size={17} /></div>
          <strong>Demo Data</strong>
          <p>본 화면의 고객·거래·성과 수치는 모두 가상 데이터입니다.</p>
        </div>
        <div className="sidebar-user">
          <div className="avatar">HQ</div>
          <div><strong>Retail Data Team</strong><span>Admin workspace</span></div>
        </div>
      </aside>

      {mobileNav && <div className="nav-scrim" onClick={() => setMobileNav(false)} />}

      <main>
        <header className="topbar">
          <button className="menu-btn" onClick={() => setMobileNav(true)} aria-label="메뉴 열기"><Menu /></button>
          <div className="topbar-date"><Clock3 size={15} /> Last synced 2026. 09. 02. 14:32</div>
          <div className="topbar-actions">
            <button className="icon-btn"><Search size={19} /></button>
            <button className="icon-btn has-dot"><BellRing size={19} /></button>
            <ConceptBadge />
          </div>
        </header>

        <div className="page-wrap">
          {active === 'overview' && <Overview purchaseComplete={purchaseComplete} onNavigate={navigate} agentAnswer={agentAnswer} setAgentAnswer={setAgentAnswer} />}
          {active === 'ai' && <AIDecisionLab purchaseComplete={purchaseComplete} />}
          {active === 'capture' && (
            <StoreCapture
              memberScanned={memberScanned}
              selected={selected}
              purchaseComplete={purchaseComplete}
              subtotal={subtotal}
              points={points}
              onMember={() => setMemberScanned(true)}
              onProduct={toggleProduct}
              onComplete={() => setPurchaseComplete(true)}
              onReset={resetCapture}
              onNavigate={navigate}
            />
          )}
          {active === 'customer' && <Customer360 purchaseComplete={purchaseComplete} points={points} selected={selected} onNavigate={navigate} />}
          {active === 'campaign' && <Campaigns purchaseComplete={purchaseComplete} />}
          {active === 'quality' && <DataQuality purchaseComplete={purchaseComplete} />}
        </div>
      </main>
    </div>
  )
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="page-title-row">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
      {action}
    </div>
  )
}

function MetricCard({ label, value, delta, icon: Icon, accent = 'dark', sub }: { label: string; value: string; delta?: string; icon: typeof Activity; accent?: string; sub?: string }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${accent}`}><Icon size={20} /></div>
      <div className="metric-copy"><span>{label}</span><strong>{value}</strong>{sub && <small>{sub}</small>}</div>
      {delta && <span className="metric-delta"><TrendingUp size={13} /> {delta}</span>}
    </div>
  )
}

function Overview({ purchaseComplete, onNavigate, agentAnswer, setAgentAnswer }: { purchaseComplete: boolean; onNavigate: (key: NavKey) => void; agentAnswer: string; setAgentAnswer: (value: string) => void }) {
  const answer = (type: number) => {
    const answers = [
      '부산점의 회원 식별률이 43%로 가장 낮습니다. 전사 평균 대비 –18%p이며, 비회원 영수증의 QR 전환 유도부터 점검하는 것이 좋습니다.',
      '최근 7일 상품 태그 31,840건 중 8,620건이 구매로 이어지지 않았습니다. 쿨에어 티셔츠가 2,140건으로 가장 큰 재접촉 기회입니다.',
      '오프라인 첫 구매 고객 중 14일 내 온라인 구매 전환은 9.4%입니다. 앱 설치 및 첫 온라인 주문 쿠폰 대상 9,850명이 확인됩니다.',
    ]
    setAgentAnswer(answers[type])
  }
  return (
    <>
      <PageTitle
        eyebrow="Offline Customer Data Command Center"
        title="매장의 구매 순간을, 고객 이해의 시작점으로"
        description="레거시 POS를 교체하지 않고 회원·상품·영수증 이벤트를 연결해 오프라인 데이터를 활용 가능한 고객 신호로 전환합니다."
        action={<button className="primary-btn" onClick={() => onNavigate('capture')}><ScanBarcode size={17} /> 데모 거래 시작</button>}
      />

      {purchaseComplete && (
        <div className="success-strip"><CircleCheck size={20} /><div><strong>방금 완료한 강남점 거래가 반영되었습니다.</strong><span>회원 식별 · 상품 2건 · 영수증 검증 · 포인트 적립 · Customer 360 동기화 완료</span></div><button onClick={() => onNavigate('customer')}>고객 보기 <ArrowRight size={15} /></button></div>
      )}

      <section className="metric-grid four">
        <MetricCard label="오늘 오프라인 거래" value={purchaseComplete ? '24,813' : '24,812'} delta="8.2%" icon={ReceiptText} accent="red" sub="전일 동시간 대비" />
        <MetricCard label="고객 식별 거래율" value={purchaseComplete ? '61.4%' : '61.3%'} delta="4.6%p" icon={Fingerprint} accent="blue" sub="회원·영수증 연결" />
        <MetricCard label="태그 → 구매 전환" value="72.9%" delta="3.1%p" icon={Tag} accent="violet" sub="최근 7일" />
        <MetricCard label="오프라인 기여 매출" value={purchaseComplete ? '₩1.284B' : '₩1.284B'} delta="11.6%" icon={WalletCards} accent="green" sub="식별 고객 기준" />
      </section>

      <section className="dashboard-grid">
        <div className="panel span-2">
          <div className="panel-head"><div><span className="panel-kicker">IDENTITY TREND</span><h2>오프라인 고객 식별률</h2></div><div className="legend"><span className="red-dot" /> 식별 거래 <span className="gray-dot" /> 회원 스캔</div></div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs><linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e4002b" stopOpacity={0.22}/><stop offset="95%" stopColor="#e4002b" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ececec" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8a8a8a', fontSize: 12 }} />
                <YAxis domain={[30, 70]} axisLine={false} tickLine={false} tick={{ fill: '#8a8a8a', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e7e7e7', boxShadow: '0 10px 30px rgba(0,0,0,.08)' }} formatter={(v) => `${v}%`} />
                <Area type="monotone" dataKey="identified" stroke="#e4002b" strokeWidth={2.5} fill="url(#redArea)" />
                <Area type="monotone" dataKey="member" stroke="#777" strokeWidth={1.7} strokeDasharray="5 4" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel live-panel">
          <div className="panel-head"><div><span className="panel-kicker">LIVE PIPELINE</span><h2>오늘의 데이터 흐름</h2></div><span className="live-pill"><i /> LIVE</span></div>
          <div className="pipeline-list">
            {([
              ['POS 배치 수신', '24,812', '97.8%', Database],
              ['회원 ID 연결', '15,212', '61.3%', Link2],
              ['상품 태그 수신', '31,840', '99.2%', ScanBarcode],
              ['포인트 원장 반영', '14,706', '98.6%', Gift],
            ] as const).map(([label, count, rate, Icon], index) => (
              <div className="pipeline-row" key={String(label)}><div className="pipeline-icon"><Icon size={17} /></div><div><strong>{label}</strong><span>{count} events</span></div><em>{rate}</em>{index < 3 && <div className="connector" />}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid lower">
        <div className="panel">
          <div className="panel-head"><div><span className="panel-kicker">STORE BENCHMARK</span><h2>매장별 식별 거래율</h2></div><button className="text-btn" onClick={() => onNavigate('quality')}>상세 보기 <ArrowRight size={14} /></button></div>
          <div className="mini-bar-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeData} margin={{ top: 5, right: 0, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ededed" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#777', fontSize: 11 }} />
                <YAxis domain={[0, 80]} axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f7f7f7' }} formatter={(v) => `${v}%`} />
                <Bar dataKey="rate" radius={[5, 5, 0, 0]}>{storeData.map((_, index) => <Cell key={index} fill={index === 4 ? '#e4002b' : '#171717'} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel agent-panel span-2">
          <div className="agent-title"><div className="agent-symbol"><Sparkles size={20} /></div><div><span className="panel-kicker">TOPTEN DATA AGENT</span><h2>질문으로 바로 찾는 매장 기회</h2></div></div>
          {!agentAnswer ? (
            <div className="suggested-questions">
              <p>본사 담당자가 궁금한 내용을 선택해 보세요.</p>
              <button onClick={() => answer(0)}><MessageSquareText size={15} /> 식별률이 가장 낮은 매장은?</button>
              <button onClick={() => answer(1)}><MessageSquareText size={15} /> 태그 후 미구매 상품은?</button>
              <button onClick={() => answer(2)}><MessageSquareText size={15} /> 오프라인→온라인 전환 기회는?</button>
            </div>
          ) : (
            <div className="agent-answer"><div><Sparkles size={17} /></div><p>{agentAnswer}</p><button onClick={() => setAgentAnswer('')}>다른 질문</button></div>
          )}
          <div className="agent-input"><span>예: 지난주 강남점의 신규회원 전환이 오른 이유는?</span><Send size={17} /></div>
        </div>
      </section>
    </>
  )
}

function AIDecisionLab({ purchaseComplete }: { purchaseComplete: boolean }) {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [runState, setRunState] = useState<'idle' | 'running' | 'done'>('idle')
  const [approved, setApproved] = useState(false)
  const scenario = aiScenarios[scenarioIndex]

  const chooseScenario = (index: number) => {
    setScenarioIndex(index)
    setRunState('idle')
    setApproved(false)
  }

  const runAnalysis = () => {
    setRunState('running')
    setApproved(false)
    window.setTimeout(() => setRunState('done'), 1700)
  }

  return (
    <>
      <PageTitle
        eyebrow="Governed Multi-model Intelligence"
        title="두 모델이 독립적으로 보고, 합의된 근거만 실행으로"
        description="AIRIS의 가상 오프라인 데이터를 OpenAI Analyst와 Gemini Challenger가 각각 분석합니다. Consensus Gate가 수치·근거·권고를 비교하고, 사람 승인 이후에만 AIQUA 캠페인 초안으로 전달합니다."
        action={<span className="simulation-badge"><BrainCircuit size={16} /> SIMULATED DUAL-MODEL</span>}
      />

      <div className="ai-scope-banner">
        <CircleAlert size={19} />
        <div><strong>현재 화면은 가상 데이터와 사전 정의된 AI 응답을 사용하는 개념 데모입니다.</strong><span>운영 전환 시 OpenAI·Gemini API 키는 서버에 보관하고, AIRIS에서 조회한 승인된 데이터만 모델에 전달합니다.</span></div>
      </div>

      <section className="ai-top-grid">
        <div className="panel ai-query-panel">
          <div className="panel-head"><div><span className="panel-kicker">BUSINESS QUESTION</span><h2>분석할 질문을 선택하세요</h2></div><span className="data-ready"><i /> Synthetic data ready</span></div>
          <div className="scenario-tabs">
            {aiScenarios.map((item, index) => <button key={item.id} className={scenarioIndex === index ? 'active' : ''} onClick={() => chooseScenario(index)}>{item.label}</button>)}
          </div>
          <div className="query-box"><MessageSquareText size={20} /><p>{scenario.query}</p><button><Search size={15} /></button></div>
          <div className="query-controls">
            <div><span>분석 범위</span><strong>최근 7–30일 · 전체 매장</strong></div>
            <div><span>개인정보 정책</span><strong><LockKeyhole size={13} /> PII Masked</strong></div>
            <button className="run-analysis" onClick={runAnalysis} disabled={runState === 'running'}>
              {runState === 'running' ? <><LoaderCircle className="spin" size={17} /> 두 모델 분석 중</> : <><Zap size={17} /> 이중 모델 분석 실행</>}
            </button>
          </div>
        </div>

        <aside className="panel data-foundation">
          <div className="panel-head"><div><span className="panel-kicker">SYNTHETIC DATA FOUNDATION</span><h2>이번 분석의 근거 데이터</h2></div><Database size={19} /></div>
          <div className="data-source-list">
            <div><span className="source-icon red"><ReceiptText size={16} /></span><p><strong>오프라인 거래</strong><small>영수증 · SKU · 금액 · 매장</small></p><em>{purchaseComplete ? '182,431' : '182,430'}</em></div>
            <div><span className="source-icon blue"><Fingerprint size={16} /></span><p><strong>통합 고객</strong><small>익명 Customer Key · 동의</small></p><em>96,840</em></div>
            <div><span className="source-icon violet"><Activity size={16} /></span><p><strong>행동 이벤트</strong><small>태그 · 앱 조회 · 메시지 반응</small></p><em>1.84M</em></div>
            <div><span className="source-icon green"><Gift size={16} /></span><p><strong>포인트 원장</strong><small>적립 · 사용 · 취소 · 반품</small></p><em>{purchaseComplete ? '117,921' : '117,920'}</em></div>
          </div>
          <div className="freshness-row"><Clock3 size={14} /><span>실시간 이벤트 + T+1 POS 대사</span><strong>품질 98.7%</strong></div>
        </aside>
      </section>

      {runState === 'idle' && <ModelArchitecture />}
      {runState === 'running' && <ModelRunning />}
      {runState === 'done' && (
        <>
          <section className="model-compare-grid">
            <ModelResult name="OpenAI Analyst" role="Primary reasoner" tone="openai" confidence={scenario.openai.confidence} finding={scenario.openai.finding} action={scenario.openai.action} />
            <ModelResult name="Gemini Challenger" role="Independent verifier" tone="gemini" confidence={scenario.gemini.confidence} finding={scenario.gemini.finding} action={scenario.gemini.action} />
          </section>

          <section className="panel consensus-panel">
            <div className="consensus-head"><div className="consensus-symbol"><GitCompareArrows size={22} /></div><div><span className="panel-kicker">CONSENSUS GATE · PASSED WITH CONDITION</span><h2>두 모델의 합의와 차이를 분리했습니다</h2></div><span className="consensus-score"><Gauge size={15} /> 종합 신뢰도 {Math.round((scenario.openai.confidence + scenario.gemini.confidence) / 2)}%</span></div>
            <div className="consensus-columns">
              <div className="agreement-box"><span><CircleCheck size={15} /> AGREEMENT</span><p>{scenario.agreement}</p></div>
              <div className="disagreement-box"><span><CircleAlert size={15} /> NEEDS VALIDATION</span><p>{scenario.disagreement}</p></div>
            </div>
            <div className="final-recommendation"><div><Sparkles size={19} /></div><div><span>최종 권고안</span><strong>{scenario.consensus}</strong><small>실행 대상 · {scenario.audience}</small></div></div>
            <div className="approval-bar">
              <div><ShieldCheck size={18} /><p><strong>Human-in-the-loop</strong><span>AI는 분석과 캠페인 초안만 생성하며 실제 발송은 승인 전 실행되지 않습니다.</span></p></div>
              <button className={approved ? 'approved' : ''} onClick={() => setApproved(true)}>{approved ? <><Check size={16} /> 캠페인 초안 승인됨</> : <>캠페인 초안 승인 <ArrowRight size={16} /></>}</button>
            </div>
          </section>
          {approved && <div className="success-strip ai-success"><CircleCheck size={20} /><div><strong>AIQUA 캠페인 초안 큐에 추가되었습니다.</strong><span>개념 데모이므로 실제 고객 메시지는 발송되지 않습니다. 대상·가드레일·대조군을 검토한 뒤 운영자가 최종 발송합니다.</span></div></div>}
        </>
      )}

      <section className="ai-bottom-grid">
        <div className="panel data-preview-panel">
          <div className="panel-head"><div><span className="panel-kicker">EVIDENCE PREVIEW</span><h2>모델이 참조한 가상 데이터</h2></div><button className="filter-pill"><FileSearch size={13} /> 근거 6개</button></div>
          <div className="evidence-table">
            <div className="evidence-head"><span>Store</span><span>Transactions</span><span>Identified</span><span>Tag→Buy</span><span>Quality</span></div>
            {[
              ['강남점', '18,324', '72.0%', '78.4%', '99.4%'],
              ['홍대점', '15,640', '64.0%', '74.1%', '99.1%'],
              ['명동점', '19,420', '59.0%', '70.8%', '96.9%'],
              ['잠실점', '14,102', '55.0%', '68.7%', '98.8%'],
              ['부산점', '12,680', '43.0%', '62.4%', '97.8%'],
            ].map((row, index) => <div className={`evidence-row ${index === 4 ? 'alert' : ''}`} key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}
          </div>
        </div>
        <aside className="panel governance-panel">
          <span className="panel-kicker">MODEL GOVERNANCE</span><h2>운영 전환 시 적용 규칙</h2>
          <ul>
            <li><ShieldCheck size={15} /><div><strong>Grounded response</strong><span>AIRIS 조회 결과에 없는 수치는 답변 금지</span></div></li>
            <li><GitCompareArrows size={15} /><div><strong>Independent inference</strong><span>두 모델은 서로의 답을 보지 않고 분석</span></div></li>
            <li><CircleAlert size={15} /><div><strong>Disagreement routing</strong><span>수치 불일치 또는 신뢰도 80% 미만은 검토</span></div></li>
            <li><LockKeyhole size={15} /><div><strong>Privacy boundary</strong><span>개인정보 제거 후 집계·익명 데이터만 전달</span></div></li>
          </ul>
          <div className="audit-log"><span>Audit log</span><code>run_0902_1438 · prompt_v3 · dataset_42</code></div>
        </aside>
      </section>
    </>
  )
}

function ModelArchitecture() {
  return <section className="panel model-architecture"><div className="architecture-title"><span className="panel-kicker">HOW IT WORKS</span><h2>병렬 분석과 합의 게이트</h2></div><div className="architecture-flow"><div><span className="arch-icon data"><Database size={19} /></span><strong>AIRIS Evidence</strong><small>승인된 가상 데이터 조회</small></div><ArrowRight /><div><span className="arch-icon openai"><Bot size={19} /></span><strong>OpenAI Analyst</strong><small>원인·행동 분석</small></div><div className="parallel-plus">+</div><div><span className="arch-icon gemini"><Sparkles size={19} /></span><strong>Gemini Challenger</strong><small>독립 검증·반례 탐색</small></div><ArrowRight /><div><span className="arch-icon gate"><GitCompareArrows size={19} /></span><strong>Consensus Gate</strong><small>합의·불일치·신뢰도</small></div><ArrowRight /><div><span className="arch-icon human"><ShieldCheck size={19} /></span><strong>Human Approval</strong><small>승인 후 AIQUA 초안</small></div></div></section>
}

function ModelRunning() {
  return <section className="model-running-grid"><div className="panel running-card"><div className="model-brand openai"><Bot size={20} /></div><div><span>OpenAI Analyst</span><strong>구매·고객 행동 패턴 분석 중</strong><small>SQL evidence → hypothesis → next action</small></div><LoaderCircle className="spin" size={20} /></div><div className="panel running-card"><div className="model-brand gemini"><Sparkles size={20} /></div><div><span>Gemini Challenger</span><strong>데이터 품질과 반례 검증 중</strong><small>outlier → exclusion → risk check</small></div><LoaderCircle className="spin" size={20} /></div><div className="running-progress"><span /></div></section>
}

function ModelResult({ name, role, tone, confidence, finding, action }: { name: string; role: string; tone: 'openai' | 'gemini'; confidence: number; finding: string; action: string }) {
  return <article className={`panel model-result ${tone}`}><div className="model-result-head"><div className={`model-brand ${tone}`}>{tone === 'openai' ? <Bot size={21} /> : <Sparkles size={21} />}</div><div><span>{role}</span><h2>{name}</h2></div><em>{confidence}% confidence</em></div><div className="model-section"><span>핵심 발견</span><p>{finding}</p></div><div className="model-section action"><span>권고 행동</span><p>{action}</p></div><div className="model-evidence"><Database size={13} /> AIRIS evidence 6개 인용 · PII 0건</div></article>
}

function StoreCapture({ memberScanned, selected, purchaseComplete, subtotal, points, onMember, onProduct, onComplete, onReset, onNavigate }: { memberScanned: boolean; selected: Product[]; purchaseComplete: boolean; subtotal: number; points: number; onMember: () => void; onProduct: (product: Product) => void; onComplete: () => void; onReset: () => void; onNavigate: (key: NavKey) => void }) {
  const step = purchaseComplete ? 4 : selected.length ? 3 : memberScanned ? 2 : 1
  return (
    <>
      <PageTitle
        eyebrow="Store-side Event Capture"
        title="직원 추가 입력은 최소화하고, 구매 증빙은 확실하게"
        description="회원 QR → 상품 바코드 → 영수증 확인의 3단계로 고객·상품·구매를 연결합니다. 기존 POS 데이터는 야간 배치로 대사합니다."
        action={<button className="outline-btn" onClick={onReset}><RefreshCw size={16} /> 데모 초기화</button>}
      />

      <div className="capture-layout">
        <section className="capture-device">
          <div className="device-top"><div><span className="status-dot" /> 강남점 · 계산대 03</div><span>Staff 0812</span></div>
          <div className="device-progress">
            {([
              ['회원', QrCode], ['상품', ScanBarcode], ['영수증', ReceiptText], ['완료', BadgeCheck],
            ] as const).map(([label, Icon], index) => (
              <div className={`progress-step ${step > index + 1 ? 'done' : step === index + 1 ? 'current' : ''}`} key={String(label)}>
                <div>{step > index + 1 ? <Check size={15} /> : <Icon size={17} />}</div><span>{label}</span>
              </div>
            ))}
          </div>

          {!memberScanned && (
            <div className="capture-stage centered">
              <div className="scan-visual"><QrCode size={70} /><span className="scan-line" /></div>
              <span className="stage-kicker">STEP 01</span><h2>회원 QR을 스캔해 주세요</h2>
              <p>앱 회원증 또는 휴대폰 번호로 고객을 식별합니다.</p>
              <button className="scan-btn" onClick={onMember}><QrCode size={19} /> 데모 회원 스캔</button>
              <button className="guest-btn">비회원으로 계속</button>
            </div>
          )}

          {memberScanned && !purchaseComplete && (
            <div className="capture-stage">
              <div className="member-strip"><div className="member-avatar">김</div><div><strong>김민지 고객</strong><span>GOLD · 통합 ID C-004921</span></div><div><Gift size={15} /> 12,840 P</div></div>
              <div className="stage-heading"><div><span className="stage-kicker">STEP 02</span><h2>구매 상품을 태깅하세요</h2><p>스캔된 상품은 결제 증빙 전까지 관심 이벤트로 저장됩니다.</p></div><div className="scanner-state"><span /><ScanBarcode size={19} /> Scanner ready</div></div>
              <div className="product-grid">
                {products.map((product) => {
                  const picked = selected.some((p) => p.id === product.id)
                  return <button key={product.id} className={`product-card ${picked ? 'picked' : ''}`} onClick={() => onProduct(product)}><div className="product-thumb"><ShoppingBag size={25} /><span>{product.category}</span></div><div className="product-info"><strong>{product.name}</strong><span>{product.color} · {product.code}</span><em>₩{currency(product.price)}</em></div><div className="pick-check">{picked && <Check size={14} />}</div></button>
                })}
              </div>

              <div className="receipt-box">
                <div><ReceiptText size={20} /><div><strong>영수증 확인</strong><span>기존 POS의 결제번호 또는 영수증 QR을 스캔</span></div></div>
                <div className="receipt-code"><span>Receipt No.</span><strong>GNA-030902-1842</strong></div>
              </div>
              <div className="checkout-bar"><div><span>상품 {selected.length}개</span><strong>₩{currency(subtotal)}</strong></div><div className="point-preview"><Gift size={16} /> 적립 예정 <b>{currency(points)} P</b></div><button disabled={!selected.length} onClick={onComplete}>구매 확정 · 포인트 적립 <ArrowRight size={17} /></button></div>
            </div>
          )}

          {purchaseComplete && (
            <div className="capture-stage centered complete-stage">
              <div className="complete-icon"><Check size={36} /></div><span className="stage-kicker">SYNC COMPLETE</span><h2>구매 데이터가 연결되었습니다</h2><p>직원이 추가로 입력할 내용은 없습니다.</p>
              <div className="complete-summary"><div><span>결제 금액</span><strong>₩{currency(subtotal)}</strong></div><div><span>적립 포인트</span><strong>{currency(points)} P</strong></div><div><span>연결 이벤트</span><strong>{selected.length + 3}건</strong></div></div>
              <div className="sync-chips"><span><CircleCheck size={14} /> Member linked</span><span><CircleCheck size={14} /> Receipt verified</span><span><CircleCheck size={14} /> AIRIS synced</span></div>
              <button className="scan-btn" onClick={() => onNavigate('customer')}>Customer 360에서 확인 <ArrowRight size={18} /></button>
              <button className="guest-btn" onClick={onReset}>다음 거래 시작</button>
            </div>
          )}
        </section>

        <aside className="capture-side">
          <div className="strategy-card dark-card"><span className="panel-kicker">WHY THIS FLOW</span><h3>POS를 바꾸지 않아도 되는 이유</h3><p>캡처 레이어는 기존 계산을 대신하지 않습니다. 고객과 상품의 연결 고리만 만들고, 실제 결제 금액·취소·반품은 POS 배치로 최종 대사합니다.</p><div className="strategy-flow"><span><QrCode size={16} /> 고객 식별</span><ArrowRight size={14} /><span><ScanBarcode size={16} /> 상품 신호</span><ArrowRight size={14} /><span><ReceiptText size={16} /> 구매 증빙</span></div></div>
          <div className="rule-card"><div className="rule-icon red"><CircleAlert size={18} /></div><div><strong>중복 매출 방지</strong><p>상품 태그는 <b>관심 이벤트</b>, 영수증 검증만 <b>구매 이벤트</b>로 기록합니다.</p></div></div>
          <div className="rule-card"><div className="rule-icon blue"><RefreshCw size={18} /></div><div><strong>T+1 POS 대사</strong><p>승인·취소·반품 원장을 배치로 받아 포인트와 고객 프로필을 보정합니다.</p></div></div>
          <div className="rule-card"><div className="rule-icon green"><ShieldCheck size={18} /></div><div><strong>동의 기반 식별</strong><p>마케팅 동의 상태와 채널별 수신 가능 여부를 함께 관리합니다.</p></div></div>
          <div className="scope-note"><strong>구현 범위 안내</strong><p>스캔·영수증·포인트 화면은 커스텀 연동의 개념 예시이며, AIRIS는 수집 이후의 통합·분석·Customer 360을 담당합니다.</p></div>
        </aside>
      </div>
    </>
  )
}

function Customer360({ purchaseComplete, points, selected, onNavigate }: { purchaseComplete: boolean; points: number; selected: Product[]; onNavigate: (key: NavKey) => void }) {
  const purchaseNames = selected.length ? selected.map((p) => p.name).join(', ') : '와이드 데님 팬츠, 쿨에어 크루넥 티'
  return (
    <>
      <PageTitle eyebrow="Unified Customer Profile" title="Customer 360" description="온라인 행동, 오프라인 구매, 회원·포인트 데이터를 하나의 고객 타임라인으로 연결합니다." action={<button className="outline-btn"><Search size={16} /> 고객 검색</button>} />
      <section className="customer-hero panel">
        <div className="customer-main"><div className="large-avatar">김</div><div><div className="customer-name"><h2>김민지</h2><span>GOLD MEMBER</span></div><p>Unified ID · C-004921</p><div className="identity-chips"><span><CircleCheck size={13} /> 앱 회원</span><span><CircleCheck size={13} /> 오프라인 식별</span><span><CircleCheck size={13} /> 마케팅 동의</span></div></div></div>
        <div className="customer-stats"><div><span>예측 LTV</span><strong>₩842,000</strong><em>상위 12%</em></div><div><span>누적 구매</span><strong>{purchaseComplete ? '₩428,600' : '₩372,800'}</strong><em>12개월</em></div><div><span>보유 포인트</span><strong>{currency(12840 + (purchaseComplete ? points : 0))} P</strong><em>{purchaseComplete ? `+${currency(points)} 방금` : '2026.09.01 기준'}</em></div><div><span>구매 성향</span><strong>Casual Core</strong><em>신뢰도 87%</em></div></div>
      </section>

      <div className="customer-grid">
        <section className="panel timeline-panel">
          <div className="panel-head"><div><span className="panel-kicker">OMNI-CHANNEL TIMELINE</span><h2>최근 고객 여정</h2></div><button className="filter-pill">최근 30일 <ChevronDown size={13} /></button></div>
          <div className="timeline">
            {purchaseComplete && <TimelineItem icon={ReceiptText} tone="red" time="오늘 14:32" title="강남점 오프라인 구매" desc={purchaseNames} meta={`₩${currency(selected.reduce((s, p) => s + p.price, 0))} · 영수증 검증 완료`} fresh />}
            <TimelineItem icon={ScanBarcode} tone="dark" time="오늘 14:29" title="강남점 상품 태그" desc="와이드 데님 팬츠 외 1개 상품" meta="Store Capture · 계산대 03" />
            <TimelineItem icon={Activity} tone="blue" time="어제 20:14" title="앱 상품 상세 조회" desc="라이트 윈드 재킷 · 차콜" meta="3분 21초 체류" />
            <TimelineItem icon={MessageSquareText} tone="violet" time="8월 29일 10:00" title="개인화 앱푸시 반응" desc="가을 신상품 얼리 액세스" meta="발송 → 오픈 → 상품 조회" />
            <TimelineItem icon={ShoppingBag} tone="green" time="8월 18일 16:42" title="온라인 구매" desc="베이직 크루넥 티 외 2개" meta="₩72,700 · 모바일 앱" />
          </div>
        </section>

        <aside className="customer-aside">
          <div className="panel segment-card"><span className="panel-kicker">LIVE SEGMENTS</span><h3>현재 속한 세그먼트</h3><div className="segment-list"><span>오프라인 활성 고객 <b>핵심</b></span><span>데님 크로스셀 후보 <b>신규</b></span><span>앱푸시 고반응군 <b>87%</b></span><span>가을 신상품 관심군 <b>최근</b></span></div></div>
          <div className="panel next-action"><div className="action-badge"><Sparkles size={15} /> NEXT BEST ACTION</div><h3>윈드 재킷 개인화 추천</h3><p>앱에서 재킷을 조회한 뒤 매장에서 데님을 구매했습니다. 48시간 내 코디 콘텐츠와 10% 쿠폰을 제안하세요.</p><div className="confidence"><span>예상 전환 확률</span><strong>24.8%</strong></div><button onClick={() => onNavigate('campaign')}>캠페인 만들기 <ArrowRight size={16} /></button></div>
          <div className="panel identity-graph"><span className="panel-kicker">IDENTITY GRAPH</span><h3>연결된 식별자</h3><div className="id-row"><span><Fingerprint size={15} /> Member ID</span><code>M-882104</code></div><div className="id-row"><span><QrCode size={15} /> App ID</span><code>AP-9201••</code></div><div className="id-row"><span><ReceiptText size={15} /> Receipt</span><code>GNA-1842</code></div></div>
        </aside>
      </div>
    </>
  )
}

function TimelineItem({ icon: Icon, tone, time, title, desc, meta, fresh = false }: { icon: typeof Activity; tone: string; time: string; title: string; desc: string; meta: string; fresh?: boolean }) {
  return <div className={`timeline-item ${fresh ? 'fresh' : ''}`}><div className={`timeline-icon ${tone}`}><Icon size={17} /></div><div className="timeline-copy"><span>{time} {fresh && <em>NEW</em>}</span><strong>{title}</strong><p>{desc}</p><small>{meta}</small></div></div>
}

function Campaigns({ purchaseComplete }: { purchaseComplete: boolean }) {
  const [created, setCreated] = useState<number | null>(null)
  return (
    <>
      <PageTitle eyebrow="Activation Opportunity" title="데이터를 매출 기회로 전환" description="오프라인 신호와 온라인 행동을 결합해 실행 가능한 고객군과 다음 행동을 제안합니다." action={<button className="primary-btn"><Boxes size={17} /> 전체 세그먼트</button>} />
      {purchaseComplete && <div className="insight-banner"><Sparkles size={20} /><div><strong>새로운 고객 신호가 감지되었습니다.</strong><span>김민지 고객이 ‘데님 구매자 크로스셀’ 세그먼트에 진입했습니다.</span></div></div>}
      <div className="campaign-summary">
        <div><span>활성 기회 고객</span><strong>{purchaseComplete ? '35,581' : '35,580'}</strong><em>중복 제거 기준</em></div><div><span>예상 증분 매출</span><strong>₩186M</strong><em>향후 30일</em></div><div><span>추천 캠페인</span><strong>8</strong><em>우선순위 높음 3</em></div><div><span>평균 예상 전환</span><strong>9.8%</strong><em>대조군 대비</em></div>
      </div>
      <div className="opportunity-grid">
        {opportunities.map((op, index) => (
          <article className="opportunity-card" key={op.title}><div className={`op-icon ${op.tone}`}><Target size={21} /></div><div className="op-title"><span>OPPORTUNITY {String(index + 1).padStart(2, '0')}</span><h2>{op.title}</h2><p>{op.desc}</p></div><div className="op-metrics"><div><span>대상 고객</span><strong>{op.audience}</strong></div><div><span>예상 전환 리프트</span><strong>{op.lift}</strong></div></div><div className="op-channel"><span>추천 채널</span><strong>{op.channel}</strong></div><button onClick={() => setCreated(index)}>{created === index ? <><Check size={16} /> 초안 생성 완료</> : <>캠페인 초안 만들기 <ArrowRight size={16} /></>}</button></article>
        ))}
      </div>
      <div className="governance-strip"><ShieldCheck size={20} /><div><strong>Activation guardrail</strong><span>수신 동의, 빈도 제한, 최근 구매 제외, 대조군 설정을 적용한 뒤 AIQUA 실행 대상으로 전달합니다.</span></div><button>가드레일 보기 <ExternalLink size={14} /></button></div>
    </>
  )
}

function DataQuality({ purchaseComplete }: { purchaseComplete: boolean }) {
  const issues = useMemo(() => [
    { severity: 'high', title: '부산점 회원 식별률 하락', detail: '43.0% · 전사 평균 대비 –18.3%p', owner: 'Store Ops', status: '확인 필요' },
    { severity: 'medium', title: '반품 포인트 미차감', detail: purchaseComplete ? '23건 · ₩1.2M 상당' : '24건 · ₩1.3M 상당', owner: 'CRM Ops', status: '대사 중' },
    { severity: 'medium', title: 'POS 영수증 매칭 지연', detail: '명동점 67건 · 2시간 초과', owner: 'Data Eng.', status: '모니터링' },
    { severity: 'low', title: '중복 회원 후보', detail: '휴대폰 해시 기준 138쌍', owner: 'CDP Admin', status: '주간 검토' },
  ], [purchaseComplete])
  return (
    <>
      <PageTitle eyebrow="Data Trust & Reconciliation" title="수집률보다 중요한 것은 ‘믿고 쓸 수 있는가’" description="누락·중복·취소·반품을 모니터링하고 POS 원장과의 대사 상태를 투명하게 관리합니다." action={<button className="outline-btn"><RefreshCw size={16} /> 지금 대사 실행</button>} />
      <section className="metric-grid four quality-metrics">
        <MetricCard label="수집 성공률" value="99.2%" delta="0.4%p" icon={PackageCheck} accent="green" sub="실시간 이벤트" />
        <MetricCard label="영수증 매칭률" value={purchaseComplete ? '97.9%' : '97.8%'} delta="1.2%p" icon={ReceiptText} accent="blue" sub="POS 원장 기준" />
        <MetricCard label="ID 중복 후보" value="138" icon={UsersRound} accent="violet" sub="자동 병합 전 검토" />
        <MetricCard label="해결 필요 이슈" value={purchaseComplete ? '227' : '228'} icon={CircleAlert} accent="red" sub="높음 1 · 보통 2" />
      </section>
      <div className="quality-grid">
        <section className="panel issue-panel"><div className="panel-head"><div><span className="panel-kicker">OPEN ISSUES</span><h2>우선 확인할 데이터 이슈</h2></div><button className="filter-pill">전체 매장 <ChevronDown size={13} /></button></div><div className="issue-table"><div className="issue-head"><span>이슈</span><span>담당</span><span>상태</span></div>{issues.map((issue) => <div className="issue-row" key={issue.title}><div><i className={issue.severity} /><div><strong>{issue.title}</strong><span>{issue.detail}</span></div></div><span>{issue.owner}</span><em>{issue.status}</em></div>)}</div></section>
        <aside className="panel health-panel"><span className="panel-kicker">PIPELINE HEALTH</span><h2>소스별 상태</h2>{[
          ['Store Capture API', '정상', '99.9%', 'green'], ['Legacy POS Batch', '주의', '97.8%', 'yellow'], ['Membership', '정상', '99.6%', 'green'], ['Point Ledger', '대사 중', '98.6%', 'blue'], ['E-commerce', '정상', '99.9%', 'green'],
        ].map(([name, status, rate, tone]) => <div className="health-row" key={name}><span className={`health-dot ${tone}`} /><div><strong>{name}</strong><span>{status}</span></div><em>{rate}</em></div>)}<div className="next-batch"><Clock3 size={15} /><div><span>다음 POS 대사</span><strong>오늘 23:30</strong></div></div></aside>
      </div>
      <section className="data-contract panel"><div><span className="panel-kicker">EVENT CONTRACT</span><h2>구매 이벤트 판정 규칙</h2></div><div className="contract-flow"><div><Tag size={19} /><span>product_tagged</span><small>관심 신호</small></div><ArrowRight /><div><ReceiptText size={19} /><span>receipt_verified</span><small>구매 후보</small></div><ArrowRight /><div><Database size={19} /><span>pos_reconciled</span><small>최종 매출</small></div><ArrowRight /><div><RefreshCw size={19} /><span>return_adjusted</span><small>반품·포인트 보정</small></div></div></section>
    </>
  )
}

export default App
