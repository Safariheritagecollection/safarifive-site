// Runs automatically on every Netlify Forms submission (the function name is the trigger).
// Sends the app link on sign-up, the Completed stamp on completion, and a copy to the admin.
// Settings (Netlify > Site configuration > Environment variables):
//   RESEND_API_KEY  key from resend.com (or swap sendEmail() for Postmark, SendGrid, Mailchimp etc.)
//   FROM_EMAIL      e.g. "The Safari Five <stamp@safarifive.com>"  (domain must be verified with the provider)
//   ADMIN_EMAIL     where completion alerts go, e.g. info@safarifive.com
const SITE = 'https://safarifive.com';

async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) { console.log('No RESEND_API_KEY set; skipped email to', to, subject); return; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.FROM_EMAIL || 'The Safari Five <stamp@safarifive.com>', to: [to], subject, html }),
  });
  if (!r.ok) console.log('Email failed', r.status, await r.text());
}

const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wrap = (body) => `<div style="background:#F2EADB;padding:32px 16px;font-family:Georgia,serif;color:#1E1B16"><div style="max-width:560px;margin:0 auto;background:#FBF6EC;border:1px solid #D8CCB4;padding:32px">
<p style="text-align:center;margin:0 0 20px"><img src="${SITE}/checklist/icon-192.png" width="96" height="96" alt="The Safari Five"></p>${body}
<p style="font-family:Arial,sans-serif;font-size:12px;color:#7A6F5C;margin-top:28px;border-top:1px solid #D8CCB4;padding-top:14px">The Safari Five&trade; &middot; run by the <a href="https://www.zwcf.org" style="color:#8A5A1E">Zambia Wildlife &amp; Community Foundation</a> &middot; <a href="${SITE}" style="color:#8A5A1E">safarifive.com</a> &middot; #SafariFive<br>Don't want these emails? Reply to this one and we will stop. <a href="${SITE}/privacy.html" style="color:#8A5A1E">Privacy policy</a></p></div></div>`;
const btn = (href, label) => `<p style="text-align:center;margin:26px 0"><a href="${href}" style="background:#B5762A;color:#fff;text-decoration:none;font-family:Arial,sans-serif;font-weight:bold;padding:14px 26px;border-radius:4px;display:inline-block">${label}</a></p>`;

exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body || '{}');
  if (!payload) return { statusCode: 200 };
  const form = payload.form_name;
  const d = payload.data || {};
  const first = esc(d.first_name);

  if (form === 'app-registration') {
    await sendEmail(d.email, 'Welcome to the Safari Five', wrap(`
<h1 style="font-size:28px;margin:0 0 12px">Welcome to the Safari Five${first ? ', ' + first : ''}.</h1>
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">The Safari Five is a way of remembering what safari has always been about: a true bushcamp, a walk in big-game country, the people who keep wild places wild, lion, leopard and wild dog, and a night drive, with a sundowner first. Your app is ready whenever you are, and it works in the bush with no signal.</p>
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6"><strong>Marking the journey.</strong> <em>Safari Five</em>: you have completed all five, anywhere in Africa. <em>Dugga Boy</em>: you have completed it three times, like the old buffalo bulls who know every waterhole. <em>Guardian</em>: you support the conservation or community work of a wild place you love, through the foundation or any group doing that work.</p>
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Ask anyone who has done it what woke them at three in the morning. You will hear about a hippo grazing outside the tent, or a leopard coughing as it walked through camp.</p>
${btn(SITE + '/what-its-about.html', 'What the Safari Five is about')}
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Enjoy every minute out there. We look forward to adding your name to the Hall of the Five.</p>`));
    return { statusCode: 200 };
  }
  if (form === 'app-signup') {
    if (form === 'app-signup') {
      await sendEmail(d.email, 'Your Safari Five app', wrap(`
<h1 style="font-size:28px;margin:0 0 12px">Here is your Safari Five app${first ? ', ' + first : ''}.</h1>
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Open the link on your phone, then add it to your home screen (Share &rsaquo; Add to Home Screen on iPhone, or the menu &rsaquo; Install app on Android). It works in the bush with no signal.</p>
${btn(SITE + '/checklist/', 'Open the app')}
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Tick off the five as you go, stamp your area while you are in a Safari Five area, and send it in. We will send back your Completed stamp and add your name to the wall.</p>`));
    }
    return { statusCode: 200 };
  }

  if (form === 'completion') {
    const name = esc(d.wall_name), area = esc(d.area), month = esc(d.month);
    const stampUrl = `${SITE}/stamp.html?n=${encodeURIComponent(d.wall_name || '')}&p=${encodeURIComponent(d.area || '')}&m=${encodeURIComponent(d.month || '')}`;
    await sendEmail(d.email, 'You did the Safari Five', wrap(`
<h1 style="font-size:28px;margin:0 0 12px">You did the Safari Five${first ? ', ' + first : ''}.</h1>
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Completed in <strong>${area}</strong>, ${month}. Here is your stamp to keep and share.${d.rank ? ' Your rank: <strong>' + esc(d.rank) + '</strong>.' : ''}</p>
${btn(stampUrl, 'See my Completed stamp')}
<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Your name will appear in the Hall of the Five as <strong>${name}</strong>, ${area}, ${month}, once we have checked your stamp. Share it with #SafariFive.</p>`));
    if (process.env.ADMIN_EMAIL) {
      await sendEmail(process.env.ADMIN_EMAIL, `New Safari Five: ${d.wall_name} (${d.area})`, `<pre style="font:13px monospace">${esc(JSON.stringify(d, null, 2))}</pre>
<p>To add to the wall: add {"name": "${name}", "month": "${month}", "country": "${esc(d.country)}", "home": "${esc(d.home_country)}", "area": "${area}"} to data/wall.json and redeploy. Keep the month as month and year (e.g. October 2026).</p>`);
    }
  }
  return { statusCode: 200 };
};
