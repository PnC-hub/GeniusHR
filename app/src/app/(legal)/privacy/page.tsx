import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - GeniusHR',
  description: 'Informativa sulla privacy ai sensi del GDPR Art. 13',
}

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p className="lead">
        Informativa sul trattamento dei dati personali ai sensi dell&apos;Art. 13 del Regolamento UE
        2016/679 (GDPR)
      </p>
      <p className="text-sm text-zinc-500">Ultima modifica: Gennaio 2026 - Versione 1.0</p>

      <h2>1. Titolare del Trattamento</h2>
      <p>
        Il Titolare del trattamento dei dati personali è <strong>Smiledoc S.r.l.</strong>, con sede
        in Via Monte Circeo 12, 00015 Monterotondo (RM), Italia.
      </p>
      <p>
        Email: <a href="mailto:privacy@geniusmile.com">privacy@geniusmile.com</a>
      </p>

      <h2>2. Categorie di Dati Raccolti</h2>
      <p>GeniusHR raccoglie e tratta le seguenti categorie di dati personali:</p>

      <h3>2.1 Dati di registrazione</h3>
      <ul>
        <li>Nome e cognome</li>
        <li>Indirizzo email</li>
        <li>Password (crittografata)</li>
        <li>Nome dello studio/clinica</li>
      </ul>

      <h3>2.2 Dati dei dipendenti (inseriti dagli utenti)</h3>
      <ul>
        <li>Dati anagrafici (nome, cognome, codice fiscale, data e luogo di nascita)</li>
        <li>Recapiti (email, telefono, indirizzo)</li>
        <li>Dati lavorativi (data assunzione, tipo contratto, livello CCNL, ruolo)</li>
        <li>Documenti caricati (contratti, certificati, attestati)</li>
      </ul>

      <h3>2.3 Dati di navigazione</h3>
      <ul>
        <li>Indirizzo IP</li>
        <li>Browser e sistema operativo</li>
        <li>Pagine visitate e timestamp</li>
        <li>Cookie tecnici e analitici (previo consenso)</li>
      </ul>

      <h2>3. Finalita e Base Giuridica del Trattamento</h2>

      <h3>3.1 Esecuzione del contratto (Art. 6.1.b GDPR)</h3>
      <ul>
        <li>Fornitura del servizio SaaS di gestione HR</li>
        <li>Gestione dell&apos;account utente</li>
        <li>Fatturazione e pagamenti</li>
        <li>Assistenza clienti</li>
      </ul>

      <h3>3.2 Obblighi di legge (Art. 6.1.c GDPR)</h3>
      <ul>
        <li>Adempimenti fiscali e contabili</li>
        <li>Risposta a richieste delle autorità</li>
      </ul>

      <h3>3.3 Legittimo interesse (Art. 6.1.f GDPR)</h3>
      <ul>
        <li>Sicurezza e prevenzione frodi</li>
        <li>Miglioramento del servizio</li>
        <li>Analytics aggregate (anonimizzate)</li>
      </ul>

      <h3>3.4 Consenso (Art. 6.1.a GDPR)</h3>
      <ul>
        <li>Cookie analitici e di marketing</li>
        <li>Comunicazioni promozionali</li>
      </ul>

      <h2>4. Destinatari dei Dati</h2>
      <p>I dati personali possono essere comunicati a:</p>
      <ul>
        <li>
          <strong>Stripe, Inc.</strong> - Elaborazione pagamenti (USA, Privacy Shield compliant)
        </li>
        <li>
          <strong>Aruba S.p.A. / Plesk</strong> - Hosting e infrastruttura (UE)
        </li>
        <li>
          <strong>Google LLC</strong> - Autenticazione OAuth (USA, SCC in vigore)
        </li>
      </ul>
      <p>
        Non vendiamo né cediamo a terzi i dati personali degli utenti per finalità di marketing.
      </p>

      <h2>5. Trasferimento Extra-UE</h2>
      <p>
        Alcuni dei nostri fornitori di servizi hanno sede negli Stati Uniti. Il trasferimento dei
        dati avviene sulla base di:
      </p>
      <ul>
        <li>Clausole Contrattuali Standard (SCC) approvate dalla Commissione Europea</li>
        <li>Misure supplementari di sicurezza</li>
      </ul>

      <h2>6. Periodo di Conservazione</h2>
      <ul>
        <li>
          <strong>Dati account:</strong> Per tutta la durata del rapporto contrattuale + 10 anni per
          obblighi fiscali
        </li>
        <li>
          <strong>Dati dipendenti:</strong> Secondo le retention policy configurate dal cliente
          (default: durata rapporto + 10 anni)
        </li>
        <li>
          <strong>Log di audit:</strong> 5 anni per compliance
        </li>
        <li>
          <strong>Cookie:</strong> Massimo 13 mesi
        </li>
      </ul>

      <h2>7. Diritti dell&apos;Interessato</h2>
      <p>L&apos;utente ha diritto di:</p>
      <ul>
        <li>
          <strong>Accesso</strong> - Ottenere conferma del trattamento e copia dei dati
        </li>
        <li>
          <strong>Rettifica</strong> - Correggere dati inesatti o incompleti
        </li>
        <li>
          <strong>Cancellazione</strong> - Richiedere la cancellazione dei dati (&quot;diritto
          all&apos;oblio&quot;)
        </li>
        <li>
          <strong>Limitazione</strong> - Limitare il trattamento in determinati casi
        </li>
        <li>
          <strong>Portabilità</strong> - Ricevere i dati in formato strutturato e leggibile
        </li>
        <li>
          <strong>Opposizione</strong> - Opporsi al trattamento per legittimo interesse
        </li>
        <li>
          <strong>Revoca del consenso</strong> - In qualsiasi momento, senza pregiudicare la
          liceità del trattamento precedente
        </li>
      </ul>
      <p>
        Per esercitare questi diritti, contattare:{' '}
        <a href="mailto:privacy@geniusmile.com">privacy@geniusmile.com</a>
      </p>

      <h2>8. Reclamo all&apos;Autorità di Controllo</h2>
      <p>
        L&apos;interessato ha diritto di proporre reclamo al Garante per la Protezione dei Dati
        Personali:
      </p>
      <p>
        <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
          www.garanteprivacy.it
        </a>
      </p>

      <h2>9. Sicurezza dei Dati</h2>
      <p>Adottiamo misure tecniche e organizzative per proteggere i dati:</p>
      <ul>
        <li>Crittografia TLS/SSL per i dati in transito</li>
        <li>Password hashate con bcrypt</li>
        <li>Autenticazione a due fattori disponibile</li>
        <li>Backup giornalieri crittografati</li>
        <li>Accesso basato su ruoli (RBAC)</li>
        <li>Audit log di tutte le operazioni</li>
      </ul>

      <h2>10. Modifiche alla Privacy Policy</h2>
      <p>
        Ci riserviamo di modificare questa informativa. Le modifiche sostanziali saranno comunicate
        via email e richiederanno nuova accettazione. La versione aggiornata è sempre disponibile su
        questa pagina.
      </p>

      <hr />

      <p className="text-sm text-zinc-500">
        Per qualsiasi domanda sulla privacy, contattare:{' '}
        <a href="mailto:privacy@geniusmile.com">privacy@geniusmile.com</a>
      </p>
    </article>
  )
}
