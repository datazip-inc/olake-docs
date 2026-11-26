// The captcha of the Ask OLake panel: Cloudflare Turnstile, run once per visit. The token it gives
// is traded with the backend for a pass, which is then sent with every question. Most visitors
// never see anything: a challenge appears only when Cloudflare is unsure.

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const STORAGE_KEY = 'ask-olake-pass'

let script: Promise<void> | undefined

/** Loads Turnstile the first time a question is asked, not with every page. */
function loadTurnstile(): Promise<void> {
  script ??= new Promise((resolve, reject) => {
    const element = document.createElement('script')
    element.src = SCRIPT
    element.async = true
    element.onload = () => resolve()
    element.onerror = () => {
      script = undefined
      reject(new Error('The captcha could not be loaded.'))
    }
    document.head.appendChild(element)
  })
  return script
}

function turnstileToken(siteKey: string): Promise<string> {
  const turnstile = (window as any).turnstile
  return new Promise((resolve, reject) => {
    // Where a challenge shows, if there is one: just above the chat button.
    const box = document.createElement('div')
    box.style.cssText = 'position:fixed;right:20px;bottom:84px;z-index:10001'
    document.body.appendChild(box)
    const finish = (settle: () => void) => {
      turnstile.remove(id)
      box.remove()
      settle()
    }
    const id = turnstile.render(box, {
      'sitekey': siteKey,
      'appearance': 'interaction-only',
      'callback': (token: string) => finish(() => resolve(token)),
      'error-callback': () => finish(() => reject(new Error('The captcha check failed.')))
    })
  })
}

/** Forgets the pass, after the backend has refused it. */
export function forgetPass(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // no storage: there is nothing to forget
  }
}

/**
 * The visitor's pass, from this tab's storage or from a new captcha check. Undefined when the
 * site has no captcha.
 */
export async function getPass(apiUrl: string, siteKey: string): Promise<string | undefined> {
  if (!siteKey) return undefined
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    // A pass starts with the second it runs out. One with under a minute left is not used.
    if (saved && Number(saved.split('.')[0]) > Date.now() / 1000 + 60) return saved
  } catch {
    // no storage: the check runs again for the next question
  }
  await loadTurnstile()
  const response = await fetch(`${apiUrl}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: await turnstileToken(siteKey) })
  })
  if (!response.ok) throw new Error("Couldn't confirm that you are not a robot. Please try again.")
  const { pass } = await response.json()
  try {
    sessionStorage.setItem(STORAGE_KEY, pass)
  } catch {
    // no storage: the pass is used for this question only
  }
  return pass
}
