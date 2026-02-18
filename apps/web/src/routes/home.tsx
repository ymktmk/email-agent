const mailItems = [
  {
    sender: 'Taro Sato',
    subject: '社内向けの製品デモについて',
    preview: '株式会社Datebook 高田様 お世話になっております。',
    tag: { text: '最優先', color: 'bg-rose-500/20 text-rose-600' },
    time: '2/12 (水) 14:00',
    active: true
  },
  {
    sender: 'Hajime Kato',
    subject: '労務関連の各種設定に関するニュース',
    preview: '設定内容をご確認ください。',
    tag: { text: '参考情報', color: 'bg-amber-500/20 text-amber-600' },
    time: '2/12 (水) 11:20'
  },
  {
    sender: 'Hanako Tanaka',
    subject: '案内資料最終確認のお願い',
    preview: '内容に問題ないかご確認ください。',
    tag: { text: '返信待ち', color: 'bg-fuchsia-500/20 text-fuchsia-600' },
    time: '2/12 (水) 10:15'
  },
  {
    sender: 'Yutaro Sasaki',
    subject: '【日程変更】エイティ株式会社様 定例ミーティング',
    preview: '日程を 3/12 に変更しました。',
    tag: { text: '日程調整', color: 'bg-sky-500/20 text-sky-600' },
    time: '2/12 (水) 09:00'
  },
  {
    sender: 'Sales webinar',
    subject: '【無料ウェビナー】トップ営業が実践するオンライン営業術',
    preview: '参加登録をお願いします。',
    tag: { text: '案内', color: 'bg-violet-500/20 text-violet-600' },
    time: '2/11 (火) 17:00'
  }
];

const leftMenu = ['受信トレイ', '送信済み', '下書き', '迷惑メール'];

export const HomePage = () => {
  return (
    <main className="relative mx-auto max-w-6xl px-6 pb-10 pt-6">
      <div className="relative overflow-hidden rounded-[28px] border border-sky-200 bg-white p-4 shadow-[0_0_0_3px_rgba(59,130,246,0.2)] lg:p-5">
        <div className="grid min-h-[500px] grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-3 lg:grid-cols-[200px_1.05fr_1fr]">
          <aside className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-500">新規メール</h2>
            <ul className="space-y-1 text-sm text-slate-600">
              {leftMenu.map((item, index) => (
                <li
                  key={item}
                  className={`flex items-center justify-between rounded-md px-3 py-2 ${
                    index === 0 ? 'bg-sky-50 font-semibold text-slate-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <span>{item}</span>
                  {index === 0 && <span className="rounded bg-slate-800 px-1.5 text-xs text-white">1</span>}
                </li>
              ))}
            </ul>
          </aside>

          <section className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <div className="space-y-2">
              {mailItems.map((mail) => (
                <article
                  key={`${mail.sender}-${mail.time}`}
                  className={`rounded-lg border px-3 py-2 ${
                    mail.active ? 'border-slate-300 bg-slate-50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">{mail.sender}</span>
                    <span>{mail.time}</span>
                  </div>
                  <p className="truncate text-sm font-medium text-slate-700">{mail.subject}</p>
                  <p className="truncate text-xs text-slate-500">{mail.preview}</p>
                  <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${mail.tag.color}`}>
                    {mail.tag.text}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <header className="mb-3 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <h3 className="text-sm font-semibold text-slate-800">Taro Sato</h3>
                <span>2/12 (水) 14:00</span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-700">社内向けの製品デモについて</p>
            </header>

            <div className="space-y-2 text-xs leading-relaxed text-slate-500">
              <p>株式会社Datebook 高田様</p>
              <p>
                お世話になっております。株式会社AAAの田中です。
                先日ご依頼サービスの導入を検討しており、オンラインで簡単なご説明をお願いしたく存じます。
              </p>
              <p>3/12（水）14:00〜 / 3/13（木）10:00〜 のどちらかで調整可能です。</p>
            </div>

            <div className="mt-5 rounded-lg border-2 border-sky-300 bg-sky-50/40 p-3 text-xs text-slate-600">
              <p className="mb-1 inline-block rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-white">下書き</p>
              <p>株式会社AAA 田中様</p>
              <p className="mt-1">
                いつもお世話になっております。DateBook株式会社の高田です。
                製品のご相談ありがとうございます。
              </p>
              <p className="mt-1">
                3/13（木）10:00〜 でしたら対応可能ですので、この時間で設定させてください。
                後ほどオンライン会議のURLをお送りいたします。
              </p>
            </div>
          </section>
        </div>

        <div className="pointer-events-none absolute left-[-6px] top-1/2 hidden -translate-y-1/2 rounded-2xl bg-white px-7 py-6 text-center shadow-xl ring-1 ring-slate-200 lg:block">
          <p className="text-[40px] leading-none">📩</p>
          <p className="mt-1 text-3xl font-black text-slate-800">受信メールの</p>
          <p className="text-3xl font-black text-sky-600">自動分類 / ラベル分け</p>
        </div>

        <div className="pointer-events-none absolute right-[-4px] top-1/2 hidden -translate-y-1/2 rounded-2xl bg-white px-7 py-6 text-center shadow-xl ring-1 ring-slate-200 lg:block">
          <p className="text-[40px] leading-none">🤖</p>
          <p className="mt-1 text-3xl font-black text-slate-800">AIによる</p>
          <p className="text-3xl font-black text-sky-600">下書き自動作成</p>
        </div>

        <div className="pointer-events-none absolute left-[21%] top-[23%] hidden h-[2px] w-[12%] rounded-full bg-sky-500 lg:block" />
        <div className="pointer-events-none absolute right-[18%] top-[63%] hidden h-[2px] w-[11%] rounded-full bg-sky-500 lg:block" />
      </div>
    </main>
  );
};
