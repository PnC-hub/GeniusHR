import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - Ordinia',
  description: 'Informativa sui cookie utilizzati da Ordinia',
}

export default function CookiePolicyPage() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Cookie Policy</h1>
      <p className="lead">
        Informativa sull&apos;utilizzo dei cookie ai sensi del GDPR e della Direttiva ePrivacy
      </p>
      <p className="text-sm text-zinc-500">Ultima modifica: Gennaio 2026 - Versione 1.0</p>

      <h2>1. Cosa sono i Cookie</h2>
      <p>
        I cookie sono piccoli file di testo che i siti web salvano sul dispositivo dell&apos;utente
        durante la navigazione. Servono a memorizzare informazioni utili per migliorare
        l&apos;esperienza di navigazione.
      </p>

      <h2>2. Tipologie di Cookie Utilizzati</h2>

      <h3>2.1 Cookie Tecnici (Necessari)</h3>
      <p>
        Questi cookie sono essenziali per il funzionamento del sito e non possono essere
        disabilitati. Includono:
      </p>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Finalità</th>
            <th>Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>next-auth.session-token</td>
            <td>Autenticazione utente</td>
            <td>Sessione / 30 giorni</td>
          </tr>
          <tr>
            <td>next-auth.csrf-token</td>
            <td>Protezione CSRF</td>
            <td>Sessione</td>
          </tr>
          <tr>
            <td>cookie-consent</td>
            <td>Memorizza le preferenze cookie</td>
            <td>12 mesi</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2 Cookie Analitici (Previo Consenso)</h3>
      <p>
        Utilizziamo cookie analitici per comprendere come gli utenti interagiscono con il sito. I
        dati sono aggregati e anonimizzati.
      </p>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Fornitore</th>
            <th>Finalità</th>
            <th>Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga, _ga_*</td>
            <td>Google Analytics</td>
            <td>Statistiche aggregate</td>
            <td>13 mesi</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>Nota:</strong> Google Analytics è configurato con IP anonimizzato e senza
        condivisione dati con Google per scopi pubblicitari.
      </p>

      <h3>2.3 Cookie di Marketing (Previo Consenso)</h3>
      <p>
        Attualmente <strong>non utilizziamo</strong> cookie di marketing o profilazione. Se in
        futuro dovessimo introdurli, aggiorneremo questa policy e richiederemo il consenso.
      </p>

      <h2>3. Cookie di Terze Parti</h2>

      <h3>3.1 Stripe (Pagamenti)</h3>
      <p>
        Per l&apos;elaborazione dei pagamenti, Stripe può impostare cookie propri. Per maggiori
        informazioni:{' '}
        <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy Stripe
        </a>
      </p>

      <h3>3.2 Google (Autenticazione OAuth)</h3>
      <p>
        Se si utilizza &quot;Accedi con Google&quot;, Google può impostare cookie per
        l&apos;autenticazione. Per maggiori informazioni:{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy Google
        </a>
      </p>

      <h2>4. Gestione delle Preferenze</h2>
      <p>Al primo accesso al sito viene mostrato un banner per la gestione dei cookie:</p>
      <ul>
        <li>
          <strong>Accetta tutti</strong>: abilita tutti i cookie, inclusi quelli analitici
        </li>
        <li>
          <strong>Solo necessari</strong>: abilita solo i cookie tecnici essenziali
        </li>
        <li>
          <strong>Personalizza</strong>: permette di scegliere quali categorie abilitare
        </li>
      </ul>
      <p>
        È possibile modificare le preferenze in qualsiasi momento cliccando su &quot;Gestisci
        Cookie&quot; nel footer del sito.
      </p>

      <h2>5. Come Disabilitare i Cookie</h2>
      <p>Oltre al nostro banner, è possibile gestire i cookie tramite le impostazioni del browser:</p>
      <ul>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Edge
          </a>
        </li>
      </ul>
      <p>
        <strong>Attenzione:</strong> disabilitare i cookie tecnici potrebbe compromettere il
        funzionamento del sito.
      </p>

      <h2>6. Trasferimento Dati</h2>
      <p>
        Alcuni fornitori di servizi (come Google) hanno sede negli USA. Il trasferimento dati
        avviene nel rispetto delle Clausole Contrattuali Standard (SCC) approvate dalla Commissione
        Europea.
      </p>

      <h2>7. Periodo di Conservazione</h2>
      <ul>
        <li>
          <strong>Cookie di sessione:</strong> cancellati alla chiusura del browser
        </li>
        <li>
          <strong>Cookie persistenti:</strong> massimo 13 mesi (come da normativa)
        </li>
        <li>
          <strong>Preferenze cookie:</strong> 12 mesi
        </li>
      </ul>

      <h2>8. Aggiornamenti</h2>
      <p>
        Questa Cookie Policy può essere aggiornata periodicamente. La data dell&apos;ultimo
        aggiornamento è indicata in alto. In caso di modifiche sostanziali, verrà richiesto un nuovo
        consenso.
      </p>

      <h2>9. Contatti</h2>
      <p>
        Per domande sulla Cookie Policy:{' '}
        <a href="mailto:privacy@geniusmile.com">privacy@geniusmile.com</a>
      </p>

      <hr />

      <p className="text-sm text-zinc-500">
        Per maggiori informazioni sul trattamento dei dati personali, consulta la{' '}
        <a href="/privacy">Privacy Policy</a>.
      </p>
    </article>
  )
}
