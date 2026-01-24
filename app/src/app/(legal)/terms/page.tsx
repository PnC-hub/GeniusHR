import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termini di Servizio - GeniusHR',
  description: 'Termini e condizioni di utilizzo del servizio GeniusHR',
}

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Termini di Servizio</h1>
      <p className="lead">
        Condizioni generali di utilizzo del servizio GeniusHR
      </p>
      <p className="text-sm text-zinc-500">Ultima modifica: Gennaio 2026 - Versione 1.0</p>

      <h2>1. Definizioni</h2>
      <ul>
        <li>
          <strong>&quot;Servizio&quot;</strong>: la piattaforma SaaS GeniusHR per la gestione delle
          risorse umane
        </li>
        <li>
          <strong>&quot;Fornitore&quot;</strong>: Smiledoc S.r.l., titolare del servizio GeniusHR
        </li>
        <li>
          <strong>&quot;Cliente&quot;</strong>: lo studio odontoiatrico o la clinica che sottoscrive
          il servizio
        </li>
        <li>
          <strong>&quot;Utente&quot;</strong>: qualsiasi persona fisica autorizzata dal Cliente ad
          accedere al Servizio
        </li>
        <li>
          <strong>&quot;Contenuti&quot;</strong>: tutti i dati, documenti e informazioni inseriti
          dal Cliente
        </li>
      </ul>

      <h2>2. Oggetto del Servizio</h2>
      <p>GeniusHR fornisce una piattaforma cloud per:</p>
      <ul>
        <li>Gestione anagrafica dipendenti</li>
        <li>Archiviazione documenti HR</li>
        <li>Tracciamento scadenze e adempimenti</li>
        <li>Gestione onboarding e valutazioni</li>
        <li>Reportistica HR</li>
      </ul>

      <h2>3. Registrazione e Account</h2>
      <h3>3.1 Requisiti</h3>
      <p>Per utilizzare il Servizio, il Cliente deve:</p>
      <ul>
        <li>Essere maggiorenne e avere capacità giuridica</li>
        <li>Fornire informazioni accurate e complete</li>
        <li>Mantenere aggiornati i dati di registrazione</li>
        <li>Proteggere le credenziali di accesso</li>
      </ul>

      <h3>3.2 Responsabilità</h3>
      <p>
        Il Cliente è responsabile di tutte le attività eseguite tramite il proprio account e deve
        notificare immediatamente qualsiasi accesso non autorizzato.
      </p>

      <h2>4. Piani e Pagamenti</h2>
      <h3>4.1 Piani disponibili</h3>
      <ul>
        <li>
          <strong>Starter</strong>: fino a 5 dipendenti
        </li>
        <li>
          <strong>Professional</strong>: fino a 15 dipendenti
        </li>
        <li>
          <strong>Enterprise</strong>: dipendenti illimitati
        </li>
        <li>
          <strong>Partner</strong>: white-label per consulenti
        </li>
      </ul>

      <h3>4.2 Fatturazione</h3>
      <ul>
        <li>I pagamenti sono mensili, anticipati</li>
        <li>I prezzi sono IVA esclusa</li>
        <li>Il rinnovo è automatico salvo disdetta</li>
        <li>Non sono previsti rimborsi per periodi non utilizzati</li>
      </ul>

      <h3>4.3 Periodo di prova</h3>
      <p>
        È previsto un periodo di prova gratuito di 14 giorni. Al termine, il servizio si attiva
        automaticamente se è stato inserito un metodo di pagamento valido.
      </p>

      <h2>5. Obblighi del Cliente</h2>
      <p>Il Cliente si impegna a:</p>
      <ul>
        <li>Utilizzare il Servizio nel rispetto delle leggi vigenti</li>
        <li>Non caricare contenuti illegali, diffamatori o lesivi di diritti altrui</li>
        <li>Ottenere tutti i consensi necessari per il trattamento dei dati dei dipendenti</li>
        <li>Non tentare di accedere a dati di altri clienti</li>
        <li>Non reverse-engineering o decompilare il software</li>
        <li>Non utilizzare il Servizio per scopi illegali o non autorizzati</li>
      </ul>

      <h2>6. Proprietà Intellettuale</h2>
      <h3>6.1 Contenuti del Cliente</h3>
      <p>
        Il Cliente mantiene tutti i diritti sui propri Contenuti. Concede al Fornitore una licenza
        limitata per ospitare, elaborare e visualizzare i Contenuti esclusivamente per la fornitura
        del Servizio.
      </p>

      <h3>6.2 Proprietà del Fornitore</h3>
      <p>
        Il Servizio, inclusi software, design, marchi e documentazione, sono di proprietà esclusiva
        del Fornitore. Nessun diritto viene trasferito al Cliente salvo quanto espressamente
        previsto.
      </p>

      <h2>7. Limitazioni di Responsabilità</h2>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        <h3 className="mt-0 text-amber-900 dark:text-amber-200">IMPORTANTE - DISCLAIMER</h3>
        <p className="mb-0">
          GeniusHR fornisce <strong>strumenti e template</strong> per la gestione HR. I contenuti e
          i modelli forniti hanno scopo puramente informativo e{' '}
          <strong>NON costituiscono consulenza legale, fiscale o professionale</strong>.
        </p>
        <p>
          Il Cliente è tenuto a verificare sempre con un{' '}
          <strong>consulente del lavoro, avvocato o commercialista</strong> la correttezza e
          l&apos;applicabilità di procedure, documenti e decisioni riguardanti il rapporto di
          lavoro.
        </p>
        <p className="mb-0">
          Il Fornitore <strong>declina ogni responsabilità</strong> per danni derivanti
          dall&apos;uso improprio dei template o dalla mancata consultazione di professionisti
          qualificati.
        </p>
      </div>

      <h3>7.1 Esclusioni</h3>
      <p>Il Fornitore non è responsabile per:</p>
      <ul>
        <li>Danni indiretti, incidentali o consequenziali</li>
        <li>Perdita di profitti, dati o opportunità commerciali</li>
        <li>Interruzioni del servizio causate da forza maggiore</li>
        <li>Contenuti inseriti dal Cliente</li>
        <li>Decisioni prese sulla base dei template forniti</li>
      </ul>

      <h3>7.2 Limite massimo</h3>
      <p>
        In ogni caso, la responsabilità complessiva del Fornitore non potrà eccedere l&apos;importo
        pagato dal Cliente nei 12 mesi precedenti l&apos;evento.
      </p>

      <h2>8. Disponibilità del Servizio</h2>
      <ul>
        <li>
          Il Fornitore si impegna a garantire una disponibilità del 99.5% su base annua (SLA)
        </li>
        <li>
          Sono esclusi dal calcolo: manutenzioni programmate, cause di forza maggiore, problemi di
          terze parti
        </li>
        <li>Le manutenzioni programmate saranno comunicate con almeno 24 ore di anticipo</li>
      </ul>

      <h2>9. Protezione dei Dati</h2>
      <p>
        Il trattamento dei dati personali è disciplinato dalla{' '}
        <a href="/privacy">Privacy Policy</a> e dal <a href="/dpa">DPA</a> (Data Processing
        Agreement), parte integrante del presente contratto.
      </p>

      <h2>10. Durata e Recesso</h2>
      <h3>10.1 Durata</h3>
      <p>
        Il contratto ha durata mensile e si rinnova automaticamente alla scadenza di ogni periodo.
      </p>

      <h3>10.2 Recesso</h3>
      <p>Il Cliente può recedere in qualsiasi momento:</p>
      <ul>
        <li>Il recesso ha effetto alla fine del periodo di fatturazione in corso</li>
        <li>I dati restano accessibili per 30 giorni dopo la cessazione per l&apos;export</li>
        <li>Trascorsi 30 giorni, i dati vengono cancellati definitivamente</li>
      </ul>

      <h3>10.3 Risoluzione da parte del Fornitore</h3>
      <p>Il Fornitore può sospendere o risolvere il contratto in caso di:</p>
      <ul>
        <li>Mancato pagamento dopo 15 giorni dalla scadenza</li>
        <li>Violazione grave dei presenti Termini</li>
        <li>Utilizzo fraudolento o illegale del Servizio</li>
      </ul>

      <h2>11. Modifiche ai Termini</h2>
      <p>
        Il Fornitore può modificare i presenti Termini con preavviso di 30 giorni via email. Il
        Cliente che non accetta le modifiche può recedere senza penali entro la data di entrata in
        vigore.
      </p>

      <h2>12. Legge Applicabile e Foro Competente</h2>
      <p>
        Il presente contratto è regolato dalla legge italiana. Per qualsiasi controversia è
        competente in via esclusiva il Foro di Roma.
      </p>

      <h2>13. Disposizioni Finali</h2>
      <ul>
        <li>
          L&apos;eventuale nullità di una clausola non invalida le restanti disposizioni
        </li>
        <li>
          La mancata applicazione di un diritto non costituisce rinuncia allo stesso
        </li>
        <li>I presenti Termini costituiscono l&apos;intero accordo tra le parti</li>
      </ul>

      <hr />

      <p className="text-sm text-zinc-500">
        Per domande sui Termini di Servizio: <a href="mailto:legal@geniusmile.com">legal@geniusmile.com</a>
      </p>
    </article>
  )
}
