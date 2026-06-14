export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">

        {/* 헤더 */}
        <div>
          <h1 className="text-2xl font-bold text-primary-700 italic mb-1">Pono</h1>
          <p className="text-sm text-neutral-500">Design System · Component Library</p>
        </div>

        {/* ── 컬러 ── */}
        <section className="space-y-6">
          <SectionTitle>Color</SectionTitle>

          <div className="space-y-3">
            <Label>Primary — Deep Forest Green</Label>
            <div className="flex gap-2 flex-wrap">
              {[
                ['50',  '#F0F7F4'],
                ['100', '#D6EBE3'],
                ['200', '#A8D4C3'],
                ['300', '#72BAA0'],
                ['400', '#459E7E'],
                ['500', '#2D8463'],
                ['600', '#1F6B4D'],
                ['700', '#1F4D3A'],
                ['800', '#163826'],
                ['900', '#0D2318'],
              ].map(([scale, hex]) => (
                <div key={scale} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-12 h-12 rounded-lg border border-black/5"
                    style={{ background: hex }}
                  />
                  <span className="text-[10px] text-neutral-500 font-mono">{scale}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Neutral — Warm Ivory / Warm Charcoal</Label>
            <div className="flex gap-2 flex-wrap">
              {[
                ['50',  '#FDFCF9'],
                ['100', '#F5F4F0'],
                ['200', '#E8E6E1'],
                ['300', '#D4D1CA'],
                ['400', '#B5B1A8'],
                ['500', '#908C83'],
                ['600', '#6B6760'],
                ['700', '#4A4742'],
                ['800', '#2E2C29'],
                ['900', '#1C1917'],
              ].map(([scale, hex]) => (
                <div key={scale} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-12 h-12 rounded-lg border border-black/5"
                    style={{ background: hex }}
                  />
                  <span className="text-[10px] text-neutral-500 font-mono">{scale}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Semantic</Label>
            <div className="flex gap-4">
              {[
                ['success', '#1E8A5A'],
                ['error',   '#B54040'],
                ['warning', '#B8860B'],
              ].map(([name, hex]) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md" style={{ background: hex }} />
                  <span className="text-xs text-neutral-600">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 타이포그래피 ── */}
        <section className="space-y-4">
          <SectionTitle>Typography</SectionTitle>
          <div className="space-y-4 bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
            {[
              { label: 'display',   cls: 'text-[28px] font-bold leading-[1.3]' },
              { label: 'heading-1', cls: 'text-2xl font-bold leading-[1.35]' },
              { label: 'heading-2', cls: 'text-xl font-semibold leading-[1.4]' },
              { label: 'heading-3', cls: 'text-[17px] font-semibold leading-[1.45]' },
              { label: 'body-lg',   cls: 'text-base font-normal leading-[1.7] font-serif' },
              { label: 'body',      cls: 'text-[15px] font-normal leading-[1.6]' },
              { label: 'body-sm',   cls: 'text-[13px] font-normal leading-[1.5]' },
              { label: 'caption',   cls: 'text-xs font-normal leading-[1.4]' },
            ].map(({ label, cls }) => (
              <div key={label} className="flex items-baseline gap-4 border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                <span className="text-[10px] font-mono text-neutral-400 w-20 flex-shrink-0">{label}</span>
                <span className={`${cls} text-neutral-900`}>포노에서 글을 씁니다 · Pono</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 버튼 ── */}
        <section className="space-y-4">
          <SectionTitle>Button</SectionTitle>
          <div className="space-y-6 bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)]">

            <div className="space-y-2">
              <Label>Variant</Label>
              <div className="flex flex-wrap gap-3 items-center">
                <button className="h-12 px-6 rounded-[10px] bg-primary-700 text-white text-[15px] font-semibold transition-colors hover:bg-primary-800 active:bg-primary-900">
                  Primary
                </button>
                <button className="h-12 px-6 rounded-[10px] bg-neutral-200 text-neutral-900 text-[15px] font-semibold transition-colors hover:bg-neutral-300">
                  Secondary
                </button>
                <button className="h-12 px-6 rounded-[10px] text-primary-700 text-[15px] font-semibold transition-colors hover:bg-primary-50">
                  Ghost
                </button>
                <button className="h-12 px-6 rounded-[10px] bg-[#B54040] text-white text-[15px] font-semibold transition-colors hover:opacity-90">
                  Danger
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <div className="flex flex-wrap gap-3 items-center">
                <button className="h-10 px-4 rounded-[10px] bg-primary-700 text-white text-[13px] font-semibold">
                  Small
                </button>
                <button className="h-12 px-6 rounded-[10px] bg-primary-700 text-white text-[15px] font-semibold">
                  Medium
                </button>
                <button className="h-14 px-8 rounded-[10px] bg-primary-700 text-white text-[17px] font-semibold">
                  Large
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>State</Label>
              <div className="flex flex-wrap gap-3 items-center">
                <button className="h-12 px-6 rounded-[10px] bg-primary-700 text-white text-[15px] font-semibold">
                  Default
                </button>
                <button className="h-12 px-6 rounded-[10px] bg-primary-800 text-white text-[15px] font-semibold">
                  Hover
                </button>
                <button className="h-12 px-6 rounded-[10px] bg-primary-900 text-white text-[15px] font-semibold">
                  Pressed
                </button>
                <button className="h-12 px-6 rounded-[10px] bg-neutral-200 text-neutral-400 text-[15px] font-semibold cursor-not-allowed" disabled>
                  Disabled
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>FAB (작성)</Label>
              <div className="flex gap-4 items-center">
                <button className="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center text-white shadow-[0_4px_16px_rgba(28,25,23,0.10)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span className="text-xs text-neutral-400">48px · primary-700</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 뱃지 ── */}
        <section className="space-y-4">
          <SectionTitle>Badge</SectionTitle>
          <div className="flex gap-3 items-center bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-100 text-primary-500">스냅</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700">아티클</span>
            <span className="text-xs text-neutral-400">10px · Bold · pill</span>
          </div>
        </section>

        {/* ── 아바타 ── */}
        <section className="space-y-4">
          <SectionTitle>Avatar</SectionTitle>
          <div className="flex gap-4 items-end bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
            {[
              { size: 'w-8 h-8', label: '32px · 피드' },
              { size: 'w-10 h-10', label: '40px · 댓글' },
              { size: 'w-18 h-18', label: '72px · 프로필' },
            ].map(({ size, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={`${size} rounded-full bg-neutral-300`} />
                <span className="text-[10px] text-neutral-400">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 인풋 ── */}
        <section className="space-y-4">
          <SectionTitle>Input</SectionTitle>
          <div className="space-y-3 bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
            <div className="space-y-1">
              <Label>Default</Label>
              <input
                className="w-full h-12 px-4 rounded-[6px] bg-neutral-200 text-[15px] text-neutral-900 placeholder:text-neutral-500 outline-none"
                placeholder="검색어를 입력하세요"
              />
            </div>
            <div className="space-y-1">
              <Label>Focus</Label>
              <input
                className="w-full h-12 px-4 rounded-[6px] bg-neutral-200 text-[15px] text-neutral-900 outline-none border border-primary-700"
                defaultValue="포커스 상태"
              />
            </div>
          </div>
        </section>

        {/* ── 섀도우 & 보더 라디우스 ── */}
        <section className="space-y-4">
          <SectionTitle>Shadow & Radius</SectionTitle>
          <div className="flex flex-wrap gap-6 bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
            {[
              { label: 'shadow-sm', shadow: '0 1px 4px rgba(28,25,23,0.06)' },
              { label: 'shadow-md', shadow: '0 4px 16px rgba(28,25,23,0.10)' },
              { label: 'shadow-lg', shadow: '0 8px 32px rgba(28,25,23,0.14)' },
            ].map(({ label, shadow }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white rounded-xl" style={{ boxShadow: shadow }} />
                <span className="text-[10px] text-neutral-400 font-mono">{label}</span>
              </div>
            ))}
            <div className="w-px bg-neutral-200 mx-2" />
            {[
              { label: 'radius-sm · 6px',  r: '6px' },
              { label: 'radius-md · 10px', r: '10px' },
              { label: 'radius-lg · 16px', r: '16px' },
              { label: 'radius-xl · 20px', r: '20px' },
            ].map(({ label, r }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-neutral-200" style={{ borderRadius: r }} />
                <span className="text-[10px] text-neutral-400 font-mono text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 아이콘 ── */}
        <section className="space-y-4">
          <SectionTitle>Icon · Lucide React</SectionTitle>
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-4">
            <div className="flex gap-6 items-center">
              {[
                <HeartIcon key="heart" />,
                <CommentIcon key="comment" />,
                <BookmarkIcon key="bookmark" />,
                <ShareIcon key="share" />,
                <SearchIcon key="search" />,
                <BellIcon key="bell" />,
                <PlusIcon key="plus" />,
                <HomeIcon key="home" />,
                <UserIcon key="user" />,
              ]}
            </div>
            <p className="text-xs text-neutral-400">Lucide React · strokeWidth 1.5 · 피드 20px / 탭 24px</p>
          </div>
        </section>

        {/* ── 스페이싱 ── */}
        <section className="space-y-4">
          <SectionTitle>Spacing · 4px Grid</SectionTitle>
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-3">
            {[
              { token: 'space-1',  px: '4px',  tw: 'p-1'  },
              { token: 'space-2',  px: '8px',  tw: 'p-2'  },
              { token: 'space-3',  px: '12px', tw: 'p-3'  },
              { token: 'space-4',  px: '16px', tw: 'p-4'  },
              { token: 'space-5',  px: '20px', tw: 'p-5'  },
              { token: 'space-6',  px: '24px', tw: 'p-6'  },
              { token: 'space-8',  px: '32px', tw: 'p-8'  },
              { token: 'space-10', px: '40px', tw: 'p-10' },
              { token: 'space-12', px: '48px', tw: 'p-12' },
            ].map(({ token, px, tw }) => (
              <div key={token} className="flex items-center gap-4">
                <span className="text-[11px] font-mono text-neutral-400 w-20 flex-shrink-0">{token}</span>
                <div className="bg-primary-100 h-5 flex-shrink-0 rounded-sm" style={{ width: px }} />
                <span className="text-[11px] text-neutral-500">{px}</span>
                <span className="text-[11px] font-mono text-neutral-300">{tw}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 인터랙션 상태 ── */}
        <section className="space-y-4">
          <SectionTitle>Interaction States</SectionTitle>
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-6">

            <div className="space-y-3">
              <Label>좋아요 — 스냅 (primary-500) vs 아티클 (primary-700)</Label>
              <div className="flex gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-400">스냅 · 비활성</p>
                  <HeartIconColor color="#B5B1A8" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-400">스냅 · 활성</p>
                  <HeartIconColor color="#2D8463" filled />
                </div>
                <div className="w-px bg-neutral-100" />
                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-400">아티클 · 비활성</p>
                  <HeartIconColor color="#B5B1A8" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-400">아티클 · 활성</p>
                  <HeartIconColor color="#1F4D3A" filled />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>북마크</Label>
              <div className="flex gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-400">비활성</p>
                  <BookmarkIconColor color="#B5B1A8" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-neutral-400">활성</p>
                  <BookmarkIconColor color="#1F4D3A" filled />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>팔로우 버튼</Label>
              <div className="flex gap-3 items-center">
                <button className="h-9 px-5 rounded-full bg-primary-700 text-white text-[13px] font-semibold">팔로우</button>
                <button className="h-9 px-5 rounded-full bg-neutral-200 text-neutral-900 text-[13px] font-semibold">팔로잉</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 트랜지션 ── */}
        <section className="space-y-4">
          <SectionTitle>Transition</SectionTitle>
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-neutral-100">
                  <th className="pb-2 text-[11px] font-semibold text-neutral-400">용도</th>
                  <th className="pb-2 text-[11px] font-semibold text-neutral-400">값</th>
                  <th className="pb-2 text-[11px] font-semibold text-neutral-400">Tailwind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {[
                  { label: '버튼·아이콘·색상 변화', value: '200ms ease-in-out', tw: 'transition-colors duration-200' },
                  { label: '바텀 시트 진입',         value: '300ms ease-out',    tw: 'duration-300 ease-out'          },
                  { label: '모달 진입',              value: '250ms ease-out',    tw: 'duration-250 ease-out'          },
                  { label: '페이지 전환',            value: '200ms ease-in-out', tw: 'duration-200'                   },
                ].map(({ label, value, tw }) => (
                  <tr key={label}>
                    <td className="py-2.5 text-[12px] text-neutral-700">{label}</td>
                    <td className="py-2.5 text-[12px] font-mono text-neutral-500">{value}</td>
                    <td className="py-2.5 text-[11px] font-mono text-neutral-300">{tw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 피드 카드 컴포넌트 ── */}
        <section className="space-y-4">
          <SectionTitle>Feed Cards</SectionTitle>
          <div className="space-y-4">

            <Label>ArticleCard</Label>
            <div className="bg-white rounded-[16px] overflow-hidden shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
              <div className="w-full aspect-[16/9] bg-neutral-200 relative flex items-end p-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700 absolute top-2.5 left-3">아티클</span>
              </div>
              <div className="px-3 pt-3 pb-3.5">
                <h2 className="text-[15px] font-bold text-neutral-900 leading-[1.4] tracking-tight mb-1.5">느리게 사는 법에 대하여</h2>
                <p className="text-[11px] text-neutral-600 leading-[1.6] mb-2.5 line-clamp-2">빠름이 미덕이 된 세상에서, 의도적으로 느려지기로 했다. 그 선택이 내 하루를 어떻게 바꿨는지에 대한 이야기.</p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-neutral-300" />
                  <span className="text-[11px] text-neutral-700 flex-1">이도현 · Slow Letters</span>
                  <span className="text-[10px] text-neutral-500">7분 읽기</span>
                  <span className="text-[10px] text-neutral-400">♥ 1,200</span>
                </div>
              </div>
            </div>

            <Label>SnapMiniCard × 2열 — 4:5 (같은 행은 항상 동일 비율)</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { caption: '아침 햇살이 가장 좋은 자리.', tag: '느린아침', author: '김서연', likes: 248 },
                { caption: '제철 채소로 차린 저녁.', tag: '집밥', author: '한지우', likes: 301 },
              ].map(({ caption, tag, author, likes }) => (
                <div key={author} className="bg-white rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
                  <div className="relative w-full aspect-[4/5] bg-neutral-200">
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-500">스냅</span>
                  </div>
                  <div className="px-2.5 pt-2 pb-2.5">
                    <p className="text-[11px] text-neutral-800 leading-[1.4] mb-1.5 line-clamp-2">
                      {caption} <span className="text-primary-500">#{tag}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-neutral-300" />
                        <span className="text-[10px] text-neutral-500">{author}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">♥ {likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Label>SnapMiniCard × 2열 — 1:1</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { caption: '오늘의 독서.', tag: '책스타그램', author: '박민준', likes: 184 },
                { caption: '주말 산책 루트.', tag: '걷기좋은날', author: '최유나', likes: 97 },
              ].map(({ caption, tag, author, likes }) => (
                <div key={author} className="bg-white rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
                  <div className="relative w-full aspect-square bg-neutral-200">
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-500">스냅</span>
                  </div>
                  <div className="px-2.5 pt-2 pb-2.5">
                    <p className="text-[11px] text-neutral-800 leading-[1.4] mb-1.5 line-clamp-2">
                      {caption} <span className="text-primary-500">#{tag}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-neutral-300" />
                        <span className="text-[10px] text-neutral-500">{author}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">♥ {likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Label>EmptySlot (홀수 스냅 시 광고·이벤트 예약 영역)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
                <div className="relative w-full aspect-square bg-neutral-200">
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-500">스냅</span>
                </div>
                <div className="px-2.5 pt-2 pb-2.5">
                  <p className="text-[11px] text-neutral-800 leading-[1.4] mb-1.5">장마 전 마지막 맑은 날. <span className="text-primary-500">#하늘</span></p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-neutral-300" />
                      <span className="text-[10px] text-neutral-500">김서연</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">♥ 139</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[10px] border-[1.5px] border-dashed border-neutral-300 bg-neutral-100 flex flex-col items-center justify-center gap-1.5 text-center p-3">
                <span className="text-lg opacity-40">✦</span>
                <span className="text-[10px] text-neutral-400 leading-[1.4]">광고 또는<br />이벤트 영역</span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-semibold text-neutral-400 uppercase tracking-widest">
      {children}
    </h2>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-neutral-400">{children}</p>
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D8463" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}
function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#908C83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}
function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#908C83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  )
}
function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#908C83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#908C83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#908C83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F4D3A" strokeWidth="1.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F4D3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#908C83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function HeartIconColor({ color, filled = false }: { color: string; filled?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function BookmarkIconColor({ color, filled = false }: { color: string; filled?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  )
}
