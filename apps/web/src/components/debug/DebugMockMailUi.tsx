type InboxItem = {
  sender: string;
  subject: string;
  tag: string;
  time: string;
};

const inboxItems: InboxItem[] = [
  { sender: 'Taro Sato', subject: '社内向けの製品デモについて', tag: '重要', time: '2/12 (水) 14:00' },
  { sender: 'Hajime Kato', subject: '参考資料の最終校正と個別タスク共有', tag: '参考', time: '2/12 (水) 11:20' },
  { sender: 'Hanako Tanaka', subject: '契約書関連の最終確認をお願いします', tag: '緊急', time: '2/12 (水) 10:15' },
  { sender: 'Yutaro Sasaki', subject: '【日程変更】エイアイ株式会社様 定例ミーティング', tag: '日程変更', time: '2/12 (水) 09:00' },
  { sender: 'Sales webinar', subject: '【無料ウェビナー】トップ営業が実践するオンライン商談', tag: '広告', time: '2/11 (火) 17:00' },
  { sender: 'Task notification system', subject: '【タスク期限通知】本日締切のタスクが2件あります', tag: '通知', time: '2/11 (火) 12:00' }
];

const tagClassMap: Record<string, string> = {
  重要: 'bg-rose-500',
  参考: 'bg-amber-400 text-slate-800',
  緊急: 'bg-red-400',
  日程変更: 'bg-blue-400',
  広告: 'bg-violet-400',
  通知: 'bg-emerald-500'
};

const SideNavPanel = () => (
  <aside className="rounded-xl border border-slate-200 bg-white p-3">
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">新規メール</div>
    <nav className="mt-3 space-y-1 text-sm">
      <div className="flex items-center justify-between rounded-md bg-slate-100 px-2 py-2 font-semibold text-slate-800">
        <span>受信トレイ</span>
        <span className="rounded bg-slate-900 px-1.5 text-[10px] text-white">1</span>
      </div>
      <div className="rounded-md px-2 py-2 text-slate-500">送信済み</div>
      <div className="rounded-md px-2 py-2 text-slate-500">下書き</div>
      <div className="rounded-md px-2 py-2 text-slate-500">迷惑メール</div>
    </nav>
    <p className="mt-8 text-[10px] text-slate-300">ここらはダミーです</p>
  </aside>
);

const InboxListPanel = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-2">
    <div className="space-y-1.5">
      {inboxItems.map((mail, index) => (
        <article key={mail.sender} className={`rounded-md border px-2.5 py-2 ${index === 0 ? 'border-sky-300 bg-sky-50/60' : 'border-slate-100 bg-white'}`}>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-700">{mail.sender}</p>
            <span>{mail.time}</span>
          </div>
          <p className="truncate text-[12px] text-slate-700">{mail.subject}</p>
          <span className={`mt-1 inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${tagClassMap[mail.tag]}`}>
            {mail.tag}
          </span>
        </article>
      ))}
    </div>
  </div>
);

const MailDetailPanel = () => (
  <article className="rounded-xl border border-slate-200 bg-white p-3">
    <header className="flex items-center justify-between text-[11px] text-slate-500">
      <span className="inline-flex rounded bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">最重要</span>
      <span>2/12 (水) 14:00</span>
    </header>
    <h2 className="mt-2 text-sm font-semibold text-slate-700">Taro Sato</h2>
    <p className="mt-1 text-sm text-slate-700">社内向けの製品デモについて</p>
    <p className="mt-5 whitespace-pre-line text-[12px] leading-relaxed text-slate-500">
      株式会社Datebook 商田様{`\n\n`}
      お世話になっております。株式会社AAAの田中です。{`\n`}
      社内で御社サービスの導入を検討しており、オンラインで簡単な{`\n`}
      ご説明をお願いしたく存じます。
    </p>

    <section className="mt-4 rounded-md border-2 border-blue-300 bg-blue-50/60 p-3">
      <p className="inline-flex rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-white">下書き</p>
      <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed text-slate-700">
        株式会社AAA 田中様{`\n`}
        いつもお世話になっております。DateBook株式会社の商田です。{`\n`}
        製品のご相談ありがとうございます。{`\n`}
        3/13（水）10:00 でしたらご対応可能ですので、この時間で設定させてください。{`\n`}
        当日はサービス概要と、利用イメージを中心にご説明いたします。{`\n`}
        では、引き続きよろしくお願いいたします。
      </p>
    </section>
  </article>
);

export const DebugMockMailUi = () => (
  <section className="relative overflow-hidden rounded-[28px] border border-sky-300 bg-white/95 p-4 shadow-[0_0_0_4px_rgba(56,189,248,0.2),0_28px_80px_-35px_rgba(37,99,235,0.65)] backdrop-blur-sm lg:p-6">
    <div className="grid gap-3 rounded-2xl bg-slate-50 p-3 lg:grid-cols-[220px_1fr_1.12fr] lg:p-4">
      <SideNavPanel />
      <InboxListPanel />
      <MailDetailPanel />
    </div>

  </section>
);
